<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="../com/meta.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/content/css/user.css" />
</head>
<body>
<noscript>
    <div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
</noscript>

<header class="header">
    <a href="index" class="icon icon_return"></a>
    <h1>爷的礼品</h1>
</header>

<section class="container mygift">
	<div id="wu-list" class="wlist"></div>
</section>

<script id="wu-list-tmpl" type="text/html">
	<!--[for(i = 0; i < list.length; i ++) {]-->
	<a class="box wlist_item" href="my-gift-detail?id=<!--[= list[i].giftPutOutId]-->">
        <div class="thumb"><img src="<!--[= $absImg(list[i].gift.picurl)]-->" alt="" /></div>
        <div class="content">
            <h3><!--[= list[i].showName || list[i].gift.giftRealName]--></h3>
            <p><span class="text">属性：</span><!--[= list[i].model]--></p>
            <p><span class="text">规格：</span><!--[= list[i].color]--></p>
            <p><span class="text">来源：</span><!--[= list[i].type]--></p>
        </div>
        <span class="cornor">&nbsp;</span>
    </a>
	<!--[}]-->
</script>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script>
(function() {
	
	config.tips.nodata = '爷还木有礼品？！开心活动、幸运抽奖中逛逛，爷就有机会啦～';
		
	//列表数据
	config.getList = function() {
		Ajax.pageRequest({
			url : config.myGift,
			data : {
				uid: config.getId(),
				begin : config.cpage,
				count : config.pagesize,
				type : location.search.getQueryValue('type')
			}
		});
	};

	config.getList();

})();
</script>
</body>
</html>