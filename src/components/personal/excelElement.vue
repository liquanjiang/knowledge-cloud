<template>
    <div class="excel-element-zone">
        <!-- 图片及操作区域 -->
        <div class="img-div">
            <div class="bg-area"></div>
            <!-- 鼠标经过显示操作区域 -->
            <div class="operation-area">
                <!-- 查看图标 -->
                <div class="eyes-zone btn-zone" @click="seeDetails(item)"></div>
                <!-- 查看次数 -->
                <div class="check-zone btn-zone" title="查看次数">{{item.viewTime || 0}}</div>
                <!-- 编辑按钮 -->
                <div class="oper-btn  edit-btn" title="编辑" @click="editExcel()"></div>
                <!-- 删除按钮 -->
                <div class="oper-btn  del-btn" title="删除" @click="deleteExcel()"></div>
            </div>
            <!-- excel 内容和图标区域 -->
            <div class="excel-content">
                <div class="excel-icon"></div>
                <div class="excel-title">{{item.sourceName}}</div>
            </div>
        </div>
        <!-- 详情文字区域 -->
        <div class="text-area">
            <div class="upload-time">
                <span>资源名称：</span>
                <span>{{item.sourceName}}</span>
            </div>
            <div class="upload-time">
                <span>上传时间：</span>
                <span>{{item.createTime.substring(0,19)}}</span>
            </div>
            <div class="source-count">
                <span>资源总数：</span>
                <span>{{item.dataCount}}</span>
            </div>
        </div>
        <!-- 查看次数 -->
        <div class="btn-area">
            <div class="count-times">
                <span class="icon-span"></span>
                <span class="num-span">{{item.viewCount}}</span>
                <div class="tips">查看
                    <div class="triangle"></div>
                </div>
            </div>
            <div class="see-times">
                <span class="icon-span"></span>
                <span class="num-span">{{item.useCount}}</span>
                <div class="tips">执行
                    <div class="triangle"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'excelElement',
    data: function () {
        return {}
    },
    props: {
        item: Object,
        index: Number
    },
    methods: {
        // 编辑excel
        editExcel () {
            this.$emit('editExcel', this.item)
        },
        // 删除我的上传
        deleteExcel () {
            this.$emit('deleteExcel', { item: this.item, index: this.index })
        },
        seeDetails (item) {
            this.$emit('detailsMore', item)
        }
    },
    created () {

    }

}
</script>

<style scoped>
    .excel-element-zone {
        width: 100%;
        height: 100%;
    }

    .excel-element-zone .img-div {
        width: 212px;
        height: 120px;
        position: relative;
        background-repeat: no-repeat;
        background-color: #000;
        background-image: url("../../assets/personal/upload/excel-bg.png");
    }

    .excel-element-zone .img-div .bg-area {
        width: 212px;
        height: 120px;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.2);
        z-index: 4;
    }

    .excel-element-zone .img-div:hover .bg-area {
        /*display: none;*/
    }

    .excel-element-zone .img-div .operation-area {
        width: 212px;
        height: 120px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        display: none;
    }

    .excel-element-zone .img-div:hover .operation-area {
        display: block;
    }

    .oper-btn {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 10px;
        border-radius: 3px;
        cursor: pointer;
        color: #333;
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: 2px 2px;
    }

    .oper-btn.edit-btn {
        background-color: #f5f6fa;
        right: 40px;
        background-image: url("../../assets/personal/upload/edit-black.svg");
    }

    .oper-btn.del-btn {
        background-color: #ec414d;
        right: 10px;
        background-image: url("../../assets/personal/upload/delete-white.svg");
    }

    .excel-content {
        width: 212px;
        height: 120px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
    }

    .excel-content .excel-icon {
        width: 32px;
        height: 32px;
        top: 40px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background-repeat: no-repeat;
        background-size: 100%;
        background-image: url("../../assets/personal/upload/excel-1.svg");
    }

    .excel-content .excel-title {
        width: 140px;
        height: 40px;
        line-height: 18px;
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 70px;
        text-align: center;
    }

    .excel-element-zone .text-area {
        width: 212px;
        height: 80px;
        margin: 15px 0 5px 0;
    }

    .excel-element-zone .text-area div span {
        color: #333;
        font-size: 12px;
    }

    .excel-element-zone .btn-area {
        width: 212px;
        height: 30px;
        margin: 5px 0;
        cursor: pointer;
    }

    .excel-element-zone .btn-area .count-times, .excel-element-zone .btn-area .see-times {
        width: 70px;
        height: 28px;
        background: #f5f6fa;
        color: #333;
        border-radius: 3px;
        display: inline-block;
        margin-right: 20px;
        text-align: center;
        vertical-align: top;
        position: relative;
    }

    .excel-element-zone .btn-area div span {
        font-size: 12px;
        display: inline-block;
        height: 28px;
        line-height: 28px;
        vertical-align: top;
        cursor: pointer;
    }

    .excel-element-zone .btn-area div span.icon-span {
        width: 20px;
        height: 20px;
        margin-right: 1px;
        position: relative;
        top: 4px;
        left: -8px;
        background-repeat: no-repeat;
        background-size: 100%;
    }

    .excel-element-zone .btn-area div.count-times span.icon-span {
        background-image: url("../../assets/personal/upload/eye.svg");
        background-position: 0 2px;
        background-size: 80%;
    }

    .excel-element-zone .btn-area div.see-times span.icon-span {
        background-image: url("../../assets/personal/upload/exec-black.svg");
    }

    .img-div .operation-area div.btn-zone {
        height: 20px;
        border-radius: 3px;
        background-color: #f5f6fa;
        position: absolute;
        top: 8px;
        color: #333;
        font-size: 12px;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
    }

    .eyes-zone {
        width: 20px;
        left: 8px;
        background-image: url("../../assets/personal/upload/eye.svg");
        background-position: center;
        background-size: 60%;
        background-repeat: no-repeat;
    }

    .check-zone {
        width: 32px;
        left: 40px;
    }
</style>
