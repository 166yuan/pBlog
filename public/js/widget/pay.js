/**
 * Created by Administrator on 2015/8/26.
 */
define(['jquery',"moment",'avalon', "domReady!"], function($,moment) {
    var appidToName = {
        5: "数说风云微博版",
        12: "数说风云微信版",
        4: "数说传播微博版",
        14: "数说传播H5版",
        7:"数说舆情微博版",
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
        payDisplay:"none",
        name: "数说传播微博版",
        appid: "",
        createTime: "", // 注册时间
        curVersion: vipType["2"],
        curTime: "",
        payVIPType: 1,// 升级的VIP版本
        payVIPTypeName: "基础版", //
        payMonth: 1, // 购买时长
        isUerPoint: false, // 是否使用点数
        payExpireTime : "", // 购买后新的截止日期
        remainPoint: "", // 目前剩余点数
        pointToMoney: "", // 剩余点数可换的钱
        totalMoney: "0", // 购买本次总共需要的钱
        payMoney: "0", // 实际需要支付的钱
        payPoint:"0", // 实际消耗点数
        payPointToMoney: "0", // 消耗点数抵扣的钱
        saveMoney: 0, // 计算基础版升级到高级版的时候，剩余基础版月数能抵消购买高级版的金额
        moneySaveTip: "", // 减免差价的提示
        hiddenMonth: 0, // 当前基础版剩余月份
        actLoading: "inline-block",
        actFinish: "none",
        actPay: "none"

    };
    var vipInfo; // VIP信息
    var payact;
    var priceList; // 后台返回的资费说明
    var fn = {
        payClose: function() {
            avalonData.payDisplay = "none";
        },
        payAction: function() { // 点击购买后的动作
            avalonData.actPay = "none";
            avalonData.actLoading = "inline-block";
            payact = {};
            payact.finalurl = window.location.href;
            payact.addVipType = parseInt(avalonData.payVIPType);
            payact.addMonth = parseInt(avalonData.payMonth);
            var isUsePoint = avalonData.isUerPoint;
            if(isUsePoint){
                payact.usePoint = true;
            }
            //payact.appid = avalonData.appid;
            payact.appid = avalonData.appid;

            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: "post",
                'url': "/payment/ajax/checkForm",
                'data': JSON.stringify(payact),
                'dataType': 'json',
                'success': function(result){
                    if(result.state == 'success'){
                        if(result.price == 0){
                            window.location.href = "/payment/payResult?paymentid=" + result.paymentid;
                            return;
                        }
                        //payUpdateDom.find("[data-action='loading']").hide();
                        //payUpdateDom.find("[data-action='finish']").show();
                        avalonData.actLoading = "none";
                        avalonData.actFinish = "inline-block";
                        payact.paymentid = result.paymentid;
                        if(payact.paymentid){
                            var $tempForm = $('<form method="post" action="/payment/alipay"><input type="hidden" name="paymentid" value="'+payact.paymentid+'"/><input type="hidden" name="appid" value="'+payact.appid+'" /></form>');
                            $("body").append($tempForm);
                            $tempForm.attr('target', '_blank');
                            $tempForm.submit();
                            $tempForm.remove();
                        }
                    }else{
                        alert("服务系统出现故障，请刷新页面后再填写。");
                    }
                }
            });
        },
        finishAction : function() {
            if(!payact.paymentid){
                alert("未找到订单, 请重试");
                window.location.href = "/monitor/list";
            }
            avalonData.actPay = "none";
            avalonData.actFinish = "none";
            avalonData.actLoading = "inline-block";
            window.location.href = "/payment/payResult?paymentid=" + payact.paymentid + "&appid=" + payact.appid;
        }
    };
    var checkPay = function() {
        //console.log("checkPay");
        //debugger;
        avalonData.payVIPTypeName = vipType[avalonData.payVIPType].name;
        avalonData.totalMoney = avalonData.payMonth * priceList[avalonData.appid][avalonData.payVIPType].monthPrice;
        if(avalonData.payVIPType <= vipInfo[avalonData.appid].vipType && avalonData.curTime && moment(avalonData.curTime).isAfter(moment())){
            avalonData.payExpireTime = moment(avalonData.curTime).add('d', avalonData.payMonth * 30).format("YYYY-MM-DD");
        }else{
            avalonData.payExpireTime = moment().add('d', avalonData.payMonth * 30).format("YYYY-MM-DD");
        }
        avalonData.payMoney = avalonData.payMonth * priceList[avalonData.appid][avalonData.payVIPType].monthPrice - avalonData.saveMoney;
        if(avalonData.isUerPoint) {
            if(parseFloat(avalonData.remainPoint) > parseFloat(avalonData.payMoney) * 50) {
                avalonData.payPoint = avalonData.payMoney * 50;
            } else {
                avalonData.payPoint = avalonData.remainPoint;
            }
            avalonData.payMoney = (parseFloat(avalonData.payMoney) * 1000 - parseFloat(avalonData.pointToMoney) * 1000) / 1000;
        } else {
            avalonData.payPoint = 0;
        }
        if(parseFloat(avalonData.payMoney) <= 0) {
            avalonData.payMoney = 0;
        }
        avalonData.payPointToMoney = parseFloat(avalonData.payPoint) / 50;
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
                avalonData.$watch("payDisplay", function(v) {
                    v == "none" ? $("#marker").hide() : $("#marker").show();
                    avalonData.payDisplay = v;
                });
                avalonData.$watch("appid", function(id){
                    avalonData.appid = id;
                    avalonData.name = appidToName[id];
                    var version = vipInfo[id].vipType;
                    avalonData.curVersion = vipType[version];
                    if(vipInfo[id].endTime) {
                        avalonData.curTime = moment(vipInfo[id].endTime).format("YYYY-MM-DD");
                        if(!moment(vipInfo[id].endTime).isAfter(moment())){
                                avalonData.curTime = "已过期";
                            }
                    } else if (id == 12) {
                        var day = 7 - moment().diff(moment(avalonData.createTime), 'days');
                        day = day > 0 ? day : 0;
                        avalonData.curTime = "还可以体验"+ day + "天";
                    } else {
                        avalonData.curTime = "---";
                    }
                    
                    avalonData.payVIPType = vipInfo[id].vipType == 0 ? 1 : vipInfo[id].vipType;
                    avalonData.payVIPTypeName = vipType[avalonData.payVIPType].name;
                    checkPay();
                });
                avalonData.$watch("isUerPoint", function(v) { // 点击使用点数支付修改消耗的点数和钱
                    avalonData.isUerPoint = v;
                    checkPay();
                });
                avalonData.$watch("payVIPType" ,function(type){ // 更改购买的版本
                    avalonData.moneySaveTip = "";
                    avalonData.hiddenMonth = 0;
                    $("select[name='monthCount']").html('<option value="1">1月(30天)</option> <option value="2">2月(60天)</option> <option value="3">3月(90天)</option> <option value="4">4月(120天)</option> <option value="5">5月(150天)</option> <option value="6">6月(180天)</option> <option value="7">7月(210天)</option> <option value="8">8月(240天)</option> <option value="9">9月(270天)</option> <option value="10">10月(300天)</option> <option value="11">11月(330天)</option> <option value="12">12月(360天)</option>');
                    if(vipInfo[avalonData.appid].vipType !=0 && type > vipInfo[avalonData.appid].vipType){
                        avalonData.moneySaveTip = "计算中...";
                        avalonData.actLoading = "inline-block";
                        avalonData.actPay = "none";
                        //不能显示之前的月份
                        avalonData.hiddenMonth = moment(avalonData.curTime).diff(moment(),'months');
                        if(avalonData.hiddenMonth >= 12){
                            $("#moneySave").html("基础版本超过12个月,无法升级为高级版,请联系客服");
                            avalonData.actLoading = "none";
                            avalonData.actPay = "inline-block";
                            //payUpdateDom.find("[data-action='loading']").hide();
                            //payUpdateDom.find("[data-action='pay']").show();
                            return;
                        }
                        $("select[name='monthCount'] option").each(function(){
                            if($(this).val() <= avalonData.hiddenMonth){
                                $(this).remove();
                            }
                        });
                        avalonData.payMonth = avalonData.hiddenMonth + 1;
                        //计算抵消金额
                        $.get("/payment/ajax/showSaveMoney", {"payType": type,"appid":avalonData.appid}, function(result){
                            avalonData.actLoading = "none";
                            avalonData.actPay = "inline-block";
                            if(result.success){
                                avalonData.saveMoney = result.saveMoney;
                                avalonData.moneySaveTip = "（您当前基础版剩余 " + avalonData.hiddenMonth + " 个月，升级高级版减免差价 <span class=\"pay-tip\">" + avalonData.saveMoney + "</span> 元。）";
                                checkPay();
                            }
                        });
                    }else{
                        avalonData.saveMoney = 0;
                        checkPay();
                    }
                });
                avalonData.$watch("payMonth", function(){
                    checkPay();
                });
            },
            render: function() {
                $.ajax({
                    dataType: "json",
                    type: "get",
                    data: {
                    },
                    url: "/vip/ajax/getPoint",
                    success: function(result){
                        //console.log(result);
                        avalonData.remainPoint = result.usePoint;
                        avalonData.pointToMoney = (avalonData.remainPoint * 2 / 100);
                    }
                });
                $.ajax({
                    dataType: "json",
                    type: "get",
                    data: {
                    },
                    url: "/vip/ajax/getVipPrice",
                    success: function(result){
                        //console.log(result);
                        priceList = result.priceMap;
                        $.get("/vip/ajax/getVipInfo", function(result){
                            if(result.state == "success"){
                                //console.log(result);
                                vipInfo = result.vipInfo;
                                avalonData.createTime = result.createTime;
                                avalonData.actLoading = "none";
                                avalonData.actPay = "inline-block";

                                if(window.location.search.match("showpay")) {
                                    $.get("/account/getAppid", {}, function(result){
                                        if(result.success){
                                            var appid = result.appid;
                                            avalonData.appid = appid;
                                            //avalonData.payDisplay = "block";  // 显示升级续费款
                                            avalonData.$fire("all!contactDisplay","block"); // 显示联系客服
                                        }
                                    });
                                }
                            }
                        });
                    }
                });

            }
        }
    };
});