// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

//const { type } = require("jquery");

// Write your JavaScript code.
//var firstCall = true;
var minId = '0';
var lmore = false;
//var mess_buttons = `<div class="dropdown" >
//                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">...</button>
//                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
//                            <a class="dropdown-item rep_">Reply</a>
//                            <a class="dropdown-item for_">Forward</a>
//                            <a class="dropdown-item del_">Delete</a>
//                        </div>
//                    </div>`;
                            //<a class="dropdown-item sel_">Select</a>

try {
    JSBridge.setUserId(myUserId);
} catch { }
var visible = true;
$('.expand-button , #profile-img').on('click', showStatus);
$($('#profile p')[0]).on('click', showStatus);

function showStatus() {
    $('#status-options').css("opacity", "1");
    $('#status-options').css("visibility", "visible");
}
$(document).on("click", function () {
    visible = !visible;
    if (visible) {
        $('#status-options').css("opacity", "0");
        $('#status-options').css("visibility", "hidden");
    }
});

$('#status-options li').on('click', function () {
    var newclassName = $(this).attr("id").split("-")[1];
    $('#profile-img').removeAttr("class");
    $('#profile-img').addClass(newclassName);
    $.post('/Home/SetStatus', { status: newclassName }, function () { });
});



//$('#search input').focus(function () {
//    $('.search-mess').show();
//    $('.def-mess').hide();
//});
//$('#search input').focusout(function () {
//    $('.search-mess').hide();
//    $('.def-mess').show();
//});
$('#search input').on('keydown', function (e) {
    if (e.keyCode == 13) {
        searchData()
    }   
});
function searchData() {
    var searchKey = $('#search input').val();
    if (searchKey) {
        $('.new-search-mess').hide();
        $('.new-search-mess').removeClass('new-search-mess').addClass('search-mess');
        //$('#contacts ul').html('');
        $('.new-search-mess').html('');
        $.post('/Home/GetAccounts', { searchKey }, function (dataItem) {
            $('.def-mess').hide();
            if (dataItem.length == 0) {
                var str =
                    `<li class="contact new-search-mess">
                        <div class="wrap">
                            <div class="meta">
                                <p class="name">Not Found</p>
                                <p class="preview">nothing!</p>
                            </div>
                        </div>
                    </li>`;
                $('#contacts ul').append(str);
                return;
            }
            for (var i = 0; i < dataItem.length; i++) {

                var statusStr = "online";
                statusStr = dataItem[i].status == 1 ? "away" : dataItem[i].status == 2 ? "busy" : dataItem[i].status == 3 ? "offline" : statusStr;

                var str = `<li class="contact new-search-mess"  data-id="` + dataItem[i].userId + `">
                        <div class="wrap">
                            <span class="contact-status `+ statusStr + `"></span>` +
                    (dataItem[i].profilePic ? '<img src="/ProfilePics/' + dataItem[i].profilePic + '" alt="" />' : '<img src="/user-profile.png" alt="" />') +
                    `<div class="meta">
                                <p class="name">`+ dataItem[i].userName + `<span></span></p>
                                <p class="preview"></p>
                            </div>
                        </div>
                    </li>`;
                $('#contacts ul').append(str);
                $('.new-search-mess').on('click', function () {
                    fromNewChat = false;
                    $('.new-search-mess').removeClass('active');
                    $(this).addClass('active');
                    var contactId = $(this).data('id');
                    var userid = $(this).data('id');
                    $.post('/Home/GetContactMessage', { minId: '0', contactId: contactId }, function (res) {
                        $('.loading').hide();
                        if (res == null || res.length == 0)
                            SetEmptyMessage();
                        else
                            SetResultOfMessage(res);

                    });



                });
            }
        });
    }
    else {
        $('.new-search-mess').hide();
        $('.def-mess').show();

    }
    
}
function SetEmptyMessage() {
    
    var strLi =
            `<div class="chat-pm-empty ">
						<label class="text-larg">
							No message here yet!
						</label>
						<label>
							Send a message or send file or voice.
						</label>
					</div>
            <ul><li id='lastchat'></li></ul>`;

    var username = $('.contact.active .name').html();
    //username = username.split('span').join('').split('<').join('').split('>').join('').split('/').join('');
    var smallUsername = username.length > 30 ? username.substring(0, 29) + '...' : username;
    var userCmp = $('.contact.active .company').text();
    var userImg = $('.contact.active img').attr('src');
    //var Usernamehtml = `<abbr title="` + username + `">` + smallUsername + `</abbr>`;
    var Usernamehtml = `<button id="nameofcontact" type="button"  data-toggle="tooltip" data-placement="bottom" title="` + username +`">
                          `+ smallUsername +`
                        </button>`;

    var mess =
        `
		<div class="row">
			<div class="chat px-3">
			
			  <div class="mb-auto row">
				<div class="text-start display-block">
				  <div class="text-start float-start btn w-100">

					<div class="d-inline">
						<div class="float-start">
							<a class="active text-light close mx-2" aria-current="page" href="#" ><i class="fas fa-arrow-left"></i></a>
							<img src="`+ userImg + `" class="img-pro-pm-chat" />
						</div>
						<div class="float-start mx-2">
							<div class="pro-small">
								<label class="name">`+ smallUsername + `</label>
								<label class="company">`+ userCmp + `</label>
							</div>
						</div>

						<div class="float-end text-end">
						  <div class="text-start float-end btn px-0">
							<a class="active text-light pr-2" aria-current="page" href="#"><i class="fas fa-phone"></i></a>
							<a class="active text-light" aria-current="page" href="#"><i class="fas fa-video"></i></a>
						  </div>
						</div>
					</div>
				  </div>
				</div>
			  </div>
			  <div class="row tab-div">
				<div class="chat-pm">
        `+ strLi + `
        
					<div class="chat-pm-input ">
						
						<textarea rows="1" class="w-100 form-control" ></textarea>
						<div class="send-btn">
                            <div class="input-group-append" id="microphone_btn">
                                <span class="input-group-text microphone_btn"><i class="fa fa-microphone"></i></span>
                            </div>
                            <div class="input-group-append" id="microphone_btn">
                                <span class="input-group-text microphone_btn"><i class="fa fa-microphone"></i></span>
                            </div>
                            <div class="input-group-append" id="stopButton">
                                <span class="input-group-text stopButton"><i class="fa fa-stop-circle"></i></span>
                            </div>
							<img class="attach" src="/img/attach_file.png" />
							<img class="send" src="/img/send-icon.png" />
						</div>
					</div>
                </div>
            </div>`;
    //var mess =
    //    `<div class="contact-profile">
    //        <p>`+ Usernamehtml + `</p>
    //    <div class="social-media">
    //         <i class="fa fa-phone" aria-hidden="true"></i>
    //         <i class="fa fa-video-camera" aria-hidden="true"></i>
    //             <!--<i class="fa fa-facebook" aria-hidden="true"></i>
    //            <i class="fa fa-twitter" aria-hidden="true"></i>
    //             <i class="fa fa-instagram" aria-hidden="true"></i> -->
    //    </div>
    //    </div>
    //    <div class="messages">
    //        `+ strLi + `
    //    </div>
    //    <div class="message-input">
    //        <div class="wrap">
    //            <input type="text" placeholder="Write your message..." />
    //            <div class="input-group-append" id="microphone_btn">
    //                <span class="input-group-text microphone_btn"><i class="fa fa-microphone"></i></span>
    //            </div>
    //            <div class="input-group-append" id="stopButton">
    //                <span class="input-group-text stopButton"><i class="fa fa-stop-circle"></i></span>
    //            </div>
    //            <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
    //            <button class="submit" id="btn-send-mess"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
    //        </div>
    //    </div>`;

    $('#ChatPmModal .modal-body').html(mess);
    $('#ChatPmModal').modal('show');
    $('#ChatPmModal .close').on('click', function () {

        if (fromNewChat)
            window.location.href = "/";
        else
            $('#ChatPmModal').modal('hide');
    });

    //$('.messages li:not(.cl)').on('click', function () {
    //    if ($(this).find('span').length == 0)
    //        $(this).append("<span>" + getNiceDateTimeFormat($(this).data('time')) + "</span>");
    //});
    //$('.messages li:not(.cl)').addClass('cl');


    $('.fa-video').on('click', function () {
        isVideoCall = true;
        console.log('calling user... ');
        $('#VideoCallModalLabel').html("Video Call");

        $('.partner')[0].style.display = 'none';
        localVideo.style.display = '';
        remoteVideo.style.display = '';
        //if (firstCall) {
        //    //var selectedUsername = $(".contact-profile p").text().substring(0, $(".contact-profile p").text().indexOf("("));
        //    var myusername = $("#profile > .wrap > p").text();
        //    initializeSignalR();
        //    setUsername(myusername, myUserId);
        //    firstCall = false;
        //}
        // Find the target user's SignalR client id
        //var targetConnectionId = $(this).attr('data-cid');
        var UserId = $(".def-mess.active").attr('data-id');

        // Make sure we are in a state where we can make a call
        if ($('body').attr("data-mode") !== "idle") {
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.');
            return;
        }

        // Then make sure we aren't calling ourselves.
        //if (targetConnectionId != myConnectionId) {
        if (UserId != myUserId) {
            // Initiate a call
            initializeUserMediaVideo();
            wsconn.invoke('callUser', UserId, true  /*{ "connectionId": targetConnectionId}*/);

            // UI in calling mode
            $('body').attr('data-mode', 'calling');
            $('#VideoCallModal').modal('show');
            $('#ChatPmModal').modal('hide');

            $("#callstatus").text('Calling...');
        } else {
            alertify.error("Ah, nope.  Can't call yourself.");
        }
    });
    $('.fa-phone').on('click', function () {
        isVideoCall = false;

        localVideo.style.display = 'none';
        remoteVideo.style.display = 'none';
        $('#VideoCallModalLabel').html("Voice Call");
        $('.partner')[0].style.display = '';

        console.log('calling user... ');
        //if (firstCall) {
        //    //var selectedUsername = $(".contact-profile p").text().substring(0, $(".contact-profile p").text().indexOf("("));
        //    var myusername = $("#profile > .wrap > p").text();
        //    initializeSignalR();
        //    setUsername(myusername, myUserId);
        //    firstCall = false;
        //}
        // Find the target user's SignalR client id
        //var targetConnectionId = $(this).attr('data-cid');
        var UserId = $(".def-mess.active").attr('data-id');

        // Make sure we are in a state where we can make a call
        if ($('body').attr("data-mode") !== "idle") {
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.');
            return;
        }

        // Then make sure we aren't calling ourselves.
        //if (targetConnectionId != myConnectionId) {
        if (UserId != myUserId) {
            // Initiate a call
            initializeUserMediaVoice();
            wsconn.invoke('callUser', UserId, false  /*{ "connectionId": targetConnectionId}*/);

            // UI in calling mode
            $('body').attr('data-mode', 'calling');
            $('#ChatPmModal').modal('hide');
            $('#VideoCallModal').modal('show');
            $("#callstatus").text('Calling...');
        } else {
            alertify.error("Ah, nope.  Can't call yourself.");
        }
    });
    $('.lmore').on('click', function () {
        lmore = true;

        var contactId = $('.contact.active').data('id');
        $.post('/Home/GetContactMessage', { minId: minId, contactId: contactId }, function (res) {
            $('.loading').hide();
            if (res == null || res.length == 0)
                SetEmptyMessage();
            else {
                SetResultOfMessage(res);
                $('.contact.active .text-bg-success').html("(0)");
            }
        });
    });
    setTimeout(function () {
        $('.chat-pm ul').scrollTop($('.chat-pm ul')[0].scrollHeight);

    }, 500);
    setSomeFeatureForSendingMess();
    loadRecData();
    //videoAndVoiceCallClick();

    //setSomeFeatureForSendingMess();

}
function videoAndVoiceCallClick(res) {

    $('.social-media .fa-video-camera').on('click', function () {
        isVideoCall = true;
        console.log('calling user... ');
        $('#VideoCallModalLabel').html("Video Call");

        $('.partner')[0].style.display = 'none';
        localVideo.style.display = '';
        remoteVideo.style.display = '';
        try {
            Android.loadCamera();
        } catch (e) {
            alertify.error(e);

        }
        //if (firstCall) {
        //    //var selectedUsername = $(".contact-profile p").text().substring(0, $(".contact-profile p").text().indexOf("("));
        //    var myusername = $("#profile > .wrap > p").text();
        //    initializeSignalR();
        //    setUsername(myusername, myUserId);
        //    firstCall = false;
        //}
        // Find the target user's SignalR client id
        //var targetConnectionId = $(this).attr('data-cid');
        var UserId = $(".def-mess.active").attr('data-id');

        // Make sure we are in a state where we can make a call
        if ($('body').attr("data-mode") !== "idle") {
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.');
            return;
        }

        // Then make sure we aren't calling ourselves.
        //if (targetConnectionId != myConnectionId) {
        if (UserId != myUserId) {
            // Initiate a call
            initializeUserMediaVideo();
            wsconn.invoke('callUser', UserId, true  /*{ "connectionId": targetConnectionId}*/);

            // UI in calling mode
            $('body').attr('data-mode', 'calling');
            $('#VideoCallModal').modal('show');
            $("#callstatus").text('Calling...');
        } else {
            alertify.error("Ah, nope.  Can't call yourself.");
        }
    });
    $('.social-media .fa-phone').on('click', function () {
        isVideoCall = false;

        localVideo.style.display = 'none';
        remoteVideo.style.display = 'none';
        try {
            Android.loadMicrophone();
        } catch (e) {
            alertify.error(e);

        }
        $('#VideoCallModalLabel').html("Voice Call");
        $('.partner')[0].style.display = '';

        console.log('calling user... ');
        //if (firstCall) {
        //    //var selectedUsername = $(".contact-profile p").text().substring(0, $(".contact-profile p").text().indexOf("("));
        //    var myusername = $("#profile > .wrap > p").text();
        //    initializeSignalR();
        //    setUsername(myusername, myUserId);
        //    firstCall = false;
        //}
        // Find the target user's SignalR client id
        //var targetConnectionId = $(this).attr('data-cid');
        var UserId = $(".def-mess.active").attr('data-id');

        // Make sure we are in a state where we can make a call
        if ($('body').attr("data-mode") !== "idle") {
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.');
            return;
        }

        // Then make sure we aren't calling ourselves.
        //if (targetConnectionId != myConnectionId) {
        if (UserId != myUserId) {
            // Initiate a call
            initializeUserMediaVoice();
            wsconn.invoke('callUser', UserId, false  /*{ "connectionId": targetConnectionId}*/);

            // UI in calling mode
            $('body').attr('data-mode', 'calling');
            $('#VideoCallModal').modal('show');
            $("#callstatus").text('Calling...');
        } else {
            alertify.error("Ah, nope.  Can't call yourself.");
        }
    });
}
function SetResultOfMessage(res) {
    var strLi = "";
    if (lmore == false)
        strLi+="<ul>";
    if (res.length>0)
        minId = res[res.length - 1].id;
    if (minId > parseInt($('.contact.active').attr('minid')))
        strLi += "<li class='lmore'><button class='btn btn-info'>load more</button></li>";

    for (var i = res.length - 1; i >= 0; i--) {
        if (res[i].isFile == false) {
                    //<img src="` + (res[i].isReciver ? $('#profile-img').attr('src') : $('.contact.active img').attr('src')) + `" alt="" />` +
            strLi += `<li class="` + (res[i].isReciver ? "from-me" : "from-other") + `" data-id="` + res[i].id + `" >`+
                (res[i].body.indexOf(',;,') >= 0
                    ?
                    `<div class="card" data-id="` + (res[i].replyId ? res[i].replyId : "") + `" >
                      <div class="card-header">` +
                        res[i].body.split(',;,')[0] + `
                      </div><label>`+ res[i].body.split(',;,')[1] +
                    `</label></div>`
                    :
                    `<label>` + res[i].body + `</label>`
                )
                + `</li>
                <li class="` + (res[i].isReciver ? "from-me" : "from-other") + `" >
                    <div class="date">`+ getNiceDateTimeFormat(res[i].createdDate) + `</div>
                </li>`;
        } else {
            var resArr = [];
            resArr.push(res[i].body);
            var headerText = "";
            if (res[i].body.indexOf('^') >= 0) {
                resArr = res[i].body.split('^');
                headerText = "";//res[i].body.split(',;,')[0];
            }
            for (var j = 0; j < resArr.length; j++) {
                strLi += `<li class="` + (res[i].isReciver ? "from-me" : "from-other") + `" data-id="` + res[i].id + `" >`;
                if (headerText)//begin header of reply card
                    //`<img src="` + (res[i].isReciver ? $('#profile-img').attr('src') : $('.contact.active img').attr('src')) + `" alt="" />`;
                strLi += `<div class="card" data-id="` + (replyid ? replyid : "") + `" >
                      <div class="card-header">` +
                        headerText +
                        `</div>`;
                if (IsImage(resArr[j]))
                    strLi += `<label><a href="/uploads/` + resArr[j] + `" target="_blank"><img  class="fupload" src="/uploads/thumbnails/` + resArr[j] + `" /></a></label>`;
                else if (IsAudio(resArr[j]))
                    strLi += `<label><audio controls src="/uploads/` + resArr[j] + `" ></audio></label>`;
                else
                    strLi += `<label><a href="/uploads/` + resArr[j] + `" target="_blank" >file(` + resArr[j] + `)</a></label>`;
                if (headerText)//end header of reply card
                    strLi += `</div>`;
                strLi += `</li>`;
                strLi += `<li class="` + (res[i].isReciver ? "from-me" : "from-other") + `" >` +
                    "<div class='date'>" + getNiceDateTimeFormat(res[i].createdDate) + "</div>" +
                     `</li>`;
            }
        }
    }
    if (lmore) {
        $('.lmore').before(strLi);
        if (($('.lmore').length > 1))
            $($('.lmore')[1]).remove();
        else
            $('.lmore').remove();
        lmore = false;

        $('.lmore').on('click', function () {
            lmore = true;

            var contactId = $('.contact.active').data('id');
            $.post('/Home/GetContactMessage', { minId: minId, contactId: contactId }, function (res) {
                $('.loading').hide();
                if (res == null || res.length == 0)
                    SetEmptyMessage();
                else {
                    SetResultOfMessage(res);
                    $('.contact.active .text-bg-success').html("0");
                }
            });
        });
        //$('.messages li:not(.cl)').on('click', function () {
        //    if ($(this).find('span').length == 0 && $(this).hasClass('lmore') == false)
        //        $(this).append("<span>" + getNiceDateTimeFormat($(this).data('time')) + "</span>");
        //});
        //$('.messages li:not(.cl)').addClass('cl');
        return;
    }
    strLi += "<li id='lastchat'></li></ul>";

    var username = $('.contact.active .name').html();
    //username = username.split('span').join('').split('<').join('').split('>').join('').split('/').join('');
    var smallUsername = username.length > 30 ? username.substring(0, 29) + '...' : username;
    var userCmp = $('.contact.active .company').text();
    var userImg = $('.contact.active img').attr('src');
    //var Usernamehtml = `<abbr title="` + username + `">` + smallUsername + `</abbr>`;
    //var Usernamehtml = `<button id="nameofcontact" type="button"  data-toggle="tooltip" data-placement="bottom" title="` + username + `">
    //                      `+ smallUsername + `
    //                    </button>`;

    var mess =
        `
		<div class="row">
			<div class="chat px-3">
			
			  <div class="mb-auto row">
				<div class="text-start display-block">
				  <div class="text-start float-start btn w-100">

					<div class="d-inline">
						<div class="float-start">
							<a class="active text-light close mx-2" aria-current="page" href="#" ><i class="fas fa-arrow-left"></i></a>
							<img src="`+ userImg +`" class="img-pro-pm-chat" />
						</div>
						<div class="float-start mx-2">
							<div class="pro-small">
								<label class="name">`+ smallUsername + `</label>
								<label class="company">`+ userCmp +`</label>
							</div>
						</div>

						<div class="float-end text-end">
						  <div class="text-start float-end btn px-0">
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Forward"><i class="fa-solid fa-share fa-2xs"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Reply"><i class="fa-solid fa-reply fa-2xs"></i></a>
							<a class="active text-light d-none" aria-current="page" href="#" title="Remove"><i class="fa-solid fa-trash"></i></a>
							<a class="active text-light pr-2" aria-current="page" href="#"><i class="fas fa-phone"></i></a>
							<a class="active text-light" aria-current="page" href="#"><i class="fas fa-video"></i></a>
						  </div>
						</div>
					</div>
				  </div>
				</div>
			  </div>
			  <div class="row tab-div">
				<div class="chat-pm">
        `+ strLi + `
        
					<div class="chat-pm-input ">
						
						<textarea rows="1" class="w-100 form-control" ></textarea>
						<div class="send-btn">
                            <div class="input-group-append" id="microphone_btn">
                                <span class="input-group-text microphone_btn"><i class="fa fa-microphone"></i></span>
                            </div>
                            <div class="input-group-append" id="stopButton">
                                <span class="input-group-text stopButton"><i class="fa fa-stop-circle"></i></span>
                            </div>
							<img class="attach" src="/img/attach_file.png" />
							<img class="send" src="/img/send-icon.png" />
						</div>
					</div>
                </div>
            </div>`;


    $('#ChatPmModal .modal-body').html(mess);
    $('#ChatPmModal').modal('show');
    $('#ChatPmModal .close').on('click', function () {
        if (fromNewChat)
            window.location.href = "/";
        else
            $('#ChatPmModal').modal('hide');
    });

    //$('#nameofcontact').tooltip();
    //$('#nameofcontact').on('click', function () {
    //    setTimeout(function () {
    //        $('[data-toggle="tooltip"]').tooltip('disable');
    //        $('[data-toggle="tooltip"]').tooltip('enable');
    //    }, 3000);
    //});

    $('.fa-video').on('click', function () {
        isVideoCall = true;
        console.log('calling user... ');
        $('#VideoCallModalLabel').html("Video Call");

        $('.partner')[0].style.display = 'none';
        localVideo.style.display = '';
        remoteVideo.style.display = '';
        //if (firstCall) {
        //    //var selectedUsername = $(".contact-profile p").text().substring(0, $(".contact-profile p").text().indexOf("("));
        //    var myusername = $("#profile > .wrap > p").text();
        //    initializeSignalR();
        //    setUsername(myusername, myUserId);
        //    firstCall = false;
        //}
        // Find the target user's SignalR client id
        //var targetConnectionId = $(this).attr('data-cid');
        var UserId = $(".def-mess.active").attr('data-id');

        // Make sure we are in a state where we can make a call
        if ($('body').attr("data-mode") !== "idle") {
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.');
            return;
        }

        // Then make sure we aren't calling ourselves.
        //if (targetConnectionId != myConnectionId) {
        if (UserId != myUserId) {
            // Initiate a call
            initializeUserMediaVideo();
            wsconn.invoke('callUser', UserId,true  /*{ "connectionId": targetConnectionId}*/);

            // UI in calling mode
            $('body').attr('data-mode', 'calling');
            $('#VideoCallModal').modal('show');
            $('#ChatPmModal').modal('hide');

            $("#callstatus").text('Calling...');
        } else {
            alertify.error("Ah, nope.  Can't call yourself.");
        }
    });
    $('.fa-phone').on('click', function () {
        isVideoCall = false;

        localVideo.style.display = 'none';
        remoteVideo.style.display = 'none';
        $('#VideoCallModalLabel').html("Voice Call");
        $('.partner')[0].style.display = '';

        console.log('calling user... ');
        //if (firstCall) {
        //    //var selectedUsername = $(".contact-profile p").text().substring(0, $(".contact-profile p").text().indexOf("("));
        //    var myusername = $("#profile > .wrap > p").text();
        //    initializeSignalR();
        //    setUsername(myusername, myUserId);
        //    firstCall = false;
        //}
        // Find the target user's SignalR client id
        //var targetConnectionId = $(this).attr('data-cid');
        var UserId = $(".def-mess.active").attr('data-id');

        // Make sure we are in a state where we can make a call
        if ($('body').attr("data-mode") !== "idle") {
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.');
            return;
        }

        // Then make sure we aren't calling ourselves.
        //if (targetConnectionId != myConnectionId) {
        if (UserId != myUserId) {
            // Initiate a call
            initializeUserMediaVoice();
            wsconn.invoke('callUser', UserId,false  /*{ "connectionId": targetConnectionId}*/);

            // UI in calling mode
            $('body').attr('data-mode', 'calling');
            $('#ChatPmModal').modal('hide');
            $('#VideoCallModal').modal('show');
            $("#callstatus").text('Calling...');
        } else {
            alertify.error("Ah, nope.  Can't call yourself.");
        }
    });
    $('.lmore').on('click', function () {
        lmore = true;

        var contactId = $('.contact.active').data('id');
        $.post('/Home/GetContactMessage', { minId: minId, contactId: contactId }, function (res) {
            $('.loading').hide();
            if (res == null || res.length == 0)
                SetEmptyMessage();
            else {
                SetResultOfMessage(res);
                $('.contact.active .text-bg-success').html("0");
            }
        });
    });
    setTimeout(function () {
        $('.chat-pm ul').scrollTop($('.chat-pm ul')[0].scrollHeight);

    }, 500);
    setSomeFeatureForSendingMess();
    loadRecData();

    //$('.messages li:not(.cl)').on('click', function () {
    //    if ($(this).find('span').length == 0 && $(this).hasClass('lmore') == false)
    //        $(this).append("<span>" + getNiceDateTimeFormat($(this).data('time')) + "</span>");
    //});
    //$('.messages li:not(.cl)').addClass('cl');
    //$('.messages').scrollTop($('.messages')[0].scrollHeight);
    //$('.chat-pm ul').scrollTop($('.chat-pm ul')[0].scrollHeight);
    //$('.messages').scrollTop($('#lastchat').offset().top);
}

