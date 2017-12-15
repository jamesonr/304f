angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'managementController'])

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
  });
