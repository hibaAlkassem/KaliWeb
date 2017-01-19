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
var offset = 0;
var patternChartAnimate = true;
var freqChartAnimate = true;
var signalrServers = ['app', 'dev', 'beta'],
    pageurl = window.location.href.substring(7, window.location.href.indexOf('.')),
    detailsPageUrl = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.lastIndexOf('.'));
var minOffest;
var patternChartSpinner = false,
    freqChartSpinner = false;
var detailsDeviceId;
var hub = null;
var timeZoneTool = [];
ajaxSetup();


var patternOptions = {
    packages: ['corechart']
};
google.load('visualization', '1.1', patternOptions);

var barOptions = {
    packages: ['bar']
};
google.load('visualization', '1.1', barOptions);


$(window).load(function () {

    $.connection.hub.url = config_signalR + 'signalr';
     var dataHub = $.connection.dataHub;

    $.ajax({
        url: config_apiserver + '/api/insights/' + myval + '/getLastId',
        type: "GET",
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {

            lastid = data;
            firstId = lastid
          
  
            

            $.ajax({
                url: config_apiserver + "/api/users/" + myval + "/insights?chunkCount=" + chunkCount + '&firstId=' + lastid + "&mid=" + queryMid,
                type: "GET",
                contentType: "application/json;charset=utf-8",
                async: true,
                success: function (data) {
                    $("#spinner").hide();
                    //console.log(data);
                    displayNewData(data);

                      signalR();
                },
                error: function () {
                    $("#spinner").hide();
                    // alert(url);
                    $('#dataDiv').append('<br/><div class="well-lg" id="noData" style="background-color:#F0F0F0;">No data currently available for the selection.<br/></div>');
                }
            });
        },
        error: function () {
            console.error('could not get lastid');
        }
    });

    function signalR() {

        $("#play").trigger("click");




        dataHub.client.getData = function (obj, num) {

            paused = 0;

            if (paused == 0) {

                for (var i = 0; i < obj.length; i++) {

                    if (queryMid != obj[i].MonitorId)
                        continue;

                    $('#noData').hide();

                    var activity = obj[i];
                    var propability = (obj[i].Confidence * 100) + ' %';
                    var name = obj[i].DeviceUserName;
                    if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
                    if (name == " ") name = obj[i].PatientNumber;
                    var dat = new Date(obj[i].TimeStamp);
                    var localDate = new Date(obj[i].LocalTime);
                    var currentDateString = new Date().toString();


                    if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                        dat = new Date(obj[i].TimeStamp);
                        localDate = new Date(obj[i].LocalTime);
                    }


                    var tooltipString = getTimeView(dat) + "   " + convertTwelveHours(dat);
                    var tooltipLocalTime = getTimeView(localDate) + "   " + convertTwelveHours(localDate);

                    console.log(dat, 'timestamp');
                    console.log(localDate, 'localdate');

                    //                localDate.setMinutes(minOffest + new Date().getMinutes());



                    if (navigator.userAgent.toLowerCase().indexOf("op") > -1 || navigator.userAgent.indexOf("Safari") > -1) {
                        localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
                    }

                    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.indexOf("Safari") > -1) {
                        dat.setMinutes(dat.getMinutes() + dat.getTimezoneOffset());
                    }

                    if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                        dat = new Date(obj[i].TimeStamp);
                        localDate = new Date(obj[i].LocalTime);
                    }

                    var insghtDate = new Date(dat.valueOf() + timeDifference);

                    //                console.log(dat.toString(), "insight date pre");
                    //                console.log(moment(insghtDate).format());

                    var timeStamp = moment(new Date(obj[i].TimeStamp + 'Z')).format();
                    //
                    //                var tooltipString = dat.toString().substring(0, dat.toString().lastIndexOf('G') - 1) + "." + dat.getMilliseconds() + ' ' + dat.toString().substring(dat.toString().indexOf('G'));

                    $("#dataDiv").prepend('<div class="row listed " id="' + obj[i].InsightId + '"style="display: none; " ></div>');




                    //                $("#dataDiv").append('<div class="row listed " id="' + obj[i].InsightId + '" ></div>');
                    //$("#" + obj[i].InsightId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');
                    // $("#" + obj[i].InsightId).append('<div class="col-xs-1"></div>');
                    $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + '" style="opacity:0;">' + getTimeView(localDate) + '</div>');
                    $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + '" style="opacity:0;">' + convertTwelveHours(localDate) + '</div>');

                    $("#" + obj[i].InsightId).append('<div hidden id ="timediv' + obj[i].InsightId + '"></div>');
                    $("#timediv" + obj[i].InsightId).html(dat.toString());
                    $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden hid' + obj[i].InsightId + '" style="opacity:0;"><abbr data-original-title=""  class="tip" data-toggle="" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
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
                            var dat = new Date(obj[i].TimeStamp);
                            var localDate = new Date(obj[i].LocalTime);
                            console.log(obj, 'objjjj');
                            if (navigator.userAgent.toLowerCase().indexOf("op") > -1 || navigator.userAgent.indexOf("Safari") > -1) {
                                localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
                            }

                            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.indexOf("Safari") > -1) {
                                dat.setMinutes(dat.getMinutes() + dat.getTimezoneOffset());
                            }

                            if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                                dat = new Date(obj[i].TimeStamp);
                                localDate = new Date(obj[i].LocalTime);
                            }

                            var timeStamp = moment(new Date(obj[i].TimeStamp + 'Z')).format();

                            var tooltipString = getTimeView(dat) + "   " + convertTwelveHours(dat);
                            var tooltipLocalTime = getTimeView(localDate) + "   " + convertTwelveHours(localDate);



                            $("#" + obj[i].InsightId).replaceWith('<div class="row listed " id="' + obj[i].InsightId + '" ><div class="col-xs-2 bolden"><abbr title="' + timezone[obj[i].TimezoneId].text + '"  class="tip"  >' + getTimeView(localDate) + '</abbr></div><div class="col-xs-2 bolden"><abbr title="' + timezone[obj[i].TimezoneId].text + '"  class="tip"  >' + convertTwelveHours(localDate) + '</abbr></div><div class="col-xs-2 bolden"><abbr title="' + tooltipString + ' (GMT)"  class="tip"  ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div><div class="col-xs-2 bolden">' + obj[i].Summary + '</div></div>');

                            $('abbr.tip').tooltipster({
                                contentAsHTML: true
                            });

                            jQuery("time.timeago").timeago();
                        }, 4000, obj, i);



                    $("#" + obj[i].InsightId).attr('style', '');

                }



                freqView = $('#filterFreq').select2('val');
                patternView = $('#filterPattern').select2('val');
                patternChartAnimate = true;
                freqChartAnimate = true;

                getPatternChartDetails();
                getFrequencyChartDetails();


                jQuery("time.timeago").timeago();
            } else {
                //            console.log('data paused nothing added');
                showErrorMessage('New insights available, press Play to show them');
                myInsightsArray.push(obj);
            }
        }



        $.connection.hub.start().done(function () {
            if (!mid)
                mid = -1;


            dataHub.server.getInsights(id, mid);
            hub = dataHub;
            console.log("connected");
        }).fail(function (error) {
            console.log('Invocation of start failed. Error: ' + error)
        });

    }
});


