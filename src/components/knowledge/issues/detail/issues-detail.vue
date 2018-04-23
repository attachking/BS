<template>
  <div class="issues-detail">
    <h2 class="tit">{{ data.knowledgeHead }}</h2>
    <div class="sub-tit">
      <p>
        <span>
          <i class="el-icon-time"></i>
          {{data.knowledgeCreatetime || 0}}
        </span>
        &nbsp;&nbsp;&nbsp;
        <span>
          <i class="el-icon-view"></i>
          {{data.knowledgeClicks || 0}}
        </span>
      </p>
    </div>
    <div class="card">
      <div class="card-tit">
        <span>关键字</span>
      </div>
      <div class="card-con">{{data.knowledgeKeyword}}</div>
    </div>
    <div class="card">
      <div class="card-tit">
        <span>问题类别</span>
      </div>
      <div class="card-con">{{data.parameterOption}}</div>
    </div>
    <div class="card">
      <div class="card-tit">
        <span>问题描述</span>
      </div>
      <div class="card-con">
        <p>{{data.knowledgeDesc}}</p>
      </div>
    </div>
    <div class="card">
      <div class="card-tit">
        <span>解决方法</span>
      </div>
      <div class="card-con">{{data.knowledgeMethod}}</div>
    </div>
    <div class="card">
      <div class="card-tit">
        <span>附件</span>
      </div>
      <div class="card-con file-box">
        <div class="file-item" v-for="val in files" :key="val.url">
          <img :src="val.url" alt="" v-if="val.type === 1" v-img="val.url">
          <a :href="val.url" target="_blank" v-if="val.type === 2">
            <el-button size="mini" icon="el-icon-document" class="download-file">{{val.name}}</el-button>
          </a>
        </div>
      </div>
    </div>
    <!--<el-form label-position="left" class="table-expand">
      <el-form-item label="标题:">
        <span>{{ data.knowledgeHead }}</span>
      </el-form-item>
      <el-form-item label="创建时间:">
        <span>{{ data.knowledgeCreatetime }}</span>
      </el-form-item>
      <el-form-item label="关键字:">
        <span>{{ data.knowledgeKeyword }}</span>
      </el-form-item>
      <el-form-item label="问题类型:">
        <span>{{ data.parameterOption }}</span>
      </el-form-item>
      <el-form-item label="解决方法:">
        <span>{{ data.knowledgeMethod}}</span>
      </el-form-item>
      <el-form-item label="附件:">
        <a :href="val.deviceFileUrl" v-for="(val, key) in files" :key="key">
          <el-button size="mini" icon="el-icon-document" class="download-file">{{val.deviceFileName}}</el-button>
        </a>
      </el-form-item>
    </el-form>-->
  </div>
</template>
<script>
export default {
  name: 'issues-detail',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    files: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
  @import "../../../../common/style/variables";

  .issues-detail{
    padding: 10px 50px;
    .table-expand{
      .el-form-item__label{
        color: $--color-label;
      }
    }
    .download-file{
      margin: 0 10px;
    }
    .tit{
      text-align: center;
    }
    .sub-tit{
      text-align: center;
      color: #666;
      font-size: 14px;
      padding-top: 20px;
    }
    .card{
      padding: 10px 0;
      .card-tit{
        border-bottom: 1px solid #f3f3f3;
        font-size: 16px;
        span{
          display: inline-block;
          padding: 8px 10px;
          border-left: 5px solid $--color-primary;
        }
      }
      .card-con{
        padding: 10px;
        font-size: 14px;
        color:#333;
        line-height: 30px;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
    .file-box{
      display: flex;
      align-items: center;
      .file-item{
        padding: 10px 10px;
        img{
          width: 100px;
        }
      }
    }
  }
</style>
