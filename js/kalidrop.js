var id = myval;
var server = 'live';
var key;
ajaxSetup();
/* Default class modification */
$.extend($.fn.dataTableExt.oStdClasses, {
    "sWrapper": "dataTables_wrapper form-inline"
});


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
    return {
        "iStart": oSettings._iDisplayStart,
        "iEnd": oSettings.fnDisplayEnd(),
        "iLength": oSettings._iDisplayLength,
        "iTotal": oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage": oSettings._iDisplayLength === -1 ?
            0 : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
        "iTotalPages": oSettings._iDisplayLength === -1 ?
            0 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
    };
};


$.extend($.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function (oSettings, nPaging, fnDraw) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function (e) {
                e.preventDefault();
                if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                    fnDraw(oSettings);
                }
            };

            $(nPaging).addClass('pagination').append(
                '<ul>' +
                '<li class="prev disabled"><a href="#"><i class="fa fa-chevron-left"></i></a></li>' +
                '<li class="next disabled"><a href="#"><i class="fa fa-chevron-right"></i></a></li>' +
                '</ul>'
            );
            var els = $('a', nPaging);
            $(els[0]).bind('click.DT', {
                action: "previous"
            }, fnClickHandler);
            $(els[1]).bind('click.DT', {
                action: "next"
            }, fnClickHandler);
        },

        "fnUpdate": function (oSettings, fnDraw) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, ien, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

            if (oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            } else if (oPaging.iPage <= iHalf) {
                iStart = 1;
                iEnd = iListLength;
            } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for (i = 0, ien = an.length; i < ien; i++) {
                // Remove the middle elements
                $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                // Add the new list items and their event handlers
                for (j = iStart; j <= iEnd; j++) {
                    sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                    $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                        .insertBefore($('li:last', an[i])[0])
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                            fnDraw(oSettings);
                        });
                }

                // Add / remove disabled classes from the static elements
                if (oPaging.iPage === 0) {
                    $('li:first', an[i]).addClass('disabled');
                } else {
                    $('li:first', an[i]).removeClass('disabled');
                }

                if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                    $('li:last', an[i]).addClass('disabled');
                } else {
                    $('li:last', an[i]).removeClass('disabled');
                }
            }
        }
    }
});


$(document).ready(function () {
    ajaxSetup();

    var d = $('#devices').DataTable({
        bFilter: false,

        "width": "10%",
        "sAjaxSource": config_apiserver + "api/device/" + myval + "/all/table",
        "sAjaxDataProp": "",
        "bAutoWidth": false,
        "bLengthChange": false,
        "sPaginationType": "bootstrap",
        "aoColumns": [
            {
                "sWidth": "10%"
            },
            {
                "sWidth": "15%"
            },
            {
                "sWidth": "30%"
            },
            {
                "sWidth": "25%"
            },
            {
                "sWidth": "15%"
            },
            {
                "sWidth": "20%"
            }

        ],
        "sDom": "<'row'<'select-toolbar filter-texts col-md-8' ><'col-md-4  toolbar-direction' l <'insight_toolbar'>  >r>t<'row'<'col-md-12'p i >>"

    });


    $('#selectStatus').change(function () {
        reloadTable($('#selectStatus').val());
    });

    $('.device-class').live('change', function () {

        var element = $(this);

        element.attr('disabled', true);

        var deviceId = $(this).attr('did');
        var modelId = $('option:selected', this).attr('mid');

        $.ajax({
            url: config_apiserver + 'api/device/' + id + '/ChangeDeviceClass/' + deviceId + '/' + modelId,
            type: 'PUT',
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                element.prev().html(element.val());
                 d.fnReloadAjax();
                element.removeAttr('disabled');

            },
            error: function (response) {
                element.attr('style', 'background-color:#ea9e9e;');
            }
        });

    });


    function reloadTable(status) {
        console.log(status);
        if (status == "all")
            var url = config_apiserver + "api/device/" + myval + "/all/table";
        else if (status == 'physical')
            var url = config_apiserver + "api/device/" + myval + "/physical/table";
        else
            var url = config_apiserver + "api/device/" + myval + "/" + status + "/tabledevices";

        var oSettings = d.fnSettings();
        oSettings.sAjaxSource = url;


        d.fnReloadAjax();
    }

    $('#pDelete').live("click", function () {
        deleteid = $(this).data('id');
        key = $(this).attr('key');
        $('#modalDeleteMonitor').modal('show');
    });

    $('#btn-modal-delete-monitor').click(function () {
        deleteMonitor(deleteid, key);
    });

    function deleteMonitor(id, deviceKey) {
        $.ajax({
            url: config_apiserver + 'api/rxmonitor/' + myval + "/" + id + "/release/" + deviceKey,
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                d.fnReloadAjax();
                $('#modalDeleteMonitor').modal('hide');
                showErrorMessage('Device successfully released');
            },
            error: function (x, y, z) {
                alert('fail');
            }
        });
    }
    $('#ButtonExport1').click(function () {
        processDevicesFile();
    });
    $("input:radio[name=server]").click(function () {
        server = $(this).val();
    });


    $('#sumbitDevice').live('click', function () {


        var serial = $('#deviceSerial').val();
        var deviceId = $('#deviceId').val();

        var domain;

        if (server == "beta")
            domain = "http://beta.api.kali.care/";
        else
            domain = "http://app.kali.care/";



        if (!checkIfDeviceExist(domain, serial, deviceId))
            addDevice(domain, serial, deviceId);

        else {
            $('#requestStatus').addClass('device-fail');
            $('#requestStatus').html('Failed to add device');
        }


    });


    $('#btnCreate').click(function () {

        createNewDevice();


    });



});


function addDevice(domain, serial, deviceId) {

    $.ajax({
        url: domain + 'api/device/' + serial + '/' + deviceId + '/addDevice',
        type: 'PUT',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#requestStatus').removeClass('device-fail');
            $('#requestStatus').html('Device Added!');
            $('#deviceSerial').val('');
            $('#deviceId').val('');


        },
        error: function (x, y, z) {
            $('#requestStatus').addClass('device-fail');
            $('#requestStatus').html('Failed to add device');
        }
    });

}

function checkIfDeviceExist(domain, serial, deviceId) {

    if (domain == "http://app.kali.care/")
        domain = "http://beta.api.kali.care/";
    else
        domain = "http://app.kali.care/";


    $.ajax({
        url: domain + 'api/device/' + serial + '/' + deviceId + '/CheckDevice',
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function () {
            return true;

        },
        error: function () {
            return false;
        }
    });

}

function createNewDevice() {



    $.ajax({

        url: config_apiserver + '/api/device/' + myval + '/createNewDevice',
        type: 'POST',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            getDeviceToken(response.key);
            $('#idDiv').html(response.id);
            $('#keyDiv').html(response.key);
            $('.new-device, #newDeviceHeader').show();

        },
        error: function () {
            console.error('Could not create new device');
        }
    });




}





function getDeviceToken(key) {

    var tRequesut = {
        username: key,
        grant_type: "password"
    };
    console.log(tRequesut);

    $.ajax({
        type: "POST",
        beforeSend: function (xhr) {

            xhr.setRequestHeader('');

        },
        url: config_apiserver + "devicesToken",
        data: tRequesut,
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        aysnc: false,


        success: function (data) {
            var token = data.token_type + " " + data.access_token;
            $('#tokenDiv').html(token);
        },
        error: function () {

            console.error('Could not get Token for Device');
        }

    });

}
