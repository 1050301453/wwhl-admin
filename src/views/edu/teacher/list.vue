<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort"  sortable label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
       <!-- 分页 -->
    

    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>
<script>
import teacher from '@/api/edu/teacher'
export default {
  data(){
    return {
      listLoading : true,
      list:null,//查询之后接口返回集合
      page:1,//当前页
      limit:5,//每页记录数
      total:0,//总记录数
      teacherQuery:{} //条件封装对象
    }
  },
  created(){
    this.getPageList()
  },
  methods:{
    getPageList(page =1){
      this.listLoading = true
      this.page=page
      teacher.getPageList(this.page,this.limit,this.teacherQuery).then(response=>{
        this.list=response.data.rows
        this.total=response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
        this.limit=val
        this.getPageList(this.page,val)
      },
      handleCurrentChange(val) {
        this.page=val
        this.getPageList(val,this.limit)
      },
      resetData() {
          this.teacherQuery = {}
          this.getPageList()
      },
      removeDataById(id){
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          return teacher.removeDataById(id)
        }).then(() => {
          this.getPageList()
          this.$message({
              type: 'success',
              message: '删除成功!'
            })
        }).catch((response) => {
          console.log(response)
          if(response==='cancel'){
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }else{
            this.$message({
                type: 'error',
                message: '删除失败'
            })
          }       
        })
      }
  }
}
</script>
