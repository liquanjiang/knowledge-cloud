<template>
    <div class="edit-window">
        <div class="window-content edit-upload-window">
            <div class="window-header">
                <h4>查看·{{ itemObj.sourceEnName}}</h4>
                <span @click="closeWindow(false)"></span>
            </div>
            <!-- 列查询区域 -->
            <div class="search-zone">

            </div>
            <div class="window-body">
                <table>
                    <thead>
                    <tr>
                        <th v-for="(item ,index) in colNames" :key="index" :style="{ width: item.width + '%'}">
                            {{item.name}}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in rowsList" :key="index">
                        <td>{{item.colNum}}</td>
                        <td>
                            <input type="text" v-model="item.colCName" disabled>
                        </td>
                        <td>
                            <select v-model="item.colType" disabled>
                                <option v-for="(d, index2) in selectList" :value="d.colType" :key="index2">{{d.name}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <select v-model="item.fieldType" disabled>
                                <option v-for="(d, index2) in typeList" :value="d.value" :key="index2">{{d.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="file-name-area">
                <span class="red-star">*</span>
                <span class="file-name">模板名称：</span>
                <input type="text" v-model="itemObj.sourceEnName" disabled>
            </div>
            <div class="window-footer">
                <!--<div class="confirm-save" @click="saveUpload()">保存修改</div>-->
                <div class="cancel-close" @click="closeWindow(false)">关闭</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'editWindow',
    props: {
        itemObj: Object,
        yhbh: String
    },
    data: function () {
        return {
            colNames: [
                { name: '列编号', width: 10 },
                { name: '列名', width: 30 },
                { name: '数据类型', width: 30 },
                { name: '字段类型', width: 30 }
            ],
            rowsList: [],
            disIndexs: [],
            searchObj: {
                keyword: ''
            },
            disabled: false,
            selectList: [
                { name: '字符串', colType: '0' }, { name: '日期', colType: '1' }, { name: '数值', colType: '2' }
            ],
            typeList: [{ name: '基础字段', value: '1' }, { name: '业务字段', value: '2' }, { name: '关键字段', value: '3' }]
        }
    },
    created () {
        this.getData()
    },
    methods: {
        // 关闭窗口
        closeWindow (flag) {
            this.$emit('closeWindow', flag)
        },
        // 请求这个表的数据
        getData () {
            const that = this
            const num = this.itemObj.sourceNum
            const params = {
                tempNum: num
            }
            this.$apiService.myupload.getColumns(params).then(res => {
                this.rowsList = res
            }).catch(res => {
                that.$util.showMessage('获取数据失败！', 'error')
            })
        }
    }
}
</script>

<style scoped>
    .edit-window {
        width: 1000px;
        height: 600px;
        position: absolute;
    }

    .edit-window .window-body {
        overflow: auto;
        margin-top: 20px;
        height: 360px;
        padding: 10px;
    }

    .edit-window .search-zone {
        width: 100%;
        height: 30px;
        text-align: left;
        font-size: 12px;
        position: relative;
    }

    .edit-window .search-zone span {
        display: inline-block;
    }

    .edit-window .search-zone span.text-span {
        width: 60px;
        margin-right: 15px;
        text-align: right;
        color: #333;
    }

    .edit-window .search-zone input {
        width: 300px;
        height: 30px;
        color: #3f6bf4;
        text-indent: 10px;
        border-radius: 3px;
        border: 1px solid #dadada;
        font-size: 12px;
    }

    .edit-window .search-zone span.icon-span {
        position: relative;
        vertical-align: top;
        left: -30px;
        width: 30px;
        height: 30px;
        background-image: url("../../../assets/personal/public/search.svg");
        background-size: 20px 20px;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        border-radius: 3px;
        z-index: 19;
    }

    .window-body table {
        min-width: 100%;
        border: 1px solid #d9d9d9;
    }

    .window-body table tr {
        width: 100%;
        border: 1px solid #d9d9d9;
    }

    .window-body table thead th {
        height: 40px;
        border: 1px solid #d9d9d9;
        min-width: 180px;
        text-align: left;
        border-left: none;
        border-right: none;
        text-indent: 20px;
        font-size: 14px;
    }

    .window-body table thead th:first-child {
        text-align: center;
        text-indent: 0;
    }

    .window-body table tbody td {
        height: 36px;
        min-width: 180px;
        border: 1px solid #d9d9d9;
        border-left: none;
        border-right: none;
        color: #333;
        font-size: 12px;
        text-align: left;
        text-indent: 20px;
    }

    .window-body table tbody td:first-child {
        text-align: center;
        text-indent: 0;
    }

    .window-body table tbody td select {
        color: #419cff;
        border: 1px solid #347ed2;
        min-width: 50px;
        padding: 3px 10px;
        border-radius: 3px;
        width: 80%
    }

    .window-body table td input {
        height: 28px;
        width: 90%;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        font-size: 12px;
        text-align: left;
        text-indent: 10px;
    }

    .file-name-area {
        margin-top: 20px;
        text-align: left;
    }

    .file-name-area span {
        display: inline-block;
        font-size: 12px;
        height: 30px;
        line-height: 30px;
    }

    .file-name-area span.red-star {
        color: #f00;
        margin-right: 5px;
    }

    .file-name-area span.file-name {
        width: 80px;
        text-align: left;
        color: #333;
    }

    .file-name-area input {
        width: 300px;
        height: 30px;
        color: #3f6bf4;
        text-indent: 10px;
        border-radius: 3px;
        border: 1px solid #dadada;
        font-size: 12px;
    }
</style>
