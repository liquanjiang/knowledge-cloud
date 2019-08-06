<template>
    <div class="shareing know">
        <!-- -->
        <div>
            <ul class="line-container">
                <li class="line-line"></li>
                <li class="line-item clearfix" v-for="(item,index) in this.shareObj.list" :key="index">
                    <div class="item-symbol">{{item.eventDate}}</div>
                    <div class="item-tag" @click="toOtherPage(item)" :title="item.locationName">
                        <div class="item-circle"><img :src="item.iconb"/></div>
                        {{item.locationName}}
                    </div>
                    <div class="item-content">
                        <span title="去往Ta的主页" :style="fontStyle"
                              @click="toOtherPage(item)">
                            {{item.userName}}
                        </span>
                        {{keyWord}}了
                        <span :style="fontStyle" class="model-name-span" title="查看详情" @click="toDetails(item)">
                            {{`【${item.eventObj}】`}}
                        </span>
                        到{{platform}}。
                    </div>
                </li>
            </ul>
            <div class="center loading-div" v-if="shareObj.loading">
                <font-awesome-icon icon="spinner" pulse/>
                Loading...
            </div>
            <button type="button" class="show-btn" @click="getNewList('more')" v-if="shareObj.moreFlag && !hideMore">
                点击加载更多
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'shareing',
    props: {
        hideMore: Boolean,
        fontSize: {
            type: [Number, String],
            default: 14
        },
        fontColor: {
            type: String,
            default: '#666'
        },
        nameColor: {
            type: String,
            default: '#011749'
        },
        eventType: {
            type: [String, Number],
            default: 2
        },
        keyWord: {
            type: String,
            default: '发布'
        },
        platform: {
            type: String,
            default: '共享模型平台'
        },
        userId: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            shareObj: {
                loading: true,
                moreFlag: false
            },
            fontStyle: {
                'font-size': `${parseInt(this.fontSize)}px`,
                'color': this.fontColor
            },
            newParam: { page: 0, pageSize: 8, eventType: 0 },
            userInfo: null
        }
    },
    methods: {
        getNewList (type) {
            this.shareObj.loading = true
            this.newParam.eventType = this.eventType
            if (type === 'more') {
                this.newParam.page = this.newParam.page + 1
            }
            this.$apiService.knowledge.getNews(this.newParam).then(res => {
                this.shareObj.loading = false
                if (type === 'more') {
                    this.shareObj.list = [...this.shareObj.list, ...res.data]
                } else {
                    this.shareObj.list = res.data
                }
                this.shareObj.totalPages = res.totalPages
                this.shareObj.list.map((item) => {
                    const imgPic = require('../../assets/home/avatar-default.png')
                    item.iconb = item.iconb ? item.iconb : imgPic
                    item.eventDate = this.$util.formatDate(item.eventDate)
                })
                this.shareObj.moreFlag = this.shareObj.totalPages > this.newParam.page + 1
            })
        },
        getNewsTa (type) {
            this.shareObj.loading = true
            this.newParam.page = 1
            this.newParam.eventType = this.eventType
            this.newParam.userId = this.userId
            this.$apiService.personalCenter.getNews(this.newParam).then(res => {
                this.shareObj.loading = false
                if (type === 'more') {
                    this.shareObj.list = [...this.shareObj.list, ...res.list]
                } else {
                    this.shareObj.list = res.list
                }
                this.shareObj.totalPages = res.total
                this.shareObj.list.map((item) => {
                    const imgPic = require('../../assets/home/avatar-default.png')
                    item.iconb = item.iconb ? item.iconb : imgPic
                    item.eventDate = this.$util.formatDate(item.eventDate)
                })
                // this.shareObj.moreFlag = this.shareObj.totalPages > this.newParam.page + 1
            })
        },
        // 去往Ta的主页
        toOtherPage (item) {
            const yhbh = this.userInfo.yhbh
            const userId = item.userId
            const userName = item.userName
            if (userId !== yhbh) {
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
        // 点击名称眺望详情页
        toDetails (item) {
            const yhbh = this.userInfo.yhbh
            const taskId = item.taskId
            const type = this.eventType
            const isProd = process.env.NODE_ENV === 'production'
            const base = isProd ? window.location.origin : 'http://10.4.138.221:7017'
            const newAppUrl = this.$newAppUrl
            const url = `${base}${newAppUrl}/#/compare/${taskId}`
            // const detailsUrl = `${base}${newAppUrl}/#/modelDetail/${taskId}/${yhbh}/`
            if (type === 0) { // 跳到模型详情页
                window.open(url, '_blank')
            } else if (type === 2) { // 跳到作战空间共享模型
                // window.open(detailsUrl, '_blank')
            }
        }
    },
    created () {
        const user = window.localStorage.getItem('userInfo')
        this.userInfo = JSON.parse(decodeURIComponent(user))
    },
    mounted: function () {
        if (this.userId === '') {
            this.getNewList()
        } else {
            this.getNewsTa()
        }
    }
}
</script>

<style scoped>
    .line-container {
        position: relative;
    }

    .line-line {
        position: absolute;
        width: 1px;
        background: #E5E5E5;
        left: 45px;
        height: 100%;
        z-index: 1;
    }

    .line-container .line-item {
        line-height: 30px;
        position: relative;
        margin-bottom: 25px;
        z-index: 2;
    }

    .line-container .item-symbol {
        float: left;
        color: #333333;
        width: 90px;
        height: 30px;
        line-height: 28px;
        background: #F7F7F7;
        border: 1px solid #E6E6E6;
        border-radius: 15px;
        font-size: 12px;
    }

    .line-container .item-circle {
        float: left;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        margin-right: 10px;
        font-weight: 400;
    }

    .line-container .item-circle img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .line-container .item-tag {
        font-size: 14px;
        margin-left: 21px;
        float: left;
        text-align: left;
        color: #333;
        font-weight: 600;
        cursor: pointer;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .line-container .item-content {
        float: left;
        margin-left: 8px;
        font-size: 14px;
        color: #666666;
        height: 30px;
        line-height: 30px;
        width: calc(100% - 270px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
    }

    .line-container .item-content span {
        color: #3f6bf4;
        display: inline-block;
        margin-right: 3px;
        cursor: pointer;
        vertical-align: top;
        height: 30px;
        line-height: 30px;
    }

    .line-container .item-content span.model-name-span {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
    }

    .show-btn {
        margin-top: 20px;
        width: 100px;
        height: 30px;
        font-size: 12px;
        background: #FFFFFF;
        color: #808080;
        line-height: 28px;
        border: 1px solid #E6E6E6;
        border-radius: 15px;
    }
</style>
