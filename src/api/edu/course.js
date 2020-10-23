import request from '@/utils/request'
export default{
    addCourseInfo(courseInfoVo) {
        return request({
          url: `/eduservice/course/addCourseInfo`,
          method: 'post',
          data: courseInfoVo
        })
      },
      getCourseInfoById(courseId) {
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo) {
      return request({
        url: '/eduservice/course/updateCourseInfo',
        method: 'post',
        data: courseInfo
      })
    },
    //课程确认信息显示
    getPublihCourseInfo(id) {
      return request({
          url: '/eduservice/course/getPublishCourseInfo/'+id,
          method: 'get'
        })
    },
    //课程最终发布
    publihCourse(id) {
        return request({
            url: '/eduservice/course/publishCourse/'+id,
            method: 'post'
          })
    },
    //TODO 课程列表
    //课程最终发布
    getListCourse() {
        return request({
            url: '/eduservice/course',
            method: 'get'
          })
    },
    deleteCourse(id) {
      return request({
          url: '/eduservice/course/'+id,
          method: 'delete'
        })
  }
}