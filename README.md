# CHATTER

Created by [Nicholas Lee](https://www.linkedin.com/in/nicky)

Website: [http://sockets-chat.herokuapp.com](http://sockets-chat.herokuapp.com)

Chatter is a real-time chat room application built in Rails 4 and Ruby 2.  The application communication channels are implemented through the use of WebSockets, which allow for a full-duplex single socket connection over which messages can be sent between client and server.  Users are authenticated through the use of Devise and the application allows for user created public and private channels as well as other features including inline images, admin commands, emojis, and markdown support.

## Gems

[WebSocket-Rails](https://github.com/websocket-rails): Used to create the websocket server through the use of event machine and to process all incoming and outgoing websocket connections.

[FastImage](https://github.com/sdsykes/fastimage): Used to find the size of an image that is not stored locally in order to dynamically generate HTML image tags.

[RedCarpet](https://github.com/vmg/redcarpet): Used to parse any markdown that is posted through incoming user messages.

[Gemoji](https://github.com/github/gemoji): Used to provide emoji support in chat.

[Devise](https://github.com/plataformatec/devise): Used as the user authentication layer for the application.

## Chat Commands

/help (Lists all possible chat commands)

/join \<channel\> (Creates or joins a new channel)

/leave \<channel\> (Leaves an existing channel)

/channels (Lists all current public channels with users)

/admin \<text\> (Sends the text to all channels as an Admin message)

/roll \<number\> (Produces a random number between 1 and give number)

## Chatter Images:

![Example 1](https://raw.githubusercontent.com/Maimer/chatter/master/screenshots/chatter2.png)

![Example 2](https://raw.githubusercontent.com/Maimer/chatter/master/screenshots/chatter1.png)
