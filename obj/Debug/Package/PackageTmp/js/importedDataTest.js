var token = "aZOmcXac_yJkn7cQXlTGh8VCP_cYIF912o6r7zQRUmOkiQr1Vq2jxSoIIbNatxVLHBkr-LtXsaK_ORn3BIdbNWKeZkQb_ZJCJYPhEPUuClK72qGYS4yBYxwTZBM0wlTAZLl9wqhMwsphO8PS4AgIXCpQymyMjBgufG762CcnjNHZt1NtE7OlFCpLoVtYvdfFffAJ0U0RmkXv0jmEhKtKdSsSQqhn7Jry3v-zxFV_Rx66IK2BPMaUvBxCdV9uB6Fo"


var dummyData = {
    DataValue: 3,
    Bearer: token
}


//$.ajaxSetup({
//    beforeSend: function (xhr) {

//        xhr.setRequestHeader('Authorization', "bearer " + token);

//    }
//});



$.ajax({
    url: config_apiserver + 'api/importeddata',
    type: 'POST',
    data: dummyData,
    contentType: "application/json;charset=utf-8",
    success: function (data) {
        alert("success");
    },

    error: function () {
        alert("error");
    }
});