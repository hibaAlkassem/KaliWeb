var modalViewed;
var prevValue = '',
    startValue = '',
    endValue = '';
var researchId;
var userId = myval;
var dateFocusedOut = false;
var permissionExist = false;
var assignPermissions = [];
var tabsButtons = ['overviewBtn', 'permissionsBtn'];

ajaxSetup();

$('document').ready(function () {

    $('#btn-new-monitor, .edit-research-icon, .edit-research').live('click', function (e) {
        viewModal($(this));
    });

    $('#btnSaveEdit').live('click', function () {
        if (modalViewed == 'new') {
            addNewResearch();
        }
    });

    $('#modalDone').live('mousedown', function () {
        if (modalViewed == 'edit' && validate('overviewBtn')()) {
            console.log(validate('overviewBtn')());
            $('#researchModal').modal('hide');
        }
    });

    $('#modalDone').live('keypress', function (e) {
        if (e.which == 13 && modalViewed == 'edit' && validate('overviewBtn')()) {
            $('#researchModal').modal('hide');
        }
    });

    $('#overview input').focusin(function () {
        prevValue = $(this).val();
    });
    $('#overview input').focusout(function () {
        console.log($(this).attr('id'));
        if (prevValue != $(this).val() && modalViewed == 'edit' && !$(this).hasClass('date-inputs')) {
            saveEdit();
        }

    });

    $(document).on('keyup', function (e) {

        if (e.keyCode == 27)
            $('#researchModal').modal('hide');

    });

    $('.date-icons').click(function () {

        $(this).prev().datepicker('show');

    });

    $('#addPermission').live('click', function () {


        var email = $('#permissionEmail').val();
        var roleId = $('#permissionRole').select2('val');
        var role = $('#permissionRole>option:selected').text();

        if (!validateEmail(email)) {
            $("#permissionEmail").css("border-color", "#F35958");
            return;
        } else $("#permissionEmail").css("border-color", "#E5E9EC");

        if (modalViewed == 'edit') {
            postPermission(email, roleId);
        } else {
            addPermission('', role, email, assignPermissions.length, roleId);

            if (permissionExist) {
                showErrorMessage('Duplicate Invite');
                return;
            }

            var researchPermission = {
                'PermissionId': 5,
                'ResearchId': 1,
                'Username': 'new',
                'RxUserId': myval,
                'Role': roleId,
                'Email': email,
                'PermissionStatus': 'Active'
            };

            assignPermissions.push(researchPermission);
            $('#newPermissionDiv').find('#permissionEmail').val('');
            $('#newPermissionDiv').find('#permissionRole').select2('val', 5);
        }

    });

    $('.icon-remove-permission').live('click', function () {

        var permissionDiv = $(this).parent().parent();

        if (modalViewed == 'edit') {
            removePermission($(this));
        } else {
            assignPermissions.splice(permissionDiv.attr('mp-id'), 1);
            permissionDiv.remove();
        }

    });

    $('.icon-resend-permission').live('click', function () {

        resendInvitation($(this));

    });

    $('.modal-buttons-header  a').live('click', function () {
        navigate();

    });

    $('.view-details').live('click', function (source) {
        if (!$(source.target).hasClass('edit-research-icon'))
            window.location = 'research-details.html?rid=' + $(this).attr('research-id');

    });
});

function viewModal(source) {

    var type = source.attr('m-type');

    var permissionEdit = source.closest('div').hasClass('research-sharing');

    if (type == 'edit') {
        resetDialog();
        angular.element('body').scope().newResearch = false;
        modalViewed = 'edit';
        researchId = source.attr('r-id');


        $('#researchModal  input, #researchModal  button').each(function () {
            if ($(this).attr('disabled') == null)
                $(this).attr('disabled', true).addClass('loading-patient-details');
        });
        $('#s2id_permissionRole .select2-choice').css('pointer-events', 'none').css('background-color', '#EEEEEE');
        $('#dialogSpinner').show();

        getResearchDetails(researchId);
        $('#modalDone,#modalNext').show()
        $('#modalCancel, #btnSaveEdit,#modalPrev').hide();
        $('.date-inputs').change(function () {

            if ($('#startDate').val() != startValue || $('#endDate').val() != endValue) {
                saveEdit();
                startValue = $('#startDate').val();
                endValue = $('#endDate').val();
            }
        });
        getResearchPermission(researchId);


    } else if (type == 'new') {
        angular.element('body').scope().newResearch = true;
        modalViewed = 'new';

        resetDialog();
       // getNewKey();
        $('#modalDone, #btnSaveEdit,#modalPrev').hide()
        $('#modalCancel').show();
    }
    if (permissionEdit)
        $('#permissionsBtn').click();

    wizard();


    $('#researchModal').modal('show');
}

