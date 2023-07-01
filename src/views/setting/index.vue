<template>
    <div class="dashboard-container">
      <div class="app-container">
       <el-card>
        <el-tabs  v-model="activeName">
          <el-tab-pane label="角色管理" name="0">
            <el-row style="height:60px">
            <el-button @click="showDialog=true" icon="el-icon-plus" type="primary" size="small">
              新增角色
            </el-button>
          </el-row>
            <el-table
            :data="list"
            border
            >
              <el-table-column  align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名" width="240"/>
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                <el-button size="small" @click="editRole(row.id)" type="primary">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
                 </el-table-column>
            </el-table>

           <el-row type="flex" justify="center" align="middle" style="height: 60px">
            <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :current-page="page.page"
            @current-change="changePage"
            :page-size="page.pagesize"></el-pagination>
           </el-row>
         
          </el-tab-pane>

          <el-tab-pane label="公司信息" name="1">

            <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false">
          </el-alert>

            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item  label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item  label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item  label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item  label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px"></el-input>
              </el-form-item>
            </el-form>

          </el-tab-pane>
        </el-tabs>
        </el-card>
      </div>
      <el-dialog
        title="提示"
        @close="btnCancel"
        :visible="showDialog">
        <el-form ref="roleFrom" :model="roleForm" :rules="rules"  label-width="120px">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="roleForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="description" label="角色描述">
            <el-input v-model="roleForm.description"></el-input>
          </el-form-item>
          </el-form>
        <el-row justify="center" type="flex" slot="footer" class="dialog-footer">
          <el-col :span="8">
            <el-button size="small" @click="btnCancel">取 消</el-button>
          </el-col>
          <el-col :span="8">
            <el-button size="small" type="primary" @click="btnOk">确 定</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <el-dialog title="分配权限" :visible.sync="showDialogs">
        <el-tree 
        ref="permTree"
        :data="permData" 
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
        >
            
          </el-tree>
        <el-row slot="footer" type="flex" justify="center">
          <el-col>
            <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
            <el-button size="small" @click="btnPermCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>

    </div>
  </template>
  
  <script>
   import {tranListToTreeData } from '@/utils'
import { getPermissionList,assignPerm } from '@/api/permisson'
  import {getRoleList,getCompanyInfo,deleteRole,getRoleDetail,updateRole,addRole} from '@/api/setting'
  import {mapGetters} from 'vuex'
  export default {
    data(){
      return {
        defaultProps: {
        label: 'name'
      },
      roleId:null,
      selectCheck:[],
        permData: [],
        showDialogs:false,
        activeName: '0',
        list:[],
        page:{
          page:1,
        pagesize:6,
        total:0
      },
      showDialog:false,
      formData:{},
      roleForm:{
        name:"",
        description:""
      },
      rules:{
        name:[{required:true,trigger:'blur',message:'不能为空'}],
      }
      }
    },
    computed: {
      ...mapGetters(['companyId'])
    },
    created () {
      this.getRoleList()
      this.getCompanyInfo()
    },
    methods: {
      async getRoleList(){
        const res=await getRoleList(this.page)
        this.page.total=res.total
        this.list=res.rows
      },
      async getCompanyInfo(){
        this.formData=await getCompanyInfo(this.companyId)
      },
      changePage(newPage){
        this.page.page=newPage
        this.getRoleList()
      },
      deleteRole(id){
        this.$confirm('确认删除吗？',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async()=>{
          await deleteRole(id)
          this.getRoleList()
          this.$message('删除成功')
        }).catch(()=>{
          this.$message('已取消删除')
        })
      },
      async editRole(id){
        this.roleForm=await getRoleDetail(id)
        this.showDialog=true
      },
      btnCancel(){
        this.roleForm={
          name:"",
          description:""
        }
        this.$refs.roleFrom.resetFields()
        this.showDialog=false 
      },
      async btnOk(){
        try{
          await this.$refs.roleFrom.validate()
          if(this.roleForm.id){
            await updateRole(this.roleForm)
          this.$message({message:'修改成功',type: 'success'})
          }else{
            await addRole(this.roleForm)
            this.$message({message:'新增成功',type: 'success'})
          }
          this.getRoleList()
          this.showDialog=false
         
        }catch(error){
          this.$message('修改失败',)
          this.showDialog=false

        }
      },
      async assignPerm(id){
        this.permData=tranListToTreeData(await getPermissionList(),'0')
        this.roleId=id
        const { permIds }=await getRoleDetail(id)
        this.selectCheck = permIds
        this.showDialogs=true
      },
      async btnPermOK(){
        await assignPerm({
          id:this.roleId,
          permIds:this.$refs.permTree.getCheckedKeys()
        }) 
        this.$message.success('分配权限成功')
        this.showDialogs=false
        
      },
      btnPermCancel(){
        this.selectCheck=[]
        this.showDialogs=false

      },
      
    }
  }
  </script>
  
  <style>
  
  </style>