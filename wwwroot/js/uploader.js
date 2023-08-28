
function _(el) {
    return document.getElementById(el);
}
function uploadFile(formdata) {
    $('#my-progress-bar').html('');
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandlerUploader, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", "/Home/UploadFiles");
    ajax.send(formdata);
}
function progressHandler(event) {
    //_("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
    var percent = (event.loaded / event.total) * 100;
    //_("progressBar").value = Math.round(percent);
    //_("status").innerHTML = Math.round(percent) + "% uploaded... please wait";

    $('#my-progress-bar').get(0).style.width = Math.round(percent) +'%';
    $('#my-progress-bar').attr('aria-valuenow', Math.round(percent));
    $('#my-progress-bar').html(Math.round(percent)+"%");
}
function completeHandler(event) {
    //_("status").innerHTML = event.target.responseText;
    //_("progressBar").value = 0;
    //$('#tempProgressBar').remove();
    fileUploadCompleted(event);
}
function errorHandlerUploader(event) {
    //_("status").innerHTML = "Upload Failed";
    alertify('Upload Failed!!!');
}
function abortHandler(event) {
    alertify('Upload Aborted!!!');
    //_("status").innerHTML = "Upload Aborted";
}  

function fileUploadCompleted(result){
    $('#tempProgressBar').remove();
    //$('#tempProgressBar').remove()
    $('.loading').hide();
    result = result.target.response.split('"').join('');

    var resArr = result.split(';');
    var strLi = "";
    var headerText = $('.message-input .card-header').text();
    if (headerText)
        headerText = headerText.substring(0, headerText.length - 1);

    for (var i = 0; i < resArr.length; i++) {
        strLi += `<li class="from-me">`;// +// data-time="` + res[i].createdDate + `">
        //`<img src="` + $('#profile-img').attr('src') + `" alt="" />`;

        if (headerText)//begin header of reply card
            strLi += `<div class="card" data-id="` + (replyid ? replyid : "") + `" >
                <div class="card-header">` +
                headerText +
                `</div>`;
        if (IsImage(resArr[i]))
            strLi += `<label><a data-url="/uploads/` + resArr[i] + `" class="img-tag" ><div><img class="fupload" src="/uploads/thumbnails/` + resArr[i] + `" /></div><div>` + resArr[i] + `</div></a></label>`;
        else if (IsAudio(resArr[i]))
            strLi += `<label><div><audio controls src="/uploads/` + resArr[i] + `" ></audio></div><div> ` + resArr[i] + `</div></label>`;
        else if (IsVideo(resArr[i]))
            strLi += `<label><div><video controls  ><source src="/uploads/` + resArr[i] + `" ></video></div><div> ` + resArr[i] + `</div></label>`;
        else if (IsPdfOrDoc(resArr[i]))
            strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" ><div><img class="docpdfimg" src="/uploads/thumbnails/` + resArr[i].substring(0, resArr[i].lastIndexOf('.')) + `.jpg"  /></div><div>` + resArr[i] + `</div></a></label>`;
        else
            strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" ><div><img src="/img/file-icon.png" class="img-ico" /></div><div>` + resArr[i] + `</div></a></label>`;

        if (headerText)//end header of reply card
            strLi += `</div>`;
        strLi += `<span>✓</span></li>`;
    }
    $('.loading').hide();
    $('.chat-pm-input textarea').val('')
    $('#lastchat').before(strLi);

    $('.img-tag').unbind('click');
    $('.img-tag').on('click', function () {
        var url = $(this).data('url');
        loadImageModal(url);
    });
    $('#Files').val('');
    $('#pogressbarModal').modal('hide');
    var contactId = $(".contact.active").data('id');
    sendBySignalR(contactId, "isfile;;;" + userid + ";;;" + result + ',;,' + headerText + ";;;" + ";;;" + replyid);
    setTimeout(function () {
        $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
        //$('.chat-pm ul').scrollTop($('#lastchat').offset().top);
    }, 500);
    if (replyid) {
        $('.message-input .card-header span').trigger('click');
        replyid = "";
    } else {
        allDropDownButtonProcess();
    }
    $('#my-progress-bar').get(0).style.width = '100%';
    setTimeout(function () {
        $('#my-progress-bar').get(0).style.width = '0%';
        $('#my-progress-bar').attr('aria-valuenow', "0");
        $('#my-progress-bar').html('0%');
    }, 100);

}

