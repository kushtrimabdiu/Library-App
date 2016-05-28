angular.module('Rik')
.controller('accountController', ['$scope','$rootScope','$location','$mdSidenav','$mdDialog','$mdToast', function($scope,$rootScope,$location,$mdSidenav,$mdDialog,$mdToast){
    $scope.lexuesi;
    $scope.books;
    $scope.allMyBooks;
    $scope.total_books_read;
    $scope.total_page_read = 0;
    $scope.proffessions = ['Nxenes','Student','Pa Pune','Mjek','Mesues','Tjeter'];

    $scope.$on('$viewContentLoaded', function() {
        $scope.getSessionData();
        $scope.getAllMyBooksRead();
    });

    $scope.getSessionData = function() {
        var jqxhr = $.post( "php/server.php",{command:'get_session'},function() {})
        .done(function(data) {
            $scope.lexuesi = jQuery.parseJSON(data);
            if ($scope.lexuesi != null) {
                //$scope.getAllBooks();
                console.log($scope.lexuesi);
                $scope.logged_in = true;
            }
            else {
                $scope.logged_in = false;
            }
            $scope.$apply();
        });
    };
/*
    $scope.getAllBooks = function() {
        var jqxhr = $.post( "php/server.php",{command:'get_all_books'},function() {})
		.done(function(data) {
            var all_books = jQuery.parseJSON(data);
            $scope.books = all_books;
            $scope.$apply();
        });
    }; */

    $scope.updateAccount = function() {
        var jqxhr = $.post( "php/server.php",{user:$scope.lexuesi,command:'update_account'},function() {})
		.done(function(data) {
            if (data == 'success') {
                $scope.getSessionData();
                $mdToast.show($mdToast.simple().content('INFORMATAT U AZHURUAN!'));
                $scope.$apply();
            }
            else {
                alert("Dicka nuk eshte ne rregull, ju lutemi provoni prap!");
            }

        });
    };

    $scope.updatePassword = function() {
        var jqxhr = $.post( "php/server.php",{pwd:$scope.new_password,command:'update_password'},function() {})
		.done(function(data) {
            $scope.getSessionData();
            $mdToast.show($mdToast.simple().content('FJALKALIMI U AZHURUA!'));
            $scope.new_password = '';
            $scope.new_password_repeat = '';
            $scope.$apply();
        });
    };

    //get all the books the user has read
    $scope.getAllMyBooksRead = function ()
    {
        var jqxhr = $.post( "php/server.php",{command:'my_books'},function() {})
		.done(function(data) {
            $scope.allMyBooks = jQuery.parseJSON(data);
            var pages_read = 0;
            for (var i=0; i<$scope.allMyBooks.length; i++) {
                pages_read +=parseInt($scope.allMyBooks[i].pages);
            }
            $scope.total_page_read = pages_read;
            $scope.total_books_read = $scope.allMyBooks.length;
            console.log($scope.allMyBooks);
        });
    }

    $scope.goBack = function() {
        $location.path('/bibloteka');
    }

}]);
