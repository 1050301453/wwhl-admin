<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import subject from '@/api/edu/subject'
export default {

  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created(){
    this.getOneList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value) !== -1
    },
    getOneList(){
      subject.getOneList().then(res=>{
        if(res.code==20000){
          this.data2=res.data.item
        }
      }).catch((res)=>{
        this.$message({
          showClose: true,
          message: '查询错误',
          type: 'error'
        });
      })
    }
  }
}
</script>