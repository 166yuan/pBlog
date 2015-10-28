/**
 * Created by Administrator on 2015/8/26.
 */
define(['jquery',"moment",'avalon', "domReady!"], function($,moment) {
    var nameToAppid = {
        vfengyun: 5,
        social: 12,
        vfenxi: 4,
        chuanbo:14,
        vyuqing: 7,
        koubei: 13
    };
    var viptypeArr = {
        0 : {
            name : "体验版",
            icon: 'version-free'
        },
        1 : {
            name: "基础版",
            icon: 'version-base'
        },
        2 : {
            name: "高级版",
            icon: 'version-high'
        },
        3: {
            name: "豪华版",
            css: "version-high"
        }
    };
    var model = {
        btnText: '<button class="l-btn-normal" ms-click="showPay(el.id)">升级/续费</button>',
        detail: [
            {
                id: "vfengyun",
                name: '数说风云微博版',
                icon: 'icon-img icon-fengyun-g',
                version: "",
                versionCss: "",
                endDate: ""
            }, {
                id: "social",
                name: '数说风云微信版',
                icon: 'icon-img icon-fengyun-g',
                version: "",
                versionCss: "",
                endDate: ""
            }, {
                id: "vfenxi" ,
                name: '数说传播微博版',
                icon: 'icon-img icon-chuanbo-g',
                version: "",
                versionCss: "",
                endDate: ""
            }, {
                id: "chuanbo" ,
                name: '数说传播H5版',
                icon: 'icon-img icon-chuanbo-g',
                version: "",
                versionCss: "",
                endDate: ""
            },{
                id: "vyuqing" ,
                name: '数说舆情微博版',
                icon: 'icon-img icon-yuqing-g',
                version: "",
                versionCss: "",
                endDate: ""
            },{
                id: "koubei" ,
                name: '数说口碑',
                icon: 'icon-img icon-koubei-g',
                version: "",
                versionCss: "",
                endDate: ""
            }

        ]

    };
    var fn = {
        showPay: function(name) {
            //var appid = nameToAppid[name];
            //if(appid == 5 || appid == 4 || appid == 7) {
            //    avalonData.$fire("all!payDisplay","block");
            //    avalonData.$fire("all!appid", appid);
            //} else {
                avalonData.$fire("all!contactDisplay","block");
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
            render: function() {
                $.get("/vip/ajax/getVipInfo", function(result){
                    if(result.state == "success"){
                        //vipInfo = result.vipInfo;
                        var appidarr = ["5","12", "4", "14", "7", "13"]; // 目前产品APPID，对应detail
                        for(var i = 0; i < appidarr.length; i++) {
                            var vipinfo = result.vipInfo[appidarr[i]];
                            if(vipinfo.vipType < 3) {
                                avalonData.detail[i].version = viptypeArr[vipinfo.vipType].name;
                                avalonData.detail[i].versionCss = viptypeArr[vipinfo.vipType].icon;
                            } else {
                                avalonData.detail[i].version = "豪华版"
                                avalonData.detail[i].versionCss = viptypeArr["2"].icon;
                            }
                            
                            if(vipinfo.endTime) {
                                avalonData.detail[i].endDate = moment(vipinfo.endTime).format("YYYY-MM-DD");
                            } else {
                                avalonData.detail[i].endDate = "---";
                                if(avalonData.detail[i].id == "social" && result.createTime) { // 数说风云显示还可以体验天数
                                    var day = 7 - moment().diff(moment(result.createTime), 'days');
                                    day = day > 0 ? day : 0;
                                    avalonData.detail[i].endDate = "还可以体验"+ day + "天";
                                }
                            }
                        }
                    }
                });
            }
        }
    };
});