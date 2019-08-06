<template>
    <div class="head-wrap">
        <div class="head-content">
            <div class="logo-font clearfix">
                <i></i><span>智力共享云平台-模网</span>
            </div>
            <div class="head-menu">
                <ul>
                    <li v-for="(item, index) in navList " :key="index" :class="{active: activePage === item.value}"
                        @click="changePage(item.value)">{{item.name}}
                    </li>
                </ul>
            </div>
            <div class="head-tools">
                <ul>
                    <li title="系统管理" class="sys-manage" @click="toManage()"
                        v-if="infoObj.mmRole !=='0'">
                        <a class="system-settings" style="color:transparent"></a>
                    </li>
                    <li class="input-li">
                        <input ref="searchInput" v-model="knowKey" title="" placeholder="输入您要搜索的内容"/>
                        <div class="input-span" @click="searchModel()">
                            <i class="iconfont icon-sousuo"></i>
                        </div>
                    </li>
                    <li class="sign-warp">
                        <button class="btn-sign" @click="signIn">打卡</button>
                        <div class="btn-sign-info" v-if="infoObj.showPoint > 0"></div>
                        <Modal v-if="signShow" @on-cancel="cancel()" :width="618" background-color="none"
                               class="sign-modal">
                            <div slot="header"></div>
                            <div slot="body">
                                <sign @on-cancel="cancel()" v-on:showPointFlag2="showPointFlag2"></sign>
                            </div>
                            <div slot="footer"></div>
                        </Modal>
                    </li>
                    <li class="message" @click="toMessage()">
                        <img src="../../assets/home/message.png" alt="">
                        <div v-if="infoObj.unReadNum >= 0 " :class="{ 'transparented' : infoObj.unReadNum === 0}">
                            {{infoObj.unReadNum>9 ? '9+': infoObj.unReadNum}}
                        </div>
                    </li>
                    <li class="dropdown personal-wrap">
                        <div class="ava-div">
                            <i class="">
                                <img v-bind:src="infoObj.iconb" alt=""/>
                            </i>
                            <span class="nickname">
                                {{dealString(infoObj.username, 7)}}
                                <i class="drop-small"></i>
                            </span>
                        </div>
                        <ul class="dropdown-menu dropdown-menu-right" style="margin-top:-6px;" id="dropdown-list">
                            <li class="active">
                                <a class="tc">
                                    <span class="jf-icon icon"></span>
                                    <span class="text-span"> {{infoObj.points}} 积分</span>
                                </a>
                            </li>
                            <li @click="toPersonal()">
                                <a>
                                    <span class="personal-icon icon"></span>
                                    <span class="text-span">个人中心</span>
                                </a>
                            </li>
                            <li class="message-num" @click="toMessage()">
                                <a>
                                    <span class="message-icon icon"></span>
                                    <span class="text-span">消息</span>
                                    <span class="message-span">
                                        {{ infoObj.unReadNum > 99 ? '99+': infoObj.unReadNum }}
                                    </span>
                                </a>
                            </li>
                            <li @click="toSetting()">
                                <a>
                                    <span class="set-icon icon"></span>
                                    <span class="text-span">设置</span>
                                </a>
                            </li>
                            <li v-on:click="logout">
                                <a>
                                    <span class="logout-icon icon"></span>
                                    <span class="text-span">退出</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="login-point" v-if="loginPint" @click="signIn()">
            恭喜您，累计登录{{ logSigns.signTimes }}天，本次登录<span>+{{logSigns.point}}</span>积分
        </div>
    </div>
</template>

<script>

import Sign from './sign/sign'
import Modal from '../Modal'

