class ChatController < WebsocketRails::BaseController
  include ActionView::Helpers::SanitizeHelper

  def initialize_session

  end

  def system_wide_message(event, channel)
    broadcast_message(event, {
      user_name: 'Server',
      received: Time.now.to_s(:short),
      message_body: message
    })
  end

  def user_message(event, message, channel)
    WebsocketRails[channel].trigger(event, {
      user_name: current_user.handle,
      received: Time.now.to_s(:short),
      message_body: ERB::Util.html_escape(message)
    })
  end

  def channel_message(event, channel, action)
    WebsocketRails[channel].trigger(event, {
        user_name: 'Server',
        received: Time.now.to_s(:short),
        message_body: "#{connection_store[:user][:handle]} #{action} the channel."
      })
  end

  def client_connected
    connection_store[:user] = { handle: current_user.handle }
    connection_store[:channels] = []
  end

  def new_message
    user_message(:new_message, message[:message_body].dup, message[:channel_name].dup)
  end

  def new_channel_message
    channel_message(:new_message, message[:channel_name].dup, message[:user_action].dup)
    connection_store[:channels] << message[:channel_name]
    broadcast_user_list
  end

  def delete_user
    binding.pry
    user_channels = []
    connection_store[:channels].each do |channel|
      user_channels << channel
    end
    channel_message(:new_message, channel, "has left")
    connection_store[:user] = nil
    user_channels.each do |channel|
      broadcast_user_list(channel)
    end
  end

  def broadcast_user_list(channel)
    users = []
    WebsocketRails[channel].subscribers.each do |conn|
      users << conn.user.handle
    end
    WebsocketRails[channel].trigger(:user_list, users)
    # users = connection_store.collect_all(:user)
    # broadcast_message(:user_list, users)
  end
end
