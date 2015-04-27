(function() {

    var id = Tools.getQueryValue('id');

    // 修改选项返回
    var type= Tools.getQueryValue('type');
    var choose= Tools.getQueryValue('choose');
    
    if(type){
        $('#'+type).find("input").val(choose).next().text(choose);
        if(type=="doctype" && choose=="其他"){
            $("#comment-box").css("display","block")
        }
    }

    //修改选项
    $('#docType').on('click', function() {
        window.location.href="cont-select-list.html?type=doctype"
    });
    $('#catalog').on('click', function() {
        window.location.href="cont-select-list.html?type=catalog"
    });
    $('#role').on('click', function() {
        window.location.href="cont-select-list.html?type=role"
    });

    //提交合同
    $('#audit-form').submit(function(e) {
        e.preventDefault();

        var comment = $('textarea[name="comment"]').val()||" ";
        var role=$('input[name="role"]').val();
        var doctype=$('input[name="doctype"]').val();
        var catalog=$('input[name="catalog"]').val();

        if (doctype=="其他" && comment.isEmpty()) {
            Tools.showAlert('请填写您的需求');
            return;
        }

        var d = {
		    comment: comment,
		    // name:       模板文件名
		    role: role,
		    // status:     状态
		    // target:     合同细分
		    type: doctype,
		    // type1:      文书种类
		    type2: catalog,
		    uid: Storage.get(Storage.AUTH)
		}

        Ajax.submit({
            url: config.api_cont_add,
            data: d,
            processData: false
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

        });
    });

    //若存在id则编辑
    if (id) {
        Ajax.detail({
            url: config.api_cont_detail,
            data: {
                id: id
            }
        }, function(data) {

        })
    }
})();
