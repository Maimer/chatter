$(document).ready(function() {
  var dispatcher = new WebSocketRails($('#chat').data('uri'));

  var rooms = {};
  var users = {};

  dispatcher.on_open = function(data) {
    console.log('Websocket Open');
    create_channel('General');
    // create_channel('Launch');
  };

  dispatcher.bind('system_wide_message', message_content);

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
    $('#' + data.channel_name).append(html);
    $('#' + data.channel_name + ' .message-text:last')[0].scrollIntoView(false);
  };

  function user_list_content(data) {
    if ($('#chatbox-header').text() == data.channel_name) {
      users[data.channel_name] = data.users;
      var userHtml;
      userHtml = "";
      for (i = 0; i < data.users.length; i++) {
        userHtml = userHtml +
        ("<div class=\"user-text\"><i class=\"fa fa-user\"></i>&nbsp;<label>" +
        data.users[i] + "</label></div>");
      }
      $('#user-list').html(userHtml);
      $('#user-heading').html('Users (' + data.users.length + ')');
    } else {
      users[data.channel_name] = data.users;
    }
  };

  $('#input-message').on('submit', function(event) {
    event.preventDefault();
    var message = $('#message').val();
    var currentRoom = $('#room-list .room-text.custom-active a').text();
    if (message.split(" ")[0] == "/join") {
      create_channel(message.split(" ")[1]);
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

    html = "<div id=\"" + channelName + "\" class=\"tab-pane\"></div>"
    $('#chat').append(html);
    $('#room-list .room-text label a[href="#' + channelName + '"]').tab('show');
    $('#chatbox-header').html(channelName);

    $('#room-list .room-text.custom-active').removeClass('custom-active');
    roomList = $('#room-list .room-text label a');
    roomDivList = $('#room-list .room-text');
    for (i = 0; i < roomList.length; i++) {
      if (roomList[i].innerHTML == channelName) {
        $(roomDivList[i]).addClass('custom-active');
      }
    }
  };

  function update_channels_list() {
    var room, channelsHtml, i;
    channelsHtml = "";
    i = 0;
    for (var key in rooms) {
      room = rooms[key];
      channelsHtml = channelsHtml +
      ("<li class=\"room-text\"><i class=\"fa fa-comments\"></i>&nbsp;<label>" +
      "<a href=\"#" + room.name + "\" role=\"tab\" data-toggle=\"tab\">" +
      room.name + "</a></label></li>");
      i++;
    }
    $('#room-list').html(channelsHtml);
    $('#room-heading').html('Rooms (' + i + ')');
  };

  $('#room-list').on('click', '.room-text', function (e) {
    e.preventDefault();
    $('#room-list .room-text.custom-active').removeClass('custom-active');
    $(this).addClass('custom-active');
    $(this).tab('show');
    channelName = $(this).find('a')[0].innerHTML;
    $('#chatbox-header').html(channelName);
    user_list_content({
      users: users[channelName],
      channel_name: channelName
    });
  });
});