export default {
    name: 'headerNav',

    components: {
        Modal,
        Sign
    },
    data: function () {
        return {
            knowKey: '',
            activePage: 1,
            infoObj: {
                mmRole: '0',
                activeBoxs: [],
                unReadNum: 0,
                showtimes: false,
                iconb: require('../../assets/home/avatar-default.png'),
                username: '不能超过七个字xyz',
                points: 0,
                showPoint: false
            },
            navList: [
                { name: '首页', value: 1 },
                { name: '协创空间', value: 2 },
                { name: '知识分享', value: 3 },
                { name: '智能场景', value: 4 }
            ],
            isProd: process.env.NODE_ENV === 'production',
            urlPath: process.env.NODE_ENV === 'production' ? window.location.origin : 'http://10.4.106.5:7017',
            sockedUrl: process.env.NODE_ENV === 'production' ? window.location.host : '10.4.138.221:7017',
            websocket: null,
            logSigns: {
                signTimes: 0,
                point: 0
            },
            loginPint: false
        }
    },
    computed: {
        signShow: {
            get () {
                return this.$store.state.signShow
            },
            set (value) {
            }
        }
    },
    watch: {
        $route (to, from) {
            const path = to.path
            if (path.includes('home') || path.includes('example')) {
                this.activePage = 1
            } else if (path.includes('model')) {
                this.activePage = 2
            } else if (path.includes('knowledge')) {
                this.activePage = 3
            } else if (path.includes('intelligentscene')) {
                this.activePage = 4
            } else {
                this.activePage = 0
            }
        }
    },
    created () {
        const user = window.localStorage.getItem('userInfo')
        const userInfo = JSON.parse(decodeURIComponent(user))
        if (!userInfo) {
            this.$util.showMessage('登录超时，请重新登录', 'warning', false)
            this.$router.push('/login')
        }
        this.infoObj.mmRole = userInfo.mm_role
        this.getUserInfo()
        this.getMyPoints()
    },
    mounted () {
        this.showPointFlag()
        this.getLoginSign()
        const that = this
        setTimeout(function () {
            that.getMessage()
        }, 500)
    },
    destroyed () {
        this.websocket.close()
    },
    methods: {
        searchModel () {
            if (!this.knowKey) {
                this.$util.showMessage('请输入搜索的模型名称！', 'info')
                return
            }
            this.$router.push({
                path: '/knowledge',
                query: {
                    name: this.knowKey
                }
            })
        },
        showPointFlag2 (data) {
            this.infoObj.showPoint = data
        },
        showPointFlag () {
            this.$apiService.signAbout.getSignBox().then(data => {
                const signBox = data
                const activeBoxs = signBox.filter(function (value) {
                    return value.boxState === 1
                })
                this.infoObj.showPoint = activeBoxs.length
            })
        },
        changePage: function (page) {
            this.activePage = page
            const newUrl = this.urlPath + this.$newAppUrl
            if (page === 1) {
                this.$router.push('/home')
            } else if (page === 3) {
                this.$router.push('/knowledge')
            } else if (page === 2) {
                window.location.href = newUrl + '/#/model'
            } else if (page === 4) {
                window.location.href = newUrl + '/#/intelligentscene'
            }
        },
        signIn: function () {
            this.$store.dispatch('signIn')
        },
        logout: function () {
            window.sessionStorage.clear()
            window.localStorage.clear()
            this.$router.push('/login')
        },
        toPersonal () {
            this.activePage = 0
            this.$router.push('/personal')
        },
        toMessage () {
            window.location.href = this.urlPath + this.$newAppUrl + '/#/information/'
        },
        toSetting () {
            window.location.href = this.urlPath + this.$newAppUrl + '/#/preferences/index'
        },
        toManage () {
            window.location.href = this.urlPath + this.$newAppUrl + '/#/management'
        },
        cancel () {
            this.$store.dispatch('signOut')
        },
        // 处理超长字符串
        dealString (str, len) {
            return this.$util.dealString(str, len)
        },
        // 获取个人信息
        getUserInfo () {
            const that = this
            const user = window.localStorage.getItem('userInfo')
            const userInfo = JSON.parse(decodeURIComponent(user))
            const param = {
                yhbh: userInfo.yhbh
            }
            this.$apiService.personalCenter.getMyInfo(param).then(res => {
                if (res.showYhnc === '1') {
                    that.infoObj.username = res.yhnc
                    window.localStorage.setItem('nameType', 'nick')
                } else {
                    that.infoObj.username = res.yhxm
                    window.localStorage.setItem('nameType', 'name')
                }
                if (res.iconb) {
                    that.infoObj.iconb = res.iconb
                }
            }).catch(res => {

            })
        },
        // 获取我的钱包积分总数
        getMyPoints () {
            this.$apiService.home.getPoints().then(res => {
                this.infoObj.points = res.points
            }).catch(res => {
                console.log(res)
            })
        },
        // 获取登录签到天数
        getLoginSign () {
            const vm = this
            const USERINFO = JSON.stringify(decodeURIComponent(window.sessionStorage.getItem('userInfo')))
            if (USERINFO) {
                vm.$apiService.home.loginSign().then(res => {
                    if (res) {
                        vm.logSigns = res
                        vm.loginPint = true
                        setTimeout(() => {
                            vm.loginPint = false
                        }, 6000)
                    }
                }).catch(res => {
                    vm.$util.showMessage(res.data.message, 'error')
                })
            }
        },
        // 获取消息信息
        getMessage () {
            const user = window.localStorage.getItem('userInfo')
            const USERINFO = JSON.parse(decodeURIComponent(user))
            const vm = this
            this.websocket = new WebSocket('ws://' + this.sockedUrl + '/MMsocket/' + USERINFO.yhbh)
            this.websocket.onmessage = function (evt) {
                const getData = JSON.parse(evt.data)
                if (getData.messageType === 'userLogOut') {
                    if (getData.userId === USERINFO.yhbh) {
                        vm.$util.showMessage(getData.message, 'error', { timeOut: 8000 })
                        window.sessionStorage.clear()
                        window.localStorage.clear()
                        setTimeout(vm.logout, 3000)
                    }
                }
                if (getData.messageType === 'errorExecuteModel') {
                    window.sessionStorage.setItem('errModel', encodeURIComponent((getData)))
                }
                if (getData.msg) {
                    const reLn = getData.msg.length
                    vm.infoObj.unReadNum = getData.msg[reLn - 1].num
                    vm.receivMsg = getData.msg.slice(0, getData.msg.length - 1)
                }
                if (getData.broadcast) {
                    console.log(getData.broadcast)
                }
            }
            this.websocket.onerror = function () {

            }
        }
    }
}
</script>

