<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
            <el-select
                v-model="courseInfo.subjectParentId"
                placeholder="一级分类" @change="subjectLevelOneChanged">

                <el-option
                    v-for="subject in subjectOneList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>

            </el-select>

            <!-- 二级分类 -->
            <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
                <el-option
                    v-for="subject in subjectTwoList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
            </el-select>
        </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id">
          </el-option>
        </el-select>
      </el-form-item>
      

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <!-- <el-input v-model="courseInfo.description" placeholder=""/> -->
        <tinymce v-model="courseInfo.description" :height="300" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'eduoss/fileoss/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import teacher from '@/api/edu/teacher'
import Tinymce from '@/components/Tinymce'
const defaultForm = {
  title: '',
  subjectId: '',//二级分类id
  subjectParentId:'',//一级分类id
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: '',
  price: 0,
  cover: require('@/static/01.jpg'),
}
export default {
  components: { Tinymce },
  data() {
    return {
      courseInfo: defaultForm,
      courseId:'',//
      saveBtnDisabled: false, // 保存按钮是否禁用
      BASE_API: process.env.VUE_APP_BASE_API,// 接口API地址
      subjectOneList:[],//一级分类
      subjectTwoList:[],//二级分类
      teacherList:[]
    }
  },

  created() {
    console.log('info created')
    this.init()
  },

  methods: {

    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.courseId) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.fetchCourseInfoById(this.courseId)
        console.log(this.courseId)
      } else {
        this.courseInfo = { ...defaultForm }
        //初始化所有讲师
        this.getListTeacher()
        //初始化一级分类
        this.getOneSubject()
      }
    },
    // 保存
    saveData() {
      course.addCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/edu/course/chapter/' + response.data.courseId })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    //修改课程
    updateData() {
        course.updateCourseInfo(this.courseInfo)
            .then(response => {
                  //提示
                this.$message({
                    type: 'success',
                    message: '修改课程信息成功!'
                });
                //跳转到第二步
                this.$router.push({path:'/edu/course/chapter/'+this.courseId})
            })
    },
    //点击某个一级分类，触发change，显示对应二级分类
    subjectLevelOneChanged(value) {
        //value就是一级分类id值
        //遍历所有的分类，包含一级和二级
        for(var i=0;i<this.subjectOneList.length;i++) {
            //每个一级分类
            var oneSubject = this.subjectOneList[i]
            //判断：所有一级分类id 和 点击一级分类id是否一样
            if(value === oneSubject.id) {
                //从一级分类获取里面所有的二级分类
                this.subjectTwoList = oneSubject.children
                //把二级分类id值清空
                this.courseInfo.subjectId = ''
            }
        }
    },
    //查询所有的一级分类
    getOneSubject() {
        subject.getOneList()
            .then(response => {
                this.subjectOneList = response.data.item
            })
    },
    //查询所有的讲师
    getListTeacher() {
        teacher.getListTeacher()
            .then(response => {
                this.teacherList = response.data.item
            })
    },
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res,file){
      console.log(res.data.url)
      this.courseInfo.cover = res.data.url
    },
    fetchCourseInfoById(id) {
    course.getCourseInfoById(id).then(response => {
      this.courseInfo = response.data.courseInfoVo
        // 初始化分类列表
      subject.getOneList().then(responseSubject => {
        this.subjectOneList = responseSubject.data.item
        for (let i = 0; i < this.subjectOneList.length; i++) {
          if (this.subjectOneList[i].id === this.courseInfo.subjectParentId) {
            this.subjectTwoList = this.subjectOneList[i].children
          }
        }
      })
      this.getListTeacher()
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
  }
}
</script>
<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>