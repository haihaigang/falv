(function() {

    $('#consult-form').submit(function(e) {
        e.preventDefault();

        if (tempFiles.length <= 0) {
            Tools.showAlert('至少选择一个文件');
            return;
        }

        var comment = $('textarea[name="comment"]').val();
        var d = {
            data: {
                question: comment,
                files: tempFiles
            }
        };

        d = JSON.stringify(d);

        Ajax.submit({
            url: config.api_consult_file_add,
            data: d,
            contentType: 'application/json'
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }
            history.go(-2);
        });

    });
})();