/*
solid fa-share fa-2
solid fa-reply fa-2
 fa-trash-can-xmark
*/


function contact_must_be_selected(elem) {
    if (elem && elem.hasClass('selected'))
        elem.removeClass('selected');
    else if (elem)
        elem.addClass('selected');
    if ($('.chat-pm li.selected').length == 0) {
        $('.fa-video').parent().bsShow();
        $('.fa-phone').parent().bsShow();
        $('.fa-share').parent().bsHide();
        $('.fa-reply').parent().bsHide();
        $('.fa-trash').parent().bsHide();
    }
    else if ($('.chat-pm li.selected').length == 1) {
        $('.fa-video').parent().bsHide();
        $('.fa-phone').parent().bsHide();
        $('.fa-share').parent().bsShow();
        $('.fa-reply').parent().bsShow();
        $('.fa-trash').parent().bsShow();
    }
    else {
        $('.fa-video').parent().bsHide();
        $('.fa-phone').parent().bsHide();
        $('.fa-share').parent().bsHide();
        $('.fa-reply').parent().bsHide();
        $('.fa-trash').parent().bsHide();
    } 
    
        
}
var innerHtmlReply = "";
var replyid = "";
var beforeReplytext = "";
var forwardid = "";
var deleteid = "";
function setSomeFeatureForSendingMess() {
    sendMessagebtn();
    //$('.chat-pm-input textarea').bind('keypress', function (e) {
    //    if ((e.keyCode || e.which) == 13) {
    //        $(this).parents('form').submit();
    //        return false;
    //    }
    //});
    loadForSelectLi();
    allDropDownButtonProcess();
}
function loadForSelectLi(){
    var timeoutId = 0;
    $('.chat-pm li').unbind('mousedown');
    $('.chat-pm li').unbind('mouseup');
    $('.chat-pm li').unbind('mouseup');
    $('.chat-pm li').on('mousedown', function () {
        var elem = $(this);
        timeoutId = setTimeout(function () {
            contact_must_be_selected(elem)
        }, 1000);
    }).on('mouseup mouseleave', function () {
        clearTimeout(timeoutId);
    });
}
function sendMessagebtn() {
    $('.send-btn .send').on('click', function (e) { SendMessageProcess(false) });
    $('.send-btn .attach').on('click', SendFileProcess);
    $('.chat-pm-input textarea').on('keydown', function (evt) {
        if (evt.keyCode == 13 && !evt.shiftKey) {
            SendMessageProcess(false);
            return false;
        }
    }
    );
}
function allDropDownButtonProcess() {
    replyBtnProcess();
    forwardBtnProcess();
    deleteBtnProcess();
}
function deleteBtnProcess() {

    $('.fa-trash').on('click', function () {
        deleteid = $('.chat-pm li.selected').eq(0).data('id');
        //deleteid = $(this).parent().parent().parent().data('id');
        $('#deleteModal').modal('show');
    });
    $('.del_').removeClass('del_').addClass('del');
}
$('#btn-submit-delete').on('click', function () {
    $.post('/Home/DelMess', { messid: deleteid }, function (res) {
        if (res.length > 0 && res[0].id > 0) {
            var contactId = $('.contact.active').data('id');
            sendBySignalRForDel(contactId, deleteid + ";;;" + userid);

            $('.chat-pm li[data-id=' + deleteid + ']').next('.chat-pm li').remove();
            $('.chat-pm li[data-id=' + deleteid + ']').remove();
        } else {
            alert('an error has occured!');
        }
        $('#deleteModal').modal('hide');
        contact_must_be_selected()

        deleteid = "";
    });
});
function forwardBtnProcess() {
    $('.fa-share').on('click', function () {
        forwardid = $('.chat-pm li.selected').eq(0).data('id');
        var strContact = "";
        strContact += $('.contacts').clone().html();
        $('#forward-body').html(strContact);
        $('#forward-body .mess').on('click', function () {
            $('#forward-body .mess').removeClass('active');
            $(this).addClass('active');
        });
        $('#forwardModal').modal('show');
    });
    $('.for_').removeClass('for_').addClass('for');
}
$('#btn-cancel-forward').on('click', function () {
    forwardid = "";
    $('#forwardModal').modal('hide');
});
$('#btn-submit-forward').on('click', function () {
    if ($('#forward-body .mess.active').length > 0) {
        SendMessageProcess(true);
    }
    forwardid = "";
    $('#forwardModal').modal('hide');
});
$("#forwardModal").on("hidden.bs.modal", function () {
    forwardid = "";
    // put your default event here
});
function replyBtnProcess() {
//fa-share
//fa-reply
//fa-trash
    $('.fa-reply').on('click', function () {
        forwardid = "";
        //if (!replyid) {
        innerHtmlReply = $('.chat-pm-input').eq(0).html();
        beforeReplytext = $('.chat-pm-input textarea').eq(0).val();
        //}
        var elem = $('.chat-pm li.selected').eq(0);
        replyid = elem.data('id');
        //if (elem.tagName.get(0).toLowerCase() == "li")
        //    $('.chat-pm-input').html(`<div class="card" >
        //          <div class="card-header" data-id="`+ replyid + `">
        //            reply to file <span>X</span>
        //          </div>`+
        //        innerHtmlReply +
        //        `</div>`);
        //else
        $('.chat-pm-input').html(`<div class="card" >
                  <div class="card-header reply" data-id="`+ replyid + `">` +
            (elem.get(0).innerText.length > 20 ? elem.get(0).innerText.substring(0, 20) : elem.get(0).innerText) +
                `<span>X</span></div>` +
                innerHtmlReply +
                `</div>`);

        $('.chat-pm-input textarea').val(beforeReplytext);
        $('.chat-pm-input textarea').focus();
        $('.chat-pm-input .card-header span').on('click', function () {
            beforeReplytext = $('.message-input input').val();
            $('.chat-pm-input').html(innerHtmlReply);
            replyid = "";

            $('.chat-pm textarea').val(beforeReplytext);
        });
        sendMessagebtn();
    });

    $('.rep_').removeClass('rep_').addClass('rep');
}
function SendFileProcess() {
    $("#fileinput").unbind('change');

    $('#fileinput').on('change', function () {
        var fileInput = document.getElementById('fileinput');
        if (fileInput.files.length > 0) {
            var contactId = $('.contact.active').data('id');
            fileUploader(fileInput, contactId);
            //sendMess("file", id);
            //$('#loader').show();
            //$('#toUser').val(id);
            //$('form').submit();
        }
    });
    $('#fileinput').click();
}

