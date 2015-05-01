(function() {

    var tempFiles = [];//存储临时文件数组

    //文件上传
    $('#consult-form').on('change', 'input[type="file"]', function() {
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
            if(data.error){
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
    $('#consult-form').on('click', '.close', function() {
        if ($('#consult-form .col').length <= 1) {
            return;
        }
        if(!$(this).parents('.col').hasClass('active')){
            return;
        }
        $(this).parents('.col').remove();
    });

    $('#consult-form').submit(function(e) {
        e.preventDefault();

        if(tempFiles.length <= 0){
            Tools.showAlert('至少选择一个文件');
            return;
        }

        var comment = $('textarea[name="comment"]').val();
        var d = {
            question: comment,
            files: tempFiles
        };

        d = JSON.stringify(d);

        Ajax.submit({
            url: config.api_consult_file_add,
            data: {
                data: d
            }
        }, function(data) {
            if(data.error){
                Tools.showAlert(data.error.message);
                return;
            }
            history.go(-2);
        });

    });
})();
