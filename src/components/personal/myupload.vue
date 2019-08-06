<template>
    <div class="personal-model-list-zone">
        <!-- 视图类型切换按钮 -->
        <div class="buttons-zone">
            <!-- 模型视图 -->
            <div class="model-btn" title="模型视图"
                 :class="{ 'active': currentModel === 0}"
                 @click="changeModel(0)"></div>
            <!-- 列表视图 -->
            <div class="list-btn" title="列表视图"
                 :class="{ 'active': currentModel === 1}"
                 @click="changeModel(1)"></div>
            <!-- 功能按钮 -->
            <div class="model-type" @click="downloadModel()" title="点击下载模板样例">模板样例</div>
            <div class="upload-source" @click="openUpWindow">
                <span class="icon-span"></span>
                <span class="text-span">上传资源</span>
            </div>
        </div>
        <div v-if="dataObj.itemsLoading" class="text-center loading">
            <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
            Loading...
        </div>
        <nodata v-if="dataObj.items.length === 0 && !dataObj.itemsLoading" v-cloak :text="text"></nodata>
        <!-- 模型列表区域 -->
        <ul class="model-lists" v-show="showModel && dataObj.items.length > 0 &&  !dataObj.itemsLoading">
            <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                <excel-element
                    @editExcel="editExcel"
                    @deleteExcel="delExcel"
                    @detailsMore="seeMore"
                    :index="index"
                    :item="item"
                ></excel-element>
            </li>
        </ul>
        <!-- 普通列表区域 -->
        <div class="connom-list-header" v-show="!showModel && dataObj.items.length > 0 &&  !dataObj.itemsLoading">
            <span class="source-name">资源名称</span>
            <span class="source-count">资源总量</span>
            <span class="source-time">上传时间</span>
        </div>
        <ul class="common-list" v-show="!showModel && dataObj.items.length > 0 &&   !dataObj.itemsLoading">
            <li v-for="(item, index) in listData"
                @click="selectList(item, index)"
                :key="index"
                :class="{'active': currentList === index}">
                <span class="icon-span"></span>
                <span class="name-span">
                    <span>{{item.sourceName}}</span>
                    <span class="btns-zone">
                        <!-- 查看次数 -->
                        <span class="see-times" title="查看" @click="seeMore (item)">
                            <span class="see-icon"></span>
                            <span class="see-text">{{item.viewCount || 0}}</span>
                        </span>
                        <!-- 操作次数 -->
                          <span class="operate-times">
                            <span class="operate-icon"></span>
                            <span class="see-text">{{item.useCount || 0}}</span>
                        </span>
                        <!-- 编辑按钮 -->
                          <span class="edit-btn" title="编辑" @click="editExcel(item)">
                          </span>
                        <!-- 删除按钮 -->
                          <span class="del-btn" title="删除" @click="deleteExcel(item)">
                          </span>
                    </span>
                </span>
                <span class="count-span">{{item.dataCount}}</span>
                <span class="time-span">{{item.createTime.substring(0,19)}}</span>
            </li>
        </ul>
        <!-- 分页区域 -->
        <div class="page-zone  person-page">
            <page v-if="showPage"
                  :showSize="false"
                  :pageSize="pageSize"
                  :pageIndex="pageNum"
                  @chosePage="chosePage"
                  :pageRowCount="pageCount"></page>
        </div>
        <!-- 上传模型窗口 -->
        <div class="window-out" v-if="modelWindow">
            <newModel
                :itemObj="fileObject"
                :fileName="fileName"
                :yhbh="userInfo.yhbh"
                @closeWindow="closeNewWindow">
            </newModel>
        </div>
        <!-- 编辑模型窗口 -->
        <div class="window-out" v-if="editWindow">
            <editModel
                :itemObj="editObj"
                :yhbh="userInfo.yhbh"
                @closeWindow="closeEditWindow">
            </editModel>
        </div>
        <!-- 查看上传详情窗口 -->
        <div class="window-out" v-if="moreWindow">
            <seeModel
                :itemObj="seeObj"
                :yhbh="userInfo.yhbh"
                @closeWindow="closeSeeWindow">
            </seeModel>
        </div>
        <div class="window-out" v-if="upWindow">
            <div class="edit-window">
                <div class="window-content new-upload-window" style="width:500px;height:200px;">
                    <div class="window-header">
                        <h4 style="text-align:center">文件上传</h4>
                        <span @click="closeUpWindow()"></span>
                    </div>
                    <div class="up-file-form">
                        <input type="file" ref="uploadfile"
                               accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                    </div>
                    <div class="window-footer">
                        <div class="confirm-save" @click="uploadFile()">上传</div>
                        <div class="cancel-close" @click="closeUpWindow()">关闭</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import excelElement from './excelElement'
