<template>
  <div ref="myDiv" class="radar-echart"></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/chart/radar');
export default {
    mounted () {
        var myChart= echarts.init(this.$refs.myDiv)
        myChart.setOption({
        radar: {
            // shape: 'circle',
            indicator: [
            { name: '考勤', max: 6500 },
            { name: '工作产出', max: 16000 },
            { name: '帮助同事', max: 30000 },
            { name: '培训新人', max: 38000 },
            { name: '修复Bug', max: 52000 },
            { name: '新技术', max: 25000 }
            ],
        },
        series: [
            {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
                {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
                },
                {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
                }
            ]
            }
        ],
        color:['#2f4554','#c33733']
        
    });
    }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>