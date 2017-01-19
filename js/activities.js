var queryMid = queryString["mid"];
var queryUid = queryString["uid"];
var queryLastId = queryString["lastid"];

//console.log(queryMid);
var leastid;
var chunkCount = 25;
var firstId = -1;
var source;
var firstCall = true;
var myActivityArray = [];
var lastid = 0;
var deviceLastId = -1;
var listcount = 25;
var id = myval;
var mid;
var timeDiffrence;
var paused = 0;
var hub = null;
var activityData = [];
var selectedData = [];
var dataActivity = [];



ajaxSetup();


$(window).load(function () {

  
   $.connection.hub.url = config_signalR + 'signalr';
   var actHub = $.connection.activitiesHub;

    var userid = myval;

    
  
   signalR();


    getActivities();

    $('#selectDevice').change(function () {
       
        mid = $('#selectDevice').val();
        changeData($('#selectDevice').val());

    });
    $('#selectActivity').multiselect({
        close: function (event, ui) {
            loadDataActivity();
            //Check if the selection is changed
            if (selectedData.toString() == dataActivity.toString()) {
                
            } else {

                selectedData = dataActivity;
                changeActivity(dataActivity);
            }
        },
    });



    function changeActivity(values) {
       

        $('#btnLoadMore').attr('disabled', true);
        
        console.log(values);
        $('#dataDiv').empty();
        $("#spinner").show();
       

        var deviceId = $('#selectDevice').val();
        firstId = -1;
        var url = config_apiserver + 'api/activities/' + myval + '/GetDeviceActivities?deviceId=' + deviceId + '&chunkCount=25' + '&firstId=' + firstId;
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(values),
            contentType: "application/json;charset=utf-8",
            success: function (response) {
               

                $('#btnLoadMore').attr('disabled', false);
                $("#spinner").hide();

                if (firstCall)
                    getFirstId(response);
                displayNewData(response, false);

                loadDataActivity();
                

              //  actHub.server.changeDeviceId(deviceId, dataActivity);     

            },
            error: function (data) {
                
                $('#btnLoadMore').attr('disabled', false);
                $("#spinner").hide();

                $('#dataDiv').append('<br/><div class="well-lg" id="noData" style="background-color:#F0F0F0;">No Activities Found!<br/></div>');
            }

        });


    }
    function changeData(mid) {

        $('#btnLoadMore').attr('disabled', true);
        $('#dataDiv').empty();
        $("#spinner").show();
        chunkCount = 25;
        firstId = -1;
        var deviceId = $('#selectDevice').val();
        

        loadDataActivity();

       // actHub.server.changeDeviceId(deviceId, dataActivity);


        var url = config_apiserver + 'api/activities/' + myval + '/GetDeviceActivities?deviceId=' + deviceId + '&chunkCount=' + chunkCount + '&firstId=' + firstId;
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(selectedData),
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                $("#spinner").hide();
                $('#btnLoadMore').attr('disabled', false);
                if (firstCall)
                    getFirstId(response);
                displayNewData(response, false);

            },
            error: function (data) {
                $("#spinner").hide();
                $('#btnLoadMore').attr('disabled', false);

                $('#dataDiv').append('<br/><div class="well-lg" id="noData" style="background-color:#F0F0F0;">No Activities Found!<br/></div>');
            }
        });








       // actHub.server.getInsights(userid, mid, lastid);
        //console.log("changed", mid);
    }

    
    function signalR() {

        //$("#play").trigger("click");

        console.log("SignalR Method Called!!!")
        console.log(actHub);

        actHub.client.getData = function (activities) {
            console.log(activities);
            console.log("Get Data");

            // filtering activities
            
            


            if (paused == 0) {
                // console.log('data not paused, data will be added');
                //            var obj = jQuery.parseJSON(e.data);
                displaySignalRActivities(activities, false);
                //jQuery("abbr.timeago").timeago();
            } else {

                showErrorMessage('New activities available, press Play to show them');
                myActivityArray.push(activities);
            }

        };


        $.connection.hub.start().done(function () {
            loadDataActivity();
            console.log(lastid);
            actHub.server.getActivities('-1', dataActivity);
            hub = actHub;
            console.log("connected");
        }).fail(function (error) {
            console.log('Invocation of start failed. Error: ' + error)
        });

    }


});


