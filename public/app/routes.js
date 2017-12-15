var app = angular.module('appRoutes', ['ngRoute'])

  // Configure Routes; 'authenticated = true' means the user must be logged in to access the route
  .config(function($routeProvider, $locationProvider) {

    // AngularJS Route Handler
    $routeProvider

      // Route: Home
      .when('/', {
        templateUrl: 'app/views/pages/home.html'
      })

      // Route: TO TEST
      .when('/about', {
        templateUrl: 'app/views/pages/about.html'
      })

      // Route: User Registration
      .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
      })

      // Route: User Login
      .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
      })

      // Route: User Profile
      .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
      })

      // Route: Manage User Accounts
      .when('/management', {
        templateUrl: 'app/views/pages/management/management.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin', 'moderator']
      })

      // Route: Edit a User
      .when('/edit/:id', {
        templateUrl: 'app/views/pages/management/edit.html',
        controller: 'editCtrl',
        controllerAs: 'edit',
        authenticated: true,
        permission: ['admin', 'moderator']
      })

      // Route: Search Database Users
      .when('/search', {
        templateUrl: 'app/views/pages/management/search.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin', 'moderator']
      })

      .otherwise({
        redirectTo: '/'
      }); // redirects user to other page if they try to connect to different address

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }); // removes angular hash
  });

// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

  // Check each time route changes
  $rootScope.$on('$routeChangeStart', function(event, next, current) {

    // happens when user visits route
    if (next.$$route !== undefined) {
      // Checks for authentication needed
      if (next.$$route.authenticated === true) {
        if (!Auth.isLoggedIn()) {
          event.preventDefault(); // If not logged in, prevent accessing route
          $location.path('/');
        } else if (next.$$route.permission) {
          // Function: Get current user's permission to see if authorized on route
          User.getPermission().then(function(data) {
            // Check if user's permission matches at least one in the array
            if (next.$$route.permission[0] !== data.data.permission) {
              if (next.$$route.permission[1] !== data.data.permission) {
                event.preventDefault(); // If at least one role does not match, prevent accessing route
                $location.path('/'); // Redirect to home instead
              }
            }
          });
        }
      } else if (next.$$route.authenticated === false) {
        // If authentication is not required, make sure is not logged in
        if (Auth.isLoggedIn()) {
          event.preventDefault(); // Logged user cannot access
          $location.path('/profile');
        }
      }
    }
  });
}]);
