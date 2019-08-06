<template>
    <div :class="{'sign-light': type === 3 || type === 5}">
        <div class="sign-light-box">
            <span class="sign-close" @click="cancel()"><i class="iconfont icon-guanbi"></i></span>
            <div :class="{'bling-success': (type===0&&supple!==0), 'bling-error': (type===0 && supple === 0) || !(type === 3 || type === 5),
                  'bling-box-open':type===5, 'bling-box':type===3}"></div>
            <div class="sign-ward2" v-if="type === 0 && supple > 0">
                <h5 class="padding-top15 font16 no-margin">补打卡需要{{supPoint}}积分</h5>
                <p class="font12 ng-binding no-padding">本月剩余{{supple}}次补打卡机会</p>
                <button type="button" class="btn" @click="confirm()">确定</button>
            </div>
            <div class="sign-ward2" v-if="!(type === 0 && supple > 0)">
                <h5 class="padding-top36">{{message}}</h5>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sign-tip',
    props: {
        // 0---补打卡 2---未来打卡 3---获得宝箱 4---未来宝箱 5---打开宝箱 6---已领宝箱,
        type: {
            type: Number,
            default: 0
        },
        // 补打卡剩余次数
        supple: {
            type: Number,
            default: 0
        },
        // 宝箱积分
        point: {
            type: Number,
            default: 0
        },
        // 补打卡对象
        supplement: {
            type: Object,
            default: null
        },
        // 开启宝箱
        boxItem: {
            type: Object,
            default: null
        }
    },
    data: function () {
        return {
            message: '',
            supPoint: 0
        }
    },
    mounted () {
        switch (this.type) {
            case 0 :
                if (this.supple === 0) {
                    this.message = '您本月补打卡次数已用尽～'
                } else {
                    this.message = ''
                }
                break
            case 2:
                this.message = '时光机坏啦，不能穿梭未来～'
                break
            case 3 :
                this.message = '恭喜您获得宝箱！'
                break
            case 4:
                this.message = '再打卡几天就可以领了～'
                break
            case 5:
                this.message = `恭喜获得${this.point}积分`
                break
            case 6:
                this.message = '这个奖励已领过了～'
                break
        }
        // this.type === 0 && this.supple === 0 ? this.message = '您本月补打卡次数已用尽～'
        //     : this.type === 2 ? this.message = '时光机坏啦，不能穿梭未来～'
        //     : this.type === 3 ? this.message = '恭喜您获得宝箱！'
        //         : this.type === 4 ? this.message = '再打卡几天就可以领了～'
        //             : this.type === 5 ? this.message = `恭喜获得${this.point}积分`
        //                 : this.type === 6 ? this.message = '这个奖励已领过了～' : ''

        if (this.type === 0 && this.supple > 0) {
            this.getSupplePoint(this.supplement)
        }
        if (this.type === 5) {
            this.$apiService.signAbout.openSignBox({ boxNum: this.boxItem.boxNum }).then(() => {
            })
        }
    },
    destroyed () {

    },
    methods: {
        cancel (param) {
            if (this.type === 5) param = true
            this.$emit('on-cancel', param || false)
        },
        getSupplePoint (item) {
            this.$apiService.signAbout.supplePoint({ date: item.date }).then(data => {
                this.supPoint = data.point
            })
        },
        confirm () {
            this.$apiService.signAbout.repairSign({ date: this.supplement.date }).then(data => {
                this.cancel(true)
            })
        }
    }
}
</script>

<style scoped>
    .sign-light {
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

    .font12 {
        font-size: 12px;
    }

    .sign-ward2 p.no-padding {
        padding: 0;
        margin: 0;
    }

    .no-margin {
        margin: 0;
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
        color: #fff;
    }

    .padding-top48, .sign-ward2 h5.padding-top36 {
        padding-top: 36px;
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
</style>