$(document).ready(function () {
    //    $("div.insight_toolbar").html('<a visible="true" id="ButtonExport1" class="btn btn-white download_margin datatable_buttons">Download <i class="fa fa-cloud-download icon-margin"></i></a>' + '<a class="btn btn-white tip datatable_buttons play" data-toggle="tooltip" title="" data-original-title="Click to resume real time stream" id="play" name="Play"  href="#"> Play <i class="fa fa-play icon-margin"></i></a>');

    $("div.insight_toolbar").html('<a class="btn btn-white b-tip datatable_buttons pause" data-toggle="tooltip" title="" data-original-title="Click to resume real time stream" id="play" name="Play"  href="#"> Pause <i class="fa fa-pause icon-margin"></i></a>');

    $("[data-toggle='tooltip']").tooltip();
    $('.select-2').select2();
    //getServerTime();

    displayDevices();


    var userid = myval;


    //init all listeners

    initListeners();

    $("#dataDiv .row").live('click', function () {
        var clicked = ($(this).find("i").hasClass('fa fa-plus-circle'));
        if (clicked) {
            $(this).find("i").removeClass('fa fa-plus-circle').addClass('fa fa-minus-circle');
            $('#moreInfo' + $(this).attr('id')).fadeIn();
        } else {

            $(this).find("i").removeClass('fa fa-minus-circle').addClass('fa fa-plus-circle');
            $('#moreInfo' + $(this).attr('id')).fadeOut('fast');

        }
    });
    $('#ButtonExport1').click(function () {
        processActivitiesFile();
    });
    $('#play').live('click', function () {
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

    //signalR();
});

function initListeners() {

    $('#btnLoadMore').click(function () {
        getMoreData();
    });
}

function getActivities() {


    var url = config_apiserver + 'api/activities/' + myval + '/GetDeviceActivities?deviceId=-1&chunkCount=' + chunkCount + '&firstId=' + firstId;
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(activityData),
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            $("#spinner").hide();

            if (firstCall)
                getFirstId(response);
            displayNewData(response, false);

        },
        error: function (data) {
            $("#spinner").hide();

            $('#dataDiv').append('<br/><div class="well-lg" id="noData" style="background-color:#F0F0F0;">No Activities Found!<br/></div>');
        }
    });

}


function displayDevices() {
    $.ajax({
        url: config_apiserver + 'api/activities/' + myval + '/deviceHasActivities',
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {


            for (var i = 0; i < data.length; i++) {
                var deviceId = data[i].DeviceId;
                $('#selectDevice').append($("<option></option>").attr("value", deviceId).text('/devices/' + data[i].DeviceHardwareId));
            }
            $('#selectDevice').select2('val', -1);
        }

    });

}

function getMoreData() {
    $('#btnLoadMore').attr('disabled', true);

    chunkCount += 25;

    var deviceId = $('#selectDevice').val();


    loadDataActivity();

    var url = config_apiserver + 'api/activities/' + myval + '/GetDeviceActivities?deviceId=' + deviceId + '&chunkCount=' + chunkCount + '&firstId=' + firstId;
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(dataActivity),
        contentType: "application/json;charset=utf-8",
        success: function (response) {
           
            $('#btnLoadMore').attr('disabled', false);
            displayNewData(response, false);
        }
    });
}

