(function() {

    //获取登录的id
    config.getId = function() {
        var auth = Cookie.get(Storage.AUTH);
        //      if(!auth){
        //          //auth = Storage.get(Storage.AUTH);
        //          if(auth){
        //              //Cookie.set(Storage.AUTH, auth);
        //          }
        //      }
        return auth;
    };

    //获取微信号
    config.getOpenId = function() {
        return Cookie.get(Storage.OPENID);
    };

    //重定向登录
    config.redirectLogin = function(from) {
        from = encodeURIComponent(from);
        location.href = '../login?from=' + from;
    };

    template.openTag = "<!--[";
    template.closeTag = "]-->";

    // 模板帮助方法，绝对化图片地址
    template.helper('$absImg', function(content) {
        if (!content) {
            return config.image + 'content/images/blank.png';
        }
        if (content && content.indexOf('http://') == 0) {
            return content;
        }
        return config.api_file_img + content;
        //return config.image + content;
    });

    // 模板帮助方法，转换时间戳成字符串
    template.helper('$formatDate', function(content, type, defaultValue) {
        if (content) {
            return Tools.formatDate(content, type);
        } else {
            return defaultValue || '--';
        }
    });

    // 模板帮助方法，验证是否已登录
    template.helper('$isLogin', function() {
        return !!config.getId();
    });

    // 模板帮助方法，转换房源你的标签
    template.helper('$convertTag', function(content) {
        if (content) {
            var result = '';
            var arr = content.split(',');
            for (var i in arr) {
                if (/^\s*$/.test(arr[i])) {
                    continue;
                }
                result += '<span>' + arr[i] + '</span>';
            }
            return result;
        } else {
            return '--';
        }
    });

    //模板帮助方法，编码url参数
    template.helper('$encodeUrl', function(content) {
        return encodeURIComponent(content);
    });

    //模板帮助方法，格式化货币
    template.helper('$formatCurrency', function(content, defaultValue, unit) {
        if (!content) {
            return defaultValue || '--';
        }

        var mod = content.toString().length % 3;
        var sup = '';
        if (mod == 1) {
            sup = '00';
        } else if (mod == 2) {
            sup = '0';
        }

        content = sup + content;
        content = content.replace(/(\d{3})/g, '$1,');
        content = content.substring(0, content.length - 1);
        if (sup.length > 0) {
            content = content.replace(sup, '');
        }

        return content + unit || '';
    });

    //模板帮助方法，\r\n替换换行
    template.helper('$convertRN', function(content) {
        if (!content) {
            return '--';
        }
        return content.replace(/\r\n/gi, '<br/>');
    });

    //模板帮助方法，根据序列值添加样式名
    template.helper('$addClassByIdx', function(i, v, className) {
        if (i == v) {
            return className || '';
        }
    });

    //模板帮助方法， 从时间字符串中截取日期，限定字符串yyyy-MM-dd...
    template.helper('$getDateFromStr', function(content) {
        if (!content || content.length == 0) {
            return;
        }

        var len = content.length > 10 ? 10 : content.length;
        return content.substring(0, len);
    });

    //模板帮助方法， 获取时长
    template.helper('$getDuration', function(start, end) {
        if (!start || !end) {
            return '--';
        }

        return Math.round((end - start) / 60000);

    });

    //模板帮助方法， 获取预览图片的地址
    template.helper('$getImg', function(content) {
        if (!content) {
            return '--';
        }

        return config.api_file_img + content;

    });

    // 返回按钮
    $('.icon_return').click(function(e) {
        e.preventDefault();

        if ($(this).attr('data-flag') == 'true') {
            return;
        }

        //特殊跳转
        var special = Tools.getQueryValue('special');
        if (special) {
            location.href = special;
        } else {
            history.go(-1);
        }
    });

    //返回顶部
    $('#wu-back').click(function(e) {
        e.preventDefault();

        window.scrollTo(0, -1);
    });

    //底部关注十爷帮
    $('#wu-focus').click(function(e) {
        $(this).attr("href", config.concernUrl);
    });

    //会员中心按钮，未登录则跳转登陆
    $('.icon_user').on('click', function(e) {
        e.preventDefault();

        var prefix = $(this).attr('href') == '#login' ? '../' : '';

        if (!config.getId()) {
            location.href = prefix + 'login';
        } else {
            location.href = prefix + 'hui/index';
        }
    });

    // 下一页按钮
    $('body').on('click', '.nextpage', function(e) {
        e.preventDefault();

        if (Ajax.isLoading || $(this).hasClass('disabled')) {
            // 正在加载，不可点击
            return;
        }

        if (typeof config.paging == 'function') {
            config.paging();
        }
    });

    var flvSession; //讯飞语音session
    /**
     * 开始录音
     */
    $('.mic').click(function(e) {
        $('#ti-mic').show();
        if (!('Session' in window)) {
            return;
        }

        flvSession = flvSession || new Session({
            'url': 'http://webapi.openspeech.cn/ivp}',
            'interval': '30000',
            'disconnect_hint': 'disconnect',
            'sub': 'tts',
            'compress': 'speex',
            'speex_path': '../xfei/speex.js',
            'vad_path': '../xfei/vad.js',
            'recorder_path': '../xfei/recorderWorker.js'
        });

        var that = $(this);
        var appid = 55439210;
        var timestamp = (new Date()).toLocaleTimeString();
        var expires = 10000;
        var secret_key = '51d90b468aebf969';
        var signature = faultylabs.MD5(appid + '&' + timestamp + '&' + expires + '&' + secret_key);
        var params = {
            "grammar_list": null,
            "params": "aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, caller.appid = " + appid + ",timestamp = " + timestamp + ",expires = " + expires,
            "signature": signature
        };

        flvSession.start('iat', params, function(volume) {
            if (volume < 6 && volume > 0)
                log("volume : " + volume);

            if (volume < 0)
                log("请调整你的音量");
        }, function(err, result) {
            $('#ti-mic').hide();
            if (err == null || err == undefined || err == 0) {
                if (result == '' || result == null) {
                    Tools.showToast("错误");
                } else {
                    log(result);
                    that.parent().find('input').val(result);
                }
            } else {
                Tools.showToast('error code : ' + err + ", error description : " + result);
            }
        });
    });

    //停止录音
    $('.mic-close').click(function(e) {
        e.preventDefault();

        $('#ti-mic').hide();

        flvSession && flvSession.stop(null);
    });

    //若是用于分享，隐藏头部
    var forshare = Tools.getQueryValue('forshare');
    if (forshare) {
        $('header').hide();
        $('footer').hide();
    }

    //获取文件
    config.getFile = function(id) {
        Ajax.custom({
            url: config.api_file_download,
            data: {
                fileId: id
            }
        }, function(data) {

        })
    }

    config.getImg = function(id) {
        Ajax.custom({
            url: config.api_file_img + id
        }, function(data) {

        })
    }

    //介绍页面的购买，提示下载app去
    $('.icon-buy').click(function(e) {
        e.preventDefault();

        var url_android = 'https://www.ilaw66.com/file/download.json?fileId=5566c49b98258e253f75107d',
            url_ios = 'https://itunes.apple.com/us/app/fa-lu/id945218505?l=zh&ls=1&mt=8';

        Tools.showConfirm('了解更多详情，请下载APP', function() {
            if (Tools.isIos()) {
                window.open(url_ios, '');
            }
            if (Tools.isAndroid) {
                window.open(url_android, '');
            }
        });
    })

    //初始化滚动
    config.initScroll = function(opt, mode) {
        var nav = $('.subscript');
        var len = $('.scroller').children().length;
        if (len == 0) {
            return;
        }
        // 有两种导航模式
        if (opt && opt.mode == 'mode2') {
            nav.html('<span>1</span>/' + len);
        } else {
            var res = '';
            for (var i = 0; i < len; i++) {
                if (i == 0) {
                    res += '<span class="active"></span>';
                } else {
                    res += '<span></span>';
                }
            }
            nav.html(res);
        }
        config.previewScroll = new jScroll($('.slider')[0], {
            onBeforeScrollStart: function() {
                if (config.scrollInte) {
                    clearInterval(config.scrollInte);
                    config.scrollInte = undefined;
                }
            },
            onScrollEnd: function() {
                var cur = $('#img-' + this.currPageX);
                cur.attr('src', cur.attr('data-src'));
                if (mode && mode == 'mode2') {
                    nav.find('span').text(this.currPageX + 1);
                } else {
                    nav.find('span').removeClass('active');
                    nav.find('span').eq(this.currPageX).addClass('active');
                    $(nav.find('span')[this.currPageX]).addClass('active');
                }

                if (opt && opt.auto && !config.scrollInte) {
                    config.scrollInte = setInterval(function() {
                        config.previewScroll.currPageX++;
                        if (config.previewScroll.currPageX >= config.previewScroll.pagesX) {
                            config.previewScroll.currPageX = 0;
                        }
                        var w = config.previewScroll.warpperW;
                        var i = config.previewScroll.currPageX;
                        config.previewScroll.scrollTo(-w * i, 0, 200);
                    }, 3000);
                }
            }
        });

        if (opt && opt.auto) {
            config.scrollInte = setInterval(function() {
                config.previewScroll.currPageX++;
                if (config.previewScroll.currPageX >= config.previewScroll.pagesX) {
                    config.previewScroll.currPageX = 0;
                }
                var w = config.previewScroll.warpperW;
                var i = config.previewScroll.currPageX;
                config.previewScroll.scrollTo(-w * i, 0, 200);
            }, 8000);
        }

        $('#img-0').attr('src', $('#img-0').attr('data-src'));
    };
})();


