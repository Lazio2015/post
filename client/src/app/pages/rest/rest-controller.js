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
        content: '',
        params: [
            {
                key: '',
                value: ''
            }
        ],
        isCollapsed: false
    }];

    rest.addNewParam = function () {
        rest.tabs[$scope.selectedTab].params.push({
            key: '',
            value: ''
        });
    };

    rest.showParam = function () {
        rest.tabs[$scope.selectedTab].isCollapsed = true;
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