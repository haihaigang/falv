
//封装异步请求
(function() {
    var nodata = '<div class="nodata">暂无数据。</div>';
    var nomoredata = '<div class="nodata">没有更多数组。</div>';

    /**
     * 接口基类
     */
    function Api(options) {
        this.options = options || {};
        //extends(options,this.options);
        this.timeout = 15000; //请求超时时间
        this.cache = true; //是否缓存
        this.defaultListTmpl = 'fly-list-tmpl';
        this.defaultListEle = '#fly-list';
        this.defaultDetailTmpl = 'fly-detail-tmpl';
        this.defaultDetailEle = '#fly-detail';
        this.isLoading = false; //是否正在请求
        this.hasNext = true; //是否有下一页
        this.queue = {}; //请求队列
        this.tempPage = {}; //分页dom
        this.onEnd = function() {}; //当请求都完成
    }

    Api.prototype._init = function() {
        var spinnings = this.spinnings;

        return this;
    }

    /**
     * 分页查询
     *
     * @param options-请求参数
     * *****
     * url 请求URL
     * data 请求数据 {} $(form)
     * type 请求类型 GET POST
     * renderFor 渲染模板
     * renderEle 渲染容器
     * showLoading 是否显示loading提示 true false
     * *****
     * pagingDom 分页容器
     * pagingMode 分页形式 'number'、'next'、'' 默认 number
     * key 分页数据的关键字 默认'body' '-1'时整个返回值为分页数据
     * *****
     * @param callback-请求成功后执行的回调方法
     * @param callbackError-请求失败后执行的回调方法
     */
    Api.prototype.paging = function(options, callback, callbackError) {
        var that = this,
            isFirst = options.data.page == 1, //是否第一次请求
            opt = { //默认配置
                renderFor: this.defaultListTmpl,
                renderEle: this.defaultListEle,
                pagingDom: '.pagination',
                pagingMode: 'number',
                timeKey: 'createAt',
                key: 'body',
                showLoading: true,
                logtype: 'paging'
            };

        for (var i in opt) {
            options[i] = options[i] || opt[i];
        }

        if (options.pagingMode == 'number') {
            $(options.renderEle).html('正在加载中...');
            $(options.pagingDom).hide();
        } else if (options.pagingMode == 'next') {
            var np = findByKey(that.tempPage, options.url);
            var next = $('#np-' + np),
                nextStr = '<div id="np-' + np + '" class="nextpage">正在加载中...</div>';

            if (options.pagingDom) {
                next = $(options.pagingDom);
            }
            if (next.length == 0) {
                $(options.renderEle).after(nextStr);
                next = $('#np-' + np);
            }
            next.html('正在加载中...');

            if (isFirst) {
                //查第一页数据一定清空当前容器
                $(options.renderEle).html('');
            }
        }

        that.ajaxSend(options, function(response, textStatus, jqXHR) {
            var body = response[options.key];

            if (options.key == '-1') {
                //设置key=-1，所有返回值为分页数据
                body = response;
            }

            if (options.pagingMode == 'number') {
                if (!body || body.length == 0) {
                    //数据没有结果显示无数据提示
                    if (isFirst) {
                        $(options.renderEle).html(nodata);
                    }
                } else {
                    that.render(options.renderEle, options.renderFor, body);
                }

                initPagination(response.pageInfo, options.pagingDom);
            } else if (options.pagingMode == 'next') {
                that.hasNext = body.length == options.data.pageSize;
                if (body.length == 0) {
                    //数据没有结果显示无数据提示
                    if (isFirst) {
                        next.hide();
                        $(options.renderEle).html(nodata);
                    }
                } else {
                    next.show();
                    that.render(options.renderEle, options.renderFor, body, !isFirst);
                    if (!that.hasNext) {
                        //没有下一页显示无更多数据提示
                        next.html(nomoredata);
                    } else {
                        options.nextButton && next.html(options.nextButton.text);
                    }
                }
            }

            if (typeof callback == 'function') {
                callback(response);
            }
        }, callbackError);
    };

    /**
     * 详情查询
     *
     * @param options-封装请求url，请求数据，请求类型，渲染容器，渲染模版
     * @param callback-请求成功后执行的回调方法
     * @param callbackError-请求失败后执行的回调方法
     */
    Api.prototype.detail = function(options, callback, callbackError) {
        var that = this,
            opt = { //默认配置
                renderFor: this.defaultDetailTmpl,
                renderEle: this.defaultDetailEle,
                key: 'body',
                showLoading: true,
                logtype: 'detail'
            };

        for (var i in opt) {
            options[i] = options[i] || opt[i];
        }

        if (options.showLoading) {
            $(options.renderEle).html('<div class="loading">加载中...</div>');
        }

        that.ajaxSend(options, function(response, textStatus, jqXHR) {
            if (response.code != 0 && response.code != 1) {
                $(options.renderEle).html(response.message);
                return;
            }
            var data = response[options.key] || {};
            if (data)
                render(options.renderEle, options.renderFor, data);
            if (typeof callback == 'function') {
                callback(response);
            }
        }, callbackError);
    };
    /**
     * 表单提交
     *
     * @param options-传入的参数
     * @param callback-请求成功后执行的回调方法
     * @param callbackError-请求失败后执行的回调方法
     */
    Api.prototype.submit = function(options, callback, callbackError) {
        var formData,
            that = this,
            isForm = !!options.data.length,
            btnSubmit = options.data.find('[type="submit"]');

        if (isForm) {
            formData = options.data.serializeArray();
            btnSubmit.attr('disabled', true);
        } else {
            formData = options.data;
        }
        options.data = formData;
        options.type = options.type || 'POST';
        options.logtype = 'submit';

        that.ajaxSend(options, function(response, textStatus, jqXHR) {
            if (isForm) {
                btnSubmit.removeAttr('disabled');
            }
            if (typeof callback == 'function') {
                callback(response);
            }
        }, function(jqXHR, textStatus, errorThrown) {
            if (isForm) {
                btnSubmit.removeAttr('disabled');
            }
            if (typeof callbackError == 'function') {
                callbackError(jqXHR, textStatus, errorThrown);
            }
        });
    };
    /**
     * 自定义查询
     *
     * @param options-封装请求url，请求数据，请求类型
     * @param callback-请求成功后执行的回调方法
     * @param callbackError-请求失败后执行的回调方法
     */
    Api.prototype.custom = function(options, callback, callbackError) {
        var that = this;
        options = options || {};
        options.logtype = 'custom';

        that.ajaxSend(options, callback, callbackError);
    };

    /**
     * jquery.ajax
     */
    Api.prototype.ajaxSend = function(options, callback, callbackError) {
        var that = this;
        that.isLoading = true;
        that.queue[options.url] = true;

        if (options.showLoading) {
            $(options.renderEle).hide();
            $('#ti-loading').show();
        }

        //添加默認設置
        options = options || {};
        //options.url = options.url + '.json'; //测试使用模拟接口
        //console.log(options.url);
        $.ajax({
            url: options.url,
            data: options.data,
            type: options.type || 'GET',
            dataType: 'text',
            timeout: that.timeout,
            cache: that.cache
        }).then(function(response, textStatus, jqXHR) {
            try {
                response = eval('(' + response + ')'); //測試模擬接口
            } catch (e) {
                response = {
                    code: -999,
                    message: '(TI)返回数据格式解析错误'
                };
            }
            that.isLoading = false;
            delete(that.queue[options.url]);

            if (!response) {
                logged(options.logtype, response.message || response, options.url);
                if (typeof callbackError == 'function') {
                    callbackError('Malformed', response);
                }
                return;
            }

            if (typeof callback == 'function') {
                callback(response);
            }
            if (isEmpety(that.queue) && typeof that.onEnd == 'function') {
                that.onEnd.call(this);
            }
        }, function(jqXHR, textStatus, errorThrown) {
            that.isLoading = false;
            delete(that.queue[options.url]);

            logged(options.logtype, textStatus, options.url);
            if (typeof callbackError == 'function') {
                callbackError(textStatus);
            }

            if (isEmpety(that.queue) && typeof that.onEnd == 'function') {
                that.onEnd.call(this);
            }
        }).done(function() {
            $('#ti-loading').hide();
            $(options.renderEle).fadeIn();
        });
    }

    /**
     * 数据渲染到模板
     * @param renderEle-渲染容器
     * @param renderFor-渲染模版
     * @param data-数据
     * @param isAppend-是否追加
     */
    function render(renderEle, renderFor, data, isAppend) {
        if ($('#' + renderFor).length > 0 && data) {
            if (typeof data.length != 'undefined') {
                data = {
                    'list': data
                };
            }
            var result = tmpl(renderFor, data);
            if (isAppend) {
                $(renderEle).append(result);
            } else {
                $(renderEle).html(result);
            }
        }
    }

    function tmpl(renderFor, data) {
        return template.render(renderFor, data);
    }

    /**
     * 记录接口的错误日志
     * @param type-接口请求类型
     * @param message-错误内容
     * @param url-错误地址
     */
    function logged(type, message, url) {
        log('[' + type + '] ' + message + ':' + url, 2);
    }

    //判断对象是否为空
    function isEmpety(obj) {
        var flag = true;
        for (var i in obj) {
            flag = false;
            break;
        }

        return flag;
    }

    function findByKey(obj, key) {
        var arr = [],
            tar;
        for (var i in obj) {
            arr.push(obj[i]);
            if (key == i) {
                tar = obj[i];
            }
        }

        if (arr.length == 0) return obj[key] = 1;
        if (tar) return tar;
        arr = arr.sort();
        return obj[key] = arr[arr.length - 1] + 1;
    }

    //准备滚动加载的数据
    function prepareData(data) {
        var prevData = [],
            moreData = [];
        for (var i in data) {
            if (i < data.length / 2) {
                prevData.push(data[i]);
            } else {
                moreData.push(data[i]);
            }
        }
        data = prevData;
        this.moreData = moreData;
        return data;
    }

    //初始化数字分页
    function initPagination(data, dom) {
        var d = {
            current_page: data.current,
            per_page: data.size,
            total: data.count
        };

        d.current_page = parseInt(d.current_page);
        d.total = parseInt(d.total);
        d.per_page = parseInt(d.per_page);
        d.total = Math.ceil(d.total / d.per_page);

        d.prev_page = d.current_page == 1 ? 1 : d.current_page - 1;
        d.next_page = d.current_page == d.total ? d.current_page : d.current_page + 1;
        var start = d.current_page - 2,
            end = d.current_page + 2;

        if (d.total <= 5) {
            start = 1;
            end = d.total;
        } else {
            if (start < 1) {
                start = 1;
                end = start + 4;
            }
            if (end > d.total) {
                end = d.total;
                start = d.total - 4;
            }
        }

        var result = '';

        result += '<dl><dt' + (d.prev_page == 1 ? ' class="disabled"' : '') + '><a href="#' + d.prev_page + '"><img src="images/arrow_left.gif"></a></dt><dd>';
        for (var i = start; i <= end; i++) {
            result += '<a href="#' + i + '"' + (d.current_page == i ? ' class="active"' : '') + '>' + i + '</a>';
        }
        result += '</dd><dt class="ari' + (d.next_page >= d.total ? ' disabled' : '') + '"><a href="#' + d.next_page + '"><img src="images/arrow_left.gif"></a></dt></dl>';

        $(dom).html(result).show();
    }

    //抛出公用方法，保持模板调用入口唯一
    Api.prototype.render = render;
    Api.prototype.logged = logged;

    window.Ajax = new Api();
})();

