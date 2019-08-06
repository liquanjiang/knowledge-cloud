<template>
    <div class="knowledge back-white know" v-cloak>
        <div class="main-width padding-bom20">
            <div class="label-search clearfix">
                <span class="pull-left">所属警种:</span>
                <ul class="pull-left" :class="{'height46':!jzMore}">
                    <li v-for="(item,index) in jzLists" :key="index" :class="{'active':jzActive === item}"
                        @click="jzChange('jzActive',item)">{{item.JZNAME}}
                    </li>
                </ul>
                <a class="pull-left more" @click="showMore('jzMore')">{{jzMore?'收起':'更多'}}
                    <i class="iconfont" :class="jzMore?'icon-shouqi':'icon-more'"></i></a>
            </div>
            <div class="label-search clearfix" style="margin-top:10px;">
                <span class="pull-left">标签:</span>
                <ul class="pull-left" :class="{'height46':!tabMore}">
                    <li v-for="(item,index) in tabLists" :key="index" :class="{'active':tabActive === item}"
                        @click="jzChange('tabActive',item)">{{item.NAME}}
                    </li>
                </ul>
                <a class="pull-left more" @click="showMore('tabMore')">{{tabMore?'收起':'更多'}}<i class="iconfont"
                                                                                               :class="tabMore?'icon-shouqi':'icon-more'"></i></a>
            </div>
        </div>
        <div class="back-grey">
            <div class="main-width">
                <h3 class="jz-title">{{jzActive.JZNAME}}</h3>
                <div class="jz-sort clearfix">
                    <ul class="sort-label pull-left">
                        <li v-for="(li,index) in sortList" :key="index" :class="{'active':sortFlag === li}"
                            @click="sortChange(li)">{{li.name}}<i class="icon icon-sort"
                                                                  :class="{'icon-trans':li.flag==='asc'}"></i></li>
                    </ul>
                    <button type="button" class="publish-btn pull-right" v-b-modal.publish><i
                        class="icon icon-publish margin-right10"></i>发布模型
                    </button>
                </div>
                <div>
                    <div class="nodata" v-if="dataObj.items.length<1&&!dataObj.itemsLoading">
                        <nodata></nodata>
                    </div>
                    <ul class="model-lists clearfix">
                        <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                            <minds-element v-bind:item="item" v-bind:manage-flag="false"
                                           :modelClass="'know'"></minds-element>
                        </li>
                    </ul>
                    <div class="center" v-if="dataObj.itemsLoading">
                        <font-awesome-icon icon="spinner" pulse/>
                        Loading...
                    </div>
                    <button type="button" class="show-btn" @click="getLists('more')" v-if="dataObj.isMoreBtn">点击加载更多
                    </button>
                </div>
            </div>
        </div>
        <div class="main-width">
            <h3 class="jz-title margin-top30">最新知识分享动态</h3>
            <share-ing class="margin-bom50"></share-ing>
        </div>
        <!-- 发布模型窗口 -->
        <b-modal v-model="modelWindow" size="xxl" id="publish" centered title="发布模型到知识分享">
            <public-model @closeWindow="closeWindow" v-on:publish="getLists"></public-model>
            <div slot="modal-footer"></div>
        </b-modal>
    </div>
</template>

<script>
import MindsElement from '../personal/mindsElement.vue'
import ShareIng from './shareing.vue'
import PublicModel from '../personal/public-model'
import serve from '../../libs/apiService.js'