$(document).ready(function () {


    $('#barChart').hide();
    $('#patternChart').hide();

    $('#patternChart, #barChart').ready(function () {


        getPatternChartDetails();
        getFrequencyChartDetails();
    });

    //    
    //    google.load("visualization", "1.1", {packages: ['corechart','bar']});
    //
    //google.setOnLoadCallback(function() {
    //   getPatternChartDetails();
    //});
    //
    //google.setOnLoadCallback(function() {
    //    getFrequencyChartDetails();
    //});

    $('#ButtonExport1').blur(function () {
        $(this).removeClass('active');
    });

    $('.select-2').select2();
    //    loadPatients();
    getDetails();

    var userid = myval;
    var url = config_apiserver + 'api/users/' + userid + '/insights?chunkCount=' + chunkCount + '&firstId=' + firstId;


    if (typeof queryMid !== 'undefined')
        var monid = queryMid;
    else
        var monid = $('#selectUser').val();




    if (typeof queryMid !== 'undefined')
        if (queryMid > 0) {
            url = config_apiserver + "/api/users/" + myval + "/insights?chunkCount=" + chunkCount + '&firstId=' + firstId + "&mid=" + queryMid;
        }




    //init all listeners

    initListeners();



    $('.down-num li').click(function () {
        $('#ButtonExport1').trigger('click');
        var button = $(this);
        processDataFile(mid, $(this).val(), button);
        $('#ButtonExport1').removeClass('active');
    });


    $('#filterFreq').live('change', function () {
        freqView = $('#filterFreq').select2('val');
        getFrequencyChartDetails();

    });


    $(' #filterPattern').live('change', function () {
        patternView = $('#filterPattern').select2('val');
        getPatternChartDetails();

    });




});

