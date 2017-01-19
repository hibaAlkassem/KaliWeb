var tabsButtons = ['idTabBtn', 'profileBtn', 'prescriptionBtn', 'notificationsBtn', 'permissionsBtn'];
var modalViewed;
var monitorId;
var modalHeaderTxt;
var prevDeviceId = '';
var deviceStatus, researchDetails, rid, validKey = false;
var assignNotifications = [];
var assignPermissions = [];
var timezonedrop = [];
var timeFocused;
var monitorEdit = false;
var start = '';
var end = '';
var timeValue, timeInput;
var normalizedNumber = '';
var keyupTimepicker = false;
var permissionExist = false;
var notficationExit = false;
var prevDosages = [];
var prevValue;
var iniValue;
var cancelEdit = false;
var timeZoneData = [];



//Check whether the current page is the details page or the patients page to prevent reloading the monitors table when the current page is the details page.
var page = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.lastIndexOf('s') + 1);


//Timepicker value 
dialogPage = true;
//test TimeZones
getTimeZones();

var timeElement = '<div class="controls  input-append bootstrap-timepicker col-md-2 col-sm-3 added-time dosage-time-div"><div class="input-group transparent clockpicker "><input class="form-control clockpicker-input dosage-time prescription-input plus-time-icon added" placeholder="   &#xf067;" type="text" data-toggle="tooltip" title="" data-placement="right" data-original-title="Optional' +
    '\n\n' +
    'Medication time(s).' +
    '\n\n' +
    'To remove a time, just select and delete the time."><span class="input-group-addon add-on"><i class="fa fa-clock-o "></i></span></div></div>';

var timepickerOptions = {
    disableFocus: true,
    defaultTime: false,
    showWidgetOnAddonClick: true
};


