(function() {

    //点击tab切换
    $('.letter-tabs-item').click(function() {
        $('.letter-tabs-item').removeClass('active');
        $(this).addClass('active');

        if ($(this).hasClass('personal')) {
            $('input[name="type"]').val(2);
            $('.items-ent').hide().find('input').prop('disabled', true);
            $('.items-per').show().find('input').prop('disabled', false);
        } else {
            $('input[name="type"]').val(1);
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

            that.parents('.col').addClass('active').find('input[name="fileName"]').val(data.name);
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
        if ($('input[name="type"]').val() == '1') {
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
        if ($('input[name="town"]').val().isEmpty()) {
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
        formData = JSON.stringify(formData);
        log(formData);

        Ajax.submit({
            url: config.api_letter_add,
            data: {
            	data: formData
            }
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }
        })
    })
})()
