<template>
    <div class="dashboard-container">
      <div class="app-container">
        <PageTools :showBefore="true"> 
          <span slot="before">共{{page.total}}条数据</span>
          <template #after>
            <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
            <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
            <el-button :disabled="!checkPermission('POINT-USER-ADD')" size="small" type="primary" @click="showDialog=true" >新增员工</el-button>
          </template>
        </PageTools>

        <el-card v-loading="loading">
          <el-table
        :data="list"
        border
        >
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名"  sortable="" prop="username" />
          <el-table-column label="头像" width="120px"   align="center">
            <template slot-scope="{row}">
              <img
              @click="showQrCode(row.staffPhoto)"
              v-imgeerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto" 
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              alt=""
              >
            </template>
            </el-table-column>


          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" 
          :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ row.timeOfEntry |formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <el-switch
              :value="row.enableState===1"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            </template>
            </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="edutRike(row)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

        <el-row type="flex" justify="center" align="middle">
          <el-pagination
          :current-page="page.page"
          @current-change="changePage"
           layout="prev,pager,next"
           :total="page.total"
           :page-size="page.size"
           ></el-pagination>
        </el-row>
        </el-card>

      </div>

      
      <add_employee :showDialog.sync="showDialog" :visible.sync="showCodeDialog" ></add_employee>
     
      <el-dialog title="二维码" :visible.sync="showCodeDialog">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas">
            </canvas>
        </el-row>
      </el-dialog>

      <AssigoRole ref="assignRole" :showRoleDialog.sync="showRoleDialog" :userId="userId"></AssigoRole>
    </div>
  </template>
  
  <script>
  import AssigoRole from './components/assign-role.vue'
  import QrCode from 'qrcode'
  import {formatDate} from '@/filters/index'
  import add_employee from './components/add-employee.vue'
  import EmployeeEnum from '@/api/constant/employees'
  import {getEmployeeList,delEmployee} from '@/api/employees'
  export default {
    components:{
      add_employee,
      AssigoRole 
    },
    data(){
      return{
        userId:null,
        showRoleDialog:false,
        showCodeDialog:false,
        loading:false,
        list:[],
        page: {
        page: 1, // 当前页码
        size: 6,
        total: 0, // 总数
      },
      showDialog:false
      }
    },
    created () {
      this.getEmployeeList()
    },
    methods: {
      async getEmployeeList(){
        this.loading=true
        const {total,rows}=await getEmployeeList(this.page)
        this.list=rows
        this.page.total=total
        this.loading=false
      },
      changePage(newPage){
        this.page.page=newPage
        this.getEmployeeList()
      },
      formatEmployment(row, column, cellValue, index){
      const obj=  EmployeeEnum.hireType.find(item=>item.id===cellValue)
     
      return obj?obj.value:'未知'
      },
      deleteEmployee(id){
        try{
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delEmployee(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getEmployeeList()
        })   
          
        }catch(error){
          // this.$message({message:"删除失败", type: 'warning'})
        }
      },
      exportData(){
        const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
        import('@/vendor/Export2Excel').then(async exdel=>{
         const {rows} =await getEmployeeList({page:1,size:this.page.total})
         let arr=this.formatJson(headers,rows)
         const multiHeader=[['姓名','主要信息','','','','','部门']]
         const merges=['A1:A2','B1:F1','G1:G2']
          exdel.export_json_to_excel({
            header:Object.keys(headers),
            data:arr,
            filename:'员工资料表',
            multiHeader,
            merges
          })
        })

      },
      formatJson(headers,rows){
        return rows.map(item=>{
          return Object.keys(headers).map(key=>{
            if(headers[key]==='timeOfEntry'||headers[key]==='correctionTime'){
              return formatDate(item[headers[key]])
            }else if(headers[key]==='formOfEmployment'){
              const obj= EmployeeEnum.hireType.find(items=>items.id===item[headers[key]])
              return obj?obj.value:'未知'
            }
            return item[headers[key]]
          })
        })
      },
      showQrCode(url){
        if(url){
          console.log(url);
          this.showCodeDialog=true
          this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, '123')
        })
          
        }else{
          this.$message.warning('该用户还未上传头像')
        }
       
      },
      async edutRike(row){
        this.userId=row.id
        await this.$refs.assignRole.getUserDetailById(row.id)
        this.showRoleDialog=true
        


      }


    }
  }
  </script>
  
  <style>
  
  </style>