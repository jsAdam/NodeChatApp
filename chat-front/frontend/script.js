////
////    gapi.load("auth2", function(){
////        gapi.auth2.init();
////    })
//$(function(){
//    // Initializes and creates emoji set from sprite sheet
//    window.emojiPicker = new EmojiPicker({
//    emojiable_selector: '[data-emojiable=true]',
//    assetsPath: 'lib/img/',
//    popupButtonClasses: 'fa fa-smile-o'
//    });
//    // Finds all elements with emojiable_selector and converts them to rich emoji input fields
//    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
//    // It can be called as many times as necessary; previously converted input fields will not be converted again
//    window.emojiPicker.discover();
//});

$(document).ready(function(){
    $("#logged-area").css('display', "none");
    let id = 0;
    let user_name = "";
    let started = false;
    let currentChat= [];
    
    $("#login-form").on("submit", function(e){
        e.preventDefault();
        
        const name = $("#login-name").val();
        const specialWord = $("#login-word").val();
        
        $.post("http://192.168.0.13:3000/users", { name, specialWord }).then(function(data){
            if(data.message == "User Created") {
                alert(data.message);
            }
            console.log(data);
            
            if(data.message == "Logged In!" || data.message == "User Created"){
                started = true;
                $("#logged-area").css("display", "block");
                $("#mid-area").css("display", "none");
                id = data.id;
                user_name = data.name;
                $.getJSON("http://192.168.0.13:3000/users/chat").then(function(data){
                    for(let chat of data){
                        if(chat.user_name == user_name){
                            var chatBox = $("<div>").addClass("log-user-chat").attr("data-id", chat.id);
                        } else {
                            var chatBox = $("<div>").addClass("chat").attr("data-id", chat.id);
                        }
                        let content = $("<p>").text(chat.content);
                        let chatUser = $("<h5>").text(` - ${chat.user_name} - `);
                        
                        chatBox.append(content);
                        chatBox.append(chatUser);
                        $("#chats").append(chatBox);
                        console.log(chatBox.attr("data-id"));
                        currentChat.push(chat.id);
                    }
                    console.log(data);
                });
            }
        }).catch(function(err){
            console.log(err); 
        });;
    })
    
    $("#send").on("click", function(e){
        e.preventDefault();
        
        const content = $("#chat-form-input").val();
        
        $.post("http://192.168.0.13:3000/users/chat", { id, content, user_name }).then(function(data){
            console.log(data);
            if(data.message == "Chat created"){
                var chatBox = $("<div>").addClass("log-user-chat").attr("data-id", data.id);
                let chatContent = $("<p>").text(content);
                let chatUser = $("<h5>").text(` - ${user_name} - `);

                chatBox.append(chatContent);
                chatBox.append(chatUser);
                $("#chats").append(chatBox);
                currentChat.push(data.id);
                $("#chat-form")[0].reset();
                
                let length = $("#chats").children().length;
                $("#chats").children().eq(length-2).css("margin-bottom", "7px");
                $("#chats").children().eq(length-1).css("margin-bottom", "100px");
            } 
        });
    });
    
    setInterval(function(){
        console.log("WORKING");
        if(started){
            $.getJSON("http://192.168.0.13:3000/users/chat").then(function(data){
                for(let chat of data){
                    if(!currentChat.includes(chat.id)){
                        if(chat.user_name == user_name){
                            var chatBox = $("<div>").addClass("log-user-chat").attr("data-id", chat.id);
                        } else {
                            var chatBox = $("<div>").addClass("chat").attr("data-id", chat.id);
                        }
                        let content = $("<p>").text(chat.content);
                        let chatUser = $("<h5>").text(` - ${chat.user_name} - `);

                        chatBox.append(content);
                        chatBox.append(chatUser);
                        $("#chats").append(chatBox);
                        console.log(chatBox.attr("data-id"));
                        currentChat.push(chat.id);
                    }
                }
                let length = $("#chats").children().length;
                $("#chats").children().eq(length-2).css("margin-bottom", "7px");
                $("#chats").children().eq(length-1).css("margin-bottom", "100px");
            });
        }
    }, 5000);
});