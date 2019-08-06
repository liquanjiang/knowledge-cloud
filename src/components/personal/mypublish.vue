<template>
    <div class="personal-model-list-zone">
        <div v-if="dataObj.itemsLoading" class="text-center loading list-loading">
            <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
            Loading...
        </div>
        <div class="publish-btn" @click="openWindow()">发布模型</div>
        <div class="list-area">
            <nodata v-if="dataObj.items.length === 0 && !dataObj.itemsLoading" :text="text"></nodata>
            <ul class="model-lists" v-show="dataObj.items.length > 0">
                <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                    <minds-element
                        @deleteModel="delModel"
                        @editModel="EditModel"
                        v-bind:item="item"
                        :allowEdit="true"
                        :modelClass="'publish'"
                        :ModelIndex="index"
                        v-bind:manage-flag="false">
                    </minds-element>
                </li>
            </ul>
        </div>
        <!-- 分页区域 -->
        <div class="page-zone person-page">
            <page v-if="showPage"
                  :showSize="false"
                  :pageSize="pageSize"
                  :pageIndex="pageNum"
                  @chosePage="chosePage"
                  :pageRowCount="pageCount"></page>
        </div>
        <!-- 发布模型窗口 -->
        <b-modal v-model="modelWindow" size="xxl" id="publish" centered title="发布模型到知识分享">
            <public-model @closeWindow="closeWindow" v-on:publish="getLists"></public-model>
            <div slot="modal-footer"></div>
        </b-modal>
        <!-- 修改模型窗口 -->
        <b-modal v-model="editWindow" size="xxl" id="publish2" centered :title="'编辑发布的模型·' + editModelName">
            <edit-model @closeWindow="closeEditWindow" v-on:publish="getLists" :item="editItem"></edit-model>
            <div slot="modal-footer"></div>
        </b-modal>
    </div>
</template>

<script>
import MindsElement from './mindsElement'
import publicModel from './public-model'
import editModel from './edit-model'

export default {
    name: 'mypublish',
    components: {
        MindsElement: MindsElement,
        publicModel: publicModel,
        editModel: editModel
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
            editWindow: false,
            editModelName: '',
            editItem: null,
            text: '您发布的模型会显示在这里'
        }
    },
    methods: {
        // 获取我的发布列表数据
        getLists () {
            this.dataObj.itemsLoading = true
            const userInfo = this.userInfo
            const param = {
                'page': this.pageNum - 1,
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
            if (this.pageNum !== params.pageNum) {
                this.pageNum = params.pageNum
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
        // 打开发布模型弹窗
        openEditWindow () {
            this.editWindow = true
        },
        // 关闭窗口
        closeEditWindow () {
            this.editWindow = false
        },
        // 删除发布的模型
        delModel (obj) {
            const item = obj.item
            const index = obj.index
            const that = this
            const param = {
                taskId: item.id
            }
            this.$Util.showConfirm('确定要删除模型吗？', function () {
                that.$apiService.personalCenter.delPublish(param).then((res) => {
                    that.$util.showMessage('删除模型成功', 'success')
                    if (index !== 0) {
                        that.getLists()
                    } else {
                        that.pageNum = that.pageNum > 1 ? that.pageNum - 1 : that.pageNum
                        that.getLists()
                    }
                }).catch((res) => {
                    that.$util.showMessage('删除模型失败', 'error')
                })
            }, function () {
            })
        },
        // 编辑发布的模型
        EditModel ($event) {
            this.editModelName = $event.name
            this.editItem = $event
            this.openEditWindow()
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
        height: 730px;
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

    .list-area {
        margin: 0;
        padding: 0;
        text-align: left;
        height: calc(100% - 30px);
        position: relative;
        top: 30px;
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
        transition-duration: 1s;
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
