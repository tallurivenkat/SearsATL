angular.module('exampleApp', ['ngRoute', 'ngCookies', 'exampleApp.services','restangular'])
	.config(
		[ '$routeProvider', '$locationProvider', '$httpProvider','RestangularProvider', function($routeProvider, $locationProvider, $httpProvider, RestangularProvider) {
			
			$routeProvider.when('/create', {
				templateUrl: 'partials/create.html',
				controller: CreateController
			});
			
			$routeProvider.when('/other', {
				templateUrl: 'partials/newUserReg.html',
				controller: OtherController
			});
			
			$routeProvider.when('/edit/:id', {
				templateUrl: 'partials/edit.html',
				controller: EditController
			});

			$routeProvider.when('/login', {
				templateUrl: 'partials/login.html',
				controller: LoginController
			});
			
			$routeProvider.when('/search', {
				templateUrl: 'partials/search.html',
				controller: SearchController
			});
			
			$routeProvider.when('/about', {
				templateUrl: 'partials/aboutSears.html',
				controller: AboutController
			});
			
			$routeProvider.when('/resource', {
				templateUrl: 'partials/resource.html',
				controller: ResourceController
			});
			
			$routeProvider.when('/thankyou', {
				templateUrl: 'partials/thankyou.html',
				controller: ResourceController
			});
			
			$routeProvider.otherwise({
				templateUrl: 'partials/index.html',
				controller: IndexController
			});
			
			
			
			$locationProvider.hashPrefix('!');
			
			/* Register error provider that shows message on failed requests or redirects to login page on
			 * unauthenticated requests */
		    $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
			        return {
			        	'responseError': function(rejection) {
			        		var status = rejection.status;
			        		var config = rejection.config;
			        		var method = config.method;
			        		var url = config.url;
			      
			        		if (status == 401) {
			        			$location.path( "/other" );
			        		} else {
			        			$rootScope.error = method + " on " + url + " failed with status " + status;
			        		}
			              
			        		return $q.reject(rejection);
			        	}
			        };
			    }
		    );
		    
		    /* Registers auth token interceptor, auth token is either passed by header or by query parameter
		     * as soon as there is an authenticated user */
		    $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
		        return {
		        	'request': function(config) {
		        		var isRestCall = config.url.indexOf('rest') == 0;
		        		if (isRestCall && angular.isDefined($rootScope.authToken)) {
		        			var authToken = $rootScope.authToken;
		        			if (exampleAppConfig.useAuthTokenHeader) {
		        				config.headers['X-Auth-Token'] = authToken;
		        			} else {
		        				config.url = config.url + "?token=" + authToken;
		        			}
		        		}
		        		return config || $q.when(config);
		        	}
		        };
		    });


		    RestangularProvider.setBaseUrl('rest')
		   
		} ]
		
	).run(function($rootScope, $location, $cookieStore, UserService) {
		
		/* Reset error when a new view is loaded */
		$rootScope.$on('$viewContentLoaded', function() {
			delete $rootScope.error;
		});
		
		$rootScope.hasRole = function(role) {
			
			if ($rootScope.user === undefined) {
				return false;
			}
			
			if ($rootScope.user.roles[role] === undefined) {
				return false;
			}
			
			return $rootScope.user.roles[role];
		};
		
		$rootScope.logout = function() {
			delete $rootScope.user;
			delete $rootScope.authToken;
			$cookieStore.remove('authToken');
			$location.path("/login");
		};
		
		 /* Try getting valid user from cookie or go to login page */
		var originalPath = $location.path();
		$location.path("/login");
		var authToken = $cookieStore.get('authToken');
		if (authToken !== undefined) {
			$rootScope.authToken = authToken;
			UserService.get("").then(function(user) {
				$rootScope.user = user;
				$location.path("/");
			});
		}
		
		$rootScope.initialized = true;
	});


