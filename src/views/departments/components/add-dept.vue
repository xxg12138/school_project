<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="deptForm" :model="formData"  :rules="rules" label-width="120px">
        <el-form-item prop="name" label="部门名称">
            <el-input v-model="formData.name"  style="width:80%"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="部门编码">
            <el-input  v-model="formData.code" style="width:80%"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
            <el-select placeholder="请选择" style="width:80%" 
             @focus="getEmployeeSimple" 
             v-model="formData.manager">
                <el-option v-for="item in peoples" :key="item.id"
                :label="item.username"
                :value="item.username"
                >
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="introduce" label="部门介绍">
            <el-input  v-model="formData.introduce"  style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3"></el-input>
        </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" @click="btnOk" type="primary">确定</el-button>
        </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {getEmployeeSimple} from '@/api/employees'
import {getDepartments,updateDepartments,addDepartments,getDepartDetail} from '@/api/departments'
export default {
props: {
    showDialog:{
        type:Boolean,
        default:false
    },
    treeNode: {
      type: Object,
      default: null
    }
},
computed: {
showTitle(){
    return this.formData.id?'编辑部门':'新增部门'
}  
},
data(){
    const checkNameRepeat=async (rule, value, callback )=>{
       const {depts} =await getDepartments()
       let isRepeat=false
        if(this.formData.id){
            const father=depts.filter(item=>item.pid===this.treeNode.pid&&item.id!==this.treeNode.id);
            isRepeat=father.some(item=>item.name===value)
            console.log(father);
        }else{
            isRepeat= depts.filter(item=>item.pid===this.treeNode.id).some
       (item=>item.name===value)
        }
        isRepeat?callback(new Error(`同级部门下已经存在这个${value}部门了`)):callback()

    }
    const checkCodeRepeat=async(rule, value, callback)=>{
        const {depts} =await getDepartments()
        let isRepeat=false
        if(this.formData.id){
            const father=depts.filter(item=>item.id!==this.treeNode.id)
            isRepeat=father.some(item=>item.code===value)
        }else{
       isRepeat=depts.some(item=>item.code===value&&value)
        }
        isRepeat?callback(new Error(`组织架构下已经存在这个${value}编码了`)):callback()

    }
    return {
        formData: {
        name: '', 
        code: '', 
        manager: '', 
        introduce: '',
        },
        rules:{
        name: [{required:true,trigger:'blur',message:"部门名称不能为空"},
        { min:1,max:50,trigger:'blur',message:"字数为1-50位"},
        {trigger:"blur",validator:checkNameRepeat}], 
        code: [{required:true,trigger:'blur',message:"部门编码不能为空"},
        { min:1,max:50,trigger:'blur',message:"字数为1-50位"},
        {trigger:'blur',validator:checkCodeRepeat}], 
        manager: [{required:true,trigger:'blur',message:"部门负责人不能为空"}],
        introduce: [{required:true,trigger:'blur',message:"部门介绍不能为空"},
        {min:1,max:300,trigger:'blur',message:"字数为1-300位"}],
        },
        peoples:[]

    }
},
methods: {
    async getEmployeeSimple(){
        this.peoples=await getEmployeeSimple()
    },
    btnOk(){
        this.$refs.deptForm.validate(async isOk=>{
            if(isOk){
               if(this.formData.id){
                await updateDepartments(this.formData)
               }else{
                await addDepartments({
                    code:this.formData.code,
                    introduce:this.formData.introduce,
                    manager:this.formData.manager,
                    name:this.formData.name,
                    pid:this.treeNode.id
                })
               }
                this.$emit('addDepts')
                this.$emit('update:showDialog', false)
            }
        })
    },
    btnCancel(){
        this.formData={
            name: '', 
        code: '', 
        manager: '', 
        introduce: '',
        }
        this.$emit('update:showDialog',false)
        this.$refs.deptForm.resetFields()
    },
     async getDepartDetail(id){
        this.formData=await getDepartDetail(id)
    }
}
}
</script>

<style>

</style>