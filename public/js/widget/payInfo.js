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
            icon: "version-high"
        }
    };
    var model = {
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
            //console.log(name);
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
            }
        }
    };
});