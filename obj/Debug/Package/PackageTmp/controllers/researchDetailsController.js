var app = angular.module('researchDetailsApp', ['ngCookies']);
var researchTitle;


app.controller('researchDetailsController', function ($scope, $cookies, $filter, $http) {


    $scope.details = {};
    $scope.permissions = {};
    $scope.datesString;
    $scope.newResearch = true;
    $scope.showSpinner = true;
    $scope.showDetails = false;
    $scope.fetchDetails = false;
    $scope.fetchPermissions = false;
    $scope.csvURL = '';
    $scope.userId = JSON.parse($cookies.user).userid;

    $scope.getResearchDetails = function (rId) {
        $http.get(config_apiserver + 'api/research/' + rId + '?userid=' + myval, {
            headers: {
                'Authorization': token
            }
        }).
        then(function (response) {
            var details = response.data;
            $scope.details = response.data;
            $scope.csvURL = config_apiserver + 'api/research/' + rId + 'csv?userid=' + myval + '&count=';
            researchTitle = details.ResearchName;

            if (details.StartDate == null && details.EndDate == null)
                $scope.datesString = 'Date not specified';
            else if (details.StartDate != null && details.EndDate == null)
                $scope.datesString = 'From ' + $filter('date')(details.StartDate, 'MMM dd, yyyy') + ' until otherwise specified';
            else if (details.StartDate == null && details.EndDate != null)
                $scope.datesString = 'Until ' + $filter('date')(details.EndDate, 'MMM dd, yyyy');
            else $scope.datesString = 'From ' + $filter('date')(details.StartDate, 'MMM dd, yyyy') + ' until ' + $filter('date')(details.EndDate, 'MMM dd, yyyy');

            $scope.fetchDetails = true;

            if ($scope.fetchDetails && $scope.fetchPermissions) {
                $scope.showSpinner = false;
                $scope.showDetails = true;
            }


        }, function (response) {

        });
    }

    $scope.getResearchPermissions = function (rId) {
        $http.get(config_apiserver + 'api/research/' + rId + '/permissions?userId=' + myval, {
            headers: {
                'Authorization': token
            }
        }).
        then(function (response) {

            $scope.permissions = response.data;

            $scope.fetchPermissions = true;

            if ($scope.fetchDetails && $scope.fetchPermissions) {
                $scope.showSpinner = false;
                $scope.showDetails = true;
            }


        }, function (response) {

        });
    }



});





//$filter('date')(item.date, "dd/MM/yyyy");
