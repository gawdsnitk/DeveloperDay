/**
 * Created by Kaushik on 8/25/2016.
 */
var t = TweenMax;

if(!localStorage.getItem("ddnname")) {
    window.location.pathname = "/";
}

setInterval(function() {
    $('time.timeago').timeago();
}, 1000);

var socket = io();

// fetch latest messages one time
$(document).ready(function() {
    $.get('/recent', function(data, err) {
        if(data) {
            for(var i in data) {
                appendMessage(data[data.length-i-1]);
            }
        }
    })
});


$('form').submit(function(){
    var msg = $($.parseHTML($('#m').val())).text();
    if(msg) {
        var data = {fromId: localStorage.getItem('ddkey'), name: localStorage.getItem('ddnname'), message: msg, createdAt: new Date().toISOString()};
        appendMessage(data);
        socket.emit('message', data);
        $('#m').val('');
    }
    return false;
});

socket.on('message', function(msg) {
    appendMessage(msg);
});

function appendMessage(message) {
    if(message.fromId == localStorage.getItem('ddkey')) {
        // Message sent by me
        $("#messages").append("<li class='self'><div>" + message.message +" <span class='details'><time class='timeago' datetime='"+message.createdAt+"'>just now</time></span></div></li>");
    }
    else {
        $("#messages").append("<li class='other'><div><span class='left'>"+message.name+"</span><br/>" + message.message +" <span class='details'><time class='timeago' datetime='"+message.createdAt+"'>just now</time></span></div></li>");
    }
    scrollToEnd();
}

function scrollToEnd() {
    $("div.message-box").animate({ scrollTop: $("ul#messages").height() }, 10);
}