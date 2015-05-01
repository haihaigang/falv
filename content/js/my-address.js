(function() {

    //获取收货地址
    config.paging = function() {
        Ajax.paging({
            url: config.api_address_list,
            data: {
                skip: config.skip,
                limit: config.pageSize
            }
        },function(data){
            if(data.error) return;
            Storage.set('FLY-ADDRESS',data.data.items);
        });
    }

    config.paging();

    //删除地址
    $('#flv-list').on('click', '.del', function(e) {
        e.preventDefault();

        var that = $(this);

        Tools.showConfirm('确认删除吗？', function() {
            Ajax.custom({
                url: config.api_address_remove,
                data: {
                    id: that.attr('data-id')
                }
            }, function(data) {
                if (data.error) {
                    Tools.showAlert(data.error.message);
                    return;
                }

                that.parents('.box').remove();
            });
        });

    });
})();
