function testGetDate(d) {
    var dat = new Date(d);
    return d.toString();
}

function getDate(d) {
    //console.log(d);
    var datorig = new Date(d);
    var dat = new Date(d);
    dat.setUTCHours(datorig.getHours(), datorig.getMinutes(), datorig.getSeconds(), datorig.getMilliseconds());
    var end = 'AM';
    var hour = dat.getUTCHours().toString();
    if (dat.getUTCHours() > 12 && dat.getUTCHours() < 24) {
        hour = (dat.getUTCHours() - 12).toString();
    }
    else if (hour == 24) {
        hour = '00';
    }
    var min = dat.getUTCMinutes().toString();
    if (min.length < 2) min = '0' + min;
    var sec = dat.getUTCSeconds().toString();
    if (sec.length < 2) sec = '0' + sec;
    if (hour.length < 2) hour = '0' + hour;
    if (dat.getUTCHours() > 11 && dat.getUTCHours < 24) end = 'PM';

    var ret = getFullMonth(dat.getUTCMonth()) + ' ' + dat.getUTCDate() + ', ' + dat.getUTCFullYear() + '  ' + getTimeString(datorig);
    return ret;
}

function getFullMonth(m) {
    switch (m) {
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        default:
            return 'December';
    }
}

function getClientDate(d) {

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
    }
    else if (hour == 24) {
        hour = '00';
    }
    var min = dat.getMinutes().toString();
    if (min.length < 2) min = '0' + min;
    var sec = dat.getSeconds().toString();
    if (sec.length < 2) sec = '0' + sec;
    if (hour.length < 2) hour = '0' + hour;
    if (dat.getHours() > 11 && dat.getHours() < 24) end = 'PM';

    var ret = hour + ':' + min + ':' + sec + ' ' + end;
    return ret;
}

function displayDates(d) {
    var dat = new Date(d.replace(/\T/g, ' '));
    var datUtc = new Date(d.replace(/\T/g, ' ') + ' UTC');
    var datSortUtc = new Date(d + ' UTC');
    //console.log('utc: ' + dat + ', local no sort: ' + datUtc + ', sorted global: ' + d.replace(/\T/g, ' '));
}