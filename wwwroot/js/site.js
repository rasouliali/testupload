// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

//const { type } = require("jquery");

// Write your JavaScript code.
//var firstCall = true;
var faTrashClicked = false;
var SelectLi = false;
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
        searchContact()
    }   
});
function searchContact() {
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

                var str = `<li class="contact new-search-mess"  data-id="` + dataItem[i].userId.toLowerCase() + `">
                        <div class="wrap">
                            <span class="contact-status `+ statusStr + `"></span>` +
                    (dataItem[i].profilePic ? '<img src="/ProfilePics/thumbnails/' + dataItem[i].profilePic + '" alt="" />' : '<img src="/user-profile.png" alt="" />') +
                    `<div class="meta">
                                <p class="name">`+ dataItem[i].userName + (data.id == myUserId ? "<span class='badge text-info'>(You)</span>" : "") + `<span></span></p>
                                <p class="preview"></p>
                            </div>
                        </div>
                    </li>`;
                $('#contacts ul').append(str);
                $('.new-search-mess').on('click', function () {
                    fromNewChat = false;
                    $('.contact').removeClass('active');
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

                        wsconn.invoke("SeenMessege", "all", contactId)
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
function SetEmptyMessage(username) {
    
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
    var smallUsername = "";
    var userRole = "";
    if ($('.contact.active').hasClass('grp')) {

        username = !username ? $('.contact.active .group-name').html() : username;
        //username = username.split('span').join('').split('<').join('').split('>').join('').split('/').join('');
        smallUsername = username.length > 30 ? username.substring(0, 29) + '...' : username;
        userRole = $('.contact.active .chat-bio').text();
    } else {
        username = !username ? $('.contact.active .name').html() : username;
        //username = username.split('span').join('').split('<').join('').split('>').join('').split('/').join('');
        smallUsername = username.length > 30 ? username.substring(0, 29) + '...' : username;
        var userCmp = $('.contact.active .company').text();
        userRole = $('.contact.active .role').text();

    }
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
								<label class="role">`+ userRole + `</label>
							</div>
						</div>

						<div class="float-end text-end">
						  <div class="text-start float-end btn px-0">
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Deselect"><i class="fa fa-remove"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Copy"><i class="fa-solid fa-copy"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Forward"><i class="fa-solid fa-share"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Reply"><i class="fa-solid fa-reply"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Edit"><i class="fa fa-edit"></i></a>
							<a class="active text-light d-none" aria-current="page" href="#" title="Remove"><i class="fa-solid fa-trash"></i></a>
							`+ (!$('.contact.active').hasClass('grp') ? `
							    <a class="active text-light pr-2" aria-current="page" href="#"><i class="fas fa-phone"></i></a>
							    <a class="active text-light" aria-current="page" href="#"><i class="fas fa-video"></i></a>`
                            :
                                `<a class="active text-light d-none" aria-current="page" href="#"><i class="fa fa-info-circle"></i></a>`) +`
						  </div>
						</div>
					</div>
				  </div>
				</div>
			  </div>
			  <div class="row tab-div">
				<div class="chat-pm">
        `+ strLi + `
        
					<div id="drop-area" class="chat-pm-input ">
						
						<textarea rows="1" class="w-100 form-control" ></textarea>
						<div class="send-btn">
                            <div class="input-group-append" id="microphone_btn">
                                <span class="input-group-text microphone_btn"><i class="fa fa-microphone"></i></span>
                            </div>
                            <div class="input-group-append" id="stopButton">
                                <span class="input-group-text stopButton"><i class="fa fa-stop-circle"></i></span>
                            </div>
							<img class="attach" src="/img/attach_file.png" />
							<img class="send" src="/img/send-icon.svg" />
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
    backToTop();

    handleDropFileArea();
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

        VideoCallProcess()
    });
    $('.fa-phone').on('click', function () {
        VoiceCallProcess();
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
        $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)

            //$('.chat-pm ul').scrollTop($('#lastchat').offset().top);
        //$('.chat-pm ul').scrollTop($('.chat-pm ul').offset().top);

    }, 500);
    setSomeFeatureForSendingMess();
    loadRecData();
    //videoAndVoiceCallClick();
    $('li .card .card-header').on('click', function () {
        var FFSenderid = $(this).data('senderid');//if forward from another one and click on sender name
        if (FFSenderid) {//if forward from another one and click on sender name
            $('#ChatPmModal').modal('hide');
            $('.contact.active').removeClass("active");
            $('.contact[data-id="' + FFSenderid.toLowerCase() + '"]').addClass("active");
            setTimeout(function () {
                $('.contact[data-id="' + FFSenderid.toLowerCase() + '"]').trigger('click');
            }, 400);
            return;
        }
        var itemId = $(this).parent().data('id');
        var offsetTop = $('[data-id="' + itemId + '"]').get(0).offsetTop - 150;
        offsetTop = offsetTop > 0 ? offsetTop : 0;
        $(".chat-pm ul").scrollTop(offsetTop);

        $('[data-id="' + itemId + '"]').eq(0).css("background", "black");
        setTimeout(function () {
            $('[data-id="' + itemId + '"]').eq(0).css("background", "transparent");
        }, 500)
        setTimeout(function () {
            $('[data-id="' + itemId + '"]').eq(0).css("background", "black");
        }, 1000)
        setTimeout(function () {
            $('[data-id="' + itemId + '"]').eq(0).css("background", "transparent");
        }, 1500)
    });
    //setSomeFeatureForSendingMess();

}
function handleDropFileArea() {
    let dropArea = document.getElementById('drop-area');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {

        dropArea.addEventListener(eventName, preventDefaults, false)
    });

    function preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    });

    function highlight(e) {
        dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight')
    }

    dropArea.addEventListener('drop', handleDrop, false)

    function handleDrop(e) {
        let dt = e.dataTransfer
        let file = dt.files[0]

        //var file = _("fileinput").files[0];
        var formdata = new FormData();
        formdata.append("file1", file);

        var contactId = $('.contact.active').data('id');
        formdata.append("contactId", contactId);

        formdata.append("replyId", replyid);

        var strLi = `<li class="from-me" id="tempProgressBar" >
              <div class="progress">
                <div class="progress-bar" id="my-progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
              </div>
            </li>`;
        $('#lastchat').before(strLi);
        $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
        setTimeout(function () {
            $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
        }, 500)
        //submitForm();
        //$('#submitBtnFormUploader').trigger('click');
        uploadFile(formdata);
    }
}
var dt1;
//function beepRing() {
//    beepring.play()
//}
function VideoCallProcess() {
    try {
        console.log("IsCameraPermission:" + IsCameraPermission);

        if (IsCameraPermission == false) {
            IsCameraPermission = JSBridge.getVideoPermission();
            console.log("IsCameraPermission:" + IsCameraPermission);
            return;
        }
    } catch { }
    if (wsconn.connectionState != "Connected") {
        SendNotConnectAlert("you are not connect to signalr. For video call you must refresh page. For refresh page touch on ok button.")
        return;
    }
    beepring.play()
    beepring.volume = 0.3;
    //beepRing();
    $('#call-status-lbl').html('video calling to user...');

    isVideoCall = true;
    console.log('calling user... ');
    $('#VideoCallModalLabel').html("Video Call");

    dt1 = new Date();
    videoaudiotimer = setTimeout(timerDisplayFun, 1000);
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
        alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.').set({ title: "ZN Vostok" }).set({ delay: 5000 });
        return;
    }

    // Then make sure we aren't calling ourselves.
    //if (targetConnectionId != myConnectionId) {
    if (UserId != myUserId) {
        // Initiate a call
        $.post('/Home/CallLogUpdate', { IsVideo: true, Status: 1, ToUser: UserId }, function () {

        });
        initializeUserMediaVideo();
        wsconn.invoke('callUser', UserId, true  /*{ "connectionId": targetConnectionId}*/);

        dt1 = new Date();
        setTimeout(timerDisplayFun, 1000);
        // UI in calling mode
        $('body').attr('data-mode', 'calling');
        $('#VideoCallModal').modal('show');
        //$('#ChatPmModal').modal('hide');

        $("#callstatus").text('Calling...');
    } else {
        alertify.error("Ah, nope.  Can't call yourself.").set({ title: "ZN Vostok" }).set({ delay: 5000 });
    }
}
function VoiceCallProcess() {
    try {
        console.log("IsMicrophonePermission:" + IsMicrophonePermission);
        if (IsMicrophonePermission == false) {
            IsMicrophonePermission = JSBridge.getAudioPermission();
            console.log("IsMicrophonePermission:" + IsCameraPermission);
            return;
        }
    } catch { }
    if (wsconn.connectionState != "Connected") {
        SendNotConnectAlert("you are not connect to signalr. For voice call you must refresh page. For refresh page touch on ok button.")
        return;
    }
    beepring.volume = 0.3;
    beepring.play();

    $('#call-status-lbl').html('voice calling to user...');
    //beepRing();
    isVideoCall = false;

    dt1 = new Date();
    videoaudiotimer = setTimeout(timerDisplayFun, 1000)

    localVideo.style.display = 'none';
    remoteVideo.style.display = 'none';
    $('#VideoCallModalLabel').html("Voice Call");
    //$('.partner')[0].style.display = '';

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
        alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.').set({ title: "ZN Vostok" }).set({ delay: 5000 });
        return;
    }

    // Then make sure we aren't calling ourselves.
    //if (targetConnectionId != myConnectionId) {
    if (UserId != myUserId) {
        // Initiate a call
        $.post('/Home/CallLogUpdate', { IsVideo: false, Status: 1, ToUser: UserId }, function () {

        });
        initializeUserMediaVoice();
        wsconn.invoke('callUser', UserId, false  /*{ "connectionId": targetConnectionId}*/);

        // UI in calling mode
        $('body').attr('data-mode', 'calling');
        $('#ChatPmModal').modal('hide');
        $('#VideoCallModal').modal('show');
        $("#callstatus").text('Calling...');
    } else {
        alertify.error("Ah, nope.  Can't call yourself.").set({ title: "ZN Vostok" }).set({ delay: 5000 });
    }
}
function timerDisplayFun() {
    var dt2 = new Date();
    var diff = dt2 - dt1;
    var sec = Math.floor((diff * 1.0 / 1000) % 60);
    var min = Math.floor(diff * 1.0 / 1000 / 60);
    document.querySelector(".recording-timer-display label").innerHTML = (min < 10 ? "0" : "") + min.toString() + ":" + (sec < 10 ? "0" : "") + sec.toString();

    videoaudiotimer = setTimeout(timerDisplayFun, 1000);
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
            alertify.error(e).set({ title: "ZN Vostok" }).set({ delay: 5000 });

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
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.').set({ title: "ZN Vostok" }).set({ delay: 5000 });
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
            alertify.error("Ah, nope.  Can't call yourself.").set({ title: "ZN Vostok" }).set({ delay: 5000 });
        }
    });
    $('.social-media .fa-phone').on('click', function () {
        isVideoCall = false;

        localVideo.style.display = 'none';
        remoteVideo.style.display = 'none';
        try {
            Android.loadMicrophone();
        } catch (e) {
            alertify.error(e).set({ title: "ZN Vostok" }).set({ delay: 5000 });

        }

        dt1 = new Date();
        videoaudiotimer = setTimeout(timerDisplayFun, 1000)
        $('#VideoCallModalLabel').html("Voice Call");
        //$('.partner')[0].style.display = '';

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
            alertify.error('Sorry, you are already in a call.  Conferencing is not yet implemented.').set({ title: "ZN Vostok" }).set({ delay: 5000 });
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
            alertify.error("Ah, nope.  Can't call yourself.").set({ title: "ZN Vostok" }).set({ delay: 5000 });
        }
    });
}
function SetResultOfMessage(res, showInChat, username) {
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
                             (res[i].grpContactName ? "<div class='name'>" + res[i].grpContactName + "</div>" : "")+
                (res[i].body.indexOf(',;,') >= 0
                    ?
                    `<div class="card" data-id="` + (res[i].replyId ? res[i].replyId : "") + `" >
                      <div class="card-header" `+ ForwardSenderId(res[i].body) +`>` +
                res[i].body.split(',;,')[0].split(',@,')[0] + `
                      </div><label`+ checkRtlOfText(res[i].body.split(',;,')[1]) + `>` + textToWrite(res[i].body.split(',;,')[1]) +
                `</label></div>`
                    :
                 `<label` + checkRtlOfText(res[i].body) + `>` + textToWrite(res[i].body) + `</label>`
                )
                + (res[i].isReciver ? `<span class="` + IsSeen(res[i]) + `">✓</span>` : "")+
                `</li><li class="` + (res[i].isReciver ? "from-me" : "from-other") + `" >
                    <div class="date">`+ getNiceDateTimeFormat(res[i].createdDate) + `</div>
                </li>`;
           // checkRtlOfText() textToWrite()

        } else {
            var resArr = [];
            resArr.push(res[i].body);
            var headerText = "";
            if (res[i].body.indexOf('^') >= 0) {
                resArr = res[i].body.split('^');
                headerText = "";//res[i].body.split(',;,')[0];
            }
            for (var j = 0; j < resArr.length; j++) {
                var filePath = resArr[j];
                if (resArr[j].indexOf(',;,') > 0) {
                    filePath = resArr[j].split(',;,')[1];
                    headerText = resArr[j].split(',;,')[0];
                    resArr[j] = resArr[j].replace(',;,', ' ');
                }

                strLi += `<li class="` + (res[i].isReciver ? "from-me" : "from-other") + `" data-id="` + res[i].id + `" >`;
                strLi += (res[i].grpContactName ? "<div class='name'>" + res[i].grpContactName + "</div>" : "");
                if (headerText)//begin header of reply card
                    //`<img src="` + (res[i].isReciver ? $('#profile-img').attr('src') : $('.contact.active img').attr('src')) + `" alt="" />`;
                strLi += `<div class="card" data-id="` + (replyid ? replyid : "") + `" >
                      <div class="card-header " `+ ForwardSenderId(headerText)+`>` +
                    headerText.split(',@,')[0] +
                        `</div>`;
                if (IsImage(filePath)) {
                    strLi += `<label ><a href="#" data-url="/Home/GetFile?fileName=` + filePath + `&fileType=up" class="img-tag"><div><img  class="fupload" src="/Home/GetFile?fileName=` + filePath + `&fileType=up&th=true" /></div><div>` + SimpleFileName(filePath) +`</div></a></label>`;

                }
                else if (IsAudio(filePath))
                    strLi += `<label><div><audio controls src="/Home/GetFile?fileName=` + filePath + `&fileType=up" ></audio></div><div> ` + SimpleFileName(filePath) + `</div></label>`;
                else if (IsVideo(filePath))
                    strLi += `<label><div><video controls  ><source src="/Home/GetFile?fileName=` + filePath + `&fileType=up" ></video></div><div> ` + SimpleFileName(filePath) + `</div></label>`;
                else if (IsPdfOrDoc(filePath))
                    strLi += `<label><a href="/Home/GetFile?fileName=` + filePath + `&fileType=up" target="_blank" ><div><img class="docpdfimg" src="/Home/GetFile?fileName=` + filePath.substring(0, filePath.lastIndexOf('.')) + `.jpg&fileType=up&th=true" /></div><div>` + SimpleFileName(filePath) + `</div></a></label>`;
                else
                    strLi += `<label><a href="/Home/GetFile?fileName=` + filePath + `&fileType=up" target="_blank" ><div><img src="/img/file-icon.png" class="img-ico" /></div><div>` + SimpleFileName(filePath) + `</div></a></label>`;
                if (headerText)//end header of reply card
                    strLi += `</div>`;
                strLi += (res[i].isReciver ? `<span class="` + IsSeen(res[i]) + `">✓</span>` : "") + `</li>`;
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
    var smallUsername = "";
    var userRole = "";
    if ($('.contact.active').hasClass('grp')) {

        username = !username ? $('.contact.active .group-name').html() : username;
        //username = username.split('span').join('').split('<').join('').split('>').join('').split('/').join('');
        smallUsername = username.length > 30 ? username.substring(0, 29) + '...' : username;
        userRole = $('.contact.active .chat-bio').text();
    } else {
        username = !username ? $('.contact.active .name').html() : username;
        //username = username.split('span').join('').split('<').join('').split('>').join('').split('/').join('');
        smallUsername = username.length > 30 ? username.substring(0, 29) + '...' : username;
        var userCmp = $('.contact.active .company').text();
        userRole = $('.contact.active .role').text();

    }
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
							<div class="pro-small" >
								<label class="name">`+ smallUsername + `</label>
								<label class="role">`+ userRole +`</label>
							</div>
						</div>

						<div class="float-end text-end">
						  <div class="text-start float-end btn px-0">
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Deselect"><i class="fa fa-remove"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Copy"><i class="fa-solid fa-copy"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Forward"><i class="fa-solid fa-share"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Reply"><i class="fa-solid fa-reply"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Edit"><i class="fa fa-edit"></i></a>
							<a class="active text-light pr-2 d-none" aria-current="page" href="#" title="Remove"><i class="fa-solid fa-trash"></i></a>
							`+ (!$('.contact.active').hasClass('grp') ? `
							    <a class="active text-light pr-2" aria-current="page" href="#"><i class="fas fa-phone"></i></a>
							    <a class="active text-light" aria-current="page" href="#"><i class="fas fa-video"></i></a>`
                            :
                                `<a class="active text-light d-none" aria-current="page" href="#"><i class="fa fa-info-circle"></i></a>`) +`
						  </div>
						</div>
					</div>
				  </div>
				</div>
			  </div>
			  <div class="row tab-div">
				<div class="chat-pm">
        `+ strLi + `
                <a href="#" class="back-to-top z-3 d-flex align-items-center justify-content-center active"><i class="fa fa-arrow-down"></i></a>
					<div id="drop-area" class="chat-pm-input ">
						<textarea rows="1" class="w-100 form-control" ></textarea>
						<div class="send-btn">
                            <div class="input-group-append" id="microphone_btn">
                                <span class="input-group-text microphone_btn"><i class="fa fa-microphone"></i></span>
                            </div>
                            <div class="input-group-append" id="stopButton">
                                <span class="input-group-text stopButton"><i class="fa fa-stop-circle"></i></span>
                            </div>
							<img class="attach" src="/img/attach_file.png" />
							<img class="send" src="/img/send-icon.svg" />
						</div>
					</div>
                </div>
            </div>`;


    $('#ChatPmModal .modal-body').html(mess);
    backToTop()
    handleDropFileArea();
    $('.img-tag').on('click', function () {
        if (SelectLi == false) {

            var url = $(this).data('url');
            loadImageModal(url);
        }
    });
    $('#close-img-modal').on('click', function () {
            $('#imgViewerModal').modal('hide');
    })

    $('#ChatPmModal').modal('show');
    $('.pro-small').on('click', function () {
        $('.loading').show();
        window.location.href = "/Home/Profile?uid=" + $('.contact.active').data('id') + '&IsGroup=' + $('.contact.active').hasClass('grp');
    });
    $('#ChatPmModal .close').on('click', function () {
        if (fromNewChat) {
            $('.loading').show();
            window.location.href = "/";
        }
        else {
            $('.contact').removeClass('active');
            $('#ChatPmModal').modal('hide');
        }
    });
    $('.chat-pm-input textarea').on('keyup', function () {
        var inputData = $(this).val();
        if (hasPersian(inputData))
            $(this).addClass('rtl');
        else
            $(this).removeClass('rtl');
    });
    //$('#nameofcontact').tooltip();
    //$('#nameofcontact').on('click', function () {
    //    setTimeout(function () {
    //        $('[data-toggle="tooltip"]').tooltip('disable');
    //        $('[data-toggle="tooltip"]').tooltip('enable');
    //    }, 3000);
    //});

    $('.fa-video').on('click', function () {
        VideoCallProcess(); 
    });
    $('.fa-phone').on('click', function () {
        VoiceCallProcess();
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
        if (!showInChat)
            $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
        //$('.chat-pm ul').scrollTop($('#lastchat').offset().top);
        else {
            $('.chat-pm ul').scrollTop($('[data-id="' + showInChat + '"]').offset().top);
            $('#showinchatStyle').html('[data-id="' + showInChat +'"]{background:black}')
            setTimeout(function () {
                $('#showinchatStyle').html('')
            }, 500);
            setTimeout(function () {
                $('#showinchatStyle').html('[data-id="' + showInChat +'"]{background:black}')
            }, 1000);
            setTimeout(function () {
                $('#showinchatStyle').html('')
            }, 1500);
        }


    }, 500);
    setSomeFeatureForSendingMess();
    loadRecData();

    $('li .card .card-header').on('click', function () {
        var FFSenderid = $(this).data('senderid');//if forward from another one and click on sender name
        if (FFSenderid) {//if forward from another one and click on sender name
            $('#ChatPmModal').modal('hide');
            $('.contact.active').removeClass("active");
            $('.contact[data-id="' + FFSenderid.toLowerCase() + '"]').addClass("active");
            setTimeout(function () {
                $('.contact[data-id="' + FFSenderid.toLowerCase() + '"]').trigger('click');
            }, 400);
            return;
        }
        var itemId = $(this).parent().data('id');
        $(".chat-pm ul").scrollTop($('[data-id="' + itemId + '"]').get(0).offsetTop-200);

        $('[data-id="' + itemId + '"]').eq(0).css("background", "black");
        setTimeout(function () {
            $('[data-id="' + itemId + '"]').eq(0).css("background", "transparent");
        },500)
        setTimeout(function () {
            $('[data-id="' + itemId + '"]').eq(0).css("background", "black");
        }, 1000)
        setTimeout(function () {
            $('[data-id="' + itemId + '"]').eq(0).css("background", "transparent");
        }, 1500)
    });
    //$('.messages li:not(.cl)').on('click', function () {
    //    if ($(this).find('span').length == 0 && $(this).hasClass('lmore') == false)
    //        $(this).append("<span>" + getNiceDateTimeFormat($(this).data('time')) + "</span>");
    //});
    //$('.messages li:not(.cl)').addClass('cl');
    //$('.messages').scrollTop($('.messages').offset().top);
    //$('.chat-pm ul').scrollTop($('.chat-pm ul').offset().top);
    //$('.messages').scrollTop($('#lastchat').offset().top);
}
function SimpleFileName(filePath) {
    if (filePath) {
        if (filePath.length > 25)
            return filePath.substring(0, 12) + '...' + filePath.substring(filePath.length - 10);
        return filePath;
    }
    return "";
}
function ForwardSenderId(elem) {
    if (elem && elem.indexOf(',@,') > 0)
        return ` data-senderid="` + elem.split(',@,')[1].split('>>')[0] + `" `;
    return "";
}
function IsSeen(data) {
    if (data.isSeen || data.isSeen==null)
        return 'seen';
    return '';

}
/*
solid fa-share fa-2
solid fa-reply fa-2
 fa-trash-can-xmark
*/

function loadImageModal(url) {

    var imgurl = url;
    $('#img').attr("src", imgurl);
    $('#download-img').attr("href", imgurl);

    start();
    $('#img').removeClass('d-none');
    $("#imgViewerModal").modal("show");
    $('#img').on('load', function () {

        var imgW = this.width;
        var imgH = this.height;
        var rate=0;
        if (imgW > imgH) {
            rate = 1.0 * imgW / imgH;

            var newWidth = Math.floor($(window).width() );
            var newHeight = Math.floor(newWidth / rate);
            if (Math.floor($(window).height()) < newHeight) {
                var newRate = newHeight / (newHeight - $(window).height() - 160);
                newWidth = Math.floor(newWidth / newRate);
                newHeight = Math.floor(newHeight - $(window).height() - 160);
            }
            $('#canvas').attr("height", newHeight);
            $("#canvas").attr("width", newWidth);
            $('#img').addClass('d-none');
        }
        else {
            rate = 1.0 * imgH / imgW;

            var newHeight = Math.floor($(window).height()-160);
            var newWidth = Math.floor(newHeight / rate);
            if (Math.floor($(window).width()) < newWidth) {
                var newRate = newWidth / (newWidth - $(window).width()-50);
                newWidth = Math.floor((newWidth - $(window).width() - 50));
                newHeight = Math.floor(newHeight - newRate);
            }
            //if (Math.floor($(window).height()) < newHeight) {
            //    var newRate = $(window).height() / newWidth;
            //    newWidth = Math.floor($(window).width());
            //    newHeight = Math.floor(newWidth / newRate);
            //    var newRate = newHeight / $(window).height();
            //    newHeight = Math.floor($(window).height() );
            //    newWidth = Math.floor(newHeight / newRate);
            //}
            $('#canvas').attr("height", newHeight );
            $("#canvas").attr("width", newWidth);
            $('#img').addClass('d-none');
        }

        initDraw();

        $('.loading').hide();
    });
    $('.loading').show();
}
function contact_must_be_selected(elem) {

    if (elem && elem.hasClass('selected')) {
        elem.removeClass('selected');
    }
    else if (elem) {
        elem.addClass('selected');
    }
    if ($('.chat-pm li.selected').length == 0) {
        SelectLi = false;
        $('.fa-video').parent().bsShow();
        $('.fa-phone').parent().bsShow();
        $('.pro-small').parent().bsShow();
        $('.fa-share').parent().bsHide();
        $('.fa-reply').parent().bsHide();
        $('.fa-copy').parent().bsHide();
        $('.fa-edit').parent().bsHide();
        $('.fa-info-circle').parent().bsHide();
        $('.modal-body .fa-trash').parent().bsHide();
        $('.fa-remove').parent().bsHide();
    }
    else if ($('.chat-pm li.selected').length == 1) {
        SelectLi = true;
        $('.fa-video').parent().bsHide();
        $('.fa-phone').parent().bsHide();
        $('.pro-small').parent().bsHide();
        $('.fa-share').parent().bsShow();
        $('.fa-reply').parent().bsShow();
        if($('.chat-pm li.selected').hasClass('from-me'))
            $('.fa-info-circle').parent().bsShow();
        else
            $('.fa-info-circle').parent().bsHide();
        if($('.chat-pm li.selected').hasClass('from-me'))
            $('.fa-edit').parent().bsShow();
        else
            $('.fa-edit').parent().bsHide();
        if($('.chat-pm li.selected').hasClass('from-me'))
            $('.modal-body .fa-trash').parent().bsShow();
        else
            $('.modal-body .fa-trash').parent().bsHide();
        $('.fa-remove').parent().bsShow();
    }
    else {
        SelectLi = true;
        $('.fa-phone').parent().bsHide();
        $('.fa-video').parent().bsHide();
        $('.pro-small').parent().bsHide();
        $('.fa-share').parent().bsShow();
        $('.fa-reply').parent().bsHide();
        $('.fa-copy').parent().bsHide();
        $('.fa-info-circle').parent().bsHide();
        $('.fa-edit').parent().bsHide();
        if (canRemove())
            $('.modal-body .fa-trash').parent().bsShow();
        else
            $('.modal-body .fa-trash').parent().bsHide();
        $('.fa-remove').parent().bsShow();
    } 
    
        
}
function canRemove() {
    var remove = true;
    $('.chat-pm li.selected').each(function (index, elem) {
        if (!$(elem).hasClass('from-me')) {
            remove = false;
            return false;//return false means break in jquery each;
        }
    });
    return remove;
}
$('#showInChatBtn').on('click', function () {
    if ($('.nav-link.active').attr('data-bs-target') == "#images-tab") {
        var TagId = $('.img-tag.selected').data('id');
        window.location.href = "/?showInChat=" + TagId;
    } else if ($('.nav-link.active').attr('data-bs-target') == "#files-tab") {
        var TagId = $('.file-tag.selected').data('id');
        window.location.href = "/?showInChat=" + TagId;

    } else if ($('.nav-link.active').attr('data-bs-target') == "#voices-tab") {
        var TagId = $('.voice-tag.selected').data('id');
        window.location.href = "/?showInChat=" + TagId;
    }
});
function image_must_be_selected(elem) {
    if (elem && elem.hasClass('selected'))
        elem.removeClass('selected');
    else if (elem)
        elem.addClass('selected');
    if ($('.img-tag.selected').length == 0) {
        $('#selectedItembtn').bsHide();
    }
    else if ($('.img-tag.selected').length == 1) {
        $('#selectedItembtn').bsShow();
    }
    else {
        $('#selectedItembtn').bsShow();
    }
}
function file_must_be_selected(elem) {
    if (elem && elem.hasClass('selected'))
        elem.removeClass('selected');
    else if (elem)
        elem.addClass('selected');
    if ($('.file-tag.selected').length == 0) {
        $('#selectedItembtn').bsHide();
    }
    else if ($('.file-tag.selected').length == 1) {
        $('#selectedItembtn').bsShow();
    }
    else {
        $('#selectedItembtn').bsShow();
    }
}
function voice_must_be_selected(elem) {
    if (elem && elem.hasClass('selected'))
        elem.removeClass('selected');
    else if (elem)
        elem.addClass('selected');
    if ($('.voice-tag.selected').length == 0) {
        $('#selectedItembtn').bsHide();
    }
    else if ($('.voice-tag.selected').length == 1) {
        $('#selectedItembtn').bsShow();
    }
    else {
        $('#selectedItembtn').bsShow();
    }
}
var innerHtmlReply = "";
var replyid = "";
var editid = "";
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
    $('.chat-pm li').unbind('mouseleave');
    $('.chat-pm li').unbind('mouseleave');
    $('.chat-pm li').unbind('touchstart');
    $('.chat-pm li').unbind('touchend');
    $('.chat-pm li').on('mousedown touchstart', function (event) {
        var elem = $(this);
        if (SelectLi && event.type == "mousedown") 
            contact_must_be_selected(elem)
        timeoutId = setTimeout(function () {
            contact_must_be_selected(elem)
        }, 1000);
    }).on('mouseup mouseleave touchend', function () {
        clearTimeout(timeoutId);
    });
}
var selectedImage = false;
function loadForSelectImage(){
    var timeoutId = 0;
    $('.img-tag').unbind('mousedown');
    $('.img-tag').unbind('mouseup');
    $('.img-tag').unbind('mouseleave');
    $('.img-tag').unbind('mouseleave');
    $('.img-tag').unbind('touchstart');
    $('.img-tag').unbind('touchend');
    $('.img-tag').on('mousedown touchstart', function () {
        var elem = $(this);
        selectedImage = false;
        timeoutId = setTimeout(function () {
            image_must_be_selected(elem)
            selectedImage = true;
        }, 1000);
    }).on('mouseup mouseleave touchend', function (event) {
        clearTimeout(timeoutId);
    });
}
var selectedFile = false;
function loadForSelectFile(){
    var timeoutId = 0;
    $('.file-tag').unbind('mousedown');
    $('.file-tag').unbind('mouseup');
    $('.file-tag').unbind('mouseleave');
    $('.file-tag').unbind('mouseleave');
    $('.file-tag').unbind('touchstart');
    $('.file-tag').unbind('touchend');
    $('.file-tag').on('mousedown touchstart', function () {
        var elem = $(this);
        selectedFile = false;
        timeoutId = setTimeout(function () {
            file_must_be_selected(elem)
            selectedFile = true;
        }, 1000);
    }).on('mouseup mouseleave touchend', function (event) {
        if (selectedFile)
            event.preventDefault()
        clearTimeout(timeoutId);
    });
    $('.filea').on('click', function (event) {
        if (selectedFile)
            event.preventDefault()
    })
}
var selectedVoice = false;
function loadForSelectVoice(){
    var timeoutId = 0;
    $('.voice-tag').unbind('mousedown');
    $('.voice-tag').unbind('mouseup');
    $('.voice-tag').unbind('mouseleave');
    $('.voice-tag').unbind('mouseleave');
    $('.voice-tag').unbind('touchstart');
    $('.voice-tag').unbind('touchend');
    $('.voice-tag').on('mousedown touchstart', function () {
        var elem = $(this);
        selectedVoice = false;
        timeoutId = setTimeout(function () {
            voice_must_be_selected(elem)
            selectedVoice = true;
        }, 1000);
    }).on('mouseup mouseleave touchend', function (event) {
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
    deselectBtnProcess();
    copyBtnProcess();
    replyBtnProcess();
    seenListBtnProcess();
    editBtnProcess();
    forwardBtnProcess();
    deleteBtnProcess();
}
function deleteBtnProcess() {

    $('.modal-body .fa-trash').on('click', function () {
        //deleteid = $(this).parent().parent().parent().data('id');
        $('#deleteModal').modal('show');
    });
    $('.del_').removeClass('del_').addClass('del');
}
$('#btn-submit-delete').on('click', function () {
    var ids = "";
    $('.chat-pm li.selected').each((e, elem) => { ids += $(elem).data('id') + ","; });
    ids = ids.substring(0, ids.length - 1);
    $.post('/Home/DelMess', { messid: ids }, function (res) {
        if (res.length > 0 && res[0].id > 0) {
            var contactId = $('.contact.active').data('id');
            sendBySignalRForDel(contactId, ids + ";;;" + userid);
            $.each(ids.split(','), function (index, elem) {

                $('.chat-pm li[data-id=' + elem + ']').next('.chat-pm li').remove();
                $('.chat-pm li[data-id=' + elem + ']').remove();
            });
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

        forwardid = "";
        $('.chat-pm li.selected').each((e, elem) => { forwardid += $(elem).data('id') + ","; });
        forwardid = forwardid.substring(0, forwardid.length - 1);
        //forwardid = $('.chat-pm li.selected').eq(0).data('id');
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

    $('.chat-pm li.selected').removeClass('selected')
    contact_must_be_selected();
});
$("#forwardModal").on("hidden.bs.modal", function () {
    forwardid = "";
    // put your default event here
});
function deselectBtnProcess() {
    $('.fa-remove').on('click', function () {
        $('.chat-pm li.selected').removeClass('selected')
        contact_must_be_selected();
    });
}
function copyBtnProcess() {
    $('.fa-copy').on('click', function () {
        var elem = HTMLEncode($('.chat-pm li.selected label').eq(0).text());
        $("#mycopytextarea").bsShow()
        $("#mycopytextarea").html(elem);
        var copyText = document.getElementById("mycopytextarea");
        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        $("#mycopytextarea").focus();
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);
        try { JSBridge.copyToClipboard(copyText.value); } catch { }
        // Alert the copied text
        $('.chat-pm li.selected').removeClass('selected')
        contact_must_be_selected();
        $("#mycopytextarea").bsHide()
    });
}
function HTMLEncode(str) {
    const symbols = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&apos;"
    }
    var newStr = str;
    for (const symbol in symbols) {
        if (newStr.indexOf(symbol) >= 0) {
            newStr = newStr.replaceAll(symbol, symbols[symbol])
        }
    }
    return newStr;
}
function replyBtnProcess() {
//fa-share
//fa-reply
//fa-trash
    $('.fa-reply').on('click', function () {
        $('.chat-pm-input .card-header a').trigger('click');
        forwardid = "";
        //if (!replyid) {
        innerHtmlReply = $('.chat-pm-input').eq(0).html();
        beforeReplytext = $('.chat-pm-input textarea').eq(0).val();
        //}
        var elem = $('.chat-pm li.selected').eq(0);
        if (elem) {

            replyid = elem.data('id');
            if (!replyid)
                replyid=elem.parent().data('id');
            //if (elem.tagName.get(0).toLowerCase() == "li")
            //    $('.chat-pm-input').html(`<div class="card" >
            //          <div class="card-header" data-id="`+ replyid + `">
            //            reply to file <span>X</span>
            //          </div>`+
            //        innerHtmlReply +
            //        `</div>`);
            //else
            var innerText = HTMLEncode(elem.get(0).innerText.length > 20 ? elem.get(0).innerText.substring(0, 20) : elem.get(0).innerText);
            $('.chat-pm-input').html(`<div class="card" >
                  <div class="card-header reply" data-id="`+ replyid + `">` +
                innerText +
                `<a class="float-end px-3">X</span></a></div>` +
                innerHtmlReply +
                `</div>`);

            $('.chat-pm-input textarea').val(beforeReplytext);
            $('.chat-pm-input textarea').focus();
            $('.chat-pm-input .card-header a').on('click', function () {
                beforeReplytext = $('.chat-pm-input textarea').val();
                $('.chat-pm-input').html(innerHtmlReply);
                replyid = "";

                $('.chat-pm textarea').val(beforeReplytext);
                loadRecData();
                sendMessagebtn();
            });
            sendMessagebtn();
            $('.chat-pm li.selected').removeClass('selected')
            contact_must_be_selected();
        }
    });
    $('.rep_').removeClass('rep_').addClass('rep');
}
function seenListBtnProcess() {
//fa-share
//fa-reply
//fa-trash
    $('.fa-info-circle').on('click', function () {
        $('.loading').show();
        var messId = $('.chat-pm li.selected').eq(0).data('id');
        $.post('/Home/GetSeenListMess', { messId }, function (res) {
            $('.loading').hide();
            var seenStr = "";
            if (res.length==0)
                seenStr = "<div>No one seen this messege.</div>";
            else if (res.length==1)
                seenStr = "<div>1 person seen this messege:</div>";
            else
            seenStr="<div>" + res.length.toString() + " people seen this messege:</div>";
            for (var i = 0; i < res.length; i++) {
                seenStr += `<div>` + res[i].name + ` - ` + getNiceDateTimeFormat(res[i].createdDate) + `</div>`;
            }
            alertify.alert(seenStr).set({ title: "ZN Vostok" });
        });
    });
}
function editBtnProcess() {
//fa-share
//fa-reply
//fa-trash
    $('.fa-edit').on('click', function () {
        $('.chat-pm-input .card-header a').trigger('click');
        forwardid = "";
        //if (!replyid) {
        innerHtmlReply = $('.chat-pm-input').eq(0).html();
        beforeCopytext = $('.chat-pm-input textarea').eq(0).val();
        //}
        var elem = $('.chat-pm li.selected').eq(0);
        if (elem) {
            editid = elem.data('id');
            if (!editid)
                editid =elem.parent().data('id');
            //if (elem.tagName.get(0).toLowerCase() == "li")
            //    $('.chat-pm-input').html(`<div class="card" >
            //          <div class="card-header" data-id="`+ replyid + `">
            //            reply to file <span>X</span>
            //          </div>`+
            //        innerHtmlReply +
            //        `</div>`);
            //else
            var innerText = HTMLEncode(elem.get(0).innerText.length > 20 ? elem.get(0).innerText.substring(0, 20) : elem.get(0).innerText);
            $('.chat-pm-input').html(`<div class="card" >
                  <div class="card-header reply" data-id="`+ replyid + `">` +
                innerText +
                `<a class="float-end px-3">X</span></a></div>` +
                innerHtmlReply +
                `</div>`);

            $('.chat-pm-input textarea').val(elem.find('label').text());
            $('.chat-pm-input textarea').focus();
            $('.chat-pm-input .card-header a').on('click', function () {
                beforeReplytext = $('.chat-pm-input textarea').val();
                $('.chat-pm-input').html(innerHtmlReply);
                editid = "";
                editId = "";

                $('.chat-pm textarea').val(beforeReplytext);
                loadRecData();
                sendMessagebtn();
            });
            sendMessagebtn();
            $('.chat-pm li.selected').removeClass('selected')
            contact_must_be_selected();
        }
    });
    $('.rep_').removeClass('rep_').addClass('rep');
}
function SendFileProcess() {
    $("#fileinput").unbind('change');

    $('#fileinput').on('change', function () {
        var fileInput = document.getElementById('fileinput');
        if (fileInput.files.length > 0) {
            var contactId = $('.contact.active').data('id');
            var strLi = `<li class="from-me" id="tempProgressBar" >
              <div class="progress">
                <div class="progress-bar" id="my-progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
              </div>
            </li>`;
            $('#lastchat').before(strLi);
            setTimeout(function () {
                $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
            }, 500)
            fileUploader(fileInput, contactId);

            //sendMess("file", id);
            //$('#loader').show();
            //$('#toUser').val(id);
            //$('form').submit();
        }
    });
    $('#fileinput').trigger('click');
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

        $.post('/Home/sendMess', { mess: mess, contactId: contactId, replyId: (forward ? "" : replyid), forwardId: (forward ? forwardid : ""), editId:editid }, function (res) {
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
                var editLi = "";
                for (var i = 0; i < res.length; i++) {//****************** always is one row but i write as my before code
                    //<img src="` + (res[i].isReciver ? $('#profile-img').attr('src') : $('.contact.active img').attr('src')) + `" alt="" />` +
                    editLi = res[i].body.indexOf(',;,') >= 0 ? textToWrite(res[i].body.split(',;,')[1]) : textToWrite(res[i].body);
                    strLi += `<li class ="from-me" data-id="` + res[i].id + `" data-time="` + res[i].createdDate + `">`+
                             (res[i].grpContactName ? "<div class='name'>" + res[i].grpContactName + "</div>" : "")+
                        (res[i].body.indexOf(',;,') >= 0 ?
                        (`<div class="newcard" data-id="` + (res[i].replyId ? res[i].replyId : "") + `" >
                              <div class="card-header">
                              ` + res[i].body.split(',;,')[0] + `
                              </div><label` + checkRtlOfText(res[i].body.split(',;,')[1]) +`>`+ textToWrite(res[i].body.split(',;,')[1]) +
                            `</label><span >✓</span></div>`)
                            :
                        `<label ` + checkRtlOfText(res[i].body) + `>` + textToWrite(res[i].body) + `</label><span >✓</span>`
                        ) +
                        `</li><li class ="from-me" >`+
                        `<div class="date" data-id="` + (res[i].replyId ? res[i].replyId : "") + `" >` + getNiceDateTimeFormat(res[i].createdDate)+`</div>` +
                        `</li>`;
                }
                if (editid)
                    $('li[data-id="' + editid + '"] label').html(editLi)
                else
                    $('#lastchat').before(strLi);
                $('li .newcard:not(.card) .card-header').on('click', function () {
                    var itemId = $(this).parent().data('id');
                    $(".chat-pm ul").scrollTop($('[data-id="' + itemId + '"]').get(0).offsetTop - 200);

                    $('[data-id="' + itemId + '"]').eq(0).css("background", "black");
                    setTimeout(function () {
                        $('[data-id="' + itemId + '"]').eq(0).css("background", "transparent");
                    }, 500)
                    setTimeout(function () {
                        $('[data-id="' + itemId + '"]').eq(0).css("background", "black");
                    }, 1000)
                    setTimeout(function () {
                        $('[data-id="' + itemId + '"]').eq(0).css("background", "transparent");
                    }, 1500)
                });
                $('li .newcard:not(.card)').addClass('card');
                //$('.messages li:not(.cl)').on('click', function () {
                //    if ($(this).find('span').length == 0)
                //        $(this).append("<span>" + getNiceDateTimeFormat($(this).data('time')) + "</span>");
                //});
                //$('.messages li:not(.cl)').addClass('cl');
                //$('.messages').scrollTop($('.messages').offset().top);
                $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
                //$(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
                //$('.chat-pm ul').scrollTop($('#lastchat').offset().top);
                //$('.chat-pm ul').scrollTop($('.chat-pm ul').offset().top);

                if (forward == false) {
                    $('.chat-pm-input textarea').val('')
                    if (replyid || editid) {
                        $('.chat-pm-input .card-header a').trigger('click');
                        replyid = "";
                        editid = "";
                    }
                } else
                    $('.chat-pm li').removeClass('selected');
                loadForSelectLi();
                //allDropDownButtonProcess();
            }
            if (forward ) 
                $('.chat-pm li').removeClass('selected');
            contact_must_be_selected()
            if ($('.contact.active').hasClass('grp'))
                sendBySignalRToGroup(contactId, res[0].createdDate + ";;;" + userid + ";;;" + res[0].body + ";;;" + res[0].id + ";;;" + (forward ? "" : replyid) + (forward ? forwardid : ""));
            else
                sendBySignalR(contactId, res[0].createdDate + ";;;" + userid + ";;;" + res[0].body + ";;;" + res[0].id + ";;;" + (forward ? "" : replyid) + (forward ? forwardid : ""));

            $('.chat-pm-input textarea').focus()
        });
    }
}
$('.def-mess').on('click', function () {

    if (faTrashClicked) {
        faTrashClicked = false;
        return;
    }
    var isGroup = $(this).hasClass("grp");
    fromNewChat = false;
    $('.loading').show()
    //$('#ChatPmModal').modal('show');
    //return;
    $('.contact').removeClass('active');
    $(this).addClass('active');
    var contactId = $(this).data('id');
    var userid = $(this).data('id');
    $.post('/Home/GetContactMessage', { minId: '0', contactId: contactId, isGroup }, function (res) {
        $('.loading').hide();
        if (res == null || res.length == 0)
            SetEmptyMessage();
        else {
            SetResultOfMessage(res);
            $('.contact.active .text-bg-success').html("0");
        }
        wsconn.invoke("SeenMessege", "all", contactId)

    });
});

