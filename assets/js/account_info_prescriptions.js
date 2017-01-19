var prescid = 0;
var prid = 0;
var prescTable;

$(document).ready(function () {
    //console.log(config_apiserver + "api/prescriptions/byaccount/" + getParameterByName('aid'));


    prescTable = $('#tblprescriptions').dataTable({
        "bPaginate": false,
        "bSort": false,
        "bFilter": false,
        "sAjaxSource": "PrescriptionsHandler.ashx?aid=" + getParameterByName('aid')
    });

    $('#btn-open-prescription').click(function () {
        clearAddFields();
        clearAddValidation();
        $('#new-presc-wrapper').slideToggle("fast", "linear");
    });

    $('#btn-close-presc').click(function () {
        clearAddFields();
        clearAddValidation();
        $('#new-presc-wrapper').slideToggle("fast", "linear");
    });

    $('#btn-add-presc').click(function () {
        addPrescription();
    });

    $('#pEdit').live("click", function () {
        prid = $(this).data('id');
        getPrescriptionDetails(prid);
        $('#modalEdit').modal('show');
    });

    $('#pDelete').live("click", function () {
        $('#modalDelete').modal('show');
        prescid = $(this).data('id');
    });

    $('#deletePresc').click(function () {
        deletePrescription(prescid);
    });

    $('#editPresc').click(function () {
        editPrescription();
    }); 

    initDatePicker();
});

function deletePrescription(id)
{
    $.ajax({
        url: config_apiserver + 'api/prescription/'+id,
        type: 'DELETE',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#modalDelete').modal('hide');
            prescTable.fnReloadAjax();
            showErrorMessage('Prescription successfully deleted');
        },
        error: function (x, y, z) {
            
        }
    });
}

function addPrescription()
{
    if (!validateAddPrescription())
        return;
    //add the userid
    var userid = 2, accountid = 11;
    jQuery.support.cors = true;
    var Prescription = {
        OwnerId: $('#inputUserId').val(),
        AccountId: getParameterByName('aid'),
        DeviceId: $('#txtaDevice').val(),
        MedicineId: 1,
        PrescriptionDescription: $('#txtaPresc').val(),
        RxID: $('#txtaRxid').val(),
        DrugManufacturer: $('#txtaDrugManu').val(),
        Regimen: $('#txtaRegimen').val(),
        StartDate: $('#txtaStart').val(),
        EndDate: $('#txtaEnd').val()
    };
    //console.log('trying to add new prescription: ' + JSON.stringify(Prescription));
    $.ajax({
        url: config_apiserver + 'api/prescription/',
        type: 'POST',
        data: JSON.stringify(Prescription),
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            completeAdd();
        },
        error: function (x, y, z) {
            console.log('failed');
            $('#lblaDeviceError').show();
            $('#lblaDeviceError').text('Device Id is not valid');
            $("#divaDevice").addClass("error-control");
        }
    });
}

function completeAdd()
{
    clearAddFields();
    $('#new-presc-wrapper').slideToggle("fast", "linear");
    prescTable.fnReloadAjax();
    showErrorMessage('Prescription successfully added');
}

function clearAddFields()
{
    $('#txtaPresc').val('');
    $('#txtaRxid').val('');
    $('#txtaDevice').val('');
    $('#txtaDrugManu').val('');
    $('#txtaRegimen').val('');
    $('#txtaStart').val('');
    $('#txtaEnd').val('');
}

function validateAddPrescription()
{
    var presc = $('#txtaPresc').val();
    var rxid = $('#txtaRxid').val();
    var device = $('#txtaDevice').val();
    var manu = $('#txtaDrugManu').val();
    var regimen = $('#txtaRegimen').val();
    var start = $('#txtaStart').val();
    var end = $('#txtaEnd').val();

    clearAddValidation();

    if (presc.length < 2)
    {
        $('#lblaPrescError').show();
        $("#divaPresc").addClass("error-control");
        return false;
    }

    if (rxid.length < 2) {
        $('#lblaRxidError').show();
        $("#divaRxid").addClass("error-control");
        return false;
    }

    if (device.length < 1) {
        $('#lblaDeviceError').show();
        $("#divaDevice").addClass("error-control");
        return false;
    }

    if (manu.length < 2) {
        $('#lblaDrugManuError').show();
        $("#divaDrugManu").addClass("error-control");
        return false;
    }

    if (regimen.length < 2) {
        $('#lblaRegimenError').show();
        $("#divaRegimen").addClass("error-control");
        return false;
    }

    if (start.length < 2) {
        $('#lblaStartError').show();
        $("#divaStart").addClass("error-control");
        return false;
    }

    if (end.length < 2) {
        $('#lblaEndError').show();
        $("#divaEnd").addClass("error-control");
        return false;
    }

    return true;
}

