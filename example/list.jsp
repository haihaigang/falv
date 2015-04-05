<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="../com/meta.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/content/css/shop.css" />
</head>
<body>
<noscript>
    <div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
</noscript>

<header class="header">
    <a href="../index" class="icon icon_return"></a>
    <h1>匹配结果</h1>
</header>

<section class="container house_list">
    <div id="common-tip" class="house_stat" style="display: none;">共找到<span>--</span>条相关信息</div>
    <div id="recommend-tip" class="house_stat" style="display: none;">共找到<span>--</span>条推荐信息</div>
    <div id="wu-list" class="wlist wlist_house"></div>
    <div class="options wlist_other" style="display: none;">
    	<a class="btn" href="self">自助找房</a>
    </div>
</section>

	<script id="wu-list-tmpl" type="text/html">
	<!--[for(i = 0; i < list.length; i ++) {]-->
    <a class="box wlist_item" href="detail?id=<!--[= list[i].projectId]-->">
        <div class="thumb"><img src="<!--[= $absImg(list[i].projectThumb)]-->" alt="" /></div>
        <div class="content">
            <h3><span><!--[= list[i].projectName || '待定']--></span><!--[if(list[i].hasYun){]--><i class="loan"></i><!--[}if(list[i].hasSale){]--><i class="deals"></i><!--[}]--></h3>
            <p><span class="text">片区：</span><!--[= list[i].projectArea || '待定']--></p>
            <p><span class="text">开盘：</span><!--[= $formatDate(list[i].openDate,5,'待定')]--></p>
            <p class="price"><span class="text">均价：</span><em><!--[= $formatCurrency(list[i].averagePrice,'待定','元/平米')]--></em></p>
        </div>
        <div class="cornor">&nbsp;</div>
		<!--[if($isCustom()){]-->
        <div class="score"><!--[= list[i].score]--></div>
		<!--[}]-->
    </a>
	<!--[}]-->
	</script>

<jsp:include page="../com/footer.jsp"></jsp:include>
<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script>
(function() {
	
	function getParams(){
		var data = {
			begin : config.cpage,
			count : config.pagesize
		};
		
		var currentProvince = location.search.getQueryValue('currentProvince'),
			currentCity = location.search.getQueryValue('currentCity'),
			currentArea = location.search.getQueryValue('currentArea'),
			openDateStr = location.search.getQueryValue('openDateStr'),
			propertyType = location.search.getQueryValue('propertyType'),
			projecttTags = location.search.getQueryValue('projecttTags'),
			houseType = location.search.getQueryValue('houseType'),
			priceStr = location.search.getQueryValue('priceStr'),
			distanceStr = location.search.getQueryValue('distanceStr'),
			searchType = location.search.getQueryValue('searchType'),
			currentLongitudeStr = location.search.getQueryValue('currentLongitudeStr'),
			currentLatitudeStr = location.search.getQueryValue('currentLatitudeStr'),
			queryKey = location.search.getQueryValue('queryKey');

		
		if(currentProvince){
			data.currentProvince = currentProvince;
		}
		if(currentCity){
			data.currentCity = currentCity;
		}
		if(currentArea){
			data.currentArea = currentArea;
		}
		if(openDateStr){
			data.openDateStr = openDateStr;
		}
		if(propertyType){
			data.propertyType = propertyType;
		}
		if(projecttTags){
			data.projecttTags = projecttTags;
		}
		if(houseType){
			data.houseType = houseType;
		}
		if(priceStr){
			data.priceStr = priceStr;
		}
		if(distanceStr){
			data.distanceStr = distanceStr;
		}
		if(searchType){
			data.searchType = searchType;
		}
		if(currentLongitudeStr){
			data.currentLongitudeStr = currentLongitudeStr;
		}
		if(currentLatitudeStr){
			data.currentLatitudeStr = currentLatitudeStr;
		}
		if(queryKey){
			data.queryKey = queryKey;
		}
		return data;
	}
	
	var params = getParams();
	if(params.searchType == 'self'){
		$('.icon_return').attr('href','self');
		config.tips.nodata = '爷，这个区的小松私奔去鸟，我们尽快揪他出来帮爷找房啊！';
	}else{
		config.tips.nodata = '没帮到爷啊<i></i>，烦劳爷自助找下房呗。';
		$('.icon_return').attr('href','custom');
	}
	
	// 模板帮助方法，验证是否已登录
	template.helper('$isCustom', function() {
		return params.searchType == 'custom';
	});
	
	config.tips.loading = '楼盘匹配中，爷，请稍等……';
	
	//列表数据
	config.getList = function() {
		params.begin = config.cpage;
		Ajax.pageRequest({
			url : config.houseList,
			type : 'POST',
			data : params
		},function(data){
			if(config.cpage == 0 && data.result.length == 0 && params.searchType == 'custom'){
				$('.wlist_other').show();
			}
			if(data.countData == 0){
				return;
			}
			if(data.message == 'RECOMMEND'){
				$('#common-tip').hide();
				$('#recommend-tip').show().find('span').text(data.countData);
			}else{
				$('#recommend-tip').hide();
				$('#common-tip').show().find('span').text(data.countData);
			}
		});
	};

	config.getList();
	
	$('#wu-list').on('click','.loan',function(e){
		e.preventDefault();
		
		Tools.showTip('介个项目凭爷的信用也可以贷款哟，请您直接挠挠楼盘下方的电话吧&nbsp;&nbsp;<img src="../../content/images/icon_tushe.png" alt="" />',5000);
	});

})();
</script>
</body>
</html>