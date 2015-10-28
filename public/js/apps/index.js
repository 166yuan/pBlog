define(['jquery','avalon', "domReady!"],function  ($) {
    // body...
    var avalonData = null;
    var model = {
        showModal : false,
        showLogin : false,
        showRegister : false,
        navMenu:["文章","分类","标签","收藏","关于"]
    };

    var fn = {
        triggerModal:function (index) {
           switch(index) {
               case 1:
               avalonData.showModal = true;
               avalonData.showLogin = true;     
                   break;
               case 2:
               avalonData.showModal = true;
               avalonData.showRegister = true;    
                   break;
               default:
               avalonData.showModal = false;
               avalonData.showLogin = false;
               avalonData.showRegister = false;    
           }
        }
    };

    return {
        init: function(conf){
            avalonData = avalon.define($.extend(conf,model,fn));
            avalon.scan();
        },
        prepare: {

        }
    };
});