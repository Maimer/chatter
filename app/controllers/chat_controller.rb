class ChatController < WebsocketRails::BaseController
  include ActionView::Helpers::SanitizeHelper
  include ApplicationHelper

  def initialize_session
  end

  def system_wide_message(event, message)
    channels = WebsocketRails.channel_tokens.keys
    channels.each do |channel|
      WebsocketRails[channel].trigger(event, {
        user_name: 'Admin',
        received: Time.now.to_s(:short),
        message_body: message,
        channel_name: channel
      })
    end
  end

  def user_message(event, message, channel)
    WebsocketRails[channel].trigger(event, {
      user_name: current_user.handle,
      received: Time.now.to_s(:short),
      message_body: message,
      channel_name: channel
    })
  end

  def channel_message(event, channel, action)
    WebsocketRails[channel].trigger(event, {
        user_name: 'Server',
        received: Time.now.to_s(:short),
        message_body: "#{connection_store[:user][:handle]} #{action} the channel.",
        channel_name: channel
      })
  end

  def action_message(event, channel, message)
    WebsocketRails[channel].trigger(event, {
        user_name: 'HAL9000',
        received: Time.now.to_s(:short),
        message_body: message,
        channel_name: channel
      })
  end

  def broadcast_user_list(channel)
    users = []
    admins = []
    WebsocketRails[channel].subscribers.each do |conn|
      users << conn.user.handle
      if conn.user.admin
        admins << conn.user.handle
      end
    end
    WebsocketRails[channel].trigger(:user_list, {
      users: users,
      channel_name: channel,
      admins: admins
      })
  end

  def broadcast_public_channels
    all_channels = []
    WebsocketRails.channel_tokens.keys.each do |channel|
      if WebsocketRails[channel].subscribers.size > 0
        all_channels << channel
      end
    end
    broadcast_message(:public_channels, { channels: all_channels })
  end

  def client_connected
    connection_store[:user] = { handle: current_user.handle }
    connection_store[:channels] = []
  end

  def new_message
    response_body = format_message(ERB::Util.html_escape(message[:message_body]))
    if current_user.admin && response_body.start_with?('/admin')
      system_wide_message(:new_message, response_body[7..-1])
    elsif response_body.start_with?('/roll')
      roll = user_roll(response_body)
      action_message(:new_message, message[:channel_name],
                    "#{connection_store[:user][:handle]} rolled a #{roll[0]} (1-#{roll[1]})!")
    else
      user_message(:new_message, response_body, message[:channel_name])
    end
  end

  def new_channel_message
    channel_message(:new_message, message[:channel_name], message[:user_action])
    connection_store[:channels] << message[:channel_name]
    broadcast_user_list(message[:channel_name])
    broadcast_public_channels
  end

  def delete_user
    user_channels = []
    connection_store[:channels].each do |channel|
      user_channels << channel
      channel_message(:new_message, channel, "has left")
    end
    connection_store[:user] = nil
    user_channels.each do |channel|
      broadcast_user_list(channel)
    end
  end
end