//end of document.ready

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
    //    console.log(data);
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
    var dataChangeUrl = config_apiserver + 'api/users/' + userid + '/insights?chunkCount=' + chunkCount + '&firstId=' + firstId;
    if (mid > 0) dataChangeUrl = config_apiserver + 'api/users/' + userid + '/insights?chunkCount=' + chunkCount + '&firstId=' + firstId + '&mid=' + mid;
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
    dataHub.server.getInsights(userid, mid);
    //console.log("changed", mid);
}

function getMoreData() {
    $('#btnLoadMore').attr('disabled', true);

    chunkCount += 25;
    offset = chunkCount - 25;

    var userid = $('#inputUserId').val();

    if (typeof queryMid !== 'undefined')
        var monid = queryMid;
    else
        var monid = $('#selectUser').val();


    var url = config_apiserver + 'api/users/' + myval + '/insights?&chunkCount=25&offset=' + offset + '&firstID=' + firstId;
    if (monid > 0) url = config_apiserver + 'api/users/' + myval + '/insights?chunkCount=25&offset=' + offset + '&firstID=' + firstId + '&mid=' + monid;
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

            var dat = new Date(obj[i].TimeStamp);
            var localDate = new Date(obj[i].LocalTime);


            var timeStart = new Date(obj[i].TimeStamp).getTime();
            var timeEnd = new Date(obj[i].LocalTime).getTime();
            var hourDiff = timeEnd - timeStart; //in ms
            var positive = false;

            if (hourDiff > 0) {
                positive = true;
            }

            if (positive) {
                var hDiff = "+" + parseInt(hourDiff / 3600 / 1000); //in hours
            } else {
                var hDiff = parseInt(hourDiff / 3600 / 1000); //in hours
            }
            

            console.log("Hourssss ", hDiff);

            var insghtDate = new Date(dat.valueOf() + timeDifference);

            if (navigator.userAgent.toLowerCase().indexOf("op") > -1 || navigator.userAgent.indexOf("Safari") > -1) {
                localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
            }

            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.indexOf("Safari") > -1) {
                dat.setMinutes(dat.getMinutes() + dat.getTimezoneOffset());
            }

            if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                dat = new Date(obj[i].TimeStamp);
                localDate = new Date(obj[i].LocalTime);
            }


            //console.log(dat.toString(), "insight date pre");
            // console.log(moment(insghtDate).format());

            var timeStamp = moment(new Date(obj[i].TimeStamp + 'Z')).format();

            var tooltipString = getTimeView(dat) + "   " + convertTwelveHours(dat);
            var tooltipLocalTime = getTimeView(localDate) + "   " + convertTwelveHours(localDate);

            var currentDateString = new Date().toString();


            if (name == " ") name = obj[i].PatientNumber;
            $("#dataDiv").append('<div class="row listed " id="' + obj[i].InsightId + '" ></div>');
            //$("#" + obj[i].InsightId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');
            // $("#" + obj[i].InsightId).append('<div class="col-xs-1"></div>');


            
            var timeZoneWithOffset = "(UTC "+ hDiff + " ) " + obj[i].TimezoneId;

            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden"><abbr title="' + timeZoneWithOffset + '"  class="tip"  >' + getTimeView(localDate) + '</abbr></div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden"><abbr title="' + timeZoneWithOffset + '"  class="tip"  >' + convertTwelveHours(localDate) + '</abbr></div>');
            



           
            $("#" + obj[i].InsightId).append('<div hidden id ="timediv' + obj[i].InsightId + '"></div>');
            $("#timediv" + obj[i].InsightId).html(dat.toString());
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden"><abbr title="' + tooltipString + ' (GMT)"  class="tip"  ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
            //data-toggle = "tooltip" / for tooltip
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + obj[i].Summary + '</div>');
            $("#" + obj[i].InsightId).append('');
            $("#" + obj[i].InsightId).append('<div class="moreInfo" id="' + i + obj[i].InsightId + '" style="display: none;"></div>');
            $("#" + i + obj[i].InsightId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');


            if (i == obj.length - 1) leastid = obj[i].InsightId;
        }


        $('abbr.tip').tooltipster({
            contentAsHTML: true
        });


        //        $("[data-toggle='tooltip']").tooltip();
        jQuery("time.timeago").timeago();
        $('#btnLoadMore').show();
        firstCall = false;
        if (data.length < 25) $('#btnLoadMore').hide();
    } else if (firstCall) {
        $('#btnLoadMore').hide();
        $('#dataDiv').append('<br/><div class="well-lg" style="background-color:#F0F0F0;" id="noData">No data currently available for the selection.<br/></div>');
    } else if (data.length < 25) $('#btnLoadMore').hide();
}

