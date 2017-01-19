var syncTime;
var loggedDataId = queryString["loggeddataid"];
var dataPoints;
var isValid;
var scrolled = 0;
var deviceListIds = [];
var ischecked = false;

$(document).ready(function () {



   
    
  
    $('input[type="checkbox"]').click(function () {
        if ($(this).prop("checked") == true) {
            console.log("Checkbox is checked.");
            // show the date and time Picker.
            ischecked  = true;
            $("#check").show();
            $("#check1").show();
            $("#time1").show();
            $("#time2").show();
            $("#ParLastRequest").show();
            $("#ParLastSync").show();
           
          
            var date = $('#synDate').val();
            var time = $('#lastsynctime').val();
            
            console.log("Testing dates");
            console.log(date+" "+ time);

            $('#submitStatus').html('');


        }
        else if ($(this).prop("checked") == false) {
            ischecked = false;
            // hide the date and time picker
            $("#check").hide();
            $("#check1").hide();
            $("#time1").hide();
            $("#time2").hide();
            $("#ParLastRequest").hide();
            $("#ParLastSync").hide();
         
            $('#submitStatus').html('');
            

        }
    });
 



    //========================
    var idCtr = 19;

    while (idCtr != 93) {
        $('#deviceId').append($("<option />").val(idCtr).text(idCtr));

        deviceListIds.push(idCtr);

        if (idCtr == 27)
            idCtr = 89;
        idCtr++;
    } 
    
    
    if(typeof variable_here != undefined){
       getLoggedData(loggedDataId);
 };
    
    getLastSync();

    $('#deviceId').change(function () {

        getLastSync();

    });


    $('.btn-sensors').live('click', function () {
        addSensor($(this));
    });

    $('.btn-add-event').live('click', function () {

        addEvent($(this));

    });


    $('#clearForm').live('click', function () {

        clearForm();
        getLastSync();

    });

    $('.history-icon').live('click', function () {

        $('.saved-data-div').animate({
            width: 'toggle'
        }, 100);


    });

    $('#hideTemplates').live('click', function () {

        $('.saved-data-div').animate({
            width: 'toggle'
        }, 100);


    });

    $('.add-template-icon').live('click', function () {

        $('.template-name').animate({
            width: 'toggle'
        }, 100);


    });

    $('.cancel-temp-name').live('click', function () {

        $('.template-name').animate({
            width: 'toggle'
        }, 100);


    });

    $('#addBtn').live('click', function () {
        validate();
        if (isValid)
            addDataToSnipp()
    });

    $('#addToForm').live('click', function () {
        addToForm($('.data').val());

    });

    $('#submitData').live('click', function () {

        submitData($('.data').val());

    });

    $(".scroll-up").on("click", function () {

        if (scrolled < 289)
            scrolled = 289;

        if (!(($('#templates').scrollTop() + $('.saved-data-div').innerHeight()) <= 289)) {
            scrolled = scrolled - 300;
            $('.saved-data-div').animate({
                scrollTop: scrolled
            });
        }
    });

    $(".scroll-down").on("click", function () {

        if (scrolled > $('.saved-data-div').scrollTop() + $('.saved-data-div').innerHeight())
            scrolled = $('.saved-data-div').scrollTop() + $('.saved-data-div').innerHeight();


        if ((($('.saved-data-div').scrollTop() + $('.saved-data-div').innerHeight()) < document.getElementById("templates").scrollHeight)) {
            scrolled = scrolled + 300;
            $('.saved-data-div').animate({
                scrollTop: scrolled
            });
        }
    });

    //    $("#copyData").on("click", function () {
    //        window.clipboardData.clearData();
    //        window.clipboardData.setData("text", $('.data').val());
    //    });

    $(".remove-sensor").live('click', function () {
        $(this).parent().remove();
    });
    $(".remove-event").live('click', function () {
        $(this).parent().parent().remove();
    });
    
    $("#saveTemplate").live('click', function () {
       saveTemplate($('#templateName').val());
       $('.template-name').hide();
    });
    
    

});
//end of documnet.ready



