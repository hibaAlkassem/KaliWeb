var trustedusers;
var mid;
var signedInUserId;
ajaxSetup();
$(document).ready(function () {

    signedInUserId = myval;
    $('#pEditPermissions').live("click", function () {
        $("#permission-form").empty();
        $("#permission-form").append(spinner);
        $("#tbl_trustedusers").find('tbody').empty();
        mid = $(this).data('id');
        $('#modalPermissions').modal('show');
        getMonitorPermissions(mid);

    });

    $('#btn-add-modal-permission').click(function () {
        addModalPermission();
    });

});

//function getMonitorPermissions(mid) {
//    $.ajax({
//        url: config_apiserver + 'api/rxmonitor/' + mid + '/permissions',
//        contentType: "application/json;charset=utf-8",
//        async: true,
//        success: function (data) {
//            trustedusers = data;
//            displayTrustedUsers(data);
//        }
//    });
//}

function displayTrustedUsers(data) {
    $("#permission-form").empty();
    $("#permission-form").append(spinner);
    $("#permission-form").append('<div id="permissionsDiv" hidden><div>');

    console.log(data);
    for (var i = 0; i < data.length; i++) {
        var user = data[i];
        var divString = " <div class=\"row form-row\" > ";
        divString += "<div class=\"col-md-3\" >";
        if (user.MonitorPermissionId == -1)
            divString += "<h4> <span class=\"semi-bold\">" + user.Username + "</span></h4>" + user.Email + "<br /> </div>"
                + "<div class=\"col-md-3\">" + "Added the patient" + "</div>"
                + "<div class=\"col-md-4\" data-index=\"" + i + "\"   id=\"divRolePermissions" + user.RxUserId + "\" style=\"font-size: 12px;\">" + "Full Access" + "</div>"
                + "<div class=\"col-md-2\"> </div>";
        else if (user.MonitorPermissionId != 0)
            divString += "<h4> <span class=\"semi-bold\">" + user.Username + "</span></h4>" + user.Email + "<br /><a class=\"text-info\" href=\"#\" data-index=\"" + i + "\"  data-userid=\"" + user.RxUserId + "\" id=\"revoke-permission" + user.RxUserId + "\" >revoke</a> </div>"
                + "<div class=\"col-md-3\">" + getSelect(user.RxUserId) + "</div>"
                + "<div class=\"col-md-4\" data-index=\"" + i + "\"   id=\"divRolePermissions" + user.RxUserId + "\" style=\"font-size: 12px;\">" + getRolePermissions(user.RoleId) + "</div>"
                + "<div class=\"col-md-2\"> <button class=\"btn btn-success btn-cons\" data-index=\"" + i + "\"  data-userid=\"" + user.RxUserId + "\" style=\"display:none\" type=\"button\" id=\"save-permission-change" + user.RxUserId + "\" >Save</button></div>";
        else divString += "<h4> <span class=\"semi-bold\">" + user.Email + "</span></h4><span style=\"color:red;\"><b>pending invitation</b></span> "
            + "<br/><a class=\"text-info\" href=\"#\" data-index=\"" + i + "\"  data-userid=\"" + user.RxUserId + "\" data-email=\"" + user.Email + "\"  id=\"resend-invitation" + i + "\" >re-send</a>"
            + "&nbsp;&nbsp;<a class=\"text-info\" href=\"#\" data-index=\"" + i + "\"  data-userid=\"" + user.RxUserId + "\" data-email=\"" + user.Email + "\"  id=\"revoke-invitation\" >revoke</a>"
            + " </div>"
            + "<div class=\"col-md-3\">" + getSelectPending(i) + "</div>"
            + "<div class=\"col-md-4\"  data-index=\"" + i + "\"   id=\"divRolePermissionsPending" + i + "\" style=\"font-size: 12px;\">" + getRolePermissions(user.RoleId) + "</div>"
            + "<div class=\"col-md-2\"> <button class=\"btn btn-success btn-cons\" data-index=\"" + i + "\"  data-email=\"" + user.Email + "\" style=\"display:none\" type=\"button\" id=\"save-permission-change-pending" + i + "\" >Save</button></div>";

        divString += "</div> <hr />";
        $("#permissionsDiv").append($(divString));


        $("#revoke-permission" + user.RxUserId).on("click", function (event) {
            var rxUserId = $('#' + event.target.id).data('userid');
            RevokeAccess($('#' + event.target.id).data('index'), $("#selectpTrust" + rxUserId).val());

        });
        if (user.MonitorPermissionId == 0) {
            $("#selectpTrustPending" + i).val(user.RoleId);
            $("#resend-invitation" + i).on("click", function (event) {

                console.log("resend-permission");
                var email = $('#' + event.target.id).data('email');
                var monitorPermissionId = $('#' + event.target.id).data('MonitorPermissionId');
                resendInvitation(email, monitorPermissionId);

            });

            $(document).on('change', "#selectpTrustPending" + i, function (event) {
                var index = $('#' + event.target.id).data('index');
                $("#divRolePermissionsPending" + index).empty();
                $("#divRolePermissionsPending" + index).append(getRolePermissions($("#selectpTrustPending" + index).val()));
                console.log($("#divRolePermissionsPending" + index).html());
                $("#save-permission-change-pending" + index).show();
            });

            $("#save-permission-change-pending" + i).on("click", function (event) {
                var email = $('#' + event.target.id).data('email');
                var index = $('#' + event.target.id).data('index');
                changeRolePending(email, $("#selectpTrustPending" + index).val());
                $('#' + event.target.id).hide();
            });


        }
        else if (user.MonitorPermissionId == -1)
        { }
        else {
            $("#selectpTrust" + user.RxUserId).val(user.RoleId);
            $(document).on('change', "#selectpTrust" + user.RxUserId, function (event) {

                var rxUserId = $('#' + event.target.id).data('userid');
                $("#divRolePermissions" + rxUserId).empty();
                $("#divRolePermissions" + rxUserId).append(getRolePermissions($("#selectpTrust" + rxUserId).val()));
                $("#save-permission-change" + rxUserId).show();
            });
            $("#save-permission-change" + user.RxUserId).on("click", function (event) {
                var rxUserId = $('#' + event.target.id).data('userid');
                changeRole($('#' + event.target.id).data('index'), $("#selectpTrust" + rxUserId).val());
                $('#' + event.target.id).hide();
                reloadTable($('#selectPrescriptionStatus').val());
            });
        }

    }


    $("#revoke-invitation").on("click", function (event) {
        var email = $('#' + event.target.id).data('email');
        revokeInvitation(email);

    });

    var divNewPString = " <div class=\"row form-row\"> ";
    divNewPString += "<div class=\"col-md-3\" id=\"divpEmail\">";
    divNewPString += "<input type=\"text\" placeholder=\"email address\" class=\"form-control\" id=\"txtpEmail\" name=\"txtpEmail\" />";
    divNewPString += "<label for=\"txtpEmail\" class=\"error\" id=\"lblpEmailError\" style=\"display: none;\">Email Address is Required.</label> </div>";
    divNewPString += "<div class=\"col-md-3\">" + getSelect('') + "</div>";
    divNewPString += "<div class=\"col-md-3\"  id=\"divRolePermissions\" style=\"font-size: 12px;\">" + getRolePermissions(2) + "</div>";
    divNewPString += "<div class=\"col-md-2\"> <button class=\"btn btn-success btn-cons\" type=\"button\" id=\"save-permission-new\">Add</button><img id='shareSpinner' src='assets/img/spinner.gif' style='height: 25px; float: left; position: absolute; right: -24px; top: 6px;visibility: hidden;'></div>";
    divNewPString += "</div>";
    $("#permissionsDiv").append($(divNewPString));
    $("#spinner").hide();
    $("#permissionsDiv").show();

    $("#save-permission-new").on("click", function (event) {
        addModalPermission();
    });

    $(document).on('change', "#selectpTrust", function () {
        $("#divRolePermissions").empty();
        $("#divRolePermissions").append(getRolePermissions($("#selectpTrust").val()));
    });

}