function IndexController($scope, NewsService) {
	
	NewsService.getList().then(function(entries){
		$scope.newsEntries = entries;
	});
	$scope.deleteEntry = function(newsEntry) {
		newsEntry.remove().then(function() {
			$scope.newsEntries = NewsService.getList().$object;
		});
	};
};
function SearchController($scope, $http, NewsService) {
	$scope.items = [
	                { id: 1, name: 'washer'},
	                { id: 2, name: 'dryer'},
	                { id: 3, name: 'refrigerators'},
	                { id: 4, name: 'ranges'},
	                { id: 5, name: 'dishwashers'},
	                { id: 6, name: 'tires'},
	                { id: 7, name: 'batteries'},
	                { id: 8, name: 'cribs'},
	                { id: 9, name: 'washers-dryers'},
	                { id: 10, name: 'exterior-accessories'},
	                { id: 11, name: 'clothing'},
	                { id: 12, name: 'shoes'},
	                { id: 13, name: 'accessories'},
	                { id: 14, name: 'laptops'}
	                ];
	
	
//	var parameters = keyword + "?customData=" + customData + "&apikey=" + apiKey;
	
	
	$scope.search= function()
    {var apiKey = "120cbeb41606c07aa439dfae5ff9fb69";
//    var apikey="Git2Qh93GZemXLB9g0TwO0h9rEEK4G6l";
	var customData = "";
	var baseURL = "http://api.developer.sears.com/";
	var pathURI = "v2.1/products/search/Sears/json/keyword/";
		var parameters = $scope.selectedItem.name + "?customData=" + customData + "&apikey=" + apiKey;
		var completeUrl = baseURL + pathURI + parameters;
		console.log(completeUrl);
		$http.get(completeUrl).
	    success(function(data, status, headers, config) {
	      $scope.posts = data.SearchResults.Categories;
	    });
	};
	$scope.deleteEntry = function(newsEntry) {
		newsEntry.remove().then(function() {
			$scope.newsEntries = NewsService.getList().$object;
		});
	};
};


function EditController($scope, $routeParams, $location, NewsService) {

	NewsService.get($routeParams.id).then(function(enrty){
		$scope.newsEntry = enrty;
	});

	$scope.save = function() {
		$scope.newsEntry.post().then(function() {
			$location.path('/');
		});
	};
};

function AboutController($scope, $location, NewsService) {
	
	$scope.serverVersion="R1.0";
	$scope.serverTimeStamp=new Date();
	$scope.currentDate=Date.now();
};

function CreateController($scope, $location, NewsService) {
	

	$scope.save = function() {
		NewsService.post($scope.newsEntry).then(function() {
			$location.path('/');
		});
	};
};

function ResourceController($scope, $location, NewsService) {
	
	
};
function OtherController($scope, $rootScope, $location, NewUserRegService) {

	$scope.save = function() {
		NewUserRegService.post($scope.newuser).then(function() {
			$location.path('/resource');
		});
	};
	
	NewUserRegService.getList().then(function(entries){
		$scope.newUserEntries = entries;
	});

	
};


function LoginController($scope, $rootScope, $location, $cookieStore, UserService) {
	
	$scope.rememberMe = false;

	$scope.login = function() {

		UserService.customPOST($.param({username: $scope.username, password: $scope.password}),"authenticate",{},{'Content-Type': 'application/x-www-form-urlencoded'}).then(function(authenticationResult) {
			var authToken = authenticationResult.token;
			$rootScope.authToken = authToken;

			if ($scope.rememberMe) {
				$cookieStore.put('authToken', authToken);
			}
			UserService.get("").then(function(user) {
				$rootScope.user = user;
				$location.path("/");
			});

		});
	};
};


var services = angular.module('exampleApp.services', []);

services.factory('UserService', function(Restangular) {
	
	return Restangular.all('user');
});

services.factory('NewsService', function(Restangular) {
	
	return Restangular.all('news');
});

services.factory('NewUserRegService', function(Restangular) {
	
	return Restangular.all('newuser');
});