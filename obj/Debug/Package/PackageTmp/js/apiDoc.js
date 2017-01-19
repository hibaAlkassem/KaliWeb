ajaxSetup();

$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: config_apiserver + '/help' + '?userid=' + myval,
        contentType: "application/json",
        success: function (data) {
            
            $("#docIFrame").contents().find('html').html(data);
            iFrameClickEevent();
        }
    });



});

function iFrameClickEevent(){

    $("#docIFrame").contents().find('a').on('click',function (e) {
       e.stopPropagation(); 
       e.preventDefault();
        
        $.ajax({
            type: "GET",
            url: config_apiserver + $(this).attr('href') + '?userid=' + myval,
            contentType: "application/json",
            success: function (data) {

                $("#docIFrame").contents().find('html').html(data);
                iFrameClickEevent();
            }
        });
    });
    


}