(function() {

	//获取统计信息
	//ST0001-法律咨询, ST0002-发律师函, ST0003-智能合同, ST0004-合同审核, ST0005-法律培训
	Ajax.custom({
		url: config.api_service_stat,
		data: {
			serviceType: 'ST0003'
		}
	},function(data){
		if(data.error){
			return;
		}

		Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);
	});

	//分页
    Ajax.paging({
        url: config.api_cont_list,
        data: {
            skip: '',
            limit: ''
        }
    });

    //开始起草前，调用接口确认
    $('.icon-audit').click(function(e){
    	e.preventDefault();

    	var that = $(this);

    	Ajax.custom({
    		url: config.api_service_valid,
    		data: {
    			userId:Storage.get(Storage.AUTH),
    			serviceType: 'ST0003'
    		}
    	},function(data){
    		if(data.error){
    			Tools.showAlert(dta.error.message);
    			return;
    		}
    		location.href = that.attr('href');
    	})
    })
})();
