(function() {
    var id = Tools.getQueryValue('id'), letterData;

    //点击tab切换
    $('.letter-tabs-item').click(function() {
        $('.letter-tabs-item').removeClass('active');
        $(this).addClass('active');

        if ($(this).hasClass('personal')) {
            $('input[name="type"]').val('CT0002');
            $('.items-ent').hide().find('input').prop('disabled', true);
            $('.items-per').show().find('input').prop('disabled', false);
        } else {
            $('input[name="type"]').val('CT0001');
            $('.items-ent').show().find('input').prop('disabled', false);
            $('.items-per').hide().find('input').prop('disabled', true);
        }
    });

    //提交表单
    $('#letter-form').submit(function(e) {
        e.preventDefault();

        //验证必填
        if ($('input[name="type"]').val() == 'CT0001') {
            if ($('input[name="corporate"]').val().isEmpty()) {
                Tools.showAlert('企业名称必填');
                return;
            }
            if ($('input[name="represents"]').val().isEmpty()) {
                Tools.showAlert('法人代表必填');
                return;
            }
        } else {
            if ($('input[name="name"]').val().isEmpty()) {
                Tools.showAlert('收函人姓名必填');
                return;
            }
        }

        if ($('input[name="phone"]').val().isEmpty()) {
            Tools.showAlert('收函人电话必填');
            return;
        }
        if ($('select[name="town"]').val() && $('select[name="town"]').val() == null && $('select[name="town"]').val().isEmpty()) {
            Tools.showAlert('收函人地区必填');
            return;
        }
        if ($('input[name="streets"]').val().isEmpty()) {
            Tools.showAlert('具体收函地址必填');
            return;
        }
        if ($('input[name="postcode"]').val().isEmpty()) {
            Tools.showAlert('邮政编码必填');
            return;
        }
        if ($('textarea[name="problem"]').val().isEmpty()) {
            Tools.showAlert('情况说明必填');
            return;
        }
        if ($('textarea[name="problem"]').val().length < 5) {
            Tools.showAlert('情况说明至少5个字符');
            return;
        }
        if (tempFiles.length <= 0) {
            Tools.showAlert('至少上传一个证据材料');
            return;
        }
        if ($('textarea[name="expectation"]').val().isEmpty()) {
            Tools.showAlert('您的需求必填');
            return;
        }
        if ($('textarea[name="expectation"]').val().length < 5) {
            Tools.showAlert('您的需求至少5个字符');
            return;
        }

        //转换数据
        var formData = Tools.formJson($(this));
        formData.evidences = tempFiles;
        formData.address = {
            province: {
                cityId: $('select[name="province"]').val(),
                id: $('select[name="province"]').val(),
                name: $('select[name="province"] option:selected').text()
            },
            city: {
                cityId: $('select[name="city"]').val(),
                id: $('select[name="city"]').val(),
                name: $('select[name="city"] option:selected').text()
            },
            town: {
                cityId: $('select[name="town"]').val(),
                id: $('select[name="town"]').val(),
                name: $('select[name="town"] option:selected').text()
            },
            streets: $('input[name="streets"]').val(),
            postcode: $('input[name="postcode"]').val()
        };
        if('postcode' in formData){
            delete(formData['postcode']);
        }
        if('streets' in formData){
            delete(formData['streets']);
        }
        if('province' in formData){
            delete(formData['province']);
        }
        if('city' in formData){
            delete(formData['city']);
        }
        if('town' in formData){
            delete(formData['town']);
        }
       log(formData.address)
        var d = {
            data: formData,
            uid: Storage.get(Storage.AUTH)
        }

        if(id){
            d.filter = {
                id: id
            };
            Ajax.submit({
                url: config.api_letter_update,
                data: JSON.stringify(d),
                type: 'PUT',
                processData: false,
                contentType: 'application/json',
                showLoading: true
            }, function(data) {
                if (data.error) {
                    Tools.showAlert(data.error.message);
                    return;
                }
                history.go(-1);
            })         
        }else{
            Ajax.submit({
                url: config.api_letter_add,
                data: JSON.stringify(d),
                contentType: 'application/json',
                showLoading: true
            }, function(data) {
                if (data.error) {
                    Tools.showAlert(data.error.message);
                    return;
                }
                history.go(-1);
            })            
        }
    });

    config.api_place = config.server + '/place/list.json';

    getRegionData($('#province')[0]);
    $('#province').change(function(){
        changeSel($('#province'), $('#city'), false);
        $('#area').val('');
        $('#area_dummy').val('所在区/县');
    });
    $('#city').change(function(){
        changeSel($('#city'), $('#area'), false);
    });

    $('#province').mobiscroll().select({
        theme: "android-holo-light",  
        mode: "scroller",  
        display: "bottom", 
        lang: "zh" 
    });
    $('#city').mobiscroll().select({
        theme: "android-holo-light",  
        mode: "scroller",  
        display: "bottom", 
        lang: "zh" 
    });

    $('#area').mobiscroll().select({
        theme: "android-holo-light",  
        mode: "scroller",  
        display: "bottom", 
        lang: "zh" 
    });
    // 级联change事件
    function changeSel(el,nextEl,update,nextNextEl,cityVal,areaVal){
        if(update){
            getRegionData(nextEl[0], el.val(), cityVal, getRegionData(nextNextEl[0], cityVal, areaVal));                  
        }else{
            getRegionData(nextEl[0], el.val(), null, function(){
                // alert(el.selector);
                if(el.selector == '#province'){
                    // log($('#city > option').eq(0).text())
                    $('#city_dummy').val($('#city > option').eq(0).text());
                    changeSel($('#city'), $('#area'), false);
                }
                if(el.selector == '#city'){
                    $('#area_dummy').val($('#area > option').eq(0).text());
                }        
            })
        }
    }
    //根据父级获取下级区域数据
    function getRegionData(sel, parent, def, callback, fn) {
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

            // console.log(sel)
            // alert(parent)

            typeof callback == 'function' &&  setTimeout(callback(),300)
        })
    }


    // 如果存在id编辑
    if (id) {
        Ajax.custom({
            url: config.api_letter_detail,
            data: {
                id: id
            }
        },function(data){
            var d=data.data;
            // d.status
            var status = {
                'LS0001': 1,
                'LS0002': 2,
                'LS0003': 3,
                'LS0004': 4// ,
                // 'LS0005': '邮寄凭证'
            }
            $('.letter-gress-item').each(function(i){
                i < status[d.status] && $(this).addClass('active');
            });
            $('.letter-gress-line .active').width((status[d.status]-1)*100/4 + '%');

            // d.type
            var tabs = {
                'CT0001': 'enterprise',
                'CT0002': 'personal',
            }
            $('.letter-tabs-item').each(function(){
                $(this).hasClass(tabs[d.type]) && $(this).addClass('active').siblings().removeClass('active');
            })
            $('input[name="type"]').val(d.type);
            if (d.type == 'CT0001') {
                // $('.items-ent').hide().find('input').prop('disabled', true);
                // $('.items-per').show().find('input').prop('disabled', false);
                $('input[name="corporate"]').val(d.corporate);
                $('input[name="represents"]').val(d.represents);
            } 
            if (d.type == 'CT0002') {
                $('.items-ent').show().find('input').prop('disabled', false);
                $('.items-per').hide().find('input').prop('disabled', true);
                $('input[name="name"]').val(d.name);
            }
            // 地址下拉框
            var address = d.address;
            $('#province').val(address.province.id);
            changeSel($('#province'), $('#city'), true, $('#area'), address.city.id, address.town.id)
            $('#province_dummy').val(address.province.name);
            $('#city_dummy').val(address.city.name);
            $('#area_dummy').val(address.town.name);
            $('input[name="streets"]').val(address.streets);
            $('input[name="postcode"]').val(address.postcode);

            // 证据材料文件
            tempFiles = d.evidences;

            $.each(tempFiles,function(i){
                $('#flv-imgs').find('.col').eq(i).addClass('active')
                    .find('input[type="text"]').attr("data-id",tempFiles[i].fileId).val(tempFiles[i].fileName);
                //上传图片成功后，添加下个文件控件
                if ($('#flv-imgs').find('.col').next().length == 0) {
                    $('#flv-imgs').append($('#flv-imgs-tmpl').html());
                }
            })

            $('input[name="phone"]').val(d.phone);
            $('textarea[name="problem"]').val(d.problem);
            $('textarea[name="expectation"]').val(d.expectation);
            $('#letter-form').append('<input type="hidden" name="_id" value="'+ d._id +'" />')
        });
    }
})()