function getLastSync() {
    var deviceId = $('#deviceId').val();

    //TODO: set ouauth authoriztion for the request with userid as well 

    ajaxSetup();

    $.ajax({
        url: config_apiserver + 'api/device/' + myval + '/' + deviceId + '/getLastSync',
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            console.log(response);
            var currentDate = new Date();
            var date = new Date(response + "Z");
            console.log(date,'devicedate');
            console.log(currentDate,'currentdate');

            var d = currentDate - date;

            $('#syncTime').html(Math.floor(d / 1000) + " secs ago");
            syncTime = Math.floor(d / 1000);
            $('#deviceId').next().hide();

        },
        error: function (response) {
            console.error('could not get last sync time');
        }
    });

}


function addEvent(button) {

    var event = '<div class="event-div added">' +
        '                            <h4>Event <i class="fa fa-times-circle remove-event"></i></h4>' +
        '' +
        '' +
        '' +
        '                            <div class="row event">' +
        '<div class="col-lg-12 start-time-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid start-time value</i></div>' +
        '            <div class="col-lg-12 temperature-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid temperature value! Insert a value between -41 and 125</i></div>' +
        '            <div class="col-lg-12 humidity-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid humidity value! Insert a value between between from 0 and 100</i></div>' +
        '            <div class="col-lg-12 battery-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid battery value! Insert a value between 2.5 and 5</i></div>' +


        '' +
        '<div class="col-lg-1 event-txt">StartTime</div>' +
        '                                <input class="col-lg-1 event-input start-time tip" type="text" data-toggle="tooltip" data-original-title="time in seconds"/>                                                        ' +
        '                                <div class="col-lg-1 event-txt ">Temperature</div>' +
        '                                <input class="col-lg-1 event-input temperature tip" type="text" data-toggle="tooltip" data-original-title="value ranges from -41 to 125" />' +
        '                                <div class="col-lg-1 event-txt ">Humidity</div>' +
        '                                <input class="col-lg-1 event-input humidity tip" type="text" data-toggle="tooltip" data-original-title="value ranges from 0 to 100" />' +
        '                                <div class="col-lg-1 event-txt">Battery</div>' +
        '                                <input class="col-lg-1 event-input battery tip" type="text" data-toggle="tooltip"  data-original-title="value ranges from 2.5 to 5" />' +
        '' +
        '' +
        '                            </div>' +
        '' +
        '                            <h4>Sensors</h4>' +

        '<div class="col-lg-12 sensor-time-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid sensor time value</i></div>' +
        '            <div class="col-lg-12 pressure-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid pressure value! Insert a value between 0 and 255</i></div>' +
        '            <div class="col-lg-12 orientation-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid orientation value! Insert a value between -90 and 90</i></div>' +
        '            <div class="col-lg-12 capacitive-error" hidden><i class="fa fa-warning" style="color:#ed8484" > Invalid capacitive value! Insert 1 or 0</i></div>' +
        '<div class="row sensor-data added">' +
        '' +
        '                                <div class="col-lg-1 event-txt">Time</div>' +
        '                                <input class="col-lg-1 event-input sensor-time tip" type="text" data-toggle="tooltip" data-original-title="time in seconds" />' +
        '                                <div class="col-lg-1 event-txt">Pressure</div>' +
        '                                <input class="col-lg-1 event-input pressure tip" type="text" data-toggle="tooltip" data-original-title="value ranges from 0 to 255" />' +
        '                                <div class="col-lg-1 event-txt">Orientation</div>' +
        '                                <input class="col-lg-1 event-input orientation tip" type="text" data-toggle="tooltip" data-original-title="value ranges from -90 to 90" />' +
        '                                <div class="col-lg-1 event-txt">Capacitive</div>' +
        '                                <input class="col-lg-1 event-input capacitive tip" type="text" data-toggle="tooltip" data-original-title="value must be 0 or 1"/>' +
        '' +
        '' +
        '                            </div>' +
        '' +
        '                            <button class="btn btn-default btn-sensors" type="button"><i class="fa fa-plus"></i> Add Sensor</button>' +
        '' +
        '                            <br> <br>' +
        '' +
        '                            <hr>' +
        '                        </div>';

    button.before(event);
    $("[data-toggle='tooltip']").tooltip();



}


