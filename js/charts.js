var queryMid = queryString["mid"];
var queryUid = queryString["uid"];
var queryLastId = queryString["lastid"];
var chunkCount = 25;
var firstId = -1;
var leastid;
var source;
var firstCall = true;
var myInsightsArray = [];
var lastid = 0;
var listcount = 25;
var id = myval;
var mid = queryMid;
var timeDiffrence;
var prevDeviceId;
var editMonitorId = queryMid;
var freqView = -6;
var patternView = -6;

var signalrServers = ['app', 'dev', 'beta'],
    pageurl = window.location.href.substring(7, window.location.href.indexOf('.')),
    detailsPageUrl = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.lastIndexOf('.'));


ajaxSetup();


if (signalrServers.indexOf(pageurl) != -1) {
    $.connection.hub.url = config_signalR;
    var dataHub = $.connection.DataHub;
}


$(document).ready(function () {



    $('#patternChart, #barChart').ready(function () {

        var patternOptions = {
            packages: ['scatter'],
            callback: getPatternChartDetails
        };
        google.load('visualization', '1.1', patternOptions);

        var barOptions = {
            packages: ['bar'],
            callback: getFrequencyChartDetails
        };
        google.load('visualization', '1.1', barOptions);

    });


    $('.select-2').select2();
    loadPatients();
    getDetails();

    var userid = myval;
    var url = config_apiserver + 'api/users/' + userid + '/newinsights?chunkCount=' + chunkCount + '&firstId=' + firstId;


    if (typeof queryMid !== 'undefined')
        var monid = queryMid;
    else
        var monid = $('#selectUser').val();




    if (typeof queryMid !== 'undefined')
        if (queryMid > 0) {
            url = config_apiserver + "/api/users/" + myval + "/newinsights?chunkCount=" + chunkCount + '&firstId=' + firstId + "&mid=" + queryMid;
        }

    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            $("#spinner").hide();
            //console.log(data);
            getFirstId(data);
            displayNewData(data);


            signalR();
        },
        error: function () {
            $("#spinner").hide();
            // alert(url);
            $('#dataDiv').append('<br/><div class="well-lg" id="noData" style="background-color:#F0F0F0;">No data currently available for the selection.<br/></div>');
        }
    });
    //init all listeners

    initListeners();



    $('.down-num li').click(function () {
        $('#ButtonExport1').trigger('click');
        var button = $(this);
        processDataFile(mid, $(this).val(), button);;
    });

    $('#play').click(function () {
        // console.log("click Play");
        var myClasses = this.classList;
        if (myClasses[4] == 'play') {
            paused = 0;
            $(this).html('Pause <i class="fa fa-pause icon-margin"></i>');
            $(this).removeClass("play");
            $(this).addClass('pause');
            $(this).attr('data-original-title', 'Click to hold real time stream')
            addArrayItems();

        } else {
            paused = 1;
            $(this).html('Play <i class="fa fa-play icon-margin"></i>');
            $(this).removeClass("pause");
            $(this).addClass('play');
            $(this).attr('data-original-title', 'Click to resume real time stream');
            //clearInterval(timerId);

        }
    });

    $("#play").trigger("click");
    //signalR();


    $('#filterFreq').live('change', function () {
        freqView = $('#filterFreq').select2('val');
        getFrequencyChartDetails();

    });  
    
    
    $(' #filterPattern').live('change', function () {
        patternView = $('#filterPattern').select2('val');
        getPatternChartDetails();

    });


});

function initListeners() {
    $('#selectUser').change(function () {
        mid = $('#selectUser').val();
        changeData($('#selectUser').val());

    });
    $('#btnLoadMore').click(function () {
        getMoreData();
    });
}

function loadPatients() {
    //http://localhost:1119/api/users/1/patients
    var userid = $('#inputUserId').val();
    $.ajax({
        url: config_apiserver + 'api/users/' + userid + '/patients',
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
                displayPatients(data);
            }
            //failure:console.log('failed')
    });
}

