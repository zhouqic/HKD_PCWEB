<template>
  <el-container style="display:block;">
    <el-table :data="detailData" border :show-header="false" style="margin-bottom: 15px;">
      <el-table-column prop="key" label="key" width="150">
        <template slot-scope="scope">
          <span style="font-weight: 900;">{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="value">
        <template slot-scope="scope">
          <div v-html="scope.row.value"></div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 优惠券 -->
    <el-table :data="cardsData" border style="margin-bottom: 15px;">
      <el-table-column label="优惠券名称">
        <template slot-scope="scope">{{ scope.row.rfCard.title }}</template>
      </el-table-column>
      <el-table-column label="减免金额">
        <template slot-scope="scope">{{ scope.row.rfCard.reduceCost + '元' }}</template>
      </el-table-column>
      <el-table-column label="使用条件">
        <template slot-scope="scope">{{ "满" + scope.row.rfCard.leastCost + "元可用" }}</template>
      </el-table-column>
      <el-table-column label="是否可赠送">
        <template slot-scope="scope">
          {{ scope.row.rfCard.isSend == 1 ? "可赠送" : '不可赠送' }}
        </template>
      </el-table-column>
      <el-table-column label="有效期">
        <template slot-scope="scope">
          <template v-if="scope.row.rfCard.type == 0">{{ "领取后" + scope.row.rfCard.fixedTerm + "天" }}</template>
          <template v-else>
            {{ scope.row.rfCard.beginTimestamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            ~
            {{ scope.row.rfCard.endTimestamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="总张数">
        <template slot-scope="scope">{{ scope.row.totalNum + "张/人" }}</template>
      </el-table-column>
      <el-table-column label="消费特权">
        <template slot-scope="scope">
          {{ scope.row.isPrivilege == 1 ? ("用户领取后每" + scope.row.days + "天激活" + scope.row.num + "张") : '无' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 商品兑换券 -->
    <el-table :data="productsData" border style="margin-bottom: 15px;">
      <el-table-column label="兑换券图片">
        <template slot-scope="scope">
          <img :src="scope.row.rfEntityCard.pic" v-if="scope.row.rfEntityCard.pic" width="50" height="50" style="border-radius:50%;">
        </template>
      </el-table-column>
      <el-table-column label="兑换券名称">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="价值">
        <template slot-scope="scope">{{ '￥' + scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="有效期">
        <template slot-scope="scope">
          <template v-if="scope.row.rfEntityCard.type == 1">{{ "领取后" + scope.row.rfEntityCard.validDays + "天" }}</template>
          <template v-else>
            {{ scope.row.rfEntityCard.beginTimestamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            ~
            {{ scope.row.rfEntityCard.endTimestamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="总张数">
        <template slot-scope="scope">{{ scope.row.totalNum + "张/人" }}</template>
      </el-table-column>
      <el-table-column label="消费特权">
        <template slot-scope="scope">
          {{ scope.row.isPrivilege == 1 ? ("用户领取后每" + scope.row.days + "天激活" + scope.row.num + "张") : '无' }}
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
import { getShangMengById } from '@/api/marketCenter';
import { parseTime } from "@/utils";

  export default {
    props: ["id"],
    data() {
      return {
        detailData: [],
        cardsData: [],
        productsData: []
      }
    },
    created() {
      this.handleGetActivityDetail();
    },
    methods: {
      handleGetActivityDetail() {
        getShangMengById({ id: this.id }).then(res => {
          this.detailData = [
            {
              key: "活动名称",
              value: res.tableData.businessAllianceJoinShop.title
            },
            {
              key: "礼包价值",
              value: res.tableData.businessAllianceJoinShop.totalMoney
            },
            {
              key: "报名时间",
              value: parseTime(res.tableData.activity.beginTime) + ' ~ ' + parseTime(res.tableData.activity.endTime)
            },
            {
              key: "活动时间",
              value: parseTime(res.tableData.activity.joinBeginTime) + ' ~ ' + parseTime(res.tableData.activity.joinEndTime)
            },
            {
              key: "活动说明",
              value: res.tableData.businessAllianceJoinShop.notice1 + '</br>' + res.tableData.businessAllianceJoinShop.notice2 + '</br>' + res.tableData.businessAllianceJoinShop.notice3
            }
          ];
          this.cardsData = res.tableData.cards;
          this.productsData = res.tableData.products;
        })
      }
    }
  }
</script>