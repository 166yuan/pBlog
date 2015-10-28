/**
 * Created by Administrator on 2015/8/26.
 */
define(['jquery','avalon', "domReady!","validate"], function($) {
    $("#changePasswordForm").validate({
        errorElement: "span",// 使用"div"标签标记错误， 默认:"label"
        errorClass: "error2",// 默认为错误的样式类为：error
        rules: {
            oldpwd: {
                rangelength: [6, 18],
                remote: {
                    url: "/account/ajax/checkPermission",
                    type: "get",
                    data: {
                        phone: function () {
                            return $("#oldpwd").val();
                        }
                    }
                },
                required: true
            },
            pwd: {
                rangelength: [6, 18],
                required: true
            },
            againPwd: {
                required: true,
                equalTo: "#pwd"
            }
        },
        messages: {
            oldpwd: {
                rangelength: $.validator.format("<span class='noticet-tip'>密码需要{0}-{1}个字符</span>"),
                remote: "<span class='noticet-tip'>此密码与您的原密码不相符合</span>",
                required: "<span class='noticet-tip'>请填写原密码</span>"
            },
            pwd: {
                rangelength: $.validator.format("<span class='noticet-tip'>密码需要{0}-{1}个字符</span>"),
                required: "<span class='noticet-tip'>请填写新密码</span>"
            },
            againPwd: {
                required: "<span class='noticet-tip'>请填写确认密码</span>",
                equalTo: "<span class='noticet-tip'>两次密码填写不一致</span>"
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        success: function (label) {
            label.addClass("leo-tick");
            label.addClass("leo-correct");
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
    var model = {
        oldpwd:"",
        pwd: "",
        againPwd: ""
    };
    var fn = {
        subClick: function() {
            $.post("/account/changePasswordAccount",{
                oldpwd: avalonData.oldpwd,
                pwd: avalonData.pwd,
                againPwd: avalonData.againPwd
            },function(result){
                if(result.message == "success"){
                    alert("密码修改成功，请重新登录!");
                    window.location.href = result.finalUrl;
                    window.event.returnValue = false;
                }else{
                    alert("修改密码失败，请重试!");
                }
            });
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
        }
    };
});