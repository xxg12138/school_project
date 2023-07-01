<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <el-form ref="addEmployee" label-width="120px" :model="formData"  :rules="rules">
        <el-form-item prop="username" label="姓名">
            <el-input v-model="formData.username" style="width:50%"  placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
            <el-input style="width:50%" v-model="formData.mobile"  placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="timeOfEntry" label="入职时间">
            <el-date-picker style="width:50%" v-model="formData.timeOfEntry" placeholder="请选择入职时间" ></el-date-picker>
        </el-form-item>
        <el-form-item prop="formOfEmployment" label="聘用形式">
            <el-select  style="width:50%" v-model="formData.formOfEmployment" placeholder="请选择">
            <el-option v-for="item in EmployeeEnum.hireType" :key="item.id"
            :value="item.id"
            :label="item.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item prop="workNumber" label="工号">
            <el-input style="width:50%" v-model="formData.workNumber" placeholder="请输入工号" ></el-input>
        </el-form-item>
        <el-form-item prop="departmentName" label="部门">
            <el-input  @focus="getDepartments" style="width:50%" v-model="formData.departmentName" placeholder="请选择部门"></el-input>
            <el-tree 
            v-loading="loading"
            v-if="showTree"
            default-expand-all=""
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            ></el-tree>

        </el-form-item>
        <el-form-item prop="correctionTime" label="转正时间">
            <el-date-picker style="width:50%" v-model="formData.correctionTime" placeholder="请选择转正时间" ></el-date-picker>
        </el-form-item>
    </el-form>

    <template v-slot:footer>
        <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>

  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import {addEmployee} from '@/api/employees'
export default {
props: {
    showDialog:{
        type:Boolean,
        default:false
    },
},
data(){
        return {
            EmployeeEnum,
            loading:false,
            showTree:false,
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            formData:{
                username:'',
                mobile:'',
                formOfEmployment:'',
                workNumber:'',
                departmentName:'',
                timeOfEntry:'',
                correctionTime:''
            },
            rules:{
                username:[{required:true,trigger:'blur',message:"用户姓名不能为空"},
                { min: 1, max: 4, message: '用户姓名为1-4位'}],
                mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, 
                {pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'}],
                formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
                workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
                departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
                timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
            }
        }
    },
    methods: {
        btnCancel(){
            this.$refs.addEmployee.resetFields()
            this.$emit('update:showDialog',false)
        },
        async btnOk(){
               try{
                await this.$refs.addEmployee.validate()
                await addEmployee(this.formData)
                this.$message('新增成功')
                this.$parent.getEmployeeList()
                this.$emit('update:showDialog',false)
               }catch(error){
                console.log(error);
               }
        },
        async getDepartments(){
            this.loading=true
            this.showTree=true
            const {depts}= await getDepartments();
            this.treeData=tranListToTreeData(depts,'')
            console.log(this.treeData);
            this.loading=false
        },
        handleNodeClick(node){
            this.formData.departmentName=node.name
            this.showTree=false
        }
        
    }
}
</script>

<style>

</style>