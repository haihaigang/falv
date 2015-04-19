(function() {

    //获取收货地址
    Ajax.paging({
        url: config.api_address_list,
        data: {
            ship: '',
            limit: ''
        },

    }, function() {})

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
