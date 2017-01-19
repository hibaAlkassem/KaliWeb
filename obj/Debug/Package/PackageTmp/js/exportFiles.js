var tempData;
var actData;
//console.log("exportFiles");
ajaxSetup();

function processActivitiesFile() {
    var url = config_apiserver + "api/activities/" + myval + "/getactivities";
    getData(url);
    actData = processActivitiesData(tempData);
    console.log(actData, "actData");
    $('#ButtonExport1').attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(actData)).attr('download', 'Kali_Activities_' + getFileDate() + '.csv');
}

function processInsightsFile() {
    var url = config_apiserver + "api/insights/withactivities";
    getData(url);
    actData = processInsightsData(tempData);
    
    
     var blob = new Blob([actData], {
        type: "text/csv;charset=utf-8;"
    });

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, 'Kali_Insights_' + getFileDate() + '.csv')
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", 'Kali_Insights_' + getFileDate() + '.csv');
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
     
   // $('#ButtonExport1').attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(actData)).attr('download', 'Kali_Insights_' + getFileDate() + '.csv');
}

function processDevicesFile() {
    var status = $('#selectStatus').val();
    var url = config_apiserver + "api/device/" + myval + "/csv/" + status;
    getData(url);
    actData = processDevicesData(tempData);
    
     var blob = new Blob([actData], {
        type: "text/csv;charset=utf-8;"
    });

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, 'Kali_Devices_' + getFileDate() + '.csv')
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", 'Kali_Devices_' + getFileDate() + '.csv');
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
        
    //$('#ButtonExport1').attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(actData)).attr('download', 'Kali_Devices_' + getFileDate() + '.csv');
}

function processDataFile(mid, listcount, button) {

    var url = config_apiserver + "/api/users/" + myval + "/newinsights?listcount=" + listcount;

    if (typeof queryMid !== 'undefined')
        if (queryMid > 0) {
            url = config_apiserver + "/api/users/" + myval + "/newinsights?listcount=" + listcount + "&mid=" + queryMid;
        }

    if (mid > 0)
        url = config_apiserver + "/api/users/" + myval + "/newinsights?listcount=" + listcount + "&mid=" + mid;

    getData(url);
    actData = processDataPageData(tempData);

    $('#ButtonExport1').removeAttr('download');


    var blob = new Blob([actData], {
        type: "text/csv;charset=utf-8;"
    });

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, 'Kali_Data_' + getFileDate() + '.csv')
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", 'Kali_Data_' + getFileDate() + '.csv');
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // button.children().attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(actData)).attr('download', 'Kali_Data_' + getFileDate() + '.csv');

}

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            console.log(response);
            tempData = response;
        },
        error: function () {
            console.log("error at monitor handler");
            return;
        }
    });
}

function processActivitiesData(data) {

    var row = 'id, ActivityId, TimeStamp, Value, TimeStart, TimeEnd, ActivitySummary, ActivityTypeId \n';
    for (var obj in data) {

        row += data[obj].$id + ', ';
        row += data[obj].ActivityId + ', ';
        row += data[obj].TimeStamp + ', ';
        row += data[obj].Value + ', ';
        row += data[obj].TimeStart + ', ';
        row += data[obj].TimeEnd + ', ';
        row += data[obj].ActivitySummary + ', ';
        row += data[obj].ActivityTypeId + '\n';

    }
    row = row.replace(/null/g, '');
    return row;
}

function processInsightsData(data) {
    var row = 'Time Stamp, User Id, Insight Summary, Insight Id, Rule Name, Rule Id, Activities \n';
    for (var obj in data) {
        row += data[obj].TimeStamp + ', ';
        row += data[obj].$id + ', ';
        row += data[obj].Summary + ', ';
        row += data[obj].InsightId + ', ';
        row += data[obj].RuleName + ', ';
        row += data[obj].RuleId + ', ';
        for (var i = 0; i < data[obj].Activities.length; i++) {
            row += data[obj].Activities[i].ActivitySummary.replace(',', ':');
            if (i == (data[obj].Activities.length - 1)) row += '\n';
            else row += ' - ';
        }
    }
    row = row.replace(/null/g, '');
    return row;
}

