var app = angular.module('researchApp', ['ui.bootstrap', 'ngCookies']);


app.controller('researchController', function ($scope, $http, $cookies, $filter) {

    $scope.loadingResearch = true;
    $scope.hasResearch = false;


    var token = JSON.parse($cookies.user).token;

    $scope.username = JSON.parse($cookies.user).fullname;
    $scope.userId = JSON.parse($cookies.user).userid;

    $scope.research = [];


    $scope.filteredResearch = [];

    $scope.getResearch = function () {
        $scope.loadingResearch = true;
        $scope.hasResearch = false;

        $http.get(config_apiserver + 'api/users/' + myval + '/research', {
            headers: {
                'Authorization': token
            }
        }).
        then(function (response) {
            console.log(response.data);
            console.log(config_apiserver + 'api/users/' + myval + '/research');

            $scope.research = response.data;
            $scope.filteredResearch = response.data;
            $scope.totalItems = $scope.research.length;

            $scope.loadingResearch = false;
            if (response.data.length > 0)
                $scope.hasResearch = true;
            else $scope.hasResearch = false;

            $scope.filteredResearch = $filter('filter')($scope.research, $scope.filterResearch);
            $scope.totalItems = $scope.filteredResearch.length;

        }, function (response) {

            console.log(response, 'angular-f');
            $scope.loadingResearch = false;
            $scope.hasResearch = false;
        });
    }


    $scope.getResearch();

//    $scope.researchDetails = function (researchId,source) {
//        console.log(source);
//        window.location = 'research-details?rid=' + researchId;
//    }

        $scope.doneRepeat = function () {
            $("[data-toggle='tooltip']").tooltip();
        };

    $scope.pageSize = 25;
    $scope.currentPage = 1;
    $scope.totalItems = $scope.research.length;

    $scope.$watch('filterResearch', function () {

        $scope.filteredResearch = $filter('filter')($scope.research, $scope.filterResearch);
        $scope.totalItems = $scope.filteredResearch.length;

    });


});

app.filter('startFrom', function () {
   
    return function (data, start) {

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
