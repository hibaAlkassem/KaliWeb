//todo: hide actions untill data are loaded
var userid;
var btnEdit, btnSave, btnPassword, btnCancel, btnKey;
var spanFirstName, spanLastName, spanEmail;
var inputFirstName, inputLastName, inputEmail, inputNewPassword, inputOldPassword, inputConfirmPassword;
var divFirstName, divLastName, divEmail, divNewPassword, divOldPassword, divConfirmPassword;
var errFirstName, errLastName, errEmail, errNewPassword, errOldPassword, errConfirmPassword;
var passForm;
var saveFor = "";
var apiToken = "";

ajaxSetup();
$(document).ready(function () {
    userid = myval;
    //init all listeners

    $("#profileInfo").prepend(spinner);
    initControls();
    initListeners();
    getPersonalInfo();


   

});


function ajaxSetup() {
    $.ajaxSetup({
        beforeSend: function (xhr) {
          //  xhr.setRequestHeader('Authorization', token);


        }
    });


}





function ValidateEmail(value) {
    var op = false;
    $.ajax({
        url: config_apiserver + 'api/users/byemail/' + value,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        async: false,
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.length == 0) {
                console.log("here");
                op = true;
            } else if (data[0].RxUserId == userid) {
                console.log("here2");
                op = true;
            }
        },
        error: function (jqXHR, exception) {
            console.log("error");
        }
    });
    console.log(op);
    return op;
}


$('#refresh').on('click', function () {
    $('#modalNewToken').modal('show');
    $('#pwd').val("");
    $("#lblPassword").hide();
});
$('#btn-modal-AddKey').click(function () {
    // deleteMonitor(deleteid, key);
     
     
      AddKey();

});

$('#pwd').keypress(function () {
    $("#lblPassword").hide();
});
function AddKey() {

    var password = $('#pwd')
       .val();

    if (password == "") {
        $("#lblPassword").show();
        $("#lblPassword").text("Password is required.");
        return;
    }
    $.ajax({
        url: config_apiserver + 'api/users/' + userid,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            var user = data[0];
            
            if (CryptoJS.MD5($('#pwd').val()).toString().toUpperCase() != user.HashedPassword) {
                $("#lblPassword").show();
                $("#lblPassword").text("Wrong Password");
                
            }
            else {


                var tRequesut = { username: user.Email, password: $('#pwd').val(), client_id: user.RxUserId, grant_type: "password" };
                console.log("Get the tRequest : " + tRequesut);
                $.ajax({
                    type: "POST",
                    //  crossDomain: true,
                    url: config_apiserver + "tokenYear",
                    data: tRequesut,
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    aysnc: true,
                    success: function (response) {
                        // Add the token to the database and when success add it to the table

                        var tokenresult = response.token_type + " " + response.access_token;
                        apiToken = tokenresult;
                        $("#apiKey").html(apiToken);
                        $("#statusAuth").text("Current status: 200");
                        $("#statusAuth").css("color", "green");
                        // Add the new Token to the database
                        var rxuser = {
                            Token: apiToken
                        };



                        $.ajax({
                            url: config_apiserver + 'api/users/' + userid + '/addToken',
                            type: 'PUT',
                            data: rxuser,
                            dataType: "json",
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            },
                            aysnc: false,
                            success: function (result) {

                            }
                        });

                        $('#modalNewToken').modal('hide');


                    },
                    error: function () {

                    }
                });
            }


        },
        error: function (x, y, z) {
            alert('failed to load user');
        }
    });

}






function initControls() {
    //init buttons
    btnEdit = $("#btn-edit");
    btnSave = $("#btn-save");
    btnkey = $("#btn-key");
    btnPassword = $("#btn-password");
    btnCancel = $("#btn-cancel");
    //init inputs
    inputEmail = $("#txtEmail");
    inputFirstName = $("#txtFirstName");
    inputLastName = $("#txtLastName");
    inputNewPassword = $("#txtNewPassword");
    inputOldPassword = $("#txtOldPassword");
    inputConfirmPassword = $("#txtConfirmPassword");
    //init spans
    spanEmail = $("#lblEmail");
    spanFirstName = $("#lblFirstName");
    spanLastName = $("#lblLastName");
    //init passform div
    passForm = $("#passwordForm");
    //init divs
    divEmail = $("#divEmail");
    divFirstName = $("#divFirstName");
    divLastName = $("#divLastName");
    divNewPassword = $("#divNewPassword");
    divOldPassword = $("#divOldPassword");
    divConfirmPassword = $("#divConfirmPassword");
    //init error labels
    errEmail = $("#lblEmailError");
    errFirstName = $("#lblFirstNameError");
    errLastName = $("#lblLastNameError");
    errNewPassword = $("#lblNewPasswordError");
    errOldPassword = $("#lblOldPasswordError");
    errConfirmPassword = $("#lblConfirmPasswordError");
}

