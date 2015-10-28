/**
 * Created by Administrator on 2015/8/26.
 */
define(['jquery','avalon', "domReady!"], function($) {
    var page = 1;
    var PAGE_SIZE = 20;

    var down = '<i class="leo-down-blue-small"></i>';
    var up = '<i class="leo-up-blue"></i>';

    var model = {
        sysmsgDisplay:"block",
        allMsg: 0,
        notReadMsg: 0,
        allPage: 0,
        nowPage: 1,
        pageToGo: "", // 要跳转的页码
        pageArr:[], // 分页数组
        topics: []
    };
    var getTopics = function() {
        $.ajax({
            dataType:"json",
            type:"get",
            data:{
                page : avalonData.nowPage
            },
            url: "/sysmsg/getTopicList",
            success: function (result) {
                var tmp = result.topics;

                for(var i = 0; i < tmp.length; i++) {
                    tmp[i].iconShow = down;
                    tmp[i].detailDisplay = "none";
                }
                avalonData.topics = tmp;
            }
        });
    };
    var fn = {
        changePage: function(page) {
            avalonData.pageToGo = "";
            if(page > avalonData.allPage) {
                return ;
            }
            avalonData.nowPage = page;
            getTopics();
        },
        showDetail: function(index) {
            var iDisplay = avalonData.topics[index].detailDisplay;

            if(!avalonData.topics[index].reads) { // 如果之前是未读
                $.get("/sysmsg/lookOverTopic", {topicId : avalonData.topics[index].topicId}, function(result){
                    if(result.state == "success"){
                        $.ajax({
                            dataType:"json",
                            type:"get",
                            data:{
                                page : avalonData.nowPage
                            },
                            url: "/sysmsg/getTopicList",
                            success: function (result) {
                                var tmp = result.topics

                                for(var i = 0; i < tmp.length; i++) {
                                    tmp[i].iconShow = avalonData.topics[i].iconShow;
                                    tmp[i].detailDisplay = avalonData.topics[i].detailDisplay;
                                }
                                avalonData.topics = tmp;
                            }
                        });
                        $.ajax({
                            dataType:"json",
                            type:"get",
                            data:{
                            },
                            url: "/sysmsg/getCount",
                            success: function (result) {
                                avalonData.allMsg = result.allMsg;
                                avalonData.notReadMsg = result.notReadMsg;
                                avalonData.allPage = result.allPage;
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
                });
            }
            if(iDisplay == "none") {
                avalonData.topics[index]["iconShow"] = up;
                avalonData.topics[index]["detailDisplay"] = "block";
            } else {
                avalonData.topics[index]["iconShow"] = down;
                avalonData.topics[index]["detailDisplay"] = "none";
            }
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
                avalonData.$watch("nowPage", function(n){
                    if(avalonData.allPage > 4 && n > 2 && n < avalonData.allPage - 3) {
                        avalonData.pageArr = [];
                        for(var i = avalonData.nowPage - 1; i <= avalonData.allPage && i < avalonData.nowPage+4; i++) {
                            avalonData.pageArr.push(i);
                        }
                    }
                });
            },
            render: function() {
                $.ajax({
                    dataType:"json",
                    type:"get",
                    data:{
                    },
                    url: "/sysmsg/getCount",
                    success: function (result) {
                        avalonData.allMsg = result.allMsg;
                        avalonData.notReadMsg = result.notReadMsg;
                        avalonData.allPage = result.allPage;
                        for(var i = avalonData.nowPage; i <= avalonData.allPage && i < avalonData.nowPage+4; i++) {
                            avalonData.pageArr.push(i);
                        }
                    }
                });

                getTopics();
            }
        }
    };
});