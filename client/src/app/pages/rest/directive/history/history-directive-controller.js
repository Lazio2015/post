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