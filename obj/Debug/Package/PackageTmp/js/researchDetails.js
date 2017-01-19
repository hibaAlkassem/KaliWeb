var queryRId = queryString["rid"];
ajaxSetup();

var count;

$('document').ready(function () {
   
    angular.element('body').scope().getResearchDetails(queryRId);
    angular.element('body').scope().getResearchPermissions(queryRId);

    $('.btn-copy-key').live('click', function () {
        copyToClipboard('#researchKey')
        showErrorMessage('Research key copied to clipboard');

    });

    $('.down-num li').click(function () {
        console.log(config_apiserver + 'api/research/' + queryRId + '/csv?userid=' + myval + '&count=' + $(this).val());
      //  window.open(config_apiserver + 'api/research/' + queryRId + '/csv?userid=' + myval + '&count=' + $(this).val());
        count = $(this).val();
        $('#Email').val("");
        $('#modalResearchInsight').modal('show');
        

        //    $.ajax({
        //        type: 'GET',
        //        async: false,
        //        url: config_apiserver + 'api/research/' + queryRId + '/csv?userid=' + myval + '&count=' + $(this).val(),
        //        dataType: "json",
        //        success: function (response) {
        //
        //        },
        //        error: function () {
        //      
        //        }
        //
        //    });

    });




    if(navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Edge") == -1  && navigator.userAgent.indexOf("Chrome") == -1)
        $('.btn-copy-key').hide();
});


$('#btn-modal-SendMail').click(function () {
   
    $.ajax({
        type: 'GET',
        async: false,
        url: config_apiserver + 'api/research/' + queryRId + '/csvEmail?userid=' + myval + '&count=' + count + '&Email=' + $('#Email').val(),
        dataType: "json",
        success: function (response) {
            $('#modalResearchInsight').modal('hide');
        },
        error: function () {
           
        }

    });



});

function copyToClipboard(element) {
    var $temp = $('<input>');
    $('body').append($temp);
    $temp.val($(element).text()).select();
    document.execCommand('copy');
    $temp.remove();
}