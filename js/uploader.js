function fileUploader(fileUpload, contactId) {

    $('.loading').show();
    var files = fileUpload.files;
    // Create FormData object
    var fileData = new FormData();
    // Looping over all files and add it to FormData object
    for (var i = 0; i < files.length; i++) {
        fileData.append(files[i].name, files[i]);
    }
    fileData.append("contactId", contactId);
    fileData.append("replyId", replyid);
    $.ajax({
        url: '/Home/UploadFiles',
        type: "POST",
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        data: fileData,
        async: false,
        success: function (result) {
            if (result != "") {
                LoadProgressBar(result, contactId);
            }
        },
        error: function (err) {
            alert(err.statusText);
        }
    });

}

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
                    strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" ><img class="fupload" src="/uploads/thumbnails/` + resArr[i] + `" /></a></label>`;
                else
                    strLi += `<label><a href="/uploads/` + resArr[i] + `" target="_blank" >file(` + resArr[i] + `)</a></label>`;

                if (headerText)//end header of reply card
                    strLi += `</div>`;
                strLi +=`</li>`;
            }
            $('.loading').hide();
            $('.chat-pm-input textarea').val('')
            $('#lastchat').before(strLi);
            $('#Files').val('');
            $('#pogressbarModal').modal('hide');
            sendBySignalR(contactId, "isfile;;;" + userid + ";;;" + result + ',;,' + headerText + ";;;" + ";;;" + replyid);
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