function displayNewData(data, signal) {
    console.log(data);


    if (data.length > 0) {
        var obj = data;
        for (var i = 0; i < obj.length; i++) {
            if ($('#' + obj[i].ActivityId).length > 0 || (obj[i].DeviceHardwareId != $('#selectDevice').val() && $('#selectDevice').val() != -1 && (obj[i].VirtualDevice != 'false' && $('#selectDevice').val() == 'physical')))
                continue;

            var activity = obj[i];
            var propability = (obj[i].Confidence * 100) + ' %';
            var name = obj[i].DeviceUserName;
            if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;

            var dat = new Date(obj[i].TimeStamp + "Z");
            var timeStart = new Date(obj[i].TimeStart + "Z");
            var timeEnd = new Date(obj[i].TimeEnd + "Z");
            var currentDateString = new Date().toString();

            //            var insghtDate = new Date(dat.valueOf() + timeDifference);

            var timeStamp = moment(dat).format();

            var tooltipUTCDate = dat;

            //            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.indexOf("Safari") > -1 || navigator.userAgent.indexOf("op") > -1) {
            tooltipUTCDate.setMinutes(tooltipUTCDate.getMinutes() + tooltipUTCDate.getTimezoneOffset());
            //            }

            if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                tooltipUTCDate = dat;
            }


            //            var tooltipString = tooltipUTCDate.toString().substring(0, tooltipUTCDate.toString().lastIndexOf('G') - 1) + "." + tooltipUTCDate.getMilliseconds() + '<br>' + tooltipUTCDate.toString().substring(tooltipUTCDate.toString().indexOf('G'));

            var tooltipString = getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate) + ' (GMT)';

            console.log(signal);
            if (name == " ") name = obj[i].PatientNumber;
            if (signal) {
                $("#dataDiv").prepend('<div class="row listed" id="moreInfo' + obj[i].ActivityId + '" style="display:none;line-height:30px"></div>');
                $("#dataDiv").prepend('<div class="row listed " id="' + obj[i].ActivityId + '" ></div>');
            } else $("#dataDiv").append('<div class="row listed " id="' + obj[i].ActivityId + '" ></div>');
            $("#" + obj[i].ActivityId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');
            // $("#" + obj[i].ActivityId).append('<div class="col-xs-1"></div>');
            $("#" + obj[i].ActivityId).append('<div hidden id ="timediv' + obj[i].ActivityId + '"></div>');
            $("#timediv" + obj[i].ActivityId).html(dat.toString());
            $("#" + obj[i].ActivityId).append('<div class="col-xs-2 bolden"><abbr title="' + tooltipString + '"  class="tip" data-toggle="tooltip" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
            $("#" + obj[i].ActivityId).append('<div class="col-xs-2 bolden">/devices/' + obj[i].DeviceHardwareId + '</div>');
            $("#" + obj[i].ActivityId).append('<div class="col-xs-4 bolden">' + obj[i].ActivitySummary + '</div>');
            $("#" + obj[i].ActivityId).append('');

            if (signal)
                var donoting = 1;
            else
                $("#dataDiv").append('<div class="row listed" id="moreInfo' + obj[i].ActivityId + '" style="display:none;line-height:30px"></div>');

            $("#moreInfo" + obj[i].ActivityId).append('  <div class="col-xs-1"></div>' + '  <div class="col-xs-8 "><b>ID: </b>/activity/' + obj[i].ActivityId + '</div>' + '<br>' + '  <div class="col-xs-1"></div>' +
                '  <div class="col-xs-8 "><b>Reckon: </b>/reckons/000001</div>' + '<br>' + '  <div class="col-xs-1"></div>' +
                '  <div class="col-xs-11 "><b>Time.created: </b>' + getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate, true) + ' (GMT)' + '</div>' + '<br>' + ' <div class="col-xs-1"></div>' +
                '  <div class="col-xs-11 "><b>Local Timezone: </b>' + currentDateString.substring(currentDateString.indexOf('GMT'), currentDateString.length) + '</div>' + '<br>' + ' <div class="col-xs-1"></div>' +
                '  <div class="col-xs-4 "><b>Data:</b></div>' + '  <br>   ' + ' ' + '    <div class="col-xs-2"></div>' +
                '  <div class="col-xs-8 "><b>ID: </b>/data/' + obj[i].LoggedImportedDataId + '</div>' + '   ' + '  <br>  ' + '  <div class="col-xs-2"></div>' +
                '  <div class="col-xs-8 "><b>Source: </b>/devices/' + obj[i].DeviceHardwareId + '/sensors/' + obj[i].SensorId + '</div>' + '' + '  <br> ' + '  <div class="col-xs-2"></div>' +
                '  <span ' + (obj[i].Value == null ? 'style="display: none"' : '') + '><div class="col-xs-8 "><b>Data: </b>' + obj[i].Value + '<br></div>' + ' <br> <div class="col-xs-2"></div> </span> ' +
                '  <div class="col-xs-8 "><b>Activity: </b>' + obj[i].ActivitySummary + '<br></div>');

            //$("#" + i + obj[i].ActivityId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
            //$("#" + i + obj[i].ActivityId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
            //$("#" + i + obj[i].ActivityId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');


            if (i == obj.length - 1 && !signal) leastid = obj[i].ActivityId;
            if (lastid < obj[i].ActivityId && !signal) lastid = obj[i].ActivityId;
        }

        $('.tip').tooltipster({
            contentAsHTML: true
        });


        //        $("[data-toggle=tooltip]").hover(function () {
        //            $('.tooltip.top').css('top', -70);
        //           console.log( $('.tooltip.top').css('top'));
        //        });
        jQuery("time.timeago").timeago();
        $('#btnLoadMore').show();
        firstCall = false;
        if (data.length < 25 && !signal) $('#btnLoadMore').hide();
    } else if (firstCall) {
        $('#btnLoadMore').hide();
        $('#dataDiv').append('<br/><div class="well-lg" style="background-color:#F0F0F0;" id="noData">No data currently available for the selection.<br/></div>');
    }
}

