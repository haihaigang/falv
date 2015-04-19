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

	//模板帮助方法， 从时间字符串中截取日期，限定字符串yyyy-MM-dd...
	template.helper('$getDateFromStr', function(content) {
		if(!content || content.length == 0){
			return;
		}

		var len = content.length > 10 ? 10 : content.length;
		return content.substring(0, len);
	});

	// 返回按钮
	$('.icon_return').click(function(e) {
		e.preventDefault();

		if($(this).attr('data-flag') == 'true'){
			return;
		}
		
		//特殊跳转
		var special = Tools.getQueryValue('special');
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


(function($, undefined) {
    var props = {
            "animation": {},
            "transition": {}
        },
        testElement = document.createElement("a"),
        vendorPrefixes = ["", "webkit-", "moz-", "o-"];

    $.each(["animation", "transition"], function(i, test) {

        // Get correct name for test
        var testName = (i === 0) ? test + "-" + "name" : test;

        $.each(vendorPrefixes, function(j, prefix) {
            if (testElement.style[$.camelCase(prefix + testName)] !== undefined) {
                props[test]["prefix"] = prefix;
                return false;
            }
        });

        // Set event and duration names for later use
        props[test]["duration"] =
            $.camelCase(props[test]["prefix"] + test + "-" + "duration");
        props[test]["event"] =
            $.camelCase(props[test]["prefix"] + test + "-" + "end");

        // All lower case if not a vendor prop
        if (props[test]["prefix"] === "") {
            props[test]["event"] = props[test]["event"].toLowerCase();
        }
    });

    // If a valid prefix was found then the it is supported by the browser
    $.support.cssTransitions = (props["transition"]["prefix"] !== undefined);
    $.support.cssAnimations = (props["animation"]["prefix"] !== undefined);

    // Remove the testElement
    $(testElement).remove();

    // Animation complete callback
    $.fn.animationComplete = function(callback, type, fallbackTime) {
        var timer, duration,
            that = this,
            eventBinding = function() {

                // Clear the timer so we don't call callback twice
                clearTimeout(timer);
                callback.apply(this, arguments);
            },
            animationType = (!type || type === "animation") ? "animation" : "transition";

        // Make sure selected type is supported by browser
        if (($.support.cssTransitions && animationType === "transition") ||
            ($.support.cssAnimations && animationType === "animation")) {

            // If a fallback time was not passed set one
            if (fallbackTime === undefined) {

                // Make sure the was not bound to document before checking .css
                if ($(this).context !== document) {

                    // Parse the durration since its in second multiple by 1000 for milliseconds
                    // Multiply by 3 to make sure we give the animation plenty of time.
                    duration = parseFloat(
                        $(this).css(props[animationType].duration)
                    ) * 3000;
                }

                // If we could not read a duration use the default
                if (duration === 0 || duration === undefined || isNaN(duration)) {
                    duration = $.fn.animationComplete.defaultDuration;
                }
            }

            // Sets up the fallback if event never comes
            timer = setTimeout(function() {
                $(that).off(props[animationType].event, eventBinding);
                callback.apply(that);
            }, duration);

            // Bind the event
            return $(this).one(props[animationType].event, eventBinding);
        } else {

            // CSS animation / transitions not supported
            // Defer execution for consistency between webkit/non webkit
            setTimeout($.proxy(callback, this), 0);
            return $(this);
        }
    };

    // Allow default callback to be configured on mobileInit
    $.fn.animationComplete.defaultDuration = 1000;
})(jQuery);
