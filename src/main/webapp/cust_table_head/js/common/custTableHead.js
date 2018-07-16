/**
 * Created by shangfeng on 2018/6/28.
 */

(function () {
    if (typeof jQuery !== 'undefined' && jQuery.fn.extend) {
        jQuery.fn.extend({
            //初始化调用
            CTHead: function CTHead(ct_name,headSetting) {
                init(this,ct_name,headSetting);
            },
            CTLoadData:function CTLoadData(ct_name,dataList){
                loadData(ct_name,dataList);
            },
            CTGetHeadSetting: function (ct_name) {
                var ret = null;
                var ctInfo = getCTInfo(ct_name);
                if(ctInfo != null){
                    ret = JSON.parse(JSON.stringify(ctInfo.ct_headSetting));
                }
                return ret;
            }


        })
    }
})();

var ct_list = [];

var saveCTList = function (ctInfo) {
    var isExist = false;
    for(var i=0;i<ct_list.length;i++){
        if(ctInfo.ct_name == ct_list[i].ct_name){
            isExist = true;
            ct_list[i] = ctInfo;
        }
    }

    if(!isExist){
        ct_list.push(ctInfo);
    }

};

var getCTInfo = function (ct_name) {
    var ret = null;
    for(var i=0;i<ct_list.length;i++){
        if(ct_list[i].ct_name == ct_name){
            ret = ct_list[i];
        }
    }
    return ret;
};

var ct_ele;
var ct_headSetting = [];
var ct_option = {
    name:"ct",
    colHead:[
        {
            orderNo:0,
            colId:"",
            colName:"",
            isHide:"1"

        }
    ],
    rowHead:[
        {
            orderNo:0,
            colId:"",
            colName:""

        }
    ]
};

var reComputeLevelAndOrderNo = function (headSetting,level) {
    if(headSetting.length == 0){
        return headSetting;
    }
    for(var i=0;i<headSetting.length;i++){
        headSetting[i].currLevel = level;
        headSetting[i].orderNo = i;
        if(headSetting[i].headInfo.nextLevelInfo.length == 0){
            headSetting[i].headInfo.rowspanNum = level+1;
        }

        //计算下层
        var tmpNexLevelInfo = reComputeLevelAndOrderNo(headSetting[i].headInfo.nextLevelInfo,level-1);
        headSetting[i].headInfo.nextLevelInfo = JSON.parse(JSON.stringify(tmpNexLevelInfo));
    }

    return headSetting;
};

var reBuildHeadSetting = function (currHeadSetting, currLevel,mergerInfo,mergeHeadName) {
    var tmpHeadSetting = [];
    //对于顶层进行合并，被选中的新增顶层节点，其余位置不变
    var tmpMergerHead = {
        currLevel:currLevel+1,
        orderNo:0,
        headInfo:{
            colspanNum:0,
            rowspanNum:1,
            headName:mergeHeadName,
            nextLevelInfo:[
            ]
        },
        colInfo:null
    };

    for(var i=0;i<mergerInfo.length;i++){
        for(var j=0;j<currHeadSetting.length;j++){
            if(mergerInfo[i].currLevel == currHeadSetting[j].currLevel && mergerInfo[i].orderNo == currHeadSetting[j].orderNo){
                tmpMergerHead.headInfo.colspanNum += currHeadSetting[j].headInfo.colspanNum;
                tmpMergerHead.headInfo.nextLevelInfo.push(JSON.parse(JSON.stringify(currHeadSetting[j])));
            }
        }
    }

    for(var m=0;m<tmpMergerHead.headInfo.nextLevelInfo.length;m++){
        tmpMergerHead.headInfo.nextLevelInfo[m].orderNo = m;
    }

    console.log(JSON.stringify(tmpMergerHead));
    var isAdd = false;
    for(var n=0;n<currHeadSetting.length;n++){
        if(parseInt(currHeadSetting[n].orderNo) < parseInt(mergerInfo[0].orderNo) || parseInt(currHeadSetting[n].orderNo) > parseInt(mergerInfo[0].orderNo)+(mergerInfo.length -1)){
            tmpHeadSetting.push(JSON.parse(JSON.stringify(currHeadSetting[n])));
        }else if(isAdd == false){
            tmpHeadSetting.push(JSON.parse(JSON.stringify(tmpMergerHead)));
            isAdd = true;
        }
    }

    //重新计算 level 和 orderNo
    tmpHeadSetting = reComputeLevelAndOrderNo(tmpHeadSetting,currLevel+1);
    console.log(JSON.stringify(tmpHeadSetting));

    return tmpHeadSetting;

};

