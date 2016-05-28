var app = angular.module('Rik', ['ui.router','ngMaterial','ngMdIcons'])
.config(function($urlRouterProvider,$stateProvider,$mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('red');

  $urlRouterProvider.otherwise('/');
  $stateProvider
  /*
    .state('home', {
      url:'/',
      templateUrl:'templates/home.html',
      controller: 'homeController'
    })
    .state('bibloteka', {
        url:'/bibloteka',
        templateUrl:'templates/bibloteka.html',
        controller: 'biblotekaController'
    }) */
    .state('bibloteka', {
        url:'/',
        templateUrl:'templates/bibloteka.html',
        controller: 'biblotekaController'
    })
    .state('admin', {
        url:'/admin',
        templateUrl:'templates/admin.html',
        controller: 'adminController'
    })
    .state('register', {
        url:'/register',
        templateUrl:'templates/register.html',
        controller: 'registerController'
    })
   .state('account', {
        url:'/account',
        templateUrl:'templates/account.html',
        controller: 'accountController'
    })
    .state('book', {
         url:'/book/:id',
         templateUrl:'templates/book.html',
         controller: 'bookController'
     })

});

app.controller('AppCtrl', ['$scope','$rootScope','$location', function($scope,$rootScope,$location){

}]);
