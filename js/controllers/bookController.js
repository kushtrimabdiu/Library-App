angular.module('Rik')
.controller('bookController', ['$scope','$rootScope','$location','$mdSidenav','$mdDialog','$mdToast', function($scope,$rootScope,$location,$mdSidenav,$mdDialog,$mdToast){
    $scope.book;
    //on page load
    $scope.$on('$viewContentLoaded', function() {
        var paramValue = $location.path();
        var res = paramValue.split("/");
        var selected_book_id = res[2];
        //we have to get the item details
        $rootScope.getBookWithID(selected_book_id);
    });

    $rootScope.getBookWithID = function(book_id) {
        var jqxhr = $.post( "php/server.php",{book_id:book_id,command:'get_book_with_id'},function() {})
        .done(function(data) {
            $scope.book = jQuery.parseJSON(data);
            console.log($scope.book);
            $scope.$apply();
        });
    };

    $scope.goBack = function() {
        $location.path('/bibloteka');
    }

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
                        $rootScope.book = [];
                        var paramValue = $location.path();
                        var res = paramValue.split("/");
                        var selected_book_id = res[2];
                        //we have to get the item details
                        $rootScope.getBookWithID(selected_book_id);
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
            $mdToast.show($mdToast.simple().content('DO TE KONTAKTOHENI NE EMAILIN TUAJ KUR LIBRI DO TE JETE NE DISPOZICJON!'));
        });
    }

}]);
