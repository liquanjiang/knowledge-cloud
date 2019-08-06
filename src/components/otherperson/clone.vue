<template>
    <div class="personal-model-list-zone">
        <div v-if="dataObj.itemsLoading" class="text-center loading list-loading">
            <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
            Loading...
        </div>
        <nodata v-if="dataObj.items.length === 0 && !dataObj.itemsLoading"></nodata>
        <ul class="model-lists">
            <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                <minds-element
                    @deleteModel="deleteClone"
                    v-bind:item="item"
                    :allowEdit="false"
                    :modelClass="'clone'"
                    :isOtherUser="true"
                    :ModelIndex="index"
                    v-bind:manage-flag="false"></minds-element>
            </li>
        </ul>
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
    name: 'myclone',
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
            pageNum: 1,
            pageCount: 0
        }
    },
    methods: {
        // 获取我的克隆列表数据
        getLists () {
            this.dataObj.itemsLoading = true
            const userInfo = this.userInfo
            const param = {
                cloneFlag: 1,
                'page': this.pageNum,
                'pageSize': 10,
                'taskName': '',
                'endTime': '',
                'startTime': '',
                'yhbh': '',
                'userId': userInfo.yhbh
            }
            this.dataObj.items = []
            this.$apiService.personalCenter.cloneList(param).then(res => {
                this.dataObj.items = res.list
                this.dataObj.itemsLoading = false
                this.pageCount = res.total
            })
        },
        // 切换分页的行为
        chosePage (params) {
            if (this.pageNum !== params.pageNum) {
                this.pageNum = params.pageNum
                this.getLists()
            }
        },
        // 删除已克隆的模型
        deleteClone (item) {
            const that = this
            const taskId = item.cloneTaskId
            const param = [taskId]
            this.$Util.showConfirm('确定要删除该克隆模型吗？', function () {
                that.$apiService.personalCenter.deleteClone(param).then((res) => {
                    that.$Util.showMessage('删除克隆成功!', 'success')
                    that.getLists()
                }).catch(res => {

                })
            }, function () {
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
