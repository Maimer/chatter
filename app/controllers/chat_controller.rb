class ChatController < WebsocketRails::BaseController
  include ActionView::Helpers::SanitizeHelper

  def initialize_session
    puts "Session Initialized\n"
  end

  def system_message(event, message)
    broadcast_message event, {
      user_name: 'Server',
      received: Time.now.to_s(:short),
      message_body: message
    }
  end

  def user_message(event, message)
    broadcast_message evevt, {
      user_name:  connection_store[:user][:user_name],
      received:   Time.now.to_s(:short),
      message_body:   ERB::Util.html_escape(message)
      }
  end

  def client_connected
    system_message :new_message, "client #{client_id} connected"
  end

  def new_message
    user_message :new_message, message[:message_body].dup
  end

  def new_user
    connection_store[:user] = { user_name: sanitize(message[:user_name]) }
    broadcast_user_list
  end

  def change_username
    connection_store[:user][:user_name] = sanitize(message[:user_name])
    broadcast_user_list
  end

  def delete_user
    connection_store[:user] = nil
    system_msg "client #{client_id} disconnected"
    broadcast_user_list
  end

  def broadcast_user_list
    users = connection_store.collect_all(:user)
    broadcast_message :user_list, users
  end

end