function getServerTime() {
    var sTime;
    $.ajax({
        type: 'GET',
        url: config_apiserver + 'api/users/getTime',
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {
            //            console.log(data.toString(), "serverTimeReponse");
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



            detailsDeviceId = response.DeviceId;

            minOffest = response.MinOffset;

            if (response.PatientFirstName != null && response.PatientLastName != null)
                $('#patientNameDetails').html(response.PatientFirstName + ' ' + response.PatientLastName);
            else if (response.PatientFirstName == null || response.PatientLastName == null)
                $('#patientNameDetails').html(response.PatientFirstName == null ? response.PatientLastName : (response.PatientLastName == null ? '' : ' ' + response.PatientLastName));


            $('#patientNumberDetails').html(response.PatientIdentifier);



            if (response.Comments == null || response.Comments == '')
                $('#medicationDetails').html('Not specified');
            else
                $('#medicationDetails').html(response.Comments);

            $('.hide-medication').show();
            $('#pEdit').attr('p-id', response.AccessPermissions);
            $('#pEdit').attr('data-id', queryMid);
            $('#pEdit').attr('participant', response.Participant);


            var eyeCount = ['', 'one eye', 'two eyes'];
            var dropCount = ['', 'One drop', 'Two drops', 'Three drops'];
            if (response.EyeCount == null)
                $('#dosingDetails').parent().hide()
            else
                $('#dosingDetails').html(dropCount[response.DropCount] + ', ' + eyeCount[response.EyeCount]);

            var endDate = response.EndDate == null ? 'until otherwise specified' : 'until ' + getDateView(new Date(response.EndDate));

            var date = response.StartDate == null ? endDate.replace('u', 'U') : 'From ' + getDateView(new Date(response.StartDate)) + ' ' + endDate;

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

                $('#timingDetails').html('At ' + convertTime(response.Time[0].Time) + timeStr + ' and ' + convertTime(response.Time[response.Time.length - 1].Time) + '<br>' + date);
            }


        },
        error: function () {
            window.location = config_app + 'patients';
        }


    });

}

function getPatternChartDetails() {



    var url = config_apiserver + "/api/users/" + myval + "/patternchartdata?mid=" + mid + '&patternFilter=' + patternView;


    $.ajax({
        url: url,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            console.log("Chart Data");
            console.log(data.toString());
            drawPatternChart(data);


        }
    });


}

function getFrequencyChartDetails() {

    console.log('getFrequencyChartDetails()');

    var url = config_apiserver + "/api/users/" + myval + "/frequencychartdata?mid=" + mid + '&freqFilter=' + freqView;
    console.log(url, 'getFrequencyChartDetails URL');

    $.ajax({
        url: url,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {
            console.log(data, 'getFrequencyChartDetails data');
            drawFrequencyCharts(data);

        }
    });


}