function SendMessageProcess(forward) {
    forward = forward ? forward : false;
    var mess = "";
    var contactId = "";
    $('.chat-pm-empty').hide();
    if (forward == false) {
        mess = $('.chat-pm-input textarea').val();
        contactId = $('.contact.active').data('id');
    } else {
        contactId = $('#forward-body .mess.active').data('id');
    }
    if (mess || forward) {
        $('.loading').show();
        if (forward == false) 
            $('.chat-pm-input textarea').val('');
        
        $.post('/Home/sendMess', { mess: mess, contactId: contactId, replyId: (forward ? "" : replyid), forwardId: (forward ? forwardid : "") }, function (res) {
            $('.loading').hide();
            if (forward == false || $('#forward-body .mess.active').data('id') == $('.contact.active').data('id')) {
                //is not forward or send forward message to and from is one person
                var strLi = "";
                //var text = "";
                //if (replyid || forwardid)
                //    if ($('.messages li[data-id=126] .card a').length > 0)
                //        text = "reply to file";
                //    else if ($('.messages li[data-id=126] .card p').length > 0)
                //        text = $('.messages li[data-id=126] .card p').text();
                //if (text.length > 20)
                //    text += text.substring(0, 20) + "...";
                for (var i = 0; i < res.length; i++) {//****************** always is one row but i write as my before code 
                    //<img src="` + (res[i].isReciver ? $('#profile-img').attr('src') : $('.contact.active img').attr('src')) + `" alt="" />` +
                    strLi += `<li class ="from-me" data-id="` + res[i].id + `" data-time="` + res[i].createdDate + `">`+
                        (res[i].body.indexOf(',;,') >= 0 ?
                            (`<div class="card" data-id="` + (res[i].replyId ? res[i].replyId : "") + `" >
                              <div class="card-header">
                              ` + res[i].body.split(',;,')[0] + `
                              </div><label>`+ res[i].body.split(',;,')[1] +
                            `</label></div>`)
                            :
                            `<label>` + res[i].body + `</label>`
                        ) +
                        `</li><li class ="from-me" >`+
                        `<div class="date" data-id="` + (res[i].replyId ? res[i].replyId : "") + `" >` + getNiceDateTimeFormat(res[i].createdDate)+`</div>` +
                        `</li>`;
                }
                $('#lastchat').before(strLi);

                //$('.messages li:not(.cl)').on('click', function () {
                //    if ($(this).find('span').length == 0)
                //        $(this).append("<span>" + getNiceDateTimeFormat($(this).data('time')) + "</span>");
                //});
                //$('.messages li:not(.cl)').addClass('cl');
                //$('.messages').scrollTop($('.messages')[0].scrollHeight);
                $('.chat-pm ul').scrollTop($('.chat-pm ul')[0].scrollHeight);

                if (forward == false) {
                    $('.chat-pm-input textarea').val('')
                    if (replyid) {
                        $('.chat-pm-input .card-header span').trigger('click');
                        replyid = "";
                    } 

                } else
                    $('.chat-pm li').removeClass('selected');

                loadForSelectLi();
                allDropDownButtonProcess();
            }
            if (forward) 
                $('.chat-pm li').removeClass('selected');
            contact_must_be_selected()
            sendBySignalR(contactId, res[0].createdDate + ";;;" + userid + ";;;" + res[0].body + ";;;" + res[0].id + ";;;" + (forward ? "" : replyid) + (forward ? forwardid : ""));
        });
    }
}
$('.def-mess').on('click', function () {
    fromNewChat = false;
    $('.loading').show()
    //$('#ChatPmModal').modal('show');
    //return;
    $('.contact').removeClass('active');
    $(this).addClass('active');
    var contactId = $(this).data('id');
    var userid = $(this).data('id');
    $.post('/Home/GetContactMessage', { minId: '0', contactId: contactId }, function (res) {
        $('.loading').hide();
        if (res == null || res.length == 0)
            SetEmptyMessage();
        else {
            SetResultOfMessage(res);
            $('.contact.active .text-bg-success').html("0");
        }
    });
});

