<template>
    <div>
        <div class="marquee-wrap clearfix">
            <!--<ul>-->
            <!--<li ng-repeat="item in vm.newsStrs track by $index">{{item}}</li>-->
            <!--</ul>-->
            <div class="title-wrap">
                <span class="marquee-title marginLeft marquee-user">用户</span>
                <span class="marquee-title trade-id">交易ID</span>
                <span class="marquee-title marquee-thing">事件</span>
                <span class="marquee-title marquee-integral">积分</span>
                <span class="marquee-title">交易时间</span>
            </div>
            <div class="microsoft container">
                <ul class="marquee">
                    <li v-for="(item, index) in items" v-bind:key="index">
                        <span class="marquee-content marquee-user">{{item.userName}}</span>
                        <span class="marquee-content trade-id">{{item.txHash.substring(0,20)}}</span>
                        <span class="marquee-content marquee-thing">{{item.details}}</span>
                        <span class="marquee-content marquee-integral">{{item.points}}</span>
                        <span class="marquee-content">{{item.operateTime | dateFormatMill}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import apiService from '../../../libs/apiService'

export default {
    name: 'play-words',

    mounted () {
        let that = this
        this.getMarqueeInfo()
        this.interval = window.setInterval(function () {
            that.getMarqueeInfo()
        }, 15000)
    },
    destroyed () {
        window.clearInterval(this.interval)
    },

    data: function () {
        return {
            items: [],
            firstHash: null,
            interval: null
        }
    },

    methods: {
        showMarquees (data) {
            if (!data.length) {
                return
            }
            if (data.length > 14) {
                this.items = data.splice(0, 15)
            } else {
                this.items.splice(0, data.length)
                this.items = this.items.concat(data)
            }
        },
        getMarqueeInfo () {
            let param = { start: this.firstHash, pass: true }
            apiService.infoCount.getPlayWords(param).then(res => {
                this.firstHash = res.length ? res[0].operateTime : this.firstHash
                this.showMarquees(res)
            })
        }
    }
}
</script>

<style scoped>
    .marquee-wrap .container {
        width: 100%;
        height: 18em;
        margin: 0 auto;
        overflow: hidden;
        background: inherit;
        position: relative;
        box-sizing: border-box;
    }

    .marquee-wrap .marquee {
        top: 6em;
        position: relative;
        box-sizing: border-box;
        animation: marquee 10s linear infinite forwards;
    }

    .marquee-wrap .marquee:hover {
        animation-play-state: paused;
    }

    /* Make it move! */
    @keyframes marquee {
        0% {
            transform: translate3d(0, -6em, 0);
            -ms-transform: translate3d(0, -6em, 0); /* IE 9 */
            -moz-transform: translate3d(0, -6em, 0); /* Firefox */
            -webkit-transform: translate3d(0, -6em, 0); /* Safari 和 Chrome */
            -o-transform: translate3d(0, -6em, 0); /* Opera */
        }
        100% {
            transform: translate3d(0, -18em, 0);
            -ms-transform: translate3d(0, -18em, 0); /* IE 9 */
            -moz-transform: translate3d(0, -18em, 0); /* Firefox */
            -webkit-transform: translate3d(0, -18em, 0); /* Safari 和 Chrome */
            -o-transform: translate3d(0, -18em, 0); /* Opera */
        }
    }

    .microsoft:before, .microsoft::before,
    .microsoft:after, .microsoft::after {
        left: 0;
        z-index: 1;
        content: '';
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 2em;
        /*background-image: linear-gradient(180deg, #FFF, rgba(255,255,255,0));*/
    }

    .microsoft:after, .microsoft::after {
        bottom: 0;
        transform: rotate(180deg);
    }

    .microsoft:before, .microsoft::before {
        top: 0;
    }

    .title-wrap {
        margin-bottom: 30px;
    }

    .marquee-title {
        font-weight: bold;
        display: inline-block;
        width: 200px;
        /*vertical-align: middle;*/
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
    }

    .marquee-content {
        display: inline-block;
        width: 200px;
        vertical-align: middle;
        color: #666;
        font-size: 12px;
    }

    .marquee-wrap .container ul li {
        /*text-indent: 35px;*/
        list-style: none;
    }

    .marquee-wrap .marginLeft {
        /*margin-left: 89px;*/
    }

    .marquee-wrap {
        width: 98%;
        /*margin: 15px 0;*/
        /*padding: 10px 15px;*/
    }

    .marquee-wrap ul li {
        padding: 5px;
        border-bottom: 1px solid #E6E6E6;
        cursor: pointer;
    }

    .marquee-wrap ul li:hover {
        /*box-shadow: 0 0 2px #00b3ee;*/
        background: rgba(255, 255, 255, 1);
        /*opacity:0.7;*/
        box-shadow: 0 0 5px #dee4ea;
        -webkit-box-shadow: 0 0 5px #dee4ea;
        -moz-box-shadow: 0 0 5px #dee4ea;
    }

    .marquee-user {
        width: 155px;
    }

    .trade-id {
        width: 267px;
    }

    .marquee-thing {
        width: 180px;
    }

</style>
