
//$('#CallingModal .switch-cam').on('click', async function () {
//    await CallingModal_InCall_SwitchCam();
//})

//async function CallingModal_Speaker() {

//}
$('#FileUploadModal #btn_submitFile').on('click', function () {
    var fileInput = $('#FileUploadModal #inp_fileselector')[0];
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
        fileUploader(fileInput.files[0], contactId, $('#txt_filecaption').val());
        $('#FileUploadModal').modal('hide');
        //sendMess("file", id);
        //$('#loader').show();
        //$('#toUser').val(id);
        //$('form').submit();
    }
})
$('#FileUploadModal #btn_uploadFile').on('click', function () {
    $('#FileUploadModal #inp_fileselector').trigger('click');
});
function FileUploadModal_btn_submitFile() {

    var fileInput = document.getElementById('fileinput');
    fileInput
}

function SendFileProcess() {
    $('#FileUploadModal').modal('show');
    //$("#fileinput").unbind('change');

    //$('#fileinput').on('change', function () {
    //    var fileInput = document.getElementById('fileinput');
    //    if (fileInput.files.length > 0) {
    //        var contactId = $('.contact.active').data('id');
    //        var strLi = `<li class="from-me" id="tempProgressBar" >
    //          <div class="progress">
    //            <div class="progress-bar" id="my-progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
    //          </div>
    //        </li>`;
    //        $('#lastchat').before(strLi);
    //        setTimeout(function () {
    //            $(".chat-pm ul").scrollTop($(".chat-pm ul").get(0).scrollHeight)
    //        }, 500)
    //        fileUploader(fileInput, contactId);

    //        //sendMess("file", id);
    //        //$('#loader').show();
    //        //$('#toUser').val(id);
    //        //$('form').submit();
    //    }
    //});
    //$('#fileinput').trigger('click');
}