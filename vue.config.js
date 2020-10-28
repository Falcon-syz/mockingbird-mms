module.exports = {
    devServer: {
        port: 8001,       //端口号，如被占用自动升1
        host: "localhost",//主机名 127.0.0.1 真机0.0.0.0
        https: false,
        open: true,       //启动服务自动打开浏览器

        // disableHostCheck: true,
        proxy: {          //开发环境代理配置
            [process.env.VUE_APP_BASE_API]: {
                // target: 'http://localhost:8888',
                target: process.env.VUE_APP_SERVICE_URL,
                changeOrigin: true,//开启代理服务器
                // secure:false,
                pathRewrite: {//替换请求地址前缀
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                }
            }
        }

    },

    lintOnSave: false, //关闭格式检查
    productionSourceMap: false //打包时不会产生map文件
}