function initListeners() {
    btnEdit.click(function () {
        switchEdit();
    });
    btnPassword.click(function () {
        switchPassword();
    });
    btnSave.click(function () {
        $("#btn-save,#btn-cancel").attr("disabled", true);
        save();
    });
    btnCancel.click(function () {
        switchRead();
    });
    btnkey.click(function () {
        switchKey();
    });
}
//start ui functions
function switchEdit() {
    toggleInputs(false);
    toggleSpans(true);
    toggleButons(true);
    fillInfoInputs();
    saveFor = "PersonalInfo";
}

function switchKey() {


    $("#apiKeyForm").show();
    $("#apiKey").html(apiToken);
    $("#accountnumber").html(myval);
    //token
    btnkey.hide();
    btnEdit.hide();
    btnPassword.hide();
    btnSave.hide();
    btnCancel.show();

}


function switchPassword() {
    toggleButons(true);
    passForm.show("fast");
    saveFor = "Password";
}

function switchRead() {
    toggleSpans(false);
    toggleInputs(true);
    toggleButons(false);
    btnkey.show();
    $("#apiKeyForm").hide();
    clearPasswordFields();
    clearPersonalInfoValidation();
    clearPasswordValidation();
    passForm.hide("fast");
    saveFor = "";
}

function save() {
    if (saveFor == "PersonalInfo") savePersonalInfo();
    if (saveFor == "Password") savePassword();
}

function toggleSpans(hide) {
    if (hide) {
        spanEmail.hide();
        spanFirstName.hide();
        spanLastName.hide();
    } else {
        spanEmail.show();
        spanFirstName.show();
        spanLastName.show();
    }
}

function toggleInputs(hide) {
    if (hide) {
        inputEmail.hide("fast");
        inputFirstName.hide("fast");
        inputLastName.hide("fast");
    } else {
        inputEmail.show("fast");
        inputFirstName.show("fast");
        inputLastName.show("fast");
    }
}

function toggleButons(hideEdit) {
    if (hideEdit) {
        btnEdit.hide();
        btnPassword.hide();
        btnSave.show();
        btnkey.hide();
        btnCancel.show();
    } else {
        btnEdit.show();
        btnPassword.show();
        btnkey.show();
        btnSave.hide();
        btnCancel.hide();
    }
}

function fillInfoInputs() {
    inputEmail.val(spanEmail.html());
    inputFirstName.val(spanFirstName.html());
    inputLastName.val(spanLastName.html());
}

function clearPasswordFields() {
    inputNewPassword.val('');
    inputOldPassword.val('');
    inputConfirmPassword.val('');
}
//end ui functions


function tokenValidation() {

    console.log("ApiToken : ", apiToken);
    $.ajax({
        url: config_apiserver + 'api/users/' + userid,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', apiToken);
        },
        success: function (data) {

            // Auth token status & Color
            $("#statusAuth").text("Current status: 200");
            $("#statusAuth").css("color", "green");
          
        },
        error: function (x, y, z) {
            // Auth token status & Color
            $("#statusAuth").text("Current status: 401");
            $("#statusAuth").css("color", "red");

        }
    });


}





function getPersonalInfo() {
    //do ajax call to get user object, display firstname, lastname, and passowrd
    $.ajax({
        url: config_apiserver + 'api/users/' + userid,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            $("#btn-password,#btn-edit").attr("disabled", false);
            var user = data[0];
            $("#spinner").hide();
            $("#divFirstName, #divLastName, #divEmail").show();
            spanEmail.html(user.Email);
            spanFirstName.html(user.FirstName);
            spanLastName.html(user.LastName);
            apiToken = user.Token;
            tokenValidation();
        },
        error: function (x, y, z) {
            alert('failed to load user');
        }
    });
}

