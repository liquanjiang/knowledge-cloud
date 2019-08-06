<template>
    <div class="home-wrap">
        <div class="top-banner">
            <div class="banner-wrap clearfix">
                <div class="swipe-wrap">
                    <swipers></swipers>
                </div>
            </div>
        </div>
        <div class="recommend-wrap">
            <div class="recommend-content">
                <h2>实例场景</h2>
                <div class="list-seen">
                    <ul>
                        <li v-for="(item, index) in routerList" :key="index"
                            @click="toScene(item.id)">
                            <div class="div1">
                                <div class="img-div">
                                </div>
                                <div class="title-div">{{item.title}}</div>
                                <div class="sub-title-div">{{item.subTitle}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="block-chain">
            <h2>热门推荐</h2>
            <div class="model-list">
                <minds-list :type="'home'"></minds-list>
            </div>
        </div>
        <div class="top-list-zone">
            <h2>排行榜</h2>
            <div class="top-list-area">
                <toplist></toplist>
            </div>
        </div>
        <div class="shares-wrap">
            <h2>最新共享</h2>
            <div class="share-content">
                <share-list :fontSize="14" :eventType="2" :keyWord="'共享'" :platform="'模网平台'"></share-list>
            </div>
        </div>
    </div>
</template>

<script>
import mindsList from './mindsList/mindsList.vue'
import toplist from './toplist/toplist'
import ShareList from '../../components/knowledge/shareing'
import Swipers from './swipers/swipers'

export default {
    name: 'home',

    components: {
        toplist: toplist,
        Swipers: Swipers,
        ShareList: ShareList,
        mindsList: mindsList
    },

    data: function () {
        return {
            routerList: [
                { title: '流动人口智能感知预警', subTitle: '监控流动人员身份背景信息', id: 1 },
                { title: '景区扒窃前科人员监控', subTitle: '监控前科人员景区附近轨迹信息 ', id: 2 },
                { title: '涉黑恶-警情分析挖掘', subTitle: '模型体系搭建，提供线索', id: 3 }
            ],
            activeIndex: 0,
            interval: null
        }
    },

    mounted () {

    },

    methods: {
        toScene (id) {
            this.$router.push({ name: 'example', params: { id: id } })
        }
    },
    destroyed () {
        window.clearInterval(this.interval)
    }

}
</script>

<style scoped>

    .home-wrap {
        color: #262626;
    }

    .home-wrap h2 {
        font-size: 26px;
        font-weight: normal;
        color: #060f24;
        font-family: Microsoft YaHei, serif;
    }

    .top-banner {
        background: #fff;
        padding: 0;
        width: 100%;
        height: 530px;
    }

    .banner-wrap {
        position: relative;
        margin: 0 auto;
        width: 100%;
        height: 100%;
    }

    .swipe-wrap {
        float: left;
        padding: 0;
        text-align: left;
        width: 100%;
        height: 100%;
    }

    .recommend-wrap {
        height: 350px;
        background: #f5f5f5;
        margin: 0;
        padding: 0;
    }

    .recommend-wrap h2 {
        height: 100px;
        line-height: 100px;
        font-family: Microsoft YaHei, serif;
    }

    .recommend-content, .shares-wrap, .share-content {
        width: 1215px;
        margin: 0 auto;
        padding-left: 7px;
        position: relative;
    }

    .recommend-wrap .list-seen {
        width: 100%;
        height: 150px;
    }

    .recommend-wrap .list-seen ul {
        width: 100%;
        height: 150px;
    }

    .recommend-wrap .list-seen ul li {
        height: 150px;
        display: inline-block;
        background: #fff;
        width: 360px;
        margin-right: 30px;
        box-shadow: 0 0 9px 0 rgba(196, 206, 217, 0.6);
        cursor: pointer;
    }

    .recommend-wrap .list-seen ul li.active {
        background: linear-gradient(0deg, rgba(45, 89, 228, 1) 0%, rgba(102, 144, 254, 1) 100%);
    }

    .recommend-wrap .list-seen ul li:hover {
        background: linear-gradient(0deg, rgba(45, 89, 228, 1) 0%, rgba(102, 144, 254, 1) 100%);
    }

    .recommend-wrap .list-seen ul li div.div1 {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .recommend-wrap .list-seen ul li div.div1 div {
        position: absolute;
        background-repeat: no-repeat;
        background-size: 100%;
        text-align: left;
    }

    .recommend-wrap .list-seen ul li div.div1 .img-div {
        width: 66px;
        height: 66px;
        left: 50px;
        top: 40px;
    }

    .recommend-wrap .list-seen ul li:first-child div.div1 .img-div {
        background-image: url("../../assets/home/ld-1.png");
    }

    .recommend-wrap .list-seen ul li:first-child.active div.div1 .img-div {
        background-image: url("../../assets/home/ld-2.png");
    }

    .recommend-wrap .list-seen ul li:first-child:hover div.div1 .img-div {
        background-image: url("../../assets/home/ld-2.png");
    }

    .recommend-wrap .list-seen ul li:nth-child(2) div.div1 .img-div {
        background-image: url("../../assets/home/jq-1.png");
    }

    .recommend-wrap .list-seen ul li:nth-child(2).active div.div1 .img-div {
        background-image: url("../../assets/home/jq-2.png");
    }

    .recommend-wrap .list-seen ul li:nth-child(2):hover div.div1 .img-div {
        background-image: url("../../assets/home/jq-2.png");
    }

    .recommend-wrap .list-seen ul li:nth-child(3) div.div1 .img-div {
        background-image: url("../../assets/home/sh-1.png");
    }

    .recommend-wrap .list-seen ul li:nth-child(3).active div.div1 .img-div {
        background-image: url("../../assets/home/sh-2.png");
    }

    .recommend-wrap .list-seen ul li:nth-child(3):hover div.div1 .img-div {
        background-image: url("../../assets/home/sh-2.png");
    }

    .recommend-wrap .list-seen ul li div.div1 .title-div {
        width: 180px;
        height: 30px;
        color: #011749;
        font-weight: bold;
        font-size: 14px;
        left: 140px;
        top: 40px;
        line-height: 30px;
    }

    .recommend-wrap .list-seen ul li.active div.div1 .title-div {
        color: #fff;
    }

    .recommend-wrap .list-seen ul li.active div.div1 .sub-title-div {
        color: #fff;
    }

    .recommend-wrap .list-seen ul li:hover div.div1 .title-div {
        color: #fff;
    }

    .recommend-wrap .list-seen ul li:hover div.div1 .sub-title-div {
        color: #fff;
    }

    .recommend-wrap .list-seen ul li div.div1 .sub-title-div {
        color: #808080;
        width: 180px;
        height: 20px;
        font-weight: bold;
        font-size: 12px;
        left: 140px;
        top: 70px;
        line-height: 20px;
    }

    .recommend-content .recommend-label {
        display: inline-block;
        background-image: url("../../assets/icon/knowledge.png");
        width: 17px;
        height: 18px;
        margin-right: 10px;
        vertical-align: middle;
        background-position: -130px -10px;
    }

    .block-chain {
        background: #fff;
        height: 450px;
        width: 1215px;
        margin: 0 auto;
    }

    .block-chain h2 {
        height: 100px;
        line-height: 100px;
    }

    .top-list-zone {
        background: #f7f7f7;
        height: 500px;
        width: 100%;
        margin: 0 auto;
    }

    .top-list-zone h2 {
        height: 100px;
        line-height: 100px;
    }

    .top-list-area {
        width: 1215px;
        height: 400px;
        margin: 0 auto;
    }

    .shares-wrap {
        min-height: 630px;
    }

    .shares-wrap .share-content {
        margin-bottom: 30px;
    }

    .shares-wrap h2 {
        height: 100px;
        line-height: 100px;
        margin: 0;
    }

</style>