$('#logout').on('click', function () {
    $('#logoutForm').submit();
});
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
    searchContact()
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
            var isOnline = ul && ul.find(u => u.userId.toLowerCase() == data.id.toLowerCase());
            datastr += `<div class="new-ch contact col-12` + (isOnline?" online":"")+`" data-id="`+data.id+`">
                            <div class="row">
                                <div class="col-12 mx-3 b-online">
                                    <div class="float-start mx-3 ">
                                        <img src="`+ data.profilePic +`" class="img-pro" />
                                    </div>
                                    <div class="float-start text-start d-contents px-2">
                                        <div class="pro">
                                            <label class="name">`+ (data.name ? data.name : data.username) + (data.id == myUserId ? "<span class='badge text-info'>(You)</span>" : "") +`</label>
                                            <label class="company">`+ data.companyName +`</label>
                                            <label class="role">`+ data.position +`</label>
                                        </div>
                                    </div>
                                    <div class="on-bor" ></div>
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
                wsconn.invoke("SeenMessege", "all", contactId)
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
        wsconn.invoke("SeenMessege", "all", contactId)
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

//$('#VideoCallModal .close').on('click', function () {
//    $('.hangup').trigger('click');
//});

//$('#VideoCallModal .hangup').on('click', function () {
//    $('.hangup').trigger('click');
//});

function IsImage(fileName) {
    var fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    var imgExtention = [".jpg", ".jpeg", ".bmp", ".png", ".gif", ".tiff"];
    if (imgExtention.includes(fileExtension))
        return true;
    return false;
}
function IsAudio(fileName) {
    var fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    var imgExtention = [".wav", ".mp3"];
    if (imgExtention.includes(fileExtension))
        return true;
    return false;
}
function IsVideo(fileName) {
    var fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    var imgExtention = [".mp4", ".webm", ".m4p", ".mkv", ".mpg", ".3gp", ".avi", ".mov", ".mp2", ".ogg", ".3gp", ".qt", ".3gp"];
    if (imgExtention.includes(fileExtension))
        return true;
    return false;
}
function IsPdfOrDoc(fileName) {
    var fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    var imgExtention = [".doc", ".docx", ".pdf"];
    if (imgExtention.includes(fileExtension))
        return true;
    return false;
}

$('#search-contact').on('keypress', function (e) {
    var text_search = $(this).val() + e.key;
    searchContact(text_search);
})
$('#search-contact').on('keyup', function (e) {
    if (e.keyCode == 13) {
        var text_search = $('#search-contact').val();
        searchContact(text_search);
    }
    if (e.keyCode == 8 || e.keyCode == 46) {
        setTimeout(function () {

            var text_search = $('#search-contact').val();
            searchContact(text_search);
        }, 100);
    }
})
function searchContact(text_search) {

    if (text_search) {
        $('.selectContact .new-ch').each(function (index, elem) {
            var text = $(elem).find('.pro').text().toLowerCase();
            if (text.indexOf(text_search.toLowerCase()) >= 0)
                $(elem).show();
            else
                $(elem).hide();
        });
    } else
        $('.selectContact .new-ch').show();

}
//function downloadPic(elem) {
//    if ($("#download-img").length == 0) {
//        var res = '<div class="d-none"><a id="download-img" href="' + $(elem).data("url") + '" download="" ></a></div>';
//        $('body').append(res)
//    } else {
//        $("#download-img").attr('href', $(elem).data("url"));
//    }
//    $("#download-img").trigger('click');
//}
$('#refresh-page-btn').on('click', function () {
    window.location.reload();
});
$('#localVideo , #remoteVideo').on('click', function () {
    if ($('#videoRemoteStyle').html().length == 0) {
        $('#videoRemoteStyle').html(`
            video#remoteVideo {
	            position: fixed;
	            top: 60vh;
	            left: 75vw;
	            width: 23vw;
	            height: 38vh;
                z-index:1;
            }
            video#localVideo {
	            position: fixed;
	            top: 0;
	            left: 0;
	            width: 100vw;
	            height: 100vh;
                z-index:0;
            }`);
    } else {
        $('#videoRemoteStyle').html('');
    }
});
function hasPersian(s) {
    if (s) {
        var PersianOrASCII = /[آ-ی]|([a-zA-Z])/;
        if ((m = s.match(PersianOrASCII)) !== null) {
            if (m[1]) {
                return false;
            }
            else { return true; }
        }
        else { return true; }
    }
    return false;
}
function checkRtlOfText(textBody) {
    return hasPersian(textBody) ? " class='direction-rtl'" : "";
}
function textToWrite(textBody) {
    return textBody.split('\n').join('<br />\n');

}
        /*
        
        */
//$('#my-uploader-form').submit(function (e) { e.preventDefault(); });
function backToTop() {
    let backtotop = $('.back-to-top').get(0);
    if (backtotop) {
        $(".chat-pm ul").get(0).addEventListener('scroll', function () {
            if ($(".chat-pm ul").get(0).scrollHeight - $(".chat-pm ul").scrollTop() > $(window).height()*1.5) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        });
    }
    $('.back-to-top,.fa-arrow-down').on('click', function () {
        $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight);
    });
}
$('.contact .fa-trash').on('click', function () {
    faTrashClicked = true;
    var contact = $(this).parent().parent().parent();
    var contactId = contact.data('id');
    if (confirm("Are you share to delete this chat?")) {
        $.post('/Home/DeleteChat', {}, function () {
            contact.remove();
        });
    }
});

$('.del-chat').on('click', function () {
    $('.contacts .fa-trash').each(function (index, elem) {
        if ($(elem).parent().hasClass('d-none'))
            $(elem).parent().removeClass('d-none');
        else
            $(elem).parent().addClass('d-none');
    })
});
$('.fa-search').on('click', function () {
    $('#SearchModal input').val('');
    $('#SearchModal').modal('show');
});



$('#search-data').on('keydown', function (e) {
    if (e.keyCode == 13) {
        searchContent();
    }
});

function searchContent() {
    var searchKey = $('#SearchModal input').val();
    if (searchKey) {
        $('#search-contents').html('');
        $.post('/Home/GetSearchContent', { searchKey }, function (dataItem) {
            if (dataItem.length == 0) {
                var str =
                    `<ul><li class="content new-search-content">
                        <div class="wrap">
                            <div class="meta">
                                <p class="name">Not Found</p>
                                <p class="preview">nothing!</p>
                            </div>
                        </div>
                    </li></ul>`;
                $('#search-contents').append(str);
                return;
            }
            var str = "";
            for (var i = 0; i < dataItem.length; i++) {

                str +=
                    `<div class="new-ch content col-12 m-2 " data-id="` + dataItem[i].id + `">
                            <div class="row">
                                <div class="col-12 mx-3">
                                    <div class="float-start mx-3 ">`+
                (dataItem[i].profilePic ? '<img src="/ProfilePics/thumbnails/' + dataItem[i].profilePic + '" class="img-pro" />' : '<img src="/user-profile.png" class="img-pro" />') +
                                    `</div>
                                    <div class="float-start text-start d-contents px-2">
                                        <div class="pro">
                                            <label class="name">`+ (dataItem[i].contactName) + `</label>
                                            <label class="role">`+ (dataItem[i].body.length > 30 ? dataItem[i].body.substring(0, 30) : dataItem[i].body) + `</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            }
            $('#search-contents').append(str);
            $('.content').on('click', function () {
                var TagId = $(this).data('id');
                $('.loading').show();
                window.location.href = "/?showInChat=" + TagId;
            });
        });
    }
    else {
        $('.new-search-mess').hide();
        $('.def-mess').show();

    }

}

