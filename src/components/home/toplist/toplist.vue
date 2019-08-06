<template>
    <div class="top3-list-zone" @mouseenter="clearInter()" @mouseleave="setInter">
        <!-- 标签页切换区域 -->
        <div class="tab-list">
            <ul>
                <li v-for="(item, index) in tabList" :key="index"
                    @click="changeTab(index)"
                    :class="{'active': currentIndex === index}">
                    {{item.name}}
                </li>
            </ul>
        </div>
        <!-- 排行榜背景图片区域 -->
        <div class="back-img"></div>
        <!-- 排行榜列表区域 -->
        <div class="list-zone">
            <!-- 知识分享排行榜 -->
            <div class="know-list-zone  list-area" v-show="currentIndex === 0">
                <div v-if="knowledgeList.loading" class="text-center">
                    <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
                    Loading...
                </div>
                <ul v-show="!knowledgeList.loading">
                    <li v-for="(item, index) in knowledgeList.list" :key="index"
                        :style="{ top: (index < 5 ? index : index -5 ) * 60 + 'px', left: Math.floor(index / 5) * 350 + 'px'}">
                        <span class="icon-span">
                            {{ dealIndex(index, item.num) }}
                        </span>
                        <span class="name-span" :title="item.name">
                            {{dealString(item.name, 9)}}
                        </span>
                        <span class="num-span">
                            {{item.total}}
                        </span>
                    </li>
                </ul>
            </div>
            <!-- 共享模型排行榜 -->
            <div class="know-list-zone list-area" v-show="currentIndex === 1">
                <ul>
                    <li v-for="(item, index) in shareList.list" :key="index"
                        :style="{ top: (index < 5 ? index : index -5 ) * 60 + 'px', left: Math.floor(index / 5) * 350 + 'px'}">
                        <span class="icon-span">
                            {{ dealIndex(index, item.num) }}
                        </span>
                        <span class="name-span" :title="item.name">
                            {{dealString(item.name, 9)}}
                        </span>
                        <span class="num-span">
                            {{item.total}}
                        </span>
                    </li>
                </ul>
            </div>
            <!-- 共享数据排行榜 -->
            <div class="know-list-zone list-area" v-show="currentIndex === 2">
                <ul>
                    <li v-for="(item, index) in dataList.list" :key="index"
                        :style="{ top: (index < 5 ? index : index -5 ) * 60 + 'px', left: Math.floor(index / 5) * 350 + 'px'}">
                        <span class="icon-span">
                            {{ dealIndex(index, item.num) }}
                        </span>
                        <span class="name-span" :title="item.name">
                            {{dealString(item.name, 9)}}
                        </span>
                        <span class="num-span">
                            {{item.total}}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'toplist',
    data: function () {
        return {
            knowledgeList: {
                list: [],
                loading: false
            },
            shareList: {
                list: [],
                loading: false
            },
            dataList: {
                list: [],
                loading: false
            },
            tabList: [
                { name: '知识分享排行榜' },
                { name: '共享模型排行榜' },
                { name: '共享数据排行榜' }
            ],
            currentIndex: 0,
            interval: null
        }
    },
    methods: {
        // 切换标签
        changeTab (index) {
            this.currentIndex = index
        },
        // 处理字符串方法
        dealString (str, len) {
            return this.$util.dealString(str, len)
        },
        // 处理带0的序号字符串方法
        dealIndex (index, str) {
            if (!str) {
                return ''
            } else {
                return index < 9 ? '0' + str : str
            }
        },
        // 获取列表数据
        getDataList (index) {
            const that = this
            const param = {
                type: index
            }
            that.knowledgeList.loading = true
            that.shareList.loading = true
            that.dataList.loading = true
            this.$apiService.home.getTopList(param).then(res => {
                if (index === 1) {
                    that.knowledgeList.list = res
                } else if (index === 2) {
                    that.shareList.list = res
                } else if (index === 3) {
                    that.dataList.list = res
                }
                that.hideLoading()
            }).catch(res => {
                that.hideLoading()
            })
        },
        // 隐藏加载动画
        hideLoading () {
            const that = this
            that.knowledgeList.loading = false
            that.shareList.loading = false
            that.dataList.loading = false
        },
        // 设置排行榜自动切换
        setInter () {
            const that = this
            this.interval = window.setInterval(function () {
                if (that.currentIndex < 2) {
                    that.currentIndex += 1
                } else {
                    that.currentIndex = 0
                }
            }, 3000)
        },
        // 清除定时器
        clearInter () {
            window.clearInterval(this.interval)
        }
    },

    mounted () {
        this.getDataList(1)
        this.getDataList(2)
        this.getDataList(3)
        this.setInter()
    },
    destroyed () {
        window.clearInterval(this.interval)
    }
}
</script>

<style scoped>
    .top3-list-zone {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .top3-list-zone .back-img {
        position: absolute;
        width: 268px;
        height: 248px;
        top: 70px;
        left: 140px;
        background-image: url("../../../assets/home/toplist.png");
        background-repeat: no-repeat;
    }

    .top3-list-zone .tab-list {
        width: 540px;
        height: 40px;
        margin: 0 auto;
    }

    .top3-list-zone .tab-list ul {
        width: 540px;
        height: 40px;
        margin: 0;
        padding: 0;
        border-bottom: 1px solid #d9dfe9;
    }

    .top3-list-zone .tab-list ul li {
        width: 180px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        cursor: pointer;
    }

    .top3-list-zone .tab-list ul li.active {
        border-bottom: 2px solid #3f6bf4;
    }

    .list-zone {
        width: 700px;
        height: 335px;
        position: absolute;
        left: 520px;
        top: 55px;
    }

    .list-zone .list-area {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .list-zone .list-area ul {
        margin: 0;
        padding: 0;
    }

    .list-zone .list-area ul li {
        width: 300px;
        height: 60px;
        position: absolute;
    }

    .list-zone .list-area ul li span {
        height: 50px;
        line-height: 50px;
        display: inline-block;
        position: relative;
        font-size: 14px;
        vertical-align: top;
    }

    .list-zone .list-area ul li span.icon-span {
        width: 30px;
        line-height: 50px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 30px 45px;
        margin-right: 20px;
        background-position: 0 5px;
    }

    .list-zone .list-area ul li:first-child span.icon-span {
        background-image: url("../../../assets/home/1st.png");
        color: transparent;
    }

    .list-zone .list-area ul li:nth-child(2) span.icon-span {
        background-image: url("../../../assets/home/2nd.png");
        color: transparent;
    }

    .list-zone .list-area ul li:nth-child(3) span.icon-span {
        background-image: url("../../../assets/home/3rd.png");
        color: transparent;
    }

    .list-zone .list-area ul li span.name-span {
        width: 150px;
        margin-right: 20px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .list-zone .list-area ul li span.num-span {
        width: 80px;
        text-align: left;
        font-size: 16px;
        color: #060f24;
    }

</style>