function setMergeHead(tmp){
    if(tmp == undefined){
        tmp = "";
    }
    var str=prompt("合并表头标题",tmp);
    return str;
}

var mergerHead = function (ct_name) {
    var ctInfo = getCTInfo(ct_name);
    if(ctInfo ==null){
        return;
    }
    ct_ele = ctInfo.ct_ele;

    var selectedHead = [];
    //获取 需要合并的 表头的 level 和 orderNo
    var tds = $("th", ct_ele.find(".ct"));
    tds.filter(".ui-selected").each(function(){
        var currLevel = $(this).attr("currLevel");
        var orderNo = $(this).attr("orderNo");
        var head = {
            currLevel:currLevel,
            orderNo:orderNo
        }
        selectedHead.push(head);
    });

    console.log(JSON.stringify(selectedHead));

    //进行校验
    //1 至少选择两个单元格
    //2 必须是顶层才能合并
    if(selectedHead.length <2){
        alert("请选择至少两个顶层单元格");
        return 0;
    }

    var isNotSameLevel = false;
    var tmpLevel = -1;
    for(var i=0;i<selectedHead.length;i++){
        if(tmpLevel == -1){
            tmpLevel = selectedHead[i].currLevel;
        }

        if(tmpLevel != selectedHead[i].currLevel){
            isNotSameLevel = true;
        }
    }
    if(isNotSameLevel){
        alert("请选择同一层级单元格进行合并");
        return 0;
    }
    if(parseInt(tmpLevel) != ctInfo.ct_headSetting[0].currLevel){
        alert("请选择顶层单元格进行合并，否则请还原后重新设计表头");
        return 0;
    }

    var mergeHeadName = setMergeHead();
    if(mergeHeadName.length <=0){
        alert("合并表头标题不能为空");
        return 0;
    }

    //重新计算合并后的json对象
    ct_headSetting = reBuildHeadSetting(ctInfo.ct_headSetting,ctInfo.ct_headSetting[0].currLevel,selectedHead,mergeHeadName);

    ctInfo.ct_headSetting = ct_headSetting;
    saveCTList(ctInfo);

    reFresh(ct_ele,ct_name,ct_headSetting);

};

//获取最初的表头
var getInitHeadSetting = function (headSetting,targetSetting) {
    if(headSetting.length == 0){
        return headSetting;
    }

    for(var i=0;i<headSetting.length;i++){
        if(headSetting[i].colInfo != null){
            targetSetting.push(JSON.parse(JSON.stringify(headSetting[i])));
        }else {
            var tmp = getInitHeadSetting(headSetting[i].headInfo.nextLevelInfo,targetSetting);
            if(tmp.length >0){
                targetSetting = JSON.parse(JSON.stringify(tmp));
            }
        }
    }
    return targetSetting;
};