function navigate() {
    var activeTab = tabsButtons.indexOf($('#tab-4').find('li.active a ').attr('id'));

    if (modalViewed == 'new') {
        $('#modalDone').hide();
        $('#modalCancel').show();
        var cases = {
            0: function () {
                $('#modalPrev, #btnSaveEdit').hide();
                $('#modalNext').show();
            },
            1: function () {
                $('#modalNext').hide();
                $('#modalPrev, #btnSaveEdit').show();
            }
        };

    } else {
        $('#btnSaveEdit, #modalCancel').hide();
        $('#modalDone').show();
        var cases = {
            0: function () {
                $('#modalPrev').hide();
                $('#modalNext').show();

            },
            1: function () {
                $('#modalNext').hide();
                $('#modalPrev').show();
            }
        };

    }

    if (cases[activeTab]) {
        cases[activeTab]();
    }

}

function wizard() {
    if (modalViewed == 'new')
        $('#tab-4').find('a').css('pointer-events', 'none');
    else $('#tab-4').find('a').css('pointer-events', 'auto');

    var activeTab = $('#tab-4').find('li.active a ').attr('id');
    var nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
    var prevTab;
    console.log(activeTab, 'activetab');
    $('#modalNext, #modalPrev').unbind('click');

    $('#modalNext').click(function () {

        activeTab = $('#tab-4').find('li.active a ').attr('id');
        nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];

        if (validate(activeTab) != null) {
            if (validate(activeTab)()) {
                $('#' + nextTab).click();
                navigate();

            }

            activeTab = $('#tab-4').find('li.active a ').attr('id');
            nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
            prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];
        } else {

            $('#' + nextTab).click();
            navigate();
            activeTab = $('#tab-4').find('li.active a ').attr('id');
            nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
            prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];

        }
    });

    $('#modalPrev').click(function () {
        console.log(activeTab, 'activetabPrev');
        activeTab = $('#tab-4').find('li.active a ').attr('id');

        prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];
        console.log(prevTab);

        if (validate(activeTab) != null) {
            if (validate(activeTab)()) {
                $('#' + prevTab).click();
                navigate();

            }
            activeTab = $('#tab-4').find('li.active a ').attr('id');
            nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
            prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];
        } else {
            $('#' + prevTab).click();
            navigate();

            activeTab = $('#tab-4').find('li.active a ').attr('id');
            nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
            prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];


        }


    });

}

function getResearchDetails(rId) {

    $.ajax({
        type: 'GET',
        url: config_apiserver + 'api/research/' + rId + '?userid=' + userId,
        dataType: "json",
        success: function (response) {
            var details = response;
            console.log(response);


            $('#txtResearchTitle').val(details.ResearchName);
            angular.element($('#txtResearchTitle')).triggerHandler('input');
            $('#txtResearchKey').val(details.ResearchKey);
            $('#startDate').val(angular.injector(['ng']).get('$filter')('date')(details.StartDate, 'MMM dd, yyyy')).datepicker('update').datepicker("option", "dateFormat", 'M dd, yyyy');
            $('#endDate').val(angular.injector(['ng']).get('$filter')('date')(details.EndDate, 'MMM dd, yyyy')).datepicker('update').datepicker("option", "dateFormat", 'M dd, yyyy');
            startValue = $('#startDate').val();
            endValue = $('#endDate').val();

            $('.loading-patient-details').each(function () {
                if ($(this).attr('disabled') != null)
                    $(this).attr('disabled', false).removeClass('loading-patient-details');
            });
            $('#s2id_permissionRole .select2-choice').css('pointer-events', 'auto').css('background-color', '#FFFF');
            $('#dialogSpinner').hide();

        },
        error: function () {
            $('.loading-patient-details').each(function () {
                if ($(this).attr('disabled') != null)
                    $(this).attr('disabled', false).removeClass('loading-patient-details');
            });
            $('#s2id_permissionRole .select2-choice').css('pointer-events', 'auto').css('background-color', '#FFFF');
            $('#dialogSpinner').hide();

            console.error('error');
        }

    });
}