function displayPatients(data) {
    console.log(data);
    $('#selectUser').empty();


    $('#selectUser').append($("<option></option>").attr("value", -1).text('All Users'));
    for (var i = 0; i < data.length; i++) {
        var patient = data[i];
        if (patient.PatientName == " ")
            var name = patient.PatientNumber + " - " + patient.Medicine;
        else
            var name = patient.PatientName + " - " + patient.Medicine;
        $('#selectUser').append($("<option></option>").attr("value", patient.RxMonitorId).text(name));
    }
    if (queryMid != null) $('#selectUser').select2('val', queryMid);
    else {
        $('#selectUser').select2('val', -1);
    }

}

function changeData(mid) {

    chunkCount = 25;
    firstId = -1;
    // console.log(mid);
    var userid = $('#inputUserId').val();
    //console.log(userid);
    var dataChangeUrl = config_apiserver + 'api/users/' + userid + '/newinsights?chunkCount=' + chunkCount + '&firstId=' + firstId;
    if (mid > 0) dataChangeUrl = config_apiserver + 'api/users/' + userid + '/newinsights?chunkCount=' + chunkCount + '&firstId=' + firstId + '&mid=' + mid;
    $.ajax({
        url: dataChangeUrl,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            //console.log(data);
            getFirstId(data);
            $('#dataDiv').empty();
            firstCall = true;
            displayNewData(data);
        }
    });
    dataHub.server.getInsights(userid, mid, lastid);
    //console.log("changed", mid);
}

function getMoreData() {
    $('#btnLoadMore').attr('disabled', true);

    chunkCount += 25;

    var userid = $('#inputUserId').val();

    if (typeof queryMid !== 'undefined')
        var monid = queryMid;
    else
        var monid = $('#selectUser').val();


    var url = config_apiserver + 'api/users/' + myval + '/newinsights?&chunkCount=' + chunkCount + '&firstId=' + firstId;
    if (monid > 0) url = config_apiserver + 'api/users/' + myval + '/newinsights?chunkCount=' + chunkCount + '&firstID=' + firstId + '&mid=' + monid;
    $.ajax({
        url: url,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            $('#btnLoadMore').attr('disabled', false);
            displayNewData(data);
        }
    });
}

function displayNewData(data) {


    var serverTimeResponse = getServerTime();
    //  console.log(serverTimeResponse, "serverTimeResponse");
    var serverDate = new Date(serverTimeResponse + " GMT");
    var clientDate = new Date();
    //console.log(req.getResponseHeader('Date'), "Header Date");
    // console.log(serverDate, "server");
    // console.log(clientDate, "client");
    timeDifference = serverDate - clientDate;

    timeDifference = timeDifference * -1;
    // console.log(timeDifference.toString(), "timeDifference");




    // console.log(data);
    if (data.length > 0) {
        var obj = data;
        for (var i = 0; i < obj.length; i++) {
            if ($('#' + obj[i].InsightId).length > 0)
                continue;

            var activity = obj[i];
            var propability = (obj[i].Confidence * 100) + ' %';
            var name = obj[i].DeviceUserName;
            if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;

            var dat = new Date(obj[i].TimeStamp + 'Z');
            var localDate = new Date(obj[i].LocalTime);
            // console.log(obj[i].TimeStamp, "timestamp");
            var insghtDate = new Date(dat.valueOf() + timeDifference);

            //console.log(dat.toString(), "insight date pre");
            // console.log(moment(insghtDate).format());

            var timeStamp = moment(insghtDate).format();

            var tooltipString = dat.toString().substring(0, dat.toString().lastIndexOf('G') - 1) + "." + dat.getMilliseconds() + ' ' + dat.toString().substring(dat.toString().indexOf('G'));


            if (name == " ") name = obj[i].PatientNumber;
            $("#dataDiv").append('<div class="row listed " id="' + obj[i].InsightId + '" ></div>');
            //$("#" + obj[i].InsightId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');
            // $("#" + obj[i].InsightId).append('<div class="col-xs-1"></div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + getTimeView(localDate) + '</div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + convertTwelveHours(localDate) + '</div>');

            $("#" + obj[i].InsightId).append('<div hidden id ="timediv' + obj[i].InsightId + '"></div>');
            $("#timediv" + obj[i].InsightId).html(dat.toString());
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden"><abbr data-original-title="' + tooltipString + '"  class="tip" data-toggle="" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
            //data-toggle = "tooltip" / for tooltip
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + obj[i].Summary + '</div>');
            $("#" + obj[i].InsightId).append('');
            $("#" + obj[i].InsightId).append('<div class="moreInfo" id="' + i + obj[i].InsightId + '" style="display: none;"></div>');
            $("#" + i + obj[i].InsightId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');


            if (i == obj.length - 1) leastid = obj[i].InsightId;
            if (lastid < obj[i].InsightId) lastid = obj[i].InsightId;
        }

        //        $("[data-toggle='tooltip']").tooltip();
        jQuery("time.timeago").timeago();
        $('#btnLoadMore').show();
        firstCall = false;
        if (data.length < 25) $('#btnLoadMore').hide();
    } else if (firstCall) {
        $('#btnLoadMore').hide();
        $('#dataDiv').append('<br/><div class="well-lg" style="background-color:#F0F0F0;" id="noData">No data currently available for the selection.<br/></div>');
    }
}

