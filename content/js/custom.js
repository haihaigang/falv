(function() {
	
	var c = 1;// 当前显示的步骤
	var stepStat = $('#step-stat');
	var stepArr = [ $('#step1'), $('#step2'), $('#step3'), $('#step4'),
			$('#step5'), $('#step6'), $('#step7') ];
	var step2Male = $('#step2'), step2Female = $('#step2-1');
	var cur, prev, next;

	// 选项切换
	$('.custom_item').click(function(e) {
		e.preventDefault();
		if (!$(this).hasClass('active')) {
			if (c == 1) {
				// 切换性别的时候更改对应的年龄选择框，1=女
				if ($(this).attr('data-v') == '1') {
					stepArr[1] = step2Female;
				} else {
					stepArr[1] = step2Male;
				}
			}
			$(this).parent().find('.custom_item').removeClass('active');
			$(this).addClass('active');
			$(this).parent().find('input[type="hidden"]').val(
					$(this).attr('data-v'));
			
		}
		setTimeout(function(){
			gotoNext();
		},200);
	});

	// 下一步
	$('.btn_next').click(function(e) {
		e.preventDefault();

		if (c == 1) {
			if ($('#step1').find('.custom_item.active').length == 0) {
				Tools.showTip('爷,请选择性别', 5000);
				return;
			}
		}
		
		gotoNext();
	});

	// 上一步
	$('.btn_prev').click(function(e) {
		e.preventDefault();

		if(c == 2){
			$('.foot').css('visibility', 'hidden');
		}

		cur = stepArr[c - 1];
		prev = stepArr[c - 2];
		if (!prev.length) {
			return;
		}
		c--;
		stepStat.text(c);
		cur.hide();
		prev.show();
	});

	// 确认提交搜索
	$('.btn_confirm').click(function(e) {
		e.preventDefault();

		$('#custom-form').submit();
	});
	
	function gotoNext(){

		$('.foot').css('visibility', 'visible');
		
		cur = stepArr[c - 1];
		next = stepArr[c];
		if (!next.length) {
			//最后一步直接提交
			$('#custom-form').submit();
			return;
		}

		c++;
		stepStat.text(c);
		cur.hide();
		next.show();
		
		next.find('img').each(function(){
			$(this).attr('src',$(this).attr('data-src'));
		});
	}
	
	// 输入
	var fixedCustom = $('.fixed_custom');
	var timer,timer0,isEditing = false;
	var sugtext = $('#sug-text');
	var sugCity = $('#sug-city');
	var sugArea = $('#sug-area');
	sugtext.keyup(function(e) {
		startSearch();
	});
	sugtext.focus(function(e){
		if(timer0){
			clearTimeout(timer0);
		}
		isEditing = true;
		//fixedCustom.hide();
	});
	sugtext.blur(function(){
		timer0 = setTimeout(function(){
			isEditing = false;
			//fixedCustom.show();
			//fixedCustom.css({'top':$(window).scrollTop() + $(window).height() - fixedCustom.height(),'bottom':'auto'});
		},200);
	});

	//重新绑定城市
	sugCity.keyup(function(){
		var cityName = $(this).val();
		if(cityName.isEmpty()){
			return;
		}
		startSearch(cityName);
	});
	sugCity.focus(function(e){
		if(timer0){
			clearTimeout(timer0);
		}
		isEditing = true;
		//fixedCustom.hide();
	});
	sugCity.blur(function(){
		timer0 = setTimeout(function(){
			isEditing = false;
			//fixedCustom.show();
			//fixedCustom.css({'top':$(window).scrollTop() + $(window).height() - fixedCustom.height(),'bottom':'auto'});
		},200);
	});
	
	// 点击搜索
	$('.btn-search').click(function(e) {
		e.preventDefault();
		startSearch(0);
	});
	
	//点击飘过
	$('.btn-flow').click(function(e) {
		e.preventDefault();
		//验证
		if(sugCity.val().isEmpty()){
			Tools.showTip('爷的城市不能为空',5000);
			return;
		}
		if(sugArea.val().isEmpty()){
			Tools.showTip('爷的区域不能为空',5000);
			return;
		}
		$('#custom-form').submit();
	});
	
	// 开始搜索
	function startSearch(v){
		if(timer){
			clearTimeout(timer);
		}
		
		var tick = 350;
		if(typeof v == 'string'){
			local.setLocation(v);
		}else if(typeof v == 'number'){
			var abc = sugCity.val();
			if(abc){
				local.setLocation(abc);
			}
			tick = 0;
		}
		
		suggestion.find('ul').html('<li class="result">搜索中……</li>');
		suggestion.show();
		timer = setTimeout(function(){
			log('local search here');
			local.search(sugtext.val());
		},tick);
	}
	
	//生成dom之后绑定事件，在android手机中直接用on绑定事件，父元素会有焦点样式
	config.bindEvent = function(){
		// 点击推荐项
		$('.im').click(function(e){
			e.preventDefault();
			
			sugtext.val($(this).attr('data-v'));
			$('#hidden-lat').val($(this).attr('data-lat'));
			$('#hidden-lng').val($(this).attr('data-lng'));
			//suggestion.hide();
			
			setTimeout(function(){
				gotoNext();
			},200);
		});
	};

})();