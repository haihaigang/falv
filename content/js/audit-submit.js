(function() {

    var id = Tools.getQueryValue('id');

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
