<template>
    <div class="dashboard-container">
      <div class="app-container">
          <PageTools>
            <el-button @click="addPermission(1,'0')" slot="after" size="small" type="primary"  class="el-icon-edit">添加菜单</el-button>
          </PageTools>

          <el-table
          :data="list"
         
          row-key="id"
      style="width: 100%"
      default-expand-all
      >
      <el-table-column
        label="菜单名称"
        prop="name"
        >
      </el-table-column> 
      <el-table-column
      prop="code"
        label="权限表示">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="description"
        >
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="{row}">
          <el-button @click="addPermission(2,row.id)" type="text" v-if="row.type===1">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="showDialog" :title="showText">
      <el-form :rules="rules" :model="formData" ref="perForm"  label-width="120px">
        <el-form-item  label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button> 
        </el-col>
      </el-row>
    </el-dialog>

      </div>
    </div>
  </template>
  
  <script>
  import {updatePermission, addPermission, getPermissionDetail, delPermission, getPermissionList} from '@/api/permisson'
  import {tranListToTreeData} from '@/utils'
  export default {
  data(){
    return {
      showDialog:false,
      list:[],
      formData:{
        name:"",
        code:"",
        description:"",
        type:"",
        pid:"",
        enVisible:"0"
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList(){
      const res=tranListToTreeData(await getPermissionList(),"0")
      this.list=res
    },
    delPermission(id){
      console.log(id);
      this.$confirm('确认删除该权限点吗？').then(()=>{
        return delPermission(id)
      }).then(()=>{
        this.$message.success('删除成功')
        this.getPermissionList()
      })
    },
    addPermission(type,pid){
      this.formData.type=type
      this.formData.pid=pid
      this.showDialog=true
    },
    btnOK(){
      this.$refs.perForm.validate().then(()=>{
        if(this.formData.id){
          return updatePermission(this.formData)
         }
        return addPermission(this.formData)
      }).then(()=>{
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel(){
      this.formData={
        name:"",
        code:"",
        description:"",
        type:"",
        pid:"",
        enVisible:"0"
      },
      this.$refs.perForm.resetFields()
      this.showDialog = false

    },
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }

  },
  computed: {
    showText(){
      return this.formData.id?"编辑":"新增权限"
    }
  }

  }
  </script>
  
  <style>
  
  </style>