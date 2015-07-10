(function() {

    var account = Storage.get(Storage.ACCOUNT);

    if (account) {
        $('input[name="name"]').val(account.name);
        $('select[name="sex"]').val(account.extend.sex);
    }

    $('#nickName').mobiscroll().select({
        theme: "android-holo-light",
        mode: "scroller",
        display: "bottom",
        lang: "zh"
    });


    $('#userMsg-form').submit(function(e) {
        e.preventDefault();

        var name = $('input[name="name"]').val(),
            sex = $('select[name="sex"]').val(),
            password = $('input[name="password"]').val(),
            password1 = $('input[name="repassword"]').val(),
            original = $('input[name="original"]').val();

        if (name.isEmpty()) {
            Tools.showAlert('您的姓名不能为空', 5000);
            return;
        }
        if (original.isEmpty()) {
            Tools.showAlert("原始密码不能为空", 5000);
            return;
        }
        if (password.isEmpty()) {
            Tools.showAlert("新密码不能为空", 5000);
            return;
        }
        if (!password.isValidPwd()) {
            Tools.showAlert("新密码格式不正确", 5000);
            return;
        }
        if (password1.isEmpty()) {
            Tools.showAlert('确认密码不能为空', 5000);
            return;
        }
        if (password != password1) {
            Tools.showAlert("确认密码不一致", 5000);
            return;
        }


        var data = {
            uid: account._id,
            name: name,
            sex: sex,
            password: password,
            original: original
        };

        Ajax.submit({
            url: config.api_user_msg,
            data: data,
            type: 'PUT'
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            Storage.set(Storage.ACCOUNT, data.data);
            Tools.showAlert('信息修改成功', 0, function(){
                location.href = 'index.html';
            });
        });

    });
})();