$('document').ready(function () {
    resetModal();

    //    $('.clockpicker ').timepicker();

    $("#modalNext").live('click', function () {
        navigate();
    });

    $("#modalPrev").live('click', function () {
        navigate();
    });

    $(".modal-buttons-header  a").live('click', function () {
        navigate();
    });
    //
    //    //Change wizards' next/prev buttons while navigating through the wizard
    function navigate() {
        if (modalViewed == 'edit') {

            var activeTab = tabsButtons.indexOf($('#tab-4').find('li.active a ').attr('id'));

            var cases = {
                0: function () {
                    $('#modalPrev').hide();
                    $('#modalNext').show();
                },
                1: function () {
                    $('#modalPrev').show();
                    $('#modalNext').show();
                },
                2: function () {
                    $('#modalPrev').show();
                    $('#modalNext').show();
                },
                3: function () {
                    $('#modalPrev').show();
                    $('#modalNext').show();
                },
                4: function () {
                    $('#modalPrev').show();
                    $('#modalNext').hide();
                }
            };
            if (cases[activeTab]) {
                cases[activeTab]();
            }
        } else {

            var activeTab = tabsButtons.indexOf($('#tab-4').find('li.active a ').attr('id'));
            var cases = {
                0: function () {
                    $('#modalPrev').hide();
                    $('#modalNext').show();
                    $('#btnSaveEdit').hide();
                },
                1: function () {
                    $('#modalPrev').show();
                    $('#modalNext').show();
                    $('#btnSaveEdit').hide();
                },
                2: function () {
                    $('#modalPrev').show();
                    $('#modalNext').show();
                    $('#btnSaveEdit').hide();
                },
                3: function () {
                    $('#modalPrev').show();
                    $('#modalNext').show();
                    $('#btnSaveEdit').hide();
                },
                4: function () {
                    $('#modalPrev').show();
                    $('#modalNext').hide();
                    $('#btnSaveEdit').show();
                }
            };
            if (cases[activeTab]) {
                cases[activeTab]();
            }
        }

    }


    //

    $('#btnSaveEdit').live('click', function () {
        AddMonitor();
        //$('#patientModal').modal('hide');
    });


    $('.view-details').live('click', function () {

        window.location = 'details.html?mid=' + $(this).parent().attr('patient-id');

    });

    $('.edit-patient').live('click', function (event) {
        event.stopPropagation();


        if ($(this).attr('edit-type') == 'prescription')
            var parent = $(this).parent().parent().parent();
        else var parent = $(this).parent().parent().parent().parent();



        var editType = $(this).attr('edit-type');
        console.log('#' + $(this).attr('edit-type') + 'Btn');
        parent.find('#pEdit').click();
        $('#' + $(this).attr('edit-type') + 'Btn').click();

    });


    $('#releaseDevice').live('click', function () {

        $('#modalDeleteMonitor').modal('show');
        if ($('.modal-backdrop.fade').next().hasClass('modal-backdrop'))
            $('.modal-backdrop.fade').last().css({
                'background-color': 'rgba(0,0,0,0)'
            });

        $('#modalDeleteMonitor').attr('style', 'y-overflow:none !important"');

        //completeEdit();
    });

    $('#btn-modal-delete-monitor').live('click', function () {

        deleteMonitor(monitorId);
        $("#txtDeviceId").val('');
        $('#releaseDevice, .release-device').hide();

    });

    $('#btn-modal-cancel-delete-monitor').live('click', function () {

        $('#modalDeleteMonitor').modal('hide');

    });



    $('input.dosage-time').live('focusin', function () {
        $(this).attr('placeholder', '');
        $(this).removeClass('plus-time-icon');
        //        $(this).timepicker();
        timeFocused = $(this).parent().parent();

    });
    $('input.dosage-time').live('change', function () {
        if ($(this).val() != '')
            $(this).removeClass('plus-time-icon');
        else $(this).addClass('plus-time-icon');

    });


    $('#saveNotification').live('click', function () {


        if (!validateNotification()) {
            $("#recipient").css("border-color", "#F35958");
            return;
        } else {
            $("#recipient").css("border-color", "#E5E9EC");
        }

        var type = 'Medication reminders',
            by = $('#notifyBy').val(),
            recipient = $('#recipient').val().replace(/ /g, '');
        //            normalizedNumber = normalizedNumber;

        notficationExit = false;


        $('.notification-recipient').each(function () {

            var notVal = $(this).html().toLocaleLowerCase().replace(/ /g, '');
            var recp = recipient.toLocaleLowerCase().replace(/ /g, '').replace('+', '');
            var type = $(this).parent().find('b.notify-by').html().toLocaleLowerCase();



            if (by == 'phone' && type == 'phone') {
                var notNum = $(this).attr('phone-number').toLocaleLowerCase().replace(/ /g, '');

                if (recp == notVal || recp == notNum || ('+' + recp) == notNum) {
                    notficationExit = true;
                    return false;
                }
            } else if (by == 'sms' && type == 'sms') {

                var notNum = $(this).attr('phone-number').toLocaleLowerCase().replace(/ /g, '');
                if (recp == notVal || recp == notNum || ('+' + recp) == notNum) {
                    notficationExit = true;
                    return false;
                }
            } else if (by == 'email' && type == 'email') {

                if (recp == notVal) {
                    notficationExit = true;
                    return false;

                }

            }

        });

        if (notficationExit) {
            showErrorMessage('Duplicate Recipients');
            return;
        }

        if (modalViewed == 'edit')
            postNotification(type, by, recipient)

        else {

            addNotification(type, by, recipient, assignNotifications.length);

            var notification = {
                NotificationType: type,
                NotificationBy: by,
                recipient: recipient,
                NormalizedNumber: (by == 'email') ? null : normalizedNumber
            };
            assignNotifications.push(notification);
        }

    });


    $('.remove-notification').live('click', function () {
        $(this).parent().parent().remove()
    });

    $('.icon-edit').live('click', function () {

        $(this).parent().find('.notification-edit-data, .remove-notification').hide();
        $(this).parent().find('.notify-by-img').css('visibility', 'hidden');
        $(this).parent().find('.notification-edit').css('display', 'inline-block');
        $(this).parent().find('.check-edit, .cancel-edit').show();

    });


    $('.icon-remove ').live('click', function () {
        var notificationDiv = $(this).parent().parent();
        var notificationId = notificationDiv.attr('not-id');

        if (modalViewed == 'edit') {
            deleteNotification(notificationId);
        } else {

            assignNotifications.splice(notificationId, 1);
            notificationDiv.remove();
        }
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

            var monitorPermission = {
                RxUserId: "1",
                RoleId: roleId,
                Email: email,
                PermissionStatus: "Active"
            };

            assignPermissions.push(monitorPermission);
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

    $('#pEdit')
        .live("click", function () {
            //            editMonitorId = $(this)
            //                .data('id');
            editMonitorId = $(this).attr('data-id');

            if ($(this).attr('patient-id') != null)
                editMonitorId = $(this).attr('patient-id');

            var isParticipant = $(this).attr('participant');

            getMonitorDetails(editMonitorId, "", isParticipant);
            console.log(isParticipant);
            showModal($(this));
        });

    $('.new-participant').live('click', function () {

        showModal($(this));

    });

    $(".btn-group > .btn").live('click', function () {
        $(this).addClass("active").siblings().removeClass("active");
    });


    $('.input-group-addon').live('click', function () {

        timeFocused = $(this).parent().parent();


    });

    $('#modalDone').live('click', function (e) {

        if (monitorEdit) {
            //            $('#tblmonitors').dataTable().fnClearTable();
            //            reloadTableHandler($("#selectPrescriptionStatus").val());
            if (!cancelEdit) {
                angular.element('body').scope().getMonitor();
            }

            monitorEdit = false;
            cancelEdit = false;
        }

        if ($('#txtDeviceId').attr('disabled') == 'disabled')
            prevValue = $('#txtDeviceId').val();



        if ($('#txtDeviceId').val() != '' && prevValue != $('#txtDeviceId').val()) {

            prevValue = $('#txtDeviceId').val();


        } else {
            $('#patientModal').modal('hide');
        }


    });

    $('.remove-time').live('click', function () {
        timeInput.parent().parent().remove();
        $('.dropdown-menu').hide();
        if (modalViewed != 'assign')
            saveEdit('remove-time');
    });



    $(document).keyup(function (e) {
        if (keyupTimepicker)
            return;


        if (e.keyCode == 27) {
            console.log(typeof e.currentTarget.activeElement.attributes.id == 'undefined');
            var elementId = typeof e.currentTarget.activeElement.attributes.id == 'undefined' ? null : e.currentTarget.activeElement.attributes.id.nodeValue;
            var activeTab = $('#tab-4').find('li.active a ').attr('id');
            var hideModalList = ['releaseDevice', 'patientModal', 'notificationsBtn', 'permissionsBtn', 'btn-modal-delete-monitor', 'btn-modal-cancel-delete-monitor', 'assign', 'modalDone', ];



            console.log(e);
            console.log(elementId);

            e.preventDefault();
            if ($('.bootstrap-timepicker-widget').length == 1)
                return;
            else if ($('#modalDeleteMonitor').hasClass('in')) {
                $('#modalDeleteMonitor').modal('hide');
            } else {



                if (prevValue == $('#' + elementId).val() || hideModalList.indexOf(elementId) != -1 || hideModalList.indexOf(activeTab) != -1 || hideModalList.indexOf(modalViewed) != -1 || elementId == null) {

                    $('#patientModal').modal('hide');

                    if (typeof prevValue == 'undefined')
                        return;

                    //                    if (monitorEdit)
                    //                        saveEdit();

                } else {



                    if (!validate(activeTab)()) {
                        monitorEdit = false;
                        cancelEdit = true;
                        prevValue = $('#' + elementId).val();
                        return;
                    } else {
                        saveEdit('esc');
                        prevValue = $('#' + elementId).val();
                        iniValue = prevValue;
                        monitorEdit = false;
                        $('#modalDone').focus();


                    }

                }

            }
        }
    });


    $('#notifyBy').live('change', function () {

        if ($(this).select2('val') == 'email')
            $('span.notification-to').hide()
        else $('span.notification-to').show();

    });

    $('.test-notification').live('click', function () {
        var notElement = $(this).parent().parent();
        sendTestNotification($(this), notElement.attr('not-by'), notElement.attr('not-type'), notElement.attr('not-to'));
        $(this).attr('style', 'opacity:0.3;pointer-events:none');
    });


    $(window).resize(function () {

        if (timeFocused != null)
            $('.bootstrap-timepicker-widget').css('left', timeFocused.offset().left + 15 + 'px')

    });

});

//End of document.ready
//----------------------------------------------------------------------------------------------------------------------------------


function getMonitorDetails(mid, status, isParticipant) {
    ajaxSetup();
    $.ajax({
        url: config_apiserver + 'api/rxmonitor/' + myval + '/' + mid,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log("My Val", myval);
            console.log("My Id", mid);
            console.log("TimeZone", data.Timezone);
            displayMonitorDetails(data, status, isParticipant);
        },
        error: function (x, y, z) {
            //console.log(x + '\n' + y + '\n' + z);
        }
    });
}

function displayMonitorDetails(data, status, isParticipant) {

    $('.loading-patient-details').each(function () {
        if ($(this).attr('disabled') != null)
            $(this).attr('disabled', false).removeClass('loading-patient-details');
    });
    $('#s2id_timezone .select2-choice,#s2id_selectGender .select2-choice, #s2id_notifyBy .select2-choice, #s2id_permissionRole .select2-choice').css('pointer-events', 'auto').css('background-color', '#FFFF');
    $('#dialogSpinner').hide();

    var StartDate = new Date(data.StartDate),
        EndDate = new Date(data.EndDate),
        time = data.Time,
        notifications = data.Notifications,
        dmid = data.RxMonitorId,
        researchName = data.ResearchName,
        researchStartDate = data.ResearchStartDate,
        researchEndDate = data.ResearchEndDate,
        researchCenter = data.ResearchCenter;



    if (isParticipant == 'true') {
        console.log(isParticipant);
        $('#txtResearchName').val(researchName);
        $('#txtResearchCenter').val(researchCenter);
        $('#researchStartDate').val(angular.injector(['ng']).get('$filter')('date')(researchStartDate, 'MMM dd, yyyy'));
        $('#researchEndDate').val(angular.injector(['ng']).get('$filter')('date')(researchEndDate, 'MMM dd, yyyy'));
        $('#participationDetails').show();
    }

    $("#txtFirstName")
        .val(data.PatientFirstName);
    $("#txtLastName")
        .val(data.PatientLastName);
    if (data.PatientDateOfBirth != null) {
        var dob = new Date(data.PatientDateOfBirth);
        $('#txtAge')
            .val((dob.getMonth() + 1) + '/' + dob.getDate() + '/' + dob.getFullYear());
    }
    $("#selectGender")
        .select2('val', data.PatientGender);
    $("#txtPatientId")
        .val(data.PatientIdentifier);
    $("#txtComments")
        .val(data.Comments);
    $("#txtMedKey")
        .val(data.MedicineKey);

    if (data.DeviceId == null) {
        $('#releaseDevice').hide();
        $('.release-device').hide();
        $('#txtDeviceId').attr('disabled', false);

        $('.clicked').removeClass('clicked');
        $('.eye-btn-group, .drop-btn-group').find('button').attr('disabled', false);
        $('.drop-btn-group').find('[drop-count="' + data.DropCount + '"]').addClass('clicked').click();
        $('.eye-btn-group').find('[eye-count="' + data.EyeCount + '"]').addClass('clicked').click();
        $('.drop-btn-group').find('.active').addClass('clicked');
        $('.eye-btn-group').find('.active').addClass('clicked');
        if ((permission != 6 && permission != 5 && permission != 0) || (mid == 129 || mid == 130 || mid == 131))
            $('.eye-btn-group, .drop-btn-group').find('button').attr('disabled', true);


    } else {
        $('#releaseDevice').show();
        $("#txtDeviceId")
            .val(data.DeviceKey);
        $('#txtDeviceId').attr('disabled', true);

        $('.clicked').removeClass('clicked');
        $('.eye-btn-group, .drop-btn-group').find('button').attr('disabled', false);
        $('.drop-btn-group').find('[drop-count="' + data.DropCount + '"]').addClass('clicked').click();
        $('.eye-btn-group').find('[eye-count="' + data.EyeCount + '"]').addClass('clicked').click();
        $('.drop-btn-group').find('.active').addClass('clicked');
        $('.eye-btn-group').find('.active').addClass('clicked');
        if ((permission != 6 && permission != 5 && permission != 0) || (mid == 129 || mid == 130 || mid == 131))
            $('.eye-btn-group, .drop-btn-group').find('button').attr('disabled', true);


    }
    prevDeviceId = data.DeviceKey;

    $('#patientName').html($('#txtFirstName').val() + ' ' + $('#txtLastName').val())
    $('#patientNumber').html(data.PatientIdentifier);
    if ($('#patientName').html() == '' || $('#patientName').html() == ' ')
        $('#dash').html('');
    else $('#dash').html(' - ');

    if (data.StartDate != null) {
        $('#startDate').val(getDateView(StartDate)).datepicker('update').datepicker("option", "dateFormat", 'M dd, yyyy');

        start = $('#startDate').val();
    }

    if (data.EndDate != null) {
        $('#endDate').val(getDateView(EndDate)).datepicker('update').datepicker("option", "dateFormat", 'M dd, yyyy');

        end = $('#endDate').val();
    }


    var clock = '<div class="controls  input-append bootstrap-timepicker col-md-2 col-sm-3 added-time dosage-time-div"><div class="input-group transparent clockpicker "><input class="form-control clockpicker-input dosage-time prescription-input added-time " placeholder="   &#xf067;" type="text" data-toggle="tooltip" title="" data-placement="right" data-original-title="Optional' +
        '\n\n' +
        'Medication time(s).' +
        '\n\n' +
        'To remove a time, just select and delete the time."><span class="input-group-addon add-on"><i class="fa fa-clock-o"></i></span></div></div>';

    $('.dosage-time').last().parent().parent().remove();
    $('.time-div').append(clock);

    console.log(time);

    prevDosages = [];

    for (var i = 0; i < time.length; i++) {

        var dTime = time[i].Time.substring(0, time[i].Time.lastIndexOf(':'));

        $('.dosage-time').last().val(convert24to12(dTime));
        $('.time-div').append(clock);

        prevDosages.push(dTime);

        if (permission != 6 && permission != 5 && permission != 0) {
            $('.dosage-time').attr('disabled', true);

        } else {

            $("[data-toggle='tooltip']").tooltip();
        }
    }
    console.log(prevDosages, 'prevDosages');

    if (time.length == 0) {
        $('.time-div').append(clock);
        $("[data-toggle='tooltip']").tooltip();
        $('input.dosage-time').last().addClass('plus-time-icon');
        $('input.dosage-time').last().attr('placeholder', '   ï§');
        $('input.dosage-time').last().parent().parent().remove();
    }

    if ($('.dosage-time').last().val() == '') $('.dosage-time').last().addClass('plus-time-icon');
    if ($('.dosage-time').first().val() != '') $('.dosage-time').first().removeClass('plus-time-icon');
    $('input.dosage-time ').timepicker(timepickerOptions);



    for (var n in notifications) {
        normalizedNumber = notifications[n].NormalizedNumber;
        addNotification(notifications[n].NotificationType, notifications[n].NotificationBy, notifications[n].recipient, notifications[n].MonitorNotificationId);

    }


    if (status == "disabled") {
        console.log(status);

        $("#btnDeactivate").hide();
        $("#btnSaveEdit")
            .hide();
    } else {

        $("#btnDeactivate").show();
    }

    console.log("Get Patient Detail Time Zone Id : ", data.TimeZoneId);
    // Add the timeZoneId
    if (data.TimeZoneId != null)
        $('#timezone').select2('val', data.TimeZoneId);


    //  $('#prescription :input').trigger('input');
    if (permission != 6 && permission != 5 && permission != 0) {

        $('.added-time').each(function () {
            $(this).find('span').css('pointer-events', 'none');
            $(this).find('input').attr('disabled', true);
        });


        $('input.dosage-time').last().parent().remove();

    }

}

function wizard(dialog) {
    if (dialog == 'assign')
        $('#tab-4').find('a').css('pointer-events', 'none');
    else $('#tab-4').find('a').css('pointer-events', 'auto');

    var activeTab = $('#tab-4').find('li.active a ').attr('id');
    var nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
    var prevTab;

    $('#modalNext').unbind('click');
    $('#modalPrev').unbind('click');

    $('#modalNext').click(function () {
        console.log(activeTab);

        if (activeTab == 'researchParticipantBtn') {
            validate(activeTab)();
        } else {
            activeTab = $('#tab-4').find('li.active a ').attr('id');
            nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
            console.log(activeTab);
            if (validate(activeTab) != null) {
                if (validate(activeTab)()) {
                    $('#' + nextTab).click();

                }

                activeTab = $('#tab-4').find('li.active a ').attr('id');
                nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
                prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];
            } else {

                $('#' + nextTab).click();
                activeTab = $('#tab-4').find('li.active a ').attr('id');
                nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
                prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];

            }
        }
    });

    $('#modalPrev').click(function () {
        activeTab = $('#tab-4').find('li.active a ').attr('id');

        prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];
        console.log(prevTab);

        if (validate(activeTab) != null) {
            if (validate(activeTab)()) {
                $('#' + prevTab).click();

            }
            activeTab = $('#tab-4').find('li.active a ').attr('id');
            nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
            prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];
        } else {
            $('#' + prevTab).click();
            activeTab = $('#tab-4').find('li.active a ').attr('id');
            nextTab = tabsButtons[tabsButtons.indexOf(activeTab) + 1];
            prevTab = tabsButtons[tabsButtons.indexOf(activeTab) - 1];


        }


    });

}