function fileUploader(fileUpload, contactId) {

    $('.loading').show();
    //var files = fileUpload.files;
    //// Create FormData object
    //var fileData = new FormData();
    //// Looping over all files and add it to FormData object
    //for (var i = 0; i < files.length; i++) {
    //    fileData.append(files[i].name, files[i]);
    //}
    //fileData.append("contactId", contactId);
    //fileData.append("replyId", replyid);
    //$.ajax({
    //    url: '/Home/UploadFiles',
    //    type: "POST",
    //    contentType: false, // Not to set any content header
    //    processData: false, // Not to process data
    //    data: fileData,
    //    async: false,
    //    success: function (result) {
    //        if (result != "") {
    //            LoadProgressBar(result, contactId);
    //        }
    //    },
    //    error: function (err) {
    //        alert(err.statusText);
    //    }
    //});
    var file = _("fileinput").files[0];
    var formdata = new FormData();
    formdata.append("file1", file);
    formdata.append("contactId", contactId);
    formdata.append("replyId", replyid);
    //submitForm();
    //$('#submitBtnFormUploader').trigger('click');
    uploadFile(formdata);

}

//$('#my-uploader-form').ajaxForm({
//        cache: false,

//        beforeSend: function () {
//            $('#my-progress-bar').empty();
//            $('#my-progress-bar').get(0).style.width = '0%';
//            $('#my-progress-bar').attr('aria-valuenow', '0');
//            $('#my-progress-bar').html(percentVal);
//        },
//        uploadProgress: function (event, position, total, percentComplete) {
//            var percentVal = percentComplete + '%';
//            bar.width(percentVal);
//            percent.html(percentVal);
//            $('#my-progress-bar').get(0).style.width = percentComplete + '%';
//            $('#my-progress-bar').attr('aria-valuenow', percentComplete);
//            $('#my-progress-bar').html(percentComplete + '%');
//        },
//        complete: function (result) {
//            ('#tempProgressBar').remove()
//            $('.loading').hide();
//            var resArr = result.split(';');
//            var strLi = "";
//            var headerText = $('.message-input .card-header').text();
//            if (headerText)
//                headerText = headerText.substring(0, headerText.length - 1);

//            for (var i = 0; i < resArr.length; i++) {
//                strLi += `<li class="from-me">`;// +// data-time="` + res[i].createdDate + `">
//                //`<img src="` + $('#profile-img').attr('src') + `" alt="" />`;

//                if (headerText)//begin header of reply card
//                    strLi += `<div class="card" data-id="` + (replyid ? replyid : "") + `" >
//                      <div class="card-header">` +
//                        headerText +
//                        `</div>`;
//                if (IsImage(resArr[i]))
//                    strLi += `<label><a data-url="/uploads/` + resArr[i] + `" class="img-tag" ><div><img class="fupload" src="/uploads/thumbnails/` + resArr[i] + `" /></div><div>` + resArr[i] + `</div></a></label>`;
//                else if (IsAudio(resArr[i]))
//                    strLi += `<label><div><audio controls src="/uploads/` + resArr[i] + `" ></audio></div><div> ` + resArr[i] + `</div></label>`;
//                else if (IsVideo(resArr[i]))
//                    strLi += `<label><div><video controls  ><source src="/uploads/` + resArr[i] + `" ></video></div><div> ` + resArr[i] + `</div></label>`;
//                else if (IsPdfOrDoc(resArr[i]))
//                    strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" ><div><img class="docpdfimg" src="/uploads/thumbnails/` + resArr[i].substring(0, resArr[i].lastIndexOf('.')) + `.jpg"  /></div><div>` + resArr[i] + `</div></a></label>`;
//                else
//                    strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" ><div><img src="/img/file-icon.png" class="img-ico" /></div><div>` + resArr[i] + `</div></a>></label>`;

