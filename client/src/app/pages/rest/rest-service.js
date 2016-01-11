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