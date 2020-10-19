<template>
  <div class='roles'>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item >角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-Button type="primary" @click="showAddDialog = true">添加角色</el-Button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table  border :data="rolesList" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" >
          <template slot-scope="scope" >
            <el-row v-for="item1 in scope.row.children" :key="item1.id" class="row vcenter">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id" class="vcenter">
                  <el-col :span="6">
                    <!-- 二级权限 -->
                    <el-tag type="success">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                    <!-- 三级权限 -->
                  <el-col :span="18">                   
                    <el-tag class="tag3" closable type='danger' v-for="item3 in item2.children" :key="item3.id" @close="removeRightsById(scope.row,item3.id)">{{item3.authName}}</el-tag>                  
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center"> 
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRolesInfo(scope)" >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)" >删除</el-button> 
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDidlog(scope.row)">分配权限 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹窗框 -->
    <el-dialog title="添加用户" :visible.sync="showAddDialog"  node-key = 'id' width="50%" @close="addDialogClosed" >
      <el-form :model="addRole" :rules="editRoleRules" ref="addRoleRef" label-width="120px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName" placeholder="请输入角色名称(长度在 3 ~ 10个字符)"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc" placeholder="请输入角色描述(长度在 3 ~ 10个字符)" ></el-input>
        </el-form-item>
      </el-form>
      <span>
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialog" width="50%" @close="editDialogClosed">
      <el-form :model="editRole" :rules="editRoleRules" ref="editRoleRef" label-width="120px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName" placeholder="请输入角色名称(长度在 3 ~ 10个字符)"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRole.roleDesc" placeholder="请输入角色描述(长度在 3 ~ 10个字符)" ></el-input>
        </el-form-item>
      </el-form>
      <span>
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRolesClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗框 -->
    <el-dialog title="分配信息" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rightsList" show-checkbox :props="treeProps" node-key='id' default-expand-all :default-checked-keys='defKeys'></el-tree>
      <span>
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 获取角色列表
//删除角色
// 删除角色指定权限
import { getRolesList, delRoles, removeRight, editRoles, addRoles, getRightsList, roleAuth} from '../../network/rights'
  export default {
    name: 'roles',
    data () {
      return {
        // 角色列表
        rolesList: [],
        //所有权限列表
        rightsList:[],
        //默认选中的节点id值数组
        defKeys:[],
        // 编辑角色显示弹窗
        editRoleDialog:false,
        showAddDialog:false,
        setRightDialogVisible:false,
        //修改前的Role
        editRole:[],
        // 添加角色数据
        addRole:
          {
            roleName:'',
            roleDesc:'',
          },
        //表单验证
        editRoleRules:{
         roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }]
       },
       //树形控件的属性绑定对象
       treeProps:{
         label:'authName',
         children:'children',
       },
       //默认选中的节点id值数组
        defKeys:[],
        // 当前即将分配权限的id
        roleId:'',
     }
    },
    created () {
      this._getRolesList();
    },
    methods :{
      //获取角色列表
      _getRolesList() {
        getRolesList ().then(res => {
          this.rolesList = res.data.data
        })
      },
      //编辑提交角色
      //(1)点击编辑
      editRolesInfo(info) {
        this.editRoleDialog = true;
        // 获取需要编辑角色信息，传给输入框
        this.editRole = info.row
      },
      //（2）点击确定，提交编辑后的信息且修改页面
      editRolesClick() {
        this.$refs.editRoleRef.validate((res) => {
          if (!res) return;
        // 发起用户修改信息的请求
          editRoles(this.editRole.id,{
            roleName: this.editRole.roleName,
            roleDesc: this.editRole.roleDesc,
          }).then((res) => {
            if (res.data.meta.status != 200) return;
            // 添加用户成功，关闭弹窗，重新加载用户列表
            this.$message.success('编辑角色成功!')
            this.editRoleDialog = false;
            this._getRolesList();
          });
        });
      },
      //(3)当弹窗消失时，清空输入框内容
      editDialogClosed () {
        this.$refs.editRoleRef.resetFields();
      },
      //添加角色
      addRoleInfo() {
        // console.log(this.addRole);
        this.$refs.addRoleRef.validate((res) => {
          if (!res) return;
        // 发送网络请求，添加用户
          addRoles(this.addRole).then((res) => {
            if (res.data.meta.status != 201) return this.$message.error("添加角色失败");
            // 添加角色成功，关闭弹窗，重新加载列表
            this.showAddDialog = false;
            this._getRolesList();
          });
        });
      },
      addDialogClosed() {
        this.$refs.addRoleRef.resetFields();
      },

      //删除角色
      async removeRolesById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err => err)
        if(confirmResult !== 'confirm' ) return;
        const res = await delRoles(id) 
        if( res.data.meta.status !== 200) return;
        this.$message.info('删除成功!');
        this._getRolesList()
      },
      //删除权限
      async removeRightsById (row, rightId){
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err => err)
        if(confirmResult !== 'confirm' ) return;
        const res = await removeRight(row.id, rightId)
        if( res.data.meta.status !== 200) return;
        this.$message.info('删除成功!')
        // this._getRolesList() 这样会重新加载页面，使得展开页会关闭;
        //将返回值中的最新权限赋值回去
        row.children = res.data.data;
    },
    //分配权限
    async showSetRightDidlog(row) {
      this.roleId = row.id
      // 重置defKeys数组
      this.defKeys = [],
      // 角色下所有的三级节点，并将id值保存到defKeys数组里
      this.getLeafKeys(row,this.defKeys)
      this.setRightDialogVisible = true;
      // 获取所有权限列表
      const { data:res } = await getRightsList('tree')
      if(res.meta.status !==200) return ;
      this.rightsList = res.data;

      // console.log(row);
    },
    // 获取角色下所有的三级节点，并将id值保存到defKeys数组里
    getLeafKeys(node,arr) {
      // 获取三级节点id
      if(!node.children){
        return arr.push(node.id)
      }
      // 遍历节点内子节点id，并添加到defKeys数组里
      node.children.forEach( i=> {
        this.getLeafKeys(i,arr)
      })
    },
    //点击为角色分配权限
    async allRights() {

      // 获取半选和全选的id
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];

      const idStr = keys.join(',');

      const { data:res } = await roleAuth(this.roleId,{rids:idStr});
      if(res.meta.status !=200) return ;
      // 重新获取角色列表
      this._getRolesList();
      this.setRightDialogVisible = false;
    },


  }
}
</script>

<style lang='less' scoped>
.row{
  border-bottom: 1px solid #eee ;
}
.tag3{
  margin-right: 10px;
}
.vcenter{
  display: flex;
  align-items: center;
} 
</style>