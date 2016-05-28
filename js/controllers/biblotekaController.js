angular.module('Rik')
.controller('biblotekaController', ['$scope','$rootScope','$location','$mdSidenav','$mdDialog','$mdToast', function($scope,$rootScope,$location,$mdSidenav,$mdDialog,$mdToast){
    $scope.logged_in = true;
    $scope.username = "";
    $scope.password = "";
    $scope.wrong_password = false;
    $rootScope.books;
    $scope.total_books;
    $rootScope.lexuesi;

    $rootScope.side_menu_is_selected = false;
    //when page loads
    $scope.$on('$viewContentLoaded', function() {
        $rootScope.getSessionData();
    /*    if ($scope.logged_in) {
            $rootScope.getAllBooks();
        }
        else {
            $rootScope.getSessionData();
        } */
    });

    $rootScope.getSessionData = function() {
        var jqxhr = $.post( "php/server.php",{command:'get_session'},function() {})
        .done(function(data) {
            $rootScope.lexuesi = jQuery.parseJSON(data);
            console.log($rootScope.lexuesi);
            if ($rootScope.lexuesi != null) {
                if ($rootScope.lexuesi.payed_subscription == 0) {
                    $mdToast.show($mdToast.simple().content('ENDE NUK E KENI PAGUAR ANETARSIMIN!'));
                }
                $rootScope.getAllBooks();
                $scope.logged_in = true;
            }
            else {
                $scope.logged_in = false;
            }
            $scope.$apply();
        });
    };

    $scope.logMeIn = function() {
        $scope.wrong_password = false;
        var jqxhr = $.post( "php/server.php",{username:$scope.username,password:$scope.password,command:'authenticate'},function() {})
        .done(function(data) {
            if (data == 'success') {
                $scope.logged_in = true;
                $rootScope.getSessionData();
                $rootScope.getAllBooks();
            }
            else {
                $scope.wrong_password = true;
            }
            $scope.$apply();
        });
    };

    $scope.logMeOut = function() {
        var jqxhr = $.post( "php/server.php",{command:'logout'},function() {})
        .done(function(data) {
            $scope.logged_in = false;
            $location.path('/');
            $scope.$apply();
        });
    };

    //create account
    $scope.createAccount = function()
    {
        //redirect users to create account
        $location.path('/register')
    }

    function toggleUsersList() {
        $mdSidenav('left').toggle();
    }

    $rootScope.getAllBooks = function() {
        var jqxhr = $.post( "php/server.php",{command:'get_all_books'},function() {})
		.done(function(data) {
            var all_books = jQuery.parseJSON(data);
            $rootScope.books = all_books;
            $scope.total_books = $rootScope.books.length;
            $scope.$apply();
        });
    };

    //reserve book
    $scope.reserveBook = function(book_id) {
        //show a popup that will tell the user
        $mdDialog.show({
	      controller: reserveController,
	      templateUrl: 'views/rezervo.html',
	    })

	    function reserveController($scope) {
            $scope.all_books = $rootScope.books;
            $scope.selected_book_id = book_id;

            var now = new Date();
            now.setDate(now.getDate()+14);
            var string_now = now.toLocaleString();
            var split_array = string_now.split("T");
            $scope.return_date = split_array[0];
            $scope.confirmRegistration = function(book_id) {
                var jqxhr = $.post( "php/server.php",{book_id:book_id,command:'reserve_book'},function() {})
                .done(function(data) {
                    if (data == 'success') {
                        $mdToast.show($mdToast.simple().content('LIBRI U REZERVUA, MUND TE VINI TA MERRNI!'));
                        $rootScope.books = [];
                        $rootScope.getAllBooks();
                    }
                    else if (data == 'fail') {
                        alert('Dicka nuk eshte ne rregull, ju lutemi provoni prape!');
                    }
                    $mdDialog.cancel();
                    $scope.$apply();
                });
            }
            $scope.cancelReservation = function() {
                $mdDialog.cancel();
            }
        }
    };

    $scope.notifyMeWhenFree = function(book_id) {
        var jqxhr = $.post( "php/server.php",{book_id:book_id,command:'notify_me_on_book_return'},function() {})
        .done(function(data) {
            $mdToast.show($mdToast.simple().content('DO TE KONTAKTOHENI NE EMAILIN TUAJ :'+$rootScope.lexuesi.email+' KUR LIBRI DO TE JETE NE DISPOZICJON!'));
        });
    }

    $scope.toggleList = function() {
        $rootScope.side_menu_is_selected = true;
	    $mdSidenav('client_sidenav').toggle();
    };

    $scope.myAccount = function() {
       $location.path('/account');
    };

    $scope.showBookDetails = function(book_id) {
        $location.path('/book/'+book_id);
    };

    $scope.goBack = function() {
        $location.path('/');
    };


}])
// the directive of side-menu with waiter info
.directive('sideMenu', function(){
    return {
    	restrict:'E',
    	templateUrl:'views/side-menu.html',
    	controller: 'biblotekaController'
 	};
})
