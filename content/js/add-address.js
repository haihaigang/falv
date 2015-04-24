(function() {
    var tempArea={},pro,city,town,streets,pcode;

    $('#addAddress-form').on('change','input[name="province"]',function(){
        pro = $('input[name="province"]').val(),
        city = $('input[name="city"]').val(),
        town = $('input[name="area"]').val();
    })
    $('#addAddress-form').on('change','input[name="address"]',function(){
        streets = $(this).val();
    })
    $('#addAddress-form').on('change','input[name="postcode"]',function(){
        pcode = $(this).val();
    })



    $('#addAddress-form').submit(function(e) {
        e.preventDefault();

        var postname = $('input[name="name"]').val(),
            phone = $('input[name="phone"]').val();
        if(postname.isEmpty()){
            Tools.showAlert('邮寄人不能为空',5000);
            return;
        }
        if(!phone.isEmpty()){
            Tools.showAlert('手机号不能为空',5000);
            return;
        }
        if(!phone.isPhone()){
            Tools.showAlert('手机号格式不正确！',5000);
            return;
        }
        if(pro.isEmpty()){
            Tools.showAlert('地址不能为空',5000);
            return;
        }
        if(streets.isEmpty()){
            Tools.showAlert('具体地址不能为空',5000);
            return;
        }
        if(pcode.isEmpty()){
            Tools.showAlert('邮政编码不能为空',5000);
            return;
        }
        tempArea={
            province : pro,
            city : city,
            town : town,
            streets : streets,
            postcode : pcode 
        }
        var data = {
            postName : postname,
            area : tempArea,
            mobile : phone
        };

        Ajax.submit({
            url: config.api_add_address,
            data: data
        }, function(data) {

            location.href = 'my-address.html';
        });

    });
})();