(function() {
	Ajax.queryRecord({
		url : config.giftDetail,
		data : {
			id : location.search.getQueryValue('id')
		}
	}, function(data) {
		if (data.code != 'OK') {
			return;
		}

		if (data.result.urls && data.result.urls.length > 0) {
			var result = template.render('wu-scroller-tmpl', {
				'list' : data.result.urls
			});
			$('.scroller').html(result);

			if (typeof config.initScroll == 'function') {
				config.initScroll({mode: 'mode2'});
			}
		}
		$('input[name="openId"]').val(location.search.getQueryValue('openId'));
		
		// 点击属性
		$('.property_item').bind('click', checkInventory);
		$('.standard_item').bind('click', checkInventory);
	});

	// 检验库存
	function checkInventory(e) {
		e.preventDefault();

		if ($(this).hasClass('active')) {
			return;
		}
		$(this).parent().find('a').removeClass('active');
		$(this).addClass('active');
		$(this).parent().next().val($(this).text());
		
		var id = $('input[name="id"]').val();
		var model = $('input[name="model"]').val();
		var color = $('input[name="color"]').val();
		var isProperty = $(this).hasClass('lv');
		$('input[type="submit"]').attr('disabled', true);

		Ajax.submitForm({
			url : config.giftCheck,
			data : {
				id : id,
				model : model,
				color : color,
				isProperty: isProperty
			},
			renderFor : '123'// 传入不存在的值，以忽略模板渲染
		}, function(data) {
			if (data.code != 'OK') {
				Tools.showTip('爷，服务器异常，请稍后再试～', 5000);
				return;
			}
			if(data.result.colors){
				//有规格数据
				var str = '',exclass = '';
				for(var i in data.result.colors){
					if(i == 0){
						exclass = 'active';
					}else{
						exclass = '';
					}
					str += '<a href="#" class="standard_item '+exclass+'">'+data.result.colors[i]+'</a>';
				}
				$('#standard-value').html(str);
				$('input[name="color"]').val(data.result.colors[0]);
				$('.standard_item').bind('click', checkInventory);
			}
			if (data.result.giftNum == 0) {
				$('input[type="submit"]').val('没有库存');
				return;
			}
			$('input[type="submit"]').removeAttr('disabled').val('继续');
		});
	}
})();