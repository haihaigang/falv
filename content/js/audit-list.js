(function() {

    //获取统计信息
    //ST0001-法律咨询, ST0002-发律师函, ST0003-智能合同, ST0004-合同审核, ST0005-法律培训
    Ajax.custom({
        url: config.api_service_stat,
        data: {
            serviceType: 'ST0004'
        }
    }, function(data) {
        if (data.error) {
            return;
        }

        //剩余服务为0，左上角显示关于
        if(data.data.remainAmounttotal == 0){
            $('.icon-audit').text('关于').attr('href','audit-info.html');
        }

        Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);
    });

    //分页
    config.paging = function() {
        Ajax.paging({
            url: config.api_audit_list,
            data: {
                skip: config.skip,
                limit: config.pageSize
            }
        });
    };

    config.paging();

    //开始审核前，调用接口确认
    $('.icon-audit').click(function(e) {
        e.preventDefault();

        var that = $(this);

        Ajax.custom({
            url: config.api_service_valid,
            data: {
                userId: Storage.get(Storage.AUTH),
                serviceType: 'ST0004'
            }
        }, function(data) {
            if (data.data == 0) {
                Tools.showAlert('没有服务，请购买后使用');
                return;
            }
            location.href = that.attr('href');
        })
    })
})();
