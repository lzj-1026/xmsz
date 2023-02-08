<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card
      ><!-- 柱状图 -->
      <div id="main" style="height: 290px; width: 550px"></div>
    </el-card>
  </div>
</template>

<script>
// import echarts from "echarts";
export default {
  props: {},
  data() {
    return {};
  },
  components: {},
  computed: {},
  // 此时页面上的元素已经被渲染完毕
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      //2. 初始化echarts
      var myChart = echarts.init(document.getElementById("main"));
      // 准备数据和配置项
      var option = {
        title: {
          text: "月销量",
        },
        // 提示框
        tooltip: {},
        // 图例
        legend: {
          data: ["销量"],
        },
        // 表示x轴坐标
        xAxis: {
          data: ["oppo", "vivo", "iphone", "小米", "三星", "魅族"],
        },
        // 表示y轴坐标
        yAxis: {},
        //
        series: [
          {
            name: "销量",
            type: "bar",
            data: [3500, 2200, 4500, 6500, 200, 3000],
          },
        ],
      };
      // 展示数据
      myChart.setOption(option);
    },
  },
};
</script>
<style scoped lang='less'>
</style>