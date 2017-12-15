angular.module('mainController', ['authServices'])
  //Main controller runs things that should run on every page
  .controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval, $route) {
    var app = this;
    app.loadme = false; //hides html until data obtained by angular

    app.checkSession = function() {
      if (Auth.isLoggedIn()) {
        app.checkingSession = true;
        var interval = $interval(function() {
          var token = $window.localStorage.getItem('token');
          if (token === null) {
            $interval.cancel(interval);
          } else {
            //grabs time stamp
            self.parseJwt = function(token) {
              var base64Url = token.split('.')[1];
              var base64 = base64Url.replace('-', '+').replace('_', '/');
              return JSON.parse($window.atob(base64));
            }
            //converts time stamp
            var expireTime = self.parseJwt(token);
            var timeStamp = Math.floor(Date.now() / 1000);
            console.log(expireTime.exp);
            console.log(timeStamp);
            var timeCheck = expireTime.exp - timeStamp;
            console.log('timecheck: ' + timeCheck);
            if (timeCheck <= 10) {
              console.log('token has expired');
              showModal(1);
              $interval.cancel(interval);
            } else {
              console.log('token not yet expired');
            }
          }
        }, 2000); //running timestamp interval every 2 secs
      }

    };

    app.checkSession();

    var showModal = function(option) {
      app.choiceMade = false;
      app.modalHeader = undefined;
      // app.modalBody = false;
      app.hideButton = false;

      if (option === 1) {
        app.modalHeader = 'Timeout Warning';
        app.modalBody = 'Your session will expire in 5 minutes. Would you like to renew?';
        $("#myModal").modal({
          backdrop: "static"
        });
      } else if (option === 2) {
        //logout portion
        app.hideButton = true;
        app.modalHeader= 'Logging Out';
        $("#myModal").modal({
          backdrop: "static"
        });
        $timeout(function{
            Auth.logout();
            $location.path('/');
            $route.reload();
        }, 2000);
      }
      $timeout(function() {
        if (!app.choiceMade) {
          console.log('Logged Out');
          hideModal();
        }
      }, 4000);
    };

    app.renewSession = function() {
      app.choiceMade = true;
      console.log('session has been renewed');
      hideModal();
    };
    app.endSession = function() {
      app.choiceMade = true;
      console.log('session has ended');
      hideModal();
    };
    var hideModal = function() {
      $("#myModal").modal('hide');
    };
    $rootScope.$on('$routeChangeStart', function() {

      if (!app.checkSession) app.checkSession();

      if (Auth.isLoggedIn()) {
        console.log('Sucess: user logged in');
        app.isLoggedIn = true;
        Auth.getUser().then(function(data) {
          console.log(data.data.username);
          app.username = data.data.username;
          app.useremail = data.data.email;
          app.loadme = true;
        });
      } else {
        console.log('Failure: user not logged in');
        app.isLoggedIn = false;
        app.username = ''; //to clear name when logged out
        app.loadme = true;
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
    // Logout user
    app.logout = function() {
      showModal(2);
    };
  });
