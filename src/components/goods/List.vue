<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goAddpage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <!-- data  数据源 -->
      <el-table :data="goodslist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <!-- prop 指定对应的数据 -->
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          width="80px"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column label="创建时间" width="160px" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
    };
  },
  components: {},
  computed: {},
  mounted() {},
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$$message.error("获取商品列表失败");
      }
      this.$message.success("获取商品列表成功");
      console.log(res.data);
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 最近的页码值
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum;
      this.getGoodsList();
    },
    // 删除按钮
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getGoodsList();
    },
    // 点击跳转
    goAddpage() {
      this.$router.push("/goods/add");
    },
  },
};
</script>
<style scoped lang='less'>
</style>