import request from "@/utils/request"

export default {
    search(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: "post",
            data: searchMap
        })
    },
    addStaff(from) {
        return request({
            url: "/staff",
            method: "post",
            data: from
        })
    },
    getStaff(id) {
        return request({
            url: `/staff/${id}`,
            method: "get",
        })
    },
    updataStaff(pojo) {
        return request({
            url: `/staff/${pojo.id}`,
            method: "put",
            data: pojo
        })
    },
    deleteStaff(id) {
        return request({
            url: `/staff/${id}`,
            method: "delete",
        })
    }
}