function getSelect(UserId) {
    var selectString = "<select class=\"form-control\" data-userid=\"" + UserId + "\" id=\"selectpTrust" + UserId + "\">";
    $.ajax({
        url: config_apiserver + 'api/roles',
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                selectString += "<option value=\"" + data[i].RoleId + "\">" + data[i].RoleDescription + "</option>";
                console.log(data[i].RoleDescription);
            }

        }
    });
    selectString += "</select>";
    return selectString;
}
function getSelectPending(index) {
    var selectString = "<select class=\"form-control\" data-index=\"" + index + "\" id=\"selectpTrustPending" + index + "\">";
    $.ajax({
        url: config_apiserver + 'api/roles',
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                selectString += "<option value=\"" + data[i].RoleId + "\">" + data[i].RoleDescription + "</option>";
            }

        }
    });
    selectString += "</select>";
    return selectString;
}

function getRolePermissions(RoleId) {

    var selectString = "";
    $.ajax({
        url: config_apiserver + 'api/roles/' + RoleId + '/permissions',
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].PermissionValue == "true")
                    selectString += "<i class=\"fa fa-check\" style=\"color: lightgreen\"></i>";
                else selectString += "<i class=\"fa fa-times\" style=\"color: red\"></i>";
                selectString += "&nbsp;" + data[i].PermissionName + "<br />";
            }

        },
        error: function (x, y, z) {
            console.log('getRolePermissions fail');
        }
    });

    return selectString;
}