var resetHead = function (ct_name) {

    var ctInfo = getCTInfo(ct_name);
    if(ctInfo ==null){
        return;
    }
    ct_ele = ctInfo.ct_ele;

    var retValue = confirm("确定要还原表头吗？");
    if(!retValue){
        return 0;
    }
    var tmpHead = [];
    ct_headSetting = getInitHeadSetting(ctInfo.ct_headSetting,tmpHead);
    for(var i=0;i<ct_headSetting.length;i++){
        ct_headSetting[i].currLevel=0;
        ct_headSetting[i].orderNo = i;
        ct_headSetting[i].headInfo.colspanNum = 1;
        ct_headSetting[i].headInfo.rowspanNum = 1;
    }

    ctInfo.ct_headSetting = ct_headSetting;
    saveCTList(ctInfo);

    reFresh(ct_ele,ct_name,ct_headSetting);
};

var modifyHeadName = function (headSetting,currLevel, orderNo, newName) {

    if(headSetting.length == 0){
        return headSetting;
    }
    for(var i=0;i<headSetting.length;i++){
        if(headSetting[i].currLevel == currLevel) {
            if (headSetting[i].orderNo == orderNo) {
                headSetting[i].headInfo.headName = newName;
                if(headSetting[i].colInfo != null){
                    headSetting[i].colInfo.colName = newName;
                }

            }
        }else{
            headSetting[i] = modifyHeadName(headSetting[i].nextLevelInfo,currLevel,orderNo,newName);
        }
    }

    return headSetting;
};

var delHeadCell = function (headSetting, currLevel, orderNo) {
    var tmpSetting = [];

    var isNeedMinusLevel = false;
    //只能删除顶层
    for(var i=0;i<headSetting.length;i++){
        if(currLevel == headSetting[i].currLevel && orderNo == headSetting[i].orderNo){
            for(var j=0;j<headSetting[i].headInfo.nextLevelInfo.length;j++){
                headSetting[i].headInfo.nextLevelInfo[j].currLevel = currLevel;
                tmpSetting.push(JSON.parse(JSON.stringify(headSetting[i].headInfo.nextLevelInfo[j])));
            }
        }else{
            if(headSetting[i].headInfo.nextLevelInfo.length == 0){
                isNeedMinusLevel = true;
            }
            tmpSetting.push(JSON.parse(JSON.stringify(headSetting[i])));
        }
    }

    //如果 删除后 存在 同levle没有合并的列 则需要降一级level;
    if(isNeedMinusLevel){
        for(var i=0;i<tmpSetting.length;i++){
            tmpSetting[i].currLevel = (currLevel -1);
            tmpSetting[i].orderNo = i;
        }
    }

    return tmpSetting;

};

var reName = function (ct_name,oldName, currLevel, orderNo) {

    console.log("rename "+ct_name+" "+oldName+" "+currLevel+" "+orderNo);

    var newHeadName = setMergeHead(oldName);
    if(newHeadName == null){
        return;
    }

    var ctInfo = getCTInfo(ct_name);
    if(ctInfo ==null){
        return;
    }
    ct_ele = ctInfo.ct_ele;

    ctInfo.ct_headSetting = modifyHeadName(ctInfo.ct_headSetting,currLevel,orderNo,newHeadName);

    reFresh(ct_ele,ct_name,ctInfo.ct_headSetting);

};

var delHead = function (ct_name, currLevel, orderNo) {

    var ctInfo = getCTInfo(ct_name);
    if(ctInfo ==null){
        return;
    }
    ct_ele = ctInfo.ct_ele;

    var retValue = confirm("确定要删除吗？");
    if(!retValue){
        return 0;
    }

    ctInfo.ct_headSetting = delHeadCell(ctInfo.ct_headSetting,currLevel,orderNo);

    ctInfo.ct_headSetting = reComputeLevelAndOrderNo(ctInfo.ct_headSetting,ctInfo.ct_headSetting[0].currLevel);

    reFresh(ct_ele,ct_name,ctInfo.ct_headSetting);


};

