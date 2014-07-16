module ApplicationHelper
  def format_message(message)
    tokens = message.split(" ")
    converted = tokens.map do |token|
      if token.start_with?("http://") || token.start_with?("https://")
        size = FastImage.size(token)
        if size != nil
          width = size[0] > 400 ? 400 : size[0]
          "<p><img class=\"user-image\" src=\"#{token}\" width=\"#{width}\" ></p>"
        else
          "<a href=\"#{token}\" target=\"_blank\">#{token}</a>"
        end
      else
        token
      end
    end
    converted.join(" ")
  end

  def user_roll(message, range = 10)
    tokens = message.split(" ")
    if tokens.size > 1 && tokens[1].to_i > 1
      range = tokens[1].to_i
    end
    [rand(range) + 1, range]
  end
end

module EmojiHelper
  def emojify(content)
    content.to_str.gsub(/:([\w+-]+):/) do |match|
      if Emoji.names.include?($1)
        "<img alt=\"#{$1}\" src=\"/images/emoji/#{$1}.png\" style=\"vertical-align:middle\" width=\"20\" height=\"20\""
      else
        match
      end
    end.html_safe if content.present?
  end
end
