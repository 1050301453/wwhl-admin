import request from '@/utils/request'
export default{
    getOneList(){
        return request({
            url: '/eduservice/subject/listSubject',
            method: 'get'
        })
    }
}