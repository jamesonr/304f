//main config file
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices'])

  //configures app to intercept all https with AuthInterceptors factory which assigns token to header
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
  });
