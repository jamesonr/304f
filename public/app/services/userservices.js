angular.module('userServices', [])

  .factory('User', function($http) {
    var userFactory = {}; // Create the userFactory object

    // Register users in database
    userFactory.create = function(regData) {
      return $http.post('/api/users', regData);
    };

    // Check if username is available at registration
    userFactory.checkUsername = function(regData) {
      return $http.post('/api/checkusername', regData);
    };

    // Check if e-mail is available at registration
    userFactory.checkEmail = function(regData) {
      return $http.post('/api/checkemail', regData);
    };
    // Provide the user with a new token
    userFactory.renewSession = function(username) {
      return $http.get('/api/renewToken/' + username);
    };

    // Get the current user's permission
    userFactory.getPermission = function() {
      return $http.get('/api/permission/');
    };

    // Get all the users from database
    userFactory.getUsers = function() {
      return $http.get('/api/management/');
    };

    // Get user to then edit
    userFactory.getUser = function(id) {
      return $http.get('/api/edit/' + id);
    };

    // Delete a user
    userFactory.deleteUser = function(username) {
      return $http.delete('/api/management/' + username);
    };

    // Edit a user
    userFactory.editUser = function(id) {
      return $http.put('/api/edit', id);
    };

    return userFactory;
  });
