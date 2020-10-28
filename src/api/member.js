import request from "@/utils/request"

export default {
    getlist() {
        return request({
            url: "/member/list",
            method: "get",
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: "post",
            data: searchMap

        })
    },
    addMeb(member) {
        return request({
            url: "/member",
            method: "post",
            data: member

        })
    },
    getMember(id) {
        return request({
            url: `/member/${id}`,
            method:"get",
        })
    },
    updateMember(id) {
        return request({
            url: `/member/${id}`,
            method:"put",
        })
    },
    deleteMember(id) {
        return request({
            url: `/member/${id}`,
            method:"delete",
        })
    }
}