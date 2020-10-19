<template>
  <div class="users">
      <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            clearable
            @clear="_getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="_getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserClick(scope)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="showAddDialog"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFromRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.username"
            placeholder="请输入您的用户名(长度在 3 ~ 10个字符)"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            placeholder="请输入您需要设置的密码(长度在 6 ~ 15个字符)"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addForm.email"
            placeholder="请输入您的邮箱(xxxx@xxx.xxx)"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="addForm.mobile"
            placeholder="请您输入11位的手机号"
          ></el-input>
        </el-form-item>
      </el-form>
      <span>
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editInfoDialog"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFromRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editForm.username"
            placeholder="请输入您的用户名(长度在 3 ~ 10个字符)"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="editForm.email"
            placeholder="请输入您的邮箱(xxxx@xxx.xxx)"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="editForm.mobile"
            placeholder="请您输入11位的手机号"
          ></el-input>
        </el-form-item>
      </el-form>
      <span>
        <el-button @click="editInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="showAlloDialog"  width="50%">
      <div>
        <div>当前用户:{{userInfo.username}}</div>
        <div>当前角色:{{userInfo.role_name}}</div>
        <div>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in RolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <span>
        <el-button @click="showAlloDialog = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 获取用户数据
// 更新用户状态切换
// 添加新用户
// 获取需编辑用户信息
// 编辑用户
// 删除用户信息
import { getUserList, userChange, addUsers, getUserinfo, editUser, delUserInfo, assigningRoles} from "../../network/users";

// 获取所有角色列表
import { getRolesList } from '../../network/rights';

export default {
  name: "users",
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmil = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmil.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱!"));
    };
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确手机号!"));
    };

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 4,
      },
      userList: [],
      total: 0,
      // 记录添加用户对话框显示与隐藏
      showAddDialog: false,
      // 记录添加用户对话框显示与隐藏
      editInfoDialog: false,
      // 添加用户对象
      addForm: {
        username: "",
        email: "",
        mobile: "",
      },
      // 要编辑前的用户信息
      editForm: {},
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 15个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改验证验证
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //分配角色
      showAlloDialog:false,

      //需要分配角色的用户信息
      userInfo:{},
      //所有角色数据列表
      RolesList:{},
      //已选中的id值
      selectedRoleId:'',

    };
  },
  created() {
    this._getUserList();
  },
  methods: {
    _getUserList() {
      getUserList(this.queryInfo).then((res) => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error("获取用户失败");
        }
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 监听pagesize 改变事件
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this._getUserList();
    },
    // 监听页码值改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this._getUserList();
    },
    // 监听switch 开关的状态改变
    userStateChange(userinfo) {
      // console.log(val);
      userChange(userinfo).then((res) => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          // 取反
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("更新用户状态失败");
        }
      });
    },
    //关闭添加用户弹窗，清空表单验证和内容
    addDialogClosed() {
      this.$refs.addFromRef.resetFields();
    },
    //点击确定预检验表单
    addUser() {
      this.$refs.addFromRef.validate((res) => {
        if (!res) return;
        // 发送网络请求，添加用户
        addUsers(this.addForm).then((res) => {
          console.log(res);
          if (res.data.meta.status != 201) {
            return this.$message.error("添加用户失败");
          }
          // 添加用户成功，关闭弹窗，重新加载用户列表
          this.showAddDialog = false;
          this._getUserList();
        });
      });
    },

    editDialogClosed() {
      this.$refs.editFromRef.resetFields();
    },
    editUserClick(info) {
      // 点击按钮后切换显示弹窗
      this.editInfoDialog = true;
      // 获取需要编辑的用户信息
      getUserinfo(info.row.id).then((res) => {
        this.editForm = res.data.data;
        console.log(this.editForm);
      });
    },
    // 修改用户提交信息
    editUserInfo() {
      this.$refs.editFromRef.validate((res) => {
        if (!res) return;
        // 发起用户修改信息的请求
        editUser(this.editForm.id,{
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        }).then((res) => {
          if (res.data.meta.status != 200) return;
          // 添加用户成功，关闭弹窗，重新加载用户列表
          this.editInfoDialog = false;
          this._getUserList();
        });
      });
    },
    //根据id删除用户信息
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") return this.$message.info("已取消删除!");

      const res = await delUserInfo(id);
      if (res.data.meta.status != "200")
        return this.$message.info("删除失败！");
      this.$message.info("删除成功!");
      this._getUserList();
    },
    //分配角色
    async setRole(row) {
      this.showAlloDialog = true;
      // 获取分配角色的用户信息
      this.userInfo = row;

      const { data : res } = await getRolesList()
      if( res.meta.status !=200 ) return ;
      this.RolesList = res.data;
    },
    //点击确定按钮分配新角色
    async  assignRoles() {
      if( !this.selectedRoleId ) return;
      const { data : res } = await assigningRoles({rid:this.selectedRoleId}, this.userInfo.id)
      if(res.meta.status !== 200) return;
      this.$message.success('分配角色成功')
      this._getUserList();
      this.showAlloDialog = false;
    }
  },
};
</script>

<style lang='less' scoped>
</style>