function drawFrequencyCharts(response) {



    var data2 = new google.visualization.DataTable();
    data2.addColumn('number', 'Value');
    data2.addColumn('number', 'Value');
    data2.addColumn({
        'type': 'string',
        'role': 'tooltip'
    });




    var barData = response[0];
    var count = response[1];

    var ticksValues = [];


    var rowData2 = [];

    rowData2.push([0, 0, '']);
    ticksValues.push({
        v: 0,
        f: ''
    });

    var addOne = 1;



    var itemsCount;
    var ctr = 0;

    for (var d in barData) {


        if (isNaN(Object.keys(barData)[ctr]))
            continue;

        var relFreq = (barData[d] / count) * 100;

        //        rowData2.push([ctr + addOne, relFreq, '<div style="padding:7px;">' + ctr.toString() + ' drop(s) per day <br> <b>' + (relFreq.toString().length > 5 ? relFreq.toString().substring(0,5) : relFreq) + '% of the time</b>' + '</div>' ]);  

        rowData2.push([ctr + addOne, relFreq, Object.keys(barData)[ctr].toString() + ' drop(s) per day \n' + (relFreq.toString().length > 5 ? relFreq.toString().substring(0, 5) : relFreq) + '% of the time']);
        itemsCount = Object.keys(barData)[ctr] + 1;
        //        console.log(relFreq);

        ticksValues.push({
            v: ctr + addOne,
            f: Object.keys(barData)[ctr] + ''
        });

        ctr++;
    }

    data2.addRows(rowData2);

    var view = new google.visualization.DataView(data2);


    var chart2 = new google.visualization.ComboChart(document.getElementById('barChart'));

    var options2 = {
        height: 300,
        width: 500,
        series: {
            0: {
                type: 'bars'
            },
            1: {
                type: 'line',
                color: 'grey',
                lineWidth: 0,
                pointSize: 0,
                visibleInLegend: false
            }
        },
        colors: ['#3394D1'],
        backgroundColor: {
            fill: 'transparent'
        },
        legend: 'none',
        vAxis: {
            maxValue: 100,
            minValue: 0,
            ticks: [{
                v: 0,
                f: '0%'
            }, {
                v: 25,
                f: '25%'
            }, {
                v: 50,
                f: '50%'
            }, {
                v: 75,
                f: '75%'
            }, {
                v: 100,
                f: '100%'
            }, ]
        },
        hAxis: {
            format: '#',
            viewWindowMode: 'explicit',
            viewWindow: {
                min: 0.1
            },
            title: 'Drops per day',
            gridlines: {
                color: 'transparent'
            },
            ticks: ticksValues
        }
    };


    chart2.draw(view, options2);


    $('#barChart').prepend('<h3 style="position: absolute; left: 53px; color: rgb(127, 127, 127); top: -36px;">Frequency per day</h3><div style="position: absolute; background-color: rgb(248, 248, 248); width: 385px; left: 54px; bottom: -14px; border-radius: 0px; height: 297px;"></div>');

    $('#barChart').find('div[dir="ltr"]').prepend('<select id="filterFreq" class="select-2" style="width: 140px; float: right; margin-top: -29px; margin-right: 76px;"><option value="0">All time</option><option value="-3">Last 3 months</option><option value="-6">Last 6 months</option><option value="-12">Last 12 months</option><option value="-24">Last 24 months</option></select>');


    $('#filterFreq').select2({
        minimumResultsForSearch: Infinity
    });

    $('#filterFreq').select2('val', freqView);

    freqChartSpinner = true;

    if (patternChartSpinner) {
        $('#chartsSpinner').hide();
        $('#barChart').show();
        $('#patternChart').show();
    };
}

