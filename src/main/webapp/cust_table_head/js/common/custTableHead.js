/**
 * Created by shangfeng on 2018/6/28.
 */

(function () {
    if (typeof jQuery !== 'undefined' && jQuery.fn.extend) {
        jQuery.fn.extend({
            //初始化调用
            CTHead: function CTHead(headSetting) {
                init(this,headSetting);
            },
            CTLoadData:function CTLoadData(param){
                loadData(param);
            }


        })
    }
})();


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

function setMergeHead(){
    var str=prompt("合并表头标题","");
    return str;
}

var mergerHead = function () {
    var selectedHead = [];
    //获取 需要合并的 表头的 level 和 orderNo
    var tds = $("th", $("#ct"));
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
    if(tmpLevel != ct_headSetting[0].currLevel){
        alert("请选择顶层单元格进行合并，否则请还原后重新设计表头");
        return 0;
    }

    var mergeHeadName = setMergeHead();
    if(mergeHeadName.length <=0){
        alert("合并表头标题不能为空");
        return 0;
    }

    //重新计算合并后的json对象
    ct_headSetting = reBuildHeadSetting(ct_headSetting,ct_headSetting[0].currLevel,selectedHead,mergeHeadName);

    init(ct_ele,ct_headSetting);

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

var resetHead = function () {

    var retValue = confirm("确定要还原表头吗？");
    if(!retValue){
        return 0;
    }
    var tmpHead = [];
    ct_headSetting = getInitHeadSetting(ct_headSetting,tmpHead);
    for(var i=0;i<ct_headSetting.length;i++){
        ct_headSetting[i].currLevel=0;
        ct_headSetting[i].orderNo = i;
        ct_headSetting[i].headInfo.colspanNum = 1;
        ct_headSetting[i].headInfo.rowspanNum = 1;
    }

    init(ct_ele,ct_headSetting);
};

var bindEvent = function () {
    $('#ct-merger').unbind("click");
    $('#ct-merger').click(function() {
        console.log("merger click");
        mergerHead();
    });
    $('#ct-reset').unbind("click");
    $('#ct-reset').click(function() {
        console.log("reset click");
        resetHead();
    });
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
var createTab = function(option){
    var html ='<table class="ct" ct="ct" id="ct"><thead>';

    //html += '<th width=\"'+option.rowHead.length*100+'px\" height=\"30px\" colspan="'+option.rowHead.length+'" ></th>';

    var colCnt = 0;
    var cnt = 0;
    for(var i=0;i<option.colHead.length;i++){
        cnt = 0;
        html+= '<tr id="tr">';
        for(var j=0;j<option.colHead[i].length;j++){
            var thead = option.colHead[i][j];
            if(thead.colInfo == null){
                html += '<th width=\"100px\" height=\"30px\" id=\"ch-'+i + thead.currLevel +'\" currLevel=\"'+thead.currLevel+'\" orderNo=\"'+thead.orderNo+'\" rowspan=\"'+thead.headInfo.rowspanNum+'\" colspan=\"'+thead.headInfo.colspanNum+'\"><div class=\"headdiv\" id=\"ch_'+i+'\" style="width:100%;height:100%">'+thead.headInfo.headName+'</div></th>';
            }else{
                html += '<th width=\"100px\" height=\"30px\" colId=\"' + thead.colId +'\" currLevel=\"'+thead.currLevel+'\" orderNo=\"'+thead.orderNo+'\" rowspan=\"'+thead.headInfo.rowspanNum+'\" colspan=\"'+thead.headInfo.colspanNum+'\"><div class=\"headdiv\" id=\"ch_'+i+'\" style="width:100%;height:100%">'+thead.colInfo.colName+'</div></th>';
            }
            cnt += thead.headInfo.colspanNum;
        }
        if(cnt>colCnt){
            colCnt = cnt;
        }

        html +='</tr>'

    }
    html +='</thead><tbody>';
    html +='<tr height=\"30px\">';
    //for(var i=0;i<option.rowHead.length;i++){
    //    var chead = option.rowHead[i];
    //    if(i<option.rowHead.length-1){
    //        html += '<td width=\"100px\" height=\"30px\" head=\"head\" index=\"'+chead.orderNo+'\" id="rh-'+i+chead.colName+'"><div class=\"headdiv\" id=\"rh_'+i+'\"><span style="cursor:pointer">'+chead.colName+'</span></div></td>';
    //    }else {
    //        html += '<td width=\"100px\" height=\"30px\" head=\"head\" index=\"'+chead.orderNo+'\" id="rh-'+i+chead.colName+'"><div class=\"headdiv\" id=\"rh_'+i+'\" style="width:100%;height:100%"></div></td>';
    //    }
    //}
    for(var k =0; k<colCnt;k++){
        html += '<td></td>'
    }
    html +='</tr>';
    html +='</tbody></table>';
    return html;

};

var loadData = function(param){

};

var ShowSelected = function () {
    var isEmpty = true;
    //var tds = $("th,td", $("#ct"));
    var tds = $("th", $("#ct"));
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


var init = function(ele,headSetting){
    console.log("custTable init");
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
    var tabHtml = createTab(ct_option);
    ele.html("");
    ele.append(tabHtml);

    $("#ct").selectable({stop: ShowSelected});

    //绑定拖拽事件
    bindEvent();
};