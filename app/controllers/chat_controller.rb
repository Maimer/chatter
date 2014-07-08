class ChatController < WebsocketRails::BaseController
  include ActionView::Helpers::SanitizeHelper

  def initialize_session

  end

  def system_message(event, message)
    broadcast_message event, {
      user_name: 'Server',
      received: Time.now.to_s(:short),
      message_body: message
    }
  end

  def user_message(event, message)
    puts "received a user message: #{message}"
    binding.pry
    broadcast_message event, {
      # user_name: connection_store[:user][:user_name],
      # received: Time.now.to_s(:short),
      message_body: ERB::Util.html_escape(message)
    }
  end

  def client_connected
    puts "hello"
  end

  def new_message
    user_message :new_message, message[:message_body].dup
  end

  def new_user
    connection_store[:user] = { user_name: sanitize(message[:user_name]) }
    system_message :new_message, "#{connection_store[:user][:user_name]} connected"
    broadcast_user_list
  end

  def change_username
    old_user_name = connection_store[:user][:user_name]
    connection_store[:user][:user_name] = sanitize(message[:user_name])
    system_message :new_message, "#{old_user_name} is now known as #{connection_store[:user][:user_name]}"
    broadcast_user_list
  end

  def delete_user
    system_msg "#{connection_store[:user][:user_name]} disconnected"
    connection_store[:user] = nil
    broadcast_user_list
  end

  def broadcast_user_list
    users = connection_store.collect_all(:user)
    broadcast_message :user_list, users
  end
end
