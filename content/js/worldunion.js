(function() {

	//获取登录的id
	config.getId = function(){
		var auth = Cookie.get(Storage.AUTH);
//		if(!auth){
//			//auth = Storage.get(Storage.AUTH);
//			if(auth){
//				//Cookie.set(Storage.AUTH, auth);
//			}
//		}
		return auth;
	};
	
	//获取微信号
	config.getOpenId = function(){
		return Cookie.get(Storage.OPENID);
	};
	
	//重定向登录
	config.redirectLogin = function(from){
		from = encodeURIComponent(from);
		location.href = '../login?from=' + from;
	};
	
	//自适应页面高度
	var fixedHeight = 0;
	var headerHeight = $('header').height() || 0;
	var footerHeight = $('footer').outerHeight() || 0;
	// if($('.fixed').length){
	// 	//若页面有fixed
	// 	fixedHeight = 44;
	// 	if($('body').hasClass('has_fixed2')){
	// 		fixedHeight = 95;
	// 		footerHeight = 0;
	// 	}
	// }
	// var cPadding = 20;
	// if($('.container').hasClass('nopadding2')){
	// 	cPadding = 0;
	// }else if($('.container').hasClass('nopadding')){
	// 	cPadding = 10;
	// }
	// //document.title = document.documentElement.clientHeight;
	// setTimeout(function(){
	// 	//延迟以便获取准确的高度，微信中默认打开webview获取的页面高度很高
	// 	var mHeight = document.documentElement.clientHeight - fixedHeight - headerHeight - footerHeight - cPadding;
	// 	$('.container').css('min-height',mHeight);
	// 	//初始化高度之后再显示footer
	// 	$('.footer').show();
	// }, 100);
	
	//定位底部按钮
	var fixedContainer = $('.fixed_wrapper');
	var fixedHeight = fixedContainer.outerHeight();
	var windowHeight = $(window).height();
	var hasTouch = 'ontouchstart' in window;
	var isAndroid = (/android/gi).test(navigator.appVersion);
	
	if(hasTouch && !isAndroid){
		document.addEventListener('touchstart',function(e){
			fixedContainer.hide();
		});
		document.addEventListener('touchend',function(e){
			fixedContainer.show();
		});
		document.addEventListener('touchcancel',function(e){
			fixedContainer.show();
		});

		$(window).scroll(function() {
			var scrollTop = $(window).scrollTop();
			windowHeight = hasTouch? screen.height : $(window).height();
			fixedContainer.css({'top': scrollTop + windowHeight - fixedHeight});
			fixedContainer.show();
		});
		setTimeout(function(){
			//window.scrollTo(0,1);
			windowHeight = hasTouch? screen.height : $(window).height();
			fixedContainer.css({'top': windowHeight - fixedHeight,'bottom':'auto'}).show();
		},500);
	}else{
		fixedContainer.css({'position':'fixed'}).show();
	}

	template.openTag = "<!--[";
	template.closeTag = "]-->";

	// 模板帮助方法，绝对化图片地址
	template.helper('$absImg', function(content) {
		if(!content){
			return config.image + 'content/images/blank.png';
		}
		if(content && content.indexOf('http://') == 0){
			return content;
		}
		return config.aliyunHost + content;
		//return config.image + content;
	});

	// 模板帮助方法，转换时间戳成字符串
	template.helper('$formatDate', function(content, type, defaultValue) {
		if(content){
			return Tools.formatDate(content, type);
		}else{
			return defaultValue || '--';
		}
	});

	// 模板帮助方法，验证是否已登录
	template.helper('$isLogin', function() {
		return !!config.getId();
	});

	// 模板帮助方法，转换房源你的标签
	template.helper('$convertTag', function(content) {
		if(content){
			var result = '';
			var arr = content.split(',');
			for(var i in arr){
				if(/^\s*$/.test(arr[i])){
					continue;
				}
				result += '<span>'+arr[i]+'</span>';
			}
			return result;
		}else{
			return '--';
		}
	});

	//模板帮助方法，编码url参数
	template.helper('$encodeUrl', function(content) {
		return encodeURIComponent(content);
	});

	//模板帮助方法，格式化货币
	template.helper('$formatCurrency', function(content,defaultValue, unit) {
		if(!content){
			return defaultValue || '--';
		}
		
		var mod = content.toString().length % 3;
		var sup = '';
		if(mod == 1){
			sup = '00';
		}else if(mod == 2){
			sup = '0';
		}
		
		content = sup + content;
		content = content.replace(/(\d{3})/g,'$1,');
		content = content.substring(0, content.length - 1);
		if(sup.length > 0){
			content = content.replace(sup,'');
		}
		
		return content + unit || '';
	});
	
	//模板帮助方法，\r\n替换换行
	template.helper('$convertRN', function(content) {
		if(!content){
			return '--';
		}
		return content.replace(/\r\n/gi,'<br/>');
	});
	
	//模板帮助方法，根据序列值添加样式名
	template.helper('$addClassByIdx', function(i, v, className) {
		if(i == v){
			return className || '';
		}
	});

	//模板帮助方法，拼接在线咨询url
	template.helper('$spliceCUrl', function(pid) {
		if(!pid){
			return 'javascript:void(0)';
		}
		return config.onlineUrl
			.replace('{1}',pid)
			.replace('{3}',config.getId());
	});

	//模板帮助方法，度量房源标题长度
	template.helper('$lengthHouseTitle', function(content) {
		var screenWidth = screen.width;
		var size = 10;
		if(screenWidth < 320){
			size = 12;
		}else if(screenWidth < 480){
			size = 20;
		}else if(screenWidth < 960){
			
		}
		
		return content.substring(0, size) + '...';
	});
	
	//在线咨询链接
	var wuOnline = $('#wu-online');
	if(wuOnline.length){
		var id = wuOnline.attr('data-id');
		var type = wuOnline.attr('data-type');
		id = id || location.search.getQueryValue('id') || 1;
		wuOnline.attr('href',
				config.onlineUrl
				.replace('{1}',type + '_' + id)
				.replace('{3}',config.getId() || '')
		);
	}

	// 返回按钮
	$('.icon_return').click(function(e) {
		e.preventDefault();
		
		//特殊跳转
		var special = location.search.getQueryValue('special');
		if(special){
			location.href = special;
		}else{
			history.go(-1);
		}
	});
	
	//返回顶部
	$('#wu-back').click(function(e){
		e.preventDefault();
		
		window.scrollTo(0,-1);
	});
	
	//底部关注十爷帮
	$('#wu-focus').click(function(e){
		$(this).attr("href",config.concernUrl);
	});
	
	//会员中心按钮，未登录则跳转登陆
	$('.icon_user').on('click', function(e){
		e.preventDefault();
		
		var prefix = $(this).attr('href') == '#login' ? '../' : '';
		
		if (!config.getId()) {
			location.href = prefix + 'login';
		} else {
			location.href = prefix + 'hui/index';
		}
	});

	// 下一页按钮
	$('body').on('click', '.wlist_next', function(e) {
		e.preventDefault();

		if ($(this).hasClass('loading')) {
			// 正在加载，不可点击
			return;
		}

		if (typeof config.getList == 'function') {
			config.getList();
		}
	});

	//初始化滚动
	config.initScroll = function(opt,mode) {
		var nav = $('.subscript');
		var len = $('.scroller').children().length;
		if (len == 0) {
			return;
		}
		// 有两种导航模式
		if (opt && opt.mode == 'mode2') {
			nav.html('<span>1</span>/' + len);
		} else {
			var res = '';
			for(var i=0;i<len;i++){
				if(i==0){
					res += '<span class="active"></span>';
				}else{
					res += '<span></span>';
				}
			}
			nav.html(res);
		}
		config.previewScroll = new jScroll($('.slider')[0], {
			onBeforeScrollStart : function(){
				if(config.scrollInte){
					clearInterval(config.scrollInte);
					config.scrollInte = undefined;
				}
			},
			onScrollEnd : function() {
				var cur = $('#img-'+this.currPageX);
				cur.attr('src',cur.attr('data-src'));
				if (mode && mode == 'mode2') {
					nav.find('span').text(this.currPageX + 1);
				} else {
					nav.find('span').removeClass('active');
					nav.find('span').eq(this.currPageX).addClass('active');
					$(nav.find('span')[this.currPageX]).addClass('active');
				}

				if(opt && opt.auto && !config.scrollInte){
					config.scrollInte = setInterval(function(){
						config.previewScroll.currPageX++;
						if(config.previewScroll.currPageX >= config.previewScroll.pagesX){
							config.previewScroll.currPageX = 0;
						}
						var w = config.previewScroll.warpperW;
						var i = config.previewScroll.currPageX;
						config.previewScroll.scrollTo(-w*i,0,200);
					},3000);
				}
			}
		});
		
		if(opt && opt.auto){
			config.scrollInte = setInterval(function(){
				config.previewScroll.currPageX++;
				if(config.previewScroll.currPageX >= config.previewScroll.pagesX){
					config.previewScroll.currPageX = 0;
				}
				var w = config.previewScroll.warpperW;
				var i = config.previewScroll.currPageX;
				config.previewScroll.scrollTo(-w*i,0,200);
			},8000);
		}
		
		$('#img-0').attr('src',$('#img-0').attr('data-src'));

	};
})();

$(document).ready(function(){
	$('#panelBg').click(function(){
		Tools.hidePanel();
		Tools.hideSelect();
	});

	$('.btn_yes').click(function(){
		Tools.hidePanel(true);
	});
	$('.btn_no').click(function(){
		Tools.hidePanel(false);
	});
	$('.btn_ok').click(function(){
		Tools.hidePanel(true);
	});
});