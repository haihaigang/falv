(function() {

    var account = Storage.get(Storage.ACCOUNT);

    if(account){
        $('input[name="name"]').val(account.name);
        
    }

    $('#userMsg-form').submit(function(e) {
        e.preventDefault();

        var name = $('input[name="name"]').val(),
            sex = $('input[name="nickname"]').val(),
            password = $('input[name="password"]').val(),
            password1 = $('input[name="repassword"]').val(),
            orignal = $('input[name="orignal"]').val();

        if (name.isEmpty()) {
            Tools.showAlert('您的姓名不能为空', 5000);
            return;
        }
        if (password.isEmpty()) {
            Tools.showAlert("密码不能为空", 5000);
            return;
        }
        if (!password.isValidPwd()) {
            Tools.showAlert("密码格式不正确", 5000);
            return;
        }
        if (password1.isEmpty()) {
            Tools.showTip('确认密码不能为空', 5000);
            return;
        }
        if (password != password1) {
            Tools.showAlert("确认密码不一致", 5000);
            return;
        }


        var data = {
            name: name,
            sex: sex,
            password: password,
            orignal: orignal
        };

        Ajax.submit({
            url: config.api_user_msg,
            data: data,
            type: 'PUT'
        }, function(data) {

            location.href = 'index.html';
        });

    });
})();
