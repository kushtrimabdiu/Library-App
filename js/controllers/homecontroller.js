angular.module('Rik')
.controller('homeController', ['$scope','$location', function($scope,$location){
    //kur klikoet butoni logohu
    $scope.logohu = function() {
        $location.path("/bibloteka");
    }
    
}])
.directive('couroselView', function(){
    return {
        restrict:'E',
        templateUrl:'views/courosel-view.html',
        controller: function() {
        }
    };
})