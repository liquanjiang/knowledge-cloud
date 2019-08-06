<template>
    <div class="my-home">
        <!-- 我的主页左侧区域 -->
        <div class="home-left">
            <!-- 我的信息区域 -->
            <div class="my-info box-shadow-radius">
                <div class="info-header">
                    <h4>Ta的信息</h4>
                    <!--<div class="my-info-set"></div>-->
                </div>
                <div class="info-body">
                    <div class="color-div">
                        <div class="color-span"></div>
                        <span class="num-span">75%</span>
                    </div>
                    <div class="info-body-area">
                        <span class="info-body-title">业务方向：</span>
                        <span class="info-body-text yhfx"
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
                        <div class="open-btn"
                             :class="{'closed': !message}"></div>
                        <div class="close-btn"
                             :class="{'open': message}"></div>
                    </div>
                </div>
                <!-- 留言板主体区域 -->
                <div class="message-body">
                    <div class="message-to-me">
                        <textarea placeholder="说点什么？" v-model="messageObj.text"
                                  @input="checkLength(messageObj.text)"
                                  :disabled="!message">
                        </textarea>
                        <span class="number-span">{{number}}</span>
                        <div class="message-btn" @click="saveMessage()"
                             :class="{ 'opened': isOpen === true }">
                            给Ta留言
                        </div>
                    </div>
                    <!-- 留言板列表区域 -->
                    <div class="message-list-zone  window-scroll-bar">
                        <div class="center loading-div" v-if="messageList.loading">
                            <font-awesome-icon icon="spinner" pulse/>
                            Loading...
                        </div>
                        <ul>
                            <li v-for="(item, index) in messageList.list " :key="index">
                                <message :messageObj="item"
                                         @refreshList="refreshMessage"
                                         :userId="myUserId"
                                         :otherUserId="userInfo.yhbh"></message>
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
                <div class="btns-area">
                    <ul>
                        <li v-for="(item ,index) in execList" :key="index"
                            @click="jumpTo(item)">
                            <div class="img-div" :style="{ 'width': item.width , 'height': item.height}"></div>
                            <div class="text-div">{{item.name}}</div>
                        </li>
                    </ul>
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
                                    :eventType="0" :keyWord="'分享'" :platform="'模网平台'" :userId="userInfo.yhbh"
                                    :nameColor="'#333'"></share-list>
                    </div>
                </div>
            </div>
            <!--  Ta的发布区域 -->
            <div class="bottom-zone box-shadow-radius">
                <div class="bottom-zone-header">
                    <h4>Ta的发布模型</h4>
                    <!--<div class="publish-btn" @click="openWindow()">发布模型</div>-->
                </div>
                <!-- Ta的发布模型列表 -->
                <div class="my-publish-zone  personal-model-list-zone">
                    <div class="center loading-div" v-if="dataObj.itemsLoading">
                        <font-awesome-icon icon="spinner" pulse/>
                        Loading...
                    </div>
                    <nodata v-if="dataObj.items.length === 0 && !dataObj.itemsLoading"></nodata>
                    <ul class="model-lists" v-show="dataObj.items.length > 0 && !dataObj.itemsLoading">
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
                <div class="more-btn-zone" v-show="dataObj.items.length > 0 && !dataObj.itemsLoading">
                    <div class="more-btn" @click="toMyPublish()">更多>></div>
                </div>
            </div>

            <!--  Ta的克隆区域 -->
            <div class="bottom-zone box-shadow-radius">
                <div class="bottom-zone-header">
                    <h4>Ta的克隆模型</h4>
                </div>
                <!-- Ta的克隆模型列表 -->
                <div class="my-publish-zone  personal-model-list-zone">
                    <div class="center loading-div" v-if="cloneObj.itemsLoading">
                        <font-awesome-icon icon="spinner" pulse/>
                        Loading...
                    </div>
                    <nodata v-if="cloneObj.items.length === 0 && !cloneObj.itemsLoading"></nodata>
                    <ul class="model-lists">
                        <li v-for="(item, index) in cloneObj.items" v-bind:key="index">
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
                <div class="more-btn-zone" v-if="cloneObj.items.length > 0 && !cloneObj.itemsLoading">
                    <div class="more-btn" @click="toMyClone()">更多>></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import shareList from '../../components/knowledge/shareing'
import mindsElement from '../personal/mindsElement'
import message from '../personal/message/message'

