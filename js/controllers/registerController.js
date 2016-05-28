angular.module('Rik')
.controller('registerController', ['$scope','$location', function($scope,$location){
    $scope.lexues;
    //kur klikoet butoni logohu
    $scope.occupations = ['Nxenes','Student','Pa Pune','Mjek','Mesues','Profesor','Mekanik','Inxhinjer','Ekonomist','Tjeter'];

    //krijo account
    $scope.createNewAccount = function() {
        console.log($scope.lexues);
        var jqxhr = $.post( "php/server.php",{new_user:$scope.lexues,command:'register'},function() {})
		.done(function(data) {
            if (data == 'success') {
                console.log(data);
                //you have created your account successfully
                 $location.path('/bibloteka');
            }
            else {
                alert('Dicka nuk eshte ne rregull, ju lutemi provoni pak me vone!');
            }
            $scope.$apply();
        });
    };
}])
