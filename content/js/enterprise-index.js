(function() {
    //点击搜索
    $('#search-form').submit(function(e) {
        e.preventDefault();

        if ($('input[name="province"]').val().isEmpty()) {
            Tools.showAlert('请选择一个省份');
            return;
        }
        if ($('input[name="keyword"]').val().isEmpty()) {
            Tools.showAlert('请输入关键字');
            return;
        }

        $(this)[0].submit();
    });

    var provincePage = $('#province-page');

    //点击打开侧栏页面
    $('#selectPro').click(function() {
        initPage();
        $('.sidebar').addClass('open');
    });

    $('#sidebar-close').click(function(e, touch) {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
    });

    $('.sidebar').animationComplete(function() {
        getProvince();
    });

    //选择了一个省市
    $('#flv-province').on('click', '.value', function(e) {
        e.preventDefault();

        closeSidebar();
        $('#selectPro').val($(this).text());
        $('input[name="province"]').val($(this).attr('data-code'));
    });

    function initPage() {
        var container = $(window);
        var w = container.width(),
            h = container.height();
        provincePage.css({
            'width': w,
            'height': h
        });
    }

    function closeSidebar(fn) {
        $('.sidebar').removeClass('open');
        setTimeout(function() {
            $('#xg-panel-bg').hide();
            hasOpend = false;
            fn && fn();
        }, 220);
    }

    //获取全国省市
    function getProvince() {
        Ajax.custom({
            url: config.api_enterprise_province,
            data: {
                key: config.appkey,
                dtype: 'json'
            }
        }, function(data) {
            if (data.resultcode != '200') {
                return;
            }

            var result = data.result,
                lastLetter,
                res = [], //[{letter:'':items:[]}]
                idx = 0;

            for (var i = 0; i < result.length; i++) {
                var fl = result[i].FirstLetter.substring(0, 1);
                if (!lastLetter) {
                    lastLetter = fl;
                    res.push({
                        'letter': fl,
                        items: []
                    });
                } else if (lastLetter == fl) {
                    res[idx].items.push(result[i]);
                } else {
                    lastLetter = fl;
                    res.push({
                        'letter': fl,
                        items: []
                    });
                    res[idx].items.push(result[i]);
                    idx++;
                }
            }

            Ajax.render('#flv-province', 'flv-province-tmpl', res)

        })
    }

})();