function showModal(source) {
    monitorId = source.attr('data-id');

    if (source.attr('patient-id') != null)
        monitorId = source.attr('patient-id')

    permission = parseInt(source.attr('p-id'));

    //remove onFocusOut events (that auto-saves on edit dialog)
    $('#txtFirstName, #txtLastName, #txtPatientId').unbind('focusin');
    $('#txtFirstName, #txtLastName, #txtPatientId').unbind('keyup');





    if (source.attr('id') == 'pEdit') {

        wizard('edit');

        $('#modalCancel').hide();
        $('#modalDone').show();

        modalHeaderTxt = 'Patient';
        modalViewed = 'edit';

        $('#btnSaveEdit').show();
        $('#releaseDevice').show();
        $('#txtDeviceId').attr('disabled', false);
        resetModal();
        $('#btnSaveEdit').hide();
        if (source.attr('assigned') == 'false')
            $('.release-device').hide();

        $('.drop-btn-group  button, .eye-btn-group  button').click(function (e) {
            //            e.stopImmediatePropagation();

            if (!$(this).hasClass('clicked')) {
                $(this).parent().find('.clicked').removeClass('clicked');
                $(this).addClass('clicked');
                saveEdit();

            }
        });

        mid = monitorId;
        permissionEdit(permission);

        validateEditMonitor();

        $('#patientModal  input, #patientModal  button').each(function () {
            if ($(this).attr('disabled') == null)
                $(this).attr('disabled', true).addClass('loading-patient-details');
        });
        $('#s2id_timezone .select2-choice,#s2id_selectGender .select2-choice, #s2id_notifyBy .select2-choice, #s2id_permissionRole .select2-choice').css('pointer-events', 'none').css('background-color', '#EEEEEE');
        $('#dialogSpinner').show();

        $('#patientModal').modal('show');
        getMonitorPermissions(mid);
        prevDeviceId = $("#txtDeviceId").val();


    } else if (source.attr('id') == 'btn-new-monitor') {

        $('#modalCancel').show();
        $('#modalDone').hide();

        wizard('assign');

        modalViewed = 'assign';
        modalHeaderTxt = 'New Patient';
        $('#patientNumber').html('');
        $('#txtDeviceId').attr('disabled', false);
        $('#releaseDevice').hide();
        $('.drop-btn-group  button, .eye-btn-group  button').unbind('click');
        $("#spinner").hide();
        $("#permission-form").append('<div id="permissionsDiv" hidden><div>');
        $('.date-icons').click(function () {

            $(this).prev().datepicker('show');

        });
        $("#save-permission-new").on("click", function (event) {

            var email = $("#txtpEmail").val();
            var trust = $('#selectpTrust>option:selected').text();
            var roles = $('#divRolePermissions').html();

            var permission = '<div class="row form-row"> <div class="col-md-3"><h4> <span class="semi-bold">' + email + '</span></h4><br> </div><div class="col-md-3">' + trust + '</div><div class="col-md-4" data-index="0" id="divRolePermissions82" style="font-size: 12px;">' + roles + '</div><div class="col-md-2"> </div></div><hr/>'

            $(".add-permission").before(permission);

            $("#txtpEmail").val('');
            $("#selectpTrust").val('2');

        });

        $("#permissionsDiv").show();

        resetModal();

        var d = new Date();
        var found = false;
        $('#timezone option').each(function () {
            var offset = createOffset(d);
            if ($(this).attr('time') == offset && !found) {
                $('#timezone').select2('val', $(this).val());
                found = true;
            }
        });

        $('#patientModal').modal('show');

        $('#patientName').html(modalHeaderTxt);
        angular.element($('#txtPatientId')).triggerHandler('input');

        $('#dash').html('');


    } else if (source.hasClass('new-participant')) {
        resetModal();
        wizard('new-participant');
        $('#modalCancel').show();
        $('#modalDone').hide();
        modalHeaderTxt = 'New Research Participant';
        $('#patientNumber').html('');
        $('#patientName').html(modalHeaderTxt);
        $('#researchParticipantBtn').click();
        $('#tab-4 li').css('visibility', 'hidden');
        $('#patientModal').modal('show');

        var d = new Date();
        var found = false;
        $('#timezone option').each(function () {
            var offset = createOffset(d);
            if ($(this).attr('time') == offset && !found) {
                $('#timezone').select2('val', $(this).val());
                found = true;
            }
        });
        $('#releaseDevice').hide();
    }

    $('#txtFirstName, #txtLastName, #txtPatientId').on('keyup', function () {

        $('#patientName').html($('#txtFirstName').val() + ' ' + $('#txtLastName').val() + ' ');
        $('#patientNumber').html($('#txtPatientId').val());
        if ($('#txtPatientId').val() != '')
            $('#dash').html(' - ');

        if ($('#txtFirstName').val() == '' && $('#txtLastName').val() == '' && $('#txtPatientId').val() == '')
            $('#dash').html('');

        if ($('#txtFirstName').val() == '' && $('#txtLastName').val() == '')
            $('#dash').html('');

    });


    $('#txtFirstName, #txtLastName, #txtPatientId').focusin(function () {

        if ($('#txtFirstName').val() == '' && $('#txtLastName').val() == '' && $('#txtPatientId').val() == '') {
            $('#dash').html('');
            $('#patientName').html(modalHeaderTxt);

            if ($('#txtPatientId').val() != '')
                $('#dash').html(' - ');

        }

    });

}