var bindHeadEvent = function (ct_name) {
    var ctInfo = getCTInfo(ct_name);
    if(ctInfo ==null){
        return;
    }
    ct_ele = ctInfo.ct_ele;

    ct_ele.find(".rename").unbind("dblclick");
    ct_ele.find(".rename").on("dblclick",function () {
        var ele = $(this);
        var pele = ele.parent().parent();
        var tmpctname = pele.attr("ct_name");
        var tmpcurrLevel = pele.attr("currLevel");
        var tmporderNo = pele.attr("orderNo");
        var tmpheadName = pele.attr("headName");
        reName(tmpctname,tmpheadName,tmpcurrLevel,tmporderNo);
        //console.log("rename ct_name"+tmpctname);
    })

    ct_ele.find(".delhead").unbind("dblclick");
    ct_ele.find(".delhead").on("dblclick",function () {
        var ele = $(this);
        var pele = ele.parent().parent();
        var tmpctname = pele.attr("ct_name");
        var tmpcurrLevel = pele.attr("currLevel");
        var tmporderNo = pele.attr("orderNo");
        delHead(tmpctname,tmpcurrLevel,tmporderNo);
    })
};

var bindEvent = function (ct_name) {
    var ctInfo = getCTInfo(ct_name);
    if(ctInfo ==null){
        return;
    }
    ct_ele = ctInfo.ct_ele;

    var html = "<button class=\"btn btn-info ct-merger \" onclick=\"mergerHead('"+ct_name+"')\">合并</button>"+
               "<button class=\"btn btn-info ct-reset ml10\" onclick=\"resetHead('"+ct_name+"')\">还原</button>";

    ct_ele.find(".ct-btn").html("");
    ct_ele.find(".ct-btn").append(html);

    bindHeadEvent(ct_name);

    ct_ele.find(".ct-body").unbind("scroll");
    ct_ele.find(".ct-body").on("scroll",function(){
        var ele = $(this);
        var ct_name = ele.find("table").attr("ct");
        var ctInfo = getCTInfo(ct_name);
        if(ctInfo ==null){
            return;
        }
        var tmpele = ctInfo.ct_ele;
        var b = tmpele.find(".ct-body")[0].scrollLeft;
        tmpele.find(".ct-head")[0].scrollLeft=b;
    });

    //ct_ele.find(".ct-merger").unbind("click");
    //ct_ele.find(".ct-merger").click(function() {
    //    console.log("merger click");
    //    mergerHead();
    //});
    //ct_ele.find(".ct-reset").unbind("click");
    //ct_ele.find(".ct-reset").click(function() {
    //    console.log("reset click");
    //    resetHead();
    //});
};
//将表头配置转换为二维进行展示
var transHeadSetting = function (headSetting,option,level,index) {

    var currLevleOption = [];
    var retOption = [];
    //当前级没有信息了，直接返回
    if(headSetting.length == 0){
        return option;
    }

    if(option.length < index+1){
        //先占位
        option.push(currLevleOption);
    }else{
        //当前级位置已有，则进行合并
        currLevleOption = option[index];
    }


    for(var i=0;i<headSetting.length;i++){
        //取当前层信息
        if(headSetting[i].currLevel == level){
            var currInfo = JSON.parse(JSON.stringify(headSetting[i]));
            currInfo.headInfo.nextLevelInfo = [];
            currLevleOption.push(currInfo);
            option[index] = currLevleOption;
            //获取下级信息
            var tmpOption = transHeadSetting(headSetting[i].headInfo.nextLevelInfo,option,level-1,index+1);
            //合并下级信息
            if(tmpOption.length>0){
                retOption = tmpOption;
            }

        }
    }

    return retOption;

};


