function Room(chat, name) {
  this.chat = chat;
  this.name = name;
  this.$element = $('<div>').attr({id: this.name, class: 'tab-pane'});
  this.channel = this.chat.dispatcher.subscribe(this.name);

  this.channel.bind('new_message', this.addMessage);
  // this.channel.bind('user_list', user_list_content);
  $('#chat').append(this.render());
}

Room.prototype.render = function() {
  return this.$element;
}

Room.prototype.newMessageReceived = function(data) {
}

Room.prototype.addMessage = function(data) {
  var html, label;

  if (data.user_name == "Server") {
    label = "info";
  } else if (data.user_name == "Admin") {
    label = "danger";
  } else {
    label = "success";
  }

  var html = "<div class=\"message-text\">" + "<h4><span class=\"label label-" +
      label + "\">" + "[" + data.received + "] " + data.user_name + ":</label>" +
      "</span></h4>&nbsp;" + data.message_body + "</div>";

  $('#' + data.channel_name).append(html);
  // $('#' + data.channel_name + ' .message-text span:last')[0].scrollIntoView(true);
}
