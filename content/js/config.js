var config = {
    beginTime: undefined, //第一条数据的时间戳
    endTime: undefined, //最后一条数据的时间戳
    skip: 0,
    page: 1, //当前第几页，从1开始
    pageSize: 10, //默认分页大小
    appkey: '5c330281289e43aea815af3a7bdb902e',//云聚数据appkey
    server: location.protocol + '//' + location.host,
    server: 'http://42.192.0.11:4001', //测试接口用
    // server: "https://www.ilaw66.com", //测试接口用
    image: location.protocol + '//' + location.host + '/',
    image: 'http://42.192.0.11:4001'
};

//account
config.api_login = config.server + '/user/quickLogin';//免验证码登陆
config.api_logout = config.server + '/user/logout';//登出
config.api_reg_app = config.server + '/app/user/reg';//手机端用户注册
config.api_reg_resendSMS = config.server + '/app/user/sms';//获取短信验证码

//forget
config.api_forget_resendSMS = config.server + '/app/user/sms';//忘记密码功能重新发送手机验证码
config.api_forget = config.server + '/app/user/forget';//手机端忘记密码

//lcard
config.api_lcard_activate = config.server + '/activateCard/activate';//激活法率卡
config.api_lcard_list= config.server + '/activateCard/getList';//获取未使用优惠券一览
config.api_lcard_couponlist = config.server + '/activateCard/getCouponList';//获取已激活法率卡一览
config.api_lcard_activate_auto = config.server + '/activateCard/autoActivate';//自动激活法律卡

//housekeeper audit
config.api_audit_list = config.server + '/contractAudit/list';//获取合同审核一览
config.api_audit_add = config.server + '/contractAudit/add';//新建合同审核
config.api_audit_detail = config.server + '/contractAudit/getDetail';//获取合同审核详细
config.api_audit_list_app = config.server + '/app/contractAudit/list';//移动端获取合同审核一览
// housekeeper contract
config.api_cont_list = config.server + '/contract/list';//获取合同起草服务一览
config.api_cont_add = config.server + '/contract/add';//开始起草
config.api_cont_detail = config.server + '/contract/get';//获取合同服务详情
config.api_cont_preview = config.server + '/contract/preview';//预览合同
config.api_cont_generate = config.server + '/contract/generate'; //完成合同起草
config.api_cont_find_legal = config.server + '/contract/findLegalDoc'; //查看合同模版是否存在
config.api_cont_list_app = config.server + '/app/contract/list';//手机端获取合同起草服务一览
config.api_cont_select_list= config.server + '/category/list';//获得文本类型，目录名称，角色等列表
config.api_cont_doctype_keyword = config.server + '/category/searchContactByTypeName'//根据关键字搜索文本类型

//consult
config.api_consult_list = config.server + '/consult/list';//获取电话咨询一览
config.api_consult_file_list = config.server + '/consultFile/list';//获取咨询文件一览
config.api_consult_file_detail = config.server + '/consultFile/getDetail';//获取咨询文件详细
config.api_consult_file_add = config.server + '/consultFile/add';//上传咨询文件

//train
config.api_train_list = config.server + '/train/list';//获取法律培训列表

//letter
config.api_letter_list = config.server + '/letter/list';//获取律师函服务一览
config.api_letter_detail = config.server + '/letter/getDetail';//获取律师函服务详细
config.api_letter_add = config.server + '/letter/add';//提交律师函信息

//file api
config.api_file_upload = config.server + '/file/upload.json';//上传文件到服务器
config.api_file_remove = config.server + '/file/remove.json';//删除
config.api_file_download = config.server + '/file/download.json';//下载
config.api_file_img = config.server + '/img/:id';//获取图片

//service
config.api_service_stat = config.server + '/service/getServiceUseInfo';//获取统计信息
config.api_service_valid = config.server + '/service/getValidServiceAmount';//获取验证

//user
config.api_user_msg = config.server + '/app/user/update';//更新用户信息
config.api_user_info = config.server + '/user/getRegInfo';//获取用户信息
config.api_address_add = config.server + '/address/add';//新增地址
config.api_address_list = config.server + '/address/list';//新增地址
config.api_address_detail = config.server + '/address/getDetail';//获取地址详情
config.api_address_remove = config.server + '/address/remove';//删除地址
config.api_address_update = config.server + '/address/update';//编辑地址
config.api_place = config.server + '/place/list.json';//获取省市区信息

//enterprise
config.api_enterprise_province =  'http://i.yjapi.com/eci/provinces';//获取支持城市列表
config.api_enterprise_search =  'http://i.yjapi.com/eci/search';//查询匹配公司列表
config.api_enterprise_detail =  'http://i.yjapi.com/eci/getdetails';//获取公司信用详细信息


