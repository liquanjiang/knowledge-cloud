<template>
    <div class="example">
        <div class="banner">
            <div class="vedio-contain">
                <h3>{{exampleObj.name}}</h3>
                <video id="media" controls="controls" width="817" height="460" preload="auto"
                       :src="exampleObj.videoUrl">
                </video>
                <!--<div class="pause-back"></div>
                <div class="vedio-pause">
                    <div class="pause-icon"></div>
                </div>-->
            </div>
        </div>
        <div class="content clearfix">
            <div class="content-top">
                <dl class="content-effect margin-right30 pull-left">
                    <dt><img src="../../../assets/icon/ex-icon1.png"/></dt>
                    <dd>
                        <h5>实战效果</h5>
                        {{exampleObj.effect}}
                    </dd>
                </dl>
                <dl class="content-effect pull-left">
                    <dt><img src="../../../assets/icon/ex-icon2.png"/></dt>
                    <dd>
                        <h5>背景</h5>
                        {{exampleObj.backdrop}}
                    </dd>
                </dl>
            </div>
            <dl class="content-effect width-max pull-left">
                <dt><img src="../../../assets/icon/ex-icon3.png"/></dt>
                <dd>
                    <h5>思路</h5>
                    <p v-html="exampleObj.thinking"></p>
                </dd>
            </dl>
            <dl class="content-effect width-max pull-left">
                <dt><img src="../../../assets/icon/ex-icon4.png"/></dt>
                <dd>
                    <h5>操作步骤</h5>
                    <div class="step-cont" v-for="(item) in exampleObj.steps">
                        <h6 v-html="item.description"></h6>
                        <p v-for = "img in item.imgUrl.split(',')">
                            <img :src="urlPath+img"/>
                        </p>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
export default {
    name: 'example',
    data () {
        return {
            pramId: this.$route.params.id,
            exampleObj: {},
            urlPath: process.env.NODE_ENV === 'production' ? window.location.origin + '/m2/' : 'http://10.4.106.5:7017/m2/'
        }
    },
    methods: {
        getCaseScene () {
            this.$apiService.infoCount.getScenario({ id: this.pramId }).then(res => {
                this.exampleObj = res
                this.exampleObj.videoUrl = this.urlPath + this.exampleObj.videoUrl
            }).catch(err => {
                this.$util.showMessage(err.response.data.message || '获取场景案例失败！', 'error')
            })
        }
    },
    watch: {
        '$route' (to, from) {
            this.pramId = to.params.id
            if (this.pramId) {
                this.getCaseScene()
            }
        }
    },
    created () {
    },
    mounted () {
        this.getCaseScene()
    }
}
</script>

<style scoped>
    @import "../../knowledge/know.css";
    .example .banner {
        width: 100%;
        height: 600px;
        background: url("../../../assets/example.png") no-repeat 0px -56px;
    }

    .example .vedio-contain {
        width: 817px;
        height: 460px;
        position: relative;
        margin: 0 auto;
        z-index: 10;
    }

    .pause-back {
        width: 817px;
        height: 355px;
        position: absolute;
        background: #000000;
        left: 0;
        top: 105px;
        opacity: 0.2;
        z-index: 99;
    }
    p{margin-bottom: 0!important;}
    .vedio-pause {
        position: absolute;
        width: 110px;
        height: 110px;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.44);
        border-radius: 50%;
        z-index: 120;
        top: 175px;
        left: 50%;
        cursor: pointer;
        margin-left: -55px;
    }

    .vedio-pause .pause-icon {
        width: 85px;
        height: 85px;
        position: absolute;
        left: 12px;
        top: 12px;
        background-image: url("../../../assets/icon/pause.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #fff;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
        border-radius: 50%;
    }

    .example .vedio-contain h3 {
        font-size: 24px;
        font-family: MicrosoftYaHei;
        font-weight: 600;
        margin-bottom: 0;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
        padding: 35px 0 30px;
    }

    .example .vedio-contain video {
        height: 460px;
    }

    .example .content {
        width: 1170px;
        margin: 0 auto 50px;
    }
    .content-top{display:flex;}
    .content-effect {
        margin-top: 30px;
        width: 570px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 5px 0px rgba(213, 223, 233, 1);
        border-radius: 5px;
        padding: 40px 60px 35px 35px;
        font-size: 14px;
        min-height: 195px;
        color: #666666;
        line-height: 26px;
        text-align: left;
    }

    .content-effect dt {
        width: 54px;
        height: 54px;
        float: left;
    }

    .content-effect dd {
        width: calc(100% - 85px);
        margin-left: 30px;
        float: left;
    }

    .content-effect dd h5 {
        font-weight: bold;
        font-size: 18px;
        color: #333333;
    }

    .content-effect.width-max {
        width: 100%;
    }

    .step-cont h6 {
        font-size: 14px;
        font-weight: 400;
        line-height: 30px;
        color: #4D4D4D;
        margin-top: 28px;
        margin-bottom: 0;
    }

    .step-cont h6:first-child {
        margin-top: 10px;
    }

    .step-cont img {
        width: 949px;
        height: 535px;
        margin-top: 18px;
    }

</style>
