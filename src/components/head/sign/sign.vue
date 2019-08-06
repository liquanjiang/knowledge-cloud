<template>
    <div class="modal-sign-wrap">
        <header class="sign-head">本年度已打卡
            <span class="pages" v-for="(n, index) in signInfo.totalSignInDays" v-bind:key="index">{{n}}</span>天
        </header>
        <div class="sign-body-wrap">
            <div class="sign-title">
                <div class="sign-title-constel">星座打卡 · {{signInfo.constellation}}<span>（{{signInfo.startCon || '' + '~' + (signInfo.endCon || '')}}）</span>
                </div>
                <a v-on:click="ruleSign()">规则</a>
                <span class="sign-close" @click="cancel()"><i class="iconfont icon-guanbi"></i></span>
            </div>
            <div class="sign-body">
                <p class="sign-body-tip">点击星座图标可以进行补打卡（剩余<span>{{signInfo.supplementTimes}}</span>次）</p>
                <!--<div v-if="listLoading" class="text-center loading-wrap">-->
                <!--<font-awesome-icon icon="spinner" pulse class="fa-spinner"/>-->
                <!--Loading...-->
                <!--</div>-->
                <modal v-if="signTipShow" background-color="none" class="sign-modal">
                    <div slot="header"></div>
                    <div slot="body">
                        <sign-tip @on-cancel="signTipCancel(arguments)"
                                  :type="tipType" :supple="supple" :point="boxPoint"
                                  :supplement="suppleObject" :box-item="boxObject"></sign-tip>
                    </div>
                    <div slot="footer"></div>
                </modal>
                <ul class="sign-body-list clearfix">
                    <li v-for="(card, index) in signInfo.dayList" v-bind:key="index"
                        :class="{'default':card.isSignIn===1}"
                        v-on:click="repairSign(card)">
                        <div :class="{'actived':card.isSignIn === 1, 'focus':card.isSignIn===0}"><i
                            :class="'iconfont' + ' ' + signInfo.xzIndex"></i></div>
                        <p v-if="card.isSignIn===1 && card.isToday" class="sign-body-date"><i
                            class="iconfont icon-daqia"></i>{{card.showDate}}</p>
                    </li>
                </ul>
                <div class="sign-body-get">
                    <h6>连续打卡有惊喜，最高可获1000积分</h6>
                    <div v-if="boxLoading" class="text-center loading-wrap">
                        <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
                        Loading...
                    </div>
                    <ul class="sign-getbox">
                        <li v-for="(box, index) in signBox" v-bind:key="index"
                            v-on:click="openBox(box)">
                            <div class="sign-boxward"
                                 :class="{'opened':box.boxState===2,'noopen':box.boxState===0}"></div>
                            <span class="sign-dateward">{{box.day}}天</span><span class="sign-pointward">保底{{box.point}}积分</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 打卡规则区域 -->
        <div class="modal-inner" v-if="showRule">
            <!--补打卡提示-->
            <div class="sign-rule-box" :class="{'fadeout': ruleAnimation, 'fadeIn': !ruleAnimation}">
                <span class="sign-close" @click="Rulecancel()"><i class="iconfont icon-guanbi"></i></span>
                <div class="main-div">
                    <h4 class="sign-rule-title clearfix">
                        <button class="rule-btn"><i class="iconfont icon-daqiaguize"></i></button>
                        <span class="rule-hd">打卡规则</span>
                    </h4>
                    <ul class="sign-rule-content">
                        <li>1、每天登录自动打卡奖励积分；</li>
                        <li>2、连续打卡，可获得宝箱，连续打卡时间越长，则可以获得的积分数越多，最高可获得1000积分；</li>
                        <li>3、如果中途断掉打卡，连续打卡天数从1开始计数，此前得的积分数不会被扣掉；</li>
                        <li>4、每月有7次补打卡的机会，补打卡需要消耗积分；</li>
                        <li>5、积分是用于克隆知识分享中的模型，查看模型说明文档的专属货币；</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiService from '../../../libs/apiService'
import util from '../../../libs/util'
import SignTip from './signTip'
import modal from '../../Modal'

