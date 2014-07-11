function Chat(dispatcher) {
  this.dispatcher = new WebSocketRails($('#chat').data('uri'));
  this.rooms = {};
  this.users = {};
  this.header = 'Not in a room';
  this.currentRoom = null;

  this.$element = $('#chat');

  this.dispatcher.on_open = function(data) {
    console.log('Websocket Open');
  };
  debugger;
}

Chat.prototype.render = function() {
  this.updateRoomList();
}

Chat.prototype.updateRoomList = function() {
  var $roomList = $('#room-list');
  $roomList.html('');

  var _this = this;
  $.each(this.rooms, function(index, room) {
    var $roomListItem = _this.buildRoomListItem(room);
    $roomList.append($roomListItem);
  });

  $('#room-heading').html('Rooms (' + $('.room-list li').length + ')');
  $('#room-list .room-text label a[href="#' + this.currentRoom.name + '"]').tab('show');
  $('#chatbox-header').html(this.currentRoom.name);

  $('#room-list .room-text.custom-active').removeClass('custom-active');
  var roomList = $('#room-list .room-text label a');
  var roomDivList = $('#room-list .room-text');

  for (i = 0; i < roomList.length; i++) {
    if (roomList[i].innerHTML == this.currentRoom.name) {
      $(roomDivList[i]).addClass('custom-active');
    }
  }
}

Chat.prototype.buildRoomListItem = function(room) {
  var $itemContainer = $('<li>').addClass('room-text');
  var $icon = $('<i>').addClass('fa fa-comments');
  var $label = $('<label>');
  var $link = $('<a>').text(room.name).attr({
    'href': '#' + room.name,
    'id': room.name,
    'role': 'tab',
    'data-toggle': 'tab'
  });

  $label.append($link);
  $itemContainer.append($icon).append('&nbsp;').append($label);

  return $itemContainer;
}

Chat.prototype.createRoom = function(name) {
  var room = new Room(this, name);
  this.rooms[room.name] = room;

  this.dispatcher.trigger('new_channel_message', {
    channel_name: name,
    user_action: "joined"
  });

  return room;

  // this needs to be added
  // update_channels_list();
}

Chat.prototype.addMessage = function(message) {
  this.currentRoom.addMessage(message);

  if (message.split(" ")[0] == "/join") {
    // create_channel(message.split(" ")[1]);
  } else if (message.length > 0) {
    this.dispatcher.trigger('new_message', {
      channel_name: this.currentRoom.name,
      message_body: message.trim()
    });
  }
}
