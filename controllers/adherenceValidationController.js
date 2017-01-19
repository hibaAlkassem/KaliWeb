var app = angular.module('adherenceValidation', ['ngCookies']);


app.controller('adValidationController', function ($scope, $http, $cookies) {

            $scope.patients = [];
            $scope.insights = [];
            $scope.tenAvg = 0;
            $scope.fourAvg = 0;

            var token = JSON.parse($cookies.user).token;



            $http.get(config_apiserver + '/api/rxmonitor/' + myval + '/getAllPatients', {
                headers: {
                    'Authorization': token
                }
            }).
            then(function (response) {
                console.log(response, 'angular');
                $scope.patients = response.data;


            }, function (response) {


            });



         $("select.patients").select2()
        .on("change", function(e) {
                console.log('here');

                var pId = $("select.patients").select2('data').element[0].attributes[0].nodeValue;

                $http.get(config_apiserver + '/api/users/' + myval + '/adherenceValidation/ ' + pId, {
                    headers: {
                        'Authorization': token
                    }
                }).
                then(function (response) {
                    console.log(response, 'insights');
                    $scope.insights = response.data[3];
                    $scope.tenAvg =response.data[0];
                    $scope.fourAvg = response.data[1];
                    $scope.total = response.data[2];
                    
                  


                }, function (response) {


                });


            });
    
});