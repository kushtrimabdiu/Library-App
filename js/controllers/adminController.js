angular.module('Rik')
.controller('adminController', ['$scope','$rootScope','$location','$mdSidenav','$mdDialog','$mdToast', function($scope,$rootScope,$location,$mdSidenav,$mdDialog,$mdToast){

    $scope.logged_in = false;
    $scope.username;
    $scope.password;
    $scope.wrong_password = false;
    $scope.admin;
    $rootScope.books;
    $scope.total_books;
    $scope.total_hired_books;
    $scope.all_users
    $scope.members_option = ['Antarsi te paguar','Antarsi te pa paguar'];
    //statistika
    $scope.statistics;

    //onload
    $scope.$on('$viewContentLoaded', function() {
        $scope.getAdminSessionInfo();
        $scope.adminStatistics();
        $scope.getAllUsers();
        //var myDropzone = new Dropzone("my-awesome-dropzone", { url: "/file/post"});
    });

    $scope.logMeInAsAdmin = function() {
        var jqxhr = $.post( "php/server.php",{usr:$scope.username,pwd:$scope.password,command:'authenticate_admin'},function() {})
        .done(function(data) {
            if (data == 'success') {
                $scope.getAdminSessionInfo();
                $scope.wrong_password = false;
                $scope.logged_in = true;
            }
            else {
                $scope.wrong_password = true;
                $scope.logged_in = false;
            }
            $scope.$apply();
        });
    };

    //go back
    $scope.goBack = function() {
        $location.path('/');
    };

    $scope.getAdminSessionInfo = function() {
        var jqxhr = $.post( "php/server.php",{usr:$scope.username,pwd:$scope.password,command:'admin_session'},function() {})
        .done(function(data) {
            $scope.admin = jQuery.parseJSON(data);
            if ($scope.admin != null) {
                $rootScope.getAllBooks();
                $scope.logged_in = true;
            }
            else {
                $scope.logged_in = false;
            }

            $scope.$apply();
        });
    };

    $scope.logMeOut = function() {
        var jqxhr = $.post( "php/server.php",{command:'admin_logout'},function() {})
        .done(function(data) {
            $location.path('/');
            $scope.$apply();
        });
    };

    $rootScope.getAllBooks = function() {
        var jqxhr = $.post( "php/server.php",{command:'get_all_books_for_admin'},function() {})
		.done(function(data) {
            var all_books = jQuery.parseJSON(data);
            console.log(all_books);
            $rootScope.books = all_books;
            $scope.total_books = $rootScope.books.length;
            $scope.$apply();
        });
    };

    $scope.reserveBookForUser = function(book_id) {
        //show popup to get the user
        $mdDialog.show({
          controller: reserveController,
          templateUrl: 'views/pick_user.html',
        })

        function reserveController($scope) {
            $scope.selected_book_id = book_id;
            var jqxhr = $.post( "php/server.php",{book_id:book_id,command:'get_all_users'},function() {})
            .done(function(data) {
                $scope.all_users = jQuery.parseJSON(data);
            });

            $scope.selectUser = function(user_id) {
                var jqxhr = $.post( "php/server.php",{book_id:$scope.selected_book_id,user_id:user_id,command:'huazo_librin'},function() {})
                .done(function(data) {
                    $rootScope.books = [];
                    $rootScope.getAllBooks();
                    $mdDialog.cancel();
                    $scope.$apply();
                });
            };
            /*
            $scope.confirmRegistration = function(book_id) {
                var jqxhr = $.post( "php/server.php",{book_id:book_id,command:'get_all_users'},function() {})
                .done(function(data) {
                    $scope.all_users = jQuery.parseJSON(data);
                    console.log('this is all the users');
                    console.log($scope.all_users);
                });
            } */
            $scope.exitDialog = function() {
                $mdDialog.cancel();
            }
        }
    };

    $scope.returnBook = function(loan_id,book_id) {
        var jqxhr = $.post( "php/server.php",{loan_id:loan_id,book_id:book_id,command:'return_book'},function() {})
        .done(function(data) {
            $rootScope.books = [];
            $rootScope.getAllBooks();
            $rootScope.statistics = [];
            $scope.adminStatistics();
            $scope.$apply();
        });
    };

    $scope.bookPickedUp = function(loan_id)
    {
        var jqxhr = $.post( "php/server.php",{loan_id:loan_id,command:'book_picked_up'},function() {})
        .done(function(data) {
            if (data == 'success') {
                $rootScope.books = [];
                $rootScope.getAllBooks();
            }
            else {
                alert('Dicka nuk shkoi mire, ju lutem provoni prap!');
            }

            $scope.$apply();
        });
    }

    $scope.adminStatistics = function() {
        var jqxhr = $.post( "php/server.php",{command:'admin_statistics'},function() {})
        .done(function(data) {
            $scope.statistics = jQuery.parseJSON(data);
            $scope.$apply();
        });
    };

    $scope.getAllUsers = function() {
        var jqxhr = $.post( "php/server.php",{command:'get_all_users'},function() {})
        .done(function(data) {
            $scope.all_users = jQuery.parseJSON(data);
        });
    };

    $scope.paySubscription = function(user_id) {
        var jqxhr = $.post( "php/server.php",{user_id:user_id,command:'pay_subscription'},function() {})
        .done(function(data) {
            if (data == 'success') {
                $scope.all_users = [];
                $scope.getAllUsers();
            }
            else {
                alert("Dicka nuk eshte ne rregull, ju lutemi provoni edhe nje here!");
            }
            $scope.$apply();

        });
    };

    $scope.addNewBook = function() {
        console.log($scope.new_book);
        var jqxhr = $.post( "php/server.php",{new_book:$scope.new_book,command:'add_new_book'},function() {})
        .done(function(data) {
            if (data == 'success') {
                $scope.new_book = [];
                $mdToast.show($mdToast.simple().content('LIBRI U SHTUA, NGARO FOTON E KOVERIT TE FOLDERI!'));
                $rootScope.books = [];
                $rootScope.getAllBooks();
            }
            else {
                alert("Dicka nuk eshte ne rregull, ju lutemi provoni edhe nje here!");
            }
            $scope.$apply();

        });
    };


}]);