function addNewResearch() {

    if (!validate('overviewBtn')())
        return;

    $('#dialogSpinner').show();
    // generate the research key
    var research = {
        'ResearchName': $('#txtResearchTitle').val().trim(),
        'StartDate': $('#startDate').val() == '' ? null : angular.injector(['ng']).get('$filter')('date')(new Date($('#startDate').val()), 'yyyy-M-dd'),
        'EndDate': $('#endDate').val() == '' ? null : angular.injector(['ng']).get('$filter')('date')(new Date($('#endDate').val()), 'yyyy-M-dd'),
        'Permissions': assignPermissions
    }
     $.ajax({
          type: 'POST',
           data: research,
           url: config_apiserver + 'api/research?userid=' + userId,
                dataType: 'json',
                success: function (response) {
                    $('#dialogSpinner').hide();
                    showErrorMessage('New research successfully added');
                    angular.element('body').scope().getResearch();
                    $('#researchModal').modal('hide');

                },
                error: function (response) {
                    console.log(response);
                    $('#dialogSpinner').hide();
                    showErrorMessage('failed to add new research');
                }

            });
          
      


  

}

function saveEdit() {

    if (!validate('overviewBtn')())
        return;


    $('#dialogSpinner').show();

    var research = {
        'ResearchId': researchId,
        'ResearchKey': $('#txtResearchKey').val(),
        'ResearchName': $('#txtResearchTitle').val().trim(),
        'StartDate': $('#startDate').val() == '' ? null : angular.injector(['ng']).get('$filter')('date')(new Date($('#startDate').val()), 'yyyy-M-dd'),
        'EndDate': $('#endDate').val() == '' ? null : angular.injector(['ng']).get('$filter')('date')(new Date($('#endDate').val()), 'yyyy-M-dd')
    };

    $.ajax({
        type: 'PUT',
        data: research,
        url: config_apiserver + 'api/research?userid=' + userId,
        dataType: "json",
        success: function (response) {
            showErrorMessage('Research successfully edited');
            $('#dialogSpinner').hide();
            if (window.location.href.indexOf('details') != -1) {
                angular.element('body').scope().getResearchDetails(researchId)
                angular.element('body').scope().getResearchPermissions(researchId)
            } else
                angular.element('body').scope().getResearch();

        },
        error: function (response) {
            showErrorMessage('Failed to edit research');
            $('#dialogSpinner').hide();
        }

    });

}

function getResearchPermission(researchId) {
    //FIXME: authorize reuquest

    $.ajax({
        url: config_apiserver + 'api/research/' + researchId + '/permissions?userId=' + myval,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (response) {
            $('#permissionsList').empty();
            for (var p in response) {
                addPermission(response[p].Username, response[p].Role, response[p].Email, response[p].PermissionId, response[p].RoleId)
            }
            $('.icon-remove-permission').first().hide();
        }
    });
}

function addPermission(patientName, role, email, mpId, roleId) {

    var pendingVisibility;
    var iconResend;
    permissionExist = false;

    if (patientName == null) {
        pendingVisibility = 'inline-block';
        patientName = '';
        iconResend = '<i  class="fa fa-refresh icon-resend-permission" data-toggle="tooltip" title="" data-placement="left" data-original-title="Re-send invitation email" ></i>';
    } else {
        pendingVisibility = 'none';
        iconResend = '';
    }

    var permission = '<div class="row permission" mp-id="' + mpId + '" r-id="' + roleId + '">' +
        '    <div class="monitor-permission col-md-12">' +
        '' +
        '        <div class="permission-txt">' +
        '            <b class="permission-patient-name">' + patientName + '</b>' +
        '            <b class="permission-patient-role"> (' + role + ')</b>' +
        '            <span class="permission-patient-email" email="' + email + '"> - ' + email + '</span>' +
        '                    </div>' +
        '                    <img src="images/times-circle.png" class="icon-remove-permission" data-toggle="tooltip" title="" data-placement="left" data-original-title="Revoke permission"  />' + iconResend +
        '                    <span class="permission-pending" style="display:' + pendingVisibility + ';">invitation pending</span>' +
        '                </div>' +
        '            </div>';


    $('span.permission-patient-email').each(function () {

        if ($(this).attr('email').toLocaleLowerCase().replace(/ /g, '') == email.toLocaleLowerCase().replace(/ /g, '')) {
            permissionExist = true;
            return false;
        }
    })

    if (permissionExist)
        return;
    $('#permissionsList').append(permission);

    $("[data-toggle='tooltip']").tooltip();



}

