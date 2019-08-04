$(function() {


  $("#livestream-chat-form").on("submit", function(e){
    e.preventDefault();

    var val = $("#livestream-chat-input").val();
    let formData = new FormData();
    formData.append('message', val);

    fetch('/send', {
      method: "post",
      body: formData
    })
    .then(function(response) {
      var data = response.json().then(function(data){
        var profile_url = data["profile_url"];
        var username = data["username"];
        var message = data["message"];

        var html = `<div class="livestream-chat-item"> <div class="livestream-chat-profile"> <img src="` + profile_url + `" /> </div> <div class="livestream-chat-text"> <div class="livestream-chat-username"> ` + username + ` </div> <div class="livestream-chat-message"> ` + message + ` </div> </div> </div>`;

        $(".livestream-chat-list").append(html);
        $(".livestream-chat-list").scrollTop($(".livestream-chat-list").prop("scrollHeight"));
      });
    });

    $("#livestream-chat-input").val("");
  }); 

});
