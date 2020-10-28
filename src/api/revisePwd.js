import request from "@/utils/request"

export default{

    //校验原密码
    checkPwd(userId,pwd){
        return request({
            url:"/user/pwd",
            method:"post",
            data:{
                userId,
                pwd
            }
        })
    },
    changePwd(userId,pwd){
        return request({
            url:"/user/pwd",
            method:"put",
            data:{
                userId,
                pwd
            }
        })
    }

}