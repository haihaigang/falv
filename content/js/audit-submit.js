(function() {

    var id = Tools.getQueryValue('id');

    // //文件上传
    // $('#audit-form').on('change', 'input[type="file"]', function() {
    //     if (this.files.length == 0) {
    //         return;
    //     }

    //     var that = $(this),
    //         formData = new FormData();
    //     formData.append('file', this.files[0]);

    //     Ajax.submit({
    //         url: config.api_file_upload,
    //         data: formData,
    //         type: 'POST',
    //         contentType: false,
    //         processData: false,
    //         showLoading: true
    //     }, function(data) {
    //         if (data.error) {
    //             Tools.showAlert(data.error.message);
    //             return;
    //         }

    //         data = data.data[0];
    //         var d = {
    //             fileId: data.fileId,
    //             fileName: data.name
    //         };
    //         tempFiles.push(d);

    //         that.parents('.col').addClass('active').find('input[name="fileName"]').attr("data-id",data._id).val(data.name);
    //         //上传图片成功后，添加下个文件控件
    //         if(that.parents('.col').next().length == 0){
    //             $('#flv-imgs').append($('#flv-imgs-tmpl').html());
    //         }
    //     });
    // })

    // // 预览
    // $('#audit-form').on('click', '.file', function() {
    //     var par = $(this).parent(),
    //         id=par.find('input[type="text"]').attr("data-id");
    //     if(par.hasClass('active')){
    //         window.open(config.api_file_img+id);
    //     }
    // });

    // //移除文件控件
    // $('#audit-form').on('click', '.close', function() {
    //     if ($('#audit-form .col').length <= 1) {
    //         return;
    //     }
    //     if (!$(this).parents('.col').hasClass('active')) {
    //         return;
    //     }
    //     $(this).parents('.col').remove();
    // });

    //提交合同
    $('#audit-form').submit(function(e) {
        e.preventDefault();

        if (tempFiles.length <= 0) {
            Tools.showAlert('至少选择一个文件');
            return;
        }

        var comment = $('textarea[name="comment"]').val();

        // if (comment.isEmpty()) {
        //     Tools.showAlert('请填写您的需求');
        //     return;
        // }

        var d = {
            data: {
                comment: comment,
                originalContract: tempFiles
            },
            uid: Storage.get(Storage.AUTH)
        };

        d = JSON.stringify(d);

        Ajax.submit({
            url: config.api_audit_add,
            data: d,
            processData: false,
            contentType: 'application/json',
            showLoading: true
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }
            history.go(-1);
        });
    });

    //若存在id则编辑
    if (id) {
        Ajax.detail({
            url: config.api_audit_detail,
            data: {
                id: id
            }
        }, function(data) {

        })
    }
})();
