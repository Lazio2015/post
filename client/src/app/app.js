
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