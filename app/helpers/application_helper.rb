module ApplicationHelper
  def format_message(message)
    tokens = message.split(" ")
    converted = tokens.map do |token|
      if token.start_with?("http://") || token.start_with?("https://")
        size = FastImage.size(token)
        if size != nil
          width = size[0] > 400 ? 400 : size[0]
          "<img class=\"text-top\" src=\"#{token}\" width=\"#{width}\" >"
        else
          "<a href=\"#{token}\" target=\"_blank\">#{token}</a>"
        end
      else
        token
      end
    end
    converted.join(" ")
  end
end
