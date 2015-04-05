<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="../com/meta.jsp"></jsp:include>
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/content/css/show.css" />
</head>
<body>
	<noscript>
		<div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
	</noscript>

	<header class="header">
		<a href="../index" class="icon icon_home"></a>
		<h1>十爷故事</h1>
		<a href="#login" class="icon icon_user"></a>
	</header>

	<section class="container house">
		<div id="wu-list"></div>
	</section>

	<script id="wu-list-tmpl" type="text/html">
	<!--[for(i = 0; i < list.length; i ++) {]-->
    <div class="house_item">
        <a class="thumb" href="story-detail?id=<!--[= list[i].tiid]-->">
			<img style="width:100%;" src="<!--[= $absImg(list[i].picurl)]-->" alt="" />
		</a>
        <div class="box content">
			<!--[if(list[i].type == 'VIDEO'){]-->
            <h3 class="video"><a href="story-detail?id=<!--[= list[i].tiid]-->"><!--[= list[i].title]--></a></h3>
			<!--[}else if(list[i].type == 'AUDIO'){]-->
            <h3 class="audio"><a href="story-detail?id=<!--[= list[i].tiid]-->"><!--[= list[i].title]--></a></h3>
			<!--[}else{]-->
            <h3 class="text"><a href="story-detail?id=<!--[= list[i].tiid]-->"><!--[= list[i].title]--></a></h3>
			<!--[}]-->
            <div class="ex">
                <span class="time"><!--[= $formatDate(list[i].publishDate)]--></span>
                <span class="rec"><em><!--[= list[i].count]--></em>吐槽</span>
            </div>
        </div>
    </div>
	<!--[}]-->
</script>

	<jsp:include page="../com/footer.jsp"></jsp:include>
	<jsp:include page="../com/footer-js.jsp"></jsp:include>
	<script>
		(function() {

			//列表数据
			config.getList = function() {
				Ajax.pageRequest({
					url : config.showList,
					data : {
						column: 'STORY',
						begin : config.cpage,
						count : config.pagesize
					}
				});
			};

			config.getList();

		})();
	</script>
</body>
</html>