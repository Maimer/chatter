#CHATTER

Created by [Nicholas Lee](https://www.linkedin.com/in/nicky)

Chatter is a real-time chat room application built in Rails 4 and Ruby 2.  The application communication channels are implemented through the use of WebSockets, which allow for a full-duplex single socket connection over which messages can be sent between client and server.  Users are authenticated through the use of Devise and the application allows for user created public and private channels as well as other features including inline images, admin commands, and markdown support.

==========

####Gems

[WebSocket-Rails](https://github.com/websocket-rails): Used to create the websocket server through the use of event machine and to process all incoming and outgoing websocket connections.

[FastImage](https://github.com/sdsykes/fastimage): Used to find the size of an image that is not stored locally in order to dynmically generate HTML image tags.

[RedCarpet](https://github.com/vmg/redcarpet): Used to parse any markdown that is posted through incoming user messages.

[Devise](https://github.com/plataformatec/devise): Used as the user authenication layer for the application.

==========

####Chat Commands

/join <channel> (Creates or Joins a new channel)

/leave <channel> (Leaves an existing channel)

/channels (Lists all current public channels with users)

/admin <text> (Sends the text to all channels as an Admin message)

/roll <number> (Produces a random number between 1 and give number)

==========

####Chatter Images:
