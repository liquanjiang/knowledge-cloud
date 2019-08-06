<template>
    <div class="personal">
        <div class="person-bg-zone">
        </div>
        <div class="person-center">
            <!-- 头像基本信息区域 -->
            <div class="person-info-zone">
                <div class="face-img">
                    <img v-if="userInfo" :src="userInfo ? userInfo.iconb : ''" alt="">
                </div>
                <div class="personal-info">
                    <div class="name-div">{{userInfo ? userInfo.yhxm : ''}}</div>
                    <div class="sub-div">{{userInfo ? userInfo.dwmc : ''}}</div>
                </div>
                <div class="num-div">
                    <span class="public-text">发布模型</span>
                    <span class="public-times" @click="changeToPublish()">{{sums}}</span>
                </div>
                <div class="text-div">
                    <span class="clone-text">模型被克隆</span>
                    <span class="clone-times" @click="changeToPublish()">{{cloneTimes}}</span>
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
                <myhome v-if="currentIndex === 0" :userInfo="userDetails"
                        @toPublish="toPublish(0)"
                        @toClone="toClone(0)"></myhome>
                <!-- 我的发布 -->
                <mypublish v-if="currentIndex === 1" :userInfo="userDetails"></mypublish>
                <!-- 我的克隆 -->
                <myclone v-if="currentIndex === 2" :userInfo="userDetails"></myclone>
                <!-- 我的收藏 -->
                <myfav v-if="currentIndex === 3" :userInfo="userDetails"></myfav>
            </div>
        </div>
    </div>
</template>

<script>
import myclone from './clone'
import myfav from './fav'
import myhome from './home'
import mypublish from './publish'

export default {
    name: 'personal',
    components: {
        myclone: myclone,
        mypublish: mypublish,
        myfav: myfav,
        myhome: myhome
    },
    data: function () {
        return {
            userInfo: {
                iconb: '',
                yhxm: '',
                dwmc: ''
            },
            name: '',
            location: '',
            cloneTimes: 0,
            sums: 0,
            tabList: [
                { name: 'Ta的主页', value: 0 },
                { name: 'Ta的发布', value: 1 },
                { name: 'Ta的克隆', value: 2 },
                { name: 'Ta的收藏', value: 3 }
            ],
            currentIndex: 0,
            userId: this.$route.query.userId,
            userDetails: {
                yhbh: this.$route.query.userId,
                yhxm: this.$route.query.userName
            }
        }
    },
    watch: {
        $route () {
            console.log(this.$route.query.userId)
            this.userDetails = {
                yhbh: this.$route.query.userId,
                yhxm: this.$route.query.userName
            }
            this.getUserInfo()
            this.getMyInfo()
        }
    },
    created () {
        this.getUserInfo()
        this.getMyInfo()
    },
    mounted () {
        const top = this.$route.query.toTop
        if (top === 1) {
            document.body.scrollTop = 0
        }
    },
    methods: {
        changeIndex (index) {
            this.currentIndex = index
        },
        // 获取个人信息
        getUserInfo () {
            const that = this
            const param = {
                yhbh: this.$route.query.userId
            }
            this.$apiService.personalCenter.getMyInfo(param).then(res => {
                that.userInfo = res
                that.name = res.yhxm
                that.location = res.dwmc
            }).catch(res => {

            })
        },
        // 获取个人信息
        getMyInfo () {
            const param = {
                userId: this.$route.query.userId
            }
            this.$apiService.personalCenter.getUserInfo(param).then((res) => {
                if (res) {
                    this.cloneTimes = res.DOWNLOAD
                    this.sums = res.PUBLISH
                }
            })
        },
        // 点击发布模型次数或模型被克隆次数，跳转到我的发布
        changeToPublish () {
            this.currentIndex = 1
        },
        // 跳往我的发布
        toPublish () {
            this.currentIndex = 1
        },
        // 跳往我的克隆
        toClone () {
            this.currentIndex = 2
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