function addArrayItems() {
    //    console.log('array length: ' + myInsightsArray.length);
    //    console.log('array content: ' + myInsightsArray.toString());
    for (var j = 0; j < myInsightsArray.length; j = j + 1) {
        $('#noData').hide()
        console.log('trying to add item ' + j);
        var obj = myInsightsArray[j];
        for (var i = 0; i < obj.length; i++) {



            var activity = obj[i];
            var propability = (obj[i].Confidence * 100) + ' %';
            var name = obj[i].DeviceUserName;
            if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
            var dat = new Date(obj[i].TimeStamp + "Z")
            if (name == " ") name = obj[i].PatientNumber;

            var dat = new Date(obj[i].TimeStamp + "Z");
            var insghtDate = new Date(dat.valueOf() + timeDifference);

            console.log(dat.toString(), "insight date pre");
            console.log(moment(insghtDate).format());

            var timeStamp = moment(insghtDate).format();
            var tooltipString = dat.toString().substring(0, dat.toString().lastIndexOf('G') - 1) + "." + dat.getMilliseconds() + ' ' + dat.toString().substring(dat.toString().indexOf('G'));


            $("#dataDiv").prepend('<div class="row listed " id="' + obj[i].InsightId + '"style="display: none; " ></div>');

            $("#" + obj[i].InsightId).append('<div class="col-xs-1 " id="de"></div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2  bolden hid' + obj[i].InsightId + '" id="re"  style="opacity:0;"><abbr id="abbr' + obj[i].InsightId + '" data-original-title="' + tooltipString + '"   data-toggle="" style="position:relative; z-index: 99999 !important;" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + ' " style="opacity:0;">' + name + '</div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + ' " style="opacity:0;">' + obj[i].Summary + '</div>');
            $("#" + obj[i].InsightId).append('');
            $("#" + obj[i].InsightId).append('<div class="moreInfo" id="' + i + obj[i].InsightId + '" style="display: none;"></div>');
            $("#" + i + obj[i].InsightId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');
            console.log('added row, new id: ' + obj[i].InsightId + ', last id: ' + lastid);

            $("#" + obj[i].InsightId).slideDown(1000);
            $(".hid" + obj[i].InsightId).delay(1000).animate({
                opacity: 1
            }, 1000);
            $(".hid" + obj[i].InsightId).css("cursor", "pointer");
            $(".hid" + obj[i].InsightId).css("cursor", "hand");
            $("#" + obj[i].InsightId).animate({
                backgroundColor: '#99c9e8'
            }, 1000);
            $("#" + obj[i].InsightId).delay(1000).animate({
                backgroundColor: '#FFFFFF'
            }, 1000);


            setTimeout(
                function (obj, i) {
                    //do something special




                    var dat = new Date(obj[i].TimeStamp + "Z");

                    var insghtDate = new Date(dat.valueOf() + timeDifference);

                    console.log(dat.toString(), "insight date pre");
                    console.log(moment(insghtDate).format());

                    var timeStamp = moment(insghtDate).format();

                    $("#" + obj[i].InsightId).replaceWith('<div class="row listed " id="' + obj[i].InsightId + '" > <div class="col-xs-1"></div><div class="col-xs-2 bolden"><abbr data-original-title="' + tooltipString + '"  class="tip" data-toggle="" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div><div class="col-xs-2 bolden">' + name + '</div><div class="col-xs-2 bolden">' + obj[i].Summary + '</div></div>');
                    console.log(name);



                    $("[data-toggle='tooltip']").tooltip();
                    jQuery("time.timeago").timeago();
                }, 4000, obj, i, name, timeDifference);

            if (i == obj.length - 1) leastid = obj[i].InsightId;
            if (lastid < obj[i].InsightId) lastid = obj[i].InsightId;
        }

        jQuery("time.timeago").timeago();
        console.log('done adding row ' + i);
    }
    myInsightsArray.length = 0;
    myInsightsArray = [];
}



function signalR() {

    $("#play").trigger("click");

    console.log(dataHub);


    dataHub.client.getData = function (obj, num) {
        console.log(num);

        //$id: "200014", DeviceId: "163-117", InsightTypeId: "1", TimeStamp: "2014-12-18T21:27:56", Summary: "Took Larmabak", Confidence: "0.83", RuleName: "Kali Drop basic monitoring", RuleId: "1", DeviceUserName: "Sina Fateh"
        console.log(mid);
        if (obj[0].mid == $('#selectUser').val() || $('#selectUser').val() == -1 || queryMid == mid)
            if (detailsPageUrl == 'details') paused = 0;
        if (paused == 0) {
            $('#noData').hide();
            for (var i = 0; i < obj.length; i++) {



                var activity = obj[i];
                var propability = (obj[i].Confidence * 100) + ' %';
                var name = obj[i].DeviceUserName;
                if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
                if (name == " ") name = obj[i].PatientNumber;
                var dat = new Date(obj[i].TimeStamp + 'Z');
                var localDate = obj[i].LocalTime == null ? new Date(obj[i].TimeStamp + "Z") : new Date(obj[i].LocalTime);

                var insghtDate = new Date(dat.valueOf() + timeDifference);

                console.log(dat.toString(), "insight date pre");
                console.log(moment(insghtDate).format());

                var timeStamp = moment(insghtDate).format();

                var tooltipString = dat.toString().substring(0, dat.toString().lastIndexOf('G') - 1) + "." + dat.getMilliseconds() + ' ' + dat.toString().substring(dat.toString().indexOf('G'));

                $("#dataDiv").prepend('<div class="row listed " id="' + obj[i].InsightId + '"style="display: none; " ></div>');




                $("#dataDiv").append('<div class="row listed " id="' + obj[i].InsightId + '" ></div>');
                //$("#" + obj[i].InsightId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');
                // $("#" + obj[i].InsightId).append('<div class="col-xs-1"></div>');
                $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + '" style="opacity:0;">' + getTimeView(localDate) + '</div>');
                $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + '" style="opacity:0;">' + convertTwelveHours(localDate) + '</div>');

                $("#" + obj[i].InsightId).append('<div hidden id ="timediv' + obj[i].InsightId + '"></div>');
                $("#timediv" + obj[i].InsightId).html(dat.toString());
                $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + '" style="opacity:0;"><abbr data-original-title="' + tooltipString + '"  class="tip" data-toggle="" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
                //data-toggle = "tooltip" / for tooltip
                $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + '" style="opacity:0;">' + obj[i].Summary + '</div>');
                $("#" + obj[i].InsightId).append('');
                $("#" + obj[i].InsightId).append('<div class="moreInfo" id="' + i + obj[i].InsightId + '" style="display: none;"></div>');
                $("#" + i + obj[i].InsightId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
                $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
                $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');

                $("#" + obj[i].InsightId).slideDown(1000);
                $(".hid" + obj[i].InsightId).delay(1000).animate({
                    opacity: 1
                }, 1000);
                $(".hid" + obj[i].InsightId).css("cursor", "pointer");
                $(".hid" + obj[i].InsightId).css("cursor", "hand");
                $("#" + obj[i].InsightId).animate({
                    backgroundColor: '#99c9e8'
                }, 1000);
                $("#" + obj[i].InsightId).delay(1000).animate({
                    backgroundColor: '#FFFFFF'
                }, 1000);




                setTimeout(
                    function (obj, i) {
                        //do something special




                        var dat = localDate;

                        var tooltipString = dat.toString().substring(0, dat.toString().lastIndexOf('G') - 1) + "." + dat.getMilliseconds() + ' ' + dat.toString().substring(dat.toString().indexOf('G'));

                        var insghtDate = new Date(dat.valueOf() + timeDifference);

                        console.log(dat.toString(), "insight date pre");
                        console.log(moment(insghtDate).format());

                        var timeStamp = moment(insghtDate).format();

                        $("#" + obj[i].InsightId).replaceWith('<div class="row listed " id="' + obj[i].InsightId + '" ><div class="col-xs-2 bolden">' + getTimeView(dat) + '</div><div class="col-xs-2 bolden">' + convertTwelveHours(dat) + '</div><div class="col-xs-2 bolden"><abbr data-original-title="' + tooltipString + '"  class="tip" data-toggle="" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div><div class="col-xs-2 bolden">' + obj[i].Summary + '</div></div>');


                        //                        $("#" + obj[i].InsightId).replaceWith('<div class="row listed " id="' + obj[i].InsightId + '" > <div class="col-xs-1"></div><div class="col-xs-2 bolden"><abbr data-original-title="' + tooltipString + '"  class="tip" data-toggle="tooltip" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div><div class="col-xs-2 bolden">' + name + '</div><div class="col-xs-2 bolden">' + obj[i].Summary + '</div></div>');
                        //                        console.log(name);



                        //                        $("[data-toggle='tooltip']").tooltip();
                        jQuery("time.timeago").timeago();
                    }, 4000, obj, i, name, timeDifference);




                if (lastid < obj[i].InsightId) lastid = obj[i].InsightId;
            }

            freqView = $('#filterFreq').select2('val');
            patternView = $('#filterPattern').select2('val');
           

            getPatternChartDetails();
            getFrequencyChartDetails();

            jQuery("time.timeago").timeago();
        } else {
            console.log('data paused nothing added');
            showErrorMessage('New insights available, press Play to show them');
            myInsightsArray.push(obj);
        }
    }



    $.connection.hub.start().done(function () {
        if (!mid)
            mid = -1;

        console.log(id, mid, lastid);
        dataHub.server.getInsights(id, mid, lastid);
        console.log("connected");
    }).fail(function (error) {
        console.log('Invocation of start failed. Error: ' + error)
    });

}



