<template>
    <div class="public-model know" v-cloak>
        <div class="window-content public-window">
            <div class="window-body">
                <!-- 我的模型列表 -->
                <div class="window-body-section  model-list-section">
                    <div class="section-header">
                        <h5>1.选择你要发布的模型 <i class="iconfont icon-wenhao1 margin-left5" v-b-tooltip.hover
                                           title="仅支持发布原创模型，暂不支持发布克隆模型。" placement="top"></i></h5>
                        <div class="more-model" @click="getAllModels('more')" v-if="myModels.showMore">展开更多模型</div>
                    </div>
                    <div class="section-body">
                        <ul>
                            <li v-for="(item, index) in myModels.list" :key="index"
                                @click="choseModel(item, index)"
                                :class="{'active': myModels.activeModel === item}">
                                <div class="blue-triangle"></div>
                                <div class="black-triangle"></div>
                                <div class="model-body">
                                    <h4 :title="item.name">{{item.name}}</h4>
                                    <div class="stars">
                                        <span v-for="star in item.modelLevel" :class="{'check':star==='1'}">
                                        </span>
                                    </div>
                                    <div class="nick-name">
                                        <span class="title-span">昵称：</span>
                                        <span class="name-span">{{item.cjr}}</span>
                                    </div>
                                    <div class="time-div">
                                        <span class="title-span">创建时间：</span>
                                        <span class="name-span">{{item.cjsj}}</span>
                                    </div>
                                    <div class="upload-doc">
                                        <div class="doc-btn">
                                            <i class="iconfont icon-wendang"></i>上传文档
                                        </div>
                                        <input type="file" ref="uploadFile" accept="application/pdf" @change="toUpload(item,index)">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 模型特点选择区域 -->
                <div class="model-select-zone ">
                    <!-- 选择模型所属标签区域 -->
                    <div class="tags-zone window-body-section">
                        <div class="tags-header section-header">
                            <h5>2.选择模型所属标签</h5>
                        </div>
                        <div class="tags-body">
                            <input type="text" placeholder="输入关键字，快速检索标签" v-model="tagsList.searchTags"
                                   v-on:keyup.enter="getAllTabs">
                            <span class="search-span" @click="getAllTabs"></span>
                        </div>
                        <div class="tags-list">
                            <div class="check-area">
                                <span class="check-all check-span" @click="changeCheckAll()"
                                      :class="{'active': tagsList.checkAll === true}"></span>
                                <span class="text">全选</span>
                                <span class="check-reverse check-span" @click="changeReverse()"
                                      :class="{'active': tagsList.checkReverse === true}"></span>
                                <span class="text">反选</span>
                            </div>
                            <!-- 标签列表区域 -->
                            <div class="tags-ul">
                                <ul>
                                    <li v-for="(item, index) in tagsList.list"
                                        v-bind:key="index" :class="{'active': item.checked === true}"
                                        @click="tocheckTab(item, index)">
                                        {{item.NAME}}
                                    </li>
                                </ul>
                            </div>
                            <!-- 添加新标签区域 -->
                            <div class="add-tags" v-b-modal.label-modal>
                                <div class="add-div">
                                    <span>没有你想标注的标签？请</span>
                                    <span class="add-span">点击这里</span>
                                    <span>添加新标签</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 选择模型价值点区域 -->
                    <div class="values-zone  window-body-section padding-bom10">
                        <div class="tags-header section-header">
                            <h5>3.选择模型价值点</h5>
                        </div>
                        <div class="values-list">
                            <ul>
                                <li v-for="(item,index) in valuesList.list"
                                    @click="checkValues(item,index)"
                                    v-bind:key="index" :class="{'active': item.check===true}">
                                    <span class="values-check"></span>
                                    <span class="values-name">{{item.NAME}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- 选择所属警种区域 -->
                <div class="police-class-zone window-body-section">
                    <div class="section-header">
                        <h5>4.选择所属警种</h5>
                    </div>
                    <div class="police-class-list">
                        <ul>
                            <li v-for="(item, index) in policeList.list"
                                @click="checkPolice(item)"
                                v-bind:key="index">
                                <span class="police-radio" :class="{'active': policeList.actPolice===item}"></span>
                                <span class="police-class-name">{{item.JZNAME}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 发布按钮区域 -->
            <div class="publish-btn-area">
                <div class="center" v-if="publishing">
                    <font-awesome-icon icon="spinner" pulse/>
                    发布中...
                </div>
                <div v-else class="public-btn-div" @click="toPublish()">
                    发布
                </div>
            </div>
        </div>
        <!--添加标签-->
        <b-modal v-model="label" id="label-modal" centered title="添加标签">
            <add-label v-on:success="getAllTabs();label=false" v-on:cancel="label=false"></add-label>
            <div slot="modal-footer"></div>
        </b-modal>
    </div>
</template>

<script>
import Vue from 'vue'
import util from '../../libs/util.js'
import serve from '../../libs/apiService.js'
import AddLabel from '../knowledge/addLabel'

export default {
    components: { AddLabel },
    name: 'public-model',
    data: function () {
        return {
            YHBH: {},
            label: false,
            myModels: {
                list: [],
                showMore: true,
                activeModel: {},
                actWd: {}
            },
            tagsList: {
                list: [],
                checkAll: false,
                checkReverse: false,
                searchTags: '',
                checkTabs: []
            },
            valuesList: {
                list: [],
                checkList: []
            },
            policeList: {
                list: [],
                actPolice: {}
            },
            publishing: false,
            modelPage: 0
        }
    },

    methods: {
        // 获取我的所有模型列表
        getAllModels (type) {
            const param = {
                'months': 6,
                'resultFail': null,
                'initFlag': true,
                'pageSize': 4,
                'taskName': '',
                'endTime': '',
                'taskType': 0,
                'startTime': '',
                'applyState': '-1',
                'excludeCloneFlag': '1',
                userId: this.USERINFO.yhbh,
                yhbh: this.USERINFO.yhbh
            }
            if (type === 'more') {
                this.modelPage = this.modelPage + 1
            }
            param.page = this.modelPage
            serve.publishModel.getModelList(param).then(res => {
                res.data.map((item) => {
                    item.modelLevel = JSON.parse(item.modelLevel)
                })
                if (type === 'more') {
                    this.myModels.list = [...this.myModels.list, ...res.data]
                } else {
                    this.myModels.list = res.data
                }
                this.myModels.showMore = res.totalPages > param.page + 1
                this.myModels.activeModel = this.myModels.list[0]
            })
        },
        getAllPoint () {
            serve.knowledge.getValPoint({}).then(res => {
                this.valuesList.list = res
            })
        },
        getAllTabs () {
            serve.knowledge.getTabs({ name: this.tagsList.searchTags }).then(res => {
                this.tagsList.list = res
            })
        },
        getAllJz () {
            serve.knowledge.getJz({}).then(res => {
                this.policeList.list = res
            })
        },
        // 关闭窗口
        closeWindow () {
            this.$emit('closeWindow')
        },
        // 点击选中模型
        choseModel (item, index) {
            this.myModels.activeModel = item
        },
        //  选中全部标签--全选
        tocheckTab (item, index) {
            const arr = this.tagsList.list
            item.checked = !item.checked
            Vue.set(arr, index, item)
            if (!item.checked) {
                this.tagsList.checkAll = false
            }
        },
        changeCheckAll () {
            this.tagsList.checkAll = !this.tagsList.checkAll
            this.tagsList.checkReverse = false
            this.allflag(this.tagsList.list, 'checked', this.tagsList.checkAll)
        },
        // 反选-标签
        changeReverse () {
            this.tagsList.checkReverse = !this.tagsList.checkReverse
            this.tagsList.checkAll = false
            const checks = this.tagsList.list.filter(item => {
                return item.checked
            })
            const reverse = this.tagsList.list.filter(item => {
                return !item.checked
            })
            this.allflag(checks, 'checked', false)
            this.allflag(reverse, 'checked', true)
        },
        // 选中价值
        checkValues (item, index) {
            const arr = this.valuesList.list
            item.check = !item.check
            Vue.set(arr, index, item)
            if (item.check) {
                this.valuesList.checkList.push(item.ID)
            } else {
                const arr = this.valuesList.checkList
                if (arr.includes(item.ID)) {
                    arr.splice(arr.indexOf(item.ID), 1)
                }
            }
        },
        // 选择警种
        checkPolice (item) {
            this.policeList.actPolice = item
        },
        // 全部选否
        allflag (array, key, flag) {
            const len = array.length
            for (let i = 0; i < len; i++) {
                array[i][key] = flag
            }
        },
        // 上传文档
        toUpload (model, i) {
            const upload = this.$refs.uploadFile
            let _file = upload[i].files
            if (_file.length > 0) {
                if (_file[0].type !== 'application/pdf') {
                    util.showMessage('仅支持pdf格式！', 'error')
                    return
                }
                let formdata = new FormData()
                formdata.append('file', _file[0])
                formdata.append('taskId', model.id)
                formdata.append('type', 0)
                serve.knowledge.uploadWd(formdata).then(res => {
                    this.myModels.actWd = res
                    util.showMessage('模型文档上传成功！', 'success')
                }).catch(err => {
                    this.myModels.actWd = null
                    _file = null
                    util.showMessage(err.response.data.message || '文档上传失败！', 'error')
                })
            }
        },
        // 发布模型
        toPublish () {
            const params = this.$lodash.cloneDeep(this.myModels.activeModel)
            if (this.myModels.actWd.taskId !== params.id) {
                util.showMessage('请上传要发布的模型文档！', 'error')
                return
            }
            params.isPublic = 1
            params.vps = this.valuesList.checkList
            if (params.vps.length < 1) {
                util.showMessage('请选择模型价值点！', 'error')
                return
            }
            params.jzId = this.policeList.actPolice.ID
            if (!params.jzId) {
                util.showMessage('请选择所属警种！', 'error')
                return
            }
            this.tagsList.list.forEach(item => {
                if (item.checked) {
                    params.tags.push(item.ID)
                }
            })
            if (params.tags.length < 1) {
                util.showMessage('请选择模型所属标签！', 'error')
                return
            }
            params.modelLevel = JSON.stringify(params.modelLevel)
            this.publishing = true
            serve.knowledge.publish(params).then(res => {
                this.closeWindow()
                util.showMessage('发布模型成功！', 'success')
                this.$emit('publish')
                this.publishing = false
            }).catch(err => {
                util.showMessage(err.response.data.message || '发布失败！', 'error')
                this.closeWindow()
                this.publishing = false
            })
        }
    },
    created () {
        const user = window.localStorage.getItem('userInfo')
        this.USERINFO = JSON.parse(decodeURIComponent(user))
    },
    mounted () {
        this.getAllModels()
        this.getAllPoint()
        this.getAllTabs()
        this.getAllJz()
    }
}
</script>

<style scoped>
    .public-model {
        width: 100%;
        height: 100%;
    }

    .window-body .window-body-section .section-header div.more-model {
        background-image: url("../../assets/personal/public/more.svg");
        background-size: 16px 16px;
        background-position: 12px 7px;
        background-repeat: no-repeat;
    }

    .window-body .window-body-section .section-header div.more-model:hover {
        text-decoration: underline;
    }

    .window-body .window-body-section .section-body {
        width: 100%;
        height: calc(100% - 30px);
        overflow-y: auto;
    }

    .window-body .window-body-section .section-body ul {
        margin: 0;
        text-align: left;
        padding: 0;
    }

    .window-body .window-body-section .section-body ul li {
        padding: 0;
        list-style: none;
        display: inline-block;
        width: 278px;
        height: 168px;
        margin-right: 5px;
        border: 1px solid #e4ebf3;
        position: relative;
        cursor: pointer;
        margin-bottom: 10px;
    }

    .window-body .window-body-section .section-body ul li.active {
        border:1px solid rgba(63,107,244,1);
        box-shadow:0 3px 7px 0px rgba(63, 107, 244, 0.35);
    }

    .window-body .window-body-section .section-body ul li .blue-triangle {
        width: 38px;
        height: 38px;
        background-color: #3f6bf4;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 5;
        background-image: url("../../assets/personal/public/right.svg");
        background-size: 16px 16px;
        background-position: 18px 5px;
        background-repeat: no-repeat;
        display: none;
    }

    .window-body .window-body-section .section-body ul li .black-triangle {
        width: 0;
        height: 0;
        border-bottom: 38px solid #fff;
        border-right: 38px solid transparent;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        display: none;
    }

    .window-body .window-body-section .section-body ul li.active .black-triangle,
    .window-body .window-body-section .section-body ul li.active .blue-triangle {
        display: block;
    }

    .window-body .window-body-section .section-body ul li .model-body {
        width: 100%;
        height: 100%;
        padding: 10px 15px;
    }

    .window-body .window-body-section .section-body ul li .model-body h4 {
        color: #333;
        font-size: 12px;
        text-align: left;
        width: 200px;
        height: 20px;
        line-height: 20px;
        margin-bottom: 6px;
        overflow: hidden;
    }

    .window-body .window-body-section .section-body ul li .model-body div.stars {
        width: 100%;
        height: 24px;
        text-align: left;
        line-height: 24px;
    }

    .window-body .window-body-section .section-body ul li .model-body div.stars span {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-image: url("../../assets/personal/public/star-gray.svg");
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .window-body .window-body-section .section-body ul li .model-body div.stars span.check {
        background-image: url("../../assets/personal/public/star-red.svg");
    }

    .window-body .window-body-section .section-body ul li .model-body div.nick-name,
    .window-body .window-body-section .section-body ul li .model-body div.time-div {
        width: 100%;
        height: 26px;
        text-align: left;
    }

    .window-body .window-body-section .section-body ul li .model-body div.upload-doc {
        height: 40px;
        position: relative;
        margin-top: 10px;
    }

    .model-body div.upload-doc input[type='file'] {
        width: 100px;
        height: 32px;
        opacity: 0;
        top: 0;
        cursor: pointer;
        position: absolute;
    }

    .window-body .window-body-section .section-body ul li .model-body div.nick-name span {
        display: inline-block;
        color: #333;
        font-size: 12px;
    }

    .window-body .window-body-section .section-body ul li .model-body div.time-div span {
        display: inline-block;
        color: #333;
        font-size: 12px;
    }

    .window-body .window-body-section .section-body ul li .model-body div.nick-name span.title-span {
        margin-right: 20px;
        width: 40px;
    }

    .window-body .window-body-section .section-body ul li .model-body div.time-div span.title-span {
        width: 60px;
    }

    .section-body ul li .model-body div.doc-btn {
        width: 100px;
        color: #666666;
        height: 32px;
        line-height: 30px;
        background: #F5F6FA;
        text-align: center;
        border: 1px solid #E5E9F2;
        border-radius: 3px;
        font-size: 12px;
    }

    .model-body div.doc-btn i {
        vertical-align: -2px;
        margin-right: 5px;
    }

    .section-body ul li.active .model-body div.doc-btn {
        background: #3F6BF4;
        color: #FFFFFF;
    }

    .window-body .model-select-zone {
        width: 100%;
        position: relative;
    }

    .window-body .tags-zone .tags-body {
        position: relative;
    }

    .window-body .tags-zone .tags-body input {
        width: 550px;
        height: 30px;
        line-height: 30px;
        text-indent: 10px;
        color: #333;
        border: 1px solid #e0e2e9;
        border-radius: 5px;
        margin: 5px 0;
        font-size: 12px;
    }

    .window-body .tags-zone .tags-body span {
        position: absolute;
        right: 10px;
        top: 12px;
        display: inline-block;
        width: 16px;
        height: 16px;
        background-image: url("../../assets/personal/public/search.svg");
        background-size: 100%;
        background-repeat: no-repeat;
        cursor: pointer;
    }

    .window-body .tags-zone .tags-list {
        width: 100%;
        height: 150px;
        text-align: left;
        padding: 10px 0 0 5px;
    }

    .window-body .tags-zone .tags-list .check-area span {
        display: inline-block;
        background-size: 100%;
        background-repeat: no-repeat;
        vertical-align: top;
    }

    .window-body .tags-zone .tags-list .check-area span.text {
        background-size: 100%;
        background-repeat: no-repeat;
        width: 36px;
        height: 16px;
        margin: 0 10px 0 5px;
        color: #333;
        font-size: 12px;
        line-height: 16px;
    }

    .window-body .tags-zone .tags-list .check-area span.check-span {
        width: 16px;
        height: 16px;
        background-image: url("../../assets/personal/public/unchecked.svg");
        cursor: pointer;
    }

    .window-body .tags-zone .tags-list .tags-ul ul {
        margin: 0;
        padding: 0;
        height: 105px;
        overflow-y: auto;
    }

    .window-body .tags-zone .tags-list .tags-ul ul li {
        display: inline-block;
        padding: 5px 10px;
        font-size: 12px;
        color: #333;
        cursor: pointer;
        background: #eef2fc;
        border-radius: 3px;
        margin: 4px 10px 4px 0;
    }

    .window-body .tags-zone .tags-list .tags-ul ul li.active {
        color: #fff;
        background: #3f6bf4;
    }

    .window-body .tags-zone .tags-list .check-area span.check-span.active {
        background-image: url("../../assets/personal/public/check.svg");
    }

    .window-body .tags-zone.window-body-section {
        width: 575px;
        height: 260px;
    }

    .window-body .values-zone.window-body-section {
        width: 580px;
        height: 260px;
        position: absolute;
        left: 585px;
        top: 0;
    }

    .window-body .tags-zone .tags-list .add-tags {
        margin-top: 15px;
        height: 20px;
        cursor: pointer;
        line-height: 20px;
        text-align: center;
    }

    .window-body .tags-zone .tags-list .add-tags span {
        display: inline-block;
        vertical-align: top;
        height: 20px;
        line-height: 20px;
        color: #999;
        font-size: 12px;
    }

    .window-body .tags-zone .tags-list .add-tags span.add-span {
        color: #3f6bf4;
    }

    .window-body .police-class-zone.window-body-section {
        height: 120px;
    }

    .window-body .values-zone .values-list {
        height: 206px;
        overflow-y: auto;
    }

    .window-body .values-zone .values-list ul {
        margin: 0;
        padding: 0 0 0 5px;
    }

    .window-body .values-zone .values-list ul li {
        margin: 0;
        padding: 0;
        height: 32px;
        line-height: 32px;
        text-align: left;
        cursor: pointer;
    }

    .window-body .values-zone .values-list ul li:hover {
        background: #f2f2f2;
    }

    .window-body .values-zone .values-list ul li span {
        color: #333;
        font-size: 12px;
        height: 32px;
        line-height: 32px;
        display: inline-block;
        vertical-align: top;
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .window-body .values-zone .values-list ul li span.values-check {
        width: 14px;
        height: 14px;
        background-image: url("../../assets/personal/public/unchecked.svg");
        margin-right: 10px;
        position: relative;
        top: 9px;
    }

    .window-body .values-zone .values-list ul li.active span.values-check {
        width: 14px;
        height: 14px;
        background-image: url("../../assets/personal/public/check.svg");
        margin-right: 10px;
        position: relative;
        top: 9px;
    }

    .window-body .values-zone .values-list ul li.active span {
        color: #3F6BF4;
    }

    .publish-btn-area {
        width: 1162px;
        height: 40px;
        line-height: 40px;
        background: rgba(238, 242, 252, 1);
        cursor: pointer;
    }

    .publish-btn-area .public-btn-div {
        width: 100px;
        height: 40px;
        margin: 0 auto;
        text-align: center;
        background-image: url("../../assets/personal/public/public-blue.svg");
        background-size: 20px 20px;
        background-repeat: no-repeat;
        background-position: 10px 10px;
        font-size: 14px;
        line-height: 40px;
        color: #3f6bf4;
    }

    .window-body .police-class-list {
        height: 78px;
        overflow-y: auto;
    }

    .window-body .police-class-list ul {
        margin: 0;
        padding: 0 0 0 5px;
        text-align: left;
    }

    .window-body .police-class-list ul li {
        margin: 5px 15px 5px 0;
        padding: 0;
        display: inline-block;
        text-align: left;
        height: 24px;
        cursor: pointer;
    }

    /* .window-body .police-class-list ul li:hover {
         background: #f2f2f2;
     }
 */
    .window-body .police-class-list ul li span {
        display: inline-block;
        vertical-align: top;
        background-repeat: no-repeat;
        background-size: 100%;
        color: #333;
        font-size: 12px;
        height: 24px;
        line-height: 24px;
    }

    .window-body .police-class-list ul li span.police-radio {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-image: url("../../assets/personal/public/unradio.svg");
        margin-right: 6px;
        position: relative;
        top: 5px;
    }

    .window-body .police-class-list ul li span.police-radio.active {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-image: url("../../assets/personal/public/radio.svg");
    }
</style>
