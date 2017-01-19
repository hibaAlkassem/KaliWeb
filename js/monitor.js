var monitorsTable;
var deleteid = -1;
var userid = -1;
var monitorsHandlerData;
var destoryed = false;
ajaxSetup();

/* Default class modification */
//$.extend($.fn.dataTableExt.oStdClasses, {
//    "sWrapper": "dataTables_wrapper form-inline"
//});
//
//
///* API method to get paging information */
//$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
//    return {
//        "iStart": oSettings._iDisplayStart,
//        "iEnd": oSettings.fnDisplayEnd(),
//        "iLength": oSettings._iDisplayLength,
//        "iTotal": oSettings.fnRecordsTotal(),
//        "iFilteredTotal": oSettings.fnRecordsDisplay(),
//        "iPage": oSettings._iDisplayLength === -1 ?
//            0 : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
//        "iTotalPages": oSettings._iDisplayLength === -1 ?
//            0 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
//    };
//};
//
//
//$.extend($.fn.dataTableExt.oPagination, {
//    "bootstrap": {
//        "fnInit": function (oSettings, nPaging, fnDraw) {
//            var oLang = oSettings.oLanguage.oPaginate;
//            var fnClickHandler = function (e) {
//                e.preventDefault();
//                if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
//                    fnDraw(oSettings);
//                }
//            };
//
//            $(nPaging).addClass('pagination').append(
//                '<ul>' +
//                '<li class="prev disabled"><a href="#"><i class="fa fa-chevron-left"></i></a></li>' +
//                '<li class="next disabled"><a href="#"><i class="fa fa-chevron-right"></i></a></li>' +
//                '</ul>'
//            );
//            var els = $('a', nPaging);
//            $(els[0]).bind('click.DT', {
//                action: "previous"
//            }, fnClickHandler);
//            $(els[1]).bind('click.DT', {
//                action: "next"
//            }, fnClickHandler);
//        },
//
//        "fnUpdate": function (oSettings, fnDraw) {
//            var iListLength = 5;
//            var oPaging = oSettings.oInstance.fnPagingInfo();
//            var an = oSettings.aanFeatures.p;
//            var i, ien, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);
//
//            if (oPaging.iTotalPages < iListLength) {
//                iStart = 1;
//                iEnd = oPaging.iTotalPages;
//            } else if (oPaging.iPage <= iHalf) {
//                iStart = 1;
//                iEnd = iListLength;
//            } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
//                iStart = oPaging.iTotalPages - iListLength + 1;
//                iEnd = oPaging.iTotalPages;
//            } else {
//                iStart = oPaging.iPage - iHalf + 1;
//                iEnd = iStart + iListLength - 1;
//            }
//
//            for (i = 0, ien = an.length; i < ien; i++) {
//                // Remove the middle elements
//                $('li:gt(0)', an[i]).filter(':not(:last)').remove();
//
//                // Add the new list items and their event handlers
//                for (j = iStart; j <= iEnd; j++) {
//                    sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
//                    $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
//                        .insertBefore($('li:last', an[i])[0])
//                        .bind('click', function (e) {
//                            e.preventDefault();
//                            oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
//                            fnDraw(oSettings);
//                        });
//                }
//
//                // Add / remove disabled classes from the static elements
//                if (oPaging.iPage === 0) {
//                    $('li:first', an[i]).addClass('disabled');
//                } else {
//                    $('li:first', an[i]).removeClass('disabled');
//                }
//
//                if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
//                    $('li:last', an[i]).addClass('disabled');
//                } else {
//                    $('li:last', an[i]).removeClass('disabled');
//                }
//            }
//        }
//    }
//});






