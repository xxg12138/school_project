<template>
  <el-dialog title="分配角色" :visible=" showRoleDialog">
    <el-checkbox-group v-model=" roleIds" >
    <el-checkbox v-for="item in list" :key="item.id"
     :label="item.id">{{item.name}}</el-checkbox>
  </el-checkbox-group>

    <el-row  slot="footer" type="flex" justify="center">
        <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
    </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {assignRoles} from '@/api/employees'
import {getUserDetailById} from '@/api/user'
import {getRoleList} from '@/api/setting'
export default {
props: {
    showRoleDialog:{
        type:Boolean,
        default:false
    },
    userId: {
      type: String,
      default: null
    },
    },
    data(){
        return {
            roleIds: [],
            list:[],
        }
    },
    created () {
        this.getRoleList()
        this.getUserDetailById()
    },
    methods: {
        async getRoleList(){
            const {rows} =await getRoleList({
                page:1,
                pagesize:20
            })
            this.list=rows
        },
        async getUserDetailById(id){
            const { roleIds } = await getUserDetailById(id)
            this.roleIds=roleIds  
        },
        async btnOk(){
        //    try{
            await assignRoles({
                id:this.userId,
                roleIds:this.roleIds
            })
            this.$message.success('分配权限成功')
            // this.$emit('update:showRoleDialog',false)
            this.$parent.showRoleDialog=false
        //    }catch(error){
        //     this.$message.error('分配权限失败')
        //    }
        },
        btnCancel(){
            this.roleIds=[]
            this.$emit('update:showRoleDialog',false)
           
        }
    }

}
</script>

<style>

</style>