$('#logout').on('click', function () {
    $('#logoutForm').submit();
});
//function getNiceDateTimeFormat(datetime) {
//    var dt = new Date(datetime);
//    var now = new Date();
//    now.setMilliseconds(diffdate);
//    var isoDate = dt.toISOString().replace('T', ' ');
//    isoDate = isoDate.substring(0, isoDate.indexOf('.'));
//    return isoDate + " (" + timeDifference(now, dt) + ")";

//}
function getNiceDateTimeFormat(datetime) {
    var dt = new Date(datetime);
    var now = new Date();
    now.setHours(now.getHours() + 3);
    now.setMinutes(now.getMinutes() + 30)
    now.setMilliseconds(diffdate);
    var isoDate = dt.toISOString().replace('T', ' ');
    isoDate = isoDate.substring(0, isoDate.indexOf('.'));
    var relTime = timeDifference(now, dt);
    var relTimeCorrect = relTime.indexOf('-') >= 0 ? "now" : relTime;
    return isoDate + " (" + relTimeCorrect + ")";
}
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

$('#search-btn').on('click', function () {
    $('#searchContactModal').modal('show');
});
$('#searchContact').on('keydown', function (e) {
    if (e.keyCode == 13) {
        searchonmobile();
    }
});
$('.search-contact').on('click', function () {
    searchonmobile();
});
function searchonmobile() {
    $('#search input').val($('#searchContact').val());
    //$('#search input').dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter' }));

    //var enter = $.Event('keydown');
    //enter.which = 13; // Character 'A'
    //$('#search input').trigger(enter);
    searchData()
    $('#searchContactModal').modal('hide');
}
$('.search-contact-reset').on('click', function () {
    $('#searchContact').val('');
})


