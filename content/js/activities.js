(function() {
	var citySelect = $('#city-select'), cityName = '';// 存储城市名称

	// 活动滚动图
	Ajax.queryRecord({
		url : config.activityScroller
	}, function(data) {
		if(data.code != 'OK'){
			return;
		}
		if(!data.result){
			return;
		}
		
		var result = template.render('wu-scroller-tmpl', {
			'list' : data.result
		});
		$('.slider').show();
		$('.scroller').html(result);

		if (typeof config.initScroll == 'function') {
			config.initScroll();
		}

		// 滚动图绑定tap事件，跳转链接
		$('.scroller .item').addSwipeEvents().bind('tap', function(evt, touch) {
			var link = $(this).attr('data-link');
			if (link) {
				location.href = link;
			}
		});
	});

	// 列表数据
	config.getList = function() {
		Ajax.pageRequest({
			url : config.activityList,
			type : 'POST',
			data : {
				city : cityName,
				begin : config.cpage,
				count : config.pagesize
			}
		});
	};

	config.getList();

	// 获取活动的城市列表
	Ajax.queryRecord({
		url : config.activityCity
	}, function(data) {
		if (data.code != 'OK') {
			Tools.showTip('爷，服务器异常，请稍后再试～', 5000);
			return;
		}
		
		//城市内容
		var arr = [ '<span class="city_item" data-v="">全部</span>' ];
		for ( var i in data.result) {
			arr.push('<span class="city_item" data-v="' + data.result[i].cityName + '">' + data.result[i].cityName
					+ '</span>');
			var option = new Option(data.result[i].cityName, data.result[i].cityName);
			citySelect.append(option);
		}
		$('.city_list_content').html(arr.join(''));
		
		//绑定城市点击事件
		$('.city_item').click(function() {
			$('#city-name').text($(this).text());
			$('.city_list').hide();
			$('.activity_citys_wrapper').removeClass('active');

			cityName = $(this).attr('data-v');
			config.cpage = 0;
			config.getList();
		});
	});

	// 切换城市，查询
	citySelect.change(function() {
		config.cpage = 0;
		config.getList();
	});

	$('.activity_citys_wrapper').click(function() {
		if ($(this).hasClass('active')) {
			$('.city_list').hide();
			$(this).removeClass('active');
		} else {
			$('.city_list').show().css('height',window.innerHeight - $('header').height());
			$(this).addClass('active');
		}
	});

})();