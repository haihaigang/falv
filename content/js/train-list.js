(function() {

	//获取统计信息
	//ST0001-法律咨询, ST0002-发律师函, ST0003-智能合同, ST0004-合同审核, ST0005-法律培训
	Ajax.custom({
		url: config.api_service_stat,
		data: {
			serviceType: 'ST0005'
		}
	},function(data){
		if(data.error){
			return;
		}
	
		Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);
	})

	//分页
    Ajax.paging({
        url: config.api_train_list,
        data: {
            skip: config.skip,
            limit: config.pageSize
        }
    }, function(data) {

    });
})();