function addSensor(button) {

    var sensorData = '<div class="row sensor-data added">' +
        '' +
        '                                <div class="col-lg-1 event-txt">Time</div>' +
        '                                <input class="col-lg-1 event-input sensor-time tip" type="text" data-toggle="tooltip" data-original-title="time in seconds" />' +
        '                                <div class="col-lg-1 event-txt">Pressure</div>' +
        '                                <input class="col-lg-1 event-input pressure tip" type="text" data-toggle="tooltip" data-original-title="value ranges from 0 to 255" />' +
        '                                <div class="col-lg-1 event-txt">Orientation</div>' +
        '                                <input class="col-lg-1 event-input orientation tip" type="text" data-toggle="tooltip" data-original-title="value ranges from -90 to 90" />' +
        '                                <div class="col-lg-1 event-txt">Capacitive</div>' +
        '                                <input class="col-lg-1 event-input capacitive tip" type="text" data-toggle="tooltip" data-original-title="value must be 0 or 1"/>' +
        '<i class="fa fa-times-circle remove-sensor"></i>' +
        ' </div>';

    button.before(sensorData);
    $("[data-toggle='tooltip']").tooltip();

}

function clearForm() {
    $('.added').remove();
    $('input').val('');
    $("#deviceId").val($("#target option:first").val());
    $('.start-time-error, .temperature-error, .humidity-error, .battery-error, .sensor-time-error, .pressure-error, .orientation-error, .capacitive-error').hide();
    $('.invalid').removeClass('invalid').attr('style', ' box-shadow:none');

    $('.pressure').last().parent().attr('style', '');


}

function addDataToSnipp() {

    dataPoints = 0;

    var deviceId = $('#deviceId').val();

    var data = [];

    data.push("8944500606138073457");
    data.push("21");
    data.push(deviceId);
    data.push("20");


    var transmissionTime = decimalToHexString(Math.floor(syncTime / 8));
    if (transmissionTime.length > 4) {
        data.push(transmissionTime.substring(0,transmissionTime.length - 4));
        data.push(transmissionTime.substring(4, transmissionTime.length));
    } else {
        data.push(0);
        data.push(transmissionTime);
    }


    //data points
    data.push("0");



    $('.event-div').each(function () {

        var startTime = $(this).find('.start-time').val();
        var temperature = $(this).find('.temperature').val();
        var humidity = $(this).find('.humidity').val();
        var battery = $(this).find('.battery').val();


        var eventTime = decimalToHexString(Math.floor(startTime / 8));

        battery = decimalToHexString(Math.abs(Math.ceil((battery - 2.5) * 100)));

        if(parseInt(battery) == 0)
            battery = "00";
        
        else if(battery.length == 1)
            battery = "0" + battery;
        
            console.log(battery);
        
        var EB = eventTime + battery;
        
        console.log(EB);
        
        if (EB.length > 4) {
            data.push(EB.substring(0,EB.length-4));
            dataPoints++;
            data.push(EB.substring(EB.length-4,EB.length));
            dataPoints++;
        } else {
            data.push(0);
            dataPoints++;
            data.push(EB);
            dataPoints++;
        }


        temperature = decimalToHexString(Math.round((parseFloat(temperature) + 41) * (1.54)));
        humidity = decimalToHexString(Math.round(parseFloat(humidity) * (2.55)));
        data.push(temperature + humidity);
        dataPoints++;



        $(this).children('.sensor-data').each(function () {

            var sensorTime = $(this).find('.sensor-time').val();
            var pressure = $(this).find('.pressure').val();
            var orientation = $(this).find('.orientation').val();
            var capacitive = $(this).find('.capacitive').val();

           

            data.push(decimalToHexString(((sensorTime * 10 * 2) + parseInt(capacitive))));
            dataPoints++;

            pressure = decimalToHexString(parseInt(pressure));

            if (parseInt(orientation) == 0) {

                if (pressure == "0")
                    data.push(0);

                else {
                    var PO = pressure + "00";

                    data.push(PO);
                }

            } else {

                orientation = decimalToHexString(Math.ceil((orientation * 127) / 90));

                if (orientation.length == 1)
                    orientation = 0 + orientation;


                if (pressure == "0")
                    pressure = '';

                var PO = pressure + orientation;

                data.push(PO);
            }


            dataPoints++;


        });


        data.push(0);
        data.push(0);


    });

    data[6] = decimalToHexString(dataPoints);



    data.push("Z");

    var part1 = data[0].toString();
    var part2 = data[1].toString();
    var part3 = data[2].toString();
    var part4 = data.slice(3, data.length).toString();


    dataSubmit = [part1, part2, part3, part4];


    $('.data').val('["' + part1 + '","' + part2 + '","' + part3 + '","' + part4 + '"]');


}


