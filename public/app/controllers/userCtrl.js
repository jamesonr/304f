angular.module('userControllers', [])

.controller('regCtrl', function($http){

var app= this;

  this.regUser = function(regData) {
  app.errorMsg = false;
  console.log('Form Submitted');
  $http.post('/api/users', this.regData).then(function(data) {
      console.log(data.data.success);
      console.log(data.data.message);
      if (data.data.success) {
        //Success message
        app.successMsg = data.data.message
        //Homepage Redirect
      }else {
        //Create error Message
        app.errorMsg = data.data.message;
      }
    });
  };
});
