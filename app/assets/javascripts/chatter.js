$(document).ready(function() {
  var dispatcher = new WebSocketRails($('#chat').data('uri'));

  var rooms = {};
  var users = {};
  var admins = {};
  var messages = {};

  dispatcher.on_open = function(data) {
    console.log('Websocket Open');
    create_channel('General');
    create_channel('Launch');
  };

  dispatcher.bind('system_wide_message', message_content);

  function message_content(data) {
    var html, label;
    if (data.user_name == "Server") {
      label = "info";
    } else if (data.user_name == "Admin") {
      label = "danger";
    } else {
      label = "success";
    }
    html = "<div class=\"message-text\">" + "<h4><span class=\"label label-" +
           label + "\">" + "[" + data.received + "] " + data.user_name + ":</label>" +
           "</span></h4>&nbsp;" + data.message_body + "</div>";
    $('#' + data.channel_name).append(html);
    $('#' + data.channel_name + ' .message-text span:last')[0].scrollIntoView(true);
    if (data.channel_name == $('#chatbox-header').text()) {
      messages[data.channel_name] = 0;
      $("li:contains("+data.channel_name+") span").html("");
    } else {
      messages[data.channel_name]++;
      $("li:contains("+data.channel_name+") span").html(messages[data.channel_name]);
    }
  };

  function user_list_content(data) {
    if ($('#chatbox-header').text() == data.channel_name) {
      users[data.channel_name] = data.users;
      admins[data.channel_name] = data.admins;
      var userHtml, icon;
      userHtml = "";
      for (i = 0; i < data.users.length; i++) {
        icon = 'user';
        if (data.admins.indexOf(data.users[i]) > -1) {
          icon = 'gavel';
        }
        userHtml = userHtml +
        ("<div class=\"user-text\"><i class=\"fa fa-" + icon + "\"></i>&nbsp;<label>" +
        data.users[i] + "</label></div>");
      }
      $('#user-list').html(userHtml);
      $('#user-heading').html('Users (' + data.users.length + ')');
    } else {
      users[data.channel_name] = data.users;
      admins[data.channel_name] = data.admins;
    }
  };

  $('#input-message').on('submit', function(e) {
    e.preventDefault();
    var message = $('#message').val();
    var currentRoom = $('#room-list .room-text.custom-active a').text();
    if (message.split(" ")[0] == "/join") {
      create_channel(message.split(" ")[1]);
    } else if (message != "") {
      dispatcher.trigger('new_message', {
        channel_name: currentRoom,
        message_body: message.trim()
      });
      chatter_image();
    }
    $('#message').val('');
  });

  function chatter_image() {
    $('.menu-image').attr('src', '/assets/chatter2.png');
    setTimeout(function() {
      $('.menu-image').attr('src', '/assets/chatter.png')
    }, 175);
  };

  function create_channel(channelName) {
    rooms[channelName] = dispatcher.subscribe(channelName);
    rooms[channelName].bind('new_message', message_content);
    rooms[channelName].bind('user_list', user_list_content);
    dispatcher.trigger('new_channel_message', {
      channel_name: channelName,
      user_action: "joined"
    });

    messages[channelName] = 0;

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
    var channelsHtml, i, indicator;
    channelsHtml = "";
    indicator = "<span class=\"badge pull-right\"></span>";
    i = 0;
    for (var room in rooms) {
      channelsHtml = channelsHtml +
      ("<li class=\"room-text\"><i class=\"fa fa-comments\"></i>&nbsp;<label>" +
      "<a href=\"#" + room + "\" role=\"tab\" data-toggle=\"tab\">" +
      room + "</a></label>" + indicator + "</li>");
      i++;
    }
    $('#room-list').html(channelsHtml);
    for (var room in rooms) {
      if (messages[room] == 0) {
        $("li:contains("+room+") span").html("");
      } else {
        $("li:contains("+room+") span").html(messages[room]);
      }
    }
    $('#room-heading').html('Rooms (' + i + ')');
  };

  $('#room-list').on('click', '.room-text', function (e) {
    e.preventDefault();
    $('#room-list .room-text.custom-active').removeClass('custom-active');
    $(this).addClass('custom-active');
    var tabLink = $(this).find('a')[0]
    var channelName = tabLink.innerHTML;
    tabLink.click();
    $('#chatbox-header').html(channelName);
    user_list_content({
      users: users[channelName],
      channel_name: channelName,
      admins: admins[channelName]
    });
    $("li:contains("+channelName+") span").html("");
    $(this).tab('show').on('shown.bs.tab', function() {
      $('#' + channelName + ' .message-text h4:last')[0].scrollIntoView(true);
    });
  });
});
