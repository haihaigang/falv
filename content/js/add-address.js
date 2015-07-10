(function() {
    var tempArea = {},
        pro, city, town, streets, pcode,
        sel = $('#province')[0],
        id = Tools.getQueryValue('id'),
        tempAddress; //临时编辑的地址信息

    if (id) {
        //若是编辑地址
        var result = Storage.get('FLY-ADDRESS');
        for (var i in result) {
            if (result[i]._id == id) {
                tempAddress = result[i];
            }
        }

        if (tempAddress) {
            postname = $('input[name="name"]').val(tempAddress.postName);
            phone = $('input[name="phone"]').val(tempAddress.mobile);
            getRegionData($('#province')[0], '', tempAddress.area.province.id);
            getRegionData($('#city')[0], tempAddress.area.province.id, tempAddress.area.city.id);
            getRegionData($('#area')[0], tempAddress.area.city.id, tempAddress.area.town.id);
            streets = $('input[name="address"]').val(tempAddress.area.streets);
            pcode = $('input[name="postcode"]').val(tempAddress.area.postcode);
        }
    } else {
        getRegionData($('#province')[0]);
    }

    //根据父级获取下级区域数据
    function getRegionData(sel, parent, def, fn) {
        Ajax.custom({
            url: config.api_place,
            data: {
                parent: parent
            }
        }, function(data) {
            var d = data.data.items;

            sel.length = 0;
            for (var i in d) {
                sel.options.add(new Option(d[i].name, d[i]._id));

                if (def == d[i]._id) {
                    sel[i].selected = true;
                }
            }
            fn && fn(data);
        })
    }

    //var address = new myAddress("province");

    $('#province').mobiscroll().select({
        theme: "android-holo-light", // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: "scroller", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: "zh", // Specify language like: lang: 'pl' or omit setting to use default 
        onInit: function() {
            if (tempAddress) {
                $('#province_dummy').val(tempAddress.area.province.name);
            }
        }
    });
    $('#city').mobiscroll().select({
        theme: "android-holo-light", // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: "scroller", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: "zh", // Specify language like: lang: 'pl' or omit setting to use default 
        onInit: function() {
            if (tempAddress) {
                $('#city_dummy').val(tempAddress.area.city.name);
            }
        }
    });

    $('#area').mobiscroll().select({
        theme: "android-holo-light", // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: "scroller", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: "zh", // Specify language like: lang: 'pl' or omit setting to use default 
        onInit: function() {
            if (tempAddress) {
                $('#area_dummy').val(tempAddress.area.town.name);
            }
        }
    });

    $('#province').change(function() {
        getRegionData($('#city')[0], $(this).val());
    });
    $('#city').change(function() {
        getRegionData($('#area')[0], $(this).val());
    });

    $('#addAddress-form').submit(function(e) {
        e.preventDefault();

        var postname = $('input[name="name"]').val(),
            phone = $('input[name="phone"]').val(),
            pro = $('select[name="province"]').val(),
            city = $('select[name="city"]').val(),
            town = $('select[name="area"]').val(),
            streets = $('input[name="address"]').val(),
            pcode = $('input[name="postcode"]').val();

        if (postname.isEmpty()) {
            Tools.showAlert('收货人不能为空', 5000);
            return;
        }
        if (phone.isEmpty()) {
            Tools.showAlert('手机号不能为空', 5000);
            return;
        }
        if (!phone.isPhone()) {
            Tools.showAlert('手机号格式不正确！', 5000);
            return;
        }
        if (pro.isEmpty() || city.isEmpty() || town.isEmpty()) {
            Tools.showAlert('请选择地区', 5000);
            return;
        }
        if (streets.isEmpty()) {
            Tools.showAlert('具体地址不能为空', 5000);
            return;
        }
        if (pcode.isEmpty()) {
            Tools.showAlert('邮政编码不能为空', 5000);
            return;
        }
        var data = {
            data: {
                postName: postname,
                area: {
                    province: {
                        id: pro,
                        name: $('select[name="province"] option:selected').text()
                    },
                    city: {
                        id: city,
                        name: $('select[name="city"] option:selected').text()
                    },
                    town: {
                        id: town,
                        name: $('select[name="area"] option:selected').text()
                    },
                    streets: streets,
                    postcode: pcode
                },
                mobile: phone
            }
        };
        if (id) {
            data.id = id;
        }
        data = JSON.stringify(data);

        Ajax.submit({
            url: id ? config.api_address_update : config.api_address_add,
            data: data,
            showLoading: true,
            contentType: 'application/json'
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            history.go(-1);
            // location.href = 'my-address.html';
        });

    });
})();
