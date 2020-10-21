import request from '@/utils/request'

export default{
    getPageList(page,limit,teacherQuery) {
      return request({
        url: `/eduservice/teacher/pageList/${page}/${limit}`,
        method: 'post',
        data:teacherQuery
      })
    },
    removeDataById(id) {
      return request({
        url: `/eduservice/teacher/deleteByTeacherId/${id}`,
        method: 'delete'
      })
    },
    save(eduTeacher) {
      return request({
          url: `/eduservice/teacher/saveTeacher`,
          method: 'post',
          data: eduTeacher
      })
    },
    getDataById(id) {
      return request({
          url: `/eduservice/teacher/getTeacherById/${id}`,
          method: 'get'
      })
    },
    updateById(eduTeacher) {
      return request({
          url: `/eduservice/teacher/updateTeacherById`,
          method: 'put',
          data: eduTeacher
      })
  },
  getListTeacher() {
    return request({
        url: `/eduservice/teacher/teacher`,
        method: 'get'
    })
}
}