//cookie读写
(function() {
    var Cookie = {
        get: function(sname) {
            var sre = "(?:;)?" + sname + "=([^;]*);?";
            var ore = new RegExp(sre);
            if (ore.test(document.cookie)) {
                try {
                    return unescape(RegExp["$1"]); // decodeURIComponent(RegExp["$1"]);
                } catch (e) {
                    return null;
                }
            } else {
                return null;
            }
        },

        set: function(c_name, value, expires) {
            expires = expires || this.getExpDate(7, 0, 0);
            if (typeof expires == 'number') {
                expires = this.getExpDate(expires, 0, 0);
            }
            document.cookie = c_name + "=" + escape(value) + ((expires == null) ? "" : ";expires=" + expires) + "; path=/";
        },

        remove: function(key) {
            this.set(key, '', -1);
        },

        getExpDate: function(e, t, n) {
            var r = new Date;
            if (typeof e == "number" && typeof t == "number" && typeof t == "number")
                return r.setDate(r.getDate() + parseInt(e)), r.setHours(r
                        .getHours() + parseInt(t)), r.setMinutes(r.getMinutes() + parseInt(n)),
                    r.toGMTString()
        }
    };
    window.Cookie = Cookie;
})();

// 本地存储
(function() {
    var Storage = {
        AUTH: 'ZJWR-AUTH',
        ACCOUNT: 'ZJWR-ACCOUNT',
        REMEMBER: 'ZJWR-REMEMBER',
        LOGIN_HISTORY: 'LH',
        AREA: 'ZJWR-AREA',
        get: function(key, isSession) {
            if (!this.isLocalStorage()) {
                return;
            }
            var value = this.getStorage(isSession).getItem(key);
            if (value) {
                return JSON.parse(value);
            } else {
                return undefined;
            }
        },
        set: function(key, value, isSession) {
            if (!this.isLocalStorage()) {
                return;
            }
            value = JSON.stringify(value);
            this.getStorage(isSession).setItem(key, value);
        },
        remove: function(key, isSession) {
            if (!this.isLocalStorage()) {
                return;
            }
            this.getStorage(isSession).removeItem(key);
        },
        getStorage: function(isSession) {
            return isSession ? sessionStorage : localStorage;
        },
        isLocalStorage: function() {
            try {
                if (!window.localStorage) {
                    log('不支持本地存储');
                    return false;
                }
                return true;
            } catch (e) {
                log('本地存储已关闭');
                return false;
            }
        }
    };

    window.Storage = Storage;
})();

