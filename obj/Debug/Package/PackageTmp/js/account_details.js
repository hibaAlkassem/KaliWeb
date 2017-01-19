var loadedAccount;
var trustedusers;
var accountid;

$(document).ready(function () {
    switchTabs();

    $('#btnEdit').click(function () {
        startEdit();
    });

    $('#btnCancel').click(function () {
        cancelEdit();
    });

    $('#btnSave').click(function () {
       save();
    });

    $('#btn-share-another').click(function () {
        $('#new-ticket-wrapper').slideToggle("fast", "linear");
    });

    $('#btn-close-share').click(function () {
        $('#new-ticket-wrapper').slideToggle("fast", "linear");
    });

    $('#btn-add-share').click(function () {
        AddTrustedUser();
    });

    loadAccount();
    loadTrustedUsers();
});

function startEdit()
{
    $('#btnSave').show();
    $('#btnCancel').show();

    $('#txtName').show();
    $('#txtAccountFunction').show();

    $('#lblAccountFunction').hide();
    $('#lblName').hide();

    $('#txtAccountFunction').val($('#lblAccountFunction').text());
    $('#txtName').val($('#lblName').text());
    
    $('#btnEdit').hide();
}

function cancelEdit()
{
    $('#btnSave').hide();
    $('#btnCancel').hide();
    $('#txtName').hide();
    $('#txtAccountFunction').hide();

    $('#lblAccountFunction').show();
    $('#lblName').show();

    $('#btnEdit').show();
}

function save()
{
    var accountid = getParameterByName('aid');

    var name = $("#txtName").val();
    var func = $("#txtAccountFunction").val();

    jQuery.support.cors = true;
    var Account = {
        AccountId: loadedAccount.AccountId,
        AccountName: name,
        AccountTypeId: loadedAccount.AccountTypeId,
        AccountOwnerId: loadedAccount.AccountOwnerId,
        AccountCreatorId: loadedAccount.AccountCreatorId,
        AccountFunction: func
    };


    jQuery.support.cors = true;
    $.ajax({
        url: config_apiserver + 'api/account/' + accountid,
        type: 'PUT',
        data: JSON.stringify(Account),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            loadedAccount.AccountName = name;
            loadedAccount.AccountFunction = func;
            loadlabels();
            cancelEdit();
            //location.reload();
        },
        error: function (x, y, z) {

        }
    });
}

function loadAccount() {
    accountid = getParameterByName('aid');
    $.ajax({
        url: config_apiserver + 'api/account/' + accountid,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            loadedAccount = data;
            loadlabels();
            $('#lblUserName').text(loadedAccount.AccountName);
        }
    });
}

function loadlabels()
{
    $('#lblName').text(loadedAccount.AccountName);
    $('#lblUserId').text(loadedAccount.AccountId);
    $('#lblAccountFunction').text(loadedAccount.AccountFunction);
    if ($('#myval').val() == loadedAccount.AccountOwnerId)
        $('#lblAccountOwner').text("ME");
    else
        $('#lblAccountOwner').text(loadedAccount.AccountOwnerName);
}

function loadTrustedUsers()
{
    $.ajax({
        url: config_apiserver + 'api/account/' + accountid + '/trusted-users',
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            trustedusers = data;
            displayTrustedUsers();
        }
    });
}

function AddTrustedUser()
{
    if (!validate())
        return;

    var email = $("#txtEmail").val();
    var rel = $("#txtRelation").val();
    var trust = $("#selectTrust").val();

    jQuery.support.cors = true;
    var TrustedUser = {
        AccountId: accountid,
        UserID: 1,
        RelationDescription: rel,
        RoleId: trust
    };
    console.log('trying to add new account: ' + JSON.stringify(TrustedUser));
    $.ajax({
        url: config_apiserver + 'api/trusteduser/trust/'+email+'/',
        type: 'POST',
        data: JSON.stringify(TrustedUser),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //location.reload();
            window.location = "AccountDetails.aspx?aid=" + getParameterByName('aid') + "&t=2";
            //console.log('success');
        },
        error: function (x, y, z) {

        }
    });

}

function validate() {
    var email = $("#txtEmail").val();
    var rel = $("#txtRelation").val();

    $('#lblEmailError').hide();
    $("#divEmail").removeClass("error-control");
    $('#lblRelationError').hide();
    $("#divRelation").removeClass("error-control");

    if (email.length < 2) {
        $('#lblEmailError').show();
        $("#divEmail").addClass("error-control");
        return false;
    }

    if (rel.length < 2) {
        $('#lblRelationError').show();
        $("#divRelation").addClass("error-control");
        return false;
    }

    return true;
}

function displayTrustedUsers()
{
    for (var i = 0; i < trustedusers.length; i++)
    {
        var user = trustedusers[i];
        console.log(user);
        $("#tbl_trustedusers").find('tbody').append($('<tr><td>' + getSelect(i,user.TrustedUserId) + '</td><td>  <b>' + user.Username + '</b><br/><i>' + user.RelationDescription + '</i>  </td>'));
        $("#dropTrustedUsers" + i).val(user.RoleId);
        $("#dropTrustedUsers" + i).change(function (event) {
            console.log('changed ' + event.target.id);
            changeRole($('#' + event.target.id).data('index'), $('#' + event.target.id).val());
        });
    }
}

function getSelect(index)
{
    return "<select class='form-control' id='dropTrustedUsers" + index + "' data-index='" + index + "'><option value=\"1\">Everything</option>  <option value=\"2\">Edit Monitor + Anonymous Data</option> <option value=\"3\">Anonymous Data Only</option><option value=\"4\">Nothing</option></select>";
}

function changeRole(index, tlid)
{
    var user = trustedusers[index];

    var TrustedUser = {
        TrustedUserId: user.TrustedUserId,
        AccountId: user.AccountId,
        UserID: user.UserID,
        RelationDescription: user.RelationDescription,
        RoleId: tlid
    };

    jQuery.support.cors = true;
    $.ajax({
        url: config_apiserver + 'api/TrustedUser/' + user.TrustedUserId,
        type: 'PUT',
        data: JSON.stringify(TrustedUser),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log('success');
        },
        error: function (x, y, z) {
            console.log('fail');
        }
    });
}





function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function switchTabs() {
    var v = getParameterByName("t");
    if (v == 1)
        $('#tab-01 a[href="#prescriptions"]').tab('show')
    else if (v == 2)
        $('#tab-01 a[href="#privacy"]').tab('show')
    else
        $('#tab-01 a[href="#accountinfo"]').tab('show')
}
