<template>
    <div class="my-home">
        <!-- 我的主页左侧区域 -->
        <div class="home-left">
            <!-- 我的信息区域 -->
            <div class="my-info box-shadow-radius">
                <div class="info-header">
                    <h4>我的信息</h4>
                    <div class="my-info-set" @click="toSetting(null)"></div>
                </div>
                <div class="info-body">
                    <div class="color-div">
                        <div class="color-span"></div>
                        <span class="num-span">75%</span>
                    </div>
                    <div class="info-body-area">
                        <span class="info-body-title">业务方向：</span>
                        <span class="info-body-text yhfx" @click="toSetting(user.ywfxName)"
                              :class="{'active' : !user.ywfxName}">
                            {{ user.ywfxName ? '已完善': '未完善'}}
                        </span>
                    </div>
                    <div class="info-body-area">
                        <span class="info-body-title">所属区域：</span>
                        <span class="info-body-text">{{user.area}}</span>
                    </div>
                    <div class="info-body-area">
                        <span class="info-body-title">所属单位：</span>
                        <span class="info-body-text">{{user.unit}}</span>
                    </div>
                </div>
            </div>
            <!-- 留言板区域 -->
            <div class="my-message box-shadow-radius my-info">
                <!-- 留言板头部区域 -->
                <div class="message-header info-header">
                    <h4>留言板</h4>
                    <div class="switch-btn" :class="{'closed': !message}" v-show="boardId">
                        <div class="open-btn" @click="closeMessageBoard()"
                             :class="{'closed': !message}"></div>
                        <div class="close-btn" @click="openMessageBoard()"
                             :class="{'open': message}"></div>
                    </div>
                </div>
                <!-- 留言板主体区域 -->
                <div class="message-body">
                    <div class="message-to-me">
                        <textarea placeholder="说点什么？" v-model="messageObj.text"
                                  @input="checkLength(messageObj.text)" :disabled="!message">
                        </textarea>
                        <span class="number-span">{{number}}</span>
                        <div class="message-btn" :class="{'opened': isOpen}" @click="saveMessage()">留言</div>
                    </div>
                    <!-- 留言板列表区域 -->
                    <div class="message-list-zone  window-scroll-bar">
                        <div class="center loading-div" v-if="messageList.loading">
                            <font-awesome-icon icon="spinner" pulse/>
                            Loading...
                        </div>
                        <ul>
                            <li v-for="(item, index) in messageList.list " :key="index">
                                <message
                                    @refreshList="refreshMessage"
                                    :messageObj="item"
                                    :userId="userInfo.yhbh"></message>
                            </li>
                        </ul>
                    </div>
                    <!-- 留言板分页区域-->
                    <div class="message-page" v-show="pageCount > pageSize">
                        <page v-if="showPage"
                              :showSize="false"
                              :pageSize="pageSize"
                              :pageIndex="pageNum"
                              @chosePage="chosePage"
                              :pageRowCount="pageCount"></page>
                    </div>
                </div>
            </div>
        </div>
        <!-- 我的主页右侧区域 -->
        <div class="home-right">
            <div class="header-zone box-shadow-radius">
                <!-- 头部区域 -->
                <div class="my-tips">
                    <h4>{{user.name}}</h4>
                    <span>，这里是你的【根据地】！</span>
                    <p>{{user.name}}，这里是你的【根据地】！ 是记录你的模网记忆，结交各路大神的地盘儿。现在开启您的建模之路!</p>
                </div>
                <!-- 个人区域 -->
                <div class="person-list">
                    <!-- 个人信息 -->
                    <div class="person-info  box-shadow-radius">
                        <div class="info-area-top">
                            <div class="img-div img-div1"></div>
                        </div>
                        <div class="info-area-center">做一个有“脸面”的人 上传头像，完善资料</div>
                        <div class="info-area-bottom info-btn" :class="{'full' : PersonInfo === true}"
                             @click="toSetting(null)">
                            {{ PersonInfo ? '完善个人资料' : '个人资料'}}
                        </div>
                    </div>
                    <!-- 发布模板 -->
                    <div class="person-model  box-shadow-radius">
                        <div class="info-area-top">
                            <div class="img-div img-div2"></div>
                        </div>
                        <div class="info-area-center">成为一位神级建模师， 请先发布您的第一个模型！</div>
                        <div class="info-area-bottom info-btn" :class="{'full' : PersonModel === true}"
                             @click="openWindow()">
                            {{ PersonModel ? '已完成' : '发布模型'}}
                        </div>
                    </div>
                    <!-- 打卡签到 -->
                    <div class="person-sign  box-shadow-radius">
                        <div class="info-area-top">
                            <div class="img-div img-div3"></div>
                        </div>
                        <div class="info-area-center">模网平台会员升级有奖励。 第一步，从打卡开始!</div>
                        <div class="info-area-bottom info-btn" :class="{'full' : PersonSign === true}"
                             @click="signIn()">
                            {{ PersonSign ? '已完成' : '打卡签到'}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="middle-zone  box-shadow-radius">
                <!-- 最新共享区域 -->
                <div class="last-share">
                    <div class="share-title">
                        <!--<div class="share-icon"></div>-->
                        <!--<h4>最新共享</h4>-->
                    </div>
                    <!-- 最新共享列表 -->
                    <div class="share-list-zone">
                        <share-list :hideMore='true' :fontSize="14" :fontColor="'#3F6BF4'"
                                    :eventType="0" :keyWord="'分享'" :platform="'模网平台'"
                                    :nameColor="'#333'"></share-list>
                    </div>
                </div>
            </div>
            <!--  我的发布区域 -->
            <div class="bottom-zone box-shadow-radius">
                <div class="bottom-zone-header">
                    <h4>我的发布</h4>
                    <div class="publish-btn" @click="openWindow()">发布模型</div>
                </div>
                <!-- 我的发布模型列表 -->
                <div class="my-publish-zone  personal-model-list-zone">
                    <div class="center loading-div" v-if="dataObj.itemsLoading">
                        <font-awesome-icon icon="spinner" pulse/>
                        Loading...
                    </div>
                    <nodata v-if="dataObj.items.length === 0 && !dataObj.itemsLoading"></nodata>
                    <ul class="model-lists" v-show="dataObj.items.length > 0">
                        <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                            <minds-element
                                v-bind:item="item"
                                :allowEdit="false"
                                :hideExec="true"
                                :modelClass="'publish'"
                                :ModelIndex="index"
                                v-bind:manage-flag="false">
                            </minds-element>
                        </li>
                    </ul>
                </div>
                <div class="more-btn-zone" v-if="dataObj.items.length > 0">
                    <div class="more-btn" @click="toMyPublish()">更多>></div>
                </div>
            </div>
        </div>
        <!-- 发布模型窗口 -->
        <b-modal v-model="modelWindow" size="xxl" id="publish" centered title="发布模型到知识分享">
            <public-model @closeWindow="closeWindow" v-on:publish="getLists"></public-model>
            <div slot="modal-footer"></div>
        </b-modal>
    </div>
</template>

<script>
import shareList from '../../components/knowledge/shareing'
import mindsElement from './mindsElement'
import message from './message/message'
import publicModel from './public-model'

export default {
    name: 'myhome',
    components: {
        shareList: shareList,
        mindsElement: mindsElement,
        message: message,
        publicModel: publicModel
    },
    props: {
        name: String,
        userInfo: Object
    },
    data: function () {
        return {
            user: {
                name: this.userInfo.yhxm,
                isFull: false,
                area: '',
                ywfxName: '',
                unit: ''
            },
            PersonInfo: true,
            PersonModel: false,
            PersonSign: false,
            shareList: [],
            dataObj: {
                itemsLoading: true,
                items: []
            },
            message: true,
            messageObj: {
                text: ''
            },
            boardId: null,
            messageList: {
                list: [],
                loading: true
            },
            showPage: true,
            pageSize: 5,
            pageNum: 1,
            pageCount: 0,
            modelWindow: false,
            urlPath: process.env.NODE_ENV === 'production' ? window.location.origin : 'http://10.4.106.5:7017',
            isOpen: false,
            number: 50
        }
    },
    mounted () {
        this.getLists()
        this.getUserInfo()
        this.queryBoardId()
    },
    methods: {
        // 获取个人信息
        getUserInfo () {
            const that = this
            const param = {
                yhbh: this.userInfo.yhbh
            }
            this.$apiService.personalCenter.getMyInfo(param).then(res => {
                that.user.area = res.townName
                that.user.ywfxName = res.ywfxName
                that.user.unit = res.dwmc
            }).catch(res => {

            })
        },
        // 获取我的发布列表数据
        getLists () {
            this.dataObj.itemsLoading = true
            const userInfo = this.userInfo
            const param = {
                'page': 0,
                'pageSize': 3,
                'taskName': '',
                'endTime': '',
                'startTime': '',
                taskType: '1',
                'userId': userInfo.yhbh,
                'loginId': userInfo.yhbh,
                yhbh: ''
            }
            this.dataObj.items = []
            this.$apiService.personalCenter.publishList(param).then(res => {
                this.dataObj.items = res.data
                this.dataObj.itemsLoading = false
            })
        },
        // 跳往我的发布
        toMyPublish () {
            this.$emit('toPublish')
        },
        // 查询我的留言板的ID
        queryBoardId () {
            const that = this
            const param = {
                'boardId': null,
                'boardStatus': null,
                'boardTime': null,
                'boardUserId': this.userInfo.yhbh
            }
            this.$apiService.message.queryBoardId(param).then(res => {
                if (res.data) {
                    this.boardId = res.data.boardId
                    this.message = res.data.boardStatus === 1
                    that.getMessageList(that.boardId)
                }
            })
        },
        // 获取留言板消息列表
        getMessageList (boardId) {
            const that = this
            const param1 = {
                pageNum: 1,
                pageSize: 5
            }
            const param = {
                'boardId': boardId,
                'pageNum': 1,
                'pageSize': 5
            }
            that.messageList.list = []
            that.messageList.loading = true
            this.$apiService.message.messageList(param, param1).then(res => {
                if (res.status === 0) {
                    that.messageList.list = res.data.list
                    that.pageCount = res.data.total
                    that.messageList.loading = false
                } else {
                    that.$util.showMessage(res.message, 'error')
                    that.messageList.loading = false
                }
            }).catch(res => {
                that.messageList.loading = false
            })
        },
        // 切换分页方法
        chosePage (params) {
            if (this.pageNum !== params.pageNum) {
                this.getMessageList(this.boardId)
            }
        },
        // 开启我的留言板
        openMessageBoard () {
            const that = this
            if (this.message === true) {
                return
            }
            const param = { boardId: this.boardId }
            this.$apiService.message.openBoard(param).then(res => {
                if (res.status === 0) {
                    this.message = true
                    that.$util.showMessage('开启留言板成功！', 'success')
                } else {
                    this.message = false
                    that.$util.showMessage('开启留言板失败！', 'error')
                }
            }).catch(res => {

            })
        },
        // 关闭我的留言板
        closeMessageBoard () {
            const that = this
            if (this.message === false) {
                return
            }
            const param = { boardId: this.boardId }
            this.$apiService.message.closeBoard(param).then(res => {
                if (res.status === 0) {
                    this.message = false
                    that.$util.showMessage('关闭留言板成功！', 'success')
                } else {
                    this.message = true
                    that.$util.showMessage('关闭留言板失败！', 'error')
                }
            }).catch(res => {

            })
        },
        // 刷新消息列表
        refreshMessage () {
            this.getMessageList(this.boardId)
        },
        // 跳转到个人信息设置
        toSetting (item) {
            if (!item) {
                window.location.href = this.urlPath + this.$newAppUrl + '/#/preferences/index'
            }
        },
        // 跳转到到发布模型页
        toKnow () {
            this.$router.push('/knowledge')
        },
        // 打开发布模型弹窗
        openWindow () {
            this.modelWindow = true
        },
        // 关闭窗口
        closeWindow () {
            this.modelWindow = false
        },
        // 检查输入内容的长度
        checkLength (text) {
            if (!text) {
                this.number = 50
                this.isOpen = false
            } else {
                this.number = 50 - text.length
                this.isOpen = true
            }
        },
        // 给自己留言
        saveMessage () {
            const that = this
            if (!this.message) { // 如果留言板关闭，则不能留言
                return
            }
            if (!this.isOpen) {
                return
            }
            const user = window.localStorage.getItem('userInfo')
            const userInfo = JSON.parse(decodeURIComponent(user))
            const text = this.messageObj.text
            if (!text) {
                this.$util.showMessage('请输入留言内容!', 'warning')
                return
            } else if (text.length > 50) {
                this.$util.showMessage('留言内容不能超过50个字符!', 'warning')
                return
            }
            const param = {
                'boardId': this.boardId,
                'messageContext': text,
                'messageId': null,
                'messageStatus': null,
                'messageTime': '',
                'messageToUserId': userInfo.yhbh,
                'messageToUserName': userInfo.yhxm,
                'messageUserId': userInfo.yhbh,
                'messageUserName': userInfo.yhxm
            }
            this.$apiService.message.addMessage(param).then(res => {
                if (res.status === 0) {
                    that.$util.showMessage('留言成功！', 'success')
                    that.getMessageList(that.boardId)
                    that.clearBoard()
                } else {
                    that.$util.showMessage('留言失败！' + res.message, 'error')
                }
            }).catch(res => {
                that.$util.showMessage('留言失败！' + res, 'error')
            })
        },
        // 重置留言板
        clearBoard () {
            this.messageObj.text = ''
            this.number = 50
            this.isOpen = false
        },
        // 点击进行打卡签到
        signIn () {
            this.$store.dispatch('signIn')
        }
    }

}
</script>

<style scoped>
    .my-home {
        width: 100%;
        height: 1400px;
        position: relative;
    }

    .home-left {
        width: 310px;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
    }

    .home-right {
        width: 900px;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
    }

    .home-right .header-zone {
        height: 480px;
        width: 100%;
    }

    .home-right .middle-zone {
        height: 480px;
        width: 100%;
        padding-left: 20px;
        margin-top: 10px;
    }

    .home-left .my-info {
        width: 100%;
        height: 230px;
    }

    .home-left .my-info .info-header {
        height: 50px;
        border-bottom: 1px solid #ededed;
        width: 100%;
        position: relative;
    }

    .home-left .my-info .info-header h4 {
        font-size: 16px;
        color: #333;
        width: 100px;
        height: 50px;
        line-height: 50px;
        margin: 0 0 0 20px;
        padding: 0;
        text-align: left;
    }

    .home-left .my-info .info-header .my-info-set {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        background: url("../../assets/personal/home/setting.svg") no-repeat;
        background-size: 100% 100%;
    }

    .home-left .my-info .info-body {
        padding-left: 20px;
        margin-top: 20px;
        font-size: 12px;
        text-align: left;
        color: #333;
    }

    .color-div {
        width: 220px;
        height: 12px;
        background: #d4ddf3;
        position: relative;
    }

    .color-div .color-span {
        width: 165px;
        height: 12px;
        position: absolute;
        left: 0;
        top: 0;
        background: #4d83ff;
    }

    .color-div .num-span {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        color: #3f6bf4;
        font-size: 12px;
        position: absolute;
        right: -50px;
        top: -5px;
    }

    .info-body-area {
        margin: 20px 0;
    }

    .info-body-area span {
        display: inline-block;
    }

    .info-body-area .info-body-title {
        width: 80px;
        text-align: left;
    }

    .info-body-area .yhfx {
        color: #5cc85c;
        cursor: pointer
    }

    .info-body-area .yhfx.active {
        color: #fd7904;
    }

    .home-left .my-message {
        width: 100%;
        margin-top: 10px;
        height: calc(100% - 240px);
    }

    .my-tips {
        width: 100%;
        position: relative;
        text-align: center;
        margin: 30px 0 20px;
        padding-left: 40px;
    }

    .my-tips h4, .my-tips span {
        display: inline-block;
        vertical-align: top;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .my-tips h4 {
        color: #3c64e0;
        font-size: 14px;
        font-weight: 600;
    }

    .my-tips span {
        color: #333;
        font-size: 12px;
    }

    .my-tips p {
        color: #333;
        font-size: 12px;
        margin: 0;
        padding: 0;
    }

    .person-list {
        width: 100%;
        height: 380px;
        margin: 0 auto 20px;
        text-align: left;
    }

    .person-list > div {
        width: 280px;
        height: 350px;
        display: inline-block;
        margin-left: 10px;
        transition-duration: .5s;
        position: relative;
    }

    .person-list > div:hover {
        transform: translate(0, -5px);
    }

    .person-list > div.person-info {
        margin-left: 20px;
    }

    .info-area-top {
        width: 100%;
        height: 180px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .info-area-top .img-div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-repeat: no-repeat;
        background-size: 100%;
    }

    .info-area-top .img-div1 {
        width: 130px;
        height: 111px;
        background-image: url("../../assets/personal/home/person.png");
    }

    .info-area-top .img-div2 {
        width: 140px;
        height: 102px;
        background-image: url("../../assets/personal/home/model.png");
    }

    .info-area-top .img-div3 {
        width: 141px;
        height: 108px;
        background-image: url("../../assets/personal/home/user.png");
    }

    .info-area-center {
        width: 170px;
        height: 40px;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        position: absolute;
        color: #333;
        left: 50%;
        bottom: 110px;
        transform: translateX(-50%);
    }

    .info-area-bottom {
        width: 240px;
        height: 42px;
        background: linear-gradient(90deg, rgba(72, 205, 184, 1), rgba(63, 191, 96, 1));
        border-radius: 3px;
        position: absolute;
        bottom: 40px;
        left: 25px;
        color: #fff;
        line-height: 42px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
    }

    .info-area-bottom.full {
        background: linear-gradient(90deg, rgba(254, 182, 140, 1), rgba(234, 75, 78, 1));
    }

    .last-share {
        width: 100%;
        height: 500px;
    }

    .last-share .share-title {
        height: 10px;
        width: 100%;
        position: relative;
        margin: 10px 0;
    }

    .last-share .share-title .share-icon {
        width: 20px;
        height: 20px;
        position: absolute;
        left: 5px;
        top: 5px;
        background: url("../../assets/personal/share/share.svg") no-repeat;
        background-size: 100% 100%;
    }

    .last-share .share-title h4 {
        font-size: 16px;
        color: #333;
        text-align: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        position: absolute;
        left: 30px;
        top: 0;
        font-weight: 600;
    }

    .share-list-zone {
        width: 100%;
        height: 450px;
    }

    .bottom-zone {
        height: 420px;
        width: 100%;
        padding-left: 20px;
        margin-top: 10px;
    }

    .bottom-zone-header {
        position: relative;
        margin-top: 20px;
        height: 30px;
    }

    .bottom-zone-header h4 {
        color: #333;
        width: 100px;
        font-size: 16px;
        text-align: left;
        height: 30px;
        line-height: 30px;
    }

    .publish-btn {
        width: 110px;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        background-color: #3f6bf4;
        background-image: url("../../assets/personal/public/public.svg");
        background-size: 20px 16px;
        background-repeat: no-repeat;
        background-position: 15px 8px;
        color: #fff;
        position: absolute;
        text-align: center;
        right: 10px;
        top: 0;
        font-size: 12px;
        text-indent: 15px;
        cursor: pointer;
    }

    .my-publish-zone {
        height: 300px;
        position: relative;
    }

    .more-btn-zone {
        height: 50px;
    }

    .more-btn-zone .more-btn {
        height: 30px;
        width: 100px;
        border-radius: 15px;
        border: 1px solid #e6e6e6;
        line-height: 30px;
        text-align: center;
        color: #808080;
        font-size: 12px;
        margin: 10px auto;
        cursor: pointer;
    }

    .personal-model-list-zone ul.model-lists {
        margin: 0;
        padding: 0;
        text-align: left;
        height: calc(100%);
        position: relative;
    }

    .model-lists li {
        width: 234px;
        margin-right: 10px;
        background-color: #ffffff;
        border: solid 1px #e4ebf3;
        float: left;
        margin-top: 10px;
        padding: 10px;
        position: relative;
        -webkit-box-shadow: 3px 0 3px #e9eef3;
        -moz-box-shadow: 3px 0 3px #e9eef3;
        transition-property: top;
        transition-duration: 0s;
        transition-timing-function: linear;
        transition-delay: 0s;
        box-shadow: 0 4px 3px 0 rgba(225, 232, 239, 0.75)
    }

    .model-lists li:hover {
        box-shadow: 3px 0 8px #bfbfbf;
        -webkit-box-shadow: 3px 0 8px #bfbfbf;
        -moz-box-shadow: 3px 0 8px #bfbfbf;
        top: -5px;
    }

    .switch-btn {
        width: 30px;
        height: 16px;
        border-radius: 11px;
        background: #4075FC;
        position: absolute;
        right: 20px;
        top: 15px;
        cursor: pointer;
    }

    .switch-btn.closed {
        background: #dedede;
    }

    .switch-btn .open-btn {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        position: absolute;
        left: 1px;
        top: 1px;
    }

    .switch-btn .close-btn {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        position: absolute;
        right: 1px;
        top: 1px;
    }

    .switch-btn .close-btn.open {
        background: #fff;
    }

    .switch-btn .open-btn.closed {
        background: #fff;
    }

    .message-body {
        padding: 10px;
    }

    .message-body .message-to-me {
        position: relative;
    }

    .message-body .message-to-me textarea {
        width: 290px;
        height: 150px;
        padding: 5px;
        font-size: 12px;
        border: 1px solid #e5e9f2;
        border-radius: 3px;
        resize: none;
        background: #f2f1f1;
        color: #4075fc;
    }

    .message-body .message-to-me textarea:focus {
        border-radius: 3px;
        outline: none;
        box-shadow: none;
        background: #fff;
        color: #1e58e9;
    }

    .message-body .message-to-me .message-btn {
        width: 290px;
        height: 40px;
        line-height: 40px;
        background: rgba(242, 242, 242, 1);
        color: #b2b2b2;
        text-align: center;
        border-radius: 4px;
        font-size: 14px;
        cursor: not-allowed;
    }

    .message-body .message-to-me .message-btn.opened {
        background: #3f6bf4;
        color: #fff;
        cursor: pointer;
    }

    .message-body .message-list-zone {
        margin-top: 30px;
        position: relative;
        max-height: 830px;
        overflow-y: auto;
    }

    .message-body .message-list-zone ul {
        margin: 0;
        padding: 0;
        width: 282px;
    }

    .message-body .message-list-zone ul li {
        width: 100%;
        margin: 10px 0;
        padding: 0;
    }

    .number-span {
        color: #B3B3B3;
        font-size: 12px;
        position: absolute;
        bottom: 50px;
        right: 10px;
    }

    .message-page {
        border-top: 1px solid #dedede;
    }
</style>