function processDevicesData(data) {
    var row = 'Hardware ID,Serial Number,Status,Model,Version,Device UserName,Type,Date Created,First Use,Last Active,CoreId \n';
    for (var obj in data) {
        row += data[obj].DeviceHardwareId + ',';
        row += data[obj].DeviceKey + ',';
        row += data[obj].MonitorStatus + ',';
        row += data[obj].DeviceModelName + ',';
        row += data[obj].version + ',';
        row += data[obj].DeviceUserName + ',';
        row += data[obj].DeviceTypeName + ',';
        row += data[obj].DateCreated + ',';
        row += data[obj].FirstUse + ',';
        row += data[obj].LastActive + ',';
        row += data[obj].CoreId + '\n';


    }
    row = row.replace(/null/g, '');
    return row;
}

function processDataPageData(data) {
    var row = 'PATIENT NUMBER,TIME (UTC),TIME (LOCAL),DATA,Confidence (%),KALI DEVICE ID \n';
    for (var obj in data) {
        row += data[obj].PatientNumber.replace(/"/g, '') + ',';
        row += data[obj].TimeStamp + ',';
        row += data[obj].LocalTime + ',';
        //        row += data[obj].DeviceUserName.indexOf("Anonymous") > -1 ? "Anonymous," : data[obj].PatientFirstName + ', ';
        //        row += data[obj].DeviceUserName.indexOCONFIDENf("Anonymous") > -1 ? "Anonymous," : data[obj].PatientLastName + ', ';
        //        row += data[obj].PatientGender + ', ';

        //        row += data[obj].PatientDOB + ', ';
        row += data[obj].Summary == null ? ',' : data[obj].Summary.replace(/"/g, '') + ',';
        row +=   Math.round(parseFloat(data[obj].Confidence)*100) + ',';
        row += data[obj].DeviceId + '\n';
    }

    row = row.replace(/null/g, '');
    return row;
}

function getFileDate() {
    var d = new Date();

    function getFullMonth(m) {
        switch (m) {
        case 0:
            return 'Jan';
        case 1:
            return 'Feb';
        case 2:
            return 'Mar';
        case 3:
            return 'Apr';
        case 4:
            return 'May';
        case 5:
            return 'Jun';
        case 6:
            return 'Jul';
        case 7:
            return 'Aug';
        case 8:
            return 'Sep';
        case 9:
            return 'Oct';
        case 10:
            return 'Nov';
        default:
            return 'Dec';
        }
    }

    function getTimeString(datorig) {
        var dat = new Date(datorig);
        //var dat = new Date(datorig.getFullYear(), datorig.getMonth(), datorig.getDate(), datorig.getHours(), datorig.getMinutes(), datorig.getSeconds(), datorig.getMilliseconds());
        if ($.browser.mozilla) {
            dat.setUTCHours(datorig.getHours(), datorig.getMinutes(), datorig.getSeconds(), datorig.getMilliseconds());
        }
        //dat.setUTCHours(datorig.getHours(), datorig.getMinutes(), datorig.getSeconds(), datorig.getMilliseconds());
        //console.log(dat.getTimezoneOffset());
        var end = 'AM';
        var hour = dat.getHours().toString();
        if (dat.getHours() > 12 && dat.getHours() < 24) {
            hour = (dat.getHours() - 12).toString();
        } else if (hour == 24) {
            hour = '00';
        }
        var min = dat.getMinutes().toString();
        if (min.length < 2) min = '0' + min;
        var sec = dat.getSeconds().toString();
        if (sec.length < 2) sec = '0' + sec;
        if (hour.length < 2) hour = '0' + hour;
        if (dat.getHours() > 11 && dat.getHours() < 24) end = 'PM';
        var ret = hour + min + sec;
        return ret;
    }
    return d.getFullYear() + '-' + getFullMonth(d.getMonth()) + '-' + d.getDate() + '-' + getTimeString(d);
}