$(document).ready(function () {
//    $('.select-2').select2({
//        minimumResultsForSearch: Infinity
//    });
    var userid = myval;
    // console.log(myval);

    $('.adherence').circliful();
    $("[data-toggle='tooltip']").tooltip();
//    
//    $('#patientsPaging li').live('click', function () {
////        $('.adherence').circliful();
////        $("[data-toggle='tooltip']").tooltip();
//    });

    //
    //<div class="well-lg" id="noData" style="background-color:#F0F0F0;">No data currently available for the selection.<br/></div>;
    initListeners();
//    $('#selectPrescriptionStatus').empty();
//    $('#selectPrescriptionStatus').append($("<option></option>").attr("value", -1).text("All     "));
//    $('#selectPrescriptionStatus').append($("<option></option>").attr("value", "Assigned").text("Currently Monitored"));
//    $('#selectPrescriptionStatus').append($("<option></option>").attr("value", "Released").text("Not Currently Monitored"));
//    $('#selectPrescriptionStatus').select2('val', -1);
    $('#selectPrescriptionStatus').val(-1);

//    $.ajax({
//        type: "GET",
//        url: config_apiserver + "/api/users/" + myval + "/monitors",
//        data: "",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: function (response) {
//            monitorsHandlerData = processRequest(response);
//            $("#tableSpinner").hide();
//            monitorsTable = $('#tblmonitors').dataTable({
//                "oLanguage": {
//                    "sEmptyTable": "You currently don't have access to any devices.<br />Devices you assign as well as devices shared with you will be listed here.",
//                    "sProcessing": "Deleting record..."
//
//
//                },
//                "processing": true,
//                "sPaginationType": "bootstrap",
//                "bSort": false,
//                "bFilter": false,
//                "responsive": false,
//                "bLengthChange": false,
//                "aaData": monitorsHandlerData.aaData,
//                "bNeedServer": true,
//
//                "sDom": "<'row'<'select-toolbar filter-texts col-md-8' ><'col-md-4  toolbar-direction' l <'insight_toolbar'>  >r>t<'row'<'col-md-12'p i >>"
//
//
//            });
//
//
//        },
//        error: function () {
//            console.error("error at monitor handler");
//            return;
//        }
//    });

    // console.log(monitorsHandlerData.aaData);





});

function reloadTable(status) {
    // $('#tblmonitors').dataTable().fnClearTable();
    reloadTableHandler(status);
}

function initListeners() {
    $('#btn-new-monitor, .new-monitor').click(function () {
        //$('#new-monitor-wrapper').slideToggle("fast", "linear");
        showModal($(this));
    });
    $('#selectPrescriptionStatus').change(function () {
        //console.log("changed");
//        reloadTable($('#selectPrescriptionStatus').val());
//        monitorsTable.fnPageChange(0);
        $('.adherence').empty();
        $('.adherence').circliful();
    });
    $('#btn-add-monitor').click(function () {
        AddMonitor();
    });
    $('#btn-cancel-monitor').click(function () {
        completeAddMonitor();
    });
    $('#pDelete').live("click", function () {
        deleteid = $(this).data('id');
        $('#modalDeleteMonitor').modal('show');
    });
    $('.input-append.date').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: 'M dd, yyyy'
    });
    $('#btn-modal-delete-monitor').click(function () {
        deleteMonitor(deleteid);
    });
    $('#txtDeviceId').keyup(function () {
        //console.log($('#txtDeviceId').val());
        //validateDeviceId($('#txtDeviceId').val());
    });
}



function validate() {
    var fname = $("#txtFirstName").val();
    var lname = $("#txtLastName").val();
    var age = $("#txtAge").val();
    var patientid = $("#txtPatientId").val();
    var deviceid = $("#txtDeviceId").val();
    var medication = $("#txtComments").val();
    clearValidation();


    if (patientid.length < 2) {
        $('#lblPatientIdError').show();
        $("#divPatientId").addClass("error-control");
        return false;
    }


    if (deviceid.length < 1) {
        $('#lblDeviceIdError').show();
        $('#lblDeviceIdError').text('Device ID is required.');
        $("#divDeviceId").addClass("error-control");
        return false;
    }
    if (!isDate(age) && age != "") {
        $('#lblAgeError').show();
        $('#lblAgeError').text('Make sure the date format is MM/DD/YYYY (ex: 02/18/1990)');
        $("#lblAgeError").addClass("error-control");
        return false;
    }
    if (medication.length < 1) {
        $('#txtCommentsError').show();
        $("#divMedicines").addClass("error-control");
        return false;
    }
    return true;
}


