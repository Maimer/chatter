$(document).ready(function() {
  var dispatcher = new WebSocketRails($('#chat').data('uri'));

  var rooms = {};

  dispatcher.on_open = function(data) {
    console.log('Websocket Open');
    create_channel('General');
  };

  function message_content(data) {
    var html, label;
    if (data.user_name == "Server") {
      label = "info";
    } else {
      label = "success";
    }
    html = "<div class=\"message-text\">" + "<h4><span class=\"label label-" +
           label + "\">" + "[" + data.received + "] " + data.user_name + ":</label>" +
           "</span></h4>&nbsp;" + data.message_body + "</div>";
    $('#chat').append(html);
    $('#chat .message-text:last')[0].scrollIntoView(false);
  };

  dispatcher.bind('system_wide_message', message_content);

  function user_list_content(data) {
    var userHtml;
    userHtml = "";
    for (i = 0; i < data.length; i++) {
      userHtml = userHtml +
      ("<div class=\"user-text\"><i class=\"fa fa-user\"></i>&nbsp;<label>" +
      data[i] + "</label></div>");
    }
    $('#user-list').html(userHtml);
    $('#user-heading').html('Users (' + data.length + ')');
  };

  $('#input-message').on('submit', function(event) {
    event.preventDefault();
    var message = $('#message').val();
    var currentRoom = $('#room-list .room-text:first label')[0].innerHTML
    if (message.split(" ")[0] == "/join") {
      create_channel(message.split(" ")[1])
    } else if (message != "") {
      dispatcher.trigger('new_message', {
        channel_name: currentRoom,
        message_body: message.trim()
      });
    }
    $('#message').val('');
  });

  function create_channel(channelName) {
    rooms[channelName] = dispatcher.subscribe(channelName);
    rooms[channelName].bind('new_message', message_content);
    rooms[channelName].bind('user_list', user_list_content);
    dispatcher.trigger('new_channel_message', {
      channel_name: channelName,
      user_action: "joined"
    });

    update_channels_list();
  };

  function update_channels_list() {
    var room, channelsHtml, i;
    channelsHtml = "";
    i = 0;
    for (var key in rooms) {
      room = rooms[key]
      channelsHtml = channelsHtml +
      ("<div class=\"room-text\"><i class=\"fa fa-comments\"></i>&nbsp;<label>" +
      room.name + "</label></div>");
      i++
    }
    $('#room-list').html(channelsHtml);
    $('#room-heading').html('Rooms (' + i + ')');
  }
});
