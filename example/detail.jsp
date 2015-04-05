<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="../com/meta.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/content/css/shop.css" />
</head>
<body class="has_fixed">
<noscript>
    <div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
</noscript>

<header class="header">
    <a href="list" class="icon icon_return"></a>
    <h1>房源详情</h1>
</header>

<section class="container nopadding house_detail">
	<div id="wu-empty" style="display: none">该死的，小松睡过头了。老大交代的内容还没交差呐！爷见谅啊～今儿个辛苦爷移个驾先，改天爷再来啊！</div>
    <div class="slider">
        <div class="scroller"></div>
        <div class="subscript"></div>
    </div>
    <div class="tabs" style="display: none;">
        <a class="active" href="#wu-detail">楼盘信息</a>
        <a href="#comment">评论<em id="comment-count">..</em></a>
        <a href="#activity">活动</a>
    </div>
    <div id="wu-detail" class="tab_content detail_content"></div>
    <div id="comment" class="tab_content" style="display: none;">
    	<div class="comment_title">
	    	<div class="text">全部<em id="total">--</em>吐槽</div>
	    	<a class="rec" href="javascript:void(0)"></a>
    	</div>
    	<form id="comment-form" action="#" style="display: none;">
			<input type="hidden" name="ccid" />
			<input type="hidden" name="type" value="HOUSE" />
			<input id="openId1" type="hidden" name="openId" />
			<div class="comment_text"><input type="text" name="commentContent" placeholder="吐槽……" /></div>
			<div class="comment_btn"><input type="submit" value="确定" /></div>
		</form>
    	<div id="wu-list" class="comment_list"></div>
    </div>
    <div id="activity" class="tab_content activity_content" style="display: none;">
    	<div class="title">活动</div>
    	<div id="wu-list0" class="list"></div>
    </div>
    
</section>

<div class="fixed_wrapper" style="display: none;">
<div class="options fixed">
    <a class="btn btn_l btn_hotline" href="javascript:void(0)" id="hot-line"><span>待定</span></a>
    <a class="btn btn_r btn_call_white" href="../shop/conversation" data-type="house" target="_blank" id="wu-online"><span>小松在线</span></a>
