<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe row-key="id">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 通过插槽渲染数据 -->
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', il === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, il) in scope.row.children"
              :key="item.id"
              ><el-col :span="5">
                <!-- 渲染一级权限 -->
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <!-- 三角图标 -->
                <i class="el-icon-caret-right"></i
              ></el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限  -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 使用插槽插入按钮 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      // 所有角色列表区域
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的id
      roleId: "",
    };
  },
  created() {
    this.getRoleList();
  },
  components: {},
  mounted() {},
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      let { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.roleList = res.data;
      console.log(res);
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm("是否删除该项权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("删除权限成功");
      // 使用这个重新获取列表  但是之前的
      //   this.getRoleList();
      // 直接转存   换成data  data里面是最新的数据
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      let { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      // 把获取权限的数据转存data中
      this.rightsList = res.data;
      console.log(this.rightsList);
      // console.log(data);

      // 递归获取三级节点的id 调用获取角色保存id的函数
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式获取角色下所有的三级权限的id并保存到数组中
    getLeafKeys(node, arr) {
      // 如果当前node不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
      // 监听对话框的权限关闭事件
    },
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      // 刷新页面
      this.getRoleList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>
<style scoped lang='less'>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>