function addArrayItems() {
    console.log('array length: ' + myActivityArray.length);
    console.log('array content: ' + myActivityArray.toString());
    //         displayNewData(myActivityArray,true);

    displaySignalRActivities(myActivityArray, true);

    myActivityArray.length = 0;
    myActivityArray = [];

}


function displaySignalRActivities(activities, fromArray) {

    if (!fromArray)
        activities = [activities];

    for (var j = 0; j < activities.length; j = j + 1) {

        var obj = activities[j];


        if ((obj[j].DeviceHardwareId != $('#selectDevice').val() && $('#selectDevice').val() != -1 && $('#selectDevice').val() != 'physical') || (obj[j].VirtualDevice == 'true' && $('#selectDevice').val() == 'physical'))
            continue;

        var check = false;



        $('#noData').hide()

        for (var i = 0; i < obj.length; i++) {

            loadDataActivity();

            console.log(dataActivity);

            if (dataActivity.length == 0) {

                var activity = obj[i];
                var propability = (obj[i].Confidence * 100) + ' %';
                var name = obj[i].DeviceUserName;
                if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
                var dat = new Date(obj[i].TimeStamp + "Z");
                if (name == " ") name = obj[i].PatientNumber;

                var dat = new Date(obj[i].TimeStamp + "Z");
                //            var insghtDate = new Date(dat.valueOf() + timeDifference);


                var tooltipUTCDate = new Date(obj[i].TimeStamp);

                //            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.indexOf("Safari") > -1 || navigator.userAgent.indexOf("op") > -1) {
                tooltipUTCDate.setMinutes(tooltipUTCDate.getMinutes() + tooltipUTCDate.getTimezoneOffset());
                //            }

                if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                    tooltipUTCDate = dat;
                }





                var timeStamp = moment(dat).format();
                //var tooltipString = tooltipUTCDate.toString().substring(0, tooltipUTCDate.toString().lastIndexOf('G') - 1) + "." + tooltipUTCDate.getMilliseconds() + '<br>' + tooltipUTCDate.toString().substring(tooltipUTCDate.toString().indexOf('G'));

                var tooltipString = getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate) + ' (GMT)';

                $("#dataDiv").prepend('<div class="row listed" id="moreInfo' + obj[i].ActivityId + '" style="display:none;line-height:30px"></div>');
                $("#dataDiv").prepend('<div class="row listed " id="' + obj[i].ActivityId + '"style="display: none; " ></div>');


                $("#" + obj[i].ActivityId).append('<div class="col-xs-1 " id="de"></div>');
                //            $("#" + obj[i].ActivityId).append('<div class="col-xs-1 hid"><i class="fa fa-plus-circle hid"></i></div>');
                $("#" + obj[i].ActivityId).append('<div class="col-xs-2  bolden hid' + obj[i].ActivityId + '" id="re"  style="opacity:0;"><abbr class="tip" id="abbr' + obj[i].ActivityId + '"   style="position:relative; z-index: 99999 !important;" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
                $("#" + obj[i].ActivityId).append('<div class="col-xs-2 bolden hid' + obj[i].ActivityId + ' " style="opacity:0;">/devices/' + obj[i].DeviceHardwareId + '</div>');
                $("#" + obj[i].ActivityId).append('<div class="col-xs-4 bolden hid' + obj[i].ActivityId + ' " style="opacity:0;">' + obj[i].ActivitySummary + '</div>');
                $("#" + obj[i].ActivityId).append('');
                $("#" + obj[i].ActivityId).append('<div class="moreInfo" id="' + i + obj[i].ActivityId + '" style="display: none;"></div>');
                $("#" + i + obj[i].ActivityId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
                $("#" + i + obj[i].ActivityId).append('<div class="col-xs-2">' + getFullMonth(tooltipUTCDate.getMonth()) + ' ' + tooltipUTCDate.getDate() + ', ' + tooltipUTCDate.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(tooltipUTCDate) + '</div> ');
                $("#" + i + obj[i].ActivityId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');
                //            console.log('added row, new id: ' + obj[i].ActivityId + ', last id: ' + lastid);

                $("#" + obj[i].ActivityId).slideDown(1000);
                $(".hid" + obj[i].ActivityId).delay(1000).animate({
                    opacity: 1
                }, 1000);
                $(".hid" + obj[i].ActivityId).css("cursor", "pointer");
                $(".hid" + obj[i].ActivityId).css("cursor", "hand");
                $("#" + obj[i].ActivityId).animate({
                    backgroundColor: '#99c9e8'
                }, 1000);
                $("#" + obj[i].ActivityId).delay(1000).animate({
                    backgroundColor: '#FFFFFF'
                }, 1000);

                $('.tip').tooltipster({
                    contentAsHTML: true
                });


                setTimeout(
                    function (obj, i) {

                        var dat = new Date(obj[i].TimeStamp + "Z");

                        var timeStamp = moment(dat).format();

                        var tooltipUTCDate = dat;

                        var currentDateString = new Date().toString();


                        tooltipUTCDate.setMinutes(tooltipUTCDate.getMinutes() + tooltipUTCDate.getTimezoneOffset());


                        if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                            tooltipUTCDate = dat;
                        }


                        //                    var tooltipString = tooltipUTCDate.toString().substring(0, tooltipUTCDate.toString().lastIndexOf('G') - 1) + "." + tooltipUTCDate.getMilliseconds() + '<br>' + tooltipUTCDate.toString().substring(tooltipUTCDate.toString().indexOf('G'));

                        var tooltipString = getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate) + ' (GMT)';

                        $("#" + obj[i].ActivityId).replaceWith('<div class="row listed " id="' + obj[i].ActivityId + '" > <div class="col-xs-1"><i class="fa fa-plus-circle"></i></div><div class="col-xs-2 bolden"><abbr title="' + tooltipString + '"  class="tip" data-toggle="tooltip" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div><div class="col-xs-2 bolden">/devices/' + obj[i].DeviceHardwareId + '</div><div class="col-xs-4 bolden">' + obj[i].ActivitySummary + '</div></div>');


                        $("#moreInfo" + obj[i].ActivityId).append('  <div class="col-xs-1"></div>' + '  <div class="col-xs-8 "><b>ID: </b>/activity/' + obj[i].ActivityId + '</div>' + '<br>' + '  <div class="col-xs-1"></div>' +
                            '  <div class="col-xs-8 "><b>Reckon: </b>/reckons/000001</div>' + '<br>' + '  <div class="col-xs-1"></div>' +
                            '  <div class="col-xs-11 "><b>Time.created: </b>' + getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate, true) + ' (GMT)' + '</div>' + '<br>' + ' <div class="col-xs-1"></div>' +
                            '  <div class="col-xs-11 "><b>Local Timezone: </b>' + currentDateString.substring(currentDateString.indexOf('GMT'), currentDateString.length) + '</div>' + '<br>' + ' <div class="col-xs-1"></div>' +
                            '  <div class="col-xs-4 "><b>Data:</b></div>' + '  <br>   ' + ' ' + '    <div class="col-xs-2"></div>' +
                            '  <div class="col-xs-8 "><b>ID: </b>/data/'+ obj[i].LoggedImportedDataId +'</div>' + '   ' + '  <br>  ' + '  <div class="col-xs-2"></div>' +
                            '  <div class="col-xs-8 "><b>Source: </b>/devices/' + obj[i].DeviceHardwareId + '/sensors/' + obj[i].SensorId + '</div>' + '' + '  <br> ' + '  <div class="col-xs-2"></div>' +
                            '  <span ' + (obj[i].Value == null ? 'style="display: none"' : '') + '><div class="col-xs-8 "><b>Data: </b>' + obj[i].Value + '<br></div>' + ' <br> <div class="col-xs-2"></div> </span> ' +
                            '  <div class="col-xs-8 "><b>Activity: </b>' + obj[i].ActivitySummary + '<br></div>');

                        $('.tip').tooltipster({
                            contentAsHTML: true
                        });
                        jQuery("time.timeago").timeago();
                    }, 4000, obj, i);


            }




            for (var k = 0; k < dataActivity.length; k++) {
                if (obj[i].ActivitySummary.startsWith(dataActivity[k])) {
                    console.log("Add the Activity Summary");
                    var activity = obj[i];
                    var propability = (obj[i].Confidence * 100) + ' %';
                    var name = obj[i].DeviceUserName;
                    if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
                    var dat = new Date(obj[i].TimeStamp + "Z");
                    if (name == " ") name = obj[i].PatientNumber;

                    var dat = new Date(obj[i].TimeStamp + "Z");
                    //            var insghtDate = new Date(dat.valueOf() + timeDifference);


                    var tooltipUTCDate = new Date(obj[i].TimeStamp);

                    //            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.indexOf("Safari") > -1 || navigator.userAgent.indexOf("op") > -1) {
                    tooltipUTCDate.setMinutes(tooltipUTCDate.getMinutes() + tooltipUTCDate.getTimezoneOffset());
                    //            }

                    if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                        tooltipUTCDate = dat;
                    }



              

                    var timeStamp = moment(dat).format();
                    //var tooltipString = tooltipUTCDate.toString().substring(0, tooltipUTCDate.toString().lastIndexOf('G') - 1) + "." + tooltipUTCDate.getMilliseconds() + '<br>' + tooltipUTCDate.toString().substring(tooltipUTCDate.toString().indexOf('G'));

                    var tooltipString = getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate) + ' (GMT)';

                    $("#dataDiv").prepend('<div class="row listed" id="moreInfo' + obj[i].ActivityId + '" style="display:none;line-height:30px"></div>');
                    $("#dataDiv").prepend('<div class="row listed " id="' + obj[i].ActivityId + '"style="display: none; " ></div>');


                    $("#" + obj[i].ActivityId).append('<div class="col-xs-1 " id="de"></div>');
                    //            $("#" + obj[i].ActivityId).append('<div class="col-xs-1 hid"><i class="fa fa-plus-circle hid"></i></div>');
                    $("#" + obj[i].ActivityId).append('<div class="col-xs-2  bolden hid' + obj[i].ActivityId + '" id="re"  style="opacity:0;"><abbr class="tip" id="abbr' + obj[i].ActivityId + '"   style="position:relative; z-index: 99999 !important;" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div>');
                    $("#" + obj[i].ActivityId).append('<div class="col-xs-2 bolden hid' + obj[i].ActivityId + ' " style="opacity:0;">/devices/' + obj[i].DeviceHardwareId + '</div>');
                    $("#" + obj[i].ActivityId).append('<div class="col-xs-4 bolden hid' + obj[i].ActivityId + ' " style="opacity:0;">' + obj[i].ActivitySummary + '</div>');
                    $("#" + obj[i].ActivityId).append('');
                    $("#" + obj[i].ActivityId).append('<div class="moreInfo" id="' + i + obj[i].ActivityId + '" style="display: none;"></div>');
                    $("#" + i + obj[i].ActivityId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
                    $("#" + i + obj[i].ActivityId).append('<div class="col-xs-2">' + getFullMonth(tooltipUTCDate.getMonth()) + ' ' + tooltipUTCDate.getDate() + ', ' + tooltipUTCDate.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(tooltipUTCDate) + '</div> ');
                    $("#" + i + obj[i].ActivityId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');
                    //            console.log('added row, new id: ' + obj[i].ActivityId + ', last id: ' + lastid);

                    $("#" + obj[i].ActivityId).slideDown(1000);
                    $(".hid" + obj[i].ActivityId).delay(1000).animate({
                        opacity: 1
                    }, 1000);
                    $(".hid" + obj[i].ActivityId).css("cursor", "pointer");
                    $(".hid" + obj[i].ActivityId).css("cursor", "hand");
                    $("#" + obj[i].ActivityId).animate({
                        backgroundColor: '#99c9e8'
                    }, 1000);
                    $("#" + obj[i].ActivityId).delay(1000).animate({
                        backgroundColor: '#FFFFFF'
                    }, 1000);

                    $('.tip').tooltipster({
                        contentAsHTML: true
                    });


                    setTimeout(
                        function (obj, i) {

                            var dat = new Date(obj[i].TimeStamp + "Z");

                            var timeStamp = moment(dat).format();

                            var tooltipUTCDate = dat;

                            var currentDateString = new Date().toString();


                            tooltipUTCDate.setMinutes(tooltipUTCDate.getMinutes() + tooltipUTCDate.getTimezoneOffset());


                            if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
                                tooltipUTCDate = dat;
                            }


                            //                    var tooltipString = tooltipUTCDate.toString().substring(0, tooltipUTCDate.toString().lastIndexOf('G') - 1) + "." + tooltipUTCDate.getMilliseconds() + '<br>' + tooltipUTCDate.toString().substring(tooltipUTCDate.toString().indexOf('G'));

                            var tooltipString = getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate) + ' (GMT)';

                            $("#" + obj[i].ActivityId).replaceWith('<div class="row listed " id="' + obj[i].ActivityId + '" > <div class="col-xs-1"><i class="fa fa-plus-circle"></i></div><div class="col-xs-2 bolden"><abbr title="' + tooltipString + '"  class="tip" data-toggle="tooltip" ><time class="timeago" datetime="' + timeStamp + '"></time></abbr></div><div class="col-xs-2 bolden">/devices/' + obj[i].DeviceHardwareId + '</div><div class="col-xs-4 bolden">' + obj[i].ActivitySummary + '</div></div>');


                            $("#moreInfo" + obj[i].ActivityId).append('  <div class="col-xs-1"></div>' + '  <div class="col-xs-8 "><b>ID: </b>/activity/' + obj[i].ActivityId + '</div>' + '<br>' + '  <div class="col-xs-1"></div>' +
                                '  <div class="col-xs-8 "><b>Reckon: </b>/reckons/000001</div>' + '<br>' + '  <div class="col-xs-1"></div>' +
                                '  <div class="col-xs-11 "><b>Time.created: </b>' + getDateView(tooltipUTCDate) + ' ' + convertTwelveHours(tooltipUTCDate, true) + ' (GMT)' + '</div>' + '<br>' + ' <div class="col-xs-1"></div>' +
                                '  <div class="col-xs-11 "><b>Local Timezone: </b>' + currentDateString.substring(currentDateString.indexOf('GMT'), currentDateString.length) + '</div>' + '<br>' + ' <div class="col-xs-1"></div>' +
                                '  <div class="col-xs-4 "><b>Data:</b></div>' + '  <br>   ' + ' ' + '    <div class="col-xs-2"></div>' +
                                '  <div class="col-xs-8 "><b>ID: </b>/data/'+ obj[i].LoggedImportedDataId +'</div>' + '   ' + '  <br>  ' + '  <div class="col-xs-2"></div>' +
                                '  <div class="col-xs-8 "><b>Source: </b>/devices/' + obj[i].DeviceHardwareId + '/sensors/' + obj[i].SensorId + '</div>' + '' + '  <br> ' + '  <div class="col-xs-2"></div>' +
                                '  <span ' + (obj[i].Value == null ? 'style="display: none"' : '') + '><div class="col-xs-8 "><b>Data: </b>' + obj[i].Value + '<br></div>' + ' <br> <div class="col-xs-2"></div> </span> ' +
                                '  <div class="col-xs-8 "><b>Activity: </b>' + obj[i].ActivitySummary + '<br></div>');

                            $('.tip').tooltipster({
                                contentAsHTML: true
                            });
                            jQuery("time.timeago").timeago();
                        }, 4000, obj, i);
                } else {

                }

            }


            //            if (i == obj.length - 1) leastid = obj[i].ActivityId;
            //            if (lastid < obj[i].ActivityId) lastid = obj[i].ActivityId;
        }

        jQuery("time.timeago").timeago();
        //        console.log('done adding row ' + i);
    }
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
        if (data[i].ActivityId > firstId)
            firstId = data[i].ActivityId;

    }

}

function convertTwelveHours(date, withMs) {

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
    var strTime = hours + ':' + minutes + (withMs ? ('.' + date.getMilliseconds()) : '') + ampm;

    return strTime;

}

function getDateView(date) {

    var dateStr;

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    dateStr = days[date.getDay()] + ', ';
    dateStr += months[date.getMonth()] + ' ' + (date.getDate());

    return dateStr;


}


function loadDataActivity() {
    dataActivity = [];
   
    
    $('#selectActivity option:selected').each(function () {
        var selText = $(this).text();
     
        if (selText == "Pressure (old)") {
            selText = "Pressure = ";
        }
        dataActivity.push(selText);
    });

    if (dataActivity.length == $('#selectActivity option').length)
        dataActivity = [];

}