(function($, undefined) {
    var props = {
            "animation": {},
            "transition": {}
        },
        testElement = document.createElement("a"),
        vendorPrefixes = ["", "webkit-", "moz-", "o-"];

    $.each(["animation", "transition"], function(i, test) {

        // Get correct name for test
        var testName = (i === 0) ? test + "-" + "name" : test;

        $.each(vendorPrefixes, function(j, prefix) {
            if (testElement.style[$.camelCase(prefix + testName)] !== undefined) {
                props[test]["prefix"] = prefix;
                return false;
            }
        });

        // Set event and duration names for later use
        props[test]["duration"] =
            $.camelCase(props[test]["prefix"] + test + "-" + "duration");
        props[test]["event"] =
            $.camelCase(props[test]["prefix"] + test + "-" + "end");

        // All lower case if not a vendor prop
        if (props[test]["prefix"] === "") {
            props[test]["event"] = props[test]["event"].toLowerCase();
        }
    });

    // If a valid prefix was found then the it is supported by the browser
    $.support.cssTransitions = (props["transition"]["prefix"] !== undefined);
    $.support.cssAnimations = (props["animation"]["prefix"] !== undefined);

    // Remove the testElement
    $(testElement).remove();

    // Animation complete callback
    $.fn.animationComplete = function(callback, type, fallbackTime) {
        var timer, duration,
            that = this,
            eventBinding = function() {

                // Clear the timer so we don't call callback twice
                clearTimeout(timer);
                callback.apply(this, arguments);
            },
            animationType = (!type || type === "animation") ? "animation" : "transition";

        // Make sure selected type is supported by browser
        if (($.support.cssTransitions && animationType === "transition") ||
            ($.support.cssAnimations && animationType === "animation")) {
            // If a fallback time was not passed set one
            if (fallbackTime === undefined) {

                // Make sure the was not bound to document before checking .css
                if ($(this).context !== document) {

                    // Parse the durration since its in second multiple by 1000 for milliseconds
                    // Multiply by 3 to make sure we give the animation plenty of time.
                    duration = parseFloat(
                        $(this).css(props[animationType].duration)
                    ) * 3000;
                }

                // If we could not read a duration use the default
                if (duration === 0 || duration === undefined || isNaN(duration)) {
                    duration = $.fn.animationComplete.defaultDuration;
                }
            }

            // Sets up the fallback if event never comes
            timer = setTimeout(function() {
                $(that).off(props[animationType].event, eventBinding);
                callback.apply(that);
            }, duration);

            // Bind the event
            return $(this).one(props[animationType].event, eventBinding);
        } else {

            // CSS animation / transitions not supported
            // Defer execution for consistency between webkit/non webkit
            setTimeout($.proxy(callback, this), 0);
            return $(this);
        }
    };

    // Allow default callback to be configured on mobileInit
    $.fn.animationComplete.defaultDuration = 1000;
})(jQuery);