function postPermission(email, role) {

    $('#dialogSpinner').show();
    $('#addPermission').attr('disabled', true);


    jQuery.support.cors = true;
    var ResearchPermission = {
        Ref_Id: researchId,
        Ref_Type: "research",
        RxUserId: myval,
        RoleId: role,
        PermissionStatus: 'Active'
    };

    console.log(JSON.stringify(ResearchPermission));
    $.ajax({
        url: config_apiserver + 'api/Permission/' + email + '/add/' + myval,
        type: 'POST',
        data: JSON.stringify(ResearchPermission),
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (response) {
            $('#dialogSpinner').hide();
            $('#addPermission').attr('disabled', false);


            if (response == 'Inviting Self') {
                showErrorMessage('You already have access to this research');
            } else if (response == 'Duplicate Invite') {
                showErrorMessage(response);
            } else {

                addPermission(response.Username, response.Role, response.Email, response.PermissionId, role);

                $('#newPermissionDiv').find('#permissionEmail').val('');
                $('#newPermissionDiv').find('#permissionRole').select2('val', 5);
                showErrorMessage('Permission added');

                if (window.location.href.indexOf('details') != -1) {
                    angular.element('body').scope().getResearchDetails(researchId);
                    angular.element('body').scope().getResearchPermissions(researchId);
                } else
                    angular.element('body').scope().getResearch();
                //reloadTable($('#selectPrescriptionStatus').val());
            }
        },
        error: function () {
            $('#dialogSpinner').hide();
            $('#addPermission').attr('disabled', false);
            showErrorMessage('Could not add permission');
        }
    });
}

function removePermission(source) {

    $('#dialogSpinner').show();
    source.css('pointer-events', 'none');

    var email = source.parent().find('.permission-patient-email').attr('email');
    var PermissionId = source.parent().parent().attr('mp-id');
    var roleId = source.parent().parent().attr('r-id');


    if (PermissionId != 0) {


        var ResearchPermission = {
            PermissionId: PermissionId,
            Ref_Id: researchId,
            Ref_Type: "research",
            RoleId: roleId,
            PermissionStatus: 'Revoked'
        };

        jQuery.support.cors = true;
        $.ajax({
            url: config_apiserver + 'api/Permission/changepermission/' + myval + '/' + PermissionId,
            type: 'PUT',
            data: JSON.stringify(ResearchPermission),
            contentType: "application/json;charset=utf-8",
            aysnc: true,
            success: function (data) {
                if (window.location.href.indexOf('details') != -1) {
                    angular.element('body').scope().getResearchDetails(researchId);
                    angular.element('body').scope().getResearchPermissions(researchId);
                } else
                    angular.element('body').scope().getResearch();
                //reloadTable($('#selectPrescriptionStatus').val());

                showErrorMessage('Permission Revoked');
                source.parent().parent().remove();

                $('#dialogSpinner').hide();
                source.css('pointer-events', 'auto');
            },
            error: function () {
                console.log('fail');
                $('#dialogSpinner').hide();
                source.css('pointer-events', 'auto');
            }
        });
    } else {

        jQuery.support.cors = true;
        $.ajax({
            url: config_apiserver + 'api/pendingtrusts/' + myval + '/' + email + '/' + researchId + '/research/revoke-access',
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            aysnc: true,
            success: function (data) {
                console.log('success');

                if (window.location.href.indexOf('details') != -1) {
                    angular.element('body').scope().getResearchDetails(researchId);
                    angular.element('body').scope().getResearchPermissions(researchId);
                } else
                    angular.element('body').scope().getResearch();

                showErrorMessage('Permission Revoked');
                source.parent().parent().remove();
                // completeModalAdd()
                $('#dialogSpinner').hide();
                source.css('pointer-events', 'auto');
            },
            error: function () {
                console.log('fail');
                $('#dialogSpinner').hide();
                source.css('pointer-events', 'auto');
            }
        });
    }

}