function getServerTime() {
    var sTime;
    $.ajax({
        type: 'GET',
        url: config_apiserver + 'api/users/getTime',
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            console.log(data.toString(), "serverTimeReponse");
            sTime = data;
        }
    });

    return sTime;

}


function getFirstId(data) {

    for (var i = 0; i < data.length; i++) {
        if (data[i].InsightId > firstId)
            firstId = data[i].InsightId;

    }
}

function getDetails() {


    $.ajax({
        url: config_apiserver + 'api/rxmonitor/getDetails/' + myval + '/' + mid,
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (response) {

            //               if(mid==129 || mid==130 || mid==131){
            //                   $('#pEdit').css('opacity','0.5');
            //                     $('#pEdit').css('pointer-events', 'none');
            //               }
            $('#patientNameDetails').html(response.PatientFirstName + ' ' + response.PatientLastName);

            if (response.Comments == null || response.Comments == '')
                $('#medicationDetails').html('Not specified');
            else
                $('#medicationDetails').html(response.Comments);

            $('.hide-medication').show();
            $('#pEdit').attr('p-id', response.AccessPermissions);
            $('#pEdit').attr('data-id', queryMid);

            var eyeCount = ['', 'one eye', 'two eyes'];
            var dropCount = ['', 'One drop', 'Two drops', 'Three drops'];
            if (response.EyeCount == null)
                $('#dosingDetails').parent().hide()
            else
                $('#dosingDetails').html(dropCount[response.DropCount] + ', ' + eyeCount[response.EyeCount]);

            var endDate = response.EndDate == null ? 'until otherwise specified' : 'until ' + response.EndDate.substring(0, 10).replace('-/g', '/');

            var date = response.StartDate == null ? endDate.replace('u', 'U') : 'From ' + response.StartDate.substring(0, 10).replace('-/g', '/') + ' ' + endDate;

            if (response.StartDate == null && response.EndDate == null)
                date = 'Date not specified';



            if (response.Time.length == 0) {
                $('#timingDetails').html(date);

            } else if (response.Time.length == 1) {
                $('#timingDetails').html('At ' + convertTime(response.Time[0].Time) + '<br>' + date);
            } else if (response.Time.length == 2) {
                $('#timingDetails').html('At ' + convertTime(response.Time[0].Time) + ' and ' + convertTime(response.Time[1].Time) + '<br>' + date);
            } else {
                var timeStr = ', ';
                for (var t = 1; t < response.Time.length - 1; t++)
                    timeStr += convertTime(response.Time[t].Time) + ', ';

                $('#timingDetails').html('At ' + convertTime(response.Time[0].Time) + timeStr + ' and ' + convertTime(response.Time[1].Time) + '<br>' + date);
            }
        },
        error: function () {}


    });

}


