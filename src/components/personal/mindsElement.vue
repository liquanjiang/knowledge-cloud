<template>
    <div>
        <div class="checkbox" v-show="manageFlag && (type === 'myCollect' || type === 'myClone')">
            <label>
                <input type="checkbox" v-on:click="chooseItem(item.id)">
            </label>
        </div>
        <a target="_blank">
            <div class="img-div">
                <img v-if="item.picPath" v-bind:src="urlPath + item.picPath" onerror="this.style.display = 'none'"/>
                <div class="img-mask" @click="ToModelDetail(item)">
                    <div class="mask-content">
                        <div class="icon-div">
                            <span class="icon-span" :class="transformClass(item.jzId)"></span>
                        </div>
                        <div class="label-underline"></div>
                        <label>{{ dealString(item.name ,15)}}</label>
                    </div>
                </div>
                <!-- 鼠标经过时，显示操作区域 -->
                <div class="operation-zone" v-if="allowEdit" @click="ToModelDetail(item)">
                    <!-- 查看图标 -->
                    <div class="eyes-zone"></div>
                    <!-- 查看次数 -->
                    <div class="check-zone" title="查看次数">{{item.viewTime || 0}}</div>
                    <!-- 编辑图标 -->
                    <div class="edit-zone" title="编辑" @click.stop="editM(item)"></div>
                    <!-- 删除图标 -->
                    <div class="delete-zone" title="删除" @click.stop="deleteM()"></div>
                </div>
                <!-- 鼠标经过时，显示操作区域 -->
                <div class="operation-zone" v-if="modelClass === 'clone' && !isOtherUser" @click="ToModelDetail(item)">
                    <!-- 删除图标 -->
                    <div class="delete-zone" title="删除" @click.stop="deleteClone()"></div>
                </div>
            </div>
        </a>
        <h4 class="model-title clearfix">
            <span class="model-class model-level float-left">
                <i :class="{'stars-focus': stars === '1', 'stars': stars === '0'}"
                   v-for="(stars, index) in item.modelLevel" v-bind:key="index"></i>
            </span>
            <span class="model-points float-right"><span></span>{{item.modelPoints}}</span>
        </h4>
        <p class="model-create clearfix" v-if="modelClass === 'publish'">
            <span>发布时间：</span>{{item.cjsj}}
        </p>
        <p class="model-create clearfix"
           v-if="modelClass === 'clone' || modelClass === 'fav' || modelClass === 'home'||modelClass === 'know'">
            <span>创建人：</span>{{item.cjr}}
        </p>
        <p class="model-create"
           v-if="modelClass === 'clone' || modelClass === 'fav' || modelClass === 'know' || modelClass === 'home' || modelClass === 'publish'">
            <span>所属区域：</span>{{item.townName}}
        </p>
        <p class="clearfix model-opera" v-if="!hideExec">
            <a target="_blank" class="pinglun" @click="goToModelDetail(item)">
                <b-button :id="'tip1' + item.id + ModelIndex" variant="outline-light" class="comment-btn">
                    <span></span>{{item.commentNum || 0}}
                </b-button>
                <div class="tips">评论
                    <div class="triangle"></div>
                </div>
            </a>
            <a>
                <b-button :id="'tip2' + item.id + ModelIndex" variant="outline-light"
                          :class="{'collect-btn': !(item.ilike === 1), 'liked-btn': item.ilike === 1}"
                          v-on:click="collectionModels(item)">
                    <span></span>{{item.collectionTime || 0}}
                </b-button>
                <div class="tips">{{item.ilike === 1 ? '取消' : '收藏'}}
                    <div class="triangle"></div>
                </div>
            </a>
            <a>
                <b-button :id="'tip3'+item.id + ModelIndex" variant="outline-light" class="clone-btn"
                          v-on:click="cloneModelTip(item)">
                    <span></span>{{item.clonedTimes || 0}}
                </b-button>
                <div class="tips">克隆
                    <div class="triangle"></div>
                </div>
            </a>
        </p>
    </div>
</template>

<script>
import apiService from '../../libs/apiService'