var createTheadContent = function(option,ct_name){
    var html="";


    for(var i=0;i<option.colHead.length;i++){
        html+= '<tr id="tr">';
        for(var j=0;j<option.colHead[i].length;j++){
            var thead = option.colHead[i][j];
            if(thead.colInfo == null){
                html += '<th  height=\"30px\" id=\"ch-'+i + thead.currLevel +'\" ct_name=\"'+ct_name+'\" headName=\"'+thead.headInfo.headName+'\" currLevel=\"'+thead.currLevel+'\" orderNo=\"'+thead.orderNo+'\" rowspan=\"'+thead.headInfo.rowspanNum+'\" colspan=\"'+thead.headInfo.colspanNum+'\"><div class=\"headdiv\" id=\"ch_'+i+'\" style="width:100%;height:100%">'+thead.headInfo.headName;
                if(i == 0){
                    html += '<span class=\"bttn delhead fr glyphicon glyphicon-remove\" ></span>';
                }
                html +='<span class=\"bttn rename fr glyphicon glyphicon-edit\" ></span></div></th>';
            }else{
                html += '<th  height=\"30px\" ct_name=\"'+ct_name+'\" headName=\"'+thead.colInfo.colName+'\" colId=\"' + thead.colId +'\" currLevel=\"'+thead.currLevel+'\" orderNo=\"'+thead.orderNo+'\" rowspan=\"'+thead.headInfo.rowspanNum+'\" colspan=\"'+thead.headInfo.colspanNum+'\"><div class=\"headdiv\" id=\"ch_'+i+'\" style="width:100%;height:100%">'+thead.colInfo.colName+'<span class=\"bttn rename fr glyphicon glyphicon-edit\" ></span></div></th>';
            }
        }

        html +='</tr>'

    }

    return html;

}

var createFixHeadTab = function(ct_name){
    var width = $("#"+ct_name)[0].clientWidth;
    var html ='<table class="ct" ct="'+ct_name+'" id="fix_'+ct_name+'" style="position:absolute;top:0px;width:calc(100% - 50px)"><thead>';
    html += $("#"+ct_name).find("thead").html();
    html +='</thead>';
    html +='</table>';

    console.log("fix head "+html);
    return html;
}

var createTabHead = function(option,ct_name){
    var html ='<table class="ct" ct="'+ct_name+'" id="'+ct_name+'"><thead>';

    //html += '<th width=\"'+option.rowHead.length*100+'px\" height=\"30px\" colspan="'+option.rowHead.length+'" ></th>';

    html += createTheadContent(option,ct_name);

    html +='</thead></table>';

    return html;
};

var createTabBody = function(option,ct_name){
    var html ='<table class="ct" ct="'+ct_name+'" id="body_'+ct_name+'"><tbody>';
    html +='<tr height=\"30px\">';
    var cnt = 0;
    var colCnt = 0;
    for(var i=0;i<option.colHead.length;i++){
        cnt = 0;
        for(var j=0;j<option.colHead[i].length;j++){
            var thead = option.colHead[i][j];
            cnt += thead.headInfo.colspanNum;
        }
        if(cnt>colCnt){
            colCnt = cnt;
        }
    }

    for(var k =0; k<colCnt;k++){
        html += '<td></td>'
    }
    html +='</tr>';
    html +='</tbody></table>';
    return html;
}

var createTab = function(option,ct_name){
    var html ='<table class="ct" ct="'+ct_name+'" id="'+ct_name+'"><thead>';

    //html += '<th width=\"'+option.rowHead.length*100+'px\" height=\"30px\" colspan="'+option.rowHead.length+'" ></th>';

    html += createTheadContent(option,ct_name);

    html +='</thead><tbody>';
    html +='<tr height=\"30px\">';


    var cnt = 0;
    var colCnt = 0;
    for(var i=0;i<option.colHead.length;i++){
        cnt = 0;
        for(var j=0;j<option.colHead[i].length;j++){
            var thead = option.colHead[i][j];
            cnt += thead.headInfo.colspanNum;
        }
        if(cnt>colCnt){
            colCnt = cnt;
        }
    }

    for(var k =0; k<colCnt;k++){
        html += '<td></td>'
    }
    html +='</tr>';
    html +='</tbody></table>';
    return html;

};