export default {
    components: {
        modal,
        SignTip
    },
    name: 'sign',
    mounted () {
        this.getSignInfoList(true)
    },
    data: function () {
        return {
            constellations: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
            signInfo: {},
            signBox: [],
            boxLoading: false,
            listLoading: true,
            showRule: false,
            ruleAnimation: false,
            signTipShow: false,
            tipType: 0,
            supple: 0,
            boxPoint: 0,
            suppleObject: null,
            boxObject: null,
            notShowAgain: false
        }
    },
    methods: {
        cancel () {
            this.$emit('on-cancel')
        },
        getSignInfoList () {
            apiService.signAbout.getSignInfo().then(data => {
                this.listLoading = true
                this.signInfo = data
                this.signInfo.totalSignInDays = util.numSeat(data.totalSignInDays, 3)
                this.constellations.forEach((item, index) => {
                    if (this.signInfo.constellation === item) {
                        this.signInfo.xzIndex = 'icon-xingzuo' + (index + 1)
                    }
                })
                this.signInfo.dayList.forEach((item, index) => {
                    item.showDate = item.date.substring(item.date.indexOf('-') + 1).replace('-', '.')
                })
                const days = this.signInfo.dayList
                this.signInfo.startCon = days[0].showDate
                this.signInfo.endCon = days[days.length - 1].showDate
                this.listLoading = false
                this.getSignBoxInfo()
            })
        },
        getSignBoxInfo () {
            this.boxLoading = true
            apiService.signAbout.getSignBox().then(data => {
                data[0].day = 2
                data[0].point = 100
                data[1].day = 7
                data[1].point = 200
                data[2].day = 12
                data[2].point = 230
                data[3].day = 21
                data[3].point = 360
                data[4].day = 28
                data[4].point = 500
                this.signBox = data
                this.boxLoading = false
                const activeBoxs = this.signBox.filter(function (value) {
                    return value.boxState === 1
                })
                if (activeBoxs.length > 0 && !this.notShowAgain) {
                    this.openBox({ boxState: -1 })
                }
                this.notShowAgain = false
                this.$emit('showPointFlag2', activeBoxs.length)
            })
        },
        repairSign (item) {
            if (item.isSignIn === 1) {
                return
            }
            this.tipType = item.isSignIn
            this.supple = this.signInfo.supplementTimes
            this.suppleObject = item
            this.signTipShow = true
        },
        openBox (item) {
            this.notShowAgain = true
            this.tipType = item.boxState + 4
            this.boxPoint = item.point
            this.boxObject = item
            this.signTipShow = true
        },
        ruleSign () {
            this.ruleAnimation = false
            this.showRule = true
        },
        Rulecancel () {
            this.ruleAnimation = true
            setTimeout(() => {
                this.showRule = false
            }, 600)
        },
        signTipCancel (data) {
            data[0] && this.getSignInfoList()
            this.signTipShow = false
        }
    }
}
</script>