function decimalToHexString(number) {
    if (number < 0) {
        number = 0xFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}




function validate() {

    isValid = true;

    $('.temperature').each(function () {

        var temperature = $(this).val();

        if (isNaN(temperature) || temperature < -41 || temperature > 125 || temperature.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().find('.temperature-error').show();
            isValid = false;
        } else {
            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().find('.temperature-error').hide();
        }

    });
    $('.humidity').each(function () {

        var humidity = $(this).val();

        if (isNaN(humidity) || humidity < 0 || humidity > 100 || humidity.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().find('.humidity-error').show();
            isValid = false;
        } else {
            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().find('.humidity-error').hide();
        }

    });
    $('.battery').each(function () {

        var battery = $(this).val();

        if (isNaN(battery) || battery < 2.5 || battery > 5 || battery.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().find('.battery-error').show();
            isValid = false;
        } else {
            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().find('.battery-error').hide();
        }


    });
    $('.start-time').each(function () {

        var eventTime = $(this).val();

        if (isNaN(eventTime) || eventTime >= syncTime || eventTime.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().find('.start-time-error').show();
            isValid = false;
        } else {
            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().find('.start-time-error').hide();
        }

    });
    $('.sensor-time').each(function () {

        var sensorTime = $(this).val();

        if (isNaN(sensorTime) || sensorTime.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().parent().find('.sensor-time-error').show();
            isValid = false;
        } else {
            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().parent().find('.sensor-time-error').hide();
        }

    });
    $('.pressure').each(function () {

        var pressure = $(this).val();

        if (isNaN(pressure) || pressure < 0 || pressure > 255 || pressure.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().parent().find('.pressure-error').show();
            isValid = false;
        } else {
            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().parent().find('.pressure-error').hide();

        }

    });

    $('.orientation').each(function () {

        var orientation = $(this).val();

        if (isNaN(orientation) || orientation < -90 || orientation > 90 || orientation.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().parent().find('.orientation-error').show();
            isValid = false;
        } else {

            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().parent().find('.orientation-error').hide();

        }


    });

    $('.capacitive').each(function () {

        var capacitive = $(this).val();

        if (isNaN(capacitive) || capacitive < 0 || capacitive > 1 || capacitive.replace(/ /g, '') == '') {
            $(this).addClass('invalid').attr('style', ' box-shadow:0px 0px 5px #F39292  !important ');
            $(this).parent().parent().find('.capacitive-error').show();
            isValid = false;
        } else {
            $(this).removeClass('invalid').attr('style', ' box-shadow:none');
            $(this).parent().parent().find('.capacitive-error').hide();
        }


    });



}

function addToForm(snippetData) {
    //    var dummyData = ["8944500606138073457", "21", "21", "27,0,13,89,0,1097,694A,D,80,13,56,19,44,1E,1D7,2B,1995,31,8484,37,9283,45,8C83,4B,8D,51,A5,57,CA,5C,41,62,73,68,7B,6E,71,75,65,7B,A9F,81,1187,89,8183,8F,8F83,A3,8486,A9,AB,AF,5A,B5,9B6,BB,7595,C1,9096,CB,8A97,D1,9E,D7,59,DD,7E,E2,7E,0,0,0,6848,D,69,15,4F,1B,12,21,DEE,27,11DD,2D,11E3,33,12F7,39,1204,3F,1313,45,1221,4B,114A,51,D60,57,CFB,5D,13F3,63,25FE,69,66F8,6F,8AF7,75,90F5,7B,89F5,81,9F7,87,3F9,8D,1002,93,1817,99,2E28,9F,7939,A5,8537,AB,7E36,B1,72F,B7,26,C3,2C,C9,3B,CF,60,D5,7A,E0,7E,0,0,Z"];

    $.ajax({
        url: config_apiserver + '/api/importdata/' + myval + '/parseDataString',
        type: 'POST',
        data: JSON.stringify(JSON.parse(snippetData)),
        contentType: "application/json;charset=utf-8",
        success: function (response) {

            clearForm();
            fillForm(response);
        }

        ,

        error: function (data) {
            console.log(data);
        }
    });
}

function fillForm(response) {
    $('#syncTime').html(response.total8count + " secs ago");
    for (var e in response.events) {

        $('.start-time').last().val(response.events[e].eventstart);
        $('.temperature').last().val(response.events[e].temperature);
        $('.humidity').last().val(response.events[e].humidity);
        $('.battery').last().val(response.events[e].battlevel);

        for (var s in response.events[e].sensorData) {
            var sensorData = response.events[e].sensorData[s];
            if (s != 0)
                addSensor($('.btn-sensors').last());

            $('.sensor-time').last().val(sensorData.sensortime);
            $('.pressure ').last().val(sensorData.pressure);
            $('.orientation').last().val((sensorData.orientation / 127) * 90);
            $('.capacitive').last().val(sensorData.capacitive == "True" ? 1 : 0);

            if (response.events[e].sensorData[s].isPeak == "True")
                $('.pressure ').last().parent().attr('style', 'background-color: rgb(185, 222, 255);padding-bottom: 5px;border-radius: 4px;');
            $('.remove-sensor').last().attr('style', 'margin-top:11px');




        }
        if (e != response.events.length - 1)
            addEvent($('.btn-add-event'));
    }

    if (deviceListIds.indexOf(parseInt(response.deviceid)) == -1) {
        if ($('#deviceId option[value="none"]').length == 0)
            $('#deviceId').append($("<option />").val('none').text('-'));


        $('#deviceId option[value="none"]').attr("selected", "selected");
    } else $('#deviceId option[value="' + parseInt(response.deviceid) + '"]').attr("selected", "selected");

}

function submitData(snippetData) {

    ajaxSetup();
    
    console.log(snippetData);
    if (ischecked) {
        console.log("checked");

        var date = $('#synDate').val();
        var time = $('#lastsynctime').val();
        var syncdatetime = date + " " + time;
        var date1 = $('#lastRequestDate').val();
        var time1 = $('#lastrequestTime').val();
        var requestdatetime = date1 + " " + time1;
        console.log(syncdatetime);
        console.log(requestdatetime);

        if (date == "" || time == "" || date1 == "" || time1 == "") {

            $('#submitStatus').html('Please fill all the date & time picker').css('color', 'red');
        } else {


            $.ajax({

                url: config_apiserver + 'api/importdata/withData?lastrequestDate=' + syncdatetime + '&lastSyncDate=' + requestdatetime,
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(JSON.parse(snippetData)),
                success: function (response) {
                    $('#submitStatus').html('Data submitted').css('color', 'green');
                },
                error: function (x, y, z) {
                    $('#submitStatus').html('Could not submit data').css('color', 'red');
                }
            });
        }
    } else {

        console.log("not checked");
        console.log("not checked");
        $.ajax({

            url: config_apiserver + 'api/ImportedData',
            type: 'POST',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(JSON.parse(snippetData)),
            success: function (response) {
                $('#submitStatus').html('Data submitted').css('color', 'green');
            },
            error: function (x, y, z) {
                $('#submitStatus').html('Could not submit data').css('color', 'red');
            }
        });
    }
 

}

function saveTemplate(templateName) {

    var templateData = {};

    templateData.Name = templateName;
    
    addDataToSnipp();
    templateData.Data = $('.data').val();
   
    console.log(templateData);

    $.ajax({
        url: config_apiserver + 'api/apiToolTemplate/'+myval+'/addData',
        type: 'POST',
        data: JSON.stringify(templateData),
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            showErrorMessage('Template Saved');
        },
        error: function (response) {
             showErrorMessage('Could Not Save Template!');
        }
    });


}





function getLoggedData(loggedDataId){

    $.ajax({

        url: config_apiserver + 'api/importdata/' + myval + '/getLoggedData?loggeddataId=' + loggedDataId,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            
            if(response.DeviceData.indexOf(']')  < 1)
            $('.data').val('["8944500606138073457","21","'+ response.DeviceHardwareId + '","' + response.DeviceData + '" ]');
            else $('.data').val(response.DeviceData);
            addToForm($('.data').val());
        },
        error: function (response) {
            console.error('failed to get data');
        }
    });


}

