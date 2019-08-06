<template>
    <div class="personal">
        <div class="person-bg-zone">

        </div>
        <div class="person-center">
            <!-- 头像基本信息区域 -->
            <div class="person-info-zone">
                <div class="face-img" @click="toSetting(0)">
                    <img :src="obj.iconb" v-if="obj.iconb" alt="">
                </div>
                <div class="personal-info" @click="toSetting(1)">
                    <div class="name-div">{{obj.name}}</div>
                    <div class="sub-div">{{obj.dwmc}}</div>
                </div>
                <div class="num-div">
                    <span class="public-text">发布模型</span>
                    <span class="public-times" @click="toPublish()">{{sums}}</span>
                </div>
                <div class="text-div">
                    <span class="clone-text">模型被克隆</span>
                    <span class="clone-times" @click="changeToClone()">{{cloneTimes}}</span>
                </div>
            </div>
            <!-- 点击切换模型菜单区域 -->
            <div class="tab-list-zone">
                <ul>
                    <li v-for="(item, index) in tabList" :key="index"
                        @click="changeIndex(index)"
                        :class="{'active': currentIndex === index}">
                        {{item.name}}
                    </li>
                </ul>
                <!--<div class="manage-btn">管理</div>-->
            </div>
            <!-- 模型列表区域 -->
            <div class="data-list-zone">
                <!-- 我的主页 -->
                <myhome v-if="currentIndex === 0" :userInfo="userInfo" @toPublish="toPublish()"></myhome>
                <!-- 我的发布 -->
                <mypublish v-if="currentIndex === 1" :userInfo="userInfo"></mypublish>
                <!-- 我的上传 -->
                <myupload v-if="currentIndex === 2" :userInfo="userInfo"></myupload>
                <!-- 我的共享 -->
                <myshare v-if="currentIndex === 3" :userInfo="userInfo"></myshare>
                <!-- 我的克隆 -->
                <myclone v-if="currentIndex === 4" :userInfo="userInfo"></myclone>
                <!-- 我的收藏 -->
                <myfav v-if="currentIndex === 5" :userInfo="userInfo"></myfav>
            </div>
        </div>
    </div>
</template>

<script>
import myclone from './myclone'
import myfav from './myfav'
import myhome from './myhome'
import mypublish from './mypublish'
import myshare from './myshare'
import myupload from './myupload'

export default {
    name: 'personal',
    components: {
        myclone: myclone,
        mypublish: mypublish,
        myfav: myfav,
        myshare: myshare,
        myhome: myhome,
        myupload: myupload
    },
    data: function () {
        return {
            userInfo: null,
            obj: {
                iconb: '',
                dwmc: '',
                name: '',
            },
            cloneTimes: 0,
            sums: 0,
            tabList: [
                { name: '我的主页', value: 0 },
                { name: '我的发布', value: 1 },
                { name: '我的上传', value: 2 },
                { name: '我的共享', value: 3 },
                { name: '我的克隆', value: 4 },
                { name: '我的收藏', value: 5 }
            ],
            currentIndex: 0,
            urlPath: process.env.NODE_ENV === 'production' ? window.location.origin : 'http://10.4.106.5:7017'
        }
    },
    created () {
        const user = window.sessionStorage.getItem('userInfo')
        this.userInfo = JSON.parse(decodeURIComponent(user))
    },
    mounted () {
        document.body.scrollTop = 0
        this.getUserInfo()
        this.getMyInfo()
    },
    methods: {
        changeIndex (index) {
            this.currentIndex = index
        },
        // 获取个人信息
        getUserInfo () {
            const param = {
                userId: this.userInfo.yhbh
            }
            this.$apiService.personalCenter.getUserInfo(param).then((res) => {
                if (res) {
                    this.cloneTimes = res.DOWNLOAD
                    this.sums = res.PUBLISH
                }
            })
        },
        getMyInfo () {
            const that = this
            const param = {
                yhbh: this.userInfo.yhbh
            }
            this.$apiService.personalCenter.getMyInfo(param).then(res => {
                if (res.showYhnc === '1') {
                    that.obj.name = res.yhnc
                    window.localStorage.setItem('nameType', 'nick')
                } else {
                    that.obj.name = res.yhxm
                    window.localStorage.setItem('nameType', 'name')
                }
                if (res.iconb) {
                    that.obj.iconb = res.iconb
                }
                that.obj.dwmc = res.dwmc
            }).catch(res => {

            })
        },
        // 点击发布模型次数或模型被克隆次数，跳转到我的发布
        changeToClone () {
            this.currentIndex = 4
        },
        // 跳往我的发布
        toPublish () {
            this.currentIndex = 1
        },
        // 去往我的主页
        toSetting (index) {
            if (index === 0) { // 去往头像设置
                window.location.href = this.urlPath + this.$newAppUrl + '/#/preferences/headportrait'
            } else { // 去往个人信息设置
                window.location.href = this.urlPath + this.$newAppUrl + '/#/preferences/index'
            }
        }
    }
}
</script>