function changeRole(index, tlid) {

    var user = trustedusers[index];
    console.log(trustedusers);
    console.log(index);
    var MonitorPermission = {
        PermissionId: user.MonitorPermissionId,
        Ref_Id: user.MonitorId,
        Ref_Type: "patient",
        RxUserId: user.RxUserId,
        RoleId: tlid,
        PermissionStatus: "Active"
    };

    jQuery.support.cors = true;
    $.ajax({
        url: config_apiserver + 'api/Permission/changepermission/' + myval + "/"  + user.MonitorPermissionId,
        type: 'PUT',
        data: JSON.stringify(MonitorPermission),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log('success');
            reloadTable($('#selectPrescriptionStatus').val());
            showErrorMessage('Permission updated');
        },
        error: function (x, y, z) {
            console.log('fail');
        }
    });
}


function changeRolePending(email, tlid) {


    jQuery.support.cors = true;
    $.ajax({
        url: config_apiserver + 'api/pendingtrusts/' + email + '/edit-pending-trust/' + tlid,
        type: 'PUT',
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            console.log('success');
            reloadTable($('#selectPrescriptionStatus').val());
            showErrorMessage('Permission updated');

        },
        error: function (x, y, z) {
            console.log('fail');
        }
    });
}



function addModalPermission() {

    if (!validateAddModalPermission())
        return;
    $("#save-permission-new").attr("disabled", true);
    $("#shareSpinner").css("visibility","visible");
    console.log('adding permission');
    var email = $("#txtpEmail").val();
    var trust = $("#selectpTrust").val();

    jQuery.support.cors = true;
    var MonitorPermission = {
        Ref_Id: mid,
        Ref_Type: "patient",
        RxUserId: 1,
        RoleId: trust,
        PermissionStatus: "Active"
    };

    console.log(JSON.stringify(MonitorPermission));
    $.ajax({
        url: config_apiserver + 'api/Permission/' + email + '/add/' + signedInUserId,
        type: 'POST',
        data: JSON.stringify(MonitorPermission),
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            //location.reload();
            //window.location = "AccountDetails.aspx?aid=" + getParameterByName('aid') + "&t=2";
            if (data == "Duplicate Invite") {
                showErrorMessage(data);
                $("#save-permission-new").attr("disabled", false);
                $("#shareSpinner").css("visibility","hidden");
            }
            else {
                $("#save-permission-new").attr("disabled", false);
                $("#shareSpinner").css("visibility","hidden");
                console.log('success');
                completeModalAdd();
                reloadTable($('#selectPrescriptionStatus').val());
                showErrorMessage('Permission added');
            }
        },
        error: function (x, y, z) {
            $("#save-permission-new").attr("disabled", false);
            $("#shareSpinner").css("visibility","hidden");
            console.log('fail');
            completeModalAdd();
        }
    });
}

function validateAddModalPermission() {
    var email = $("#txtpEmail").val();

    $('#lblpEmailError').hide();
    $("#divpEmail").removeClass("error-control");

    if (email.length < 2) {
        $('#lblpEmailError').show();
        $("#divpEmail").addClass("error-control");
        return false;
    }
    return true;
}

function completeModalAdd() {
    //clear text
    $("#txtpEmail").val('');
    //reload permission
    $("#tbl_trustedusers").find('tbody').empty();
    getMonitorPermissions(mid);
}


var spinner = "";
spinner += "   <div id=\"spinner\">";
spinner += "                        <br \/><br \/>";
spinner += "                        <div class=\"sk-spinner sk-spinner-circle\">";
spinner += "";
spinner += "                            <div class=\"sk-circle1 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle2 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle3 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle4 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle5 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle6 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle7 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle8 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle9 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle10 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle11 sk-circle\"><\/div>";
spinner += "                            <div class=\"sk-circle12 sk-circle\"><\/div>";
spinner += "                        <\/div>";
spinner += "                    <\/div>   ";
spinner += "";



