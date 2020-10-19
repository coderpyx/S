<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../../assets/img/home/logo_QQ.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="back">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="toogle?'64px':'200px'">
        <div class="toggle_button" @click="toggleCollapse">
          | | |
        </div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#F07BAC"
                  unique-opened
                  text-color="#ccc"
                  active-text-color="#555"
                  :collapse = toogle
                  :collapse-transition = "false"       
                  :default-active = "activePath" 
                  router >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单选项 -->
            <el-menu-item :index="'/' + item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveNavState('/' + item1.path)">
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item1.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 网络请求
import {getMenuList} from '../../network/home';
export default {
  name: "home",
  data () {
    return {
      menulist:[],
      icons:['icon-yonghuguanli','icon-quanxianguanli4','icon-shangpinguanli','icon-dingdanguanli','icon-shujutongji'],
      toogle:false,
      // 被激活的链接
      activePath:'',
    }
  },
  methods: {
      // 退出销毁本地存储的token
    back() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    },
    // 获取菜单列表
    _getMenuList () {
      getMenuList ().then(res => {
        const MenuList = res.data.data;
        for( let i = 0 ; i < MenuList.length ;i++ ) {
          MenuList[i].icon = this.icons[i]
        }
        this.menulist = MenuList;
        // console.log(MenuList);
      })   
    },
    //点击按钮切换菜单折叠与展开
    toggleCollapse() {
      this.toogle = !this.toogle
    },
    //保存当前点击的路径
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath
    }
  },

  // 生命周期
   created() {
    this._getMenuList();

    this.activePath = window.sessionStorage.getItem('activePath')
  },
};
</script>

<style lang='less' scoped>
.home_container {
  height: 100%;
}

.el-button {
  background-color: #ff5277;
  height: 40px;
}
.el-header {
  background-color: pink;
  display: flex;
  justify-content: space-between;
  height: 60px;
  border-radius: 5px;
  align-items: center;
  margin: 2px;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  font-weight: 400;

  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
    img {
      padding: 0;
      width: 50px;
      height: 50px;
    }
  }
}

.el-aside {
  background-color: #e2086388;
  text-align: center;
  line-height: 200px;
  border-radius: 5px;
  margin: 2px;
}

.el-main {
  background-color: #ddd;
  text-align: center;
  line-height: 160px;
  border-radius: 5px;
  margin: 2px;
}

body > .el-container {
  margin-bottom: 40px;
}
// 侧边栏
.toggle_button{
  height: 40px;
  line-height: 38px;
  font-size: 15px;
  background-color: rgba(209, 95, 114, 0.493);
  border-radius: 5px;
  color: rgba(83, 39, 50, 0.658);
  cursor: pointer;
}
i{
  margin-right: 20px;
  color: #ccc;
}
.el-menu-item{
  font-size: 12px;
}
.el-menu{
  border-right: none;
}
</style>


