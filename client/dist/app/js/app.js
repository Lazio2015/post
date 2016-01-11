
angular.module('App', [
    'ngRoute',
    'ui.router',
    'ui.bootstrap',
    'ngStorage'])

    .constant('SystemConfig', {
        url: 'http://localhost:3000/',
        flag: true
    })

    .config(AppConfig)
    .run(AppRuntime)

    .controller('AppCtrl', AppCtrl)

    .controller('ContactCtrl', ContactCtrl)

    .controller('RestCtrl', RestCtrl)
    .factory('RestService', RestService)

    .controller('ParamsListDirectiveCtrl', ParamsListDirectiveCtrl)
    .directive('paramsList', ParamsListDirective)

    .controller('HistoryDirectiveCtrl', HistoryDirectiveCtrl)
    .directive('history', HistoryDirective);
function AppConfig(
    $locationProvider,
    $httpProvider,
    $stateProvider,
    $urlRouterProvider)
{
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push(["$q", function ($q) {
        return {
            'response': function (response) {
                //up to 300
                if (response.status == 200) {
                    //console.log('OK');
                }
                return response;
            },
            'responseError': function (rejection) {
                if(rejection.status === 401) {
                    location.reload();
                }
                return $q.reject(rejection);
            }
        };
    }]);

    var states = [];

    states.push({
            name: 'rest'
            , sticky: true
            , deepStateRedirect: true
            , url: '/rest'
            , controller: 'RestCtrl'
            , controllerAs: 'rest'
            , templateUrl: '../tpls/pages/rest/rest.html'
    });

    states.push({
            name: 'contact'
            , sticky: true
            , deepStateRedirect: true
            , url: '/contact'
            , controller: 'ContactCtrl'
            , controllerAs: 'contact'
            , templateUrl: '../tpls/pages/contact/index.html'
    });

    states.push({
            name: 'home'
            , sticky: true
            , deepStateRedirect: true
            , url: '/home'
            , templateUrl: '../tpls/pages/home/home.html'
    });

    angular.forEach(states, function(state) {
        $stateProvider.state(state);
    });

    $urlRouterProvider.otherwise('/home');
}
AppConfig.$inject = ["$locationProvider", "$httpProvider", "$stateProvider", "$urlRouterProvider"];;
function AppRuntime($templateCache){
    $templateCache.put('tabDefault', '<send-data></send-data>');
}
AppRuntime.$inject = ["$templateCache"];;
/**
 * Created by Lenur on 03.01.2016.
 */
function ContactCtrl($scope) {
        $scope.title = 'Contact page';
}
ContactCtrl.$inject = ["$scope"];
/**
 * Created by Lenur on 08.01.2016.
 */


function AppCtrl () {

    var app = this;
    app.selectItem = 'home';

    app.setSelectItem = function (value) {
        app.selectItem = value;
    };
}
/**
 * Created by Lenur on 03.01.2016.
 */

