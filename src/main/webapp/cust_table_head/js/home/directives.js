/**
 * Created by 尚锋 on 2018/4/16.
 */
'use strict';

app.directive('custTable',['homeSrv',function (homeSrv) {
   return {
       restrict: 'E',
       replace: true,
       // templateUrl: 'partials/sysMonitor/sysMonitor.html',
       templateUrl: 'cust_table_head/partials/custTable.html',
       link: function link(scope, ele) {
           console.log("custTable directive");
           homeSrv.notifyCallBack("initCTHead",ele);
       }
   }
}]);

