<template>
    <div class="message-zone">
        <div class="top-zone">
            <div class="img-div" @click="jumpToHim(messageObj, 0)" title="去往Ta的主页">
                <img :src="imgurl" v-if="imgurl" onerror="this.style.display = 'none'" alt="">
            </div>
            <div class="text-div">
                <div class="name-div" @click="jumpToHim(messageObj, 0)" title="去往Ta的主页">
                    {{ transformName(name, messageObj.messageUserId, userId)}}
                    <span v-if="messageObj.messageUserId === userId" class="my-info">(我)</span>
                </div>
                <div class="time-div">{{time}}</div>
            </div>
        </div>
        <div class="message-text-body">
            <span v-if="!showAllMessage">{{dealString(messageContent, 30)}}</span>
            <span v-if="showAllMessage">{{messageContent}}</span>
            <br>
            <a class='show-all' @click="showAllMessage = !showAllMessage"
               v-if="messageContent && messageContent.length >= 30">
                {{ showAllMessage ? '隐藏' : '显示全部...'}}
            </a>
        </div>
        <div class="message-footer">
            <span class="reply" v-if="showExec"
                  @click="MessageReply(messageObj, 0)">回复</span>
            <span class="reply" v-if="showExec"
                  @click="removeMessage(messageObj)">删除</span>
        </div>
        <!-- 回复消息列表区域 -->
        <div class="reply-body-zone" v-if="messageObj.list.length > 0">
            <div class="message-reply-text-body" v-for="(item, index) in messageObj.list " :key="index">
                <span class="text-span" :title="item.backUserName">
                    {{ transformName(item.backUserName, item.backUserId, userId) }}
                    <span class="my-info" v-if="item.backUserId === userId">(我)</span>
                </span>
                <span>回复</span>
                <span class="text-span to-span" :title="item.backToUserName">
                    {{ transformName(item.backToUserName, item.backToUserId, userId) }}
                    <span class="my-info" v-if="item.backToUserId === userId ">(我)</span>
                </span><br>
                <span class="reply-span">
                    <span v-if="!showArr[index]">{{ dealString(item.backContext, 30) }}</span>
                    <span v-if="showArr[index]">{{ item.backContext}}</span>
                    <br>
                    <a class='show-all' v-if="item.backContext && item.backContext.length >= 30"
                       @click="showAll(index)">{{ showArr[index] ? '隐藏' : '显示全部...'}}</a>
                </span>
                <br>
                <div class="list-span-area">
                    <span class="reply-list-span  list-span" v-if="showExec"
                          @click="MessageReply(item, 1)">回复</span>
                    <span class="delete-list-span list-span" @click="removeBack(item)" v-if="showExec">删除</span>
                </div>
            </div>
        </div>

        <div class="reply-zone" v-if="showReply">
             <span class="close-reply" v-if="showReply"
                   @click="closeReply()" title="关闭回复"></span>
            <textarea placeholder="请输入回复内容,最多50字"
                      v-model="replyMessage"
                      @input="changeText()"></textarea>
            <div class="text-num">还可以输入<span>{{number}}</span>字</div>
            <div class="reply-btn" @click="replyMessageTo()">回复</div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: 'message',
    props: {
        messageObj: Object,
        userId: String, // 当前登录用户的id
        otherUserId: String // 其他用户的id，在Ta的主页有用
    },
    data: function () {
        return {
            replyMessage: '',
            showReply: false,
            messageContent: '',
            time: '',
            imgurl: '',
            name: '',
            showAllMessage: false,
            showArr: [],
            number: 50,
            replyObject: null,
            showExec: true
        }
    },
    created () {
        const list = this.messageObj.list
        const len = list.length
        const arr = []
        for (let i = 0; i < len; i++) {
            arr.push(false)
        }
        this.showArr = arr
        this.messageContent = this.messageObj.messageContext
        const timep = this.messageObj.messageTime
        this.time = this.$util.formatDateTime(timep)
        this.imgurl = this.messageObj.messageUserIcon
        this.name = this.messageObj.messageUserName
        if (this.otherUserId) {
            this.showExec = this.userId === this.messageObj.messageUserId
        }
    },
    methods: {
        dealString (str, len) {
            return this.$util.dealString(str, len)
        },
        // 显示全部的方法
        showAll (index) {
            const arr = this.showArr
            const flag = !arr[index]
            Vue.set(arr, index, flag)
        },
        // 计算字数的方法
        changeText () {
            const text = this.replyMessage
            if (!text) {
                this.number = 50
            } else {
                this.number = 50 - text.length
            }
        },
        // 跳转到Ta的主页
        jumpToHim (item, type) {
            const userId = type === 0 ? item.messageUserId : ''
            const userName = type === 0 ? item.messageUserName : ''
            if (userId !== this.userId) {
                this.$router.push({
                    path: '/others',
                    query: {
                        userId: userId,
                        userName: userName,
                        toTop: 1
                    }
                })
            } else {
                this.$router.push({
                    path: '/personal'
                })
            }
        },
        // 关闭回复窗口
        closeReply () {
            this.showReply = false
            this.replyObject = null
        },
        MessageReply (item, type) {
            this.showReply = !this.showReply
            if (this.showReply) {
                const user = window.localStorage.getItem('userInfo')
                const userInfo = JSON.parse(decodeURIComponent(user))
                const yhbh = userInfo.yhbh
                const yhxm = userInfo.yhxm
                const param = {
                    'boardId': this.messageObj.boardId,
                    'backContext': '',
                    'backId': null,
                    backParentId: item.messageId,
                    'backToUserId': type === 0 ? item.messageUserId : item.backUserId,
                    'backToUserName': type === 0 ? item.messageUserName : item.backUserName,
                    'backUserId': yhbh,
                    'backUserName': yhxm,
                    messageId: item.messageId
                }
                this.replyObject = param
            } else {
                this.replyObject = null
            }
        },
        // 向留言者回复消息
        replyMessageTo () {
            const that = this
            if (!this.replyMessage) {
                this.$util.showMessage('请输入回复内容', 'warning')
                return
            } else if (this.replyMessage.length > 50) {
                this.$util.showMessage('回复内容最多输入50个字符', 'warning')
                return
            }
            const param = this.replyObject
            param.backContext = this.replyMessage
            this.$apiService.message.replyMessage(param).then(res => {
                if (res.status === 0) {
                    that.$util.showMessage('留言回复成功', 'success')
                    that.showReply = false
                    that.replyMessage = ''
                    that.refreshMessage()
                } else {
                    that.$util.showMessage('留言回复失败' + res.message, 'error')
                    that.showReply = false
                }
            }).catch(res => {
                that.$util.showMessage('留言回复失败' + res, 'error')
                that.showReply = false
            })
        },
        // 删除留言的方法
        removeMessage (item) {
            const that = this
            this.$util.showConfirm('确定要删除这条留言消息吗？', function () {
                const param = { messageId: item.messageId }
                that.$apiService.message.removeMessage(param).then(res => {
                    if (res.status === 0) {
                        that.$util.showMessage('删除消息成功！', 'success')
                        that.refreshMessage()
                    } else {
                        that.$util.showMessage('删除消息失败！', 'error')
                    }
                }).catch(res => {
                    that.$util.showMessage(res, 'error')
                })
            }, function () {
            })
        },
        // 删除回复信息的方法
        removeBack (item) {
            const that = this
            this.$util.showConfirm('确定要删除这条回复消息吗？', function () {
                const param = { backId: item.backId }
                that.$apiService.message.removeBackMessage(param).then(res => {
                    if (res.status === 0) {
                        that.$util.showMessage('删除回复成功！', 'success')
                        that.refreshMessage()
                    } else {
                        that.$util.showMessage('删除回复失败！', 'error')
                    }
                }).catch(res => {
                    that.$util.showMessage(res, 'error')
                })
            }, function () {
            })
        },
        // 刷新消息列表
        refreshMessage () {
            this.$emit('refreshList')
        },
        // 根据用户是否是当前登录用户以及用户设置显示昵称还是姓名来展示----留言板名字信息
        transformName (name, ID, userId) {
            const user = window.sessionStorage.getItem('userInfo')
            const userInfo = JSON.parse(decodeURIComponent(user))
            const isNick = window.localStorage.getItem('nameType')
            if (ID === userId) {
                return isNick === 'nick' ? userInfo.yhxm : userInfo.username
            } else {
                return name
            }
        }
    }
}
</script>