function saveToDb(Latitude, Longitude, Address) {
    $.post("/Home/SaveAddress", { Latitude, Longitude, Address }, function (data) {
        console.log("logSaveAddress" + data);
    })

}

$('.logout').on('click', function () {
    $('#logoutForm').submit();
});
$('.setting').on('click', function () {
    window.location.href = "/Identity/Account/Manage/Index"
});
$('.chatpage').on('click', function () {
    window.location.href = "/"
});
//$('#settings').on('click', function () { window.location.href = "/Identity/Account/Manage/Index" });
$('.chat-mess-new').on('click', function () {
    $.post('/Home/AllContact', {}, function (datas) {
        var datastr = '';
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            datastr+=`<div class="new-ch contact col-12" data-id="`+data.id+`">
                            <div class="row px-3">
                                <div class="col-2">
                                    <img src="`+ data.profilePic +`" class="img-pro" />
                                </div>
                                <div class="col-8 text-start px-2">
                                    <div class="pro">
                                        <label class="name">`+ (data.name ? data.name : data.username)+`</label>
                                        <label class="company">`+ data.companyName +`</label>
                                        <label class="role">`+ data.companyRoleName +`</label>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        }
        $('.selectContact').html(datastr);
        $('#selectContactModal').modal('show');

        $('.new-ch').on('click', function () {
            fromNewChat = true;
            $('#selectContactModal').modal('hide');
            $('.contact').removeClass('active');
            $(this).addClass('active');
            var contactId = $(this).data('id');
            var userid = $(this).data('id');
            $.post('/Home/GetContactMessage', { minId: '0', contactId: contactId }, function (res) {
                $('.loading').hide();
                if (res == null || res.length == 0)
                    SetEmptyMessage();
                else {
                    SetResultOfMessage(res);
                    $('.contact.active .text-bg-success').html("0");
                }
            });
        });

    });
});
var fromNewChat;
$('.sos').on('click', function () {
    fromNewChat = true;
    $('.contact').removeClass('active');
    $(this).addClass('active');
    var contactId = $(this).data('id');
    var userid = $(this).data('id');
    $.post('/Home/GetContactMessage', { minId: '0', contactId: contactId }, function (res) {

        $('.loading').hide();
        if (res == null || res.length == 0)
            SetEmptyMessage();
        else {
            SetResultOfMessage(res);
            $('.contact.active .text-bg-success').html("0");
        }
    });
});

$.fn.bsShow = function () {
    $(this).removeClass('d-none');
}

$.fn.bsHide = function () {
    $(this).addClass('d-none');
}
$('#forwardModal .close').on('click', function () {
    $('#forwardModal').modal('hide');
});
$('#deleteModal .close , #btn-cancel-delete').on('click', function () {
    $('#deleteModal').modal('hide');
});
$('#selectContactModal .close').on('click', function () {
    $('#selectContactModal').modal('hide');
});

$('#VideoCallModal .close').on('click', function () {
    $('.hangup').trigger('click');
});

$('#VideoCallModal .hangup').on('click', function () {
});
