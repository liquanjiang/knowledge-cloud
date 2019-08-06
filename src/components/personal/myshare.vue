<template>
    <div class="personal-model-list-zone">
        <div v-if="dataObj.itemsLoading" class="text-center loading">
            <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
            Loading...
        </div>
        <nodata v-if="dataObj.items.length === 0 && !dataObj.itemsLoading" :text="text"></nodata>
        <ul class="model-lists" v-show="dataObj.items.length > 0">
            <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                <ShareElement
                    @editShareModel="editModels"
                    @cancelShareModel="cancelModels"
                    :ModelIndex="index"
                    v-bind:item="item"
                    v-bind:manage-flag="false"></ShareElement>
            </li>
        </ul>
        <!-- 分页区域 -->
        <div class="page-zone person-page">
            <page v-if="showPage"
                  :showSize="false"
                  :pageSize="pageSize"
                  :pageIndex="pageNum"
                  @chosePage="chosePage"
                  :pageRowCount="pageCount"></page>
        </div>
        <!--   修改共享的窗口  -->
        <div class="window-out" v-if="modelWindow">
            <cancelShare :item="itemObj" @close="closeWindow"></cancelShare>
        </div>
    </div>
</template>

<script>
import ShareElement from './shareElement'
import cancelShare from './shareEite/cancelShare'

export default {
    name: 'myshare',
    components: {
        ShareElement: ShareElement,
        cancelShare: cancelShare
    },
    props: {
        userInfo: Object
    },
    data: function () {
        return {
            dataObj: {
                itemsLoading: true,
                items: [],
                datalist: [],
                picPath: '',
                tags: [],
                defaultActive: true
            },
            checkbox: [],
            showPage: true,
            pageSize: 10,
            pageNum: 1,
            pageCount: 0,
            modelWindow: false,
            itemObj: null,
            text: '您共享的模型会显示在这里'
        }
    },
    methods: {
        // 获取我的分享列表数据
        getLists () {
            this.dataObj.itemsLoading = true
            const param1 = {
                pageNum: this.pageNum,
                pageSize: 10
            }
            const param = {
                'createTime': '',
                'resultId': '',
                'shareDesc': '',
                'shareId': '',
                'shareName': '',
                'sharePic': '',
                'taskId': '',
                'useCount': null,
                'userId': this.userInfo.yhbh,
                'viewCount': null,
                pageNum: this.pageNum,
                pageSize: 10
            }

            this.$apiService.personalCenter.shareList(param, param1).then(res => {
                this.dataObj.items = res.list
                this.dataObj.itemsLoading = false
                this.pageCount = res.total
            }).catch()
        },
        // 切换分页的行为
        chosePage (params) {
            if (this.pageNum !== params.pageNum) {
                this.pageNum = params.pageNum
                this.getLists()
            }
        },
        // 打开编辑模型弹窗
        openWindow () {
            this.modelWindow = true
        },
        // 关闭窗口
        closeWindow (flag) {
            this.modelWindow = false
            if (flag) {
                this.getLists()
            }
        },
        // 编辑共享的模型
        editModels (item) {
            this.itemObj = item
            this.openWindow()
        },
        // 取消共享
        cancelModels (object) {
            const item = object.item
            const that = this
            const obj = {
                type: 1,
                id: item.resultId
            }
            this.$apiService.personalCenter.checkShare(obj).then(res => {
                if (res.state === 'true') {
                    that.cancelShare(item, object.index, true)
                } else {
                    that.$util.showConfirm('结果集未到共享截止期,取消会扣除您的共享积分哦~', function () {
                        that.cancelShare(item, object.index, false)
                    }, function () {
                    })
                }
            })
        },
        // 取消共享的模型
        cancelShare (item, index, flag) {
            const that = this
            const obj = {
                type: 2,
                resultId: item.resultId,
                taskId: item.taskId,
                shareName: item.shareName
            }
            if (flag) {
                that.$util.showConfirm('确定要取消该模型的共享吗？', function () {
                    that.doCancelShare(obj, index)
                }, function () {
                })
            } else {
                that.doCancelShare(obj, index)
            }
        },
        // 取消共享的请求
        doCancelShare (obj, index) {
            const that = this
            that.$apiService.personalCenter.EditShare(obj).then(res => {
                that.$util.showMessage('取消共享成功！', 'success')
                if (index !== 0) {
                    that.getLists()
                } else {
                    that.pageNum = that.pageNum > 1 ? that.pageNum - 1 : that.pageNum
                    that.getLists()
                }
            }).catch(res => {
                that.$util.showMessage('取消共享失败！' + res, 'error')
            })
        }
    },
    mounted () {
        this.getLists()
    }
}
</script>

<style scoped>
    .personal-model-list-zone {
        width: 100%;
        height: 700px;
        position: relative;
    }

    .personal-model-list-zone ul {
        margin: 0;
        padding: 0;
        text-align: left;
        height: 100%;
    }

    .model-lists li {
        width: 234px;
        margin-right: 10px;
        background-color: #ffffff;
        border: solid 1px #e4ebf3;
        float: left;
        margin-top: 10px;
        padding: 10px;
        position: relative;
        -webkit-box-shadow: 3px 0 3px #e9eef3;
        -moz-box-shadow: 3px 0 3px #e9eef3;
        transition-duration: .5s;
        box-shadow: 0 4px 3px 0 rgba(225, 232, 239, 0.75)
    }

    .model-lists li:hover {
        box-shadow: 3px 0 8px #bfbfbf;
        -webkit-box-shadow: 3px 0 8px #bfbfbf;
        -moz-box-shadow: 3px 0 8px #bfbfbf;
        transform: translate(0, -5px);
    }

    .loading {
        color: #333;
    }
</style>