export default {
    name: 'home',
    components: {
        shareList: shareList,
        mindsElement: mindsElement,
        message: message
    },
    props: {
        name: String,
        userInfo: Object
    },
    data: function () {
        return {
            user: {
                name: '',
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
            cloneObj: {
                itemsLoading: false,
                items: []
            },
            message: false,
            boardId: null,
            execList: [
                { name: '发布模型', url: '/knowledge', width: '55px', height: '55px' },
                { name: '共享模型', url: '/model', width: '55px', height: '54px' },
                { name: '克隆模型', url: '/knowledge', width: '57px', height: '51px' },
                { name: '收藏模型', url: '/knowledge', width: '55px', height: '58px' },
                { name: '添加评论', url: '/knowledge', width: '64px', height: '55px' }
            ],
            activeIndex: 0,
            interval: null,
            messageObj: {
                text: ''
            },
            messageList: {
                list: [],
                loading: false
            },
            number: 50,
            myUserId: null,
            showPage: true,
            pageSize: 5,
            pageNum: 1,
            pageCount: 0,
            isOpen: false
        }
    },
    created () {
        const user = window.localStorage.getItem('userInfo')
        const userInfo = JSON.parse(decodeURIComponent(user))
        this.myUserId = userInfo.yhbh
    },
    mounted () {
        this.getLists()
        this.getUserInfo()
        this.queryBoardId()
        this.getCloneLists()
        const that = this
        this.interval = window.setInterval(function () {
            if (that.activeIndex < 4) {
                that.activeIndex += 1
            } else {
                that.activeIndex = 0
            }
        }, 5000)
    },
    watch: {
        userInfo: { // 深度监听，可监听到对象、数组的变化
            handler (newV, oldV) {
                // do something, 可使用this
                this.getLists()
                this.getUserInfo()
                this.queryBoardId()
                this.getCloneLists()
                document.body.scrollTop = 0
            },
            deep: true
        }
    },
    destroyed () {
        window.clearInterval(this.interval)
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
        // 获取我的克隆列表数据
        getCloneLists () {
            this.dataObj.itemsLoading = true
            const userInfo = this.userInfo
            const param = {
                cloneFlag: 1,
                'page': 1,
                'pageSize': 3,
                'taskName': '',
                'endTime': '',
                'startTime': '',
                'yhbh': '',
                'userId': userInfo.yhbh
            }
            this.dataObj.items = []
            this.$apiService.personalCenter.cloneList(param).then(res => {
                this.cloneObj.items = res.list
                this.cloneObj.itemsLoading = false
            })
        },
        // 跳往我的发布
        toMyPublish () {
            this.$emit('toPublish')
        },
        toMyClone () {
            this.$emit('toClone')
        },
        // 查询Ta的留言板的ID
        queryBoardId () {
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
                    this.getMessageList(this.boardId)
                }
            })
        },
        // 获取Ta的留言板消息列表
        getMessageList (boardId) {
            const that = this
            const param = {
                'boardId': boardId,
                'pageNum': this.pageNum,
                'pageSize': 5
            }
            that.messageList.list = []
            that.messageList.loading = true
            this.$apiService.message.messageList(param).then(res => {
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
        // 刷新消息列表
        refreshMessage () {
            this.getMessageList(this.boardId)
        },
        // 切换分页方法
        chosePage (params) {
            if (this.pageNum !== params.pageNum) {
                this.getMessageList(this.boardId)
            }
        },
        // 跳转到指定的路由
        jumpTo (item) {
            const urlPath = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://10.4.106.5:7017'
            if (item.url.includes('knowledge')) {
                this.$router.push(item.url)
            } else {
                const appUrl = this.$newAppUrl
                window.location.href = urlPath + appUrl + '/#/model'
            }
        },
        // 给Ta留言的方法
        saveMessage () {
            const that = this
            if (!this.message) { // 如果对方留言板关闭，则不能留言
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
                'messageToUserId': this.userInfo.yhbh,
                'messageToUserName': this.userInfo.yhxm,
                'messageUserId': userInfo.yhbh,
                'messageUserName': userInfo.yhxm
            }
            this.$apiService.message.addMessage(param).then(res => {
                if (res.status === 0) {
                    that.$util.showMessage('给Ta留言成功！', 'success')
                    that.getMessageList(that.boardId)
                    that.clearBoard()
                } else {
                    that.$util.showMessage('给Ta留言失败！' + res.message, 'success')
                }
            }).catch(res => {
                that.$util.showMessage('给Ta留言失败！' + res, 'success')
            })
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
        // 重置留言板
        clearBoard () {
            this.messageObj.text = ''
            this.number = 50
            this.isOpen = false
        }
    }

}
</script>

<style scoped>
    .my-home {
        width: 100%;
        height: 1580px;
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
        height: 230px;
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
        transition-duration: .5s;
        box-shadow: 0 4px 3px 0 rgba(225, 232, 239, 0.75)
    }

    .model-lists li:hover {
        box-shadow: 3px 0 8px #bfbfbf;
        -webkit-box-shadow: 3px 0 8px #bfbfbf;
        -moz-box-shadow: 3px 0 8px #bfbfbf;
        transform: translate(0, -5px);
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
        background: #f2f2f2;
        color: #4075fc;
    }

    .message-body .message-to-me textarea:focus {
        border-radius: 3px;
        outline: none;
        box-shadow: none;
        background: #fff;
        color: #1e58e9;
    }

    .message-body .message-to-me textarea.closed {
        background: #f2f2f2;
    }

    .message-body .message-to-me .message-btn {
        width: 290px;
        height: 40px;
        line-height: 40px;
        color: #b2b2b2;
        text-align: center;
        border-radius: 4px;
        font-size: 14px;
        cursor: not-allowed;
        background: rgba(242, 242, 242, 1);
    }

    .message-body .message-to-me .message-btn.opened {
        background: #3f6bf4;
        color: #fff;
        cursor: pointer;
    }

    .btns-area {
        width: 800px;
        height: 100px;
        margin: 60px auto 0;
    }

    .btns-area ul {
        margin: 0;
        padding: 0;
    }

    .btns-area ul li {
        width: 20%;
        display: inline-block;
        height: 100px;
        position: relative;
    }

    .btns-area ul li .img-div {
        width: 55px;
        height: 55px;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .btns-area ul li .text-div {
        color: #333;
        text-align: center;
        font-size: 12px;
        height: 60px;
        line-height: 60px;
    }

    .btns-area ul li.active .text-div {
        color: #3f6bf4;
    }

    .btns-area ul li:hover .text-div {
        color: #3f6bf4;
    }

    .btns-area ul li:first-child .img-div {
        background-image: url("../../assets/others/home/publish-gray.png");
    }

    .btns-area ul li:first-child.active .img-div {
        background-image: url("../../assets/others/home/publist-blue.png");
    }

    .btns-area ul li:first-child:hover .img-div {
        background-image: url("../../assets/others/home/publist-blue.png");
    }

    .btns-area ul li:nth-child(2) .img-div {
        background-image: url("../../assets/others/home/share-gray.png");
    }

    .btns-area ul li:nth-child(2).active .img-div {
        background-image: url("../../assets/others/home/share-blue.png");
    }

    .btns-area ul li:nth-child(2):hover .img-div {
        background-image: url("../../assets/others/home/share-blue.png");
    }

    .btns-area ul li:nth-child(3) .img-div {
        background-image: url("../../assets/others/home/clone-gray.png");
    }

    .btns-area ul li:nth-child(3).active .img-div {
        background-image: url("../../assets/others/home/clone-blue.png");
    }

    .btns-area ul li:nth-child(3):hover .img-div {
        background-image: url("../../assets/others/home/clone-blue.png");
    }

    .btns-area ul li:nth-child(4) .img-div {
        background-image: url("../../assets/others/home/fav-gray.png");
    }

    .btns-area ul li:nth-child(4).active .img-div {
        background-image: url("../../assets/others/home/fav-blue.png");
    }

    .btns-area ul li:nth-child(4):hover .img-div {
        background-image: url("../../assets/others/home/fav-blue.png");
    }

    .btns-area ul li:last-child .img-div {
        background-image: url("../../assets/others/home/pl-gray.png");
    }

    .btns-area ul li:last-child.active .img-div {
        background-image: url("../../assets/others/home/pl-blue.png");
    }

    .btns-area ul li:last-child:hover .img-div {
        background-image: url("../../assets/others/home/pl-blue.png");
    }

    .number-span {
        color: #B3B3B3;
        font-size: 12px;
        position: absolute;
        bottom: 50px;
        right: 10px;
    }

    .message-body .message-list-zone {
        margin-top: 30px;
        position: relative;
        max-height: 1000px;
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

    .message-page {
        border-top: 1px solid #dedede;
    }
</style>
