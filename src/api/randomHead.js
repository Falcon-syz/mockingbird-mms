import axios from "axios"
export default {

    getHead() {
        const request = axios.create({
            baseURL: '/app',
            // baseURL:'/api',
            timeout: 5000,
            // headers: {'X-Custom-Header': 'foobar'}
        });

        return request({
            url: "/api.php",
            method: "get"
        })

    }

}