export default {
    name: 'knowledge',
    components: {
        MindsElement: MindsElement,
        ShareIng: ShareIng,
        PublicModel: PublicModel
    },
    data: function () {
        return {
            USERINFO: {},
            jzLists: [],
            jzMore: false,
            jzActive: { JZNAME: '全部', ID: '' },
            tabLists: [],
            tabActive: '',
            tabMore: false,
            sortFlag: {},
            modelWindow: false,
            dataObj: {
                itemsLoading: true,
                items: [],
                isMoreBtn: false
            },
            sortList: [{ name: '收藏', flag: 'asc', value: 'collectionTime' }, {
                name: '克隆',
                flag: 'asc',
                value: 'clonedTimes'
            }, { name: '耗分值', flag: 'asc', value: 'modelPoints' }],
            pubParam: {
                'page': 0,
                'pageSize': 10,
                'taskName': '',
                'endTime': '',
                'startTime': ''
            }
        }
    },
    methods: {
        // 打开发布模型弹窗
        openWindow () {
            this.modelWindow = true
        },
        // 关闭窗口
        closeWindow () {
            this.modelWindow = false
        },
        getJzs () {
            serve.knowledge.getJz({}).then(res => {
                this.jzLists = res
                this.jzLists.unshift({ JZNAME: '全部', ID: '' })
            })
        },
        getTabs () {
            serve.knowledge.getTabs({ name: '' }).then(res => {
                this.tabLists = res
                this.tabLists.unshift({ ID: '', NAME: '全部' })
            })
        },
        showMore (flag) {
            this[flag] = !this[flag]
        },
        jzChange (type, index) {
            this[type] = index
            if (type === 'tabActive') {
                this.pubParam.tagId = this.tabActive.ID
                this.getLists()
            }
            if (type === 'jzActive') {
                this.pubParam.jzId = this.jzActive.ID
                this.getLists()
            }
        },
        getLists (type) {
            this.dataObj.itemsLoading = true
            if (type === 'more') {
                this.pubParam.page++
            }
            serve.personalCenter.publishList(this.pubParam).then(res => {
                this.dataObj.itemsLoading = false
                if (type === 'more') {
                    this.dataObj.items = [...this.dataObj.items, ...res.data]
                } else {
                    this.dataObj.items = res.data
                }
                this.dataObj.totals = res.totalPages
                this.dataObj.isMoreBtn = this.dataObj.totals > this.pubParam.page + 1
            })
        },
        sortChange (item) {
            item.flag = item.flag === 'asc' ? 'desc' : 'asc'
            this.sortFlag = item
            this.pubParam.page = 0
            this.pubParam.orderCol = this.sortFlag.value
            this.pubParam.order = this.sortFlag.flag
            this.getLists()
        }
    },
    watch: {
        '$route' (to, from) {
            if (to.path.includes('knowledge')) {
                this.pubParam.page = 0
                this.pubParam.taskName = to.query.name
                this.getLists()
            }
        }
    },
    created: function () {
    },
    mounted: function () {
        const taskName = this.$route.query.name
        if (taskName) {
            this.pubParam.page = 0
            this.pubParam.taskName = taskName
        }
        this.getJzs()
        this.getTabs()
        this.getLists()
    }
}
</script>

<style scoped>
    @import "know.css";

    .knowledge {
        color: #333;
    }

    .nodata {
        position: relative;
        height: 350px;
    }

    .sort-label {
        width: 200px;
        height: 26px;
        margin-top: 14px;
        line-height: 26px;
        background: #FFFFFF;
        color: #666666;
        font-size: 12px;
        box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
        border-radius: 13px;
    }

    .sort-label li {
        border-color: transparent;
        background: #FFFFFF;
        text-align: center;
        float: left;
        cursor: pointer;
    }

    .sort-label li i {
        vertical-align: -4px;
        width: 16px;
        height: 16px;
        -webkit-background-size: inherit;
        fill: #fff;
        background: url("../../assets/icon/sort-grey.png");
    }

    .sort-label li:nth-child(1) {
        width: 65px;
        border-top-left-radius: 13px;
        border-bottom-left-radius: 13px;
    }

    .sort-label li:nth-child(2) {
        width: 57px;
    }

    .sort-label li:nth-child(3) {
        width: 78px;
        border-top-right-radius: 13px;
        border-bottom-right-radius: 13px;
    }

    .sort-label li.active {
        background: #3F6BF4;
        color: #fff;
    }

    .sort-label li.active i {
        background: url("../../assets/icon/sort-white.png");
    }

    .label-search {
        margin-top: 30px;
    }

    .label-search span {
        color: #4D4D4D;
        font-size: 14px;
        width: 65px;
        text-align: right;
    }

    .label-search ul {
        width: 1068px;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 14px;
        color: #333;
    }

    .height46 {
        height: 46px;
        overflow: hidden;
    }

    .label-search ul li {
        float: left;
        margin-left: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        padding: 0px 9px;
        height: 26px;
        line-height: 26px;
    }

    .label-search ul li.active {
        color: #fff;
        background: rgba(63, 107, 244, 1);
        border-radius: 13px;
    }

    .label-search a.more {
        color: #999999;
        font-size: 12px;
        cursor: pointer
    }

    .label-search a.more:hover {
        color: #3F6BF4;
    }

    .back-grey {
        padding: 40px 0;
    }

    .jz-title {
        font-size: 26px;
        font-weight: 400;
        color: #1A2138;
        text-align: left;
        margin-bottom: 27px;
    }

</style>