function getPatternChartDetails() {

    var url = config_apiserver + "/api/users/" + myval + "/patternchartdata?mid=" + mid + '&patternFilter=' + patternView;


    $.ajax({
        url: url,
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            drawPatternChart(data);

        }
    });


}


function getFrequencyChartDetails() {

    var url = config_apiserver + "/api/users/" + myval + "/frequencychartdata?mid=" + mid + '&freqFilter=' + freqView ;


    $.ajax({
        url: url,
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            drawFrequencyCharts(data);

        }
    });


}


function drawFrequencyCharts(response) {

    

    var data2 = new google.visualization.DataTable();
    data2.addColumn('number');
    data2.addColumn('number', 'frequency');



    var barData = response[0];
    var count = response[1];
    var zeroDropCount = response[2];
    var ticksValues = [];


    var rowData2 = [];

    rowData2.push([0, 0]);
    ticksValues.push({
        v: 0,
        f: ''
    });

    var addOne = 1;
    if (zeroDropCount != 0) {
        rowData2.push([1, (zeroDropCount / count) * 100]);
        addOne = 2;

        rowData2.push([0, 0]);
        ticksValues.push({
            v: 1,
            f: '0'
        });
    }


    var itemsCount;

    for (var d in barData) {

        var relFreq = (barData[d].Frequency / count) * 100;
        rowData2.push([parseInt(d) + addOne, relFreq]);
        itemsCount = barData[d].DropsPerDay + 1;
        console.log(relFreq);

        ticksValues.push({
            v: parseInt(d) + addOne,
            f: barData[d].DropsPerDay + ''
        });

        console.log(relFreq);
    }



    console.log(ticksValues, 'ticksvlaues');

    console.log(rowData2);
    data2.addRows(rowData2);

    var view = new google.visualization.DataView(data2);


    var options2 = {
        height: 270,
        width: 320,
 
        colors: ['#3394D1'],
        backgroundColor: {
            fill: 'transparent'
        },
       legend: { position: 'none' },
//        vAxis: {
//            maxValue: 100,
//            minValue: 0,
//            ticks: [{
//                v: 0,
//                f: '0%'
//                }, {
//                v: 25,
//                f: '25%'
//                }, {
//                v: 50,
//                f: '50%'
//                }, {
//                v: 75,
//                f: '75%'
//                }, {
//                v: 100,
//                f: '100%'
//                }, ]
//        },
//        hAxis: {
//            format: '#',
//            viewWindowMode: 'explicit',
//            viewWindow: {
//                min: 0.1
//            },
//            gridlines: {
//                color: 'transparent'
//            },
//            ticks: ticksValues,
//               legend: { position: "none" }
//        },
//        
        axes: {
            y: {
                all: {
                    range: {
                        max: 100,
                        min: 0
                    },
                    ticks : [0,25,50,75,100]
                 
                }
            }
        },
    
        animation: {
            duration: 750,
            easing: 'linear',
            startup: true
        }
    };


    var chart2 = new google.charts.Bar(document.getElementById('barChart'));
    
    chart2.draw(view, options2);


    $('#barChart').prepend('<h3 style="position: absolute; left: 53px; color: rgb(127, 127, 127); top: -36px;">Frequency per day</h3>');
//    $('#barChart').prepend('<div id="barBox" style="position: absolute; background-color: rgb(248, 248, 248); width: 385px; left: -44px; bottom: 15px; border-radius: 0px; height: 297px;"></div>');

//    $("#barBox").next().attr('style','padding: 53px');
    
     //$('#barChart').find('svg').parent().parent().attr('style','left:40px;top:20px');
     $('#barChart').find('svg').parent().attr('style','position: absolute; width: 100%; height: 100%;left:40px;top:20px');
    

    
    $('#barChart').find('svg').parent().prepend('<select id="filterFreq" class="select-2" style="width: 140px; float: right; margin-top: -49px; margin-right: -57px;"><option value="0">All time</option><option value="-3">Last 3 months</option><option value="-6">Last 6 months</option><option value="-12">Last 12 months</option><option value="-24">Last 24 months</option></select>');


    $('#filterFreq').select2({
        minimumResultsForSearch: Infinity
    });

    $('#filterFreq').select2('val', freqView);

}

