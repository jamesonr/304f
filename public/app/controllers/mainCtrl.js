angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location) {
  var app = this;

    this.doLogin = function(loginData) {

      app.loading = true;
      app.errorMsg = false;
      app.successMsg = false;

      Auth.login(app.loginData).then(function(data) {

        if (data.data.success) {

          app.loading = false;
          //Success message
          app.successMsg = data.data.message + '...Redirecting';
          //Homepage Redirect
          $timeout(function() {
            $location.path('/about');
          }, 2500); //adds delay to redirect
          
        } else {
          //Create error Message
          app.loading = false;
          app.errorMsg = data.data.message;
        }
      });
    };
  });
