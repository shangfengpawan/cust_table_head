/**
 * Created by 小影 on 2017/11/4.
 */

'use strict';
app.factory('homeSrv',['SyncRequestSrv',function(SyncRequestSrv){
        var m_Callbacks = [];

        var homeSrvObj = {
            getUserName: function () {
                var ret = SyncRequestSrv.getData(null,"getUserName.do");
                if(ret != -1){
                    console.log("获取用户名成功:"+ret);
                    return ret;
                }else{
                    console.log("获取用户名失败");
                    return "";
                }
            },
            consoleLogOut: function () {
                var ret = SyncRequestSrv.saveData(null,"logOut.do");
            },

            newServerSave: function (serverInfo,callBack) {
                var ret = SyncRequestSrv.saveData(serverInfo,'saveServerInfo.do');
                if(ret == 1){
                    alert("新增成功");
                    callBack();
                }
                if(ret == -1){
                    alert("新增失败");
                }

            },
            delServer : function (serverInfo, callBack) {
                var ret = SyncRequestSrv.saveData(serverInfo,'delServerInfo.do');
                if(ret == 1){
                    alert("删除成功");
                    callBack();
                }
                if(ret == -1){
                    alert("删除失败");
                }
            },
            deployServer: function (serverId, callBack) {
                var param = {
                    serverId:serverId
                };
                var ret = SyncRequestSrv.saveData(param,'deployServer.do');
                if(ret == 1){
                    alert("部署成功");
                    callBack();
                }
                if(ret == -1){
                    alert("部署失败");
                }
            },
            getServerInfoList: function (callBack) {
                var ret = SyncRequestSrv.getData(null,'getServerInfo.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            getProductInfoList: function (callBack) {
                var ret = SyncRequestSrv.getData(null,'getProductInfo.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            startProductById: function (productId, callBack) {
                var param = {
                    productId:productId
                };
                var ret = SyncRequestSrv.saveData(param,'startProductById.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            stopProductById: function (productId, callBack) {
                var param = {
                    productId:productId
                };
                var ret = SyncRequestSrv.saveData(param,'stopProductById.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            updateProductPkg: function (updateProductInfo, callBack) {
                var ret = SyncRequestSrv.saveData(updateProductInfo,'updateProductPkg.do');
                if(ret != -1){
                    callBack();
                    alert("升级成功");
                }else{
                    alert("升级失败");
                }
            },

            /**
             * 获取第三方应用列表
             * @param callBack
             */
            getApplicationList: function (callBack) {
                var ret = SyncRequestSrv.getData(null,'getApplication.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            /**
             * 启动第三方应用
             * @param productId
             * @param callBack
             */
            startApplicationById: function (productId, callBack) {
                var param = {
                    applicationId:productId
                };
                var ret = SyncRequestSrv.saveData(param,'startApplicationById.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            /**
             * 停止第三方应用
             * @param productId
             * @param callBack
             */
            stopApplicationById: function (productId, callBack) {
                var param = {
                    applicationId:productId
                };
                var ret = SyncRequestSrv.saveData(param,'stopApplicationById.do');
                if(ret != -1){
                    callBack(ret);
                }
            },


            dbDataInit:function(serverId,callBack){
                var param = {
                    serverId:serverId
                };
                var ret = SyncRequestSrv.saveData(param,'dbInit.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            zkDataInit:function(serverInnerIp,serverIp,localHostInner,localHost,callBack){
                var param = {
                    serverInnerIp:serverInnerIp,
                    serverIp:serverIp,
                    localHost:localHost,
                    localHostInner:localHostInner
                };
                var ret = SyncRequestSrv.saveData(param,'zkInit.do');
                if(ret != -1){
                    callBack(ret);
                }
            },

            getConfCenter:function(serverInnerIp,callBack){
                var param = {
                    serverInnerIp:serverInnerIp,
                };
                var ret = SyncRequestSrv.getData(param,'getConfCenter.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            updateConfCenter:function(serverInnerIp,name,value,callBack){
                var param = {
                    serverInnerIp:serverInnerIp,
                    name:name,
                    value:value,
                };
                var ret = SyncRequestSrv.saveData(param,'updataConf.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            casInit:function(serverIp,serverInnerIp,callBack){
                var param = {
                    serverIp:serverIp,
                    serverInnerIp:serverInnerIp
                };
                var ret = SyncRequestSrv.saveData(param,'casInit.do');
                if(ret != -1){
                    callBack(ret);
                }
            },
            /**
             * 注册函数接口
             * @param callback
             * @param callname
             */
            registerCallBack: function(callback,callname) {
                var flag = true;
                angular.forEach(m_Callbacks, function(item) {
                    if(item.name == callname){
                        flag = false;
                    }
                });
                if(flag) {
                    var item = {
                        name:callname,
                        func:callback
                    };
                    m_Callbacks.push(item);
                    console.log('registerCallBack :'+callname);
                }
            },
            /**
             * 回调函数接口
             * @param callname
             * @param params
             */
            notifyCallBack: function(callname,params) {
                angular.forEach(m_Callbacks, function(item) {
                    if(item.name == callname){
                        if(params !=null){
                            item.func(params);
                        }else {
                            item.func();
                        }
                    }
                });
            }
        };

        return homeSrvObj;

    }]);