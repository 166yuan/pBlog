/**
 * Created by Administrator on 2015/8/26.
 */
define(['jquery','avalon', "domReady!"], function($) {
    var model = {
        weiboDisplay: "none",
        id:"",
        company: "",
        contact: "",
        phone: "",
        email: "",
        accountWeibo: null
    };
    var fn = {};

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
                        var data = result.account;
                        avalonData.id = data.id;
                        avalonData.company = data.name;
                        avalonData.contact = data.contacts;
                        avalonData.phone = data.phone;
                        avalonData.email = data.email;
                        avalonData.accountWeibo = data.accountWeibo;
                        avalonData.weiboDisplay = "block";
                    }
                });
            }
        }
    };
});