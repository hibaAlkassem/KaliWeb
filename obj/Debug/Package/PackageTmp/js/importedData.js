var id = myval;
var server = 'live';
var lastRequestDate;
var d;
var chunk = 0;
var selectedData = [];
var dataActivity = [];
var inter;
ajaxSetup();
console.log("Ready Imported Data");
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


function initializeTable() {

    d = $('#devices').DataTable({
        bFilter: false,
        "width": "10%",
        "iDisplayLength": 2000,
        "bPaginate": false,
        "bAutoWidth": false,
        "bLengthChange": false,
        //               "sPaginationType": "bootstrap",
        "aoColumns": [
            {
                "sWidth": "13%"
            },
            {
                "sWidth": "13%"
            },
            {
                "sWidth": "18%"
            },
            {
                "sWidth": "50%"
            },
            {
                "sWidth": "10%"
            }
        ],
        "aaSorting": [],
        "sDom": "<'row'<'select-toolbar filter-texts col-md-8' ><'col-md-4  toolbar-direction' l <'insight_toolbar'>  >r>t<'row'<'col-md-12'p i >>"
    });

}

$(document).ready(function () {

    
    ajaxSetup();
    getDevices();
    //initializing Table 
    initializeTable();
    
    console.log("Ready Function");
    $('#responseDropdown').multiselect({
        close: function (event, ui) {
            loadImportedData();
            //Check if the selection is changed
            if (selectedData.toString() == dataActivity.toString()) {

            } else {
                console.log(dataActivity);
                selectedData = dataActivity;
          //    window.history.pushState('', '', config_app + 'importeddata?deviceFilter=' + $('#deviceIdDropdown').select2('val') + '&responseFilter=' + selectedData);
                reloadTable($('#deviceIdDropdown').select2('val'));

            }
        },
    });
    $('#deviceIdDropdown').select2();
    
    
    //to prevent changing url(to no querystrings) when filtering device from the select2 input after click enter
    $('form').attr('onkeypress','return event.keyCode != 13');
    

    $.ajax({
        url: config_apiserver + '/api/importdata/' + myval + '/table/getRequestDate',
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            lastRequestDate = response;

           $('#loadMore').show();
            $('#loadMore').attr('disabled',false);
            var url;


            url = config_apiserver + 'api/importData/' + myval + '/table?deviceId=-1&lastrequestdate=' + encodeURIComponent(lastRequestDate) + '&chunkcount=' + chunk;
            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify([]),
                contentType: "application/json;charset=utf-8",
                success: function (response) {
                    console.log("Data Table");
                    console.log(response);

                    d.fnAddData(response);
                    // CLASS AND DATA ID   

                    
                },
                error: function () {
                }
            });
        
        }
       

    });
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(function(){
        var x = document.getElementsByClassName("data_div");
        var y = document.getElementsByClassName("loggedIds");
        for (var m = 0; m < x.length; m++) {
            // get the loggedImportedData ID

            drawBasic(x[m],m);
        }

    });

    function drawBasic(loggedImportedData,LoggedImportedDataID) {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Dogs');
        // get the data depending on the logged Imported Data Value

        if (m == 0) {
            data.addRows([
                  [0, 0], [1, 10], [2, 23], [3, 17], [4, 18], [5, 9],
                  [6, 11], [7, 27], [8, 33], [9, 40], [10, 32], [11, 35],
                  [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
                  [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
                  [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
                  [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
                  [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
                  [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
                  [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
                  [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
                  [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
                  [66, 70], [67, 72], [68, 75], [69, 80]
            ]);

        } else if (m = 1) {
            data.addRows([
               [0, 0], [1, 10], [2, 23], [3, 17], [4, 18], [5, 9],
               [6, 11], [7, 27], [8, 33], [9, 40], [10, 32], [11, 35],
               [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48]
            ]);


        } else {
            data.addRows([
               [0, 0], [1, 10], [2, 23], [3, 17], [4, 18], [5, 9]
             
            ]);

        }
        var options = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'Popularity'
            }
        };

      

          
        var chart = new google.visualization.LineChart(loggedImportedData);

            chart.draw(data, options);
        
   

          
        
  
    }


    $('#loadMore').live('click', function () {
        $(this).attr('disabled',true);
        loadMore($('#deviceIdDropdown').val());
    });
    $('#deviceIdDropdown').select2().on('change',function () {
      //  window.history.pushState('', '', config_app + 'importeddata?deviceFilter=' + $('#deviceIdDropdown').select2('val') + '&responseFilter=' + $('#responseDropdown').select2('val'));
        reloadTable($('#deviceIdDropdown').select2('val'));
       
    });
    $("#reloadTime").click(function () {
        var date = $('#startDate').val();
        var time = $('#timepicker1').val();
        if (date == null || date == 'undefinided' || date == "") {
            console.log("Date is null");
        }
        else {
            lastRequestDate = $('#startDate').val() + " " + time;
          
        }

      //  window.history.pushState('', '', config_app + 'importeddata?deviceFilter=' + $('#deviceIdDropdown').select2('val') + '&responseFilter=' + $('#responseDropdown').select2('val'));
        reloadTable($('#deviceIdDropdown').select2('val'));
    });

    function loadImportedData() {
        dataActivity = [];


        $('#responseDropdown option:selected').each(function () {
            var selText = $(this).text();
            dataActivity.push(selText);
        });

        if (dataActivity.length == $('#responseDropdown option').length)
            dataActivity = [];

    }

function reloadTable(deviceId) {
    
    chunk = 0;
    d.fnClearTable();
    loadImportedData();
    url = config_apiserver + 'api/importData/' + myval + '/table?deviceId='+deviceId+'&lastrequestdate=' + encodeURIComponent(lastRequestDate) + '&chunkcount=' + chunk;
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(dataActivity),
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            console.log(response);
            d.fnAddData(response);

        },
        error: function () {
        }
    });

      
}

    function loadMore(deviceId) {

        chunk += 50;

        loadImportedData();
       var url = config_apiserver + 'api/importData/' + myval + '/table?deviceId=' + deviceId + '&lastrequestdate=' + encodeURIComponent(lastRequestDate) + '&chunkcount=';
        
        $.ajax({
            url: url + chunk,
            type: 'POST',
            data:JSON.stringify(dataActivity),
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                d.fnAddData(response);
                $('#loadMore').attr('disabled',false);
            },
            error: function () {
                $('#loadMore').attr('disabled',false);
            }

        });



    }


});


//function getDataInterval(deviceId, responseFilter) {
//
//    chunk = 10;
//    clearDataInterval();
//
//    d.fnClearTable();
//
//    if (deviceId == "-1")
//        var url = config_apiserver + 'api/importData/' + myval + '/table?responseFilter=-1&lastrequestdate=' + encodeURIComponent(lastRequestDate) + '&chunkcount=';
//    else
//        var url = config_apiserver + "api/importdata/" + myval + '/getLoggedData?deviceId=' + (deviceId != null ? deviceId : -3) + '&responseFilter=' + responseFilter + '&lastrequestdate=' + encodeURIComponent(lastRequestDate) + '&chunkcount=';
//
//    var oSettings = d.fnSettings();
//    oSettings.sAjaxSource = url;
//
//
////    d.fnReloadAjax();
//
//    return setInterval(function () {
//
//        chunk += 10;
//
//        $.ajax({
//            url: url + chunk,
//            type: 'GET',
//            contentType: "application/json;charset=utf-8",
//            success: function (response) {
//                if (response.length == 0)
//                    clearDataInterval();
//              
//                d.fnAddData(response);
//            },
//            error: function () {
//                clearDataInterval();
//            }
//
//        });
//
//        console.log(chunk);
//        if (chunk == 200)
//            clearDataInterval();
//
//
//    }, 2000);
//
//
//}

//function clearDataInterval() {
//
//
//    clearInterval(inter);
//
//}



function getDevices() {
    $.ajax({
        url: config_apiserver + 'api/importdata/' + myval + '/getLoggedDevices',
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            for (var d in response) {
                if (response[d].DeviceId == null)
                    continue;
                else $('#deviceIdDropdown').append($("<option />").val(response[d].DeviceId).text(response[d].DeviceHardwareId));
            }
        },
        error: function () {
            console.error('failed to get devices');
        }
    });
}

function downloadParsedCSV(id) {
    //window.open(config_apiserver + 'api/ImportData/' + id + '/processed?format=csv');

    $.ajax({
        "url": config_apiserver + "api/ImportData/" + id + "/processed?format=csv",
        "success": function (data) {
            var blob = new Blob([data], {
                type: "text/csv;charset=utf-8;"
            });

            var now = new Date(); 
            var strnow = '' + now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() + now.getMinutes() + now.getSeconds();

            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, id + "_parseddata_" + getFileDate() + '.csv')
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", id + "_parseddata_" + strnow + '.csv');
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }
    });
}


function reprocessString(id) {
    if (confirm('Are you sure you want to reprocess this string?')) {
        if (confirm('Reprocessing the string might cause the loss of some data, continue?')) {
            $.ajax({
                url: config_apiserver + 'api/ImportData/' + id + '/reprocess',
                type: 'GET',
                success: function (response) {
                    alert('reprocess successful');
                },
                error: function () {
                    alert('failed to reprocess');
                }
            });
        }
    }
}
