(function() {
    var province = Tools.getQueryValue('province'),
        keyword = Tools.getQueryValue('keyword'),
        p = Tools.getQueryValue('p'),
        provincePage = $('#province-page'),
        provinceDom = $('input[name="province"]');

    var count = 3; //继续查询次数

    provinceDom.val(province);
    $('#province').val(p);
    $('#keyword').val(keyword);

    getResult();

    //点击搜索
    $('#result-form').submit(function(e) {
        e.preventDefault();

        province = provinceDom.val();
        keyword = $('#keyword').val();

        if (province.isEmpty()) {
            Tools.showAlert('请选择一个省份');
            return;
        }
        if (keyword.isEmpty()) {
            Tools.showAlert('请输入关键字');
            return;
        }

        getResult();
    });

    //获取企业查询结果
    function getResult() {
        count = 3;
        Ajax.custom({
            url: config.api_enterprise_search,
            data: {
                key: config.appkey,
                dtype: 'json',
                province: province,
                companyName: keyword
            },
            showLoading: true
        }, function(data) {
            data = data.data;
            if (data.Status != '200') {
                if (data.Status == '205') {
                    getContinueSearch(data.JobId);
                    return;
                }
                $('#flv-list').html('<div class="nodata">' + data.Message + '</div>');
                return;
            }

            Ajax.render('#flv-list', 'flv-list-tmpl', data.Result);
        }, function() {

        });
    }

    //点击打开侧栏页面
    $('#province').click(function() {
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
        $('#province').val($(this).text());
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
            data = data.data;
            if (data.Status != '200') {
                return;
            }

            var result = data.Result,
                lastLetter,
                res = [], //[{letter:'':items:[]}]
                idx = 0;

            for (var i = 0; i < result.length; i++) {
                var fl = result[i].Code.substring(0, 1);
                if (!lastLetter) {
                    lastLetter = fl;
                    res.push({
                        'letter': fl,
                        items: [result[i]]
                    });
                } else if (lastLetter == fl) {
                    res[idx].items.push(result[i]);
                } else {
                    idx++;
                    lastLetter = fl;
                    res.push({
                        'letter': fl,
                        items: []
                    });
                    res[idx].items.push(result[i]);
                }
            }
            log(res);

            Ajax.render('#flv-province', 'flv-province-tmpl', res)

        })
    }

    //若查询接口返回205，则定时调用改接口，最多3次
    function getContinueSearch(jobId) {
        count--;
        setTimeout(function() {
            Ajax.custom({
                url: config.api_enterprise_continue_search,
                data: {
                    JobId: jobId
                },
                showLoading: false
            }, function(data) {
                data = data.data;
                if (data.Status != '200') {
                    if (data.Status == '205' && count > 0) {
                        getContinueSearch(data.JobId);
                        return;
                    }
                    if(count <= 0){
                        $('#flv-list').html('<div class="nodata">请求超时，请重试</div>');
                        return;
                    }
                    $('#flv-list').html('<div class="nodata">' + data.Message + '</div>');
                    return;
                }

                Ajax.render('#flv-list', 'flv-list-tmpl', data.Result);
            }, function() {

            });
        }, 500)
    }


    //模板帮助方法，获取临时变量province
    template.helper('$getProvince', function() {
        return province;
    });


})();