//自定义弹出页
(function(window) {
    var SecondPage = function(pageName) {
        var that = this;
        that.targetPage = $(pageName);

        $(pageName + ' .icon_return').click(function(e) {
            e.preventDefault();
            that.closeSidebar();
        })
    }

    SecondPage.prototype = {
        targetPage: undefined,
        openSidebar: function(fn) {
            var container = $(window);
            var w = container.width(),
                h = container.height();
            this.targetPage.css({
                'width': w,
                'height': h
            });

            this.targetPage.addClass('open');
            fn && fn();
        },

        closeSidebar: function(fn) {
            this.targetPage.removeClass('open');
            setTimeout(function() {
                $('#xg-panel-bg').hide();
                hasOpend = false;
                fn && fn();
                //provincePage.hide()
            }, 220);
        }
    }

    window.SecondPage = SecondPage;
})(window);

//文件上传，监听所有form中的file，
//要求file有＃flv-imgs的父元素
//且页面中有＃flv-imgs-tmpl的模版
(function() {

    var tempFiles = []; //存储临时文件数组

    //文件上传
    $('form').on('change', 'input[type="file"]', function() {
        if (this.files.length == 0) {
            return;
        }

        var that = $(this),
            formData = new FormData();
        formData.append('file', this.files[0]);

        Ajax.submit({
            url: config.api_file_upload,
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            showLoading: true
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            data = data.data[0];
            var d = {
                fileId: data.fileId,
                fileName: data.name
            };
            tempFiles.push(d);

            that.parents('.col').addClass('active').find('input[type="text"]').attr("data-id", data._id).val(data.name);
            //上传图片成功后，添加下个文件控件
            if (that.parents('.col').next().length == 0) {
                $('#flv-imgs').append($('#flv-imgs-tmpl').html());
            }
        });
    });

    // 预览
    $('form').on('click', '.file', function() {
        var par = $(this).parent(),
            id = par.find('input[type="text"]').attr("data-id");
        if (par.hasClass('active')) {
            window.open(config.api_file_img + id);
        }
    });

    //移除文件控件
    $('form').on('click', '.close', function() {
        if ($('form .col').length <= 1) {
            return;
        }
        if (!$(this).parents('.col').hasClass('active')) {
            return;
        }
        $(this).parents('.col').remove();
    });

    //为了兼容页面已有逻辑，这里抛出全局变量
    window.tempFiles = tempFiles;
})();