//                if (headerText)//end header of reply card
//                    strLi += `</div>`;
//                strLi += `</li>`;
//            }
//            $('.loading').hide();
//            $('.chat-pm-input textarea').val('')
//            $('#lastchat').before(strLi);

//            $('.img-tag').unbind('click');
//            $('.img-tag').on('click', function () {
//                var url = $(this).data('url');
//                loadImageModal(url);
//            });
//            $('#Files').val('');
//            $('#pogressbarModal').modal('hide');
//            sendBySignalR(contactId, "isfile;;;" + userid + ";;;" + result + ',;,' + headerText + ";;;" + ";;;" + replyid);
//            setTimeout(function () {
//                $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
//                //$('.chat-pm ul').scrollTop($('#lastchat').offset().top);
//            }, 500);
//            if (replyid) {
//                $('.message-input .card-header span').trigger('click');
//                replyid = "";
//            } else {
//                allDropDownButtonProcess();
//            }
//            $('#my-progress-bar').get(0).style.width = '100%';
//            setTimeout(function () {
//                $('#my-progress-bar').get(0).style.width = '0%';
//                $('#my-progress-bar').attr('aria-valuenow', "0");
//                $('#my-progress-bar').html('0%');
//            }, 100);

//            //status.html(xhr.responseText);
//        }
//    });
////}




    //var bar = $('.bar');
    //var percent = $('.percent');
//var status = $('#status');
//function getFormData($form) {
//    var unindexed_array = $form.serializeArray();
//    var indexed_array = {};

//    $.map(unindexed_array, function (n, i) {
//        indexed_array[n['name']] = n['value'];
//    });

//    return indexed_array;
//}

//function formSubmit(fileUpload) {
//    //var dataJson = getFormData(fileuploaddata);
//    //dataJson.files = JSON.stringify($('#fileinput'));

//    //        $('#my-progress-bar').empty();
//    //        $('#my-progress-bar').get(0).style.width = '0%';
//    //        $('#my-progress-bar').attr('aria-valuenow', '0');
//    //$('#my-progress-bar').html(percentVal);
//    var files = fileUpload.files;
//    var fileData = new FormData();
//    // Looping over all files and add it to FormData object
//    for (var i = 0; i < files.length; i++) {
//        fileData.append(files[i].name, files[i]);
//    }
//    fileData.append("contactId", contactId);
//    fileData.append("replyId", replyid);
//    $.ajax({
//        xhr: function () {
//            var xhr = new window.XMLHttpRequest();

//            xhr.upload.addEventListener("progress", function (evt) {
//                if (evt.lengthComputable) {
//                    var percentComplete = evt.loaded / evt.total;

//                    $('#my-progress-bar').get(0).style.width = percentComplete+'%';
//                    $('#my-progress-bar').attr('aria-valuenow', percentComplete);
//                    $('#my-progress-bar').html(percentComplete+'%');
//                    //percentComplete = parseInt(percentComplete * 100);
//                    //console.log(percentComplete);

//                    if (percentComplete >99) {
//                        fileUploadCompleted();
//                    }

//                }
//            }, false);

