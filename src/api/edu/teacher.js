import request from '@/utils/request'

export default{
    getPageList(page,limit,teacherQuery) {
        return request({
          url: `/eduTeacher/teacher/pageList/${page}/${limit}`,
          method: 'post',
          data:teacherQuery
        })
      },
      removeDataById(id) {
        return request({
          url: `/eduTeacher/teacher/deleteByTeacherId/${id}`,
          method: 'delete'
        })
      },
      save(eduTeacher) {
        return request({
            url: `/eduTeacher/teacher/saveTeacher`,
            method: 'post',
            data: eduTeacher
        })
    }
}