<style scoped>
    .personal {
        width: 100%;
        position: relative;
    }

    .person-bg-zone {
        width: 100%;
        height: 130px;
        background: #9CABD6;
    }

    .person-center {
        width: 1220px;
        height: auto;
        margin: 0 auto;
        position: relative;
        top: -50px;
    }

    .person-info-zone {
        height: 156px;
        position: relative;
    }

    .face-img {
        width: 100px;
        height: 100px;
        position: absolute;
        left: 50%;
        top: 0;
        border-radius: 50%;
        transform: translateX(-50%);
        cursor: pointer;
    }

    .face-img img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .personal-info {
        position: absolute;
        left: 50%;
        top: 110px;
        border-radius: 50%;
        transform: translateX(-50%);
        cursor: pointer;
    }

    .personal-info div.name-div {
        font-size: 16px;
        color: #333;
    }

    .personal-info div.sub-div {
        font-size: 12px;
        color: #a0a0a0;
    }

    .person-info-zone .num-div {
        width: 120px;
        height: 40px;
        position: absolute;
        left: 30%;
        top: -10px;
    }

    .person-info-zone .text-div {
        width: 120px;
        height: 40px;
        position: absolute;
        left: 62%;
        top: -10px;
    }

    .person-info-zone .num-div span, .text-div span {
        display: block;
        width: 120px;
    }

    .clone-times, .public-times {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        text-align: center;
    }

    .public-text, .clone-text {
        font-size: 12px;
        color: #fff;
    }

    .tab-list-zone {
        width: 100%;
        height: 40px;
        margin: 20px 0;
        position: relative;
    }

    .tab-list-zone .manage-btn {
        padding: 4px 20px;
        background: #3f6bf4;
        color: #fff;
        font-size: 12px;
        position: absolute;
        right: 10px;
        top: 0;
        border-radius: 4px;
        cursor: pointer;
    }

    .tab-list-zone ul {
        margin: 0;
        padding: 0;
        text-align: left;
        background: rgba(229, 233, 242, 0.5);
    }

    .tab-list-zone ul li {
        margin: 0;
        padding: 0;
        list-style: none;
        color: #333;
        display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
    }

    .tab-list-zone ul li:hover {
        background: #eee;
    }

    .tab-list-zone ul li.active {
        color: #fff;
        background: #3f6bf4;
    }

    .tab-list-zone ul li.active:hover {
        background: #3f6bf4;
    }

    .news-list {
        margin: 30px 0 50px 0;
        display: none;
    }

    .news-list .news-list-title {
        height: 40px;
        line-height: 40px;
        color: #333;
        position: relative;
    }

    .news-list .news-list-title .bg-div {
        width: 30px;
        height: 30px;
        background: #5cc85c;
        position: absolute;
        top: 0;
        left: 0;
    }

    .news-list .news-list-title h5 {
        width: 200px;
        height: 30px;
        line-height: 30px;
        position: absolute;
        left: 40px;
        top: 0;
        text-align: left;
    }

    .news-list ul {
        margin: 0;
        padding: 0;
        text-align: left;
    }

    .news-list ul li {
        list-style: none;
        color: #333;
        height: 30px;
        line-height: 30px;
        margin: 0 0 25px 0;
    }

    .news-list ul li .text-span {
        float: left;
    }

    .news-list ul li .time-span {
        float: right;
    }
</style>