function clearValidation() {
    $('#lblFirstNameError').hide();
    $("#divFirstName").removeClass("error-control");
    $('#lblLastNameError').hide();
    $("#divLastName").removeClass("error-control");
    $('#lblAgeError').hide();
    $("#divAge").removeClass("error-control");
    $('#lblDeviceIdError').hide();
    $("#divDeviceId").removeClass("error-control");
    $('#lblPatientIdError').hide();
    $("#divPatientId").removeClass("error-control");
}

function completeAddMonitor() {
    clearValidation();
    $("#inputUserId").val('');
    $("#txtFirstName").val('');
    $("#txtLastName").val('');
    $("#txtAge").val('');
    $("#txtDeviceId").val('');
    $("#txtPatientId").val('');
    $("#txtComments").val('');
    $("#txtMedKey").val('');
    $("#selectGender").val('Male');
    //$('#new-monitor-wrapper').slideToggle("fast", "linear");
    $('#modalAddMonitor').modal('hide');
}

function getMedicineDetails(medid) {
    //console.log(medid);
    $.ajax({
        url: config_apiserver + 'api/medicine/' + medid,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            //console.log(data);
            $('#txtMedDetails').val(data.MedicationLabDescription);
        },
        error: function (x, y, z) {}
    });
}



//function deleteMonitor(id) {
//    $('#btn-modal-delete-monitor, #btn-modal-cancel-delete-monitor').attr('disabled', true);
//    $('#releaseSpinner').css('visibility', 'visible');
//    txtDeviceId
//    var deviceKey = $('#txtDeviceId').val();
//    $.ajax({
//        url: config_apiserver + 'api/rxmonitor/' + myval + "/" + id + "/release/" + deviceKey,
//        type: 'GET',
//        contentType: "application/json;charset=utf-8",
//        success: function (data) {
//            $('#tblmonitors').dataTable().fnClearTable();
//            reloadTableHandler($("#selectPrescriptionStatus").val());
//            //$('#modalDeleteMonitor').modal('hide');
//            $('#btn-modal-delete-monitor, #btn-modal-cancel-delete-monitor').attr('disabled', false);
//            $('#releaseSpinner').css('visibility', 'hidden');
//            showErrorMessage('Device  successfully released');
//            prevDeviceId = 'released';
//            $('#txtDeviceId').attr('disabled', false);
//        },
//        error: function (x, y, z) {
//            // $('#modalDeleteMonitor').modal('hide');
//            $('#btn-modal-delete-monitor, #btn-modal-cancel-delete-monitor').attr('disabled', false);
//            $('#releaseSpinner').css('visibility', 'hidden');
//            showErrorMessage('Could not release device');
//        }
//    });
//}


// script should be included before monitor.js and after master.js
//console.log(myval);


function processRequest(data) {
    var result = {
        aaData: []
    };
    for (var m in data) {
        var temp = [getPatient((data[m].PatientFirstName + " " + data[m].PatientLastName).indexOf("Anonymous") != -1 ? "Anonymous" : data[m].PatientFirstName + " " + data[m].PatientLastName, data[m].PatientIdentifier, data[m].PatientId), data[m].Comments, getDevice(data[m].MonitorStatus, data[m].DeviceId),
            getPermissions(data[m].AccessPermissions, data[m].permissions, data[m].RxMonitorId, data[m].CreatedBy,
                myval), getButtons(data[m].RxMonitorId, data[m].CreatedBy, myval, data[m].AccessPermissions, data[m].MonitorStatus)
        ];
        //console.log(data);
        result.aaData.push(temp);
    }
    //console.log(result);
    return result;
}

