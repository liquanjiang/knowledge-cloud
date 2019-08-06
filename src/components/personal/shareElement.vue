<template>
    <div>
        <div class="checkbox" v-show="manageFlag && (type === 'myCollect' || type === 'myClone')">
            <label>
                <input type="checkbox" v-on:click="chooseItem(item.id)">
            </label>
        </div>
        <div class="img-div">
            <img v-if="item.sharePic" v-bind:src="urlPath + item.sharePic" onerror="this.style.display = 'none'"/>
            <div class="img-mask">
                <div class="mask-content" :title="item.shareName">
                    <div class="icon-div">
                        <span class="icon-span" :class="transformClass(item.jzId)"></span>
                    </div>
                    <div class="label-underline"></div>
                    <label>{{ dealString(item.shareName, 15)}}</label>
                </div>
            </div>
            <!-- 鼠标经过时，显示操作区域 -->
            <div class="operation-zone" @click="toModelCompare(item)">
                <!-- 编辑图标 -->
                <div class="edit-zone" title="编辑" @click.stop="editShare(item)"></div>
                <!-- 删除图标 -->
                <div class="delete-zone" title="取消共享" @click.stop="cancelShare(item)"></div>
            </div>
        </div>
        <h4 class="model-title clearfix">
        </h4>
        <p class="model-create clearfix model-name" :title="item.shareName" @click="toModelCompare(item)">
            <span>模型名称：</span>{{dealString(item.shareName, 12)}}
        </p>
        <p class="model-create clearfix">
            <span>共享时间：</span>{{dealTime(item.createTime)}}
        </p>
        <p class="model-create"><span>共享方式：</span>{{changeType(item.shareType, item.shareDeptName)}}</p>
        <div class="clearfix model-opera excel-element-zone">
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
                    <span class="num-span">{{item.useCount ? item.useCount : 0}}</span>
                    <div class="tips">执行
                        <div class="triangle"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'minds-element',
    data: function () {
        return {
            urlPath: process.env.NODE_ENV === 'production' ? window.location.origin + '/m2' : 'http://10.4.106.5:7017/m2'
        }
    },
    props: {
        manageFlag: Boolean,
        item: Object,
        ModelIndex: Number
    },
    methods: {
        changeType (str, str2) {
            if (!str) {
                return ''
            } else if (str === '0') {
                return '公开分享'
            } else if (str === '1') {
                const string = '定向分享-' + (str2 || '')
                return this.dealString(string, 14)
            }
        },
        // 处理字符串过长的方法
        dealString (string, length) {
            return this.$Util.dealString(string, length)
        },
        // 编辑共享
        editShare (item) {
            this.$emit('editShareModel', item)
        },
        // 取消共享
        cancelShare (obj) {
            this.$emit('cancelShareModel', { item: this.item, index: this.ModelIndex })
        },
        // 截取时间
        dealTime (str) {
            if (!str) {
                return ''
            } else if (str.includes('.')) {
                return str.substring(0, 16)
            } else {
                return str.substring(0, 16)
            }
        },
        toModelCompare (item) {
            const isProd = process.env.NODE_ENV === 'production'
            const base = isProd ? window.location.origin : 'http://10.4.138.221:7017'
            const appUrl = this.$newAppUrl
            const url = '/#/compare/'
            const pathUrl = `${base}${appUrl}${url}${item.taskId}/${item.resultId}`
            window.open(pathUrl, '_blank')
        },
        // 根据警察类型返回Class
        transformClass (jzId) {
            if (!jzId) {
                return 'other'
            }
            const num = parseInt(jzId)
            switch (num) {
                case 1 :
                    return 'za'
                case 2:
                    return 'hj'
                case 3:
                    return 'xz'
                case 4:
                    return 'jt'
                case 5 :
                    return 'xl'
                case 6:
                    return 'wj'
                case 7:
                    return 'jd'
                case 8:
                    return 'jw'
                case 9:
                    return 'js'
                case 10:
                    return 'kj'
                case 11:
                    return 'fy'
                case 12:
                    return 'jz'
                case 99 :
                    return 'other'
            }
        }
    }
}
</script>

