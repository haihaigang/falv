(function() {

    //文件上传
    $('#audit-form').on('change', 'input[type="file"]', function() {
        if (this.files.length == 0) {
            return;
        }

        var that = $(this),
            formData = new FormData();
        formData.append('file', this.files[0]);

        Ajax.custom({
            url: config.api_file_upload,
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false
        }, function(data) {

        	that.parents('.col').addClass('active');
            //上传图片成功后，添加下个文件控件
            $('#flv-imgs').append($('#flv-imgs-tmpl').html());
        });
    })

    //移除文件控件
    $('#audit-form').on('click', '.close', function() {
        if ($('#audit-form .col').length <= 1) {
            return;
        }
        $(this).parents('.col').remove();
    });

    $('#audit-form').submit(function(e) {
        e.preventDefault();

        Ajax.submit({
            url: config.api_audit_add,
            data: $(this)
        }, function(data) {

        });

    });
})();
