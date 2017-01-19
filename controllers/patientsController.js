var app = angular.module('patientsApp', ['ui.bootstrap', 'ngCookies']);


app.controller('patientsController', function ($scope, $http, $cookies, $filter) {

    $scope.loadingPatients = true;
    $scope.hasPatients = false;


    var token = JSON.parse($cookies.user).token;

    $scope.username = JSON.parse($cookies.user).fullname;
    $scope.userId = JSON.parse($cookies.user).userid;

    $scope.patients = [];




    $scope.filteredPateints = [];

    $scope.getMonitor = function () {
        $scope.loadingPatients = true;
        $scope.hasPatients = false;




        $http.get(config_apiserver + '/api/users/' + myval + '/monitors', {
            headers: {
                'Authorization': token
            }
        }).
        then(function (response) {
            console.log(response.data, 'angular');
            $scope.patients = response.data;
            $scope.filteredPateints = response.data;
            $scope.totalItems = $scope.patients.length;

            $scope.loadingPatients = false;
            if (response.data.length > 0)
                $scope.hasPatients = true;
            else $scope.hasPatients = false;

            $scope.filteredPateints = $filter('filter')($scope.patients, $scope.filterPatient);
            $scope.totalItems = $scope.filteredPateints.length;

        }, function (response) {

            console.log(response, 'angular');
            $scope.loadingPatients = false;
            $scope.hasPatients = false;
        });

        $('#selectPrescriptionStatus').unbind('change').change(function () {
            angular.element('#patientsPaging>li:nth-child(2)>a').trigger('click');
        });


    }


    $scope.textColor = function (adherenceScore) {

        if (adherenceScore == 0)
            return '#e5e5e5';

        else if (adherenceScore >= 1 && adherenceScore <= 60)
            return '#de2121';

        else if (adherenceScore >= 61 && adherenceScore <= 70)
            return '#b0b0b0';

        else(adherenceScore >= 71 && adherenceScore <= 100)
        return '#2fb618';



    };



    $scope.adherenceTooltip = function (adherenceVariation) {

        if (adherenceVariation > 0)
            return 'Increased ' + adherenceVariation + '% in the last \n\n 10 days';

        else if (adherenceVariation < 0)
            return 'Decreased  ' + adherenceVariation.toString().replace('-', '') + '% in the last \n\n 10 days';

        else return 'Same over the last \n\n 10 days'

    };

    $scope.variationArrow = function (adherenceVariation) {

        if (adherenceVariation > 0)
            return 'fa-caret-up';

        else if (adherenceVariation < 0)
            return 'fa-caret-down';

        else return ''

    };


    $scope.getMonitor();








    $scope.doneRepeat = function () {

        $('.adherence').empty();
        $('.adherence').circliful();
        $("[data-toggle='tooltip']").tooltip();
    };

    $scope.pageSize = 20;
    $scope.currentPage = 1;
    $scope.totalItems = $scope.patients.length;

    $scope.$watch('filterPatient', function () {

        $scope.filteredPateints = $filter('filter')($scope.patients, $scope.filterPatient);
        $scope.totalItems = $scope.filteredPateints.length;

    });


});

app.filter('startFrom', function () {
    return function (data, start) {
        $('.adherence').empty();
        $('.adherence').circliful();
        $("[data-toggle='tooltip']").tooltip();
        return data.slice(start);
    }
});



app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
});


//app.directive("centered", function() {
//  return {
//		restrict : "ECA",
//		transclude : true,
//		template : "<div class=\"angular-center-container\">\
//						<div class=\"angular-centered\" ng-transclude>\
//						</div>\
//					</div>"
//	};
//});