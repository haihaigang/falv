(function() {

    //点击tab切换
    $('.letter-tabs-item').click(function() {
        $('.letter-tabs-item').removeClass('active');
        $(this).addClass('active');

        if ($(this).hasClass('personal')) {
            $('input[name="type"]').val('CT0002');
            $('.items-ent').hide().find('input').prop('disabled', true);
            $('.items-per').show().find('input').prop('disabled', false);
        } else {
            $('input[name="type"]').val('CT0001');
            $('.items-ent').show().find('input').prop('disabled', false);
            $('.items-per').hide().find('input').prop('disabled', true);
        }
    });

    var tempFiles = []; //存储临时文件数组

    //文件上传
    $('#letter-form').on('change', 'input[type="file"]', function() {
        if (this.files.length == 0) {
            return;
        }

        var that = $(this),
            formData = new FormData();
        formData.append('file', this.files[0]);

        Ajax.submit({
            url: config.api_file_upload,
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            data = data.data[0];
            var d = {
                fileId: data.fileId,
                fileName: data.name
            };
            tempFiles.push(d);

            that.parents('.col').addClass('active').find('input[type="text"]').val(data.name);
            //上传图片成功后，添加下个文件控件
            $('#flv-imgs').append($('#flv-imgs-tmpl').html());
        });
    })

    //移除文件控件
    $('#letter-form').on('click', '.close', function() {
        if ($('#letter-form .col').length <= 1) {
            return;
        }
        if (!$(this).parents('.col').hasClass('active')) {
            return;
        }
        $(this).parents('.col').remove();
    });

    //提交表单
    $('#letter-form').submit(function(e) {
        e.preventDefault();

        //验证必填
        if ($('input[name="type"]').val() == 'CT0001') {
            if ($('input[name="corporate"]').val().isEmpty()) {
                Tools.showAlert('企业名称必填');
                return;
            }
            if ($('input[name="represents"]').val().isEmpty()) {
                Tools.showAlert('法人代表必填');
                return;
            }
        } else {
            if ($('input[name="name"]').val().isEmpty()) {
                Tools.showAlert('收函人姓名必填');
                return;
            }
        }

        if ($('input[name="phone"]').val().isEmpty()) {
            Tools.showAlert('收函人电话必填');
            return;
        }
        if ($('select[name="town"]').val().isEmpty()) {
            Tools.showAlert('收函人地区必填');
            return;
        }
        if ($('input[name="streets"]').val().isEmpty()) {
            Tools.showAlert('具体收函地址必填');
            return;
        }
        if ($('input[name="postcode"]').val().isEmpty()) {
            Tools.showAlert('邮政编码必填');
            return;
        }
        if ($('textarea[name="problem"]').val().isEmpty()) {
            Tools.showAlert('情况说明必填');
            return;
        }
        if (tempFiles.length <= 0) {
            Tools.showAlert('至少上传一个证据材料');
            return;
        }
        if ($('textarea[name="expectation"]').val().isEmpty()) {
            Tools.showAlert('您的需求必填');
            return;
        }

        //转换数据
        var formData = Tools.formJson($(this));
        formData.evidences = tempFiles;
        formData.address = {
            province: {
                cityId: $('select[name="province"]').val(),
                id: $('select[name="province"]').val(),
                name: $('select[name="province"] option:selected').text()
            },
            city: {
                cityId: $('select[name="city"]').val(),
                id: $('select[name="city"]').val(),
                name: $('select[name="city"] option:selected').text()
            },
            town: {
                cityId: $('select[name="town"]').val(),
                id: $('select[name="town"]').val(),
                name: $('select[name="town"] option:selected').text()
            },
            streets: $('input[name="streets"]').val(),
            postcode: $('input[name="postcode"]').val()
        };
        if('postcode' in formData){
            delete(formData['postcode']);
        }
        if('streets' in formData){
            delete(formData['streets']);
        }
        if('province' in formData){
            delete(formData['province']);
        }
        if('city' in formData){
            delete(formData['city']);
        }
        if('town' in formData){
            delete(formData['town']);
        }
        var d = {
            data: formData
        }

        d = JSON.stringify(d);

        Ajax.submit({
            url: config.api_letter_add,
            data: d
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }
            history.go(-1);
        })
    });

    config.api_place = config.server + '/place/list.json';


    getRegionData($('#province')[0]);

    $('#province').change(function() {
        getRegionData($('#city')[0], $(this).val());
    });
    $('#city').change(function() {
        getRegionData($('#area')[0], $(this).val());
    });

    $('#province').mobiscroll().select({
        theme: "android-holo-light", // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: "scroller", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: "zh" // Specify language like: lang: 'pl' or omit setting to use default 
    });
    $('#city').mobiscroll().select({
        theme: "android-holo-light", // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: "scroller", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: "zh" // Specify language like: lang: 'pl' or omit setting to use default 
    });

    $('#area').mobiscroll().select({
        theme: "android-holo-light", // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: "scroller", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: "zh" // Specify language like: lang: 'pl' or omit setting to use default 
    });

    //根据父级获取下级区域数据
    function getRegionData(sel, parent, def, fn) {
        Ajax.custom({
            url: config.api_place,
            data: {
                parent: parent
            }
        }, function(data) {
            var d = data.data.items;

            sel.length = 0;
            for (var i in d) {
                sel.options.add(new Option(d[i].name, d[i]._id));

                if (def == d[i]._id) {
                    sel[i].selected = true;
                }
            }
            fn && fn(data);
        })
    }
})()
