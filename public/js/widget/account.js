/**
 * Created by Administrator on 2015/8/26.
 */
define(['jquery','moment','avalon', "domReady!"], function($,moment) {
    $("#call_help").click(function(){
        if($("#helpers").is(":visible")){
            $("#helpers").hide();
        }else{
            $("#helpers").show();
        }
    });
    var appidToName = {
        5: "数说风云-微博版",
        12: "数说风云-微信版",
        4: "数说传播-微博版",
        14: "数说传播-H5版",
        7:"数说舆情-微博版",
        13:"数说口碑"
    };
    var vipType = {
        0 : {
            name : "体验版",
            css: 'version-free'
        },
        1: {
            name:"基础版",
            css: "version-base"
        },
        2: {
            name: "高级版",
            css: "version-high"
        },
        3: {
            name: "豪华版",
            css: "version-high"
        }

    };
    var model = {
        accountDisplay: "none",
        productDisplay: "none",
        contactDisplay: "none",
        nameLineHeight:"",
        appid:"",
        appName: "",
        appVersion: "",
        appVersionCss:"",
        expiredTip:"",// 已过期显示信息
        isExpired: false, // 是否已过期
        curTime:"",
        name:"",
        head: ""
    };
    var fn = {
        productClick: function() {
            avalonData.productDisplay = "block";
            $("#marker").show();
        },
        tipClose: function() {
            avalonData.productDisplay = "none";
            $("#marker").hide();
        },
        contactClose: function() {
            avalonData.contactDisplay = "none";
        },
        contactOpen: function() {
            window.open("http://wpa.qq.com/msgrd?v=3&uin=1722054484&site=qq&menu=yes");
            avalonData.contactDisplay = "none";
        },
        showPay: function(appid) {
            //if(appid == 5 || appid == 4 || appid == 7) {
            //    avalonData.$fire("all!payDisplay","block");
            //    avalonData.$fire("all!appid", appid);
            //} else {
                avalonData.contactDisplay = "block";
            //}
        }
    };

    var avalonData = null;

    return {
        init: function(conf) {
            //初始化数据访问模块，在页面加载时需要请求的数据请求回来
            avalonData = avalon.define($.extend(conf,model,fn));

            //console.log(avalonData);

            //对avalon对象进行扫描，执行页面渲染
            avalon.scan();
        },
        prepare: {
            watch: function() {
                avalonData.$watch("contactDisplay", function(v){
                    avalonData.contactDisplay = v;
                });
            },
            render: function() {
                $.ajax({
                    beforeSend: function () {
                    },
                    dataType:"json",
                    type:"get",
                    data:{
                    },
                    url: "/account/ajax/accountInfo",
                    success: function (result) {
                        //console.log(result);
                        var data = result.account;
                        avalonData.name = data.name ? data.name : "数说用户";
                        if(avalonData.name.length > 15) {
                            avalonData.nameLineHeight="name-hover-line-height";
                        } else if (avalonData.name.length > 12) {
                            avalonData.nameLineHeight="name-hover";
                        }
                        var headsrc = "/resources/images/portrait.png";
                        if(data.accountWeibo != null) {
                            headsrc = data.accountWeibo.head;
                        }
                        avalonData.head = headsrc;
                        avalonData.appid = result.vipInfo.appid;
                        avalonData.appName = appidToName[result.vipInfo.appid];
                        if(result.vipInfo.vipType < 3) {
                            avalonData.appVersion = vipType[result.vipInfo.vipType].name;
                            avalonData.appVersionCss = vipType[result.vipInfo.vipType].css;
                        }
                        if(result.vipInfo.endTime) {
                            avalonData.curTime = moment(result.vipInfo.endTime).format("YYYY-MM-DD");
                            if(!moment(avalonData.curTime).isAfter(moment())){
                                avalonData.isExpired = true;
                                avalonData.expiredTip = "已过期";
                            }
                        } else {
                            if (avalonData.appid == 12 && data.createTime) { // 如果是风云，显示体验期数
                                avalonData.isExpired = true;
                                var day = 7 - moment().diff(moment(data.createTime), 'days');
                                day = day > 0 ? day : 0;
                                avalonData.expiredTip = "还可以体验"+ day + "天";
                            }
                            avalonData.curTime = "---";
                        }
                        avalonData.accountDisplay = "block";
                    }
                });
                $.get("/sysmsg/getCount", {}, function(result){
                    if(result.state == "success"){
                        if(result.allMsg == 0){
                            $("#sysmsg").hide();
                        }else if(result.notReadMsg == 0){
                            $("#my-msg").html('');
                            $("#sysmsg-notice").hide();
                        }else{
                            $("#my-msg").html('(' + result.notReadMsg + ')');
                            $("#sysmsg-notice").show();
                        }
                    }
                });
            }
        }
    };
});