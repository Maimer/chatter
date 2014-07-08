$(document).ready(function() {
  var dispatcher = new WebSocketRails($('#chat').data('uri'));

  dispatcher.on_open = function(data) {
    console.log('connected');
  };

  dispatcher.bind('new_message', function(data) {
    var html;
    html = "<div class=\"message-text\"><label>[" +
           data.received + "] " + data.user_name + ":&nbsp;</label>" +
           data.message_body + "</div>";
    $('#chat').append(html);
    // $('#chat .message-text:last').scrollIntoView(false);
  });

  dispatcher.bind('user_list', function(data) {
    var user, userHtml, i;
    userHtml = "";
    for (i = 0; i < data.length; i++) {
      user = data[i];
      userHtml = userHtml +
      ("<div class=\"user-text\"><label>" +
      user.handle + "</label></div>");
    }
    $('#user-list').html(userHtml);
  });

  $('#input-message').on('submit', function(event) {
    event.preventDefault();
    var message = $('#message').val();
    if (message != "") {
      dispatcher.trigger('new_message', {
        message_body: message
      });
    }
    $('#message').val('');
  });
});


// var _bind = function(fn, me){
//   return function(){
//     return fn.apply(me, arguments);
//   };
// };

// jQuery(function() {
//   return window.chatController = new Chat.Controller($('#chat').data('uri'), true);
// });

// window.Chat = {};

// Chat.User = (function() {
//   function User(user_name) {
//     this.user_name = user_name;
//     this.serialize = _bind(this.serialize, this);
//   }

//   User.prototype.serialize = function() {
//     return {
//       user_name: this.user_name
//     };
//   };

//   return User;

// })();

// Chat.Controller = (function() {
//   Controller.prototype.template = function(message) {
//     var html;
//     html = "<div class=\"message\"><label class=\"...\">[" +
//            message.received + "] " + message.user_name + ":&nbsp;</label>" +
//            message.message_body + "</div>";
//     return $(html);
//   };

//   Controller.prototype.userListTemplate = function(userList) {
//     var user, userHtml, i, len;
//     userHtml = "";
//     for (i = 0, len = userList.length; i < len; i++) {
//       user = userList[i];
//       userHtml = userHtml + ("<li>" + user.user_name + "</li>");
//     }
//     return $(userHtml);
//   };

//   function Controller(url, useWebSockets) {
//     debugger;
//     this.createGuestUser = function() {
//       return this.createGuestUser.apply(this, arguments);
//     };

//     // _bind(this.createGuestUser, this);
//     this.shiftMessageQueue = _bind(this.shiftMessageQueue, this);
//     this.updateUserInfo = _bind(this.updateUserInfo, this);
//     this.updateUserList = _bind(this.updateUserList, this);
//     this.sendMessage = _bind(this.sendMessage, this);
//     this.newMessage = _bind(this.newMessage, this);
//     this.bindEvents = _bind(this.bindEvents, this);
//     this.messageQueue = [];
//     this.dispatcher = new WebSocketRails(url, useWebSockets);
//     this.dispatcher.on_open = this.createGuestUser;
//     this.bindEvents();
//   }

//   Controller.prototype.bindEvents = function() {
//     this.dispatcher.bind('new_message', this.newMessage);
//     this.dispatcher.bind('user_list', this.updateUserList);
//     $('input#user_name').on('focusout', this.updateUserInfo);
//     $('#send').on('click', this.sendMessage);
//   };

//   Controller.prototype.newMessage = function(message) {
//     this.messageQueue.push(message);
//     if (this.messageQueue.length > 15) {
//       this.shiftMessageQueue();
//     }
//     return this.appendMessage(message);
//   };

//   Controller.prototype.sendMessage = function(event) {
//     var message;
//     event.preventDefault();
//     message = $('#message').val();
//     this.dispatcher.trigger('new_message', {
//       user_name: this.user.user_name,
//       message_body: message
//     });
//     return $('#message').val('');
//   };

//   Controller.prototype.appendMessage = function(message) {
//     var messageTemplate;
//     messageTemplate = this.template(message);
//     $('#chat').append(messageTemplate);
//     return messageTemplate.slideDown(140);
//   };

//   Controller.prototype.shiftMessageQueue = function() {
//     this.messageQueue.shift();
//     return $('#chat div.messages:first').slideDown(100, function() {
//       return $(this).remove();
//     });
//   };

//   Controller.prototype.updateUserList = function(userList) {
//     return $('#user-list').html(this.userListTemplate(userList));
//   };

//   Controller.prototype.updateUserInfo = function(event) {
//     this.user.user_name = $('input#user_name').val();
//     $('#username').html(this.user.user_name);
//     return this.dispatcher.trigger('change_username', this.user.serialize());
//   };

//   Controller.prototype.createGuestUser = function() {
//     var rand_num;
//     rand_num = Math.floor(Math.random() * 1000);
//     this.user = new Chat.User("Chatter_" + rand_num);
//     $('input#user_name').val(this.user.user_name);
//     return this.dispatcher.trigger('new_user', this.user.serialize());
//   };

//   return Controller;

// })();
