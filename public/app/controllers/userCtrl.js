angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){

var app= this;

  this.regUser = function(regData) {
    app.loading = true;
    app.errorMsg = false;
    
    User.create(app.regData).then(function(data) {
      if (data.data.success) {
        app.loading = false;
        //Success message
        app.successMsg = data.data.message + '...Redirecting';
        //Homepage Redirect
        $timeout(function() {
          $location.path('/');
        }, 2500); //adds delay to redirect
      } else {
        //Create error Message
        app.loading = false;
        app.errorMsg = data.data.message;
      }
    });
  };
});