<style scoped>
    * {
        -webkit-text-size-adjust: none;
    }

    [role="button"].default {
        cursor: default;
    }

    .modal-sign-wrap {
        background-color: rgba(0, 0, 0, 0);
        position: relative;
    }

    .modal-sign-wrap .sign-head {
        background: none;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 20px;
        color: #FFFFFF;
        font-family: MicrosoftYaHei, serif;
        text-align: center;
        line-height: 43px;
    }

    .modal-sign-wrap .sign-head span {
        display: inline-block;
        width: 36px;
        height: 43px;
        background: url("../../../assets/icon/calendar.png") no-repeat;
        font-size: 29px;
        color: #000000;
        line-height: 43px;
        vertical-align: middle;
        margin: 0 7px;
    }

    .modal-sign-wrap .sign-head span:first-child {
        margin-left: 9px;
        margin-right: 0;
    }

    .modal-sign-wrap .sign-head span:last-child {
        margin-right: 9px;
        margin-left: 0;
    }

    .modal-sign-wrap .sign-head span.pages {
        animation: flipover-bottom .5s linear 2.1999999999999997s 1 normal forwards;
    }

    @keyframes flipover-bottom {
        0% {
            z-index: 7;
            -webkit-transform: rotateX(180deg);
        }
        50% {
            z-index: 7;
            -webkit-transform: rotateX(90deg);
        }
        51% {
            z-index: 8;
        }
        100% {
            z-index: 8;
            -webkit-transform: rotateX(0);
        }
    }

    .modal-sign-wrap .sign-body-wrap { /*height:490px;*/
        background-color: #FFFFFF;
        border-radius: 5px;
        border: 10px solid #0054FF;
        border-top: 0;
        box-shadow: 0px 10px 8px 0px rgba(51, 51, 51, 0.1);
        padding: 0;
    }

    .modal-sign-wrap .sign-title {
        width: 100%;
        height: 49px;
        background: url("../../../assets/icon/sign-hd.png") no-repeat 0 0 #0054FF;
        position: relative;
    }

    .sign-title-constel {
        position: absolute;
        width: 215px;
        height: 40px;
        background: #fff;
        border-radius: 5px 5px 0px 0px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        top: 10px;
        left: 0px;
        line-height: 40px;
        text-align: center;
    }

    .sign-title-constel span {
        font-size: 10px;
        font-weight: normal;
    }

    .sign-title a {
        font-size: 12px;
        color: #fff;
        position: absolute;
        right: 50px;
        top: 19px;
    }

    .sign-title span.sign-close, .sign-light-box .sign-close {
        color: #fff;
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .sign-light-box .sign-close {
        top: 5px;
    }

    .sign-title span.sign-close .icon-guanbi {
        font-size: 24px;
    }

    .sign-light-box .sign-close .icon-guanbi {
        font-size: 16px;
    }

    .sign-rule-box .sign-close {
        color: #B3B3B3;
        position: absolute;
        right: 20px;
        top: 20px;
    }

    .sign-body-tip {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: #FD7904;
        text-align: right;
        margin: 28px 20px 13px 0;
    }

    .sign-body-list {
        padding-left: 8px;
    }

    .sign-body-list li {
        height: 68px;
        margin: 0px 0px 0px 9px;
        float: left;
    }

    .sign-body-list li.cursor, .sign-body-list li.default > div {
        cursor: default;
    }

    .sign-body-list li > div {
        width: 48px;
        height: 57px;
        text-align: center;
        background: url("../../../assets/icon/sn-0.png") no-repeat center;
        line-height: 57px;
    }

    .sign-body-list li > div .iconfont {
        color: #F7FAFF;
    }

    .sign-body-list li > div.actived {
        width: 48px;
        height: 57px;
        line-height: 54px;
        background: url("../../../assets/icon/sn-3.png") no-repeat center;
    }

    .sign-body-list li > div.focus {
        background: url("../../../assets/icon/sn-1.png") no-repeat center;
    }

    .sign-body-list li > div.focus .iconfont {
        font-size: 24px;
        color: #9FBDFF;
        margin-left: 2px
    }

    .sign-body-list li > div.actived .iconfont {
        font-size: 24px;
        color: #fff;
    }

    .sign-body-list .sign-body-date {
        text-align: center;
        color: #FF9000;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        margin-top: -4px;
        margin-left: -2px;
    }

    .sign-body-list .sign-body-date .iconfont {
        font-size: 14px;
    }

    .sign-body-get h6 {
        font-size: 12px;
        font-weight: 400;
        color: #407CFF;
        text-align: center;
        margin-top: 20px;
    }

    .sign-getbox {
        margin: 20px 0 26px 18px;
    }

    .sign-getbox li {
        width: 75px;
        display: inline-table;
        margin: 0 18px;
    }

    .sign-getbox .sign-boxward {
        width: 75px;
        height: 48px;
        background: url("../../../assets/icon/sn-box.png") no-repeat center;
    }

    .sign-getbox .sign-boxward.opened {
        background: url("../../../assets/icon/sn-box2.png") no-repeat center;
    }

    .sign-getbox .sign-boxward.noopen {
        background: url("../../../assets/icon/sn-box3.png") no-repeat center;
    }

    .sign-getbox .sign-dateward {
        display: table-row;
        font-size: 14px;
        font-weight: 400;
        color: #FF9000;
        text-align: center;
    }

    .sign-getbox .sign-pointward {
        display: table-row;
        font-size: 12px;
        font-weight: 400;
        color: #808080;
        text-align: center;
    }

    /*==================  ======================*/
    .sign-light { /*width:360px;height:220px;*/
        padding-top: 80px;
        background: url("../../../assets/icon/sn-bling.png") no-repeat center 0;
    }

    .sign-light-box {
        width: 300px;
        position: relative;
        height: 165px;
        margin-top: 23px;
        background: #0054FF;
        border-radius: 10px;
        padding-top: 36px;
    }

    .bling-box {
        width: 65px;
        height: 48px;
        background: url("../../../assets/icon/sn-box.png") no-repeat;
        position: absolute;
        top: -25px;
        left: 120px;
    }

    .bling-box-open {
        width: 65px;
        height: 48px;
        background: url("../../../assets/icon/sn-light.png") no-repeat;
        position: absolute;
        top: -25px;
        left: 120px;
    }

    .bling-error {
        width: 60px;
        height: 59px;
        background: url("../../../assets/icon/sign-error.png") no-repeat;
        position: absolute;
        top: -23px;
        left: 126px;
        background-size: 100%;
    }

    .bling-success {
        width: 60px;
        height: 59px;
        background: url("../../../assets/icon/sign-success.png") no-repeat;
        position: absolute;
        top: -32px;
        left: 118px;
    }

    .bling-title {
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
    }

    .bling-title span {
        width: 10px;
        height: 1px;
        background: #fff;
        display: inline-block;
        margin-right: 6px;
        vertical-align: 5px;
    }

    .bling-title em {
        width: 3px;
        height: 3px;
        background: #fff;
        border-radius: 50%;
        display: inline-block;
        margin-right: 10px;
        vertical-align: 4px;
    }

    .bling-title em.mr-left {
        margin-left: 10px;
        margin-right: 0;
    }

    .bling-title span.mr-left {
        margin-left: 6px;
        margin-right: 0;
    }

    .sign-ward {
        width: 313px;
        height: 80px;
        background: url("../../../assets/icon/sign-ward.png") no-repeat center;
        margin-top: 20px;
        margin-left: 24px;
        color: #407CFF;
        text-align: center;
    }

    .sign-ward2 {
        width: 250px;
        height: 106px;
        background: url("../../../assets/icon/sign-ward2.png") no-repeat center;
        margin-top: 5px;
        margin-left: 24px;
        color: #407CFF;
        text-align: center;
        background-size: 100%;
    }

    .sign-ward h5, .sign-ward2 h5 {
        font-size: 14px;
        font-weight: bold;
        line-height: 30px;
        color: #407CFF;
        padding-top: 10px;
    }

    .sign-ward2 h5.font16 {
        font-size: 16px;
    }

    .sign-ward2 .btn {
        width: 55px;
        height: 26px;
        line-height: 23px;
        font-size: 12px;
        background: #3F6BF4;
        border-radius: 3px;
        margin-top: 10px;
        padding: 0;
    }

    .padding-top48, .sign-ward2 h5.padding-top36 {
        padding-top: 36px;
    }

    /*==================  ======================*/
    .sign-rule-title {
        margin-left: 20px;
        padding-top: 40px;
        margin-right: 20px;
    }

    .sign-rule-title > .rule-btn {
        width: 40px;
        height: 40px;
        border: none;
        color: #fff;
        background: rgba(255, 144, 0, 1);
        border-radius: 50%;
        float: left;
    }

    .rule-btn .icon-daqiaguize {
        font-size: 20px;
    }

    .sign-rule-title > .rule-hd {
        float: left;
        width: 488px;
        font-size: 16px;
        line-height: 40px;
        color: #333333;
        font-weight: 600;
        border-bottom: 1px solid #D9E1EB;
        margin-left: 10px;
    }

    .sign-rule-content {
        color: #666666;
        font-size: 14px;
        line-height: 32px;
        padding: 10px 30px 53px 70px;
    }

    .main-div {
        border-radius: 5px;
    }

    /* Define an animation behavior */
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }

    /* This is the class name given by the Font Awesome component when icon contains 'spinner' */
    .fa-spinner {
        /* Apply 'spinner' keyframes looping once every second (1s)  */
        animation: spinner 2s linear infinite;
    }

    .loading-wrap {
        color: #666;
    }

    /*==================  ======================*/
    .modal-inner {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.5)
    }

    .sign-rule-box {
        width: 580px;
        position: absolute;
        border-radius: 5px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 10px 8px 0 rgba(77, 77, 77, 0.5);
        top: calc(50% - 188px);
        left: 50%;
        transform: translateX(-50%);
    }

    .sign-rule-box.fadeIn {
        animation-duration: 0.8s;
        animation-name: bounceInDown;
        -webkit-animation-name: bounceInDown;
    }

    .sign-rule-box.fadeout {
        animation-duration: 0.6s;
        animation-name: fadeOut;
        -webkit-animation-name: fadeOut;
        transform: translate(-50%, -30px);
    }

    .sign-rule-title {
        margin-left: 20px;
        padding-top: 40px;
        margin-right: 20px;
    }

    .sign-rule-title > .rule-btn {
        width: 40px;
        height: 40px;
        border: none;
        color: #fff;
        background: rgba(255, 144, 0, 1);
        border-radius: 50%;
        float: left;
    }

    .rule-btn .icon-daqiaguize {
        font-size: 20px;
    }

    .sign-rule-title > .rule-hd {
        float: left;
        width: 488px;
        font-size: 16px;
        line-height: 40px;
        color: #333333;
        font-weight: 600;
        border-bottom: 1px solid #D9E1EB;
        margin-left: 10px;
    }

    .sign-rule-content {
        color: #666666;
        font-size: 14px;
        line-height: 32px;
        padding: 10px 30px 53px 70px;
    }

    .sign-rule-content li {
        text-align: left;
    }

    @-webkit-keyframes bounceInDown {
        0% {
            opacity: 0;
            -webkit-transform: translateY(-30px) translateX(-50%);
            transform: translateY(-30px) translateX(-50%);
        }

        50% {
            opacity: 1;
            -webkit-transform: translateY(0px) translateX(-50%);
            transform: translateY(0px) translateX(-50%);
        }

        100% {
            -webkit-transform: translateY(0) translateX(-50%);
            transform: translateY(0) translateX(-50%);
        }
    }

    @keyframes bounceInDown {
        0% {
            opacity: 0;
            -webkit-transform: translateY(-30px) translateX(-50%);
            -ms-transform: translateY(-30px) translateX(-50%);
            transform: translateY(-30px) translateX(-50%);
        }

        50% {
            opacity: 1;
            -webkit-transform: translateY(0px) translateX(-50%);
            -ms-transform: translateY(0px) translateX(-50%);
            transform: translateY(0px) translateX(-50%);
        }

        100% {
            -webkit-transform: translateY(0) translateX(-50%);
            -ms-transform: translateY(0) translateX(-50%);
            transform: translateY(0) translateX(-50%);
        }
    }

    @-webkit-keyframes fadeOut {
        100% {
            opacity: 0;
            -webkit-transform: translateY(-30px) translateX(-50%);
            transform: translateY(-30px) translateX(-50%);
        }

        50% {
            opacity: 1;
            -webkit-transform: translateY(0px) translateX(-50%);
            transform: translateY(0px) translateX(-50%);
        }

        0% {
            -webkit-transform: translateY(0) translateX(-50%);
            transform: translateY(0) translateX(-50%);
        }
    }

    @keyframes fadeOut {
        100% {
            opacity: 0;
            -webkit-transform: translateY(-30px) translateX(-50%);
            -ms-transform: translateY(-30px) translateX(-50%);
            transform: translateY(-30px) translateX(-50%);
        }

        50% {
            opacity: 1;
            -webkit-transform: translateY(0px) translateX(-50%);
            -ms-transform: translateY(0px) translateX(-50%);
            transform: translateY(0px) translateX(-50%);
        }

        0% {
            -webkit-transform: translateY(0) translateX(-50%);
            -ms-transform: translateY(0) translateX(-50%);
            transform: translateY(0) translateX(-50%);
        }
    }
</style>
