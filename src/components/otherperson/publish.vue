<template>
    <div class="personal-model-list-zone">
        <div v-if="dataObj.itemsLoading" class="text-center loading list-loading">
            <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
            Loading...
        </div>
        <div class="publish-btn" @click="openWindow()" v-if="false">发布模型</div>
        <div class="list-area">
            <nodata v-if="dataObj.items.length === 0 && !dataObj.itemsLoading"></nodata>
            <ul class="model-lists">
                <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                    <minds-element
                        @deleteModel="delModel"
                        @editModel="EditModel"
                        v-bind:item="item"
                        :allowEdit="false"
                        :modelClass="'publish'"
                        :ModelIndex="index"
                        v-bind:manage-flag="false">
                    </minds-element>
                </li>
            </ul>
        </div>
        <!-- 分页区域 -->
        <div class="page-zone">
            <page v-if="showPage"
                  :showSize="false"
                  :pageSize="pageSize"
                  :pageIndex="pageNum"
                  @chosePage="chosePage"
                  :pageRowCount="pageCount"></page>
        </div>

    </div>
</template>

<script>
import MindsElement from '../personal/mindsElement'
import page from './../conmon/page'

export default {
    name: 'mypublish',
    components: {
        MindsElement: MindsElement,
        page: page
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
            pageNum: 0,
            pageCount: 0,
            modelWindow: false,
            modelEditWindow: false
        }
    },
    methods: {
        // 获取我的发布列表数据
        getLists () {
            this.dataObj.itemsLoading = true
            const userInfo = this.userInfo
            const param = {
                'page': this.pageNum,
                'pageSize': 10,
                'taskName': '',
                'endTime': '',
                'startTime': '',
                taskType: '1',
                'userId': userInfo.yhbh,
                'loginId': userInfo.yhbh,
                yhbh: ''
            }
            this.dataObj.items = []

            this.$apiService.personalCenter.publishList(param).then(res => {
                this.dataObj.items = res.data
                this.dataObj.itemsLoading = false
                this.pageCount = res.totalCount
            })
        },
        // 切换分页的行为
        chosePage (params) {
            if (this.pageNum !== params.pageNum - 1) {
                this.pageNum = params.pageNum - 1
                this.getLists()
            }
        },
        // 打开发布模型弹窗
        openWindow () {
            this.modelWindow = true
        },
        // 关闭窗口
        closeWindow () {
            this.modelWindow = false
        },
        // 删除发布的模型
        delModel (item) {
            const that = this
            const param = {
                taskId: item.id
            }
            this.$Util.showConfirm('确定要删除模型吗？', function () {
                that.$apiService.personalCenter.delPublish(param).then((res) => {
                    that.$util.showMessage('删除模型成功', 'success')
                    that.getLists()
                }).catch((res) => {
                    that.$util.showMessage('删除模型失败', 'error')
                    that.getLists()
                })
            }, function () {
            })
        },
        // 编辑发布的模型
        EditModel ($event) {
            this.openWindow()
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
        height: 750px;
        position: relative;
    }

    .list-area {
        margin: 0;
        padding: 0;
        text-align: left;
        height: calc(100% - 30px);
        position: relative;
    }

    .personal-model-list-zone ul.model-lists {
        width: 100%;
        margin: 0;
        padding: 0;
        text-align: left;
        height: 100%;
        position: relative;
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

    .publish-btn {
        width: 110px;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        background-color: #3f6bf4;
        background-image: url("../../assets/personal/public/public.svg");
        background-size: 20px 16px;
        background-repeat: no-repeat;
        background-position: 15px 8px;
        color: #fff;
        position: absolute;
        text-align: center;
        right: 10px;
        top: 0;
        font-size: 12px;
        text-indent: 15px;
        cursor: pointer;
    }

</style>