function RestCtrl ($scope, $rootScope, RestService) {
    var rest = this;
    rest.types = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'COPY', 'PATCH'];

  //  rest.types = [
  //      { type: "GET",   number: 1 },
  //      { type: "POST",  number: 2 },
  //      { type: "PUT",   number: 3 },
  //      { type: "DELETE",number: 4 },
  //      { type: "HEAD",  number: 5 },
  //      { type: "COPY",  number: 6 },
  //      { type: "PATCH", number: 7 }
  //  ];

    rest.tabs = [{
        id: 1,
        name: 'Default tab',
        active: true,
        data: {
            type: rest.types[0],
            url:''
            },
        content: ''
    }];

    rest.allParam = [
        {
            key: '',
            value: ''
        }
    ];

    rest.addNewParam = function () {
        rest.allParam.push({
            key: '',
            value: ''
        });
    };

    rest.counter = 1;
    $scope.selectedTab = 0; //set selected tab

    //add tab
    rest.addTab = function () {
        rest.counter++;
        rest.tabs.push({
            id: rest.counter,
            name: 'New tab ' + rest.counter,
            data : {type: rest.types[0], url: '', content:''}
        });
//        console.log(rest.tabs.length);
        $scope.selectedTab = rest.tabs.length - 1;


    };

    //delete tab
    rest.deleteTab = function (index) {
        rest.tabs.splice(index, 1); //remove the object from the array based on index
        $scope.selectedTab = index - 1;
    };

    // to set selectedTab
    rest.selectTab = function (index) {
        $scope.selectedTab = index;
    };

    rest.sendData = function () {
        //console.log(rest.allParam);
        //console.log(rest.tabs[$scope.selectedTab].data);
        //while send 1 obj, need make changes on server side
        // {base: rest.tabs[$scope.selectedTab].data, param: rest.allParam}
        RestService
            .send(rest.tabs[$scope.selectedTab].data)
            .success(function(response) {
                rest.tabs[$scope.selectedTab].content = response.content;

                $rootScope.$emit('history: addData', response.history);
            }).error(function(error) {
                console.log(error);
            });

    };

    rest.bindEvents = function () {
        $rootScope.$on('history: invoke', function (e, query) {
            rest.tabs[$scope.selectedTab].data.type = query.type;
            rest.tabs[$scope.selectedTab].data.url = query.url;
            rest.tabs[$scope.selectedTab].content = '';
        });
    };

    rest.resolve = function() {
        rest.bindEvents();
    };

    rest.resolve();

}
RestCtrl.$inject = ["$scope", "$rootScope", "RestService"];
/**
 * Created by Lenur on 07.01.2016.
 */

function RestService($http, SystemConfig) {


    var RestService = {};
    RestService._$http = $http;

    RestService.url = SystemConfig.url + 'server';

    RestService.send = function(data){
        return RestService._$http.post(RestService.url, data);
    };

//history
    RestService.urlHistory = SystemConfig.url + 'history';

    RestService.getHistory = function () {
        return RestService._$http.get(RestService.urlHistory);
    };

    RestService.deleteHistory = function (historyId) {
        return RestService._$http.delete(RestService.urlHistory + '/' + historyId);
    };

    return RestService;
}
RestService.$inject = ["$http", "SystemConfig"];
/**
 * Created by Lenur on 03.01.2016.
 */

function HistoryDirectiveCtrl($scope, $rootScope, RestService) {

    var historyDirective = this;

    $scope.sortField = 'id';

    historyDirective.bindEvents =  function () {
        $rootScope.$on('history: addData', function(event, data) {
            $scope.history.push(data);
        });
    };

    historyDirective.invokeClick = function (data) {
        $rootScope.$emit('history: invoke', data);
    };


    RestService
        .getHistory()
        .success(function (data) {
            $scope.history = data;
        });

    historyDirective.delete = function(id) {
        RestService
            .deleteHistory(id)
            .success(function (data) {
                $scope.history = data;
            });
    };

    historyDirective.resolve = function () {

        historyDirective.bindEvents();
    };

    historyDirective.resolve();
}
HistoryDirectiveCtrl.$inject = ["$scope", "$rootScope", "RestService"];
/**
 * Created by Lenur on 03.01.2016.
 */

function HistoryDirective() {
    return {
        restrict: 'AE',
        templateUrl: 'tpls/pages/rest/directive/history/history.html',
        controller: 'HistoryDirectiveCtrl',
        controllerAs: 'historyDirective',
        //  scope: {},
        link: function (scope) {


        }
    }
}
/**
 * Created by Lenur on 08.01.2016.
 */

function ParamsListDirectiveCtrl ($scope) {
    var paramsList = this;

    //default one empty param


}
ParamsListDirectiveCtrl.$inject = ["$scope"];
/**
 * Created by Lenur on 08.01.2016.
 */

function ParamsListDirective() {
    return {
        restrict: 'AE',
        templateUrl: 'tpls/pages/rest/directive/params-list/params-list.html',
        controller: 'ParamsListDirectiveCtrl',
        controllerAs: 'paramsList',
        scope: {
            params: '&'
        },
        link: function (scope, element, attr) {

        }
    }
}
