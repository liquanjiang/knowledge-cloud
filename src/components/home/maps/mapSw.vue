<template>
    <div class="swmap-wrap">
        <div class="rank rank1">
            <label>知识分享Top3</label>
            <ul>
                <li v-for="(item,index) in shareKnowledge" v-bind:key="index">
                    <span>{{item.name}}</span><span>{{item.value}}</span></li>
            </ul>
        </div>
        <div id="map-anhui"></div>
        <div id="map-jiangsu"></div>
        <div class="rank rank2">
            <label>共享模型Top3</label>
            <ul>
                <li v-for="(item, index) in shareModels" v-bind:key="index">
                    <span>{{item.name}}</span><span>{{item.value}}</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
import anhui from 'echarts/map/json/province/anhui'
import jiangsu from 'echarts/map/json/province/jiangsu'

export default {
    name: 'map-sw',
    mounted () {
        this.drawMap('map-anhui', anhui, 'ahmap')
        this.drawMap('map-jiangsu', jiangsu, 'jsmap')
    },
    data: function () {
        return {
            shareKnowledge: [{ name: '南京市', value: 13 }, { name: '淮安市', value: 10 }, { name: '芜湖市', value: 7 }],
            shareModels: [{ name: '南京市', value: 13 }, { name: '淮安市', value: 10 }, { name: '芜湖市', value: 7 }]
        }
    },
    methods: {
        drawMap (elementId, jsonName, registName, data) {
            // 基于准备好的dom，初始化echarts实例
            const chartId = document.getElementById(elementId)
            const myChart = this.$echarts.init(chartId)
            const echarts = this.$echarts
            echarts.registerMap(registName, jsonName)
            const option = {
                geo: {
                    map: registName,
                    show: true,
                    roam: false,
                    itemStyle: {
                        normal: {
                            shadowBlur: 5,
                            shadowOffsetX: 1
                        }
                    },
                    zoom: 1.2
                },
                visualMap: {
                    left: -150,
                    min: 0,
                    max: 50000,
                    text: ['High', 'Low'],
                    realtime: false,
                    calculable: false,
                    inRange: {
                        color: ['#768CE7']
                    }
                },
                series: [{
                    map: registName,
                    // geoIndex: 1,
                    type: 'map',
                    // aspectScale: 0.7, //长宽比
                    zoom: 1.2,
                    itemStyle: {
                        normal: {
                            areaColor: '#3E53AB',
                            // areaColor: '#768CE7',
                            borderColor: '#C5D2FE',
                            borderWidth: 1,
                            borderType: 'solid',
                            border: '1px',
                            label: { show: false }
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: '#fff'
                        },
                        itemStyle: {
                            areaColor: 'blue'
                        }
                    },
                    data: this.shareModels
                }
                ]
            }
            myChart.setOption(option)
        }
    }
}
</script>

<style scoped>
    .swmap-wrap {
        /*position: relative;*/
    }

    #map-anhui {
        height: 50%;
        width: 50%;
        position: absolute;
        top: 120px;
        left: 20px;
    }

    #map-jiangsu {
        height: 50%;
        width: 50%;
        position: absolute;
        top: 80px;
        right: 20px;
    }

    .rank label{
        font-size:12px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(255,168,6,1);
        text-shadow:1px 2px 0px rgba(79,87,105,0.55);
        margin-bottom: 0;
        text-align: left;
        width: 100%;
    }

    .rank ul li span{
        font-size:11px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(255,255,255,1);
        text-shadow:1px 2px 0px rgba(79,87,105,0.55);;
    }

    .rank ul{
        margin: 0;
    }

    .rank ul li{
        text-align: justify
    }

    .rank ul li span:nth-child(1){
        padding-right: 23px;
    }

    .rank1 {
        position: absolute;
        top: 50px;
        left: 20px;
        z-index: 1000;
    }

    .rank2 {
        position: absolute;
        bottom: 10px;
        right: 20px;
    }
</style>
