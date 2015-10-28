/**
 * Created by Administrator on 2015/8/26.
 */
define(['jquery','avalon', "domReady!"], function($) {
    var nameToAppid = {
        vfengyun: 5,
        social: 12,
        vfenxi: 4,
        chuanbo:14,
        vyuqing: 7,
        iwom: 13
    };
    var appidToName = {
        5:"vfengyun",
        12:"social",
        4: "vfenxi",
        14:"chuanbo",
        7:"vyuqing",
        13:"iwom"
    };
    var allCharge = {
        vfengyun: {
            id: "vfengyun",
            trial: "",
            trialDetail: "",
            trialUrl: "http://f.datastory.com.cn/list",
            basic: "",
            advanced: "",
            showContact: false, // 联系客服
            showPayPage: true, // 立即购买
            detail: [
                ['简单排行榜（粉丝数、互动数）','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['高级排行榜（真粉数、新增粉、活跃度）','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['粉丝分析（男女、年龄、认证、粉丝数分布）','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['可分析和监控的帐号数','分析和监控1个帐号（自己）','50个','200个'],
                ['可更换监控的账号数', '—', '10个', '不限']
            ]
        },
        social: {
            id: "social",
            trial: "",
            trialDetail: "",
            trialUrl: "http://social.datastory.com.cn/list",
            basic: "",
            advanced: "",
            showContact: true, // 联系客服
            showPayPage: false, // 立即购买
            detail: [
                ["中国微信品牌排行榜","前10页",'<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['微信自媒体大号榜','前10页','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['公众号详情','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['公众号搜索','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['批量导入','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['自定义榜单手动排序','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['自定义榜单包含公众号数量','50个','50个','200个'],
                ['可更换监控的公众号数量', '—', '10个', '不限']
            ]
        },
        vfenxi: {
            id: "vfenxi" ,
            trial: "",
            trialDetail: "",
            trialUrl: "http://t.datastory.com.cn/stats/list",
            basic: "",
            advanced: "",
            showContact: false, // 联系客服
            showPayPage: true, // 立即购买
            detail: [
                ['基础分析','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['高级分析（情感分析、爱好分析）','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['短链分析','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['点赞分析','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['分析上限','单条1000(转发数)','单条10w（转发数/评论数/点赞数）','单条50w（转发数/评论数/点赞数）'],
                ['月条数','每月3条免费','50条','200条']
            ]
        },
        vyuqing: {
            id: "vyuqing" ,
            trial: "",
            trialDetail: "",
            trialUrl: "http://q.datastory.com.cn/monitor/list",
            basic: "",
            advanced: "",
            showContact: false, // 联系客服
            showPayPage: true, // 立即购买
            detail: [
                ['可监控任务数','1','5','20'],
                ['单任务关键词数','5','5','10'],
                ['单任务过滤词数','5','5','10'],
                ['类型选择(原创、认证用户、含图片、水军过滤)','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['地区选择','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['情感分析','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['数据结果多维度筛选','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['历史数据','最近1小时','最近1小时','最近7天']
            ]
        },
        iwom: {
            id: "koubei" ,
            trial: "",
            trialDetail: "",
            trialUrl: "http://iwom.datastory.com.cn/monitor/list?domain=datastory.com.cn&brand=%E6%95%B0%E8%AF%B4&version=0.2.8",
            basic: "",
            advanced: "",
            showContact: true, // 联系客服
            showPayPage: false, // 立即购买
            detail: [
                ['品牌概况','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['深度分析','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['数据表格','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['消费者洞察','<i class="leo-tick"></i>','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['话题配置','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['监控数量','—','3品牌/任务*1','10品牌/任务*1'],
                ['历史数据','—','最近1天','最近30天']
            ]
        },
        tmp: {
            id: "social",
            trial: "",
            trialDetail: "",
            trialUrl: "http://social.datastory.com.cn/list",
            basic: "",
            advanced: "",
            showContact: true, // 联系客服
            showPayPage: false, // 立即购买
            detail: [
                ["中国微信品牌排行榜","前10页",'<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['微信自媒体大号榜','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['自定义榜单包含公众号数量','50个','50个，10个/月换号','200个，无限换号'],
                ['帐号详情','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['帐号搜索','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['批量导入','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>'],
                ['自定义榜单手动排序','—','<i class="leo-tick"></i>','<i class="leo-tick"></i>']
            ]
        }
    };
    var model = {
        vipDisplay: "table-row",
        content: allCharge["tmp"]
    };
    var fn = {
        liClick: function(name) {
            avalonData.content = allCharge[name];
            $("li.active").removeClass("active");
            $("#"+name).addClass("active");
            //$(this).addClass("active");
        },
        showPay: function(name) {
            //avalonData.$fire("all!payDisplay","block");
            //avalonData.$fire("all!appid", nameToAppid[name]);
            avalonData.$fire("all!contactDisplay","block");
        },
        showHelp: function() {
            $("#call_help").click();
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

            },
            render: function() {
                $.get("/account/getAppid", {}, function(result){
                    if(result.success){
                        var appid = result.appid;
                        if(appid == 14) { // 传播没有资费说明，显示风云微信版
                            avalonData.liClick("social");
                        } else if(appid == 13){
                            avalonData.liClick("iwom");
                        }else {
                            avalonData.liClick(appidToName[appid]);
                        }

                    } else {
                        avalonData.liClick(appidToName["12"]);
                    }
                });
            }

        }
    };
});