angular.module('mainController', ['authServices'])

  .controller('mainCtrl', function(Auth, $timeout, $location, $rootScope) {
    var app = this;

    $rootScope.$on('$routeChangeStart', function() {
      if (Auth.isLoggedIn()) {
        console.log('Sucess: user logged in');
        Auth.getUser().then(function(data) {
          console.log(data.data.username);
          app.username = data.data.username;
        });
      } else {
        console.log('Failure: user not logged in');
        app.username = ''; //to clear name when logged out
      }
    });



    this.doLogin = function(loginData) {
      app.loading = true;
      app.errorMsg = false;

      Auth.login(app.loginData).then(function(data) {
        if (data.data.success) {
          app.loading = false;
          //Success message
          app.successMsg = data.data.message + '...Redirecting';
          //Homepage Redirect
          $timeout(function() {
            $location.path('/about');
            app.loginData = '';
            app.successMsg = false;
          }, 2500); //adds delay to redirect

        } else {
          //Create error Message
          app.loading = false;
          app.errorMsg = data.data.message;
        }
      });
    };
    this.logout = function() {
      Auth.logout();
      $location.path('/logout');
      $timeout(function() {
        $location.path('/');
      }, 2500);
    };
  });
