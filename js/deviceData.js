var syncTime;
var dataSubmit = [];


$(document).ready(function () {
    $(':text').each(function () {
        $(this).val('');
    });
    $('.data').val('');

    var idCtr = 19;

    while (idCtr != 93) {
        $('#deviceId').append($("<option />").val(idCtr).text(idCtr));

        if (idCtr == 27)
            idCtr = 89;
        idCtr++;
    }

    getLastSync();

    $('#addBtn').click(function () {

        var device = {

            syncTime: syncTime,
            startTime: $('#startTime').val(),
            deviceId: $('#deviceId').val(),
            pressure: $('#pressure').val(),
            orientation: $('#orientation').val(),
            capacitive: $('#capacitive').val(),
            temperature: $('#temperature').val(),
            humidity: $('#humidity').val(),
            battery: $('#battery').val()

        };

        var base = {
            baseId: "8944500606138073457",
            firmware: "21"
        };




        if (!validate(device))
            return;
        else
            dataSnip(device);
        //        }

    });
    $('#deviceId').change(function () {

        getLastSync();

    });
    $('#submitData').click(function () {

        if ($('.data').val() == '')
            return;
        else

            submitData(dataSubmit);

    });





});



function checkDeviceId(deviceId) {

    $.ajax({
        url: config_apiserver + 'api/device/' + deviceId + '/CheckDeviceId',
        type: 'POST',
        contentType: "application/json;charset=utf-8",
        success: function (response) {

            if((deviceId < 19 || deviceId > 27) && (deviceId < 90 || deviceId > 92))
                return false;
            
            
            return true;
        },
        error: function (response) {
            return false;
        }
    });


}

function getLastSync() {
    var deviceId = $('#deviceId').val();

    //TODO: set ouauth authoriztion for the request with userid as well 

    $.ajax({
        url: config_apiserver + 'api/device/' + deviceId + '/getLastSync',
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            console.log(response);
            var currentDate = new Date();
            var date = new Date(response + "Z");

            var d = currentDate - date;

           // alert("current: " + currentDate + "  " + "response Date: " + response + "   " + d)

            $('#syncTime').html(Math.floor(d / 1000) + " secs ago");
            syncTime = Math.floor(d / 1000);
            $('#deviceId').next().hide();

        },
        error: function (response) {
            console.error('could not get last sync time');
        }
    });

}

function dataSnip(device) {

    var data = [];

    data.push("8944500606138073457");
    data.push("21");
    data.push(device.deviceId);
    data.push("20");

    var transmissionTime = decimalToHexString(Math.floor(device.syncTime / 8));
    if (transmissionTime.length > 4) {
        data.push(transmissionTime.substring(0, 3));
        data.push(transmissionTime.substring(4, transmissionTime.length));
    } else {
        data.push(0);
        data.push(transmissionTime);
    }


    data.push("9");

    var eventTime = decimalToHexString(Math.floor(device.startTime / 8));
    var battery = decimalToHexString(Math.abs(Math.ceil((device.battery - 2.5) * 100)));

    if (eventTime.length > 4) {
        data.push(eventTime.substring(0, 3));
        data.push(eventTime.substring(4, transmissionTime.length));
    } else {
        data.push(0);
        data.push(eventTime + battery);
    }

    var temp = decimalToHexString(Math.ceil((parseFloat(device.temperature) + 41) * (1.54)));
    var humidity = decimalToHexString(Math.ceil(parseFloat(device.humidity) * (2.55)));


    data.push(temp + humidity);
    //    data.push("C");
    //    data.push("77E");

    var t1 = 0.4,
        p1 = 0,
        o1 = 0,
        c1 = 0;
    data.push(decimalToHexString((t1 * 10 * 2)));
    data.push(0);


    var t2 = 0.8;

    data.push(decimalToHexString(((t2 * 10 * 2) + parseInt(device.capacitive))));

    var pressure = decimalToHexString(parseInt(device.pressure));
    if (pressure.length == 1) pressure = 0 + pressure ;



    var orientation = decimalToHexString(Math.ceil((device.orientation * 127) / 90));
    var PO = pressure + orientation;
    data.push(PO);

    var t3 = 1.2,
        p3 = 0,
        o3 = 0,
        c3 = 0;
    data.push(decimalToHexString((t3 * 10 * 2)));
    data.push(0);



    data.push(0);
    data.push(0);
    data.push("Z");

    var part1 = data[0].toString();
    var part2 = data[1].toString();
    var part3 = data[2].toString();
    var part4 = data.slice(3, data.length).toString();


    dataSubmit = [part1, part2, part3, part4];


    $('.data').val('["' + part1 + '","' + part2 + '","' + part3 + '","' + part4 + '"]');





}


function submitData(data) {
    var snippetArray = []
    snippetArray = $('.data').val().split('"');

    data[0] = snippetArray[1];
    data[1] = snippetArray[3];
    data[2] = snippetArray[5];
    data[3] = snippetArray[7];

    if (checkDeviceId(data[2])) {
        $('#submitStatus').html('Could not submit data: Invalid Device Id').css('color', 'red');
        return;
    }



    ajaxSetup();

    $.ajax({


        url: config_apiserver + '/api/ImportedData',
        type: 'POST',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        success: function (response) {
            $('#submitStatus').html('Data submitted').css('color', 'green');
        },
        error: function (x, y, z) {
            $('#submitStatus').html('Could not submit data').css('color', 'red');
        }
    });






}


function decimalToHexString(number) {
    if (number < 0) {
        number = 0xFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}





function validate(device) {

    var error = true;
    console.log(device);

    if (isNaN(device.startTime) || device.startTime.replace(/ /g, '') == '') {
        $('.starttime-error').html(' wrong value').show();
        error = false;
    } else $('.starttime-error').hide();

    //    if (isNaN(device.deviceId) || device.deviceId.replace(/ /g, '') == '' || checkDeviceId()) {
    //        $('.deviceid-error').html(' invalid id').show();
    //        error = false;
    //    } else $('.deviceid-error').hide();

    if (isNaN(device.pressure) || device.pressure < 0 || device.pressure > 255 || device.pressure.replace(/ /g, '') == '') {
        $('.pressure-error').html(' value ranges from 0 to 255').show();
        error = false;
    } else $('.pressure-error').hide();

    if (isNaN(device.orientation) || device.orientation < -90 || device.orientation > 90 || device.orientation.replace(/ /g, '') == '') {
        $('.orientation-error').html(' value ranges from -90 to 90').show();
        error = false;
    } else $('.orientation-error').hide();

    if (isNaN(device.capacitive) || device.capacitive < 0 || device.capacitive > 1 || device.capacitive.replace(/ /g, '') == '') {
        $('.capacitive-error').html(' value must be 0 or 1').show();
        error = false;

    } else $('.capacitive-error').hide();

    if (isNaN(device.temperature) || device.temperature < -41 || device.temperature > 125 || device.temperature.replace(/ /g, '') == '') {
        $('.temperature-error').html(' value ranges from -41 to 125 degrees').show();
        error = false;
    } else $('.temperature-error').hide();

    if (isNaN(device.humidity) || device.humidity < 0 || device.humidity > 100 || device.humidity.replace(/ /g, '') == '') {
        $('.humidity-error').html(' value ranges from 0 to 100').show();
        error = false;
    } else $('.humidity-error').hide();

    if (isNaN(device.battery) || device.battery < 2.5 || device.battery > 5 || device.battery.replace(/ /g, '') == '') {
        $('.battery-error').html(' value ranges from 2.5 to 5').show();

        error = false;

    } else $('.battery-error').hide();


    return error;









}