function resetModal() {

    $('#prescription input, #profile input').unbind('focusin');
    $('#prescription input, #profile input').unbind('keypress');
    $('.patient-modal input').val('');
    $('.patient-modal .error').hide();
    $('.date-inputs').datepicker({
        format: 'M dd, yyyy'
    }).val('').datepicker('update').datepicker("option", "dateFormat", 'M dd, yyyy');
    $("#permissionEmail, #recipient").css("border-color", "#E5E9EC");
    $('#startDate, #endDate, span.monitor-dates').removeClass('error-monitor-dates');
    $('.monitor-dates').attr('style', 'border: 1px solid #E5E9EC !important;border-left:none !important;');
    $('#selectGender').select2('val', '0');
    $('#timezone').select2('val', '-1');
    $("#s2id_timezone").css('border', ' none');
    $('#notifyBy').select2('val', 'sms');
    $('span.notification-to').show();
    $('#idTabBtn').click();
    $('#modalPrev').hide();
    $('#modalNext').show();
    $('.added-time').each(function () {
        $(this).remove();
    });
    $('.time-error').each(function () {
        $(this).removeClass('time-error');
        $(this).next('span.input-group-addon').removeClass('time-error-span');
    });
    $('#divDeviceId').removeClass('error-control');
    $('#prescription :input').attr('disabled', false);
    $('#prescription').find('span').css('pointer-events', 'auto');
    $('#prescription').find('#releaseDevice').css('pointer-events', 'auto');
    $('#prescription').find('.clockpicker-clock-icon').attr('style', 'background-color : white');
    //    $('.clockpicker ').timepicker();
    $('.release-device').show();
    $('#lblPatientIdError').hide();
    $("#divPatientId").removeClass("error-control");
    $('#lblAgeError').hide();
    $('#lblAgeError').removeClass('error-control');

    $('#txtCommentsError').hide();
    $('#btnSaveEdit').hide();
    $('#divMedicines').removeClass('error-control');
    $('#notificationList').html('');
    $('#permissionsList').empty();
    $("#txtPatientId").attr('disabled', false);
    $('#tab-4 li').css('visibility', 'visible');

    $('#permissionRole').select2('destroy');

    if (!$('#permissionRole option[value=5]').length) {

        $("#permissionRole").prepend($('<option>', {
            value: 6,
            text: 'Doctor assistant'
        }));
        $("#permissionRole").prepend($('<option>', {
            value: 5,
            text: 'Doctor'
        }));
    }

    $('#permissionRole').val('5');
    $('#permissionRole').select2({
        minimumResultsForSearch: Infinity
    });

    $('.clicked').removeClass('clicked');

    $('.drop-btn-group').find('.default').addClass('clicked').click();
    $('.eye-btn-group').find('.default').addClass('clicked').click();


    $('.dosage-time-div').remove();

    var clock = '<div class="  controls  input-append bootstrap-timepicker col-md-2 col-sm-3 added-time dosage-time-div"><div class="input-group transparent clockpicker "><input class="form-control clockpicker-input  dosage-time prescription-input added-time" placeholder="   &#xf067;" type="text" data-toggle="tooltip" title="" data-placement="right" data-original-title="Optional' +
        '\n\n' +
        'Medication time(s).' +
        '\n\n' +
        'To remove a time, just select and delete the time."><span class="input-group-addon add-on"><i class="fa fa-clock-o"></i></span></div></div>';

    $('.time-div').append(clock);

    //    if(modalViewed == "edit")addTimeEvents();
    $('input.dosage-time').last().addClass('plus-time-icon').timepicker(timepickerOptions);

    $('#s2id_timezone .select2-choice').css('pointer-events', 'auto').css('background-color', '#FFFFFF');
    $('#s2id_timezone').attr('style', 'padding: 0px ! important;border:none');
    $('#txtResearchKey').css('border', 'none'); //FIXME: add/remove error class instead of adding removing broder
    $('#participationDetails').hide();
    researchDetails = null;
    rid = null;
    validKey = false;

    resetValidateEditMonitor();
    assignNotifications = [];
    assignPermissions = [];
}

function validateTime(time) {
    var t = time.split(':');

    return /^\d\d:\d\d$/.test(time) &&
        t[0] >= 0 && t[0] < 24 &&
        t[1] >= 0 && t[1] < 60
}

function addNotification(notificationType, notifyBy, recipient, notificationId) {
    notificationType = 'medication reminders';
    var notification = {};

    var editType = '<select class="select2 select-2 notification-edit edit-type" id="">' +
        '                                        <option value="Medication reminders">Medication reminders</option>' +
        //        '                                        <option value="Adherence updates">Adherence updates</option>' +
        '                                    </select>';

    var editBy = '<select class="select2 select-2 notification-edit edit-by" id="">' +
        '                                        <option value="sms">SMS</option>' +
        '                                        <option value="email">email</option>' +
        '                                        <option value="phone">phone</option>' +
        '                                    </select>';

    var editRecipient = ' <div class="notification-edit notification-edit-input"><input class="notification-to edit-recipient" id="" /></div>';





    notification.email = '<div class="row notification notification-email" not-id="' + notificationId + '" not-by="' + notifyBy + '" not-type="' + notificationType + '" not-to="' + recipient + '">' +
        '                            <div class="reminder col-md-12">' +
        '                                <img src="images/email.png" class="icon-email notify-by-img" />' +
        '                                <div class="notification-txt">' + editType + '<b class="notification-type notification-edit-data">' + notificationType + '</b> by ' + editBy + '<b class="notify-by notification-edit-data">email</b> to ' + editRecipient + '<b class="notification-recipient notification-edit-data">' + recipient + '</b>' +
        '                                </div>' +
        '                                <img src="images/times-circle.png" class="icon-remove remove-notification" data-toggle="tooltip" title="" data-placement="left" data-original-title="Delete notification" />' +
        '     <img src="images/email.png" class="email-test-notification test-notification" data-toggle="tooltip" title="" data-placement="left" data-original-title="Click to send a test message" />' +
        '                            </div>' +
        '                        </div>';


    notification.phone = '<div class="row notification notification-phone" not-id="' + notificationId + '" not-by="' + notifyBy + '" not-type="' + notificationType + '" not-to="' + recipient + '">' +
        '                            <div class="reminder col-md-12">' +
        '                                <img src="images/phone.png" class="icon-phone notify-by-img" />' +
        '                                <div class="notification-txt">' + editType + '<b class="notification-type notification-edit-data">' + notificationType + '</b> by ' + editBy + '<b class="notify-by notification-edit-data">phone</b> to ' + editRecipient + ' <b class="notification-recipient notification-edit-data" phone-number="' + recipient.replace('+', '') + '">' + normalizedNumber + '</b>' +
        '                                </div>' +
        '                                <img src="images/times-circle.png" class="icon-remove remove-notification" data-toggle="tooltip" title="" data-placement="left" data-original-title="Delete notification"  />' +
        '     <img src="images/phone.png" class="phone-test-notification test-notification" data-toggle="tooltip" title="" data-placement="left" data-original-title="Click to send a test message" />' +
        '                            </div>' +
        '                        </div>';


    notification.sms = '<div class="row notification notification-sms" not-id="' + notificationId + '" not-by="' + notifyBy + '" not-type="' + notificationType + '" not-to="' + recipient + '">' +
        '                            <div class="reminder col-md-12">' +
        '                                <img src="images/sms.png" class="icon-sms notify-by-img" />' +
        '                                <div class="notification-txt">' + editType + '<b class="notification-type notification-edit-data">' + notificationType + '</b> by ' + editBy + '<b class="notify-by notification-edit-data">SMS</b> to ' + editRecipient + '<b class="notification-recipient notification-edit-data" phone-number="' + recipient.replace('+', '') + '">' + normalizedNumber + '</b>' +
        '                                </div>' +
        '                                <img src="images/times-circle.png" class="icon-remove remove-notification" data-toggle="tooltip" title="" data-placement="left" data-original-title="Delete notification"  />' +
        '     <img src="images/sms.png" class="sms-test-notification test-notification" data-toggle="tooltip" title="" data-placement="left" data-original-title="Click to send a test message" />' +
        '                            </div>' +
        '                        </div>';


    $('#notificationList').append(notification[notifyBy]);
    $("[data-toggle='tooltip']").tooltip();
    $('.reminder').last().find('select.select2').select2({
        minimumResultsForSearch: Infinity
    });

    $('.reminder').last().find('.edit-type').select2('val', notificationType);
    $('.reminder').last().find('.edit-by').select2('val', notifyBy);
    $('.reminder').last().find('.edit-recipient').val(recipient);


    $('#recipient').val('');
    $('#notificationType').select2('val', 'Medication Reminders');
    $('#notifyBy').select2('val', 'sms');
    $('span.notification-to').show();

}

