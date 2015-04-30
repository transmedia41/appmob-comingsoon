// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('hydromerta', ['ionic', 'hydromerta.constants', 'hydromerta.controllers', 'hydromerta.auth', 'hydromerta.services'])

        .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
                $ionicConfigProvider.navBar.alignTitle('center');
            }])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })

        .run(function (StorageService, $rootScope, $state) {

            // Listen for the $stateChangeStart event of AngularUI Router.
            // This event indicates that we are transitioning to a new state.
            // We have the possibility to cancel the transition in the callback function.
            $rootScope.$on('$stateChangeStart', function (event, toState) {

                // If the user is not logged in and is trying to access another state than "login"...
                if (!StorageService.wsToken && toState.name !== 'login' && toState.name !== 'register') {

                    // ... then cancel the transition and go to the "login" state instead.
                    event.preventDefault();
                    $state.go('login');
                }
            });


        })

        .run(function ($rootScope, $location, StorageService) {
           
            $rootScope.$on('disconnected', function (event) {
                console.log('disconnected')
                StorageService.setLastDisconnect(Date.now())
//                $rootScope.gameBar = false
//                localStorageService.remove('currentPage')
                $location.path('/login')
            })
        })