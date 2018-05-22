<template>
  <div>
    <p class="h1">状态：<span class="red">{{data.iccOrder.invoicePrintStateStr || data.iccOrder.orderPaymentStatusStr || data.iccOrder.orderStatusStr}}</span></p>
    <p class="title">订单信息-{{data.iccOrder.orderPaymentStatusStr}}</p>
    <table class="order-table" border="0">
      <tr>
        <td class="label" colspan="1">订单号</td>
        <td colspan="2">{{data.iccOrder.orderNo || '--'}}</td>
        <td colspan="1" class="label">购买套餐</td>
        <td colspan="2">{{data.iccOrder.packageName || '--'}}</td>
        <td colspan="1" class="label">购买账户</td>
        <td colspan="2">{{data.iccOrder.customerAccount || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">平台名称</td>
        <td colspan="2">{{data.iccOrder.projectName || '--'}}</td>
        <td colspan="1" class="label">机构</td>
        <td colspan="2">{{data.iccOrder.customerOrg || '--'}}</td>
        <td colspan="1" class="label">项目类型</td>
        <td colspan="2">{{data.iccOrder.projectTypeStr || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">订单金额（元）</td>
        <td colspan="2">{{data.iccOrder.orderAmount || '--'}}</td>
        <td colspan="1" class="label">订单提交时间</td>
        <td colspan="2">{{data.iccOrder.orderTime || '--'}}</td>
        <td colspan="1" class="label">订单状态</td>
        <td colspan="2">{{data.iccOrder.orderStatusStr || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">付款时间</td>
        <td colspan="2">{{data.iccOrder.orderPaymentTime || '--'}}</td>
        <td colspan="1" class="label">支付方式</td>
        <td colspan="2">{{data.iccOrder.orderPaymentSourcesStr || '--'}}</td>
        <td colspan="1" class="label">是否退款</td>
        <td colspan="2">{{Number(data.iccOrder.orderPaymentStatus) === 2 ? '是' : '否'}}</td>
      </tr>
      <tr>
        <td colspan="1" class="label" v-if="Number(data.iccOrder.orderPaymentStatus) === 2">退款时间</td>
        <td colspan="2" v-if="Number(data.iccOrder.orderPaymentStatus) === 2">{{data.iccOrder.orderRefundTime || '--'}}</td>
        <td class="label" colspan="1" v-if="Number(data.iccOrder.orderPaymentStatus) === 2">退款金额</td>
        <td colspan="2" v-if="Number(data.iccOrder.orderPaymentStatus) === 2">{{data.iccOrder.orderRefundAmount || '--'}}</td>
      </tr>
    </table>
    <p class="title">发票信息-{{data.iccOrder.invoicePrintStateStr || '无'}}</p>
    <table class="order-table" border="0" v-if="data.iccOrder.invoicePrintStateStr">
      <tr>
        <td class="label" colspan="1">发票类型</td>
        <td colspan="2">{{data.iccOrder.invoiceTypeStr || '--'}}</td>
        <td colspan="1" class="label">发票状态</td>
        <td colspan="2">{{data.iccOrder.invoicePrintStateStr || '--'}}</td>
        <td colspan="1" class="label">发票种类</td>
        <td colspan="2">{{Number(data.iccInvoice.invoiceClass) === 0 ? '增值税普通发票' : '增值税专业发票'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">打印时间</td>
        <td colspan="2">--</td>
        <td colspan="1" class="label">抬头类型</td>
        <td colspan="2">{{Number(data.iccInvoice.invoiceHeadType) === 0 ? '企业' : '个人/非企业'}}</td>
        <td colspan="1" class="label">发票抬头</td>
        <td colspan="2">{{data.iccInvoice.invoiceHead || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">税号</td>
        <td colspan="2">{{data.iccInvoice.invoiceDutyParagraph || '--'}}</td>
        <td colspan="1" class="label">发票内容</td>
        <td colspan="2">{{data.iccInvoice.invoiceContent || '--'}}</td>
        <td colspan="1" class="label">发票金额（元）</td>
        <td colspan="2">{{data.iccInvoice.invoiceValue || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">地址</td>
        <td colspan="2">{{data.iccInvoice.invoiceAddress || '--'}}</td>
        <td colspan="1" class="label">电话</td>
        <td colspan="2">{{data.iccInvoice.invoiceTelephone || '--'}}</td>
        <td colspan="1" class="label">开户行</td>
        <td colspan="2">{{data.iccInvoice.invoiceOpenBank || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">银行卡账号</td>
        <td colspan="2">{{data.iccInvoice.invoiceAccounts || '--'}}</td>
        <td colspan="1" class="label">电子邮箱</td>
        <td colspan="2">{{data.iccInvoice.invoiceAddresseeEmail || '--'}}</td>
      </tr>
    </table>
    <p class="title">收件信息{{data.iccInvoice.invoiceAddressee ? '' : '-无'}}</p>
    <table class="order-table" border="0" v-if="data.iccInvoice.invoiceAddressee">
      <tr>
        <td class="label" colspan="1">收件人</td>
        <td colspan="2">{{data.iccInvoice.invoiceAddressee || '--'}}</td>
        <td class="label" colspan="1">联系电话</td>
        <td colspan="2">{{data.iccInvoice.invoiceAddresseePhone || '--'}}</td>
        <td colspan="1" class="label">所在地区</td>
        <td colspan="2">{{data.iccInvoice.invoiceAddresseeArea || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">详细地址</td>
        <td colspan="2">{{data.iccInvoice.invoiceAddresseeAddress || '--'}}</td>
        <td class="label" colspan="1">电子邮箱</td>
        <td colspan="2">{{data.iccInvoice.invoiceAddresseeEmail || '--'}}</td>
      </tr>
    </table>
    <p class="title">物流信息-{{data.iccLogistics.logisticsId ? (data.iccLogistics.logisticsState === 0 ? '等待发出' : data.iccLogistics.logisticsState === 1 ? '已发出' : '已接收') : '无'}}</p>
    <table class="order-table" border="0" v-if="data.iccLogistics.logisticsId">
      <tr>
        <td class="label" colspan="1">状态</td>
        <td colspan="2">{{data.iccLogistics.logisticsState === 0 ? '等待发出' : data.iccLogistics.logisticsState === 1 ? '已发出' : '已接收'}}</td>
        <td class="label" colspan="1">物流公司</td>
        <td colspan="2">{{data.iccLogistics.logisticsName || '--'}}</td>
        <td colspan="1" class="label">物流运单号</td>
        <td colspan="2">{{data.iccLogistics.logisticsNo || '--'}}</td>
      </tr>
      <tr>
        <td class="label" colspan="1">备注</td>
        <td colspan="2">{{data.iccLogistics.logisticsRemark || '--'}}</td>
      </tr>
    </table>
    <el-steps direction="vertical" :active="getList().length - 1" space="80px" class="steps">
      <el-step :title="val.AcceptTime" :description="val.AcceptStation" v-for="(val, key) in getList()" :key="key"></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  name: 'admin-order-detail',
  props: {
    data: {
      type: Object,
      default() {
        return {
          iccLogistics: {},
          iccOrder: {},
          iccInvoice: {}
        }
      }
    }
  },
  methods: {
    getList() {
      if (this.data.iccLogistics && this.data.iccLogistics.logisticsContent) {
        try {
          return JSON.parse(this.data.iccLogistics.logisticsContent).Traces
        } catch (err) {
          return []
        }
      } else {
        return []
      }
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style scoped lang="scss">
  @import '../../../../common/style/variables';
  .order-table{
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border: 1px solid #d9d9d9;
    td{
      padding: 8px 10px;
      font-size: 14px;
      border-right: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
    }
    .label{
      text-align: center;
      color: $--color-label;
    }
  }
  .h1{
    font-size: 16px;
    padding: 0 0 15px 0;
  }
  .title{
    font-size: 14px;
    color: $--color-primary;
    padding: 10px 0;
  }
  .red{
    color: red;
  }
  .steps{
    margin: 20px 0 20px 20px;
  }
</style>
