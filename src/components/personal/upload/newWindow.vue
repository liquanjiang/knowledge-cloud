<template>
    <div class="edit-window">
        <div class="window-content edit-upload-window">
            <div class="window-header">
                <h4>编辑·预览</h4>
                <span @click="closeWindow(false)"></span>
            </div>
            <div class="window-body">
                <table>
                    <thead>
                    <tr>
                        <th v-for="(item ,index) in colNames" :key="index">
                            <button type="button"
                                    :class="{'red' : disIndexs[index] === true, 'green': disIndexs[index] === false}"
                                    @click="changeDisIndex(index)" class="th-btn">
                                {{ disIndexs[index] ? '取消上传列' : '上传列'}}
                            </button>
                            <input type="text" v-model="item.name" :disabled="disIndexs[index]">
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in rowsList" :key="index">
                        <td v-for="(d, index2)  in item " :key="index2">{{d}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="file-name-area">
                <span class="red-star">*</span>
                <span class="file-name">模板名称：</span>
                <input type="text" v-model="tempName">
            </div>
            <div class="window-footer">
                <div class="confirm-save" style="margin-right:0" @click="saveUpload()"
                     :class="{'disabled': disabled === true}">保存修改
                </div>
                <!--<div class="cancel-close" @click="closeWindow(false)">关闭</div>-->
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: 'newWindow',
    props: {
        itemObj: Object,
        fileName: String,
        yhbh: String
    },
    data: function () {
        return {
            colNames: [],
            rowsList: [],
            disIndexs: [],
            disabled: false,
            tempName: ''
        }
    },
    created () {
        this.tempName = this.fileName
        this.rowsList = this.itemObj.rowsList
        const headList = this.itemObj.headList
        const len = headList.length
        for (let i = 0; i < len; i++) {
            const obj = {
                name: headList[i]
            }
            this.colNames.push(obj)
            this.disIndexs.push(false)
        }
    },
    methods: {
        // 关闭窗口
        closeWindow (flag) {
            this.$emit('closeWindow', flag)
        },
        changeDisIndex (index) {
            const flag = !this.disIndexs[index]
            Vue.set(this.disIndexs, index, flag)
        },
        // 保存上传的内容
        saveUpload () {
            const vm = this
            let flag = true
            const params = vm.itemObj
            params.yhbh = this.yhbh
            params.colIndex = []
            params.colName = []
            vm.disIndexs.forEach(function (e, i) {
                if (!e) {
                    params.colIndex.push(i)
                    params.colName.push(vm.colNames[i].name)
                    const strCol = (vm.colNames[i].name).substr(0, 1)
                    const reg = /^[0-9]+$/
                    if (reg.test(strCol)) {
                        vm.$util.showMessage('列名首字符不可为数字！', 'error')
                    }
                    if (!strCol || strCol.trim().length === 0) {
                        flag = false
                        vm.$util.showMessage('列名首字符不可为空！', 'error')
                    }
                }
            })
            params.tempName = vm.tempName
            if (params.tempName && params.tempName.length > 15) {
                flag = false
                vm.$util.showMessage('模板名称长度不能超过15个字符', 'error')
            }
            params.ptypenum = '-1'
            if (flag) {
                vm.saveNew(params)
            }
        },
        // 保存上传的文件
        saveNew (params) {
            const vm = this
            vm.disabled = true
            vm.$store.dispatch('showLoading')
            vm.$apiService.myupload.saveUploadFile(params).then(res => {
                vm.$util.showMessage('上传成功！', 'success')
                vm.disabled = false
                vm.$store.dispatch('hideLoading')
                vm.closeWindow(true)
            }).catch(res => {
                vm.disabled = false
                vm.$store.dispatch('hideLoading')
                vm.$util.showMessage(res, 'error')
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
        padding: 0;
        margin-top: 20px;
        height: 400px;
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
        height: 80px;
        border: 1px solid #d9d9d9;
        min-width: 180px;
    }

    .window-body table tbody td {
        height: 36px;
        min-width: 180px;
        border: 1px solid #d9d9d9;
        color: #333;
        font-size: 12px;
    }

    .window-body table thead th input {
        height: 32px;
        width: 90%;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        font-size: 12px;
        text-align: center;
    }

    .window-body table thead th button {
        height: 32px;
        width: 90%;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        font-size: 12px;
        text-align: center;
        margin-bottom: 5px;
        background: #fff;
        font-weight: normal;
    }

    .window-body table thead th button:focus {
        outline: none;
        box-shadow: none;
    }

    .window-body table thead th button.red {
        color: #fa2324;
    }

    .window-body table thead th button.green {
        color: #5cc85c;
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

    .confirm-save.disabled {
        cursor: not-allowed;
        pointer-events: none;
    }

</style>
