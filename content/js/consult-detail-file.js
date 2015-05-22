(function() {

	var id = Tools.getQueryValue('id'),
        tempData;//临时数据

    Ajax.detail({
        url: config.api_consult_file_detail,
        data: {
        	id: id
        }
    },function(data){
        tempData = data.data;
    });

    $('#flv-detail').submit(function(e){
    	e.preventDefault();

        // sb.append("{\"id\":\""+qaId+"\",\"data\":{\"question\":\"").append(demand_et.getText().toString())
        // .append("\", \"files\":").append(JsonUtils.toJson(files)).append("},\"uid\":\"")
        // .append(DataHolder.getInstance().getUser()._id).append("\"}");
        var question = $('input[name="question"]').val();

        var d = {
            id: id,
            data: {
                question: question,
                files: tempFiles
            },
            uid: Storage.get(Storage.AUTH)
        }

        d = JSON.stringify(d);

    	Tools.showConfirm('您确定需要修改吗？',function(){
    		Ajax.submit({
    			url: config.api_consult_file_update,
    			data: d,
                contentType: 'application/json',
                showLoading: true,
                type: 'PUT'
    		},function(data){
    			if(data.error){
    				Tools.showAlert(data.error.message);
    				return;
    			}

    			history.go(-1);
    		})
    	});

    })
})();
