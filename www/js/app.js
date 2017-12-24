// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('eventops', ['ionic', 'eventops.controllers', 'eventops.services', 'ngCordova'])
  .run(function ($ionicPlatform, $rootScope, $ionicLoading) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app.html',
        controller: 'AppCtrl'
      })
      .state('app.home', {
        url: '/home',
        views: {
          'mainContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          'mainContent': {
            templateUrl: 'templates/login.html',
            controller: 'UserController'
          }
        }
      })
      .state('app.register', {
        url: '/register',
        views: {
          'mainContent': {
            templateUrl: 'templates/register.html',
            controller: 'UserController'
          }
        }
      })
      .state('app.find', {
        url: '/find',
        views: {
          'mainContent': {
            templateUrl: 'templates/find.html',
            controller: 'FindController'
          }
        }
      })
      .state('app.userevents', {
        url: '/userevents',
        views: {
          'mainContent': {
            templateUrl: 'templates/userevents.html',
            controller: 'UserEventController'
          }
        }
      })
      .state('app.userrequests', {
        url: '/userrequests',
        views: {
          'mainContent': {
            templateUrl: 'templates/userrequests.html',
            controller: 'UserRequestController'
          }
        }
      })
      .state('app.editevent', {
        url: '/editevent/:id',
        views: {
          'mainContent': {
            templateUrl: 'templates/editEvent.html',
            controller: 'EditEventController'
          }
        }
      })
      .state('app.locationpicker', {
        url: '/locationPicker/:lat/:lng',
        views: {
          'mainContent': {
            templateUrl: 'templates/locationPicker.html',
            controller: 'LocationPickerController'
          }
        }
      })
      .state('app.eventmap', {
        url: '/eventmap',
        views: {
          'mainContent': {
            templateUrl: 'templates/eventMap.html',
            controller: 'EventMapController'
          }
        }
      })
      .state('app.contactpicker', {
        url: '/contactPiker/',
        views: {
          'mainContent': {
            templateUrl: 'templates/contactPicker.html',
            controller: 'ContactPickerController'
          }
        }
      }
      )
      .state('app.eventdetails', {
        url: '/eventdetails/:id',
        views: {
          'mainContent': {
            templateUrl: 'templates/eventView.html',
            controller: 'EventDetailsController'
          }
        }
      }
      )

    $urlRouterProvider.otherwise('/app/login');
  })