import newModel from './upload/newWindow'
import editModel from './upload/editWindow'
import seeModel from './upload/seeWindow'

export default {
    name: 'myupload',
    components: {
        excelElement: excelElement,
        newModel: newModel,
        editModel: editModel,
        seeModel: seeModel
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
            currentModel: 0,
            showModel: true, // 是否显示模型视图
            listData: [],
            currentList: null,
            File: null,
            modelWindow: false,
            editWindow: false,
            moreWindow: false,
            upWindow: false,
            fileObject: null,
            fileName: '',
            editObj: null,
            seeObj: null,
            text: '暂无上传的资源'
        }
    },
    methods: {
        // 获取我的克隆列表数据
        getLists () {
            this.dataObj.itemsLoading = true
            const param1 = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            const param = {
                'createTime': '',
                'dataCount': '',
                'resultId': '',
                'sourceEnName': '',
                'sourceName': '',
                'sourceNum': '',
                'sourcePic': '',
                'taskId': '',
                'useCount': '',
                'userId': this.userInfo.yhbh,
                'viewCount': '',
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }

            this.$apiService.personalCenter.uploadList(param, param1).then(res => {
                this.dataObj.items = res.list
                this.listData = res.list
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
        // 切换视图类型和列表之间的转换
        changeModel (num) {
            this.currentModel = num
            this.showModel = (num === 0)
        },
        // 选中列表视图中的列表元素
        selectList (item, index) {
            this.currentList = index
        },
        // 下载模板文件
        downloadModel () {
            const urlPath = process.env.NODE_ENV === 'production' ? window.location.origin + '/resource/temp.csv' : 'http://10.4.106.5:7017/resource/temp.csv'
            window.location.href = urlPath
        },
        // 打开上传文件解析弹窗
        openWindow () {
            this.modelWindow = true
        },
        openEditWindow () {
            this.editWindow = true
        },
        closeUpWindow () {
            const inputDOM = this.$refs.uploadfile
            // 通过DOM取文件数据
            inputDOM.value = null
            this.upWindow = false
        },
        openUpWindow () {
            this.upWindow = true
        },
        // 关闭新建窗口
        closeNewWindow (flag) {
            this.closeWindow()
            if (flag) {
                this.getLists()
            }
        },
        // 关闭窗口
        closeWindow () {
            this.modelWindow = false
        },
        closeEditWindow (flag) {
            this.editWindow = false
            if (flag) {
                this.getLists()
            }
        },
        // 关闭新建窗口
        closeSeeWindow (flag) {
            this.moreWindow = false
        },
        // 编辑我的上传
        editExcel (item) {
            this.editObj = item
            this.openEditWindow()
        },
        delExcel (obj) {
            this.deleteExcel(obj.item, obj.index)
        },
        deleteExcel (item, index) {
            const that = this
            const param1 = {
                folderType: 0,
                yhbh: this.userInfo.yhbh
            }
            const obj = {
                colList: null,
                createTime: item.createTime,
                creater: '',
                createrId: this.userInfo.yhbh,
                dataCount: item.dataCount,
                fileName: item.sourceEnName,
                filePath: '',
                id: item.sourceNum,
                ident: '0',
                isPrivate: '0',
                remark: null,
                sqStatus: null,
                sqbh: null,
                tempEName: item.sourceName,
                tempSource: '0',
                todayDataCount: '0',
                typeNum: null,
                updateTime: null
            }
            const param = [obj]
            this.$util.showConfirm('确定要删除该资源吗？', function () {
                that.$apiService.myupload.deleteExcel(param, param1).then(res => {
                    that.$util.showMessage('删除资源成功！', 'success')
                    if (index !== 0) {
                        that.getLists()
                    } else {
                        that.pageNum = that.pageNum > 1 ? that.pageNum - 1 : that.pageNum
                        that.getLists()
                    }
                }).catch(res => {
                    if (res.response.data.code === 404) {
                        that.$util.showMessage(res.response.data.message, 'error')
                    } else {
                        that.$util.showMessage('删除资源失败！', 'error')
                    }
                })
            }, function () {
            })
        },
        // 上传文件
        uploadFile () {
            const that = this
            const inputDOM = this.$refs.uploadfile
            // 通过DOM取文件数据
            const files = inputDOM.files
            if (files.length > 0) {
                const form = new FormData()
                form.append('yhbh', this.userInfo.yhbh)
                form.append('file', files[0])
                this.$apiService.myupload.uploadFile(form).then(res => {
                    that.fileObject = res.data
                    that.fileName = files[0].name.split('.')[0]
                    that.closeUpWindow()
                    that.openWindow()
                }).catch(res => {
                    that.fileObject = null
                    that.fileName = ''
                    that.closeUpWindow()
                })
            } else {
                this.$util.showMessage('请选择文件！', 'warning')
            }
        },
        seeMore (item) {
            this.seeObj = item
            this.moreWindow = true
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

    .buttons-zone {
        width: 100%;
        height: 30px;
        margin: 0 0 10px 0;
        position: relative;
    }

    .buttons-zone .model-btn, .buttons-zone .list-btn {
        width: 35px;
        height: 30px;
        position: absolute;
        top: 0;
        border-radius: 4px;
        background-color: #eef2fc;
        cursor: pointer;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .buttons-zone .model-btn {
        left: 0;
        background-image: url("../../assets/personal/upload/model-black.svg");
    }

    .buttons-zone .list-btn {
        left: 50px;
        background-image: url("../../assets/personal/upload/list-black.svg");
    }

    .buttons-zone .model-btn.active, .buttons-zone .list-btn.active {
        background-color: #4075fc;
    }

    .buttons-zone .model-btn.active {
        background-image: url("../../assets/personal/upload/model-white.svg");
    }

    .buttons-zone .list-btn.active {
        background-image: url("../../assets/personal/upload/list-white.svg");
    }

    .buttons-zone .model-type, .buttons-zone .upload-source {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        position: absolute;
        top: 0;
        cursor: pointer;
        color: #fff;
    }

    .buttons-zone .model-type {
        width: 80px;
        color: #333;
        text-align: center;
        right: 150px;
        font-weight: 600;
    }

    .buttons-zone .model-type:hover {
        text-decoration: underline;
    }

    .buttons-zone .upload-source {
        width: 100px;
        right: 5px;
        background: #3f6bf4;
        border-radius: 4px;
    }

    .buttons-zone .upload-source span.icon-span {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        top: 5px;
        background: url("../../assets/personal/upload/upload.svg") no-repeat;
        background-size: 100% 100%;
    }

    .buttons-zone .upload-source input[type='file'] {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .personal-model-list-zone ul {
        margin: 0;
        padding: 0;
        text-align: left;
        height: calc(100% - 60px);
    }

    .personal-model-list-zone ul.common-list {
        height: calc(100% - 105px);
    }

    .connom-list-header {
        width: 100%;
        height: 45px;
        border: 1px solid #f2f2f2;
        vertical-align: top;
    }

    .connom-list-header span {
        color: #333;
        display: inline-block;
        font-size: 14px;
        font-weight: 600;
        height: 45px;
        line-height: 45px;
        text-align: left;
        vertical-align: top;
    }

    .connom-list-header span.source-name {
        width: 70%;
        text-indent: 30px;
    }

    .connom-list-header span.source-count {
        width: 15%;
    }

    .connom-list-header span.source-time {
        width: 15%;
    }

    .common-list li {
        height: 40px;
        width: 100%;
        vertical-align: top;
        cursor: pointer;
        border-left: 1px solid #f1f1f1;
        border-right: 1px solid #f1f1f1;
        border-top: 1px solid #f1f1f1;
        margin: 0;
        padding: 0;
    }

    .common-list li:first-child {
        border-top: none;
    }

    .common-list li:last-child {
        border-bottom: 1px solid #f1f1f1;
    }

    .common-list li:hover {
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }

    .common-list li.active {
        background: #5785f7;
    }

    .common-list li span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #333;
        font-size: 12px;
        vertical-align: top;
    }

    .common-list li.active span {
        color: #fff;
    }

    .common-list li span.icon-span {
        width: 30px;
        height: 30px;
        background-image: url("../../assets/personal/upload/excel.svg");
        background-size: 24px 24px;
        position: relative;
        top: 5px;
        background-position: 3px 3px;
        background-repeat: no-repeat;
    }

    .common-list li span.name-span {
        width: calc(70% - 30px);
        position: relative;
    }

    .common-list li span.name-span .btns-zone {
        width: 300px;
        height: 40px;
        position: absolute;
        right: 30px;
        top: 0;
        display: none;
    }

    .common-list li.active span.name-span .btns-zone {
        display: inline-block;
    }

    .common-list li:hover span.name-span .btns-zone {
        display: inline-block;
    }

    .common-list li span.name-span .btns-zone > span {
        display: inline-block;
        vertical-align: top;
    }

    .common-list li span.name-span .btns-zone .see-times {
        margin-right: 10px;
        position: relative;
        width: 60px;
    }

    .common-list li span.name-span .btns-zone .see-times .see-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 10px;
        margin-right: 10px;
        background-position: 0 2px;
        background-image: url("../../assets/personal/upload/eye.svg");
        background-repeat: no-repeat;
        background-size: 80%;
    }

    .common-list li.active span.name-span .btns-zone .see-times .see-icon {
        background-image: url("../../assets/personal/upload/eye-white.svg");
    }

    .common-list li span.name-span .btns-zone .see-times .see-text {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        position: absolute;
        left: 22px;
        font-size: 12px;
    }

    .common-list li span.name-span .btns-zone .operate-times {
        margin-right: 10px;
        position: relative;
        width: 60px;
    }

    .common-list li span.name-span .btns-zone .operate-times .operate-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        background: url("../../assets/personal/upload/exec-black.svg") no-repeat;
        background-size: 100% 100%;
    }

    .common-list li.active span.name-span .btns-zone .operate-times .operate-icon {
        background: url("../../assets/personal/upload/exec-white.svg") no-repeat;
        background-size: 100% 100%;
    }

    .common-list li span.name-span .btns-zone .operate-times .see-text {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        position: absolute;
        left: 22px;
        font-size: 12px;
    }

    .common-list li span.name-span .btns-zone .edit-btn {
        width: 16px;
        height: 16px;
        position: relative;
        top: 12px;
        margin-right: 20px;
        background: url("../../assets/personal/upload/edit-black.svg") no-repeat;
        background-size: 100% 100%;
    }

    .common-list li.active span.name-span .btns-zone .edit-btn {
        background: url("../../assets/personal/upload/edit-white.svg") no-repeat;
        background-size: 100% 100%;
    }

    .common-list li span.name-span .btns-zone .del-btn {
        width: 16px;
        height: 16px;
        background: #f00;
        position: relative;
        top: 12px;
        background: url("../../assets/personal/upload/delete-black.svg") no-repeat;
        background-size: 100% 100%;
    }

    .common-list li.active span.name-span .btns-zone .del-btn {
        background: url("../../assets/personal/upload/delete-white.svg") no-repeat;
        background-size: 100% 100%;
    }

    .common-list li span.count-span {
        width: 15%;
    }

    .common-list li span.time-span {
        width: 15%;
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

    .up-file-form {
        margin: 20px auto;
        width: 100%;
        height: 30px;
    }

    .up-file-form input {
        width: 245px;
        margin: 0 auto;
        border: 1px solid #dedede;
        border-radius: 3px;
        height: 28px;
        font-size: 12px;
        color: #3f6bf4;
    }
</style>
