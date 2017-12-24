var defaultFactoryInterceptor = {
    response: function (response) {
        return response.data
    },
    responseError: function (response) {
        var data = null;
        try {
            // if it is json return as is
            data = JSON.parse(response.data);
        } catch (e) {
            data = response.data
        }
        throw { statusCode: response.status, data: data };
    }
}

angular.module('eventops.services',['ngResource'])
    .constant('baseURL', 'https://eventops.eu-gb.mybluemix.net/v1/')
    .factory('storage', function(){
        return {
            _data:{},
            get:function(k){
                return this._data[k] || null;
            },
            set:function(k,v){
                this._data[k] = v;
            }
        }
    })
    .factory('geolocation', function($cordovaGeolocation){
        return {
            defaultLocation:function(){
                return {latitude:37.779594,longitude:-3.784906}
            },
            findMe:function(){
                return $cordovaGeolocation.getCurrentPosition()
            },
            getAddress:function(latlng,callback){
                return new Promise((resolve,reject)=>{
                    new google.maps.Geocoder().geocode({ location: latlng }, function (result, status) {
                        console.log(result, status);
                        if (status === 'OK') {
                            if (result[0]) {
                                resolve(result[0].formatted_address);
                            }else{
                                reject('No result in reverse geocoder');
                            }
                        }else{
                            reject('Error in reverse geocoder.');
                        }
                    });
                });
            }
        }
    })
    .factory('contactService', function($cordovaContacts){
        return {
            find:function(){
                return new Promise( (resolve,reject) =>{
                    $cordovaContacts.find({}).then((contacts)=>{
                        if(contacts == null || contacts.length == 0){
                            contacts = [];
                            /* Add a default contact */
                            contacts.push({
                                id:'mockuser-1',
                                displayName:'Gerard Buttler',
                                nickname:'Josh',
                                emails:['gerard@eventops.com']
                            });
                            contacts.push({
                                id:'mockuser-2',
                                displayName:'Kermit the Frog',
                                nickname:'Kermit',
                                emails:['kermit@eventops.com']
                            });
                            contacts.push({
                                id:'mockuser-3',
                                displayName:'Scarlett Johanson',
                                nickname:'Janine',
                                emails:['scarlett@eventops.com']
                            });
                        }
                        console.log(contacts);
                        resolve(contacts);
                    }).catch((err)=>{
                        reject(err);
                    })
                });
            },
            callback:null
        }
    })
    .factory('mapService', function(){
        var factory = {
            center:null,
            markers:[],
            zoom:18
        };
        
        return factory;
    })
    .factory('userFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var factory = {

        };

        factory.authenticate = function (email, password) {
            headers = {
                Authorization: 'Basic ' + btoa(email + ':' + password)
            }

            factory.resource = $resource(baseURL + "users/:id", null, {
                'add': { method: 'POST', headers: headers, interceptor: defaultFactoryInterceptor },
                'get': { method: 'GET', headers: headers, interceptor: defaultFactoryInterceptor },
                'update': { method: 'PUT', headers: headers, interceptor: defaultFactoryInterceptor },
                'query': { method: 'GET', headers: headers, isArray: true, interceptor: defaultFactoryInterceptor },
                'delete': { method: 'DELETE', headers: headers, interceptor: defaultFactoryInterceptor }
            });

            return factory;
        }

        factory.logout = function () {
            factory.resource = null;
        }

        factory.getUser = function (id) {
            if (!this.resource) {
                return Promise.reject('Not authenticated');
            } else {
                return this.resource.get({ id: id }).$promise;
            }
        }

        factory.newUser = function(data){
            return this.resource.add(null,data).$promise;
            
        }

        factory.updateUser = function(id,data){
            if (!this.resource) {
                return Promise.reject('Not authenticated');
            } else {
                return this.resource.update({ id: id },data).$promise;
            }
        }
        return factory;
    }])
    .factory('eventFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var factory = {

        };

        factory.authenticate = function (email, password) {
            headers = {
                Authorization: 'Basic ' + btoa(email + ':' + password)
            }

            factory.resource = $resource(baseURL + "events/:id", null, {
                'add': { method: 'POST', headers: headers, interceptor: defaultFactoryInterceptor },
                'get': { method: 'GET', headers: headers, interceptor: defaultFactoryInterceptor },
                'update': { method: 'PUT', headers: headers, interceptor: defaultFactoryInterceptor },
                'query': { method: 'GET', headers: headers, isArray: true, interceptor: defaultFactoryInterceptor },
                'delete': { method: 'DELETE', headers: headers, interceptor: defaultFactoryInterceptor }
            });

            return factory;
        }

        factory.logout = function () {
            factory.resource = null;
        }

        factory.getEvent = function (id) {
            if (!this.resource) {
                return Promise.reject('Not authenticated');
            } else {
                return this.resource.get({ id: id }).$promise;
            }
        }

        factory.newEvent = function(data){
            return this.resource.add(null,data).$promise;
        }

        factory.updateEvent = function(id,data){
            if (!this.resource) {
                return Promise.reject('Not authenticated');
            } else {
                return this.resource.update({ id: id },data).$promise;
            }
        }

        factory.search = function(query){
            return this.resource.query(query).$promise;
        }

        factory.delete = function(id){
            return this.resource.delete({id:id}).$promise;
        }
        return factory;
    }])
    .factory('stateFactory', function () {
        var factory = {};
        factory.user = null;


        return factory;
    })
    .factory('cityFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var res = $resource(baseURL + "cities", null, {
            'get': { method: 'GET', isArray:true,interceptor: defaultFactoryInterceptor }
        });

        return {
            find:function(q){
                return res.get({q:q}).$promise;
            }
        };
    }])    
    .factory('requestFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var factory = {

        };

        factory.authenticate = function (email, password) {
            headers = {
                Authorization: 'Basic ' + btoa(email + ':' + password)
            }

            factory.resource = $resource(baseURL + "requests/:id", null, {
                'add': { method: 'POST', headers: headers, interceptor: defaultFactoryInterceptor },
                'get': { method: 'GET', headers: headers, interceptor: defaultFactoryInterceptor },
                'update': { method: 'PUT', headers: headers, interceptor: defaultFactoryInterceptor },
                'query': { method: 'GET', headers: headers, isArray: true, interceptor: defaultFactoryInterceptor },
                'delete': { method: 'DELETE', headers: headers, interceptor: defaultFactoryInterceptor }
            });

            return factory;
        }

        factory.logout = function () {
            factory.resource = null;
        }

        factory.getRequest = function (id) {
            if (!this.resource) {
                return Promise.reject('Not authenticated');
            } else {
                return this.resource.get({ id: id }).$promise;
            }
        }

        factory.newRequest = function(data){
            return this.resource.add(null,data).$promise;
        }

        factory.acceptRequest = function(id,accepted){
            if (!this.resource) {
                return Promise.reject('Not authenticated');
            } else {
                return this.resource.update({ id: id },{accepted:accepted}).$promise;
            }
        }

        factory.search = function(query){
            return this.resource.query(query).$promise;
        }

        factory.delete = function(id){
            return this.resource.delete({id:id}).$promise;
        }
        return factory;
    }])
    .factory('categoryFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var factory = {

        };

		factory.authenticate = function (email, password) {
            headers = {
                Authorization: 'Basic ' + btoa(email + ':' + password)
            }

            factory.resource = $resource(baseURL + "categories/", null, {
                'query': { method: 'GET', headers: headers, isArray: true, interceptor: defaultFactoryInterceptor }
            });

            return factory;
        }

        factory.all = function(){
            return this.resource.query(null).$promise;
        }
      
        return factory;
    }])
    .factory('shareFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        var factory = {

        };

        factory.authenticate = function (email, password) {
            headers = {
                Authorization: 'Basic ' + btoa(email + ':' + password)
            }

            factory.resource = $resource(baseURL + "share", null, {
                'add': { method: 'POST', headers: headers, interceptor: defaultFactoryInterceptor }
            });

            return factory;
        }

        factory.logout = function () {
            factory.resource = null;
        }

        factory.send = function(data){
            return this.resource.add(null,data).$promise;
        }

        return factory;
    }])