//            return xhr;
//        },
//        url: "/Home/UploadFiles",
//        type: "POST",
//        data: fileData,
//        //contentType: "application/json",
//        //dataType: "json",
//        success: function (result) {
//            console.log(result);
//        }
//    });
//}
function LoadProgressBar(result, contactId) {
    var progressbar = $("#files-progressbar");
    var progressLabel = $(".progress-label");
    $('#pogressbarModal').modal({ backdrop: 'static', keyboard: false })
    $('#pogressbarModal').modal('show');

    progressbar.show();
    $("#files-progressbar").progressbar({
        //value: false,
        change: function () {
            progressLabel.text(
                progressbar.progressbar("value") + "%");
        },
        complete: function () {
            progressLabel.text("Loading Completed!");
            progressbar.progressbar("value", 0);
            progressLabel.text("");
            progressbar.hide();
            var resArr = result.split(';');
            var strLi = "";
            var headerText = $('.message-input .card-header').text();
            if (headerText)
                headerText = headerText.substring(0, headerText.length - 1);

            for (var i = 0; i < resArr.length; i++) {
                strLi += `<li class="from-me">`;// +// data-time="` + res[i].createdDate + `">
                    //`<img src="` + $('#profile-img').attr('src') + `" alt="" />`;

                if (headerText)//begin header of reply card
                    strLi += `<div class="card" data-id="` + (replyid ? replyid : "") + `" >
                      <div class="card-header">` +
                        headerText +
                        `</div>`;
                if (IsImage(resArr[i]))
                    strLi += `<label><a data-url="/uploads/` + resArr[i] + `" class="img-tag" ><div><img class="fupload" src="/uploads/thumbnails/` + resArr[i] + `" /></div><div>` + resArr[i] + `</div></a></label>`;
                else if (IsAudio(resArr[i]))
                    strLi += `<label><div><audio controls src="/uploads/` + resArr[i] + `" ></audio></div><div> ` + resArr[i] + `</div></label>`;
                else if (IsVideo(resArr[i]))
                    strLi += `<label><div><video controls  ><source src="/uploads/` + resArr[i] + `" ></video></div><div> ` + resArr[i] + `</div></label>`;
                else if (IsPdfOrDoc(resArr[i]))
                    strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" ><div><img class="docpdfimg" src="/uploads/thumbnails/` + resArr[i].substring(0, resArr[i].lastIndexOf('.')) + `.jpg"  /></div><div>` + resArr[i] + `</div></a></label>`;
                else
                    strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" ><div><img src="/img/file-icon.png" class="img-ico" /></div><div>` + resArr[i] + `</div></a>></label>`;

                if (headerText)//end header of reply card
                    strLi += `</div>`;
                strLi +=`</li>`;
            }
            $('.loading').hide();
            $('.chat-pm-input textarea').val('')
            $('#lastchat').before(strLi);

            $('.img-tag').unbind('click');
            $('.img-tag').on('click', function () {
                var url = $(this).data('url');
                loadImageModal(url);
            });
            $('#Files').val('');
            $('#pogressbarModal').modal('hide');
            sendBySignalR(contactId, "isfile;;;" + userid + ";;;" + result + ',;,' + headerText + ";;;" + ";;;" + replyid);
            setTimeout(function () {
                $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
                //$('.chat-pm ul').scrollTop($('#lastchat').offset().top);
            }, 500);
            if (replyid) {
                $('.message-input .card-header span').trigger('click');
                replyid = "";
            } else {
                allDropDownButtonProcess();
            }
            //$('#FileBrowse').find("*").prop("disabled", false);
        }
    });
    function progress() {
        var val = progressbar.progressbar("value") || 0;
        progressbar.progressbar("value", val + 1);
        if (val < 99) {
            setTimeout(progress, 25);
        }
    }
    setTimeout(progress, 100);
}
function IsImage(fileName)
{
    var fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    var imgExtention = [ ".jpg", ".jpeg", ".bmp", ".png", ".gif", ".tiff" ];
    if (imgExtention.includes(fileExtension))
        return true;
    return false;
}
function IsAudio(fileName)
{
    var fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    var imgExtention = [ ".wav", ".mp3"];
    if (imgExtention.includes(fileExtension))
        return true;
    return false;
}