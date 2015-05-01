(function() {

	var status = {
		'LS0003': '提交中',
		'LS0004': '起草中',
		'LS0005': '确认中',
		'LS0006': '投递中',
		'LS0007': '存档中'
	};

	var statuslabel = {
		'LS0003': '提交时间',
		'LS0004': '预计完成',
		'LS0005': '客户确认',
		'LS0006': '投递完成',
		'LS0007': '存档完成'
	}

	//模板帮助方法， 确定状态
	template.helper('$getLetterStatus', function(content) {
		if(!content){
			return '--';
		}

		return status[content] || '--';
	});

	//模板帮助方法， 确定状态时间label
	template.helper('$getLetterLabel', function(content) {
		if(!content){
			return '--';
		}

		return statuslabel[content] || '--';
	});


	var id = Tools.getQueryValue('id');

    Ajax.custom({
        url: config.api_letter_detail,
        data: {
        	id: id
        },
        showLoading: true
    },function(data){
    	if(data.error){
    		return;
    	}

    	var d = data.data,st = [];
    	d.statusHistory = d.statusHistory || [];
    	for(var i in status){
    		var flag = {status: i, statusUpdateAt: '--',active: false};
    		for(var j in d.statusHistory){
    			if(d.statusHistory[j].status == i){
    				flag.statusUpdateAt = d.statusHistory[j].statusUpdateAt;
    				flag.active = true;
    			}
    		}
    		st.push(flag);
    	}
    	d.statusHistory = st;

    	Ajax.render('#flv-detail','flv-detail-tmpl', d);
    });
})();
