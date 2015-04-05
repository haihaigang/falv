(function(){

    var pi = 0, ci = 0, ai = 0, wheels = [],
		lastPi = 0, lastCi = 0;
    
	var wuAddress,
		giftForm = $('form'),
		id = location.search.getQueryValue('id'),
		uid = config.getId(),
		account = Storage.get(Storage.ACCOUNT),
		nameDom = giftForm.find('input[name="name"]'),
		phoneDom = giftForm.find('input[name="phone"]'),
		provinceDom = giftForm.find('input[name="province"]'),
		cityDom = giftForm.find('input[name="city"]'),
		areaDom = giftForm.find('input[name="area"]'),
		addressDom = giftForm.find('input[name="address"]'),
		codeDom = giftForm.find('input[name="postcode"]');
	
	giftForm.find('input[name="giftPutOutId"]').val(id);
	giftForm.find('input[name="memberId"]').val(uid);
	giftForm.find('input[name="openId"]').val(
			location.search.getQueryValue('openId'));

	if(account){
		if(account.privateInfo && typeof JSON != 'undefined'){
			initAddress(account.privateInfo);
		}else{
			nameDom.val(account.realName);
			phoneDom.val(account.phone);
			wuAddress = new myAddress('address1',{});
		}
		initScroller();
	}else{
		//若本地存储丢失
		Ajax.queryRecord({
			url: config.myInfo,
			data: {
				uid: config.getId()
			}
		},function(data){
			if(data.code != 'OK'){
				return;
			}

			if(data.result.privateInfo){
				initAddress(data.result.privateInfo);
			}else{
				nameDom.val(data.result.realName);
				phoneDom.val(data.result.phone);
				wuAddress = new myAddress('address1',{});
			}
			initScroller();
		});
	}

	//提交
	//giftForm.submit(function(e) {
	$('.icon_confirm').click(function(e) {
		e.preventDefault();
		
		if(nameDom.val().isEmpty()){
			Tools.showTip('爷的收礼人姓名不能为空',5000);
			return;
		}
		if(phoneDom.val().isEmpty()){
			Tools.showTip('爷的收礼人联系手机不能为空',5000);
			return;
		}
		if(!phoneDom.val().isPhone()){
			Tools.showTip('爷的收礼人联系手机号格式不正确',5000);
			return;
		}
		if(cityDom.val().isEmpty()){
			Tools.showTip('爷的地区信息未选择',5000);
			return;
		}
		if(addressDom.val().isEmpty()){
			Tools.showTip('爷的收礼人详细地址不能为空',5000);
			return;
		}
		if(codeDom.val().length != 0 && !codeDom.val().isPostCode()){
			Tools.showTip('爷的邮政编码格式不正确',5000);
			return;
		}
		
		if(checkAddress()){
			Tools.showConfirm('爷，保存收礼地址吗？',function(){
				saveAddress();
				saveGift();
			},function(){
				saveGift();
			});
		}else{

			saveGift();
		}
	});
	
	//初始化地址
	function initAddress(privateInfo){
		//目前接口需转义引号
		var address = privateInfo.replace(/&quot;/g,'"');
		address = JSON.parse(address);
		
		nameDom.val(address.name);
		phoneDom.val(address.phone);
		provinceDom.val(address.province);
		cityDom.val(address.city);
		areaDom.val(address.area);
		addressDom.val(address.address);
		codeDom.val(address.postcode);
		
		$('#province').text(address.province);
		$('#city').text(address.city);
		$('#area').text(address.area);

		wuAddress = new myAddress('address1',{
			defaultProvince: address.province,
			defaultCity: address.city
		});
	}
	
	//更新礼品收礼地址
	function saveGift(){
		Ajax.submitForm({
			url : config.giftAddress,
			data : giftForm
		}, function(data) {
			if(data.code != 'OK'){
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			location.href = '../hui/my-gift-detail?id='+data.result;
			//history.go(-1);
		});
	}
	
	//保存收礼地址
	function saveAddress(){
		Ajax.submitForm({
			url : config.myAddress,
			data : {
				uid: uid,
				addressInfo: getString()
			}
		}, function(data) {
			if(data.code != 'OK'){
				return;
			}

			Storage.set(Storage.ACCOUNT, data.result);
			account = Storage.get(Storage.ACCOUNT);
		});
	}
	
	//比较地址是否更改，已更改true、未更改false
	function checkAddress(){
		if(!account || !account.privateInfo){
			return true;
		}
		
		var address = account.privateInfo.replace(/&quot;/g,'"');
		address = JSON.parse(address);
		
		if(address.name != nameDom.val()){
			return true;
		}
		if(address.phone != phoneDom.val()){
			return true;
		}
		if(address.area != areaDom.val()){
			return true;
		}
		if(address.address != addressDom.val()){
			return true;
		}
		if(address.postcode != codeDom.val()){
			return true;
		}
		
		return false;
	}
	
	//对象转字符串
	function getString(){
		var result = {};
		result.name = nameDom.val();
		result.phone = phoneDom.val();
		result.province = provinceDom.val();
		result.city = cityDom.val();
		result.area = areaDom.val();
		result.address = addressDom.val();
		result.postcode = codeDom.val();
		
		if(typeof JSON != 'undefined'){
			return JSON.stringify(result);
		}else{
			return '';
		}
	}
        
        //初始化省市选择框
        function initScroller(){
	        getDefaultValues();
	        
			$("#address").scroller({
				theme: 'bootstrap',
				display: 'inline',
				mode: 'scroller',
				wheels: wheels,
				height: 40,
				width: '',
				showLabel: false,
				onBeforeShow: function (inst) {
		            instance = inst;
		            setWheel();
		        },
				validate: onValidate,
				onChange: onChangeScroll
			});
	
			//设置默认值
		    $("#address").mobiscroll('setValue', getDefaultValues());
        }
		
		//设置默认值
		function getDefaultValues(){
			for(var i=0;i<wuAddress.data.length;i++){
				if(wuAddress.data[i].name == provinceDom.val()){
					pi = i;
					break;
				}
			}
			
			for(var i=0;i<wuAddress.data[pi].sub.length;i++){
				if(wuAddress.data[pi].sub[i].name == cityDom.val()){
					ci = i;
					break;
				}
			}
			
			for(var i=0;i<wuAddress.data[pi].sub[ci].sub.length;i++){
				if(wuAddress.data[pi].sub[ci].sub[i].name == areaDom.val()){
					ai = i;
					break;
				}
			}
			
			setWheel();
			
			return [pi,ci,ai];
		}
		
		//初始化后或选项改变时
		function onValidate(html, index, inst) {
			if (!index) { // 0 or undefined
				var inst = $(this).scroller('getInst');
				if (inst) {
					var newcolor = 'cuts' + inst.temp[0];
					var oldcolor = 'cuts' + inst.values[0];
	
					//$('.dwwr', o).removeClass(oldcolor).addClass(newcolor);
				}
				else {
					//$('.dwwr', o).addClass('cuts0');
				}

				var addressPanel = $('#mySelect').width();
				
				$('.dwc').css('width',addressPanel/3);
				
				$('.dwc').each(function(){
					var wt = $(this).width();
					$(this).find('.dw-i').width(wt);
				});
			}
		}
			
		//关闭按钮
		$('#mySelect .btn').click(function(){
			$('#province').text(wuAddress.data[pi].name);
			$('#city').text(wuAddress.data[pi].sub[ci].name);
			$('#area').text(wuAddress.data[pi].sub[ci].sub[ai].name);
			provinceDom.val(wuAddress.data[pi].name);
			cityDom.val(wuAddress.data[pi].sub[ci].name);
			areaDom.val(wuAddress.data[pi].sub[ci].sub[ai].name);
			Tools.hideSelect();
		});
		
		//点击打开省市选择框
		$("#address1").click(function(){
			Tools.showSelect('',0);
		});
		
		function onChangeScroll(v, inst){
			var item = inst.values;
			if(item[0]){
				pi = item[0];
			}
			if(item[1]){
				if(lastPi != pi){
					ci = 0;
				}else{
					ci = item[1];
				}
			}
			if(item[2]){
				if(lastCi != ci){
					ai = 0;
				}else{
					ai = item[2];
				}
			}
			
			lastPi = pi;
			lastCi = ci;
			setWheel();
			inst.changeWheel([1], 0.2, true);
			inst.changeWheel([2], 0.3, true);
		}
		
		function setWheel(){
	        var htmlsa=[],htmlsb=[],htmlsc=[];
	        
	        for(var i=0;i<wuAddress.data.length;i++)
	        {
	            htmlsa.push(wuAddress.data[i].name);
	        }
	        for(var i=0;i<wuAddress.data[pi].sub.length;i++)
	        {
	            htmlsb.push(wuAddress.data[pi].sub[i].name);
	        }
	        for(var i=0;i<wuAddress.data[pi].sub[ci].sub.length;i++)
	        {
	            htmlsc.push(wuAddress.data[pi].sub[ci].sub[i].name);
	        }
	        wheels[0]={ address_a: htmlsa };
	        wheels[1]={ address_a: htmlsb };
	        wheels[2]={ address_a: htmlsc };
	        
		}
})();