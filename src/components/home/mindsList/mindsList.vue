<template>
    <div class="minds-wrap clearfix">
        <div v-if="dataObj.itemsLoading" class="text-center">
            <font-awesome-icon icon="spinner" pulse class="fa-spinner"/>
            Loading...
        </div>
        <ul class="model-lists clearfix">
            <li v-for="(item, index) in dataObj.items" v-bind:key="index">
                <minds-element v-bind:item="item" v-bind:manage-flag="false" :modelClass="type"></minds-element>
            </li>
        </ul>
    </div>
</template>

<script>
import apiService from '../../../libs/apiService'
import MindsElement from '../../personal/mindsElement'

export default {
    components: { MindsElement },
    name: 'minds-list',

    props: {
        type: String
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
            checkbox: []
        }
    },

    mounted: function () {
        if (this.type === 'home') {
            this.getLists()
        }
    },

    methods: {
        // 首页列表
        getLists () {
            this.dataObj.itemsLoading = true
            const param = {
                'page': 0,
                'pageSize': 5,
                'taskName': '',
                'endTime': '',
                'startTime': '',
                'yhbh': '',
                'loginId': '6379543154197504'
            }

            apiService.infoCount.modelsList(param).then(res => {
                this.dataObj.items = res.data
                this.dataObj.itemsLoading = false
            })
        }
    }
}
</script>

<style scoped>
    ul li {
        list-style: none;
    }

    .model-lists li {
        width: 233px;
        margin-right: 10px;
        background-color: #ffffff;
        border: solid 1px #e4ebf3;
        float: left;
        margin-top: 10px;
        padding: 10px;
        position: relative;
        -webkit-box-shadow: 3px 0 3px #e9eef3;
        -moz-box-shadow: 3px 0 3px #e9eef3;
        transition-property: top;
        transition-duration: 0s;
        transition-timing-function: linear;
        transition-delay: 0s;
        box-shadow: 0 4px 3px 0 rgba(225, 232, 239, 0.75)
    }

    .model-lists li:hover {
        box-shadow: 3px 0 8px #bfbfbf;
        -webkit-box-shadow: 3px 0 8px #bfbfbf;
        -moz-box-shadow: 3px 0 8px #bfbfbf;
        top: -5px;
    }

    .search-none {
        width: 910px;
        height: 712px;
        background: url("../../../assets/minds/knowno.png") no-repeat center center;
    }

    /* Define an animation behavior */
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }

    /* This is the class name given by the Font Awesome component when icon contains 'spinner' */
    .fa-spinner {
        /* Apply 'spinner' keyframes looping once every second (1s)  */
        animation: spinner 2s linear infinite;
    }

    .minds-wrap {
        position: relative;
    }

    .tag-wrap {
        font-size: 12px;
        color: #4d4d4d;
    }

    .tag-wrap ul li {
        list-style: none;
        float: left;
        margin-left: 15px;
    }

    .tag-wrap ul {
        margin: 0;
        padding-right: 10px;
        float: right;
    }

    .tag-wrap ul li button {
        width: 80px;
        height: 26px;
        border: 1px solid rgba(217, 217, 217, 1);
        border-radius: 13px;
        background: inherit;
        color: #262626;
    }

    .tag-wrap ul li button:hover, .tag-wrap ul li button:focus, .tag-wrap ul li button.active-btn {
        border: 1px solid rgba(63, 107, 244, 1);
        color: rgba(63, 107, 244, 1);
        outline: none;
    }

    .tag-wrap ul li.tag-more {
        margin-left: 20px;
        line-height: 26px;
        cursor: pointer;
    }
</style>