var loadData = function(ct_name,dataList){
    var ctInfo = getCTInfo(ct_name);
    if(ctInfo ==null){
        return;
    }
    var tmp_ele = ctInfo.ct_ele;

    if(dataList.length == 0){
        return;
    }
    var tmpHead = [];
    var tmp_headSetting = getInitHeadSetting(ctInfo.ct_headSetting,tmpHead);

    var html = '';

    for(var i=0;i<dataList.length;i++) {
        html += '<tr height=\"30px\">';
        var rowDataInfo = dataList[i];
        for (var j = 0; j < tmp_headSetting.length; j++) {
            var tmpData = "--";
            for (var k = 0; k < rowDataInfo.length; k++) {
                if (tmp_headSetting[j].colInfo.colId == rowDataInfo[k].colId) {
                    if(rowDataInfo[k].colValue !=null){
                        tmpData = rowDataInfo[k].colValue;
                    }
                }
            }

            html += '<td>'+tmpData+'</td>'

        }
        html += '</tr>';
    }

    tmp_ele.find(".ct-body-i tbody").html("");

    tmp_ele.find(".ct-body-i tbody").append(html);

};

var ShowSelected = function () {
    var isEmpty = true;
    //var tds = $("th,td", $("#ct"));
    var tds = $("th", $(".ct"));
    var msg = "";
    tds.filter(".ui-selected").each(function(){
        msg += ("#" + (tds.index(this) + 1) + " ");
        var currLevel = $(this).attr("currLevel");
        var orderNo = $(this).attr("orderNo");
        msg += (" [" + currLevel + ","+orderNo+"] ");
        isEmpty = false;
    });
    console.log(msg);
    if (isEmpty){
        console.log("未选择");
    }
};

var reFresh = function (ele,ct_name,headSetting) {
    var tmpOption = [];
    var tmpLevel = 0;
    ct_headSetting = JSON.parse(JSON.stringify(headSetting));
    if(headSetting.length>0){
        tmpLevel =  headSetting[0].currLevel
    }
    var option = transHeadSetting(headSetting,tmpOption,tmpLevel,0);
    console.log(JSON.stringify(option));
    ct_option.colHead = option;
    var headHtml = createTheadContent(ct_option,ct_name);

    ele.find(".ct-head-i thead").html("");
    ele.find(".ct-head-i thead").append(headHtml);

    //var fixHead = createFixHeadTab(ct_name);
    //
    //ele.find(".custTable").append(fixHead);

    ct_ele.find(".ct").selectable({stop: ShowSelected});

    bindHeadEvent(ct_name);


};

var init = function(ele,ct_name,headSetting){
    console.log("custTable:"+ct_name+" init");
    ct_ele = ele;
    var tmpOption = [];
    var tmpLevel = 0;
    ct_headSetting = JSON.parse(JSON.stringify(headSetting));
    if(headSetting.length>0){
        tmpLevel =  headSetting[0].currLevel
    }
    var option = transHeadSetting(headSetting,tmpOption,tmpLevel,0);
    console.log(JSON.stringify(option));
    ct_option.colHead = option;

    var tmpCt = {
        ct_name:ct_name,
        ct_ele:ele,
        ct_headSetting:headSetting,
        ct_option:ct_option
    };

    saveCTList(tmpCt);

    //var tabHtml = createTab(ct_option,ct_name);
    var tabHeadHtml = createTabHead(ct_option,ct_name);
    ele.find(".custTable .ct-head-i").html("");
    ele.find(".custTable .ct-head-i").append(tabHeadHtml);

    var tabBodyHtml = createTabBody(ct_option,ct_name);
    ele.find(".custTable .ct-body-i").html("");
    ele.find(".custTable .ct-body-i").append(tabBodyHtml);


    //var fixHead = createFixHeadTab(ct_name);
    //
    //ele.find(".custTable").append(fixHead);


    ele.find(".ct").selectable({stop: ShowSelected});


    //绑定事件
    bindEvent(ct_name);
};