(function() {

    var id = Tools.getQueryValue('id');

    // 修改选项返回
    var result = Tools.getQueryValue('result'),
        myData, //所有分类的数据
        hasRole = false, //是否显示角色选项
        hasTarget = false, //是否显示细则选项
        qp = new SecondPage('#question-page'),
        pp = new SecondPage('#preview-page'),
        ep = new SecondPage('#end-page'),
        sp = new SecondPage('#search-page'),
        slp = new SecondPage('#search-list-page'),
        curPage = 1, //回答问题当前页码
        pageNum = 1, //回答问题总页数
        tempData = undefined, //合同数据
        tempQuestions = undefined, //问题数据
        tempParam = undefined, //请求回答问题接口的参数
        tempCont = undefined; //编辑合同数据

    //初始化下拉框，编辑时不可修改
    funMobiscroll('#doctype');
    funMobiscroll('#catalog');
    funMobiscroll('#target');
    funMobiscroll('#role');

    function funMobiscroll(el) {
        $(el).mobiscroll().select({
            theme: "android-holo-light",
            mode: "scroller",
            display: "bottom",
            lang: "zh",
            disabled: id //编辑时不可修改
        });
        if (el == "#doctype") {
            $("#doctype_dummy").bind("touchstart", function() {
                $("#doctype").find("option[value='0']").remove();
                $("#catItems").show();
                $(this).val($("#doctype").find("option:selected").text());
            })
        }
    }

    //获取分类数据
    Ajax.paging({
        url: config.api_cont_select_list,
        data: {
            type: "知识库文书分类"
        }
    }, function(data) {
        myData = data.data.items;
        var result = getOptionData();
        Ajax.render('#doctype', 'common-options-tmpl', result);
        // if (result) {
        //     if (Storage.get('SEARCH_RESULT')) {

        //         var result = Storage.get('SEARCH_RESULT'),
        //             ancestor = result.ancestor;
        //         if (ancestor.length > 0) {
        //             $.each(ancestor, function(i) {
        //                 levelSelect(ancestor[i])
        //             });
        //         }
        //         levelSelect(result)
        //     }
        // } else {
        //     if (Storage.get('SEARCH_RESULT')) {
        //         Storage.remove('SEARCH_RESULT')
        //     }
        // }

        hasLoad = true;
        setEditView();
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
                $('input[name="name"]').val(value);
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

                log(value);

                if(value == '其他') $('#otherOther').show()
                
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
                $('input[name="role"]').val(obj.categoryId);
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
        Ajax.render('#catalog', 'common-options-tmpl', result);
        if (parseInt(_this.attr('data-len')) > 0) {
            $("#catItems").show();
        }
        // alert(that.val());
        if(that.val() == 'NW1999'){
            $('#catalog_dummy').val(result[0].name);
            $('input[name="name"]').val(result[0].name);
            $('input[name="type"]').val(result[0].categoryId);

            $('#catalog').find('option[value="0"]').remove();
            $('#otherOther').show();
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

        if (parseInt(_this.attr('data-len')) > 0) {
            //需要确认是显示细分还是角色，根据value＝4确认是角色
            if (_this.attr('data-v') == '4') {
                $("#rolItems").show();
                hasRole = true;
                Ajax.render('#role', 'common-options-tmpl', result);
            } else {
                $("#tarItems").show();
                hasTarget = true;
                Ajax.render('#target', 'common-options-tmpl', result);
            }
        }
    })

    $("#target").on("change", function() {
        afterChange(3);

        var that = $(this),
            _this = that.find("option:selected");
        var result = getOptionData(that.val());
        $('input[name="target"]').val(that.val());

        if (parseInt(_this.attr('data-len')) > 0) {
            $("#rolItems").show();
            hasRole = true;
            Ajax.render('#role', 'common-options-tmpl', result);
        }
    })


    $("#role").on("change", function() {
        var that = $(this),
            _this = that.find("option:selected");

        var result = getOptionData(that.val());

        $('input[name="role"]').val(that.val());

        // Ajax.render('#role','common-options-tmpl', result);
    })

    //开始起草，提交合同，若编辑时直接跳到回答问题页，否则调用contract/add接口，之后在跳转
    $('#cont-form').submit(function(e) {
        e.preventDefault();

        var comment = $('textarea[name="comment"]').val() || "";
        var role = $('input[name="role"]').val() || "";
        var type1 = $('input[name="type1"]').val(); //文书
        var type = $('input[name="type"]').val(); //目录
        var name = $('input[name="name"]').val();
        var target = $('input[name="target"]').val();

        if (type1.isEmpty()) {
            Tools.showAlert("请选择文书类型");
            return;
        }
        if (type.isEmpty()) {
            Tools.showAlert("请选择目录名称");
            return;
        }
        if (hasTarget) {
            if (target.isEmpty()) {
                Tools.showAlert("请选择合同细分");
                return;
            }
            if (hasRole && role.isEmpty()) {
                Tools.showAlert("请选择合同角色");
                return;
            }
        } else if (hasRole && role.isEmpty()) {
            Tools.showAlert("请选择合同角色");
            return;
        }
        if(type1 == 'NW1999' && (comment.isEmpty() || comment.legnth < 5)){
            Tools.showAlert("请输入您的需求，长度5-500字符");
            return;
        }

        var d = {
                name: name + '.docx', //模板文件名
                role: role,
                status: '1', //状态
                target: target, //合同细分
                type: type,
                type1: type1, //文书种类
                type2: type,
                comment: comment,
                uid: Storage.get(Storage.AUTH)
            },
            hasNoTemp = 'NW2999' == type;

        d = JSON.stringify({
            data: d
        });

        if (id && tempData) {
            //若是编辑且已获取了数据
            getQuestions(d,function(){
                qp.openSidebar();
                initNav();
            });
            return;
        }

        //提交之前先验证文件模版是否存在，存在则继续
        getQuestions(d,function(){
            Tools.showConfirm('您确定消费1份智能合同服务？', function() {
                Ajax.submit({
                    url: config.api_cont_add,
                    data: d,
                    processData: false,
                    contentType: 'application/json',
                    showLoading: true
                }, function(data) {
                    if (data.error) {
                        Tools.showAlert(data.error.message);
                        return;
                    }

                    //若是选择了其他类别，提交后直接完成，到列表页
                    if(type1 == 'NW1999'){
                        history.go(-1);
                        return;
                    }

                    tempData = data.data;
                    qp.openSidebar();

                    initNav();
                });
            })
        });
    });

    //若存在id则获取数据
    if (id) {
        Ajax.detail({
            url: config.api_cont_detail,
            data: {
                id: id
            }
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            tempData = data.data;
            setEditView();
        });

        $('.icon-build').hide(); //隐藏搜索按钮
    }

    var hasLoad = false;
    //编辑时赋值，考虑有依赖数据这里判断两处请求数据都成功之后在赋值
    function setEditView() {
        if (!id) return;
        if (!tempData || !hasLoad) return;
        hasLoad = true;

        $('#doctype').val(tempData.type1).trigger('change');
        $('#doctype_dummy').val(getNameByType(tempData.type1));

        setTimeout(function() {
            $('#catalog').val(tempData.type).trigger('change');
            $('#catalog_dummy').val(getNameByType(tempData.type));
        }, 10)
        setTimeout(function() {
            if (tempData.target && tempData.target != '-') {
                $('#target').val(tempData.target).trigger('change');
                $('#target_dummy').val(getNameByType(tempData.target));
            }
        }, 50)
        setTimeout(function() {
                if (tempData.role) {
                    $('#role').val(tempData.role).trigger('change');
                    $('#role_dummy').val(getNameByType(tempData.role));
                }
            }, 100)
            // $('#doctype').mobiscroll('setVal',tempData.type1);

        //若是其他类别，则不可再提交
        if(tempData.type1 == 'NW1999'){
            $('textarea[name="comment"]').val(tempData.comment);
            $('input[type="submit"]').attr('disabled',true).hide();
            return;
        }
    }

    //获取回答的问题列表，每次新添加合同时以及修改的时候获取，点击开始起草触发
    function getQuestions(param,callbak,callbakError) {
        Ajax.submit({
            url: config.api_cont_find_legal,
            data: param,
            processData: false,
            contentType: 'application/json'
        }, function(data) {
            if (data.error) {
                Tools.showAlert('没有相关文件模板' || data.error.message);
                return;
            }

            if (!data.data || !data.data.questions) {
                Tools.showAlert('没有相关文件模板');
                return;
            }

            tempQuestions = data.data;

            callbak && callbak();
        });
    }

    //获取分类数据的名称
    function getNameByType(type) {
        for (var i in myData) {
            if (myData[i].categoryId == type) {
                return myData[i].name;
            }
        }
        return '';
    }

    //测试用
    config.findById = function(id) {
        $('#doctype').mobiscroll('setVal', 'NW1001');
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
            $('#rolItems').hide().find('input[type="hidden"]').val('');
            $('#role_dummy').val('请选择');
            // $('#role').val('0');
        }
        if (lv <= 2) {
            $('#tarItems').hide().find('input[type="hidden"]').val('');
            $('#target_dummy').val('请选择');

            $('#rolItems').hide().find('input[type="hidden"]').val('');
            $('#role_dummy').val('请选择');
        }
        if (lv <= 1) {
            // log("408:"+ $('#catItems'))
            $('#catItems').hide().find('input[type="hidden"]').val('');
            $('#catalog_dummy').val('请选择');
            
            $('#tarItems').hide().find('input[type="hidden"]').val('');
            $('#target_dummy').val('请选择');

            $('#rolItems').hide().find('input[type="hidden"]').val('');
            $('#role_dummy').val('请选择');

            $('#otherOther').hide().find('textarea').val('');
        }
    }

    //////回答问题

    //初始化回答问题导航
    function initNav() {
        var d = [],
            temp = tempQuestions.questions,
            start = (curPage - 1) * 3,
            end = start + 3;

        pageNum = ~~(temp.length / 3) + (temp.length % 3 == 0 ? 0 : 1);

        $('.cont-step span').text('第' + curPage + '页/共' + pageNum + '页');
        $('.btn-prev').val(curPage == 1 ? "选择合同" : "下一页");
        $('.btn-next').val(curPage == pageNum ? "预览" : "下一页");

        end = end > temp.length ? temp.length : end;
        for (var i = start; i < end; i++) {
            temp[i].answer = getAnswer(temp[i]);
            d.push(temp[i]);
        }

        Ajax.render('#flv-question-list', 'flv-question-list-tmpl', d);
    }

    //翻页
    $('#question-page').on('click', '.btn-prev', function(e) {
        e.preventDefault();

        if (curPage == 1) {
            qp.closeSidebar();
            return;
        }

        curPage--;
        initNav();
    }).on('click', '.btn-next', function(e) {
        e.preventDefault();

        // if (!check()) {
        //     Tools.showAlert('问题还未填写完成');
        //     return;
        // }

        putAnswer();

        if (curPage == pageNum) {
            //提交
            doUpdate();
            return;
        }

        curPage++;
        initNav();
    })

    //验证每一个问题是否都回答
    function check() {
        var doms = $('#flv-question-list input');
        for (var i = 0; i < doms.length; i++) {
            if ($(doms[i]).val().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    //获取回答问题的答案，先从contract/get返回数据中获取answer，否则初始化空的答案
    function getAnswer(q) {
        tempData.answer = tempData.answer || [];

        for (var i in tempData.answer) {
            if (tempData.answer[i].number == q.number) {
                return tempData.answer[i];
            }
        }
        var a = {
            'number': q.number,
            'type': q.type
        };
        tempData.answer.push(a);
        return a;
    }

    function putAnswer() {
        var doms = $('#flv-question-list input');
        for (var i = 0; i < doms.length; i++) {
            for (var j in tempData.answer) {
                if ($(doms[i]).attr('data-number') == tempData.answer[j].number) {
                    tempData.answer[j].value = $(doms[i]).val();
                }
            }
        }
    }

    //当回答完所有问题之后，点击预览提交数据
    function doUpdate() {
        var d = {
            data: {
                answer: tempData.answer
            },
            filter: {
                id: tempData._id
            }
        };
        d = JSON.stringify(d);

        Ajax.submit({
            url: config.api_cont_update,
            data: d,
            type: 'PUT',
            processData: false,
            contentType: 'application/json',
            showLoading: true,
            cascading: true
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            doPreview();
        });
    }

    //预览，提交数据之后发起，主要获取文件id用于定制完成（generate）
    function doPreview() {
        // HttpUtils.get(AppConfig.URL_ROOT_HTTPS + "/contract/preview?id=" + info._id, new HttpUtils.RequestCallback() {
        Ajax.custom({
            url: config.api_cont_preview,
            data: {
                id: tempData._id
            },
            showLoading: true
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            var files = data.data.files;
            for (var i = 0; i < files.length; i++) {
                if ('application/msword' == files[i].contentType) {
                    tempData.fileId = files[i]._id || '';
                    break;
                }
            }

            pp.openSidebar();

        });
    }

    /*预览********/

    $('#preview-page').on('click', '.btn-alter', function(e) {
        pp.closeSidebar();
    }).on('click', '.btn-sure', function(e) {
        Tools.showConfirm('您确定结束本次合同起草服务吗？', function() {
            gotoFinish();
        });
    })

    //定制完成，确认结束本次服务
    function gotoFinish() {
        var d = {
            id: tempData._id,
            fid: tempData.fileId
        };

        Ajax.submit({
            url: config.api_cont_generate,
            data: d
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            ep.openSidebar(function() {
                getDetailForEnd(tempData._id);
            });
        })
    }

    /*完成页***********/

    //为完成页获取数据
    function getDetailForEnd(id) {
        Ajax.detail({
            url: config.api_cont_detail,
            data: {
                id: id
            }
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            $('.btn-view').attr('href', getFileLink(data.data.attaches, 'template'));
            $('.btn-risk').attr('href', getFileLink(data.data.attaches, 'notice'));
        });

    }

    //获取风险提示和合同原文的链接
    function getFileLink(content, type) {
        if (!content) {
            return 'javascript:;';
        }

        var d = undefined;
        for (var i in content) {
            if (content[i].type == type) {
                d = content[i];
                break;
            }
        }
        if (!d) {
            return 'javascript:;';
        }

        return config.api_file_download + '?fileId=' + d.id;
    };

    /*搜索页*******/

    $('.icon-build').click(function(e) {
        e.preventDefault();

        sp.openSidebar(function() {
            if (Storage.get('SEARCH_History')) {
                var d = Storage.get('SEARCH_History'),
                    str = "";
                for (var i = 0; i < d.length; i++) {
                    str += "<li>" + d[i] + "</li>"
                }
                $("#keywordHistoryList").html(str);
                $("#keywordHistoryList > li").click(function() {
                    $("#search-name").val($(this).text()).focus();
                });
                $("#emptyList").css("display", "block");
            }
        })
    });

    //清空搜索历史
    $("#emptyList").click(function() {
        $("#keywordHistoryList").empty();
        $(this).css("display", "none");
        Storage.remove('SEARCH_History')
    });

    //打开搜索结果页
    $("form.cont-search-form").submit(function(e){
        e.preventDefault();
        $('#open-search').click();
    })
    $('#open-search').click(function(e) {
        e.preventDefault();
        keyword = $('#search-name').val();

        slp.openSidebar(function() {
            getSearchList(keyword);
        })
        setTimeout(function() {
            sp.closeSidebar();
        }, 220)

        if (!Storage.get('SEARCH_History')) {
            d[0] = keyword;
        } else {
            d = Storage.get('SEARCH_History');
            // log(d.length)
            if (!d.length && d[0] != keyword) {
                d[1] = keyword;
            } else {
                var bool = true;
                for (var i = 0; i < d.length; i++) {
                    if (keyword == d[i]) {
                        bool = false;
                        break;
                    }
                }
                if (bool)
                    d[d.length] = keyword;
            }
        }
        Storage.set('SEARCH_History', d);

    })

    /*搜索结果页*********/
    var keyword, //缩缩关键字
        d = [],
        searchData = [], //缩缩结果数据
        selectResult; //搜索结果选择项

    //获取搜索结果
    function getSearchList(keyword) {
        Ajax.paging({
            url: config.api_cont_doctype_keyword,
            data: {
                name: keyword
            },
            renderEle: '#falv-list',
            renderFor: 'falv-list-tmpl',
            showLoading: true
        }, function(data) {
            searchData = data.data;
        });
    }

    //点击搜索结果项
    $("#falv-list").on("click", "li", function() {
        var selectId = $(this).attr("data-id"),
            result = $(this).text();
        for (var i = searchData.length - 1; i >= 0; i--) {
            if (searchData[i].categoryId = selectId) {
                //Storage.remove('SEARCH_RESULT');
                //Storage.set('SEARCH_RESULT', searchData[i]);
                slp.closeSidebar();
                //window.location.href = "cont-build.html?result=" + result;

                var result = searchData[i],
                    ancestor = result.ancestor;
                if (ancestor.length > 0) {
                    $.each(ancestor, function(i) {
                        levelSelect(ancestor[i])
                    });
                }
                levelSelect(result)
            }
        };
    })

    //重新搜索按钮
    $(".search-again-icon").click(function(e) {
        e.preventDefault();
        getSearchList(keyword);
    })

    template.helper("keyword", keyword);

})();