function savePersonalInfo() {
    //check if there has been changes
    if (!PersonalInfoValuesChanged()) {
        console.log('values have not been changes..');
        $("#btn-save,#btn-cancel").attr("disabled", false);
        successPersonalInfo();
        return;
    }
    //validate input fields' values
    if (!validatePersonalInfo()) return;
    jQuery.support.cors = true;
    var RxUser = {
        RxUserId: userid,
        Email: inputEmail.val(),
        FirstName: inputFirstName.val(),
        LastName: inputLastName.val()
    };
    $.ajax({
        url: config_apiserver + 'api/users/' + userid + '/personalinfo',
        type: 'PUT',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: JSON.stringify(RxUser),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#btn-save,#btn-cancel").attr("disabled", false);
            successPersonalInfo();

            $.cookie.json = true;

            var cookieContents = {
                logged: true,
                'fullname': RxUser.FirstName + ' ' + RxUser.LastName,
                'userid': $.cookie('user').userid,
                'doesExpire': $.cookie('user').doesExpire,
                'blurred': $.cookie('user').blurred,
                'token': $.cookie('user').token
            };

            $.cookie("user", cookieContents);
            $('.username > strong:nth-child(2)')[0].innerHTML = $.cookie('user').fullname;


        },
        error: function (x, y, z) {
            $("#btn-save,#btn-cancel").attr("disabled", false);
            failPersonalInfo();
        }
    });
}
//check if the values in the inputs are different from the ones in the spans
function PersonalInfoValuesChanged() {
    if (spanEmail.html() == inputEmail.val() && spanFirstName.html() == inputFirstName.val() && spanLastName.html() == inputLastName.val()) return false;
    else return true;
}
//check if all personal info inputs are valid
function validatePersonalInfo() {
    var ret = true;
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var validEmail = re.test(inputEmail.val());

    clearPersonalInfoValidation();
    if (!validEmail) {
        divEmail.addClass("error-control");
        errEmail.html('Please enter a valid email address');
        errEmail.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    if (inputEmail.val().length < 1) {
        divEmail.addClass("error-control");
        errEmail.html('Email is required');
        errEmail.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    if (!ValidateEmail(inputEmail.val()) && ret) {
        divEmail.addClass("error-control");
        errEmail.html('This email is already registered');
        errEmail.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    if (inputFirstName.val().length < 1) {
        divFirstName.addClass("error-control");
        errFirstName.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    if (inputLastName.val().length < 1) {
        divLastName.addClass("error-control");
        errLastName.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    return ret;
}
//clear all validation related ui stuff
function clearPersonalInfoValidation() {
    errEmail.hide();
    divEmail.removeClass("error-control");
    errFirstName.hide();
    divFirstName.removeClass("error-control");
    errLastName.hide();
    divLastName.removeClass("error-control");
}
//call when the put after put request is successful
//copy text from inputs to spans
//switch to read mode
function successPersonalInfo() {
    spanEmail.html(inputEmail.val());
    spanFirstName.html(inputFirstName.val());
    spanLastName.html(inputLastName.val());
    switchRead();
    showSuccessMessage('Profile info successfully saved');
}
//call after put request fails
//show error message and switch to read mode
function failPersonalInfo() {
    switchRead();
    showFailMessage('Personal info save failed!');
}

function savePassword() {
    //validate input fields' values
    if (!validatePasswords()) return;
    jQuery.support.cors = true;

    var loginDetails = {
        username: spanEmail.html(),
        password: CryptoJS.MD5(inputOldPassword.val()).toString().toUpperCase(),
        guid: null
    };
    var passData = {
        newPassword: CryptoJS.MD5(inputNewPassword.val()).toString().toUpperCase()
    };
    $.ajax({
        url: config_apiserver + 'api/users/authenticate',
        type: 'POST',
        data: JSON.stringify(loginDetails),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.ajax({
                url: config_apiserver + 'api/users/' + userid + '/password',
                type: 'PUT',
                data: JSON.stringify(passData),
                contentType: "application/json;charset=utf-8",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                success: function (data) {
                    $("#btn-save,#btn-cancel").attr("disabled", false);
                    successPassword();
                },
                error: function (x, y, z) {
                    $("#btn-save,#btn-cancel").attr("disabled", false);
                    failPassword();
                }
            });
        },
        error: function (x, y, z) {
            $("#btn-save,#btn-cancel").attr("disabled", false);
            divOldPassword.addClass("error-control");
            errOldPassword.text("Old Password is wrong.");
            errOldPassword.show();
        }
    });
}

function validatePasswords() {
    var ret = true;
    clearPasswordValidation();
    if (inputNewPassword.val().length < 8) {
        divNewPassword.addClass("error-control");
        errNewPassword.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    if (inputOldPassword.val().length < 1) {
        divOldPassword.addClass("error-control");
        errOldPassword.text("Old Password is required.");
        errOldPassword.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    if (inputConfirmPassword.val() != inputNewPassword.val()) {
        divConfirmPassword.addClass("error-control");
        errConfirmPassword.show();
        $("#btn-save,#btn-cancel").attr("disabled", false);
        ret = false;
    }
    return ret;
}

function clearPasswordValidation() {
    errNewPassword.hide()
    errOldPassword.hide();
    errConfirmPassword.hide();
    divNewPassword.removeClass("error-control");
    divOldPassword.removeClass("error-control");
    divConfirmPassword.removeClass("error-control");
}

function successPassword() {
    switchRead();
    showSuccessMessage('Password successfully saved');
}

function failPassword() {
    switchRead();
    showFailMessage('Password save failed!');
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