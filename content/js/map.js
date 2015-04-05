String.prototype.getQueryValue = function(key) {
	var q = this, keyValuePairs = new Array();

	if (q.length > 1) {
		var idx = q.indexOf('?');
		q = q.substring(idx + 1, q.length);
	} else {
		q = null;
	}

	if (q) {
		for (var i = 0; i < q.split("&").length; i++) {
			keyValuePairs[i] = q.split("&")[i];
		}
	}

	for (var j = 0; j < keyValuePairs.length; j++) {
		if (keyValuePairs[j].split("=")[0] == key) {
			// 这里需要解码，url传递中文时location.href获取的是编码后的值
			// 但FireFox下的url编码有问题
			return decodeURI(keyValuePairs[j].split("=")[1]);

		}
	}
	return '';
};

//debug
var log = function(m) {
	if (typeof console != 'undefined') {
		console.log(m);
	}
};

// 百度地图API功能
var map = new BMap.Map("allmap");
var geolocation = new BMap.Geolocation();
var size=14;//地图等级
var croute;//默认导航
var xx = location.search.getQueryValue('x');//楼盘的经纬度
var yy = location.search.getQueryValue('y');//楼盘的经纬度
var projectAddress = location.search.getQueryValue('address'); //不需要反解析楼盘地址时
$('#project-address').val(projectAddress);
var startPoint;//起点
var endPoint;//终点，楼盘地点
var toastPanel,delay;//提示信息框

//map.centerAndZoom('深圳',size); // 初始化地图,设置中心点坐标和地图级别。

// 创建地址解析器实例
var myGeo = new BMap.Geocoder();
var gpsPoint = new BMap.Point(xx,yy);//把楼盘经纬度转成地图的点

var driving = new BMap.DrivingRoute(map, {
	renderOptions:{
		map: map, 
		autoViewport: true
	},
	onSearchComplete: routeResult
});
var walking = new BMap.WalkingRoute(map, {
	renderOptions:{
		map: map, 
		autoViewport: true
	},
	onSearchComplete: routeResult
});
var transit = new BMap.TransitRoute(map, {
	renderOptions: {
		map: map,
		autoViewport: true
	},
	onSearchComplete: routeResult
});
croute = transit;

//导航路线标注
function route(){
	if(!startPoint){
		showToast('爷，起始地址没有啊');
		return;
	}
	if(!endPoint){
		showToast('爷，楼盘地址的经纬度还没有啊');
		return;
	}
	driving.clearResults();
	walking.clearResults();
	transit.clearResults();
	
	croute.search(startPoint, endPoint);
}

//导航结果
function routeResult(results){
	if(croute.getStatus() != BMAP_STATUS_SUCCESS){
		showToast('爷，导航失败请重试');
		log('导航失败：'+croute.getStatus());
	}else{
		log('导航成功，共计：' + results.getNumPlans());
	}
}

//真实经纬度转成百度坐标，这个地方是回调。translateCallback
BMap.Convertor.translate(gpsPoint,0,function(p){
	endPoint = p;
	map.centerAndZoom(p,size); // 初始化地图,设置中心点坐标和地图级别。
	
	//反地址解析
	myGeo.getLocation(p, function(rs){
		log('[楼盘]反地址解析成完成');
		if(rs.address){
//			$('#project-address').val(rs.address);
			//多余
			$('#project-address').val(projectAddress);
			if(startPoint){
				route();
			}
		}else{
			endPoint = undefined;
			showToast('爷，楼盘地址错误',1000);
		}
	});
});

// 浏览器定位
geolocation.getCurrentPosition(function(r) {
	if (this.getStatus() == BMAP_STATUS_SUCCESS) {
		log('浏览器定位成功');
		startPoint = r.point;
		route();
		
		//反地址解析
		myGeo.getLocation(r.point, function(rs){
			log('[定位]反地址解析成功');
		    var addComp = rs.addressComponents;
		    $('#city').val(addComp.city);
			$('#address').val(rs.address);
		}); 
	} else {
		log('浏览器定位失败,CODE:' + this.getStatus());
	}
});

$('.toggle_btn').click(function(){
	$('.container').toggle();
	if($('.container').css('display') == 'none'){
		$(this).addClass('show');
	}else{
		$(this).removeClass('show');
	}
});

//导航类型切换
$('.tabs').click(function(e){
	if($(this).hasClass('bus')){
		croute = transit;
	}else if($(this).hasClass('taxi')){
		croute = driving;
	}else{
		croute = walking;
	}
	
	$('.tabs').removeClass('active');
	$(this).addClass('active');
	
	route();
});

$('.search_btn').click(function(){
	var startStr=$('#address').val();//起始地点
	var city = $('#city').val();//城市

	if(!startStr || !city){
		showToast('爷，起始地址还没有');
	}
	
	//把起始地转成地图坐标
	myGeo.getPoint(startStr, function(point){
		log('起始地址转换完成');
		if (point) {
			startPoint = point;
			if(endPoint){
				route();
			}
		}else{
			showToast('爷，你的起始地址错了吧');
		}
	}, city);
});

$('.icon_return').click(function(e){
	e.preventDefault();
	
	history.go(-1);
});

function showToast(msg, tick) {
	toastPanel = toastPanel || $('#wu-toast');
	tick = tick || 800;
	
	if(delay){
		clearTimeout(delay);
	}
	
	toastPanel.find('span').text(msg);
	toastPanel.show();
	delay = setTimeout(function(){
		toastPanel.hide();
	},tick);
}
