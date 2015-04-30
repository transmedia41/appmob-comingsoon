angular.module('hydromerta.auth', ['angular-storage', 'hydromerta.services'])



        .service('HTTPAuhtService', function ($http, StorageService) {

            return {
                login: function (data) {
                    return $http.post('http://localhost:3000/login', data)
                },
                logout: function () {
                    var data = {}
                    var t = StorageService.wsToken;
                    if (t) {
                        data = {
                            token: t
                        }
                    }
                    return $http.post('http://localhost:3000/logout', data)
                },
                register: function (data) {
                    return $http.post('http://localhost:3000/register', data)
                }

            }

        })

        .controller('loginController', function ($rootScope, $scope, HTTPAuhtService, SocketService, $state, StorageService) {
            $scope.user = {};


            function logFunc(data) {
                HTTPAuhtService.login(data).
                        success(function (data, status, headers, config) {
                            SocketService.connect(data.token).on('connect', function () {
//                                localStorageService.set('currentPage', 'actions')
                                $state.go("map");
                            })
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        })
            }

            $scope.loginFunc = function () {
                var data = {
                    username: $scope.user.username,
                    password: $scope.user.password
                }
                logFunc(data)
            }
            $rootScope.$on('register', function (e, data) {
                logFunc(data)
            })

            $scope.logoutFunc = function () {
                    var t = StorageService.wsToken;
                    if (t) {
                        HTTPAuhtService.logout().
                                success(function (data, status, headers, config) {
                                     $state.go('login');
                                }).
                                error(function (data, status, headers, config) {
                                    // ...
                                })
                    }
                
            }

        })


        .controller('registerController', function ($rootScope, $scope, HTTPAuhtService, $state) {
            $scope.user = {};
            $scope.goToLogin = function () {
                $state.go('login');
            }
            $scope.registerFunc = function () {
                if ($scope.user.password === $scope.user.confirm) {
                    var dataReg = {
                        username: $scope.user.username,
                        password: $scope.user.password
                    }
                    HTTPAuhtService.register(dataReg).
                            success(function (data, status, headers, config) {
                                $rootScope.$emit('register', dataReg)
                            }).error(function (data, status, headers, config) {
                    })
                } else {
                    console.log('invalide confirm password')
                }
            }
            $scope.login = true;

        })