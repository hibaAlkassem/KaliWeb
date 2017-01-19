console.log(typeof $.cookie('user'));
if (typeof $.cookie('user') != undefined)
  {

    var cookieIsSet = $.cookie('user');

 

        $.cookie.json = true;

        if ($.cookie('user').fullname != null && $.cookie('user').userid != null && $.cookie('user').doesExpire != null && $.cookie('user').token != null && $.cookie('user').logged)
            window.location = "patients";

        else $.removeCookie('user');
    }