function sendTestNotification(soruceBtn, notBy, notType, notRecipient) {

    if (!(notRecipient.lastIndexOf('+', 0) === 0) && notBy != 'email')
        notRecipient = '+1' + notRecipient;


    $.ajax({
        type: 'GET',
        url: config_apiserver + 'api/monitornotifications/' + myval + '/sendtestnotification?by=' + notBy + '&type=' + notType + '&recipient=' + notRecipient,
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            showErrorMessage('Test message sent');
            soruceBtn.attr('style', 'opacity:0.7;pointer-events:auto');

        },
        error: function () {
            showErrorMessage('Could not send test message');
            soruceBtn.attr('style', 'opacity:0.7;pointer-events:auto');
        }

    });

}

function validatePhoneNumber(number) {
    var validNumber;
    $.ajax({
        type: 'GET',
        url: config_apiserver + 'api/monitornotifications/' + myval + '/validateNumber?number=' + number,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (response) {
            validNumber = true;
            console.log(response, 'twilio res');

            var num = response.NationalFormat.replace('(', '').replace(')', '');


            normalizedNumber = response.CountryCode + ' (' + num.substring(0, num.indexOf(' ')) + ') ' + num.substring(num.indexOf(' ') + 1, num.length).replace(/\s+/g, '-');



        },
        error: function () {
            validNumber = false;
        }

    });


    return validNumber;
}

function validateDeviceId(deviceid) {

    if (deviceid.length < 1) {
        $('#lblDeviceIdError').show();
        $('#lblDeviceIdError').text('Device ID is not valid.');
        $("#divDeviceId").addClass("error-control");
        return false;
    }
    $.ajax({
        url: config_apiserver + 'api/device/bykey/' + deviceid,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            // console.log(data, "device");
            if (!data.used) {
                $('#lblDeviceIdError').hide();
                $("#divDeviceId").removeClass("error-control");
                return;
            } else {
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('This Device ID is already assigned');
                $("#divDeviceId").addClass("error-control");
                return false;
            }


        },
        error: function (x, y, z) {
            $('#lblDeviceIdError').show();
            $('#lblDeviceIdError').text('Device ID is not valid.');
            $("#divDeviceId").addClass("error-control");
            return false;
        }
    });

}

function checkDeviceId(deviceid) {

    var data;

    $.ajax({
        url: config_apiserver + 'api/device/bykey/' + deviceid,
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {

            if (!data.used)
                return validate('deviceId')('not used');
            else return validate('deviceId')('in use');
        },

        error: function () {

            return validate('deviceId')('invalid');
        }

    });

    return data;

}

function validateEditMonitor() {


    $('.profile-input, .prescription-input').focusin(function () {

        prevValue = $(this).val();
    });


    $('.profile-input').focusout(function () {
        if (validate('profileBtn')() && $(this).val() != prevValue)
            saveEdit();
    });

    $('#prescription input, #profile input').focusin(function () {
        iniValue = $(this).val();


        $(this).unbind('keypress');
        $(this).keypress(function (e) {

            if (e.which == 13 && iniValue != $(this).val()) {

                console.log($('.drop-btn-group').find('[drop-count="' + 1 + '"]').is(':focus'));

                saveEdit();
                prevValue = $(this).val();
                iniValue = $(this).val();
                if ($(this).attr('id') == 'txtDeviceId')
                    $(this).tooltip('hide');
            }
        });
    });




    $('.profile-input-change').change(function () {
        saveEdit();
    });


    $('.prescription-input-change').change(function () {
        if ((start != $('#startDate').val() || end != $('#endDate').val()) && validate('prescriptionBtn')()) {
            saveEdit();
            start = $('#startDate').val();
            end = $('#endDate').val();
        }
    });

    $('.prescription-input').focusout(function () {

        if (validate('profileBtn')() && $(this).val() != prevValue)
            saveEdit();
    });

}

function resetValidateEditMonitor() {
    $('.profile-input, .prescription-input').unbind('focusout');
    $('.prescription-input-change, .profile-input-change').unbind('change');
}

function validate(source) {



    var validation = {

        idTabBtn: function () {
            var patientid = $("#txtPatientId").val();
            if (patientid.length < 1) {
                $('#lblPatientIdError').html('Patient Number is required.').show();
                $("#divPatientId").addClass("error-control");
                return false;
            }
            if (patientid.length < 2) {
                $('#lblPatientIdError').html('Patient number cannot be less than 2 characters long.').show();
                $("#divPatientId").addClass("error-control");
                return false;
            }

            return true;
        },
        profileBtn: function () {


            var age = $("#txtAge").val();



            if (!isDate(age) && age != "") {
                $('#lblAgeError').show();
                $('#lblAgeError').text('Make sure the date format is MM/DD/YYYY (ex: 02/18/1990)');
                $("#lblAgeError").addClass("error-control");
                return false;
            }


            $('#lblPatientIdError').hide();
            $('#divPatientId').removeClass("error-control");


            if ($('#timezone').val() == '') {
                //$('#timezoneError').show();
                $("#s2id_timezone").attr('style', 'border: 1px solid #F35958;height: 37px !important;padding: 0px !important;');
                return false;

            }
            $('#s2id_timezone').attr('style', 'border:none;padding: 0px ! important;');

            return true;
        },

        prescriptionBtn: function () {

            var medicineName = $('#txtComments').val();
            var medname = $('#txtMedName').val();
            var deviceid = $('#txtDeviceId').val();
            var startDate = $('#startDate').val(),
                endDate = $('#endDate').val();

            $('#lblAgeError').hide();
            $('#lblAgeError').removeClass('error-control');

            if (medicineName.length == 1) {
                $('#txtCommentsError').show();
                $("#divMedicines").addClass("error-control");
                return false;
            }

            $('#txtCommentsError').hide();
            $('#divMedicines').removeClass('error-control');

            var timeCtr = $('.dosage-time-div');
            var validTime = true;

            if (deviceid != '' && deviceid != prevDeviceId) {
                checkDeviceId(deviceid);

                if (deviceStatus != 'not used')
                    return false;
            }


            if (startDate != '' || endDate != '') {

                if (new Date(startDate) > new Date(endDate)) {

                    $('#datesError').show();
                    $('.monitor-dates').attr('style', 'border: 1px solid #F35958 !important;border-left: none !important;');
                    $('#startDate, #endDate, span.monitor-dates').addClass('error-monitor-dates');
                    return false;
                }
            }

            $('#datesError').hide();
            $('#startDate, #endDate, span.monitor-dates').removeClass('error-monitor-dates');
            $('.monitor-dates').attr('style', 'border: 1px solid #E5E9EC !important;border-left:none !important;');
            $("#s2id_timezone").css('border', ' none');


            if (validTime) {
                $('.time-error').each(function () {
                    $(this).removeClass('time-error');
                    $(this).next('span.input-group-addon').removeClass('time-error-span');
                });
                return true;
            }


            return false;

        },

        deviceId: function (status) {

            var deviceid = $("#txtDeviceId").val();
            deviceStatus = status;
            if (deviceid.length < 1) {
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('Device ID is not valid.');
                $("#divDeviceId").addClass("error-control");
                return;
            }


            if (status == 'in use') {
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('This Device ID is already assigned');
                $('#divDeviceId').addClass('error-control');
                return;
            } else if (status == 'invalid') {
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('Device ID is not valid.');
                $('#divDeviceId').addClass('error-control');
                return;
            }



            $('#lblDeviceIdError').hide();
            $('#divDeviceId').removeClass('error-control');
            $('#lblDeviceIdError').hide();
            $('#divDeviceId').removeClass('error-control');
            return;

        },

        researchParticipantBtn: function () {
            var researchKey = $('#txtResearchKey').val();


            if (researchKey.length < 1) {
                $('#lblResearchKeyError').html('Research key is required.').show();
                $('#txtResearchKey').css('border', '1px solid #F35958');
                return false;
            }

            $('#dialogSpinner').show();
            $('#txtResearchKey').attr('disabled', 'disabled');

            validateResearchKey(researchKey);

            if (!validKey) {
                $('#lblResearchKeyError').html('The key you entered is invalid.').show();
                $('#txtResearchKey').css('border', '1px solid #F35958');

                $('#dialogSpinner').hide();
                $('#txtResearchKey').removeAttr('disabled');

                return;
            }

            $('#txtResearchName').val(researchDetails.ResearchName);
            $('#researchStartDate').val(angular.injector(['ng']).get('$filter')('date')(researchDetails.StartDate, 'MMM dd, yyyy'));
            $('#researchEndDate').val(angular.injector(['ng']).get('$filter')('date')(researchDetails.EndDate, 'MMM dd, yyyy'));
            rId = researchDetails.ResearchId;



            $('#lblResearchKeyError').hide();
            $('#txtResearchKey').css('border', 'none');


            $('#dialogSpinner').hide();
            $('#txtResearchKey').removeAttr('disabled');

            $('#participationDetails').show();
            $('#idTabBtn').click();
            wizard('assgin');
            $('#tab-4 li').css('visibility', 'visible');
            modalViewed = 'assign';

            return;

        },

        research: function (response) {
            if (response == null)
                validKey = false;
            else validKey = true;

            return;
        }

    }

    return validation[source];

}