export default {
    name: 'minds-element',

    props: {
        manageFlag: Boolean,
        item: Object,
        ModelIndex: Number,
        allowEdit: Boolean,
        modelClass: String,
        hideExec: Boolean,
        isOtherUser: Boolean
    },
    data: function () {
        return {
            isProd: process.env.NODE_ENV === 'production',
            urlPath: process.env.NODE_ENV === 'production' ? window.location.origin + '/m2/' : 'http://10.4.106.5:7017/m2/'
        }
    },
    created () {
        // console.log(this.item)
    },
    methods: {
        // 跳转模型详情页
        ToModelDetail (item) {
            const isProd = process.env.NODE_ENV === 'production'
            const yhbh = item.yhbh
            const base = isProd ? window.location.origin : 'http://10.4.106.5:7017'
            const newAppUrl = base + this.$newAppUrl
            window.open(`${newAppUrl}/#/modelDetail/${item.id}/${yhbh}/`, '_blank')
        },
        // 跳转到模型详情页---评论
        goToModelDetail (item) {
            const isProd = process.env.NODE_ENV === 'production'
            const yhbh = item.yhbh
            const base = isProd ? window.location.origin : 'http://10.4.106.5:7017'
            const newAppUrl = base + this.$newAppUrl
            window.open(`${newAppUrl}/#/modelDetail/${item.id}/${yhbh}/1`, '_blank')
        },
        chooseItem () {

        },
        // 收藏模型
        collectionModels (item) {
            const that = this
            apiService.infoCount.collectAction({ taskId: item.id }).then(res => {
                if (item.ilike) {
                    item.ilike = 0
                    item.collectionTime = Number(item.collectionTime) - 1
                    that.$Util.showMessage('已取消收藏！', 'success')
                } else {
                    item.ilike = 1
                    item.collectionTime = Number(item.collectionTime) + 1
                    that.$Util.showMessage('已收藏！', 'success')
                }
                that.refreshList()
            })
        },
        // 克隆模型
        cloneModelTip (item) {
            const user = window.localStorage.getItem('userInfo')
            const userInfo = JSON.parse(decodeURIComponent(user))
            const that = this
            const model = item
            model.isPublic = '0'
            model.yhbh = userInfo.yhbh
            const points = model.modelPoints
            const str = `克隆该模型需要消耗 ${points} 积分，确定要克隆吗？`
            this.$Util.showConfirm(str, function () {
                apiService.infoCount.cloneAction(model).then(res => {
                    that.$Util.showMessage('克隆成功', 'success')
                }).catch(res => {
                    that.$Util.showMessage('克隆失败', 'error')
                })
            }, function () {

            })
        },
        // 模型删除功能---我的发布
        deleteM () {
            const obj = {
                item: this.item,
                index: this.ModelIndex
            }
            this.$emit('deleteModel', obj)
        },
        deleteClone () {
            const obj = {
                item: this.item,
                index: this.ModelIndex
            }
            this.$emit('deleteModel', obj)
        },
        // 我的发布-模型编辑
        editM (item) {
            this.$emit('editModel', item)
        },
        // 处理字符串过长的方法
        dealString (string, length) {
            return this.$Util.dealString(string, length)
        },
        // 向外传递消息，刷新列表，用于收藏和取消收藏
        refreshList () {
            this.$emit('refreshModelList', this.ModelIndex)
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
        width: 216px;
        height: 138px;
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
        background: rgba(0, 0, 0, 0.55);
    }

    .img-mask .mask-content {
        height: 100%;
        padding-top: calc(50% - 90px);
        color: #fff;
        font-size: 14px;
        font-family: MicrosoftYaHei;
    }

    .mask-content label {
        width: 143px;
        margin-top: 10px;
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
        margin-top: 9px;
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
        color: #333333;
        margin: 8px 0;
        text-align: left;
        padding: 0 5px;
    }

    .model-opera {
        text-align: center;
        width: 100%;
        margin: 0;
    }

    .model-opera button {
        display: inline-block;
        text-align: center;
        font-size: 12px;
        border: 1px solid #e5e9f2;
        border-radius: 3px;
        background-color: #f5f6fa;
        color: #666;
        height: 28px;
        width: 60px;
        margin: 8px 0 11px 0;
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
        position: relative;
        display: inline-block;
    }

    .model-opera a {
        position: relative;
    }

    .model-opera a div.tips {
        color: #fff;
        width: 60px;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        position: absolute;
        top: -40px;
        left: 10px;
        background: #000;
        border-radius: 3px;
        display: none;
    }

    .model-opera a.pinglun div.tips {
        left: 2px;
    }

    .model-opera a:hover div.tips {
        display: inline-block;
    }

    .model-opera a div.tips .triangle {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 0);
        width: 0;
        height: 0;
        border-top: 5px solid #000;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
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

    div.icon-div {
        width: 36px;
        height: 36px;
        margin: 10px auto 2px;
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
