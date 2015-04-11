var config = {
    beginTime: undefined, //第一条数据的时间戳
    endTime: undefined, //最后一条数据的时间戳
    page: 1, //当前第几页，从1开始
    pageSize: 10, //默认分页大小
    server: location.protocol + '//' + location.host,
    server: 'http://61.155.169.177:9919/webapi.php', //模拟接口用
    image: location.protocol + '//' + location.host + '/',
    image: '../'
};

//account
config.api_login = config.server + '/user/quickLogin';//免验证码登陆
config.api_logout = config.server + '/user/logout';//登出
config.api_reg_validate = config.server + '/user/validate';//验证注册信息
config.api_reg_verify = config.server + '/user/customerVerify';//完成普通客户注册
config.api_reg_app = config.server + '/app/user/reg';//手机端用户注册
config.api_reg_resendSMS = config.server + '/user/resendSMS';//获取短信验证码

//forget
config.api_forget_step1 = config.server + '/user/forget/step1';//验证忘记密码信息
config.api_forget_step2 = config.server + '/user/forget/step2';//验证短信验证码
config.api_forget_step3 = config.server + '/user/forget/step3';//完成忘记密码
config.api_forget_resendSMS = config.server + '/user/forgetResendSMS';//忘记密码功能重新发送手机验证码
config.api_forget = config.server + '/app/user/forget';//手机端忘记密码

//lcard
config.api_lcard_activate = config.server + '/activateCard/activate';//激活法率卡
config.api_lcard_list= config.server + '/activateCard/getList';//获取未使用优惠券一览
config.api_lcard_couponlist = config.server + '/activateCard/getCouponList';//获取已激活法率卡一览

//housekeeper audit
config.api_audit_list = config.server + '/contractAudit/list';//获取合同审核一览
config.api_audit_add = config.server + '/contractAudit/add';//新建合同审核
config.api_audit_detail = config.server + '/contractAudit/getDetail';//获取合同审核详细
config.api_audit_list_app = config.server + '/app/contractAudit/list';//移动端获取合同审核一览

//file api
config.api_file_upload = config.server + '/file/upload.json';//上传文件到服务器
config.api_file_remove = config.server + '/file/remove.json';//删除
config.api_file_download = config.server + '/file/download.json';//下载
config.api_file_img = config.server + '/img/:id';//获取图片