function postNotification(notificationType, notifyBy, recipient) {
    notificationType = 'Medication reminders';
    $('#dialogSpinner').show();
    $('#saveNotification').attr('disabled', true);

    var notification = {
        NotificationType: notificationType,
        NotificationBy: notifyBy,
        recipient: recipient,
        NormalizedNumber: (notifyBy == 'email') ? null : normalizedNumber,
        RxMonitorId: monitorId
    };

    if (recipient.indexOf('+') == -1 && normalizedNumber.indexOf('US') == -1 && notifyBy != 'email')
        recipient = '+' + recipient;

    $.ajax({
        url: config_apiserver + 'api/monitornotifications/' + myval + '/addnotification',
        type: 'POST',
        data: JSON.stringify(notification),
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            if (data == 'duplicate') {
                showErrorMessage('Duplicate Recipients');
                $('#dialogSpinner').hide();
                $('#saveNotification').attr('disabled', false);

            } else {
                $('#dialogSpinner').hide();
                $('#saveNotification').attr('disabled', false);
                addNotification(notificationType, notifyBy, recipient, data.MonitorNotificationId);
                showErrorMessage('Notification added');
            }
        },
        error: function () {
            $('#dialogSpinner').hide();
            $('#saveNotification').attr('disabled', false);
            showErrorMessage('Could not add notification');
        }
    });

}

function deleteNotification(notificationId) {

    var removeBtn = $('div[not-id="' + notificationId + '"]').find('.icon-remove');

    $('#dialogSpinner').show();
    removeBtn.css('pointer-events', 'none');

    $.ajax({
        url: config_apiserver + 'api/monitornotifications/' + myval + '/' + notificationId + '/deletenotification',
        type: 'DELETE',
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            $('div[not-id="' + notificationId + '"]').remove();
            showErrorMessage('Notification removed');

            $('#dialogSpinner').hide();
            removeBtn.css('pointer-events', 'auto');
        },
        error: function () {

            showErrorMessage('Could not remove notification');
            $('#dialogSpinner').hide();
            removeBtn.css('pointer-events', 'auto');
        }
    });



}
function displayTimeZone(data) {
    for (var p in data) {


        $('#timezone').append('<option value=' + data[p].Name + '>' + data[p].TimeZoneOff + '</option>');

    }


    
}

function getTimeZones() {


    $.ajax({
        url: config_apiserver + 'api/rxmonitor/timeZoneWithOffset',
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            console.log("Time Zone From Zones Table : ", data);

            displayTimeZone(data);
        },
        error: function (x, y, z) {
          
        }
    });








}




function saveEdit(source) {

    if (!validateEdit())
        return;


    $('#dialogSpinner').show();


    $("#btnSaveEdit , #btnCancelEdit, #btnSaveEdit, #btnDeactivate").attr("disabled", true);
    var userid = myval;
    var fname = $("#txtFirstName")
        .val();
    var lname = $("#txtLastName")
        .val();
    var age = $("#txtAge")
        .val();
    var gender = $("#selectGender")
        .val();

    var monTimezone = $('#timezone').val();
    console.log("Selected Time Zone :", monTimezone);
    //var monTimezone = $('#timezone>option:selected').attr('time');
   // var timezoneOption = $('#timezone').val();
    var patientid = $("#txtPatientId")
        .val();
    var comments = $("#txtComments")
        .val();
    var medkey = $("#txtMedKey")
        .val();
    var deviceid = $("#txtDeviceId")
        .val();
    var startdate = $("#startDate")
        .val() == "" ? "" : new Date($("#startDate")
            .val());
    //    startdate = new Date(startdate.setDate(startdate.getDate() + 1));
    var enddate = $("#endDate")
        .val() == "" ? "" : new Date($("#endDate")
            .val());
    //    enddate = new Date(enddate.setDate(enddate.getDate() + 1));

    var researchCenter = $('#txtResearchCenter').val();

    var time = [];
    var timeCtr = 0;
    var dosageTimeEdited = false;
    $('.dosage-time').each(function () {
        console.log($(this).val(), 'time')
        var tValue = convert12to24hrs($(this).val());
        if (tValue != '')
            time[timeCtr] = tValue;

        if (time[timeCtr] != prevDosages[timeCtr]) {
            dosageTimeEdited = true;
        }

        timeCtr++;
    });
    

    if (source == 'remove-time')
        dosageTimeEdited = true;

    if (!dosageTimeEdited)
        time = [];
    else prevDosages = time;



    var dropCount = $('.drop-btn-group').find('.clicked').attr('drop-count');
    var eyeCount = $('.eye-btn-group').find('.clicked').attr('eye-count');


    jQuery.support.cors = true;
    var patient = {
        FirstName: fname,
        LastName: lname,
        Age: age,
        Gender: gender,
        PatientId: patientid
    };
    var monitor = {
        Comments: comments,
        //        MedicineKey: medkey,
        OwnerId: userid,
        DeviceKey: deviceid,
        StartDate: startdate,
        EndDate: enddate,
        StartDate: startdate,
        EndDate: enddate,
        Time: time,
        DosageTimeEdited: dosageTimeEdited,
        DropCount: dropCount,
        EyeCount: eyeCount,
        TimeZoneId: monTimezone,
   //     Timezone: monTimezone,
        //   OptionId: timezoneOption,
        ResearchCenter: researchCenter
    };
    //    console.log(JSON.stringify({
    //        Patient: patient,
    //        Monitor: monitor
    //    }));
    //
    //    console.log(JSON.stringify({
    //        Patient: patient,
    //        Monitor: monitor
    //    }));


    if (deviceid.length > 0 && prevDeviceId != deviceid) {
        console.log("Device ID", deviceid);
        console.log("Prev Device", prevDeviceId);

        console.log(monitor, 'device monitor');
        $.ajax({
            url: config_apiserver + 'api/device/bykey/' + deviceid,
            contentType: "application/json;charset=utf-8",
            async: true,
            success: function (data) {
                // console.log(data, "device");
                if (!data.used) {
                    $.ajax({
                        url: config_apiserver + 'api/rxmonitor/' + userid + '/' + editMonitorId,
                        type: 'PUT',
                        data: JSON.stringify({
                            Patient: patient,
                            Monitor: monitor
                        }),
                        contentType: "application/json;charset=utf-8",
                        success: function (data) {
                            console.log(monitor);
                            if (page != 'details') {

                                if (!$('#patientModal').hasClass('in')) {
                                    $('#dialogSpinner').hide();
                                    if (source == 'esc') {
                                        angular.element('body').scope().getMonitor();
                                    }
                                    angular.element('body').scope().getMonitor();
                                    monitorEdit = false;
                                } else monitorEdit = true;
                            } else getDetails();
                            showErrorMessage('Prescription successfully edited');
                            //$('.dropdown-menu ').hide();
                            $('#dialogSpinner').hide();
                            $('.release-device').show();
                            $('#releaseDevice').show();
                            $("#btnSaveEdit , #btnCancel, #btnSave, #btnDeactivate").attr("disabled", false);
                            prevDeviceId = deviceid;
                            $('#txtDeviceId').attr('disabled', true);
                            //completeEdit();
                        },
                        error: function (x, y, z) {
                            $("#btnSave , #btnCancel, #btnSave, #btnDeactivate").attr("disabled", false);
                            alert('Failed to edit the prescription');
                            $('#dialogSpinner').hide();
                        }
                    });
                } else {
                    console.log("Data USED");
                    $('#lblDeviceIdError').show();
                    $('#lblDeviceIdError').text('This Device ID is already assigned');
                    $("#divDeviceId").addClass("error-control");
                    $('#dialogSpinner').hide();
                    return;
                }


            },
            error: function (x, y, z) {
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('Device ID is not valid.');
                $("#divDeviceId").addClass("error-control");
                $('#dialogSpinner').hide();
                return;
            }
        });
    } else {
        console.log(monitor, ' monitor');
        $.ajax({
            url: config_apiserver + 'api/rxmonitor/' + userid + "/" + editMonitorId,
            type: 'PUT',
            data: JSON.stringify({
                Patient: patient,
                Monitor: monitor
            }),
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(monitor);
                if (page != 'details') {
                    //$('#tblmonitors').dataTable().fnClearTable();
                    if (!$('#patientModal').hasClass('in')) {
                        $('#dialogSpinner').hide();
                        //                        $('#tblmonitors').dataTable().fnClearTable();
                        // reloadTableHandler($("#selectPrescriptionStatus").val());
                        angular.element('body').scope().getMonitor();
                        monitorEdit = false;
                    } else monitorEdit = true;
                } else getDetails();
                showErrorMessage('Prescription successfully edited');
                //                $('.dropdown-menu ').hide();
                $("#btnSaveEdit , #btnCancel, #btnSave, #btnDeactivate").attr("disabled", false);
                $('#dialogSpinner').hide();

                //               if(source == 'esc')   { $('#patientModal').modal('hide');    angular.element('body').scope().getMonitor();}

            },
            error: function (x, y, z) {
                $("#btnSave , #btnCancel, #btnSave, #btnDeactivate").attr("disabled", false);
                alert('Failed to edit the Device');
                $('#dialogSpinner').hide();
            }
        });
    }


}

