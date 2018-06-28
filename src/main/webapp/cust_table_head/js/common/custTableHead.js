/**
 * Created by shangfeng on 2018/6/28.
 */

(function () {
    if (typeof jQuery !== 'undefined' && jQuery.fn.extend) {
        jQuery.fn.extend({
            //初始化调用
            CTHead: function CTHead() {
                init(this);
            }

        })
    }
})();
var ct_ele;
var ct_option = {
    name:"ct",
    colHead:[

        {
            orderNo:0,
            colName:"",
            colNameValue:"",
            dataType:1,
            relaType:1,
            caName:"",
            caUnit:"",
            isHide:"1",
            totalStyle:"",
            totalStyleType:"",

            totalStyleExp:"",
            unitCode:"",
            indexUnitType:""
        },
    ],
    rowHead:[

        {
            orderNo:0,
            colName:"",
            colNameValue:"",
            dataType:2,
            relaType:2,
            caName:"",
            caUnit:"",
            isHide:"",
            totalStyle:"1",
            totalStyleType:"",

            totalStyleExp:"",
            unitCode:"",
            indexUnitType:""
        },
    ],
};

var createTab = function(option){
    var html ='<table class="ct" ct="ct"><thead><tr id="tr">';

    html += '<th width=\"'+option.rowHead.length*100+'px\" height=\"30px\" colspan="'+option.rowHead.length+'" ></th>';

    var colCnt = 0;
    var cnt = 0;
    for(var i=0;i<option.colHead.length;i++){
        var thead = option.colHead[i];
        if(thead.isHide == 1){
            if(i<option.colHead.length-1){
                html += '<th width=\"100px\" height=\"30px\" style="position: relative" id=\"ch-'+i + thead.colName + '\"><div class=\"headdiv\" id=\"ch_'+i+'\"><span style="cursor:pointer">'+thead.caName+'</span>'+showUnit(thead.caUnit)+'</div><div class="img" id="ch_'+i+'_img" style="display:none;"><img class="imgdelete" src="images/delete.png"></div></th>';
            }else {
                html += '<th width=\"100px\" height=\"30px\" id=\"ch-'+i + thead.colName +'\"><div class=\"headdiv\" id=\"ch_'+i+'\" style="width:100%;height:100%">'+thead.caName+'</div></th>';
            }
            cnt++;
            if(cnt>colCnt){
                colCnt = cnt;
            }
        }
    }
    html +='</tr></thead><tbody>';
    html +='<tr height=\"30px\">';
    for(var i=0;i<option.rowHead.length;i++){
        var chead = option.rowHead[i];
        if(i<option.rowHead.length-1){
            html += '<td width=\"100px\" height=\"30px\" head=\"head\" index=\"'+chead.orderNo+'\" id="rh-'+i+chead.colName+'"><div class=\"headdiv\" id=\"rh_'+i+'\"><span style="cursor:pointer">'+chead.caName+'</span><div class="img" id="rh_'+i+'_img" style="display:none"><img class="imgdelete" src="images/delete.png"></div></div></td>';
        }else {
            html += '<td width=\"100px\" height=\"30px\" head=\"head\" index=\"'+chead.orderNo+'\" id="rh-'+i+chead.colName+'"><div class=\"headdiv\" id=\"rh_'+i+'\" style="width:100%;height:100%"></div></td>';
        }
    }
    for(var k =0; k<colCnt;k++){
        html += '<td></td>'
    }
    html +='</tr>';
    html +='</tbody></table>';
    return html;

};

var init = function(ele){
    console.log("custTable init");
    ct_ele = ele;
    var tabHtml = createTab(ct_option);
    ele.html("");
    ele.append(tabHtml);
    //绑定拖拽事件
    //bindEvent(ct_option);
};