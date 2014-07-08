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
    puts "got a message from #{current_user.handle}"

    broadcast_message event, {
      user_name: current_user.handle,
      received: Time.now.to_s(:short),
      message_body: ERB::Util.html_escape(message)
    }
  end

  def client_connected
    connection_store[:user] = { handle: current_user.handle }
    system_message :new_message, "#{connection_store[:user][:handle]} connected"
    broadcast_user_list
  end

  def new_message
    user_message :new_message, message[:message_body].dup
  end

  def delete_user
    puts "disconnected"
    # binding.pry
    system_message "#{connection_store[:user][:handle]} disconnected"
    connection_store[:user] = nil
    broadcast_user_list
  end

  def broadcast_user_list
    users = connection_store.collect_all(:user)
    puts users
    broadcast_message :user_list, users
  end
end
