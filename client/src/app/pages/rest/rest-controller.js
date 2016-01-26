/**
 * Created by Lenur on 03.01.2016.
 */

function RestCtrl ($scope, $rootScope, RestService, $sessionStorage) {
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

    //ParamsList
        rest.openParams = function() {
            rest.tabs[$scope.selectedTab].isCollapsed = !rest.tabs[$scope.selectedTab].isCollapsed;
        };

        rest.addNewParam = function () {
            rest.tabs[$scope.selectedTab].params.push({
                key: '',
                value: ''
            });
        };

        rest.deleteParam = function (index) {
            rest.tabs[$scope.selectedTab].params.splice(index, 1);
        };

    rest.getSessionTabs = function() {
        return $sessionStorage.tabs ? $sessionStorage.tabs : null;
    };

    $scope.selectedTab = 0; //set selected tab
    //add tab
    rest.addTab = function () {
        rest.counter++;
        $sessionStorage.tabs.push({
            id: rest.counter,
            name: 'New tab ',
            data : {type: rest.types[0], url: '', content:''},
            content: '',
            params: [
                {
                    key: '',
                    value: ''
                }
            ],
            isCollapsed: false
        });
        $scope.selectedTab = $sessionStorage.tabs.length - 1;
        rest.tabs = $sessionStorage.tabs;
    };

    //delete tab
    rest.deleteTab = function (index) {
        console.log($sessionStorage.tabs);
        $sessionStorage.tabs.splice(index, 1); //remove the object from the array based on index
        $scope.selectedTab = index - 1;
        if (!$sessionStorage.tabs[index-1]) {
            $scope.selectedTab = $sessionStorage.tabs.length-1;
        }
    };

    // to set selectedTab
    rest.selectTab = function (index) {
        $scope.selectedTab = index;
    };

    rest.sendData = function () {
        //while send 1 obj, need make changes on server side
        // {base: rest.tabs[$scope.selectedTab].data, param: rest.allParam}
        RestService
            .send($sessionStorage.tabs[$scope.selectedTab].data)
            .success(function(response) {
                console.log(response);
                console.log($sessionStorage.tabs[$scope.selectedTab].data);
                $sessionStorage.tabs[$scope.selectedTab].content = response.content;

                $rootScope.$emit('history: addData', response.history);
            }).error(function(error) {
                console.log(error);
            });
    };

    rest.bindEvents = function () {
        $rootScope.$on('history: invoke', function (e, query) {
            $sessionStorage.tabs[$scope.selectedTab].data.type = query.type;
            $sessionStorage.tabs[$scope.selectedTab].data.url = query.url;
            $sessionStorage.tabs[$scope.selectedTab].content = '';
        });
    };

    rest.load = function() {
        if (rest.getSessionTabs() !== null) {
            rest.tabs = rest.getSessionTabs();
            var changeCount = 1;
            angular.forEach(rest.tabs, function(tab){
                tab.id = changeCount++;
            });
            rest.counter = rest.tabs.length;
        } else {
            rest.tabs = [{
                id: 1,
                name: 'New tab',
            //    active: true,
                data: {
                    type: rest.types[0],
                    url:''
                },
                content: '',
                params: [
                    {
                        key: '',
                        value: ''
                    }
                ],
                isCollapsed: false
            }];
            $sessionStorage.tabs = rest.tabs;
            rest.counter = 1;
        }
    };

    rest.resolve = function() {
        rest.load();
        rest.bindEvents();
    };

    rest.resolve();

}