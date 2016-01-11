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

    $httpProvider.interceptors.push(function ($q) {
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
    });

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
};