function clearAddValidation()
{
    $('#lblaPrescError').hide();
    $("#divaPresc").removeClass("error-control");
    $('#lblaRxidError').hide();
    $("#divaRxid").removeClass("error-control");
    $('#lblaDeviceError').hide();
    $('#lblaDeviceError').text('Device Id is required');
    $("#divaDevice").removeClass("error-control");
    $('#lblaDrugManuError').hide();
    $("#divaDrugManu").removeClass("error-control");
    $('#lblaRegimenError').hide();
    $("#divaRegimen").removeClass("error-control");
    $('#lblaStartError').hide();
    $("#divaStart").removeClass("error-control");
    $('#lblaEndError').hide();
    $("#divaEnd").removeClass("error-control");
}

function editPrescription() {
    if (!validateEditPrescription())
        return;
    jQuery.support.cors = true;
    var Prescription = {
        PrescriptionId: prid,
        OwnerId: $('#inputUserId').val(),
        AccountId: getParameterByName('aid'),
        DeviceId: $('#txtDeviceId').val(),
        MedicineId: 1,
        PrescriptionDescription: $('#txtPrescDesc').val(),
        RxID: $('#txtRxid').val(),
        DrugManufacturer: $('#txtManufact').val(),
        Regimen: $('#txtRegimen').val(),
        StartDate: $('#txtStart').val(),
        EndDate: $('#txtEnd').val()
    };
    //console.log('trying to add new prescription: ' + JSON.stringify(Prescription));
    $.ajax({
        url: config_apiserver + 'api/prescription/' + prid,
        type: 'PUT',
        data: JSON.stringify(Prescription),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            completeEdit();
        },
        error: function (x, y, z) {

        }
    });
}

//calls the api to get the prescription to be edited and fills its data in the modal view
function getPrescriptionDetails(pid)
{
    $.ajax({
        url: config_apiserver + 'api/prescription/' + pid,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //console.log(data);
            displayPrescriptionDetails(data);
        },
        error: function (x, y, z) {
            //console.log(x + '\n' + y + '\n' + z);
        }
    });
}

function displayPrescriptionDetails(data)
{
    $('#txtPrescDesc').val(data.PrescriptionDescription);
    $('#txtRxid').val(data.RxID);
    $('#txtDeviceId').val(data.DeviceId);
    $('#txtManufact').val(data.DrugManufacturer);
    $('#txtRegimen').val(data.Regimen);
    var dstart = new Date(data.StartDate);
    $('#txtStart').val((dstart.getMonth()+1) + '/' + dstart.getDate() + '/' + dstart.getFullYear());
    var dend = new Date(data.EndDate);
    $('#txtEnd').val((dend.getMonth() + 1) + '/' + dend.getDate() + '/' + dend.getFullYear());
}

function validateEditPrescription()
{
    return true;
}

function clearEditValidation()
{
    $('#txtPrescDesc').val('');
    $('#txtRxid').val('');
    $('#txtDeviceId').val('');
    $('#txtManufact').val('');
    $('#txtRegimen').val('');
    $('#txtStart').val('');
    $('#txtEnd').val('');
}

function completeEdit()
{
    clearAddValidation();
    $('#modalEdit').modal('hide');
    prescTable.fnReloadAjax();
    showErrorMessage('Prescription successfully edited');
}

function initDatePicker()
{
    $('.input-append.date').datepicker({
        autoclose: true,
        todayHighlight: true
    });
}