function resendInvitation(source) {

    var email = source.parent().find('.permission-patient-email').attr('email');
    var roleId = source.parent().parent().attr('r-id');
    source.addClass('fa-spin');
    source.css('pointer-events', 'none');

    jQuery.support.cors = true;
    var ResearchPermission = {

        Ref_Id: researchId,
        Ref_Type: "research",
        RxUserId: myval,
        RoleId: roleId,
        PermissionStatus: "Active"
    };


    $.ajax({
        url: config_apiserver + 'api/permission/' + email + '/resend/' + myval,
        type: 'POST',
        data: JSON.stringify(ResearchPermission),
        contentType: "application/json;charset=utf-8",
        aysnc: true,
        success: function (data) {
            // completeModalAdd();
            source.removeClass('fa-spin');
            showErrorMessage('Email resent');
            source.css('pointer-events', 'auto');
        },
        error: function () {
            source.removeClass('fa-spin');
            showErrorMessage('Could not resend invitation');
            source.css('pointer-events', 'auto');

        }
    });
}



function validate(source) {

    var validation = {

        overviewBtn: function () {

            var resesearchName = $('#txtResearchTitle').val();
            var researchStartDate = $('#startDate').val() == '' ? null : angular.injector(['ng']).get('$filter')('date')(new Date($('#startDate').val()), 'yyyy-M-dd');
            var researchEndDate = $('#endDate').val() == '' ? null : angular.injector(['ng']).get('$filter')('date')(new Date($('#endDate').val()), 'yyyy-M-dd');

            if (resesearchName.replace(/\s/g, '').length < 1) {
                $('#lblResearchIdError').html('Research Title is required.').show();
                $('#txtResearchTitle').addClass("error-control");
                return false;
            } else if (resesearchName.replace(/\s/g, '').length < 2) {
                $('#lblResearchIdError').html('Research Title cannot be less than 2 characters long.').show();
                $('#txtResearchTitle').addClass("error-control");
                return false;

            }

            $('#lblResearchIdError').hide();
            $('#txtResearchTitle').removeClass("error-control");



            if ((researchStartDate != null && researchEndDate != null) && (researchStartDate > researchEndDate)) {
                $('#lblDateError').html('Start date cannot be before the ending date.').show();
                $('.monitor-dates').attr('style', 'border: 1px solid #F35958 !important;border-left: none !important;');
                $('#startDate, #endDate, span.monitor-dates').addClass('error-monitor-dates');
                return false;
            }

            $('#lblDateError').hide();
            $('#startDate, #endDate, span.monitor-dates').removeClass('error-monitor-dates');
            $('.monitor-dates').attr('style', 'border: 1px solid #E5E9EC !important;border-left:none !important;');

            return true;

        }

    }

    return validation[source];


}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function resetDialog() {
    $('#researchModal * input').val('');
    angular.element($('#txtResearchTitle')).triggerHandler('input');
    prevValue = '';
    $('.date-inputs').datepicker({
        format: 'M dd, yyyy'
    }).val('').datepicker('update').datepicker("option", "dateFormat", 'M dd, yyyy');
    startValue = '';
    endValue = '';
    $('.date-inputs').unbind('change');
    $('#lblResearchIdError,#lblDateError').hide();
    $('#txtResearchTitle').removeClass("error-control");
    $('#startDate, #endDate, span.monitor-dates').removeClass('error-monitor-dates');
    $('.monitor-dates').attr('style', 'border: 1px solid #E5E9EC !important;border-left:none !important;');
    $('#dialogSpinner').hide()
    $('#permissionsList').empty();
    $('#permissionRole').select2('val', '7');
    assignPermissions = [];
    $('#overviewBtn').click();
}