function getDevice(status, deviceid) {
    //console.log("getMonitor");
    //    console.log(status, 'status');
    if (status == 'Released')
        var ret = 'none';
    else {
        if (deviceid != null)
            var ret = "ID: " + deviceid;
        else ret = 'none';
    }
    return ret;
}

function getPatient(name, patid, pid) {
    //console.log("getPatient");
    var ret = name + "<br/>" + patid;
    return ret;
}

function getButtons(id, uid, myid, AccessPermissions, MonitorStatus) {
    var ret = '';
    //    console.log(MonitorStatus,id);
    if (MonitorStatus == "Assigned")
        ret = "<a class='text-info' href='#' assigned='true' id='pEdit' data-id='" + id + "' p-id='" + AccessPermissions + "'>Patient Settings</a> <br />";
    else ret = "<a class='text-info' href='#' assigned='false' id='pEdit' data-id='" + id + "' p-id='" + AccessPermissions + "'>Patient Settings</a> <br />";

    //    if(id==129 || id==130 || id==131)
    //         ret = "<a class='text-info' href='#' assigned='true' id='pEdit' data-id='" + id + "' p-id='" + AccessPermissions + "' style=' pointer-events: none; color:lightgrey !important;'>Settings</a> <br />";

    //        ret += "<a class='text-info' href='#' id='pDelete' data-id='" + id + "'>Release Device</a> <br />";
    //    } else {
    //        ret = "<a class='text-info' href='#' id='pEditArchived' data-id='" + id + "'>View </a> <br />";
    //    }
    //    ret += "<a class='text-info' href='data?mid=" + id + "'>View Patient Data</a>";
    ret += "<a class='text-info' href='details.html?mid=" + id + "'>Patient Data</a>";
    //    if (uid != myid && AccessPermissions != "1" && AccessPermissions != "4" && AccessPermissions != "5" && AccessPermissions != "6")
    //        ret = "<a class='text-info' href='data?mid=" + id + "'>View Patient Data</a>";
    //    if (myid == uid || AccessPermissions == "1" || AccessPermissions == "2" || AccessPermissions == "4" || AccessPermissions == "5" || AccessPermissions == "6")
    //        ret += "<br/><a class='text-info' href='#' id='pEditPermissions' data-id='" + id + "'>Edit Permissions</a>";
    return ret;
}

function getPermissions(AccessPermissions, perms, id, uid, myid) {
    //FIXME: This should be done in JQuery, Also we should send the userid on post to make sure nothing is hacked...
    var permissions = "";
    for (var perm in perms) {
        if (perms[perm].MonitorPermissionId != 0)
            permissions += perms[perm].Username + " (" + perms[perm].Role + ") <br />";
        else permissions += perms[perm].Email + " (" + perms[perm].Role + ") <br />";
    }
    if (permissions == "") permissions = "Data currently not shared";
    return permissions;
}

function reloadTableHandler(status) {
    var url = config_apiserver + "/api/users/" + myval + "/monitors";


    if (status != -1)
        url += "/" + status;
    //console.log(url);
    $.ajax({
        type: "GET",
        url: url,
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            monitorsHandlerData = processRequest(response);


            monitorsTable.fnClearTable();
            monitorsTable.fnAddData(monitorsHandlerData.aaData);
        },
        error: function () {
            //console.error("error at reload table handler");
            return;
        }
    });
}

function fillTable() {
    var handlerData = monitorsHandlerData;

    for (var data in handlerData.aaData)
        monitorsTable.fnAddData([
            handlerData.aaData[data][0], handlerData.aaData[data][1], handlerData.aaData[data][2], handlerData.aaData[data][3],
            handlerData.aaData[data][4]
        ]);
    // $("#btn-new-monitor").attr("disabled", false);

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