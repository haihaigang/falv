(function() {
    var tempArea = {},
        pro, city, town, streets, pcode;
    var id = Tools.getQueryValue('id');

    $('#addAddress-form').on('change', 'input[name="address1"]', function() {
        pro = $('input[name="province"]').val(),
            city = $('input[name="city"]').val(),
            town = $('input[name="area"]').val();
    })
    $('#addAddress-form').on('change', 'input[name="address"]', function() {
        streets = $(this).val();
    })
    $('#addAddress-form').on('change', 'input[name="postcode"]', function() {
        pcode = $(this).val();
    })

log(id)
    if (id) {
        Ajax.custom({
            url: config.api_address_detail,
            data: {
                id: id
            }
        },function(data){
            if(data.error){
                return;
            }

            $('input[name="name"]').val(data.data.postName);
            $('input[name="phone"]').val(data.data.mobile);
            $('input[name="postcode"]').val(data.data.area.postcode);
            $('input[name="address"]').val(data.data.area.streets);

        });
    }

    $('#addAddress-form').submit(function(e) {
        e.preventDefault();

        var postname = $('input[name="name"]').val(),
            phone = $('input[name="phone"]').val();
        if (postname.isEmpty()) {
            Tools.showAlert('收货人不能为空', 5000);
            return;
        }
        if (phone.isEmpty()) {
            Tools.showAlert('手机号码不能为空', 5000);
            return;
        }
        if (!phone.isPhone()) {
            Tools.showAlert('手机号码格式不正确！', 5000);
            return;
        }
        // if (pro.isEmpty()) {
        //     Tools.showAlert('地址不能为空', 5000);
        //     return;
        // }
        if (streets.isEmpty()) {
            Tools.showAlert('具体地址不能为空', 5000);
            return;
        }
        if (pcode.isEmpty()) {
            Tools.showAlert('邮政编码不能为空', 5000);
            return;
        }
        tempArea = {
            province: pro,
            city: city,
            town: town,
            streets: streets,
            postcode: pcode
        }
        var data = {
            postName: postname,
            area: tempArea,
            mobile: phone
        };

        Ajax.submit({
            url: config.api_add_address,
            data: data
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            location.href = 'my-address.html';
        });

    });
})();