<style scoped>
    .message-zone {
        min-height: 100px;
        position: relative;
        font-size: 12px;
    }

    .message-zone .top-zone {
        height: 64px;
        width: 100%;
        position: relative;
    }

    .message-zone .top-zone .img-div {
        width: 48px;
        height: 48px;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        background-color: #f1f1f1;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("../../../assets/home/message/def.png");
    }

    .message-zone .top-zone .img-div img {
        width: 100%;
        height: 100%;
    }

    .message-zone .top-zone .text-div {
        width: 228px;
        height: 48px;
        position: absolute;
        left: 60px;
        top: 0;
    }

    .message-zone .top-zone .text-div .name-div {
        height: 28px;
        line-height: 28px;
        text-align: left;
        color: #3F6BF4;
        font-size: 14px;
        cursor: pointer;
    }

    .message-zone .top-zone .text-div .time-div {
        height: 20px;
        line-height: 20px;
        text-align: left;
        color: #808080;
        font-size: 12px;
    }

    .message-text-body {
        width: 100%;
        line-height: 20px;
        word-break: break-all;
        font-size: 12px;
        color: #666;
        text-align: left;
        padding-right: 6px;
    }

    .message-zone a.show-all {
        font-size: 12px;
        color: #3f6bf4;
        cursor: pointer;
    }

    .message-zone a.show-all:hover {
        text-decoration: underline;
    }

    .message-reply-text-body {
        width: 100%;
        line-height: 20px;
        word-break: break-all;
        font-size: 12px;
        color: #666;
        text-align: left;
        padding-right: 6px;
        margin: 2px 0;
    }

    .message-reply-text-body span {
        vertical-align: top;
        display: inline-block;
        line-height: 20px;
    }

    .message-reply-text-body span.text-span {
        height: 20px;
        color: #3f6bf4;
        margin-right: 10px;
        cursor: pointer;
    }

    .message-reply-text-body span.text-span.to-span {
        margin-left: 10px;
    }

    .message-reply-text-body span.text-span:hover {
        text-decoration: underline;
    }

    .message-reply-text-body span.reply-span {
        min-height: 20px;
        width: 280px;
        background: #f7f7f7;
        margin-top: 4px;
    }

    .message-footer {
        height: 30px;
        line-height: 30px;
        text-align: left;
        position: relative;
    }

    .message-footer span {
        width: 40px;
        margin-right: 20px;
        text-align: left;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        color: #3f6bf4;
        font-size: 12px;
    }

    .close-reply {
        width: 26px;
        height: 26px;
        cursor: pointer;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("../../../assets/home/message/close.svg");
        position: absolute;
        right: 0;
        top: -6px;
    }

    .reply-zone {
        width: 100%;
        height: 240px;
        position: relative;
    }

    .reply-zone textarea {
        width: 100%;
        height: 150px;
        border: 1px solid #E5E9F2;
        border-radius: 4px;
        font-size: 12px;
        padding: 5px;
        color: #666;
        margin-top: 20px;
    }

    .reply-zone .text-num {
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #333;
        text-align: left;
    }

    .reply-zone .text-num span {
        color: #f00;
    }

    .reply-zone .reply-btn {
        width: 100%;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        background: #3f6bf4;
        color: #fff;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
    }

    .list-span-area {
        width: 280px;
        height: 20px;
        position: relative;
        margin-top: 4px;
    }

    .list-span {
        display: inline-block;
        position: absolute;
        height: 20px;
        line-height: 20px;
        top: 0;
        cursor: pointer;
        color: #3f6bf4;
    }

    .list-span.reply-list-span {
        right: 40px;
    }

    .list-span.delete-list-span {
        right: 0;
    }

    span.my-info {
        color: #f00;
    }
</style>
