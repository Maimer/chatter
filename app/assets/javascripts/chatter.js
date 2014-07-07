var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

jQuery(function() {
  return window.chatController = new Chat.Controller($('#chat').data('uri'), true);
});

window.Chat = {};

Chat.User = (function() {
  function User(user_name) {
    this.user_name = user_name;
    this.serialize = __bind(this.serialize, this);
  }

  User.prototype.serialize = function() {
    return {
      user_name: this.user_name
    };
  };

  return User;

})();

Chat.Controller = (function() {
  Controller.prototype.template = function(message) {
    var html;
    html = "<div class=\"message\" >\n  <label class=\"label label-info\">\n    [" + message.received + "] " + message.user_name + "\n  </label>&nbsp;\n  " + message.msg_body + "\n</div>";
    return $(html);
  };

  Controller.prototype.userListTemplate = function(userList) {
    var user, userHtml, _i, _len;
    userHtml = "";
    for (_i = 0, _len = userList.length; _i < _len; _i++) {
      user = userList[_i];
      userHtml = userHtml + ("<li>" + user.user_name + "</li>");
    }
    return $(userHtml);
  };

  function Controller(url, useWebSockets) {
    this.createGuestUser = __bind(this.createGuestUser, this);
    this.shiftMessageQueue = __bind(this.shiftMessageQueue, this);
    this.updateUserInfo = __bind(this.updateUserInfo, this);
    this.updateUserList = __bind(this.updateUserList, this);
    this.sendMessage = __bind(this.sendMessage, this);
    this.newMessage = __bind(this.newMessage, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.messageQueue = [];
    this.dispatcher = new WebSocketRails(url, useWebSockets);
    this.dispatcher.on_open = this.createGuestUser;
    this.bindEvents();
  }

  Controller.prototype.bindEvents = function() {
    this.dispatcher.bind('new_message', this.newMessage);
    this.dispatcher.bind('user_list', this.updateUserList);
    $('input#user_name').on('keyup', this.updateUserInfo);
    $('#send').on('click', this.sendMessage);
    return $('#message').keypress(function(e) {
      if (e.keyCode === 13) {
        return $('#send').click();
      }
    });
  };

  Controller.prototype.newMessage = function(message) {
    this.messageQueue.push(message);
    if (this.messageQueue.length > 15) {
      this.shiftMessageQueue();
    }
    return this.appendMessage(message);
  };

  Controller.prototype.sendMessage = function(event) {
    var message;
    event.preventDefault();
    message = $('#message').val();
    this.dispatcher.trigger('new_message', {
      user_name: this.user.user_name,
      msg_body: message
    });
    return $('#message').val('');
  };

  Controller.prototype.updateUserList = function(userList) {
    return $('#user-list').html(this.userListTemplate(userList));
  };

  Controller.prototype.updateUserInfo = function(event) {
    this.user.user_name = $('input#user_name').val();
    $('#username').html(this.user.user_name);
    return this.dispatcher.trigger('change_username', this.user.serialize());
  };

  Controller.prototype.appendMessage = function(message) {
    var messageTemplate;
    messageTemplate = this.template(message);
    $('#chat').append(messageTemplate);
    return messageTemplate.slideDown(140);
  };

  Controller.prototype.shiftMessageQueue = function() {
    this.messageQueue.shift();
    return $('#chat div.messages:first').slideDown(100, function() {
      return $(this).remove();
    });
  };

  Controller.prototype.createGuestUser = function() {
    var rand_num;
    rand_num = Math.floor(Math.random() * 1000);
    this.user = new Chat.User("Guest_" + rand_num);
    $('#username').html(this.user.user_name);
    $('input#user_name').val(this.user.user_name);
    return this.dispatcher.trigger('new_user', this.user.serialize());
  };

  return Controller;

})();