<style scoped>
    .active {
        color: #3F6BF4;
    }

    .head-wrap {
        height: 55px;
        background: rgba(38, 38, 38, 1);
        color: rgba(255, 255, 255, 1);
        vertical-align: middle;
        font-family: Microsoft YaHei, serif;
    }

    .head-content {
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        position: relative;
    }

    .logo-font {
        float: left;
    }

    .logo-font span {
        vertical-align: middle;
        font-size: 14px;
        line-height: 55px;
        font-weight: bold;
        padding-left: 4px;
    }

    .logo-font i {
        width: 25px;
        height: 26px;
        margin-bottom: -9px;
        display: inline-block;
        background: url("../../assets/home/nav-logo.png") no-repeat;
    }

    .head-menu {
        float: left;
        font-size: 12px;
        font-weight: 400;
        line-height: 55px;
        margin-left: 20px;
    }

    .head-menu li {
        float: left;
        list-style: none;
        margin-left: 30px;
        cursor: pointer;
    }

    .head-menu li:hover {
        color: #3f6bf4;
    }

    .head-tools {
        position: absolute;
        right: 4px;
        top: 0;
        height: 55px;
        z-index: 500;
    }

    .head-tools > ul {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .head-tools > ul > li {
        float: left;
        list-style: none;
        cursor: pointer;
        height: 55px;
        line-height: 55px;
        margin-left: 20px;
    }

    .head-tools input, .head-tools input:focus {
        background: #4D4D4D;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        width: 158px;
        font-size: 12px;
        color: #F7F7F7;
        text-indent: 10px;
        border: 0;
        outline: none;
        border-radius: 15px 0 0 15px;
    }

    .head-tools li a.system-settings {
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 55px;
        vertical-align: middle;
        background: url("../../assets/icon/sys-mana-aaa.svg") no-repeat;
        -webkit-background-size: 100%;
        background-size: 100%;
        cursor: pointer;
    }

    .btn-sign {
        width: 60px;
        height: 24px;
        line-height: 24px;
        background: #fff;
        border-radius: 3px;
        font-size: 12px;
        color: #333;
        padding: 0;
        outline: none;
        border: none;
    }

    .btn-sign:hover, .btn-sign:focus, .btn-sign:active {
        color: #fff;
        background: #1e58e9;
        outline: none;
        border: none;
    }

    .btn-sign-info {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #FF0000;
        position: absolute;
        top: 14px;
        right: -2px;
    }

    .sign-warp {
        position: relative;
    }

    .message {
        position: relative;
        width: 36px;
    }

    .message div {
        -webkit-transform-origin-x: 0;
        transform-origin-x: 0;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        font-size: 14px;
        color: #fff;
        width: 24px;
        height: 24px;
        padding-top: 3px;
        line-height: 12px;
        text-align: center;
        display: inline-block;
        margin-left: -10px;
        vertical-align: 10px;
        background: #FF0000;
        border-radius: 50%;
    }

    .head-tools li.personal-wrap {
        margin-left: 0;
    }

    .ava-div i img {
        width: 25px;
        height: 25px;
        border: 1px solid #e5e9f2;
        border-radius: 50%;
        margin-right: 9px;
    }

    .personal-wrap:hover i img {
        border: 1px solid #3f6bf4;
    }

    .ava-div {
        font-size: 12px;
    }

    .input-li {
        position: relative;
        margin-right: 42px;
    }

    .input-span {
        width: 42px;
        height: 30px;
        background: rgba(63, 107, 244, 1);
        border-radius: 0 15px 15px 0;
        position: absolute;
        top: 14px;
        right: -42px;
    }

    .input-span .iconfont {
        line-height: 0;
        vertical-align: 12px;
        margin-left: -3px;
    }

    .dropdown-menu {
        display: block;
    }

    .dropdown-menu li {
        height: 40px;
        line-height: 40px;
        text-align: center;
    }

    .dropdown-menu li:hover {
        background: #f5f5f5;
    }

    .personal-wrap:hover #dropdown-list {
        display: block;
    }

    #dropdown-list {
        padding: 0;
        display: none;
    }

    #dropdown-list li a {
        font-size: 12px;
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative
    }

    #dropdown-list li span {
        font-size: 12px;
    }

    #dropdown-list li a i {
        display: inline-block;
        height: 15px;
        width: 15px;
    }

    .personal-wrap ul li a span.icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        top: 10px;
        left: 30px;
    }

    .personal-wrap ul li a span.text-span {
        display: inline-block;
        position: absolute;
        height: 20px;
        line-height: 20px;
        text-align: left;
        left: 60px;
        top: 8px;
    }

    .personal-wrap ul li a span.message-span {
        display: inline-block;
        position: absolute;
        height: 20px;
        line-height: 20px;
        text-align: left;
        left: 90px;
        top: 8px;
        color: #f00;
    }

    .personal-wrap ul li a span.personal-icon {
        width: 20px;
        height: 20px;
        background-image: url("../../assets/header/users.svg");
    }

    .personal-wrap ul li a span.message-icon {
        width: 20px;
        height: 20px;
        background-image: url("../../assets/header/message.svg");
    }

    .personal-wrap ul li a span.set-icon {
        background-image: url("../../assets/header/set.svg");
        left: 32px;
    }

    .personal-wrap ul li a span.logout-icon {
        background-image: url("../../assets/header/logout.svg");
        left: 32px;
    }

    .personal-wrap ul li a span.jf-icon {
        background-image: url("../../assets/header/jf.svg");
        left: 32px;
    }

    div.transparented {
        opacity: 0;
    }

    .login-point {
        width: 300px;
        position: absolute;
        height: 40px;
        z-index: 9999;
        top: 100px;
        left: 50%;
        line-height: 40px;
        background: #fff;
        text-align: center;
        box-shadow: 1px 2px 3px 0 rgba(0, 0, 0, 0.07);
        border-radius: 3px;
        margin-left: -150px;
        font-size: 12px;
        color: #333;
        animation-duration: 1s;
        animation-name: bounceInDown;
        -webkit-animation-name: bounceInDown;
    }

    @-webkit-keyframes bounceInDown {
        0% {
            opacity: 0;
            -webkit-transform: translateY(-2000px);
            transform: translateY(-2000px);
        }

        60% {
            opacity: 1;
            -webkit-transform: translateY(10px);
            transform: translateY(10px);
        }

        80% {
            -webkit-transform: translateY(-10px);
            transform: translateY(-10px);
        }

        100% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }
    }

    @keyframes bounceInDown {
        0% {
            opacity: 0;
            -webkit-transform: translateY(-2000px);
            -ms-transform: translateY(-2000px);
            transform: translateY(-2000px);
        }

        60% {
            opacity: 1;
            -webkit-transform: translateY(10px);
            -ms-transform: translateY(10px);
            transform: translateY(10px);
        }

        80% {
            -webkit-transform: translateY(-10px);
            -ms-transform: translateY(-10px);
            transform: translateY(-10px);
        }

        100% {
            -webkit-transform: translateY(0);
            -ms-transform: translateY(0);
            transform: translateY(0);
        }
    }

    .login-point span {
        color: #FF9000;
    }
</style>
