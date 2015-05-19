(function() {
    var keyword = Tools.getQueryValue('name'),
        d = [];


    Ajax.paging({
        url: config.api_cont_doctype_keyword,
        data: {
            name: keyword
        },
        renderEle: '#falv-list',
        renderFor: 'falv-list-tmpl'
    }, function(data) {
        myData = data.data;
        $("#falv-list").find("li").on("click", function() {
            // alert(myData)
            var selectId = $(this).attr("data-id"),
                result = $(this).text();
            for (var i = myData.length - 1; i >= 0; i--) {
                if (myData[i].categoryId = selectId) {

                    Storage.remove('SEARCH_RESULT');
                    Storage.set('SEARCH_RESULT', myData[i]);
                    window.location.href = "cont-build.html?result=" + result;
                }
            };
        })
    });
    template.helper("keyword", keyword);

    // Storage.remove('SEARCH_History')
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

})()
