(function() {

    var id = Tools.getQueryValue('id');

    // 修改选项返回
    var type= Tools.getQueryValue('type'),myData; 

    //修改选项
    funMobiscroll('#doctype');
    funMobiscroll('#catalog');
    funMobiscroll('#target');
    funMobiscroll('#role');

    function funMobiscroll(el){
        $(el).mobiscroll().select({
            theme: "android-holo-light",  
            mode: "scroller",      
            display: "bottom",
            lang: "zh" 
        });
        if(el=="#doctype"){
            $("#doctype_dummy").bind("touchstart",function(){
                $("#doctype").find("option[value='0']").remove();
                $("#catItems").show();
                $(this).val($("#doctype").find("option:selected").text());
            }) 
        }
    }

    Ajax.paging({
        url: config.api_cont_select_list,
        data: {
            type: "知识库文书分类"        
        }
    }, function(data) {
        myData=data.data.items;
        Ajax.render('#doctype','doctype-options-tmpl', myData);
    });

    $("#doctype").on("change",function(){
        var that=$(this);
        $('input[name="type1"]').val(that.val());
        template.helper("docCatagoryId", that.val());
        Ajax.render('#catalog','catalog-options-tmpl', myData);
    })

    $("#catalog").on("change",function(){
        var that=$(this),
            _this=that.find("option:selected");
        $('input[name="type"]').val(that.val());        
        $('input[name="name"]').val(_this.text());
        $('input[name="type2"]').val(_this.attr('data-type'));

        if(_this.attr('data-role')){
            $("#role").show();
            Ajax.render('#role','role-options-tmpl', myData.ancestors);
        }
    })


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