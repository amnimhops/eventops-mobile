angular.module('eventops.controllers', [])
    .controller('AppCtrl', function ($scope, storage, $state, geolocation) {
        if (storage.get('user') == null) {
            $state.go('app.login');
        }

       /* $cordovaToast
            .show('Here is a message', 'long', 'center')
            .then(function (success) {
                // success
            }, function (error) {
                // error
            });*/

    })
    .controller('HomeController', function ($scope) {

    })
    .controller('UserController', function ($scope, $ionicPopup, $state, $ionicLoading, storage, stateFactory, userFactory, eventFactory) {
        $scope.loginform = { email: 'manuel.lillo@gmail.com', password: 'fubarbaz' };
        $scope.registerform = { email: null, name: null, city: null, password: null, location: [0, 0] };


        $scope.login = function () {
            $ionicLoading.show();
            userFactory
                .authenticate($scope.loginform.email, $scope.loginform.password)
                .getUser("me")
                .then((user) => {
                    stateFactory.user = { email: $scope.loginform.email, password: $scope.loginform.password }
                    stateFactory.userProfile = user;
                    $ionicLoading.hide();
                    $state.go("app.userevents");
                })
                .catch((err) => {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        template: 'Error during login. Server says:' + err.data,
                        title: 'Login error',
                        scope: $scope,
                        buttons: [{
                            text: 'Bad luck',
                            type: 'button-assertive',
                            onTap: function (e) { console.log('cerrando') }
                        }]
                    }).then((res) => {
                        console.log('cerrado', res);
                    })
                })
        }
        $scope.goRegister = function () {
            $state.go("app.register");
        }
        $scope.register = function () {
            $ionicLoading.show();
            userFactory
                .authenticate(null, null)
                .newUser({
                    name: $scope.registerform.name,
                    email: $scope.registerform.email,
                    password: $scope.registerform.password,
                    city: $scope.registerform.city,
                    location: $scope.registerform.location
                })
                .then((success) => {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        template: 'Registered successfully',
                        title: 'Registration end',
                        scope: $scope,
                        buttons: [{
                            text: 'Continue',
                            type: 'button-positive',
                            onTap: function (e) { console.log('cerrando') }
                        }]
                    }).then((res) => {
                        $state.go("app.login");
                    })
                })
                .catch((err) => {
                    $ionicLoading.hide();
                    $ionicPopup.show({
                        template: 'Error during login. Server says:' + err.data,
                        title: 'Login error',
                        scope: $scope,
                        buttons: [{
                            text: 'Bad luck',
                            type: 'button-assertive',
                            onTap: function (e) { console.log('cerrando') }
                        }]
                    }).then((res) => {
                        console.log('cerrado', res);
                    })
                })
        }
    })
    .controller('FindController', function ($scope) {
        console.log('ffff')
    })
    .controller('UserRequestController', function ($scope, $state, $ionicLoading, $stateParams, stateFactory, requestFactory) {
        $scope.sentRequests = [];
        $scope.receivedRequests = [];

        $scope.swiped = function () {
            console.log('swuiiiiii')
        }

        $scope.deleteRequest = function (e) {
            $ionicLoading.show();
            requestFactory.delete(e._id)
                .then((success) => {
                    $scope.load();
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    $ionicLoading.hide();
                })
        }
        $scope.changeAcceptance = function (r) {
            // Note that the toggle has a ng-model that already changes the value of accepted
            $ionicLoading.show();
            requestFactory.acceptRequest(r._id, r.accepted)
                .then((success) => {
                    $scope.load();
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    $ionicLoading.hide();
                })
        }
        $scope.load = function (cb) {
            requestFactory
                .authenticate(stateFactory.user.email, stateFactory.user.password)
                .search({})
                .then((requests) => {
                    console.log(requests);
                    $scope.sentRequests = [];
                    $scope.receivedRequests = [];

                    requests.forEach((r) => {
                        if (r.user._id == stateFactory.userProfile._id) {
                            $scope.receivedRequests.push(r);
                        }
                        if (r.sender._id == stateFactory.userProfile._id) {
                            $scope.sentRequests.push(r);
                        }
                    });
                })
                .catch((err) => {
                    $scope.requests = [];

                })
                .finally(() => {
                    $ionicLoading.hide();
                    if (cb) {
                        cb();
                    }
                });
        }

        $scope.refresh = function () {
            $scope.load(() => {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        // Loaded to see the event list
        $scope.load();

    })
    .controller('UserEventController', function ($scope, $state, $ionicLoading, $stateParams, stateFactory, eventFactory, contactService, $ionicPopup, requestFactory) {
        requestFactory.authenticate(stateFactory.user.email, stateFactory.user.password);

        $scope.swiped = function () {
            console.log('swuiiiiii')
        }
        $scope.edit = function (e) {
            $state.go('app.editevent', { id: e._id })
        }

        $scope.sendRequest = function (e) {
            contactService.callback = function (contacts) {
                var emails = [];
                for (var i in contacts) {
                    if (contacts[i].emails && contacts[i].emails.length > 0) {
                        emails.push(contacts[i].emails[0]);
                    }
                }

                // Send
                console.log(emails);
                requestFactory.newRequest({ eventId: e._id, emails: emails })
                    .then((success) => {
                        $ionicPopup.show({
                            template: emails.length + " requests sent",
                            title: 'Allright',
                            scope: $scope,
                            buttons: [{
                                text: 'Okay',
                                type: 'button-calm',
                                onTap: function (e) { console.log('cerrando') }
                            }]

                        }).then((res) => {
                            console.log('cerrado', res);
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            $state.go('app.contactpicker');
        }

        $scope.delete = function (e) {
            $ionicLoading.show();
            eventFactory.delete(e._id)
                .then((success) => {
                    $scope.load();
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    $ionicLoading.hide();
                })
        }

        $scope.load = function (cb) {
            eventFactory
                .authenticate(stateFactory.user.email, stateFactory.user.password)
                .search({ search: 'own' })
                .then((events) => {
                    $scope.events = events;
                })
                .catch((err) => {
                    $scope.events = [];

                })
                .finally(() => {
                    $ionicLoading.hide();
                    if (cb) {
                        cb();
                    }
                });
        }

        $scope.refresh = function () {
            $scope.load(() => {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        // Loaded to see the event list
        $scope.load();

    })
    .controller('EditEventController', function ($scope, $ionicPlatform, $state, $ionicLoading, $ionicPopover, $stateParams, stateFactory, eventFactory, geolocation, mapService, categoryFactory) {
        categoryFactory.authenticate(stateFactory.user.email, stateFactory.user.password);

        $scope.event = null;
        $scope.dates = {
            start: null,
            end: null
        }
        $scope.categories = [];

        // If $stateParams.id is undefined
        // we should prepare an empty event
        if (!$stateParams.id) {
            $scope.event = {
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                name: '',
                description: '',
                location: [0, 0],
                address: null,
                category: null
            }
        } else {
            // Load specified event
            $ionicLoading.show();
            eventFactory
                .getEvent($stateParams.id)
                .then((event) => {
                    if (!event.location || event.location.length == 0) {
                        var defloc = geolocation.defaultLocation();
                        event.location = [
                            defloc.longitude,
                            defloc.latitude
                        ]
                    }

                    $scope.event = event;
                    $scope.dates.start = new Date(event.start);
                    $scope.dates.end = new Date(event.end);

                    return categoryFactory.all();
                })
                .then((categories) => {
                    $scope.categories = categories;
                    // Replace the scope event for the one in this list
                    // This way the model is correctly viewed
                    $scope.categories.forEach((c) => {
                        if ($scope.event.category._id == c._id) {
                            $scope.event.category = c;
                        }
                    });

                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    $ionicLoading.hide();
                })
        }

        $scope.findInMap = function () {
            mapService.callback = function (pos) {
                $scope.event.location = [pos.lng(), pos.lat()];
                geolocation.getAddress(pos)
                    .then((addr) => {
                        $scope.event.address = addr;
                        $scope.$apply();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }


            $state.go('app.locationpicker', {
                lat: $scope.event.location[1],
                lng: $scope.event.location[0]
            });

        }

        $scope.getGPSCoords = function () {
            return geolocation.findMe().then((loc) => {
                $scope.event.location = [loc.coords.longitude, loc.coords.latitude];
                var latlng = new google.maps.LatLng(loc.latitude, loc.longitude);
                geolocation.getAddress(latlng)
                    .then((addr) => {
                        $scope.event.address = addr;
                        $scope.$apply();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });
        }

        $scope.share = function(event){
            contactService.callback = function (contacts) {
                var emails = [];
                for (var i in contacts) {
                    if (contacts[i].emails && contacts[i].emails.length > 0) {
                        emails.push(contacts[i].emails[0]);
                    }
                }

                // Send
                console.log(emails);
                shareFactory
                .authenticate(stateFactory.user.email, stateFactory.user.password)
                .send({ eventId: event._id, emails: emails })
                    .then((success) => {
                        $ionicPopup.show({
                            template: emails.length + " emails sent",
                            title: 'Allright',
                            scope: $scope,
                            buttons: [{
                                text: 'Okay',
                                type: 'button-calm',
                                onTap: function (e) { console.log('cerrando') }
                            }]

                        }).then((res) => {
                            console.log('cerrado', res);
                        })
                    })
                    .catch((error) => {
                        $ionicPopup.show({
                            template: error.data,
                            title: 'Error',
                            scope: $scope,
                            buttons: [{
                                text: 'Okay',
                                type: 'button-assertive',
                                onTap: function (e) { console.log('cerrando') }
                            }]

                        }).then((res) => {
                            console.log('cerrado', res);
                        })
                    });
            }
            
            $state.go('app.contactpicker');
        }

        $scope.done = function () {
            // setup the dates
            $scope.event.start = $scope.dates.start.toISOString().split("\.")[0];
            $scope.event.end = $scope.dates.end.toISOString().split("\.")[0];
            // Remove the category object from the event
            // The server API expects an id instead of an object
            var category = $scope.event.category;
            $scope.event.category = category._id;
            var promise = null;

            $ionicLoading.show();

            if (!$scope.event._id) {
                // create
                promise = eventFactory.newEvent($scope.event)
            } else {
                promise = eventFactory.updateEvent($scope.event._id, $scope.event);
            }

            promise.then((success) => {
                console.log(success);
                // Give the category object back to the event
                $scope.event.category = category;
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                $ionicLoading.hide();
            })
        }
    })
    .controller('LocationPickerController', function ($scope, $stateParams, $ionicLoading, $ionicHistory, geolocation, mapService) {
        var lat = $stateParams.lat;
        var lng = $stateParams.lng;
        var latlng = new google.maps.LatLng(lat, lng);
        var cfg = {
            center: latlng,
            zoom: 18
        };
        // Setup map
        var map = new google.maps.Map(document.getElementById('location-picker-map'), cfg);
        google.maps.event.addListener(map, 'idle', function () {
            console.log('ya');
        })
        var marker = new google.maps.Marker({
            position: latlng,
            title: 'Event location',
            map: map,
            draggable: true
        });

        $scope.gotoGPS = function () {
            $ionicLoading.show();
            geolocation.findMe().then((loc) => {
                var center = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
                map.setCenter(center);
                //marker.setPosition(center);
                $ionicLoading.hide();
            })
        }
        $scope.setLocationToCenter = function () {
            marker.setPosition(map.getCenter());
        }
        $scope.done = function () {
            $ionicHistory.goBack();
        }
        // Setup back listener
        $scope.$on('$ionicView.leave', function () {
            if (mapService.callback) mapService.callback(marker.getPosition());
        });
    })

    .controller('ContactPickerController', function ($scope, $stateParams, $ionicLoading, $ionicHistory, contactService) {
        $scope.contacts = [];
        $scope.selection = {};

        contactService.find().then((contacts) => {
            $scope.contacts = contacts;
            contacts.forEach((e) => {
                $scope.selection[e.id] = false;
            });
        }).catch((err) => {
            console.error(err)
        });

        $scope.isSelected = function (c) {
            return $scope.selection[c.id] !== undefined;
        }

        $scope.select = function (c) {
            $scope.selection[c.id] = c;
        }

        // Setup back listener
        $scope.$on('$ionicView.leave', function () {
            if (contactService.callback) {
                var sel = [];
                for (var i in $scope.contacts) {
                    if ($scope.selection[$scope.contacts[i].id] == true) {
                        sel.push($scope.contacts[i]);
                    }
                }

                contactService.callback(sel);
            }
        });

    })
    .controller('EventMapController', function ($scope, $stateParams,$state, $ionicLoading, geolocation, eventFactory, stateFactory) {
        $ionicLoading.show();

        $scope.distance = {
            value: 50,
            min: 20,
            max: 50000
        };
        $scope.markers = [];
        $scope.circle = null;
        $scope.updateDistance = function () {
            $scope.circle.setRadius(parseInt($scope.distance.value));
            $scope.searchEvents();
        }
        $scope.moment = moment;
        var cfg = {
            center: new google.maps.LatLng(0, 0),
            zoom: 18
        };
        // Setup map
        $scope.map = new google.maps.Map(document.getElementById('nearby-events-map'), cfg);

        // Find user's location
        geolocation.findMe().then((loc) => {
            $scope.map.setCenter(new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude));
        })
            .catch((err) => {
                var loc = geolocation.defaultLocation();
                $scope.map.setCenter(new google.maps.LatLng(loc.latitude, loc.longitude));
            }).finally(() => {
                $scope.circle = new google.maps.Circle({
                    strokeColor: '#00bc8c',
                    strokeOpacity: 0.3,
                    strokeWeight: 2,
                    fillColor: '#00bc8c',
                    fillOpacity: 0.2,
                    map: $scope.map,
                    center: $scope.map.getCenter(),
                    radius: $scope.distance.value
                });
                google.maps.event.addListener($scope.map, 'dragend', function (event) {
                    // Move the circle to the new center
                    $scope.circle.setCenter($scope.map.getCenter());
                    $scope.searchEvents();
                });

                eventFactory.authenticate(stateFactory.user.email, stateFactory.user.password)

                $scope.searchEvents();
                    
            });

        $scope.getDistanceForZoomLevel = function (zoom) {
            return zoom * 10;
        }
        $scope.gotoGPS = function () {
            geolocation.findMe().then((loc) => {
                
                var center = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
                $scope.map.setCenter(center);
                $scope.circle.setCenter(center);
                $scope.searchEvents();

            }).catch((err) => {
                alert(err.message);
            }).finally(() => {
                $ionicLoading.hide();
            });
        }

        $scope.searchEvents = function(){
            $ionicLoading.show();
            // Clear markers
            for(var i in $scope.markers){
                $scope.markers[i].setMap(null);
            }
            $scope.markers = [];
            eventFactory
            .search({ search: 'filter', lat: $scope.map.getCenter().lat(), lng: $scope.map.getCenter().lng(),distance:parseInt($scope.distance.value) })
            .then((events) => {
                events.forEach((event) => {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(event.location[1], event.location[0]),
                        title: event.name,
                        map: $scope.map,
                        icon: event.category.icon,
                        draggable: false
                    });

                    $scope.markers.push(marker);

                    google.maps.event.addListener(marker, 'click', function (e) {
                        $scope.event = event;
                        $state.go("app.eventdetails",{id:event._id});
                    });
                });
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                $ionicLoading.hide();
            })

        

        }
    })

    .controller('EventDetailsController', function ($scope, $ionicHistory, $state, $stateParams, $ionicLoading, $ionicPopup, eventFactory, stateFactory, contactService, shareFactory) {
        $scope.moment = moment;
        $ionicLoading.show();
        if($stateParams.id){
            eventFactory.getEvent($stateParams.id)
            .then((event)=>{
                $scope.event = event;
            })
            .catch((err)=>{
                console.error(err);
            })
            .finally(()=>{
                $ionicLoading.hide();
            })
        }

        $scope.back = function(){
            $ionicHistory.goBack();
        }

        $scope.share = function(){
            contactService.callback = function (contacts) {
                var emails = [];
                for (var i in contacts) {
                    if (contacts[i].emails && contacts[i].emails.length > 0) {
                        emails.push(contacts[i].emails[0]);
                    }
                }

                // Send
                console.log(emails);
                shareFactory
                .authenticate(stateFactory.user.email, stateFactory.user.password)
                .send({ eventId: $scope.event._id, emails: emails })
                    .then((success) => {
                        $ionicPopup.show({
                            template: emails.length + " emails sent",
                            title: 'Allright',
                            scope: $scope,
                            buttons: [{
                                text: 'Okay',
                                type: 'button-calm',
                                onTap: function (e) { console.log('cerrando') }
                            }]

                        }).then((res) => {
                            console.log('cerrado', res);
                        })
                    })
                    .catch((error) => {
                        $ionicPopup.show({
                            template: error.data,
                            title: 'Error',
                            scope: $scope,
                            buttons: [{
                                text: 'Okay',
                                type: 'button-assertive',
                                onTap: function (e) { console.log('cerrando') }
                            }]

                        }).then((res) => {
                            console.log('cerrado', res);
                        })
                    });
            }
            
            $state.go('app.contactpicker');
        }
    });
