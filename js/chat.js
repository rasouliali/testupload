"use strict";
var delayRetry = [10, 2000, 10000, 30000, 60000];
var myDelayRetryIndex = 0;
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub")
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
                // If we've been reconnecting for less than 60 seconds so far,
                // wait between 0 and 10 seconds before the next reconnect attempt.
            if (myDelayRetryIndex > 3) myDelayRetryIndex = 4;
                return delayRetry[myDelayRetryIndex++];
        }
    })
    .build();
var firstCall = true;
//Disable send button until connection is established

connection.on("Receive" + userid + "Message", function (user, message) {
    var senderid = message.split(';;;')[1];
    if (message.startsWith('delmess;,;')) {
        if ($('.contact[data-id=' + senderid + ']').hasClass("active")) {
            var messId = message.replace('delmess;,;', '').split(';;;')[0];
            $('.messages li[data-id=' + messId + ']').remove();
        }
        return;
    }
    var currentnewmesscount = $('.contact[data-id=' + senderid + '] .text-bg-success').html();
    if (currentnewmesscount == undefined) {
        appendNewContactById(senderid);
        return;
    }
    if (currentnewmesscount) {
        var newmesscount = parseInt(currentnewmesscount.replace(" ", "").replace("(", "").replace(")", ""))
        newmesscount++;
        $('.contact[data-id=' + senderid + '] .text-bg-success').html(newmesscount);
    } else {
        $('.contact[data-id=' + senderid + '] .text-bg-success').html("1");
    }
    try {
        var id = message.split(';;;')[3];
        JSBridge.setNotification("you have new message", id);
    } catch { }
    if ($('.contact[data-id=' + senderid + ']').hasClass("active")) {
        var createdDate = message.split(';;;')[0];
        var body = message.split(';;;')[2];
        var id = message.split(';;;')[3];
        var replyId = message.split(';;;')[4];
        var strLi = "";
        if (createdDate == "isfile") {

            var resArr = body.split(',;,')[0].split(';');
            var replyOrForwardHeader = "";
            if (body.split(',;,').length > 1)
                replyOrForwardHeader=body.split(',;,')[1]
            for (var j = 0; j < resArr.length; j++) {
                strLi += `<li class="from-other" data-id="` + id + `" >`;
                    //<img src="`+ $('.contact.active img').attr('src') + `" alt="" />`;
                if (replyOrForwardHeader)//begin header of reply card
                    strLi += `<div class="card" data-id="` + (replyId ? replyId : "") + `" >
                      <div class="card-header">` +
                        replyOrForwardHeader +
                        `</div>`;
                if (IsImage(resArr[j]))
                    strLi += `<label><a href="/uploads/` + resArr[j] + `" target="_blank"><img  class="fupload" src="/uploads/thumbnails/` + resArr[j] + `" /></a></label>`;

                else
                    strLi += `<label><a href="/uploads/` + resArr[j] + `" target="_blank" >file(` + resArr[j] + `)</a></label>`;

                if (replyOrForwardHeader)//end header of reply card
                    strLi += `</div>`;
                strLi += `</li><li  class="from-other"><div class="date">` + getNiceDateTimeFormat(createdDate) + `</div></li>`;
            }
        } else {
                //<img src="` + $('.contact.active img').attr('src') + `" alt="" />` +
            strLi += `<li class="from-other"  data-id="` + id +`" >`+
                (body.indexOf(',;,') >= 0 ?
                `<div class="card" data-id="` + (replyId ? replyId : "") + `" >
                      <div class="card-header">` +
                        body.split(',;,')[0] +
                `</div><label>`+ body.split(',;,')[1] +
                    `</label></div>` :
                `<label>` + body + `</label>`) +
                `</li><li  class="from-other"><div class="date">` + getNiceDateTimeFormat(createdDate) + `</div></li>`;
        }
        $('.chat-pm-input textarea').val('')
        $('#lastchat').before(strLi);
        //$('.messages li:not(.cl)').on('click', function () {
        //    if ($(this).find('span').length == 0)
        //        $(this).append("<span>" + getNiceDateTimeFormat($(this).data('time')) + "</span>");
        //});
        //$('.messages li:not(.cl)').addClass('cl');
        //$('.messages').scrollTop($('#lastchat').offset().top);
        setTimeout(function () {
            $('.chat-pm ul').scrollTop($('.chat-pm ul')[0].scrollHeight);

        }, 500);
        $.post('/Home/SeenMessege', { contactId: senderid }, function () { });
        allDropDownButtonProcess();
    }
    //var li = document.createElement("li");
    //document.getElementById("messagesList").appendChild(li);
    //// We can assign user-supplied strings to an element's textContent because it
    //// is not interpreted as markup. If you're assigning in any other way, you 
    //// should be aware of possible script injection concerns.
    //li.textContent = `${user} says ${message}`;
});
function appendNewContactById(userid) {
    $.post('/Home/GetAccounts', { searchKey: userid }, function (dataItem) {
        //$('.def-mess').hide();
        if (dataItem.length == 0) {
            return;
        }
        for (var i = 0; i < dataItem.length; i++) {

            var statusStr = "online";
            statusStr = dataItem[i].status == 1 ? "away" : dataItem[i].status == 2 ? "busy" : dataItem[i].status == 3 ? "offline" : statusStr;

            var str = `<li class="contact new-def-mess"  data-id="` + dataItem[i].userId + `">
                        <div class="wrap">
                            <span class="contact-status `+ statusStr + `"></span>` +
                (dataItem[i].profilePic ? '<img src="/ProfilePics/' + dataItem[i].profilePic + '" alt="" />' : '<img src="/user-profile.png" alt="" />') +
                `<div class="meta">
                                <p class="name">`+ dataItem[i].userName + `<span>(1)</span></p>
                                <p class="preview"></p>
                            </div>
                        </div>
                    </li>`;
            $('#contacts ul').append(str);
            $('.new-def-mess').on('click', function () {
                $('.contact').removeClass('new-def-mess');
                $('.contact').removeClass('active');
                $(this).addClass('active');
                var contactId = $(this).data('id');
                var userid = $(this).data('id');
                $.post('/Home/GetContactMessage', { page: 'end', contactId: contactId }, function (res) {
                    $('.loading').hide();
                    if (res == null || res.length == 0)
                        SetEmptyMessage();
                    else
                        SetResultOfMessage(res);

                });
            });

            $('.new-def-mess').addClass('def-mess').removeClass('new-def-mess');
        }
    });
}
connection.start().then(function () {
    //document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.log(err.toString());
});

function sendBySignalR(userid,mess) {
    connection.invoke("SendMessage", userid, mess).catch(function (err) {
        return console.log(err.toString());
    });
    //event.preventDefault();
}
function sendBySignalRForDel(userid, messid) {
    connection.invoke("SendMessage", userid, "delmess;,;" + messid).catch(function (err) {
        return console.log(err.toString());
    });
}
