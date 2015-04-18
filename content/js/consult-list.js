(function() {

    var api_url = config.api_consult_list;

    //获取统计信息
    //ST0001-法律咨询, ST0002-发律师函, ST0003-智能合同, ST0004-合同审核, ST0005-法律培训
    Ajax.custom({
        url: config.api_service_stat,
        data: {
            serviceType: 'ST0001'
        }
    }, function(data) {
        if (data.error) {
            return;
        }

        Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);
    });

    //分页
    config.paging = getList;
    config.paging();

    //点击tab切换
    $('.consult-tabs-item').click(function(e) {
        $('.consult-tabs-item').removeClass('active');
        $('.consult-list').hide();
        $(this).addClass('active');

        if ($(this).hasClass('question')) {
            config.paging = getFileList;
            $('#question').show();
        } else {
            config.paging = getList;
            $('#tel').show();
        }
        config.paging();
    });

    function getList() {
        Ajax.paging({
            url: config.api_consult_list,
            data: {
                ship: '',
                limit: ''
            },
            renderEle: '#flv-list',
            renderFor: 'flv-list-tmpl'
        });
    }

    function getFileList() {
        Ajax.paging({
            url: config.api_consult_file_list,
            data: {
                ship: '',
                limit: ''
            },
            renderEle: '#flv-list-file',
            renderFor: 'flv-list-file-tmpl'
        });
    }

    $('#flv-list').on('click', 'a.box', function(e){
        e.preventDefault();

        var d = {};
        d.answer = $(this).attr('data-answer');
        d.status = $(this).attr('data-status');
        d.question = $(this).find('.title .txt').text();
        d.startTime = $(this).find('.start .txt').text();
        d.endTime = $(this).find('.end .txt').text();
        d.duration = $(this).find('.duration .txt').text();

        Storage.set('FLV-CONSULT',d);

        location.href = $(this).attr('href');
    });
})();