function drawPatternChart(response) {

   console.log(response,'drawPatternChart response');
    
    var data = new google.visualization.DataTable();
    data.addColumn('date');
    data.addColumn('timeofday');
    data.addColumn({
        'type': 'string',
        'role': 'style'
    });
    data.addColumn({
        type: 'string',
        role: 'tooltip'
    });

    var scattaredData = response[0];


    var rowData = [];

    var maxDate;

    for (var t in scattaredData) {
        //            console.log(scattaredData[t].TimeStamp, 't');
        var d = new Date(scattaredData[t].LocalTime);
        //            console.log(d, 'd');


        if (scattaredData[t].InsightTypeId == 3)
            rowData.push([new Date(d.getFullYear(), d.getMonth(), d.getDate()), [d.getHours(), d.getMinutes(), d.getSeconds()], 'point {shape-type: diamond; fill-color: #DEDEDE;', getTimeView(d) + " " + convertTwelveHours(d)]);
        else rowData.push([new Date(d.getFullYear(), d.getMonth(), d.getDate()), [d.getHours(), d.getMinutes(), d.getSeconds()], 'point {shape-type: diamond; fill-color: #3394D1', getTimeView(d) + " " + convertTwelveHours(d)]);

        maxDate = d;
    }
    data.addRows(rowData);

    var timeTicks = [];

    for (var i = 1; i < 25; i = i + 2) {
        console.log(i);
        var dateString;

        if (i > 12)
            dateString = ((i - 12) + ':00 PM');
        else dateString = (i + ':00 AM');
        console.log(dateString);
        timeTicks.push({
            v: [i, 0, 0],
            f: dateString
        });


    }

    console.log(timeTicks);

    var emptyChartTicks;

    var currentDate = new Date();

    var minDate = new Date(new Date().setDate(currentDate.getDate() + (patternView * 30)));
    if (scattaredData.length < 1) {

        emptyChartTicks = [];

        for (var i = 0; i < Math.abs(patternView); i++)

            emptyChartTicks.push({
            v: new Date(new Date().setDate(currentDate.getDate() + (i * -1 * 30))),
            f: new Date(new Date().setDate(currentDate.getDate() + (i * -1 * 30)))
        });



    } else emptyChartTicks = null;

    var options = {
        width: 600,
        height: 250,
        animation: {
            duration: 750,
            easing: 'linear',
            startup: true
        },
   /*  legend: 'none',*/

        vAxis: {
            minValue: [23, 0, 0],
            maxValue: [1, 0, 0],
            baselineColor: 'transparent',
            gridlines: {
                color: 'transparent'
            },
            direction: -1,

            ticks: timeTicks

        },
        axes: {
            y: {
                all: {
                    range: {
                        minValue: [23, 0, 0],
            maxValue: [1, 0, 0],
                    },
                    
                 
                }
            }
        },
        hAxis: {
            minValue: minDate,
            maxValue: currentDate,
            viewWindowMode: 'pretty',
            baselineColor: 'transparent',
            gridlines: {
                color: 'transparent'
            },
            format: 'MMM dd',

            maxValue: maxDate,
            ticks: emptyChartTicks

        },
        numDivLines: 0,
        yAxisMaxValue: 1,
        backgroundColor: {
            fill: 'transparent'
        },

        legend: 'none',
        pointShape: 'diamond',
        chartArea: {
            backgroundColor: '#transparent',
            //                                  backgroundColor: {
            //                                    stroke: '#4322c0',
            //                                    strokeWidth: 100
            //                                }
        }
    };



    var chart = new google.charts.Scatter(document.getElementById('patternChart'));


    chart.draw(data, google.charts.Scatter.convertOptions(options));

  

    $('#patternChart').prepend('<h3 style="position: absolute; left: 77px; color: rgb(127, 127, 127);">Daily Medication</h3>');
//    $('#patternChart').prepend('<div style="width: 612px; height: 297px; background-color: rgb(248, 248, 248); position: absolute; left: 64px; border-radius: 0px; bottom: 30px;">&nbsp;</div>');
//
//
//
    $('#patternChart').find('svg').parent().prepend('<select id="filterPattern" class="select-2" style="width: 140px; float: right; margin-right: 7px; margin-top: -48px;"><option value="0">All time</option><option value="-3">Last 3 months</option><option value="-6">Last 6 months</option><option value="-12">Last 12 months</option><option value="-24">Last 24 months</option></select>');

$('#patternChart').find('svg').parent().attr('style','position: absolute; width: 100%; height: 100%;left:46px;top:55px');
    

    $('#filterPattern').select2({
        minimumResultsForSearch: Infinity
    });

    $('#s2id_filterPattern').css('z-index', '99');

    $('#filterPattern').select2('val', patternView);
}



function convertTime(time) {

    var hours = time.substring(0, time.indexOf(':'));
    console.log(hours, 'hours');


    suffix = (hours >= 12) ? ' PM' : ' AM';

    //only -12 from hours if it is greater than 12 (if not back at mid night)
    hours = (hours > 12) ? hours - 12 : hours;

    //if 00 then it is 12 am
    hours = (hours == '00') ? 12 : hours;


    return (hours.toString().indexOf('0') == 0? hours.replace('0','') : hours) + time.substring(time.indexOf(':'), time.length - 3) + suffix;

}

function convertTwelveHours(date) {

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    minutes = minutes.toString().length < 2 ? '0' + minutes : minutes;
    //  seconds = seconds.toString().length < 2 ? '0' + seconds : seconds;
    var strTime = hours + ':' + minutes + ampm;

    return strTime;



}

function getTimeView(date) {

    var dateStr;

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    dateStr = days[date.getDay()] + ', ';
    dateStr += months[date.getMonth()] + ' ' + (date.getDate());

    return dateStr;




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