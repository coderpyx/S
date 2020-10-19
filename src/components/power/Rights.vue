<template>
  <div class="rights">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item >权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table  border :data="rightsList" stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
        <el-table-column prop="path" label="路径" align="center"></el-table-column>
        <el-table-column prop="level" label="权限等级" align="center"> 
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0" >一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type='success'>二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type='warning'>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

import { getRightsList } from '../../network/rights'
export default {
  name: "rights",
  data() {
    return {
      // 权限列表
      rightsList: [],
  
    };
  },

  // 方法
  methods: {
    async _getRightsList() {
      const res = await getRightsList('list')
      if( res.data.meta.status !=200) return this.$message.error('获取权限列表失败');
      this.rightsList = res.data.data
    }
  },
  // 生命周期函数
  created() {
    // 获取权限列表
    this._getRightsList()
  },
};
</script>

<style lang='less' scoped>
</style>