function getMonitorPermissions(mid) {
    $.ajax({
        url: config_apiserver + 'api/rxmonitor/' + mid + '/permissions',
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (response) {
            $('#permissionsList').empty();
            for (var p in response) {
                addPermission(response[p].Username, response[p].Role, response[p].Email, response[p].MonitorPermissionId, response[p].RoleId)
            }
            $('.icon-remove-permission').first().hide();
        }
    });
}

function postPermission(email, role) {

    $('#dialogSpinner').show();
    $('#addPermission').attr('disabled', true);


    jQuery.support.cors = true;
    var MonitorPermission = {
        Ref_Id: mid,
        Ref_Type: "patient",
        RxUserId: 1,
        RoleId: role,
        PermissionStatus: "Active"
    };

    console.log(JSON.stringify(MonitorPermission));
    $.ajax({
        url: config_apiserver + 'api/Permission/' + email + '/add/' + myval,
        type: 'POST',
        data: JSON.stringify(MonitorPermission),
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (response) {
            $('#dialogSpinner').hide();
            $('#addPermission').attr('disabled', false);


            if (response == "Duplicate Invite") {
                showErrorMessage(response);
            } else {

                addPermission(response.Username, response.Role, response.Email, response.MonitorPermissionId, role);

                $('#newPermissionDiv').find('#permissionEmail').val('');
                $('#newPermissionDiv').find('#permissionRole').select2('val', 5);
                showErrorMessage('Permission added');
                if (page != 'details')
                    angular.element('body').scope().getMonitor();
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

function removePermission(source) {

    $('#dialogSpinner').show();
    source.css('pointer-events', 'none');

    var email = source.parent().find('.permission-patient-email').attr('email');
    var monitorPermissionId = source.parent().parent().attr('mp-id');
    var roleId = source.parent().parent().attr('r-id');


    if (monitorPermissionId != 0) {


        var MonitorPermission = {
            PermissionId: monitorPermissionId,
            Ref_Id: mid,
            Ref_Type: "patient",
            RoleId: roleId,
            PermissionStatus: "Revoked"
        };

        jQuery.support.cors = true;
        $.ajax({
            url: config_apiserver + 'api/Permission/changepermission/' + myval + '/' + monitorPermissionId,
            type: 'PUT',
            data: JSON.stringify(MonitorPermission),
            contentType: "application/json;charset=utf-8",
            aysnc: true,
            success: function (data) {
                console.log('success');
                if (page != 'details')
                    angular.element('body').scope().getMonitor();
                //                    reloadTable($('#selectPrescriptionStatus').val());
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
            url: config_apiserver + 'api/pendingtrusts/' + myval + '/' + email + '/' + mid + '/patient/revoke-access',
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            aysnc: true,
            success: function (data) {
                console.log('success');
                if (page != 'details')
                    //                    reloadTable($('#selectPrescriptionStatus').val());
                    angular.element('body').scope().getMonitor();
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
    var MonitorPermission = {

        Ref_Id: mid,
        Ref_Type: "patient",
        RxUserId: 1,
        RoleId: roleId,
        PermissionStatus: "Active"
    };


    $.ajax({
        url: config_apiserver + 'api/permission/' + email + '/resend/' + myval,
        type: 'POST',
        data: JSON.stringify(MonitorPermission),
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

function permissionEdit(permission) {

    if ((permission != 6 && permission != 5 && permission != 0) || (mid == 177 || mid == 178 || mid == 179)) {
        $('#prescription :input, #txtPatientId').attr('disabled', true);
        $('#prescription').attr('disabled', true);
        $('#prescription').find('span').css('pointer-events', 'none');
        $('#prescription').find('#releaseDevice').css('pointer-events', 'auto').attr('disabled', false);

        if (mid == 177 || mid == 178 || mid == 179) {
            $('#releaseDevice').hide();
            $('#txtPatientId').attr('disabled', false);
            $('#txtDeviceId').attr('disabled', true);
        }
        $('.added-time').each(function () {
            $(this).find('span').css('pointer-events', 'none');
            $(this).find('input').attr('disabled', true);
        });

        $('#prescription').find('.clockpicker-clock-icon').attr('style', 'background-color : #F4F4F4');
        $('#s2id_timezone .select2-choice').css('pointer-events', 'none').css('background-color', '#EEEEEE');
        $('#permissionRole').select2('destroy');
        $("#permissionRole option[value='6'], #permissionRole option[value='5']").remove();
        $('#permissionRole').select2({
            minimumResultsForSearch: Infinity
        });

        $('.date-icons').unbind('click');
    } else {



        $('.date-icons').click(function () {

            $(this).prev().datepicker('show');

        });


    }
}

function validateEdit() {
    var medicineName = $("#txtComments").val();

    var patientid = $("#txtPatientId").val();

    var medname = $("#txtMedName").val();
    var deviceid = $("#txtDeviceId").val();
    var age = $("#txtAge").val();
    clearEditValidation();


    if (patientid.length < 2) {
        $('#lblPatientIdError').show();
        $("#divPatientId").addClass("error-control");
        return false;
    }

    if (!isDate(age) && age != "") {
        $('#lblAgeError').show();
        $('#lblAgeError').text('Make sure the date format is MM/DD/YYYY (ex: 02/18/1990)');
        $("#lblAgeError").addClass("error-control");
        return false;
    }

    if (medicineName.length < 2 && medicineName.length != 0) {
        $('#txtCommentsError').show();
        $("#divMedicines").addClass("error-control");
        return false;
    }

    var timeCtr = $('.dosage-time-div');
    var validTime = true;

    $('#timeError').hide();
    if (!validTime)
        return false;

    return true;
}

function clearEditValidation() {
    $('.error-control').each(function () {
        $(this).removeClass('error-control');
    });
    $('#lblFirstNameError')
        .hide();
    $("#divFirstName")
        .removeClass("error-control");
    $('#lblLastNameError')
        .hide();
    $("#divLastName")
        .removeClass("error-control");
    $('#lblAgeError')
        .hide();
    $("#divAge")
        .removeClass("error-control");
    $('#lblMedNameError')
        .hide();
    $("#divMedName")
        .removeClass("error-control");
    $('#lblDeviceIdError')
        .hide();
    $("#divDeviceId")
        .removeClass("error-control");
    $('#lblPatientIdError')
        .hide();
    $("#divPatientId")
        .removeClass("error-control");
}

function deleteMonitor(id) {
    $('#btn-modal-delete-monitor, #btn-modal-cancel-delete-monitor').attr('disabled', true);
    $('#releaseSpinner').css('visibility', 'visible');
    //txtDeviceId
    var deviceKey = $('#txtDeviceId').val();
    $.ajax({
        url: config_apiserver + 'api/rxmonitor/' + myval + "/" + id + "/release/" + deviceKey,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (page != 'details') {
                //                $('#tblmonitors').dataTable().fnClearTable();
                //                reloadTableHandler($("#selectPrescriptionStatus").val());
                angular.element('body').scope().getMonitor()
            } else getDetails();

            $('#modalDeleteMonitor').modal('hide');
            $('#btn-modal-delete-monitor, #btn-modal-cancel-delete-monitor').attr('disabled', false);
            $('#releaseSpinner').css('visibility', 'hidden');
            showErrorMessage('Device  successfully released');
            prevDeviceId = 'released';
            $('#txtDeviceId').attr('disabled', false);
        },
        error: function (x, y, z) {

            $('#modalDeleteMonitor').modal('hide');
            $('#btn-modal-delete-monitor, #btn-modal-cancel-delete-monitor').attr('disabled', false);
            $('#releaseSpinner').css('visibility', 'hidden');
            showErrorMessage('Could not release device');
        }
    });
}

//==  testing if this will get you the right Value 
$("#timezone").change(function () {
    console.log("Selected Time Zone :", $('#timezone').val());
});



function AddMonitor() {
    $('#dialogSpinner').show();
    $('.modal-footer button').attr('disabled', true);
    if (!validateEdit()) {
        $('#dialogSpinner').hide();
        $('.modal-footer button').attr('disabled', false);
        return;
    }
    $("#btn-add-monitor, #btn-cancel-monitor").attr("disabled", true);
    var userid = myval;
    var fname = $("#txtFirstName")
        .val();
    var lname = $("#txtLastName")
        .val();
    var age = $("#txtAge")
        .val();
    var gender = $("#selectGender")
        .val();
    var monTimezone = $('#timezone').val();
    console.log("Selected Time Zone :", monTimezone);


    // var timezoneOption = $('#timezone').val();
    var patientid = $("#txtPatientId")
        .val();
    var comments = $("#txtComments")
        .val();
    var medkey = $("#txtMedKey")
        .val();
    var deviceid = $("#txtDeviceId")
        .val();
    var startdate = $("#startDate")
        .val() == "" ? "" : new Date($("#startDate")
            .val());
    if (startdate != "") {
        startdate = new Date(startdate.setDate(startdate.getDate() + 1));
    }
    var enddate = $("#endDate")
        .val() == "" ? "" : new Date($("#endDate")
            .val());
    if (enddate != "") {
        enddate = new Date(enddate.setDate(enddate.getDate() + 1));
    }
    var time = [];
    var timeCtr = 0;
    $('.dosage-time').each(function () {
        console.log($(this).val(), 'time')
        var tValue = convert12to24hrs($(this).val());
        if (tValue != '')
            time[timeCtr] = tValue;
        timeCtr++;

    });
    var dropCount = $('.drop-btn-group').find('.active').attr('drop-count');
    var eyeCount = $('.eye-btn-group').find('.active').attr('eye-count');

    if (validKey) {
        var researchId = rId;
        var researchCenter = $('#txtResearchCenter').val();
    }


    jQuery.support.cors = true;
    var patient = {
        FirstName: fname,
        LastName: lname,
        Age: age,
        Gender: gender,
        PatientId: patientid
    };
    var monitor = {
        Comments: comments,
        //MedicineKey: medkey,
        OwnerId: userid,
        DeviceKey: deviceid,
        StartDate: startdate,
        EndDate: enddate,
        StartDate: startdate,
        EndDate: enddate,
        Time: time,
        DropCount: dropCount,
        EyeCount: eyeCount,
        Notifications: assignNotifications,
        Permissions: assignPermissions,
        TimeZoneId: monTimezone,
        //OptionId: timezoneOption,
        ResearchId: researchId,
        ResearchCenter: researchCenter
    };



    if (deviceid.length > 0) {
        $.ajax({
            url: config_apiserver + 'api/device/bykey/' + deviceid,
            contentType: "application/json;charset=utf-8",
            async: false,
            success: function (data) {
                // console.log(data, "device");
                if (!data.used) {
                    $.ajax({
                        url: config_apiserver + 'api/rxmonitor/' + userid,
                        type: 'POST',
                        data: JSON.stringify({
                            Patient: patient,
                            Monitor: monitor
                        }),
                        contentType: "application/json;charset=utf-8",
                        success: function (data) {
                            $('#dialogSpinner').hide();
                            $('.modal-footer button').attr('disabled', false);
                            showErrorMessage('New patient sucessfully added');
                            //                            $('#tblmonitors').dataTable().fnClearTable();
                            //                            reloadTableHandler($("#selectPrescriptionStatus").val());
                            angular.element('body').scope().getMonitor();
                            $("#btn-add-monitor, #btn-cancel-monitor").attr("disabled", false);
                            completeAddMonitor();
                            $('#patientModal').modal('hide');
                        },
                        error: function (x, y, z) {
                            $('#dialogSpinner').hide();
                            $("#btn-add-monitor, #btn-cancel-monitor").attr("disabled", false);
                            alert('fail');
                        }
                    });
                } else {
                    $('#lblDeviceIdError').show();
                    $('.modal-footer button').attr('disabled', false);
                    $('#lblDeviceIdError').text('This Device ID is already assigned');
                    $("#divDeviceId").addClass("error-control");
                    return;
                }


            },
            error: function (x, y, z) {
                $('#dialogSpinner').hide();
                $('.modal-footer button').attr('disabled', false);
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('Device ID is not valid.');
                $("#divDeviceId").addClass("error-control");
                return;
            }
        });
    } else {
        $.ajax({
            url: config_apiserver + 'api/rxmonitor/' + userid,
            type: 'POST',
            data: JSON.stringify({
                Patient: patient,
                Monitor: monitor
            }),
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                $('#dialogSpinner').hide();
                $('.modal-footer button').attr('disabled', false);
                showErrorMessage('New patient sucessfully added');
                //                $('#tblmonitors').dataTable().fnClearTable();
                //                reloadTableHandler($("#selectPrescriptionStatus").val());
                angular.element('body').scope().getMonitor();
                $("#btn-add-monitor, #btn-cancel-monitor").attr("disabled", false);
                completeAddMonitor();
                $('#patientModal').modal('hide');
            },
            error: function (x, y, z) {
                $('#dialogSpinner').hide();
                $('.modal-footer button').attr('disabled', false);
                $("#btn-add-monitor, #btn-cancel-monitor").attr("disabled", false);
                alert('fail');
            }
        });

    }
}

function getTimepickerCurrentValue(element, value) {
    timeInput = element;
    timeValue = value;
}

function checkTimeChange(element) {
    var value = element.val();

    $('.last-dosage').removeClass('last-dosage');
    $('input.dosage-time').last().addClass('last-dosage');

    if (timeValue != value) {

        if (value == '') {

            if (element.hasClass('last-dosage')) {
                element.addClass('plus-time-icon');
            } else {
                element.parent().parent().remove();
            }

        } else {
            if (element.hasClass('last-dosage')) {
                $('.time-div').append(timeElement);
                $('input.dosage-time').last().timepicker(timepickerOptions);
            } else {
                element.removeClass('plus-time-icon');
                $('input.dosage-time ').timepicker(timepickerOptions)
            }
        }
        if (modalViewed == 'edit') {
            saveEdit();

        }
    } else if (timeValue == '') {
        element.addClass('plus-time-icon');
    }
    element.attr('placeholder', '   ï§');

}

function getDateView(date) {

    var dateStr;

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    dateStr = months[date.getMonth()] + ' ' + (date.getDate() < 9 ? '0' + date.getDate() : date.getDate()) + ', ' + date.getFullYear();
    //    dateStr += months[date.getMonth()] + ' ' + (date.getDate());

    return dateStr;

}

function createOffset(date) {
    var sign = (date.getTimezoneOffset() > 0) ? "-" : "+";
    var offset = Math.abs(date.getTimezoneOffset());
    var hours = pad(Math.floor(offset / 60));
    var minutes = pad(offset % 60);
    return (hours == '00' ? '' : sign) + hours + ":" + minutes;

    function pad(value) {
        return value < 10 ? '0' + value : value;
    }
}

function convert12to24hrs(time) {
    console.log(time, '12to24');
    if (time != '') {
        var time = time.match(/(\d+):(\d+) (\w)/);
        console.log(time, '12to24hrs');
        var hours = time[1];
        var minutes = time[2];
        //    var seconds = Number(time[3]);
        var meridian = time[3].toLowerCase();
        console.log(hours, '12to24 hours');
        if (meridian == 'p' && hours < 12) {
            hours = parseInt(hours) + 12;
        } else if (meridian == 'a' && hours == 12) {
            hours = parseInt(hours) - 12;
        }

        return (hours + ':' + (minutes.toString().length == 1 ? '0' + minutes : minutes));
    }

    return '';
}

function convert24to12(time) {

    var hours = time.substring(0, time.indexOf(':'));
    var minutes = time.substring(time.indexOf(':') + 1, time.length);


    suffix = (hours >= 12) ? 'PM' : 'AM';

    //only -12 from hours if it is greater than 12 (if not back at mid night)
    hours = (hours > 12) ? hours - 12 : hours;

    //if 00 then it is 12 am
    hours = (hours == '00') ? 12 : hours;


    return (hours.toString().indexOf('0') == 0 ? hours.replace('0', '') : hours) + ':' + minutes + ' ' + suffix;


}

function validateNotification() {
    if ($('#notifyBy').val() == "email")
        return validateEmail($("#recipient").val().replace(/ /g, ''));
    else
        return validatePhone($("#recipient").val().replace(/ /g, ''));
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validatePhone(number) {

    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (phoneno.test(number))
        return validatePhoneNumber(number);
    else return false;
}

function validateResearchKey(key) {

    key = encodeURIComponent(key);
    console.log(key, 'key');

    $.ajax({
        type: 'GET',
        async: false,
        url: config_apiserver + 'api/research/validateKey?userid=' + myval + '&key=' + key,
        dataType: "json",
        success: function (response) {

            researchDetails = response;
            validate('research')(response);

        },
        error: function () {
            researchDetails = null;
            validate('research')(researchDetails);
        }

    });



}