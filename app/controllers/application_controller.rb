class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :configure_permitted_parameters, if: :devise_controller?

  helper_method :format_message

  def format_message(message)
    message = message.split
    message.each do |word|
      if word.start_with?("http://")
        size = FastImage.size(word)
        if size != nil
          if size[0] > 400
            size[0] = 400
            word = "<img src=\"" + word + "\" width=\"" + size[0] + "\" >"
          end
        else
          word = "<a href=\"" + word + "\">" + word + "</a>"
        end
      end
    end
    message.join(" ")
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << [:handle]

    devise_parameter_sanitizer.for(:account_update) { |u|
      u.permit(:handle, :email, :password, :password_confirmation, :current_password)
    }
  end
end
