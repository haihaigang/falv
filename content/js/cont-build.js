(function() {

    var id = Tools.getQueryValue('id');

    // 修改选项返回
    var result = Tools.getQueryValue('result'),
        myData;
    //修改选项
    funMobiscroll('#doctype');
    funMobiscroll('#catalog');
    funMobiscroll('#target');
    funMobiscroll('#role');

    function funMobiscroll(el) {
        $(el).mobiscroll().select({
            theme: "android-holo-light",
            mode: "scroller",
            display: "bottom",
            lang: "zh"
        });
        if (el == "#doctype") {
            $("#doctype_dummy").bind("touchstart", function() {
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
        myData = data.data.items;
        var result = getOptionData();
        Ajax.render('#doctype', 'common-options-tmpl', result);
        if (result) {
            if (Storage.get('SEARCH_RESULT')) {

                var result = Storage.get('SEARCH_RESULT'),
                    ancestor = result.ancestor;
                if (ancestor.length > 0) {
                    $.each(ancestor, function(i) {
                        levelSelect(ancestor[i])
                    });
                }
                levelSelect(result)
            }
        } else {
            if (Storage.get('SEARCH_RESULT')) {
                Storage.remove('SEARCH_RESULT')
            }
        }
    });

    function levelSelect(obj) {
        var categoryId = obj.categoryId,
            value = obj.name;

        switch (obj.level) {
            case "1":
                // log(categoryId +" ***"+$("#doctype"))
                $("#doctype").val(categoryId);
                $("#doctype_dummy").val(value);
                var that = $("#doctype"),
                    _this = that.find("option:selected");
                $('input[name="type1"]').val(categoryId);
                var result = getOptionData(categoryId);
                Ajax.render('#catalog', 'common-options-tmpl', result);
                if (_this.attr('data-len') != '0') {
                    $("#catItems").show();
                }
                break;
            case "2":
                $("#catalog").val(categoryId);
                $("#catalog_dummy").val(value);
                var that = $("#catalog"),
                    _this = that.find("option:selected");
                var result = getOptionData(categoryId);
                $('input[name="type"]').val(categoryId);
                $('input[name="name"]').val(_this.text());
                $('input[name="type2"]').val(_this.attr('data-type'));

                if (_this.attr('data-len') != '0') {
                    //需要确认是显示细分还是角色，根据value＝4确认是角色
                    if (_this.attr('data-v') == '4') {
                        $("#rolItems").show();
                        Ajax.render('#role', 'common-options-tmpl', result);
                    } else {
                        $("#tarItems").show();
                        Ajax.render('#target', 'common-options-tmpl', result);
                    }
                }

                break;
            case "3":
                $("#target").val(categoryId);
                $("#target_dummy").val(value);
                var that = $("#target"),
                    _this = that.find("option:selected");
                var result = getOptionData(categoryId);

                if (_this.attr('data-len') != '0') {
                    $("#roleItems").show();
                    Ajax.render('#role', 'common-options-tmpl', result);
                }
                break;
            case "4":
                $("#role").val(obj.categoryId);
                $("#role_dummy").val(value);
                break;

        }
    }


    $("#doctype").on("change", function() {
        afterChange(1);

        var that = $(this),
            _this = that.find("option:selected");
        var result = getOptionData(that.val());
        $('input[name="type1"]').val(that.val());
        template.helper("docCatagoryId", that.val());

        //这里要获取当前选择项的子项，模版渲染可以用通用的
        //你那个没有值的问题是，因为你上一个option的value写错了，多个等号
        //Ajax.render('#catalog','catalog-options-tmpl', myData);
        Ajax.render('#catalog', 'common-options-tmpl', result);
        if (_this.attr('data-len') != '0') {
            $("#catItems").show();
        }
    })

    $("#catalog").on("change", function() {
        afterChange(2);

        var that = $(this),
            _this = that.find("option:selected");
        var result = getOptionData(that.val());
        $('input[name="type"]').val(that.val());
        $('input[name="name"]').val(_this.text());
        $('input[name="type2"]').val(_this.attr('data-type'));

        if (_this.attr('data-len') != '0') {
            //需要确认是显示细分还是角色，根据value＝4确认是角色
            if (_this.attr('data-v') == '4') {
                $("#rolItems").show();
                Ajax.render('#role', 'common-options-tmpl', result);
            } else {
                $("#tarItems").show();
                Ajax.render('#target', 'common-options-tmpl', result);
            }
        }
    })

    $("#target").on("change", function() {
        afterChange(3);

        var that = $(this),
            _this = that.find("option:selected");
        var result = getOptionData(that.val());

        if (_this.attr('data-len') != '0') {
            $("#roleItems").show();
            Ajax.render('#role', 'common-options-tmpl', result);
        }
    })


    $("#role").on("change", function() {
        var that = $(this),
            _this = that.find("option:selected");

        var result = getOptionData(that.val());

        // Ajax.render('#role','common-options-tmpl', result);
    })


    //提交合同
    $('#audit-form').submit(function(e) {
        e.preventDefault();

        var comment = $('input[name="comment"]').val() || " ";
        var role = $('input[name="role"]').val() || " ";
        var doctype = $('input[name="doctype"]').val();
        var catalog = $('input[name="catalog"]').val();

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

    //测试用
    config.findById = function(id) {
        for (var i = myData.length - 1; i >= 0; i--) {
            if (myData[i].categoryId = id)
                return myData[i];
        };
    }

    //获取option的数据，每次都试探获取子项（用于判断是否显示下级）
    function getOptionData(id) {
        id = id || null; //不传id是获取顶级分类，顶级分类约定为null

        var result = [];
        for (var i in myData) {
            if (myData[i].parent == id) {
                result.push(myData[i]);
            }
        }
        for (var j in result) {
            result[j].child = [];
            for (var i in myData) {
                if (result[j].categoryId == myData[i].parent) {
                    result[j].child.push(myData[i]);
                    result[j].childValue = myData[i].value; //把子项的value提出到父项，以便识别
                }
            }
        }
        log(result);

        return result;
    }

    //每次输入框改变之后，从当前开始下面的下拉框都要隐藏、重置
    //TODO 重置选择的值
    function afterChange(lv) {
        if (lv <= 3) {
            $('#roleItems').hide();
            // $('#role').val('0');
        }
        if (lv <= 2) {
            $('#tarItems').hide();
        }
        if (lv <= 1) {
            $('#catItems').hide();
        }
    }

})();
