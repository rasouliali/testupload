//setInterval(function () {
//    $.post('/Chat/CheckChat', null, function (result, status) {
//        if (result) {
//            $('#alarmSound').get(0).play();
//            for (var i = 0; i < result.length; i++) {
//                $('#' + result[i].id + ' span').attr('class', 'newMessage_icon');
//                $('#' + result[i].id + ' span').html(result[i].countOfNewMessage);
//            }
//        }
//    });
//},5000,)