<style scoped>
    .img-div {
        width: 212px;
        height: 120px;
        background: url("../../assets/minds/model.png") no-repeat center center #e8f1fb;
        border: solid 1px #e6e6e6;
        text-align: center;
        position: relative;
        cursor: pointer;
    }

    .img-div img {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
    }

    .img-div .img-mask {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 1);
        opacity: 0.5;
    }

    .img-mask .mask-content {
        height: 100%;
        padding-top: calc(50% - 90px);
        color: #fff;
        font-size: 14px;
        font-family: MicrosoftYaHei, serif;
    }

    .mask-content label {
        width: 143px;
        margin-top: 10px;
        font-size: 12px;
        line-height: 18px;
    }

    .mask-content i {
        font-size: 21px;
        width: 10px;
    }

    .mask-content .label-underline {
        width: 10px;
        height: 1px;
        background: rgba(255, 255, 255, 1);
        border-radius: 1px;
        margin: 7px auto 0;
    }

    .model-title {
        margin-top: 10px;
    }

    .model-lists h4.model-title {
        padding: 0 5px;
    }

    .model-title a {
        font-size: 14px;
        color: #333333;
    }

    .about-hee-list.model-lists li:nth-child(4n) {
        margin-right: 0;
    }

    .model-detail a {
        color: #1a1a1a;
        font-size: 12px;
    }

    .model-create {
        font-size: 12px;
        color: #333;
        margin: 8px 0;
        text-align: left;
        padding: 0 5px 0 0;
    }

    .model-create.model-name {
        cursor: pointer;
    }

    .model-create.model-name:hover {
        color: #3f6bf4;
        text-decoration: underline;
    }

    .model-create.model-name:hover span {
        color: #333;
        text-decoration: none;
    }

    .model-opera {
        text-align: center;
        width: 100%;
        margin-top: 30px;
    }

    .model-opera button {
        display: inline-block;
        text-align: center;
        font-size: 12px;
        border: 1px solid #e5e9f2;
        border-radius: 3px;
        background-color: #f5f6fa;
        color: #666;
        height: 32px;
        width: 60px;
        margin: 18px 0 11px 0;
        padding: 0;
        font-family: MicrosoftYaHei, serif;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }

    .model-opera .clone-btn, .model-opera .collect-btn, .model-opera .liked-btn {
        margin-left: 11px;
    }

    .model-opera button:hover {
        border: 1px solid #3f6bf4;
        color: #3f6bf4;
        background-color: #ffffff
    }

    .model-opera button span {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 7px;
        vertical-align: -6px;
    }

    .model-opera .comment-btn a {
        color: #666;
        text-decoration: none;
    }

    .model-opera .comment-btn:hover a {
        color: #3f6bf4;
    }

    .comment-btn span {
        background: url("../../assets/minds/comment.png") no-repeat;
    }

    .comment-btn:hover span {
        background: url("../../assets/minds/comment-active.png") no-repeat;
    }

    .collect-btn span {
        background: url("../../assets/minds/collect.png") no-repeat;
    }

    .collect-btn:hover span {
        background: url("../../assets/minds/collect-active.png") no-repeat;
    }

    .liked-btn span {
        background: url("../../assets/minds/liked.png") no-repeat;
    }

    .clone-btn span {
        background: url("../../assets/minds/download.png") no-repeat;
    }

    .clone-btn:hover span {
        background: url("../../assets/minds/download-active.png") no-repeat;
    }

    .model-lists li .checkbox {
        position: absolute;
        top: -10px;
        left: 5px;
    }

    .model-points {
        font-size: 14px;
        color: #666;
        margin: 5px 5px 0 0;
    }

    .model-points span {
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: -2px;
        margin-right: 10px;
        background: url("../../assets/minds/integral.png") no-repeat;
    }

    .model-detail span, .model-create span {
        color: #808080;
        min-width: 60px;
        display: inline-block;
    }

    .model-level .stars {
        display: inline-block;
        height: 17px;
        width: 17px;
        margin-right: 4px;
        background: url("../../assets/minds/score-gray.png") no-repeat;
    }

    .model-level .stars-focus {
        display: inline-block;
        height: 17px;
        width: 17px;
        margin-right: 4px;
        background: url("../../assets/minds/score-red.png") no-repeat;
    }

    .img-div .operation-zone {
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0.85;
        background: rgba(255, 255, 255, 0.15);
        top: 0;
        left: 0;
        display: none;
    }

    .img-div:hover .operation-zone {
        display: block;
    }

    .img-div .operation-zone div {
        height: 20px;
        border-radius: 3px;
        background: #f5f6fa;
        position: absolute;
        top: 8px;
        color: #333;
        font-size: 12px;
        text-align: center;
        line-height: 20px;
    }

    .img-div .operation-zone .eyes-zone {
        width: 20px;
        left: 8px;
        background-image: url("../../assets/personal/upload/eye.svg");
        background-position: center;
        background-size: 60%;
        background-repeat: no-repeat;
    }

    .img-div .operation-zone .check-zone {
        width: 32px;
        left: 40px;
    }

    .img-div .operation-zone .edit-zone {
        width: 20px;
        right: 40px;
        background-image: url("../../assets/personal/upload/edit-black.svg");
        background-position: center;
        background-size: 60%;
        background-repeat: no-repeat;
    }

    .img-div .operation-zone .delete-zone {
        width: 20px;
        right: 8px;
        background-color: #ec414d;
        background-image: url("../../assets/personal/upload/delete.svg");
        background-position: center;
        background-size: 80%;
        background-repeat: no-repeat;
    }

    .excel-element-zone .btn-area {
        width: 212px;
        text-align: left;
        padding-left: 0;
    }

    .excel-element-zone .btn-area .see-times, .excel-element-zone .btn-area .count-times {
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
        margin-right: 5px;
        position: relative;
        top: 4px;
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

    div.icon-div {
        width: 36px;
        height: 36px;
        margin: 10px auto 2px;
        background: #000;
    }

    div.icon-div span.icon-span {
        display: inline-block;
        width: 36px;
        height: 36px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    div.icon-div span.icon-span.za {
        background-image: url('../../assets/police/1.svg')
    }

    div.icon-div span.icon-span.hj {
        background-image: url('../../assets/police/2.svg')
    }

    div.icon-div span.icon-span.xz {
        background-image: url('../../assets/police/3.svg')
    }

    div.icon-div span.icon-span.jt {
        background-image: url('../../assets/police/4.svg')
    }

    div.icon-div span.icon-span.xl {
        background-image: url('../../assets/police/5.svg')
    }

    div.icon-div span.icon-span.ws {
        background-image: url('../../assets/police/6.svg')
    }

    div.icon-div span.icon-span.wj {
        background-image: url('../../assets/police/7.svg')
    }

    div.icon-div span.icon-span.jd {
        background-image: url('../../assets/police/8.svg')
    }

    div.icon-div span.icon-span.jw {
        background-image: url('../../assets/police/9.svg')
    }

    div.icon-div span.icon-span.js {
        background-image: url('../../assets/police/10.svg')
    }

    div.icon-div span.icon-span.kj {
        background-image: url('../../assets/police/11.svg')
    }

    div.icon-div span.icon-span.fy {
        background-image: url('../../assets/police/12.svg')
    }

    div.icon-div span.icon-span.jz {
        background-image: url('../../assets/police/13.svg')
    }

    div.icon-div span.icon-span.other {
        background-image: url('../../assets/police/99.svg')
    }

</style>