function drawPatternChart(response) {


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

    var priorityInsights = [];

    for (var t in scattaredData) {

        var d = new Date(scattaredData[t].LocalTime);

        if (navigator.userAgent.indexOf('Edge') > -1) {
            d = new Date(scattaredData[t].LocalTime);
        } else if (navigator.userAgent.toLowerCase().indexOf("op") > -1 || navigator.userAgent.indexOf("Safari") > -1) {
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
        }

        if (scattaredData[t].InsightTypeId == 3)
            rowData.push([new Date(d.getFullYear(), d.getMonth(), d.getDate()), [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()], 'point {shape-type: diamond; fill-color: #DEDEDE;', getTimeView(d) + " " + convertTwelveHours(d)]);

        else if (scattaredData[t].InsightTypeId == 1)
            priorityInsights.push({
                date: d,
                type: 1
            });

        else if (scattaredData[t].InsightTypeId == 7)
            priorityInsights.push({
                date: d,
                type: 7
            });

        maxDate = d;
    }
    data.addRows(rowData);

    rowData = [];


    for (var t in priorityInsights) {

        var d = priorityInsights[t].date;
        var type = priorityInsights[t].type;


        if (type == 7)
            rowData.push([new Date(d.getFullYear(), d.getMonth(), d.getDate()), [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()], 'point {shape-type: diamond; fill-color: #ff80a3', getTimeView(d) + " " + convertTwelveHours(d)]);


    }
    for (var t in priorityInsights) {

        var d = priorityInsights[t].date;
        var type = priorityInsights[t].type;


        if (type == 1)
            rowData.push([new Date(d.getFullYear(), d.getMonth(), d.getDate()), [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()], 'point {shape-type: diamond; fill-color:#3394D1', getTimeView(d) + " " + convertTwelveHours(d)]);


    }

    data.addRows(rowData);


    var timeTicks = [];

    for (var i = 1; i < 25; i = i + 2) {
        //        console.log(i);
        var dateString;

        if (i > 12)
            dateString = ((i - 12) + ':00 PM');
        else dateString = (i + ':00 AM');
        //        console.log(dateString);
        timeTicks.push({
            v: [i, 0, 0],
            f: dateString
        });


    }

    //    console.log(timeTicks);

    var emptyChartTicks;

    var currentDate = new Date();

    var minDate = new Date(new Date().setDate(currentDate.getDate() + (patternView * 30)));
    if (patternView != 0) {

        emptyChartTicks = [];

        for (var i = 1; i < Math.abs(patternView - 1) ; i++)

            emptyChartTicks.push({
                v: new Date(new Date().setDate(currentDate.getDate() + (i * -1 * 30))),
                f: new Date(new Date().setDate(currentDate.getDate() + (i * -1 * 30)))
            });


        emptyChartTicks.push({
            v: new Date(new Date().setDate(currentDate.getDate())),
            f: new Date(new Date().setDate(currentDate.getDate()))
        });


    } else emptyChartTicks = null;

    var options = {
        width: 700,
        height: 380,
        animation: {
            duration: 750,
            easing: 'linear',
            startup: true
        },

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
        hAxis: {
            minValue: minDate,
            maxValue: currentDate,
            viewWindowMode: 'pretty',
            baselineColor: 'transparent',
            gridlines: {
                color: 'transparent'
            },
            format: 'MMM dd',
            slantedText: true,
            slantedTextAngle: 30,
            maxValue: maxDate,
            ticks: emptyChartTicks,
        },

        numDivLines: 0,
        yAxisMaxValue: 1,
        backgroundColor: {
            fill: 'transparent'
        },

        legend: 'none',
        pointShape: 'diamond',
        chartArea: {
            backgroundColor: '#transparent'
        }
    };



    var chart = new google.visualization.ScatterChart(document.getElementById('patternChart'));


    chart.draw(data, options);



    $('#patternChart').prepend('<h3 style="position: absolute; left: 60px; color: rgb(127, 127, 127);">Daily Medication</h3>');
    $('#patternChart').prepend('<div style="width: 582px; height: 297px; background-color: rgb(248, 248, 248); position: absolute; left: 60px; border-radius: 0px; bottom: 30px;">&nbsp;</div>');



    $('#patternChart').find('div[dir="ltr"]').prepend('<select id="filterPattern" class="select-2" style="width: 140px; float: right; margin-right: 73px; margin-top: 7px;"><option value="0">All time</option><option value="-3">Last 3 months</option><option value="-6">Last 6 months</option><option value="-12">Last 12 months</option><option value="-24">Last 24 months</option></select>');



    $('#filterPattern').select2({
        minimumResultsForSearch: Infinity
    });

    $('#s2id_filterPattern').css('z-index', '99');

    $('#filterPattern').select2('val', patternView);

    patternChartSpinner = true;

    if (freqChartSpinner) {
        $('#chartsSpinner').hide();
        $('#barChart').show();
        $('#patternChart').show();
    }
}

function convertTime(time) {

    var hours = time.substring(0, time.indexOf(':'));
    //    console.log(hours, 'hours');


    suffix = (hours >= 12) ? ' PM' : ' AM';

    //only -12 from hours if it is greater than 12 (if not back at mid night)
    hours = (hours > 12) ? hours - 12 : hours;

    //if 00 then it is 12 am
    hours = (hours == '00') ? 12 : hours;



    return (hours.toString().indexOf('0') == 0 ? hours.replace('0', '') : hours) + time.substring(time.indexOf(':'), time.length - 3) + suffix;

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

function getDateView(date) {

    var dateStr;

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    dateStr = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    //    dateStr += months[date.getMonth()] + ' ' + (date.getDate());

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