$('#SearchModal .fa-arrow-left').on('click', function () {
    $('#SearchModal').modal('hide');
});
$('#CreateGroupModal .fa-arrow-left').on('click', function () {
    $('#CreateGroupModal').modal('hide');
});
$('#calllog-tab').on('click', function () {
    $('.calls').html('');
    $.post('/home/getcall', null, function (dataitem) {
        var str = "";
        for (var i = 0; i < dataitem.length; i++) {
            str +=
                `<div class="new-ch content col-12 m-2">
                            <div class="row">
                                <div class="col-12 mx-3">
                                    <div class="float-start mx-3 ">`+
                (dataitem[i].profilePic ? '<img src="/profilepics/thumbnails/' + dataitem[i].profilePic + '" class="img-pro" />' : '<img src="/user-profile.png" class="img-pro" />') +
                `</div>
                                    <div class="float-start text-start d-contents px-2">
                                        <div class="pro">
                                            <label class="name">`+ (dataitem[i].contactName) + `</label>
                                            <label class="role">`+ (dataitem[i].isVideo ? "video call" : "voice call") + '  Duration:' + getDuraton(dataitem[i].duration) + `</label>
                                            <label class="role">`+ getNiceDateTimeFormat(dataitem[i].createdDate) + `</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        }
        $('.calls').html(str);
    });
});

function getDuraton(duration) {
    var dur = Math.round(duration);
    var durStr = "";
    if (dur > 60)
        durStr = Math.floor(dur / 60) < 10 ? "0" + Math.floor(dur / 60) : Math.floor(dur / 60);
    durStr += (durStr ? ":" : "00:") + (Math.floor(dur % 60) < 10 ? "0" + Math.floor(dur % 60) : Math.floor(dur % 60));
    return durStr;
}

$('.newgroupCreate').on('click', function () {

    $.post('/Home/AllContact', {}, function (datas) {
        var datastr = '';
        var selectData = '';
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            selectData += `<option value="` + data.id + `">` + (data.name ? data.name : data.username)+"</option>";

        }
        datastr = `<div class="content row">
                        <div class="col-lg-3 col-md-4 col-sm-6 px-3">
                            <label for="Title">Title</label>
                            <input id="Title" name="Title" class="form-control" />
                            <span asp-validation-for="Title" class="text-danger"></span>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-6 px-3">
                            <label asp-for="GroupBIO">GroupBIO</label>
                            <input id="GroupBIO" name="GroupBIO" class="form-control" />
                            <span asp-validation-for="GroupBIO" class="text-danger"></span>
                        </div>
                        <div class="col-12 px-3">
                            <label asp-for="GroupUserIds">Users</label>
                            <select id="GroupUserIds" name="GroupUserIds" class="form-control select-search" multiple="">
                            `+ selectData +`
                            </select>
                            <span asp-validation-for="GroupUserIds" class="text-danger"></span>
                        </div>
                        <div class="col-12 px-3">
                            <label >&nbsp;</label>
                            <button class="btn btn-primary" id="save-group">Save Group</button>
                        </div>
                    </div>
    <link href="/css/select2.min.css" rel="stylesheet" />
    <script src="/js/select2.min.js"></script>
    <script>
        $('.select-search').select2();
    </script>`;
        $('#group-contents').html(datastr);

        $('#CreateGroupModal').modal('show');
        $('#save-group').on('click', function () {
            var hasErr = false;
            if (!$("#Title").val()) {
                $('[asp-validation-for="Title"]').html("Title is required.");
                hasErr = true;
            }
            if (!$("#GroupBIO").val()) {
                $('[asp-validation-for="GroupBIO"]').html("GroupBIO is required.");
                hasErr = true;
            }
            if (!$("#GroupUserIds").val()) {
                $('[asp-validation-for="GroupUserIds"]').html("GroupUserIds is required.");
                hasErr = true;
            }
            if (hasErr)
                return;
            $.post('/Home/CreateGroup', { Title: $("#Title").val(), GroupBIO: $("#GroupBIO").val(), GroupUserIds: $("#GroupUserIds").val() }, function (res) {
                $('.loading').show();
                window.location.reload();
            });
        });
    });
});
