var queryEmail = queryString["email"];
var queryUid = queryString["uid"];
var queryGuid = queryString["guid"];
var url;

$("#login_toggle")
    .click(function () {
        login();

    });

$("#login_email, #login_pass").keypress(function (event) {
    var key = event.keyCode ? event.keyCode : event.keyCode ? event.keyCode : 0;
    if (event.keyCode == 13) {

        console.log(event.keyCode);
        login();

    }
});


$(document).ready(function () {

    if (queryGuid != null)
        if (queryGuid != "") {
            $('#login_email').val(queryEmail);
            $('#login_email').attr("disabled", true);
        }


});


function login() {


    var email = $('#login_email')
        .val();
    var password = $('#login_pass')
        .val();
   
    if (!email || !password) {
        $("#divError")
        .html("Please enter email and password")
        .show();
        return;
    }

    $(":text, :password, #login_toggle, .btn").attr("disabled", true);
    $('#loginSpinner').css('visibility', 'visible');

//    if (queryGuid == null)
        url = config_apiserver + "api/users/authenticate";
//    else url = config_apiserver + "api/users/authenticate/" + email + "/" + password + "/" + queryGuid;
    console.log(url);
    var token;
    var newToken;
    
    
    var loginDetails = { username : email, password : CryptoJS.MD5(password).toString().toUpperCase(), guid : queryGuid == null ? null : queryGuid  };
    console.error(JSON.stringify(loginDetails));
    var rxuser = {
        Token: token
    };

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(loginDetails),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var clientid = response[0].RxUserId;
            console.log(response);
            newToken = response[0].Token;
            console.log("Token Login : ", newToken);
            var tRequesut = { username: email, password: password, client_id: clientid, grant_type: "password" };
          
            var loginData = { username : email, password : CryptoJS.MD5(password).toString().toUpperCase() };
            

            if (newToken == null) {

                $.ajax({
                    type: "POST",
                    url: config_apiserver + "tokenYear",
                    data: tRequesut,
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    aysnc: false,

                    success: function (data) {
                        console.log(token, "token");
                        token = data.token_type + " " + data.access_token;
                        console.log(token, "token");
                        rxuser.Token = token;
                        // == If Token is null modify it

                        $.ajax({
                            url: config_apiserver + 'api/users/' + clientid + '/addToken',
                            type: 'PUT',
                            data: rxuser,
                            dataType: "json",
                            aysnc: false,
                            success: function (result) {

                                console.log("User Token is saved with response : ", result);

                                var cookieContents = { logged: true, 'fullname': response[0].FirstName + " " + response[0].LastName, 'userid': response[0].RxUserId, 'doesExpire': true, 'blurred': false, 'token': token };
                                var cookieContentApi = { logged: true, 'fullname': response[0].FirstName + " " + response[0].LastName, 'userid': response[0].RxUserId, 'doesExpire': true, 'blurred': false, 'SavedToken': token };
                                $.cookie.json = true;

                                if ($("#monthCookie").attr('checked')) {
                                    cookieContents = { logged: true, 'fullname': response[0].FirstName + " " + response[0].LastName, 'userid': response[0].RxUserId, 'doesExpire': false, 'token': token };
                                    $.cookie("user", cookieContents, { expires: 30 });
                                }
                                else $.cookie("user", cookieContents, { expires: 1 });

                                //  $.cookie("apiUser", cookieContentApi, { expires: 3650 });

                                console.log($.cookie("user"), "cookie");
                                //$(":text, :password, #login_toggle, .btn").attr("disabled", false);

                                $('#loginSpinner').css('visibility', 'hidden');
                                window.location = "patients";

                            },
                            error: function (jqXHR, exception) {

                                console.log("Error when adding the token to the user");

                            }
                        });



                    }
                });

            } else {

                $.ajax({
                    type: "POST",
                    url: config_apiserver + "token",
                    data: tRequesut,
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    aysnc: false,

                    success: function (data) {
                        console.log(token, "token");
                        token = data.token_type + " " + data.access_token;
                        console.log(token, "token");
                       
                        // == If Token is null modify it
                        var cookieContents = { logged: true, 'fullname': response[0].FirstName + " " + response[0].LastName, 'userid': response[0].RxUserId, 'doesExpire': true, 'blurred': false, 'token': token };
                        //   var cookieContentApi = { logged: true, 'fullname': response[0].FirstName + " " + response[0].LastName, 'userid': response[0].RxUserId, 'doesExpire': true, 'blurred': false, 'SavedToken': newToken };

                        $.cookie.json = true;

                        if ($("#monthCookie").attr('checked')) {
                            cookieContents = { logged: true, 'fullname': response[0].FirstName + " " + response[0].LastName, 'userid': response[0].RxUserId, 'doesExpire': false, 'token': token };

                            $.cookie("user", cookieContents, { expires: 30 });
                        }
                        else $.cookie("user", cookieContents, { expires: 1 });




                        //    $.cookie("apiUser", cookieContentApi, { expires: 3650 });



                        console.log($.cookie("user"), "cookie");
                        //  console.log($.cookie("apiUser"), "APi cookie");

                        //$(":text, :password, #login_toggle, .btn").attr("disabled", false);

                        $('#loginSpinner').css('visibility', 'hidden');
                        window.location = "patients";

                    }
                });
            }
        },
        error: function () {
            $(":text, :password, #login_toggle, .btn").attr("disabled", false);
            $('#loginSpinner').css('visibility', 'hidden');
            $("#divError")
            .html("Username and Password do not match")
            .show();
        }



    });


}







