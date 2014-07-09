$(document).ready(function() {
  var dispatcher = new WebSocketRails($('#chat').data('uri'));

  dispatcher.on_open = function(data) {
    console.log('connected');
  };

  dispatcher.bind('new_message', function(data) {
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
  });

  dispatcher.bind('user_list', function(data) {
    var user, userHtml, i;
    userHtml = "";
    for (i = 0; i < data.length; i++) {
      user = data[i];
      userHtml = userHtml +
      ("<div class=\"user-text\"><i class=\"fa fa-user\"></i>&nbsp;<label>" +
      user.handle + "</label></div>");
    }
    $('#user-list').html(userHtml);
    $('#user-heading').html('Users (' + data.length + ')');
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
