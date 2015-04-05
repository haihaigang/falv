(function() {
	//标注类型
	var flag = location.search.getQueryValue('flag');
	if(flag == "zhanpan") {
		$("#returnHref").attr("href", "games-zhuanpan");
		$("#dz_type").val("zhuanpan");
	}
	
	var pi = 0, ci = 0, ai = 0, wheels = [],
		lastPi = 0, lastCi = 0, wuAddress;
	
	var from = location.search.getQueryValue('from'),
		receiveForm = $('#receive-form'),
		nameDom = receiveForm.find('input[name="name"]'),
		phoneDom = receiveForm.find('input[name="phone"]'),
		provinceDom = receiveForm.find('input[name="province"]'),
		cityDom = receiveForm.find('input[name="city"]'),
		areaDom = receiveForm.find('input[name="area"]'),
		addressDom = receiveForm.find('input[name="address"]');

	// 数据
	Ajax.queryRecord({
		url : config.gameReceive
	}, function(data) {
		if (data.code != 'OK') {
			Tools.showTip('爷，当前还没有中奖', 5000);
			return;
		}
		
		//设置隐藏值
		receiveForm.find('input[name="giftId"]').val(data.result.gift.giftId);
		receiveForm.find('input[name="model"]').val(data.result.gift.model);
		receiveForm.find('input[name="color"]').val(data.result.gift.color);
		receiveForm.find('input[name="showName"]').val(data.result.giftName);
		if(flag == "zhanpan") {
			$("#id_gameName").html("大转盘游戏");
		}
		receiveForm.show();
		
		wuAddress = new myAddress('address1',{});
		
		initScroller();

		// 点击打开省市选择框
		$("#address1").click(function() {
			Tools.showSelect('', 0);
		});
	});

	// 提交
	receiveForm.submit(function(e) {
		e.preventDefault();

		if (nameDom.val().isEmpty()) {
			Tools.showTip('爷的收礼人姓名不能为空', 5000);
			return;
		}
		if (phoneDom.val().isEmpty()) {
			Tools.showTip('爷的收礼人联系手机不能为空', 5000);
			return;
		}
		if (!phoneDom.val().isPhone()) {
			Tools.showTip('爷的收礼人联系手机号格式不正确', 5000);
			return;
		}
		if (cityDom.val().isEmpty()) {
			Tools.showTip('爷的地区信息未选择', 5000);
			return;
		}
		if (addressDom.val().isEmpty()) {
			Tools.showTip('爷的收礼人详细地址不能为空', 5000);
			return;
		}

		Ajax.submitForm({
			url : config.gameReceive,
			data : receiveForm
		}, function(data) {
			if(data.code != 'OK'){
				Tools.showTip('爷，当前还没有中奖', 5000);
				return;
			}
			
			var hasReg = receiveForm.find('input[name="hasreg"]:checked').val();
			if(hasReg && hasReg == '1'){
				location.href = '../register?phone='+phoneDom.val()+'&from='+encodeURIComponent('hui/my-gift?type=receive');
			}else{
				if(flag == "zhanpan") {
					location.href = from || 'games-zhuanpan';
				}else {
					location.href = from || 'games';
				}
			}
		});
	});

	// 初始化省市选择框
	function initScroller() {
		getDefaultValues();

		$("#address").scroller({
			theme : 'bootstrap',
			display : 'inline',
			mode : 'scroller',
			wheels : wheels,
			height : 40,
			width : '',
			showLabel : false,
			onBeforeShow : function(inst) {
				instance = inst;
				setWheel();
			},
			validate : onValidate,
			onChange : onChangeScroll
		});

		// 设置默认值
		$("#address").mobiscroll('setValue', getDefaultValues());
	}

	// 设置默认值
	function getDefaultValues() {
		for (var i = 0; i < wuAddress.data.length; i++) {
			if (wuAddress.data[i].name == provinceDom.val()) {
				pi = i;
				break;
			}
		}

		for (var i = 0; i < wuAddress.data[pi].sub.length; i++) {
			if (wuAddress.data[pi].sub[i].name == cityDom.val()) {
				ci = i;
				break;
			}
		}

		for (var i = 0; i < wuAddress.data[pi].sub[ci].sub.length; i++) {
			if (wuAddress.data[pi].sub[ci].sub[i].name == areaDom.val()) {
				ai = i;
				break;
			}
		}

		setWheel();

		return [ pi, ci, ai ];
	}

	// 初始化后或选项改变时
	function onValidate(html, index, inst) {
		if (!index) { // 0 or undefined
			var inst = $(this).scroller('getInst');
			if (inst) {
				var newcolor = 'cuts' + inst.temp[0];
				var oldcolor = 'cuts' + inst.values[0];

				// $('.dwwr', o).removeClass(oldcolor).addClass(newcolor);
			} else {
				// $('.dwwr', o).addClass('cuts0');
			}

			var addressPanel = $('#mySelect').width();

			$('.dwc').css('width', addressPanel / 3);

			$('.dwc').each(function() {
				var wt = $(this).width();
				$(this).find('.dw-i').width(wt);
			});
		}
	}

	// 关闭按钮
	$('#mySelect .btn').click(function() {
		$('#province').text(wuAddress.data[pi].name);
		$('#city').text(wuAddress.data[pi].sub[ci].name);
		$('#area').text(wuAddress.data[pi].sub[ci].sub[ai].name);
		provinceDom.val(wuAddress.data[pi].name);
		cityDom.val(wuAddress.data[pi].sub[ci].name);
		areaDom.val(wuAddress.data[pi].sub[ci].sub[ai].name);
		Tools.hideSelect();
	});

	function onChangeScroll(v, inst) {
		var item = inst.values;
		if (item[0]) {
			pi = item[0];
		}
		if (item[1]) {
			if (lastPi != pi) {
				ci = 0;
			} else {
				ci = item[1];
			}
		}
		if (item[2]) {
			if (lastCi != ci) {
				ai = 0;
			} else {
				ai = item[2];
			}
		}

		lastPi = pi;
		lastCi = ci;
		setWheel();
		inst.changeWheel([ 1 ], 0.2, true);
		inst.changeWheel([ 2 ], 0.3, true);
	}

	function setWheel() {
		var htmlsa = [], htmlsb = [], htmlsc = [];

		for (var i = 0; i < wuAddress.data.length; i++) {
			htmlsa.push(wuAddress.data[i].name);
		}
		for (var i = 0; i < wuAddress.data[pi].sub.length; i++) {
			htmlsb.push(wuAddress.data[pi].sub[i].name);
		}
		for (var i = 0; i < wuAddress.data[pi].sub[ci].sub.length; i++) {
			htmlsc.push(wuAddress.data[pi].sub[ci].sub[i].name);
		}
		wheels[0] = {
			address_a : htmlsa
		};
		wheels[1] = {
			address_a : htmlsb
		};
		wheels[2] = {
			address_a : htmlsc
		};

	}
})();