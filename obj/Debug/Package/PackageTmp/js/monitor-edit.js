var editMonitorId = 0;
var prevDeviceId;
ajaxSetup();
$(document)
    .ready(function () {
        var userid = myval;
       
        $('#pEditArchived')
            .live("click", function () {
                editMonitorId = $(this)
                    .data('id');
                getMonitorDetails(editMonitorId, 'disabled');
                $('#modalEditMonitor')
                    .modal('show');
            });
        //        $("#btnSaveEdit")
        //            .click(function () {
        //                saveEdit();
        //            });
        $("#btnCancelEdit")
            .click(function () {
                completeEdit();
            });
    });
$("#btnDeactivate").click(function () {
    deleteMonitor(editMonitorId);
    $("#txtDeviceId").val('');
    $('#releaseDevice').hide();
    // completeEdit();
});


function editPrescription() {

    console.log("Validated");
    if (!validateEditPrescription())
        console.log("NotValidated");
        return;

    jQuery.support.cors = true;
    var Prescription = {
        PrescriptionId: prid,
        OwnerId: $('#inputUserId')
            .val(),
        AccountId: getParameterByName('aid'),
        DeviceId: $('#txtDeviceId')
            .val(),
        MedicineId: 1,
        PrescriptionDescription: $('#txtPrescDesc')
            .val(),
        RxID: $('#txtRxid')
            .val(),
        DrugManufacturer: $('#txtManufact')
            .val(),
        Regimen: $('#txtRegimen')
            .val(),
        StartDate: $('#txtStart')
            .val(),
        EndDate: $('#txtEnd')
            .val()
    };
    //console.log('trying to add new prescription: ' + JSON.stringify(Prescription));
    // $(":text, :password, #login_toggle").attr("disabled", true);
    $.ajax({
        url: config_apiserver + 'api/prescription/' + prid,
        type: 'PUT',
        data: JSON.stringify(Prescription),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblmonitors').dataTable().fnClearTable();
            reloadTableHanlder($("#selectPrescriptionStatus").val());
            showErrorMessage('Device successfully edited');
            completeEdit();
        },
        error: function (x, y, z) {}
    });
}


function getEditMedicineDetails(medid) {
    //console.log(medid);
    $.ajax({
        url: config_apiserver + 'api/medicine/' + medid,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            $('#txtMedDetails')
                .val(data.MedicationLabDescription);
        },
        error: function (x, y, z) {}
    });
}

function completeEdit() {
    clearEditValidation();
    $("#txtFirstName")
        .val('');
    $("#txtLastName")
        .val('');
    $("#txtAge")
        .val('');
    $("#txtPatientId")
        .val('');
    $("#txtDeviceId")
        .val('');
    $("#txtComments")
        .val('');
    $("#txtMedKey")
        .val('');
    $("#selectGender")
        .val('male');
    $('#patientModal')
        .modal('hide');

    $('.time-error').each(function () {
        $(this).removeClass('time-error');
        $(this).next().removeClass('time-error-span');
    });
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
        async: false,
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