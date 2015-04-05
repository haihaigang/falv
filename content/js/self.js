(function() {

	// 省市地址
	var wuaddress = new myAddress('choose',{
		cityChange : function(data) {
			var result = [];
			for ( var i in data) {
				var areaName = data[i].name,
					areaValue = areaName;
				if (areaName == '请选择') {
					areaName = '全部';
					areaValue = '';
				}
				result.push('<a class="search_item" href="#' + areaValue + '">' + areaName + '</a>');
			}

			$('#area-cont').html(result.join(''));
		}
	});

	// 标题头切换
	$('.self_search .title').click(function(e) {
		e.preventDefault();
		$(this).toggleClass('active');
		$(this).next().toggle();
	});
    
	
	var min = $('#minprice');
	var max = $('#maxprice');
	$('#price a').click(function(e){
		e.preventDefault();
		min.val('');
		max.val('');
	});
	
	$('.submit-price').click(function(){
		var par = $(this).parent().parent();
		
		if(!/^\d+$/.test(min.val())){
			Tools.showTip('爷，请填写数字',5000);
			return;
		}
		if(!/^\d+$/.test(max.val())){
			Tools.showTip('爷，请填写数字',5000);
			return;
		}
		
		var pricearea = min.val() + '-' + max.val();
		par.prev().find('em').addClass('active').text(pricearea);
		par.prev().find('input').val(pricearea);
		
		setTimeout(function() {
			par.hide();
		}, 80);
	});
	// 选项切换
	$('.content').on('click', '.search_item', function(e) {
		e.preventDefault();
		var par = $(this).parent();
		par.find('a').removeClass('active');
		$(this).toggleClass('active');
		par.prev().find('em').addClass('active').text($(this).text());
		par.prev().find('input').val($(this).attr('href').replace('#', ''));

		setTimeout(function() {
			par.hide();
		}, 80);
	});

	//开盘时间
	var yeardom = $('#opendate-year');
	var halfdom = $('#opendate-halfyear');
	$('#opendate select').change(function() {
		var that = $(this);
		that.prev().text(that.find('option:checked').text());
		
		if(yeardom.prev().text() == '请选择年份' || halfdom.prev().text() == '请选择'){
			return;
		}
		$('#opendate').prev().find('em').text(
				yeardom.val() + '年'
						 + (halfdom.val() == 'f' ? '上半年' : '下半年'));
		$('#opendate').prev().find('input').val(
				yeardom.val() + '-' + halfdom.val());
		
		setTimeout(function() {
			that.parent().parent().hide();
		}, 80);
	});
	var date = new Date();
	var year = date.getFullYear();
	for (var i = year - 5; i <= year + 5; i++) {
		yeardom.append(new Option(i + '年', i));
	}
	
})();