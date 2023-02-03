<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <!-- 添加按钮 -->
        <el-col>
          <el-button @click="showAddCateDialog" type="primary"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        class="table"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: green"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color: red" class="el-icon-error" v-else></i>
        </template>
        <!-- 排列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag
            type="warning"
            size="mini
          "
            v-else
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope>
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="showAddCateDialogClose"
    >
      <!-- 添加分类的表单-->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateRuleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 -->
          <!-- props指定配置对象 -->
          <!-- clearable清空 -->
          <!--  change-on-select允许选择任意一项 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderPros"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类列表  默认为空
      cateList: [],

      // 定义总数据条数
      total: 0,
      // 为table指定列定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示把当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板的名称
          template: "isok",
        },
        {
          label: "排列",
          // 表示把当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板的名称
          template: "order",
        },
        {
          label: "操作",
          // 表示把当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板的名称
          template: "opt",
        },
      ],
      //控制添加对话框的现实与隐藏
      addCateDialogVisible: false,
      //添加分类数据对象
      addCateForm: {
        // 将要添加的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级默认一级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderPros: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },

  components: {},
  mounted() {},
  methods: {
    // 获取商品·分类数据
    async getCateList() {
      let { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      console.log(res.data);
      // 把数据列表赋值给cateList
      this.cateList = res.data.result;

      //为总数据条数赋值
      this.total = res.data.total;
      console.log(this.columns);
    },
    // 监听分页区域改变事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮展开添加用户的对话框
    showAddCateDialog() {
      // 先获取父级分类列表
      this.getParentCateList();
      // 在展示对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的权限
    async getParentCateList() {
      let { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败");
      }
      console.log(res.data);
      this.parentCateList = res.data;
    },
    // 选择项发生变化触发函数
    parentCateChange() {
      console.log(this.selectedKeys);
      // 如果selectedKeys数组中的lenghth大于0，证明选中父级分类
      // 反之就说明没有选择
      if (this.selectedKeys.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;

        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      this.$refs.addCateRuleForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 监听对话框的关闭事件 重置表单数据
    showAddCateDialogClose() {
      this.$refs.addCateRuleForm.resetFields();
      (this.selectedKeys = []),
        (this.addCateForm.cat_level = 0),
        (this.addCateForm.cat_pid = 0);
    },
  },
};
</script>
<style scoped lang='less'>
.table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>