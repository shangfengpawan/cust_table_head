app.controller('homeCtrl', ['$rootScope','$scope', '$compile','$window','$timeout','homeSrv',function ($rootScope,$scope, $compile ,$window,$timeout,homeSrv) {

    $scope.homeInit = function () {
        console.log("homeInit");

    };

    $scope.tabIndex = 0;

    var dataList = [
        [
            {
                colId:1,
                colValue:2312
            },
            {
                colId:2,
                colValue:2362
            },
            {
                colId:3,
                colValue:2352
            },
            {
                colId:4,
                colValue:2432
            },
            {
                colId:5,
                colValue:2332
            },
            {
                colId:6,
                colValue:2322
            }
        ],
        [
            {
                colId:1,
                colValue:2312
            },
            {
                colId:2,
                colValue:2362
            },
            {
                colId:3,
                colValue:2352
            },
            {
                colId:4,
                colValue:2432
            },
            {
                colId:5,
                colValue:2332
            },
            {
                colId:6,
                colValue:2322
            }
        ],
        [
            {
                colId:1,
                colValue:2312
            },
            {
                colId:2,
                colValue:2362
            },
            {
                colId:3,
                colValue:2352
            },
            {
                colId:4,
                colValue:2432
            },
            {
                colId:5,
                colValue:2332
            },
            {
                colId:6,
                colValue:2322
            }
        ],
        [
            {
                colId:1,
                colValue:2312
            },
            {
                colId:2,
                colValue:2362
            },
            {
                colId:3,
                colValue:2352
            },
            {
                colId:4,
                colValue:2432
            },
            {
                colId:5,
                colValue:2332
            },
            //{
            //    colId:6,
            //    colValue:2322
            //}
        ]

    ];

    $scope.initCTHead = function(ele){
        //var headSetting = [
        //    {
        //        currLevel:2,
        //        orderNo:0,
        //        headInfo:{
        //            colspanNum:3,
        //            rowspanNum:1,
        //            headName:"第一级1",
        //            nextLevelInfo:[{
        //                currLevel:1,
        //                orderNo:0,
        //                headInfo:{
        //                    colspanNum:2,
        //                    rowspanNum:1,
        //                    headName:"第二级",
        //                    nextLevelInfo:[
        //                        {
        //                            currLevel:0,
        //                            orderNo:0,
        //                            headInfo:{
        //                                colspanNum:1,
        //                                rowspanNum:1,
        //                                headName:"第一列",
        //                                nextLevelInfo:[]
        //                            },
        //                            colInfo:{
        //                                orderNo:1,
        //                                colId:"1",
        //                                colName:"第一列",
        //                                isHide:"1"
        //                            }
        //                        },
        //                        {
        //                            currLevel:0,
        //                            orderNo:1,
        //                            headInfo:{
        //                                colspanNum:1,
        //                                rowspanNum:1,
        //                                headName:"第二列",
        //                                nextLevelInfo:[]
        //                            },
        //                            colInfo:{
        //                                orderNo:1,
        //                                colId:"1",
        //                                colName:"第二列",
        //                                isHide:"1"
        //                            }
        //                        }
        //
        //                    ]
        //                },
        //                colInfo:null
        //            },
        //            {
        //                currLevel:1,
        //                orderNo:1,
        //                headInfo:{
        //                    colspanNum:1,
        //                    rowspanNum:2,
        //                    headName:"第三列",
        //                    nextLevelInfo:[]
        //                },
        //                colInfo:{
        //                    orderNo:1,
        //                    colId:"1",
        //                    colName:"第三列",
        //                    isHide:"1"
        //                }
        //            }
        //            ]
        //        },
        //        colInfo:null
        //    },
        //    {
        //        currLevel:2,
        //        orderNo:1,
        //        headInfo:{
        //            colspanNum:2,
        //            rowspanNum:1,
        //            headName:"第一级2",
        //            nextLevelInfo:[{
        //                currLevel:1,
        //                orderNo:2,
        //                headInfo:{
        //                    colspanNum:1,
        //                    rowspanNum:2,
        //                    headName:"第四列",
        //                    nextLevelInfo:[]
        //                },
        //                colInfo:{
        //                    orderNo:2,
        //                    colId:"1",
        //                    colName:"第四列",
        //                    isHide:"1"
        //                }
        //            },
        //            {
        //                currLevel:1,
        //                orderNo:3,
        //                headInfo:{
        //                    colspanNum:1,
        //                    rowspanNum:2,
        //                    headName:"第五列",
        //                    nextLevelInfo:[]
        //                },
        //                colInfo:{
        //                    orderNo:3,
        //                    colId:"1",
        //                    colName:"第五列",
        //                    isHide:"1"
        //                }
        //            }
        //            ]
        //        },
        //        colInfo:null
        //    },
        //    {
        //        currLevel:2,
        //        orderNo:2,
        //        headInfo:{
        //            colspanNum:1,
        //            rowspanNum:3,
        //            headName:"第一级3",
        //            nextLevelInfo:[
        //            ]
        //        },
        //        colInfo:{
        //            orderNo:4,
        //            colId:"1",
        //            colName:"第六列",
        //            isHide:"1"
        //        }
        //    }
        //
        //
        //];
        var headSetting = [
            {
                currLevel:0,
                orderNo:0,
                headInfo:{
                    colspanNum:1,
                    rowspanNum:1,
                    headName:"第一列",
                    nextLevelInfo:[
                    ]
                },
                colInfo:{
                    orderNo:0,
                    colId:"1",
                    colName:"第一列",
                    isHide:"1"
                }
            },
            {
                currLevel:0,
                orderNo:1,
                headInfo:{
                    colspanNum:1,
                    rowspanNum:1,
                    headName:"第二列",
                    nextLevelInfo:[
                    ]
                },
                colInfo:{
                    orderNo:0,
                    colId:"2",
                    colName:"第二列",
                    isHide:"1"
                }
            },
            {
                currLevel:0,
                orderNo:2,
                headInfo:{
                    colspanNum:1,
                    rowspanNum:1,
                    headName:"第三列",
                    nextLevelInfo:[
                    ]
                },
                colInfo:{
                    orderNo:0,
                    colId:"3",
                    colName:"第三列",
                    isHide:"1"
                }
            },
            {
                currLevel:0,
                orderNo:3,
                headInfo:{
                    colspanNum:1,
                    rowspanNum:1,
                    headName:"第四列",
                    nextLevelInfo:[
                    ]
                },
                colInfo:{
                    orderNo:0,
                    colId:"4",
                    colName:"第四列",
                    isHide:"1"
                }
            },
            {
                currLevel:0,
                orderNo:4,
                headInfo:{
                    colspanNum:1,
                    rowspanNum:1,
                    headName:"第五列",
                    nextLevelInfo:[
                    ]
                },
                colInfo:{
                    orderNo:0,
                    colId:"5",
                    colName:"第五列",
                    isHide:"1"
                }
            },
            {
                currLevel:0,
                orderNo:5,
                headInfo:{
                    colspanNum:1,
                    rowspanNum:1,
                    headName:"第六列",
                    nextLevelInfo:[
                    ]
                },
                colInfo:{
                    orderNo:0,
                    colId:"6",
                    colName:"第六列",
                    isHide:"1"
                }
            }
        ];


        var tabDiv = ele.find(".custTableBase");
        tabDiv.CTHead("tb"+$scope.tabIndex,headSetting);
        tabDiv.CTLoadData("tb"+$scope.tabIndex,dataList);
        $scope.tabIndex++;
    };

    homeSrv.registerCallBack($scope.initCTHead,"initCTHead");

    $scope.loadData = function () {
        var tabDiv =$("#table1").find(".custTableBase");
        tabDiv.CTLoadData("tb0",dataList);
    };

    $scope.homeInit();


}]);

