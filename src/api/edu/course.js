import request from '@/utils/request'
export default{
    addCourseInfo(courseInfoVo) {
        return request({
          url: `/eduservice/course/addCourseInfo`,
          method: 'post',
          data: courseInfoVo
        })
      }
}