</div>
</div>

	<script id="wu-detail-tmpl" type="text/html">
		<div class="content">
       		<p class="rel">名称：<!--[= projectBaseInfo.projectExtendsName || '待定']--><a href="#" class="icon icon_favorite" style="display: none">收藏</a></p>
       		<p>均价：<span class="price"><!--[= $formatCurrency(projectBaseInfo.averagePrice,'待定','元/平米')]--></span></p>
       		<p>开盘：<!--[= $formatDate(projectBaseInfo.predictOpenDate,5,'待定')]--></p>
       		<p>片区：<!--[= projectBaseInfo.areaCd || '待定']--></p>
     	</div>
     	<div class="content tags">
		<!--[if(projectSaleInfo && projectSaleInfo.projectTags){]-->
			<!--[== $convertTag(projectSaleInfo.projectTags)]-->
		<!--[}else{]-->
			<p style="margin-bottom: .1rem;">待定</p>
		<!--[}]-->
     	</div>
     	<div class="content hotline" style="display: none;">
     		<p class="rel">热线：<!--[= projectBaseInfo.hotLine]--><span class="icon icon_phone"></span></p>
     	</div>
     	<div class="content deals">
		<!--[if(projectCouponInfo && projectCouponInfo.length){]-->
		<!--[for(var i=0; i<projectCouponInfo.length; i++){]-->
     		<p>优惠：<!--[= projectCouponInfo[i].newsTitle || '待定']--></p>
			<p>有效期：<!--[= $formatDate(projectCouponInfo[i].startDate,6,'待定')]-->至<!--[= $formatDate(projectCouponInfo[i].endDate,6,'待定')]--></p>
		<!--[}]-->		
		<!--[}else{]-->
			<p>优惠：待定</p>
		<!--[}]-->
     	</div>
        <div class="title">核心价值</div>
        <div class="content apt">
		<!--[if(projectSaleInfo && projectSaleInfo.projectAcceptPt){]-->
        	<p class="rel"><!--[= projectSaleInfo.projectAcceptPt]--><a href="#" class="icon icon_down"></a></p>
       	<!--[}else{]-->
			<p>待定</p>
		<!--[}]-->
		</div>
        <div class="title">主力户型</div>
        <div class="content">
		<!--[if(projectLayouts && projectLayouts.length){]-->
		<!--[for(i=0; i < projectLayouts.length; i++){]-->
			<p class="rel"><!--[= projectLayouts[i].houseType || '待定']--> <!--[= (projectLayouts[i].buildArea && projectLayouts[i].buildArea + '平米') || '--']--><a href="preview?img=<!--[= $encodeUrl(projectLayouts[i].absUrl)]-->" target="_blank" class="icon icon_album"></a></p>
		<!--[}]-->
		<!--[}else{]-->
			<p>待定</p>
		<!--[}]-->
        </div>
        <div class="title">位置</div>
        <div class="content">
        	<p class="rel"><!--[= (projectBaseInfo.addressName || '') + (projectBaseInfo.streetName || '')]--><a href="<%=request.getContextPath()%>/wechat/shop/map?x=<!--[= projectBaseInfo.gpsLongitude]-->&y=<!--[= projectBaseInfo.gpsLatitude]-->&address=<!--[=(projectBaseInfo.addressName || '') + (projectBaseInfo.streetName || '')]-->"><span class="icon icon_map"></span></a></p>
        </div>
        <div class="title">配套</div>
        <div class="content content_db">
		<!--[if(projectAssortDescs && projectAssortDescs.length){]-->
		<!--[for(var i=0; i < projectAssortDescs.length; i++){]-->
			<p><span class="name"><!--[= projectAssortDescs[i].matingType || '待定']-->：</span><em class="txt"><!--[= projectAssortDescs[i].matingName || '待定']--></em></p>
		<!--[}]-->
		<!--[}else{]-->
			<p>待定</p>
		<!--[}]-->
        </div>
        <div class="title">楼盘详情</div>
        <div class="content content_db feature">
			<p><span class="name">开发商: </span><em class="txt"><!--[= projectBaseInfo.developerName || '待定']--></em></p>
        	<p><span class="name">物业类型：</span><em class="txt"><!--[= projectBaseInfo.propertyType || '待定']--></em></p>
			<p><span class="name">首次开盘日期：</span><em class="txt"><!--[= $formatDate(projectBaseInfo.openDate,5,'待定')]--></em></p>
        	<p><span class="name">入住时间：</span><em class="txt"><!--[= $formatDate(projectBaseInfo.predictHandingDate,5,'待定')]--></em></p>
        	<p><span class="name">产权启始：</span><em class="txt"><!--[= (projectFeature && projectFeature.equityYear && projectFeature.equityYear + '年') || '待定']--></em></p>
			<p><span class="name">建筑面积：</span><em class="txt"><!--[= (projectFeature && projectFeature.coveredArea && projectFeature.coveredArea + '平方米') || '待定']--></em></p>
			<p><span class="name">占地面积：</span><em class="txt"><!--[= (projectFeature && projectFeature.floorArea && projectFeature.floorArea + '平方米') || '待定']--></em></p>
			<p><span class="name">绿化率：</span><em class="txt"><!--[= (projectFeature && projectFeature.greeningRate && projectFeature.greeningRate + '%') || '待定']--></em></p>
			<p><span class="name">容积率：</span><em class="txt"><!--[= (projectFeature && projectFeature.plotRatio) || '待定']--></em></p>
			<p><span class="name">装修情况：</span><em class="txt"><!--[= (projectBaseInfo.decorateTypeCd) || '待定']--></em></p>
			<p><span class="name">物业公司：</span><em class="txt"><!--[= (projectFeature && projectFeature.tenementCompany) || '待定']--></em></p>
			<p><span class="name">物业费: </span><em class="txt"><!--[= (projectFeature && projectFeature.propertyFee && projectFeature.propertyFee + '元/平方米·月') || '待定']--></em></p>
			<p><span class="name">地下车位数：</span><em class="txt"><!--[= (projectParking && projectParking.undergroundParking) || '待定']--></em></p>
        </div>
	</script>

	<script id="wu-list-tmpl" type="text/html">
	<!--[for(i = 0; i < list.length; i ++) {]-->
	<li>
        <div class="thumb"><img src="<!--[= $absImg(list[i].account.icon)]-->" alt="" /></div>
        <div class="content">
			<input type="hidden" id="open<!--[= list[i].commentId]-->" value="<!--[= list[i].openId]-->" />
            <div class="comment" onmouseover="javascript:if($('#openId1').val()==$('#open<!--[= list[i].commentId]-->').val())$('#del<!--[= list[i].commentId]-->').show();" onmouseout="javascript:if($('#openId1').val()==$('#open<!--[= list[i].commentId]-->').val())$('#del<!--[= list[i].commentId]-->').hide();">
                <div class="name">
                    <span><!--[= list[i].account.wechatNickName || '匿名']--></span>
                    <em><!--[= $formatDate(list[i].commentDate)]--></em>
					<em id="del<!--[= list[i].commentId]-->" style="padding-left:.08rem;display:none;"><a class="delComment" data-id="<!--[=list[i].commentId]-->" href="javascript:void(0);" style="color:red;">删除</a></em>
                </div>
                <div class="text"><!--[= list[i].commentContent]--></div>
            </div>
		<!--[if(list[i].reply){]-->
            <div class="reply">
                <div class="thumb"><img src="<%=request.getContextPath()%>/content/images/role/s1.png" alt="" /></div>
                <div class="content">
                    <div class="name">
                        <span>客服闺蜜</span>
                        <em><!--[= $formatDate(list[i].reply[0].replyDate)]--></em>
                    </div>
                    <div class="text"><!--[=list[i].reply[0].rcContent]--></div>
                </div>
            </div>
		<!--[}]-->
    	</div>
    </li>
	<!--[}]-->
	</script>

	<script id="wu-scroller-tmpl" type="text/html">
	<!--[for(i = 0; i < list.length; i ++) {]-->
	<div class="item">
		<img id="img-<!--[= i]-->" src="<%=request.getContextPath()%>/content/images/blank.png" data-src="<!--[= $absImg(list[i].absUrl)]-->" alt="" />
	</div>
	<!--[}]-->
	</script>
	
	<script id="wu-activity-tmpl" type="text/html">
	<!--[for(i = 0; i < list.length; i ++) {]-->
		<div class="activity_item">
			<div class="activity_title"><!--[= list[i].newsTitle || '待定']--></div>
			<div class="activity_time"><!--[= $formatDate(list[i].startDate,6,'待定')]--> ~ <!--[= $formatDate(list[i].endDate,6,'待定')]--></div>
			<div class="activity_text"><!--[= list[i].newsContent || '待定']--></div>
		</div>
	<!--[}]-->
	</script>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script src="<%=request.getContextPath()%>/content/js/lib/jquery.doubletap.js"></script>
<script src="<%=request.getContextPath()%>/content/js/detail.js"></script>
</body>
</html>