/**
 * Created by 小影 on 2017/11/1.
 */

///**
// * 异步接口
// */
//app.factory('requstSrv', ['$resource', 'Constant', function($resource, Constant){
//    return $resource(Constant.ApiPath + ':_1',{_1:'@_1',_2:'@_2',_3:'@_3',_4:'@_4'},
//        {
//            'getGroupList': {
//                method:'GET'
//            },
//            'delGroup':{
//                method:'GET'
//            },
//            'getNoticeList':{
//                method:'GET'
//            },
//            'delNotice':{
//                method:'GET'
//            },
//            'getLayoutList': {
//                method:'GET'
//            },
//            'delLayout': {
//                method:'GET'
//            },
//            'selByLayoutId':{
//                method:'GET'
//            },
//            'getConfigList':{
//                method:'GET'
//            },
//            'getHomeAttribute':{
//                method:'GET'
//            }
//        });
//}]);
/**
 * 同步接口
 */
app.factory('SyncRequestSrv',['$timeout',function($timeout){

    var viewRequst = {
        getData:function(dataInfo,actionName){
            var dataPost = {'requestJson':JSON.stringify(dataInfo)};
            var result =null;
            $.ajax({
                method: "POST",
                async: false,
                url : actionName,
                dataType: 'json',
                data:dataPost,
                //beforeSend: function (XMLHttpRequest) {
                //
                //    $("#loadingModal").modal();
                //},
                //complete: function (XMLHttpRequest, textStatus) {
                //    $("#loadingModal").modal('hide');
                //},
                success: function (data) {
                    console.log(data);
                    if(data.code == "1"){
                        result=data.data;
                    }else{
                        console.log(data.msg);
                        result = -1;
                    }
                },
                error:function (err) {
                    console.log(err.msg);
                    result = -1;
                }
            });
            return result;
        },

        saveData:function (dataInfo,actionName) {
            //$("#loadingStart").trigger("click");

            var dataPost = {'requestJson':JSON.stringify(dataInfo)};
            var reqResult = -1;
            $.ajax({
                method : 'POST',
                async : false,
                url : actionName,
                dataType : 'json',
                data:dataPost,
                beforeSend: function (XMLHttpRequest) {

                },
                complete: function (XMLHttpRequest, textStatus) {
                    $("#loadingModal").modal('hide');
                },
                success : function(data){
                    console.log(data);
                    if(data.code == "1"){
                        reqResult = 1;
                    }else {
                        console.log(data.msg);
                        reqResult = -1;
                    }

                },
                error:function(err){
                    console.log(err.msg);
                    reqResult = -1;
                }
            });

            return reqResult;
        }

    };
    return viewRequst;
}]);





