$(document).ready(function () {
    $('#btn-new-ticket').click(function () {
        $('#new-ticket-wrapper').slideToggle("fast", "linear")
    })

    $('#btn-close-ticket').click(function () {
        $('#new-ticket-wrapper').slideToggle("fast", "linear")
    });

    $('#btn-add-account').click(function () {
        AddAccount();
    });

    $('#radiome').click(function () {
        $("#radiome").prop("checked", true);
        $("#radioperson").prop("checked", false);
        $("#divEmail").hide();
    });
    $('#radioperson').click(function () {
        $("#radioperson").prop("checked", true);
        $("#radiome").prop("checked", false);
        $("#divEmail").show();
    });

    $('.friend-list').click(function () {
        var id = $(this).data('aid')
        if (typeof id === 'undefined') {
            window.location = "AccountDetails.aspx?t=1";
        }
        else {
            window.location = "AccountDetails.aspx?t=1&aid="+id;
        }
    });
});

function AddAccount() {

    console.log($('#radiome').prop("checked"));
    if (!validate())
        return;

    var name = $("#txtName").val();
    var func = $("#txtFunction").val();
    var email = $("#txtEmail").val();
    var radio = $('#radiome').prop('checked')
    var type = 2;
    var userid = $("#inputUserId").val();


    jQuery.support.cors = true;
    var Account = {
        AccountName: name,
        AccountTypeId: "2",
        AccountOwnerId: userid,
        AccountCreatorId: userid,
        AccountFunction: func
    };
    console.log('trying to add new account: ' + JSON.stringify(Account));
    $.ajax({
        url: config_apiserver + 'api/account/',
        type: 'POST',
        data: JSON.stringify(Account),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //do the transfer magic if needed
            if (radio)
                location.reload();
            else //if the account owner is the person above then transfer the account
                doTransferMagic(data.AccountId, email);
        },
        error: function (x, y, z) {

        }
    });

}

function doTransferMagic(id, email) {
    $.ajax({
        url: config_apiserver + 'api/account/transfer/' + id + '/' + email + '/',
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            location.reload();
        },
        error: function (x, y, z) {
            console.log(x + '\n' + y + '\n' + z);
        }
    });
}

function validate() {
    var name = $("#txtName").val();
    var email = $("#txtEmail").val();
    var func = $("#txtFunction").val();
    var radio = $('#radiome').prop('checked');

    $('#lblNameError').hide();
    $("#divName").removeClass("error-control");
    $('#lblFunctionError').hide();
    $("#divFunction").removeClass("error-control");

    if (name.length < 2) {
        $('#lblNameError').show();
        $("#divName").addClass("error-control");
        return false;
    }

    if (email.length < 2 && !radio) {
        $('#lblEmailError').show();
        $("#divEmail").addClass("error-control");
        return false;
    }

    if (func.length < 2) {
        $('#lblFunctionError').show();
        $("#divFunction").addClass("error-control");
        return false;
    }

    return true;
}