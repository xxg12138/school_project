<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree_tools
          :is-root="true"
          :tree-node="company"
          style="height:40px;"
          @addDepts="addDepts"
        />

        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">

          <tree_tools
            slot-scope="{ data }"
            :tree-node="data"
            style="height:40px;width: 100%;"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <add_dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import tree_tools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import add_dept from './components/add-dept'
export default {
  components: {
    tree_tools,
    add_dept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      node: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.company = { name: '校园管理', manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.getDepartments()
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

  <style scoped>
  .tree-card {
    padding: 30px  140px;
    font-size:14px;
  }
  </style>