//工具类
(function() {
    var that = this,
        preventDefault, panel, panelBg, delay, count = 0,
        toastPanel, temp;

    //自定义提示框，依赖jquery
    var TipPanel = function(el, options) {
        var that = this;

        that.panel = el || $('#ti-panel');
        that.panelBg = panelBg || $('#ti-panel-bg');
        that.panelTitle = that.panel.find('.panel-title');
        that.panelTips = that.panel.find('.panel-tips');
        that.btnOk = that.panel.find('.btn-ok');
        that.btnCancel = that.panel.find('.btn-cancel');
        that.panelText = that.panel.find('.panel-text');
        that.panelTick = that.panel.find('.panel-tick');

        that.options = {
            type: 'error',
            tick: 0,
            okText: '确定',
            cancelText: '取消',
            showTitle: false,
            showTips: false
        };

        //关闭
        that.panel.on('click', '.btn-ok', function(e) {
            e.preventDefault();
            that.hide(true);
        });

        //取消
        that.panel.on('click', '.btn-cancel', function(e) {
            e.preventDefault();
            that.hide();
        });
    };

    TipPanel.prototype = {
        delay: undefined,
        count: 0,
        setOptions: function(options) {
            var that = this;

            for (i in options) that.options[i] = options[i];

            if (that.options.showTitle) {
                that.panelTitle.show();
            } else {
                that.panelTitle.hide();
            }
            if (that.options.showTips) {
                that.panelTips.show();
            } else {
                that.panelTips.hide();
            }
            if (that.options.okText) {
                that.btnOk.text(that.options.okText);
            }
            if (that.options.cancelText) {
                that.btnCancel.text(that.options.cancelText);
            }
            if (that.options.tipsText) {
                that.panelTips.html(that.options.tipsText);
            }
            if (that.options.type == 'confirm') {
                that.btnOk.show();
                that.btnCancel.show();
            } else {
                that.btnOk.show();
                that.btnCancel.hide();
            }
            that.panelText.html(that.options.message);
            that.panel.css('margin-top', -(that.panel.height() / 2)).show();
            that.panelBg.show();

            if (that.options.tick > 1000) {
                that.panelTick.text(that.options.tick / 1000);
                that.delay = setInterval(function() {
                    if (that.count < that.options.tick - 1000) {
                        that.count = count + 1000;
                        that.panelTick.text((that.options.tick - count) / 1000);
                    } else {
                        that._end();
                        that.count = 0;
                        clearInterval(that.delay);
                    }
                }, 1000);
            } else if (that.options.tick <= 1000 && that.options.tick > 0) {
                that.delay = setTimeout(function() {
                    that._end();
                }, that.options.tick);
            }
        },
        _end: function() {
            var that = this;

            that.panel.hide();
            that.panelBg.hide();

            if (typeof that.options.tipsCallback == 'function') {
                that.options.tipsCallback();
                that.options.tipsCallback = undefined;
            } else if (typeof that.options.yesCallback == 'function') {
                that.options.yesCallback();
                that.options.yesCallback = undefined;
            }
        },
        show: function() {

        },
        hide: function(yesClick) {
            var that = this;

            if (that.delay) {
                clearTimeout(that.delay);
            }
            if (!that.panel) {
                return;
            }
            that.panel.hide();
            that.panelBg.hide();

            if (yesClick) {
                typeof that.options.yesCallback == 'function' && that.options.yesCallback();
            } else {
                typeof that.options.noCallback == 'function' && that.options.noCallback();
            }
            that.options.yesCallback = undefined;
            that.options.noCallback = undefined;
        }
    }

    //按指定格式格式化日期
    function format(date, pattern) {
        var that = date;
        var o = {
            "M+": that.getMonth() + 1,
            "d+": that.getDate(),
            "h+": that.getHours(),
            "m+": that.getMinutes(),
            "s+": that.getSeconds(),
            "q+": Math.floor((that.getMonth() + 3) / 3),
            "S": that.getMilliseconds()
        };
        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (that.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    };

    var Tools = {
        // 货币格式化，2050.5=>2,050.5
        formatCurrency1: function(content, defaultValue, unit) {
            if (!content) {
                return defaultValue || '--';
            }

            content = content + ''; //转字符串

            var prefix, subfix, idx = content.indexOf('.');
            if (idx > 0) {
                prefix = content.substring(0, idx);
                subfix = content.substring(idx, content.length);
            } else {
                prefix = content;
                subfix = '';
            }

            var mod = prefix.toString().length % 3;
            var sup = '';
            if (mod == 1) {
                sup = '00';
            } else if (mod == 2) {
                sup = '0';
            }

            prefix = sup + prefix;
            prefix = prefix.replace(/(\d{3})/g, '$1,');
            prefix = prefix.substring(0, prefix.length - 1);
            if (sup.length > 0) {
                prefix = prefix.replace(sup, '');
            }
            if (subfix) {
                if (subfix.length == 2) {
                    subfix += '0';
                } else if (subfix.length == 1) {
                    subfix += '00';
                }
                subfix = subfix.substring(0, 3);
            }
            return prefix + subfix;
        },
        strToDate: function(str) { //字符串转日期，yyyy-MM-dd hh:mm:ss
            var tempStrs = str.split(" ");
            var dateStrs = tempStrs[0].split("-");
            var year = parseInt(dateStrs[0], 10);
            var month = parseInt(dateStrs[1], 10) - 1;
            var day = parseInt(dateStrs[2], 10);

            var timeStrs = tempStrs[1].split(":");
            var hour = parseInt(timeStrs[0], 10);
            var minute = parseInt(timeStrs[1], 10) - 1;
            var second = parseInt(timeStrs[2], 10);
            var date = new Date(year, month, day, hour, minute, second);
            return date;
        },
        //获取URL参数
        getQueryValue: function(key) {
            var q = location.search,
                keyValuePairs = new Array();

            if (q.length > 1) {
                var idx = q.indexOf('?');
                q = q.substring(idx + 1, q.length);
            } else {
                q = null;
            }

            if (q) {
                for (var i = 0; i < q.split("&").length; i++) {
                    keyValuePairs[i] = q.split("&")[i];
                }
            }

            for (var j = 0; j < keyValuePairs.length; j++) {
                if (keyValuePairs[j].split("=")[0] == key) {
                    // 这里需要解码，url传递中文时location.href获取的是编码后的值
                    // 但FireFox下的url编码有问题
                    return decodeURI(keyValuePairs[j].split("=")[1]);

                }
            }
            return '';
        },
        //时间戳格式化
        formatDate: function(content, type) {
            var pattern = type || "yyyy-MM-dd hh:mm";
            if (isNaN(content) || content == null) {
                return content;
            } else if (typeof(content) == 'object') {
                var y = dd.getFullYear(),
                    m = dd.getMonth() + 1,
                    d = dd.getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                var yearMonthDay = y + "-" + m + "-" + d;
                var parts = yearMonthDay.match(/(\d+)/g);
                var date = new Date(parts[0], parts[1] - 1, parts[2]);
                return format(date, pattern);
            } else {
                var date = new Date(parseInt(content));
                return format(date, pattern);
            }
        },
        // 获取窗口尺寸，包括滚动条
        getWindow: function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        // 获取文档尺寸，不包括滚动条但是高度是文档的高度
        getDocument: function() {
            var doc = document.documentElement || document.body;
            return {
                width: doc.clientWidth,
                height: doc.clientHeight
            };
        },
        // 获取屏幕尺寸
        getScreen: function() {
            return {
                width: screen.width,
                height: screen.height
            };
        },
        // 显示、禁用滚动条
        showOrHideScrollBar: function(isShow) {
            preventDefault = preventDefault || function(e) {
                e.preventDefault();
            };
            (document.documentElement || document.body).style.overflow = isShow ? 'auto' : 'hidden';
            // 手机浏览器中滚动条禁用取消默认touchmove事件
            if (isShow) {
                // 注意这里remove的事件必须和add的是同一个
                document.removeEventListener('touchmove', preventDefault, false);
            } else {
                document.addEventListener('touchmove', preventDefault, false);
            }
        },
        // 显示对话框
        showDialog: function() {},
        // 显示着遮罩层
        showOverlay: function() {},
        // 显示确认框
        showConfirm: function(msg, yesCallback, noCallback) {
            var opt = {};
            if (typeof msg == 'object') {
                opt = msg;
            } else {
                opt.message = msg;
                opt.yesCallback = yesCallback;
                opt.noCallback = noCallback;
            }
            opt.type = 'confirm';
            opt.showTitle = true;
            opt.showTip = false;

            panel = panel || new TipPanel();
            panel.setOptions(opt);
        },
        // 显示提示
        showAlert: function(msg, tick, callback) {
            var opt = {};
            if (typeof msg == 'object') {
                opt = msg;
            } else {
                opt.message = msg;
                opt.tick = tick;
                opt.yesCallback = callback;
            }
            opt.type = 'alert';

            panel = panel || new TipPanel();
            panel.setOptions(opt);
        },
        // 显示加载框
        showLoading: function() {
            $('#ti-loading').show();
        },
        hideLoading: function() {
            $('#ti-loading').hide();
        },
        hidePanel: function(yesClick) {
            panel && panel.hide(yesClick);
        },
        showToast: function(msg, tick) {
            toastPanel = toastPanel || $('#ti-toast');
            tick = tick || 600;

            if (delay) {
                clearTimeout(delay);
            }

            toastPanel.find('span').text(msg);
            toastPanel.show();
            delay = setTimeout(function() {
                toastPanel.hide();
            }, tick);
        },
        isIPad: function() {
            //5.0 (iPad; CPU OS 8_1_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B435
            return (/iPad/gi).test(navigator.appVersion);
        }
    };

    window.Tools = Tools;
})();




//debug
var log = function(m) {
    if (typeof console != 'undefined') {
        console.log(m);
    }
};

/**
 * 将form中的值转换为键值对
 *
 * @param form
 *            表单对象
 */
var formJson = function(form) {
    var o = {};
    var a = $(form).serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var Ajax = {
    /**
     * 基于ajax的查询
     *
     * @param data
     *            封装请求url，请求数据，请求类型
     * @param callback
     *            ajax请求成功后执行的回调方法
     * @param callbackDone
     *            ajax请求成功后最后执行的方法
     */
    pageRequest: function(data, callback, callbackDone) {
        var renderFor = data.renderFor || 'wu-list-tmpl',
            renderEle = data.renderEle || '#wu-list';

        var next = $('.wlist_next'),
            nextStr = '<a class="wlist_next" href="#">下一页</a>';
        if (next.length == 0) {
            $(renderEle).after(nextStr);
            next = $('.wlist_next');
        }
        if (config.cpage == 0) {
            //查第一页数据一定清空当前容器
            $(renderEle).html('');
        }
        next.show().addClass('loading').text(config.tips.loading);

        $.ajax({
            url: data.url,
            data: data.data,
            type: data.type || 'GET',
            timeout: 7000,
            //cache: false
        }).then(function(response, textStatus, jqXHR) {
            next.removeClass('loading');
            if (response.code != 'OK') {
                next.text(config.tips.server);
                return;
            }

            if ($('#' + renderFor).length) {
                var result = template.render(renderFor, {
                    'list': response.result
                });
                $(renderEle).append(result);
            }

            if (response.result.length == 0) {
                //数据没有结果显示无数据提示
                if (config.cpage == 0) {
                    next.html(config.tips.nodata);
                } else {
                    next.text(config.tips.nomoredata);
                }
            } else {
                config.cpage += config.pagesize;
                next.text('更多');
            }

            if (response.countData > 0) {
                if (response.countData <= response.begin + response.count) {
                    //能预判断无下一页时显示无数据提示
                    //next.text(config.tips.nodata);
                    next.hide();
                } else {}
            }

            if ($.isFunction(callback)) {
                callback(response);
            }
        }).done(function(xhr, b) {
            if ($.isFunction(callbackDone)) {
                callbackDone();
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            if (textStatus == 'timeout') {
                next.removeClass('loading').addClass('error').text(config.tips.timeout);
            } else {
                next.removeClass('loading').addClass('error').text(config.tips.server);
            }
        });

    },
    /**
     * 基于ajax的查询
     *
     * @param data
     *            封装请求url，请求数据，请求类型
     * @param callback
     *            ajax请求成功后执行的回调方法
     * @param callbackDone
     *            ajax请求成功后最后执行的方法
     */
    queryRecord: function(data, callback, callbackDone, callbackError) {
        var renderFor = data.renderFor || 'wu-detail-tmpl',
            renderEle = data.renderEle || '#wu-detail';

        $.ajax({
            url: data.url,
            data: data.data,
            type: data.type || 'GET',
            timeout: 7000,
            //cache: false
        }).then(function(response) {
            if (response.code != 'OK') {
                $('#wu-empty').show();
                //return;
            }

            if ($('#' + renderFor).length && response.result) {
                var result = template.render(renderFor, response.result);
                $(renderEle).html(result);
            }
            if ($.isFunction(callback)) {
                callback(response);
            }
        }).done(function() {
            if ($.isFunction(callbackDone)) {
                callbackDone();
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            if (textStatus == 'timeout') {
                $(renderEle).addClass('error').text(config.tips.timeout);
            } else {
                $(renderEle).addClass('error').text(config.tips.server);
            }
            if ($.isFunction(callbackError)) {
                callbackError();
            }
        });
    },
    /**
     * 基于ajax的表单提交
     *
     * @param data
     *            传入的参数
     * @param callback
     *            ajax请求成功后执行的回调方法
     * @param callbackDone
     *            ajax请求成功后最后执行的方法
     */
    submitForm: function(data, callback, callbackDone) {
        var formData;

        var isForm = !!data.data.length;
        if (isForm) {
            formData = data.data.serializeArray();
            data.data.find('input[type="submit"]').attr('disabled', true);
        } else {
            formData = data.data;
        }

        $.ajax({
            url: data.url,
            data: formData,
            type: data.type || 'POST',
            timeout: 7000
        }).then(function(response) {
            if ($.isFunction(callback)) {
                callback(response);
            }
        }).done(function() {
            if (isForm) {
                data.data.find('input[type="submit"]').removeAttr('disabled');
            }
            if ($.isFunction(callbackDone)) {
                callbackDone();
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            if (isForm) {
                data.data.find('input[type="submit"]').removeAttr('disabled');
                Tools.showTip(config.tips.server, 5000);
            }
        });
    }
};

// 本地存储
var Storage = (function() {
    return {
        AUTH: 'WORLDUNION_AUTH',
        ACCOUNT: 'WORLDUNION_ACCOUNT',
        REMEMBER: 'WORLDUNION_REMEMBER',
        OPENID: 'WORLDUNION_OPENID',
        get: function(key, isSession) {
            if (!Storage.isLocalStorage()) {
                return;
            }
            var value = Storage.getStorage(isSession).getItem(key);
            if (value) {
                return JSON.parse(value);
            } else {
                return undefined;
            }
        },
        set: function(key, value, isSession) {
            if (!Storage.isLocalStorage()) {
                return;
            }
            value = JSON.stringify(value);
            Storage.getStorage(isSession).setItem(key, value);
        },
        remove: function(key, isSession) {
            if (!Storage.isLocalStorage()) {
                return;
            }
            Storage.getStorage(isSession).removeItem(key);
        },
        getStorage: function(isSession) {
            return isSession ? sessionStorage : localStorage;
        },
        isLocalStorage: function() {
            try {
                if (!window.localStorage) {
                    log('不支持本地存储');
                    return false;
                }
                localStorage.setItem('isLocalStorage', 'abc');
                localStorage.removeItem('isLocalStorage');
                return true;
            } catch (e) {
                log('本地存储已关闭');
                return false;
            }
        }
    };
})();

var Tools = (function() {
    var preventDefault, panel, delay, panel0, toastPanel;
    return {
        formatDate: function(content, type) {
            var pattern = "yyyy-MM-dd hh:mm";
            // 2012年1月23日
            // 18:00
            // 2013.1.23
            // 2013/01/23
            switch (type) {
                case 1:
                    pattern = "yyyy年M月d日";
                    break;
                case 2:
                    pattern = "hh:mm";
                    break;
                case 3:
                    pattern = "yyyy.M.d";
                    break;
                case 4:
                    pattern = "yyyy-MM-dd hh:mm:ss";
                    break;
                case 5:
                    pattern = "yyyy年MM月";
                    break;
                case 6:
                    pattern = "yyyy-MM-dd";
                    break;
                default:
                    pattern = !!type ? type : pattern;
                    break;
            }
            if (isNaN(content) || content == null) {
                return content;
            } else if (typeof(content) == 'object') {
                var y = dd.getFullYear(),
                    m = dd.getMonth() + 1,
                    d = dd
                    .getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                var yearMonthDay = y + "-" + m + "-" + d;
                var parts = yearMonthDay.match(/(\d+)/g);
                var date = new Date(parts[0], parts[1] - 1, parts[2]);
                return date.format(pattern);
            } else {
                var date = new Date(parseInt(content));
                return date.format(pattern);
            }
        },
        // 获取窗口尺寸，包括滚动条
        getWindow: function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        // 获取文档尺寸，不包括滚动条但是高度是文档的高度
        getDocument: function() {
            var doc = document.documentElement || document.body;
            return {
                width: doc.clientWidth,
                height: doc.clientHeight
            };
        },
        // 获取屏幕尺寸
        getScreen: function() {
            return {
                width: screen.width,
                height: screen.height
            };
        },
        // 显示、禁用滚动条
        showOrHideScrollBar: function(isShow) {
            preventDefault = preventDefault || function(e) {
                e.preventDefault();
            };
            (document.documentElement || document.body).style.overflow = isShow ? 'auto' : 'hidden';
            // 手机浏览器中滚动条禁用取消默认touchmove事件
            if (isShow) {
                // 注意这里remove的事件必须和add的是同一个
                document
                    .removeEventListener('touchmove', preventDefault, false);
            } else {
                document.addEventListener('touchmove', preventDefault, false);
            }
        },
        // 显示加载框
        showLoading: function() {
            this.showPanel('loading', '数据加载中…');
        },
        // 显示提示
        showTip: function(msg, tick, callback) {
            if (tick == 0) {
                this.showPanel('message', msg, callback);
                return;
            }
            tick = tick || 500;
            this.showPanel('message', msg, tick, callback);
        },
        // 显示确认框
        showConfirm: function(msg, yesCallback, noCallback) {
            this.showPanel('confirm', msg, 0, yesCallback, noCallback);
        },
        // 显示正确信息
        showSuccess: function(msg, tick) {
            this.showPanel('success', msg, tick);
        },
        // 显示错误信息
        showError: function(msg, tick) {
            this.showPanel('error', msg, tick);
        },
        showPanel: function(type, message, tick, yesCallback, noCallbck) {
            panel = panel || $('#myPanel');
            type = type || 'error';
            message = message || '提示信息';
            config.onYesClick = yesCallback;
            config.onNoClick = noCallbck;

            panel.find('p').html(message);
            panel.show().css('margin-top', -(panel.height() / 2));
            $('#panelBg').show();
            if (type == 'confirm') {
                panel.find('.btn_ok').hide();
                panel.find('.btn_yes').show();
                panel.find('.btn_no').show();
            } else {
                panel.find('.btn_ok').show();
                panel.find('.btn_yes').hide();
                panel.find('.btn_no').hide();
            }

            if (!!tick)
                delay = setTimeout(function() {
                    panel.hide();
                    $('#panelBg').hide();

                    if (typeof config.onYesClick == 'function') {
                        config.onYesClick();
                        config.onYesClick = undefined;
                    }
                }, tick);
        },
        showSelect: function(type, message, tick, callback) {
            panel0 = panel0 || $('#mySelect');
            type = type || 'error';
            message = message || '提示信息';
            panel0.find('').removeClass().addClass(type);
            panel0.show().css('margin-top', -(panel0.height() / 2));
            $('#panelBg').show();
            config.onTipClose = callback;

            if (!!tick)
                delay = setTimeout(function() {
                    panel0.hide();
                    $('#panelBg').hide();

                    if (typeof config.onTipClose == 'function') {
                        config.onTipClose();
                        config.onTipClose = undefined;
                    }
                }, tick);
        },
        hideSelect: function() {
            if (delay) {
                clearTimeout(delay);
            }
            if (!panel0) {
                return;
            }
            panel0.hide();
            $('#panelBg').hide();

            if (typeof config.onTipClose == 'function') {
                config.onTipClose();
                config.onTipClose = undefined;
            }
        },
        hidePanel: function(yesClick) {
            if (delay) {
                clearTimeout(delay);
            }
            if (!panel) {
                return;
            }
            panel.hide();
            $('#panelBg').hide();

            if (yesClick) {
                typeof config.onYesClick == 'function' && config.onYesClick();
            } else {
                typeof config.onNoClick == 'function' && config.onNoClick();
            }
            config.onYesClick = undefined;
            config.onNoClick = undefined;
        },
        toast: function(msg, tick) {
            toastPanel = toastPanel || $('#wu-toast');
            tick = tick || 600;

            if (delay) {
                clearTimeout(delay);
            }

            toastPanel.find('span').text(msg);
            toastPanel.show();
            delay = setTimeout(function() {
                toastPanel.hide();
            }, tick);
        }
    };
})();

// cookie
var Cookie = {
    get: function(sname) {
        var sre = "(?:;)?" + sname + "=([^;]*);?";
        var ore = new RegExp(sre);
        if (ore.test(document.cookie)) {
            try {
                return unescape(RegExp["$1"]); // decodeURIComponent(RegExp["$1"]);
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    },

    set: function(c_name, value, expires) {
        expires = expires || this.getExpDate(7, 0, 0);
        if (typeof expires == 'number') {
            expires = this.getExpDate(expires, 0, 0);
        }
        document.cookie = c_name + "=" + escape(value) + ((expires == null) ? "" : ";expires=" + expires) + "; path=/";
    },

    remove: function(key) {
        Cookie.set(key, '', -1);
    },

    getExpDate: function(e, t, n) {
        var r = new Date;
        if (typeof e == "number" && typeof t == "number" && typeof t == "number")
            return r.setDate(r.getDate() + parseInt(e)), r.setHours(r
                    .getHours() + parseInt(t)), r.setMinutes(r.getMinutes() + parseInt(n)),
                r.toGMTString()
    }
};

// 扩展Date的format方法
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

// 扩展String的方法
String.prototype.isSpaces = function() {
    for (var i = 0; i < this.length; i += 1) {
        var ch = this.charAt(i);
        if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
            return false;
        }
    }
    return true;
};

String.prototype.isValidMail = function() {
    return (new RegExp(
            /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
        .test(this));
};

String.prototype.isPhone = function() {
    return (new RegExp(/^1\d{10}?$/).test(this));
};

String.prototype.isEmpty = function() {
    return (/^\s*$/.test(this));
};

String.prototype.isValidPwd = function() {
    return (new RegExp(/^([_]|[a-zA-Z0-9]){8,16}$/).test(this));
};

String.prototype.isPostCode = function() {
    return (new RegExp(/^\d{6}?$/).test(this));
};

String.prototype.getQueryValue = function(key) {
    var q = this,
        keyValuePairs = new Array();

    if (q.length > 1) {
        var idx = q.indexOf('?');
        q = q.substring(idx + 1, q.length);
    } else {
        q = null;
    }

    if (q) {
        for (var i = 0; i < q.split("&").length; i++) {
            keyValuePairs[i] = q.split("&")[i];
        }
    }

    for (var j = 0; j < keyValuePairs.length; j++) {
        if (keyValuePairs[j].split("=")[0] == key) {
            // 这里需要解码，url传递中文时location.href获取的是编码后的值
            // 但FireFox下的url编码有问题
            return decodeURI(keyValuePairs[j].split("=")[1]);

        }
    }
    return '';
};
