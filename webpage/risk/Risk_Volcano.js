//按火山类型统计
function VolcanoType(data, ChartID) {
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;
    option = {
        title: {
            text: ' 火 山 类 型 ',
            left: 'center',
            top: "3%",
            textStyle: {
                //文字颜色
                color: '#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight: 'bold',
                //字体系列
                fontFamily: 'sans-serif',
                //字体大小
                fontSize: 15
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            bottom: "5%",
            data: CountsNum(data, "Volcanotype").Props,
            textStyle: {
                fontSize: 10,//字体大小
                color: '#ffffff'//字体颜色
            },
        },
        series: [
            {
                name: 'Volcano Name',
                type: 'pie',
                radius: '55%',
                center: ['40%', '48%'],

                startAngle: 350, //起始角度
                data: CountsNum(data, "Volcanotype").seriesData,
                itemStyle: {        // 修改字体颜色
                    normal: {
                        label: {
                            textStyle: {
                                color: '#ffffff',
                                fontSize: 10,
                            }
                        },
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    option && myChart.setOption(option);
}


// 按年份统计
function VolcanoYear(data, ChartID) {
    Year = CountsNum(data, "Year").Props
    Counts = CountsNum(data, "Volcano").Counts
// 折线图 年份
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;

    option = {
        animationDuration: 20000,
        tooltip: { //跟随鼠标显示数值
            trigger: 'axis'
        },
        //在图片右上角增加下载功能 保存统计图
        toolbox: {
            feature: {
                saveAsImage: {
                    name: '热度监控', //图片名
                    pixelRatio: 2
                }
            }
        },
        title: {
            text: '各 年 份 喷 发 的 火 山 数 量',
            top: "3%",
            left: "center",
            textStyle: {
                //文字颜色
                color: '#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight: 'bold',
                //字体系列
                fontFamily: 'sans-serif',
                //字体大小
                fontSize: 15
            },
        },
        grid: {
            left: "10%",
            bottom: "10%",
            right: "5%",
            top: "15%",
            containLabel: true
        },
        xAxis: {
            type: 'category',
            name: 'Year',
            data: Year,
            nameLocation: 'center',
            nameGap: 25,
            data: Year,
            axisLine: {
                lineStyle: {
                    color: '#ffffff',
                    width: 1, //这里是为了突出显示加上的
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#ffffff'
                }
            }
        },
        yAxis: {
            name: 'Counts',
            type: 'value',
            nameRotate: '90',
            nameLocation: 'center',
            nameGap: 35,
            type: 'value',
            splitLine: {show: false},
            /*改变y轴颜色*/
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#ffffff',
                    width: 1, //这里是为了突出显示加上的
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#ffffff'
                }
            }
        },
        series: [
            {
                data: Counts,
                type: 'line'
            }
        ]
    };

    option && myChart.setOption(option);
}

// 散点图
function Summit_Elevation(data, ChartID) {
    let dot_data = []
    for (let i = 0; i < data.length; i++) {
        let temp = [data[i]["Summit"], data[i]["Elevation"]]
        dot_data.push(temp)
    }
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;
    option = {
        title: {
            text: '火 山 峰 顶 高 度 及 其 海 拔',
            left: 'center',
            top: "3%",
            textStyle: {
                //文字颜色
                color: '#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight: 'bold',
                //字体系列
                fontFamily: 'sans-serif',
                //字体大小
                fontSize: 15
            },
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        grid: {
            left: "5%",
            bottom: "10%",
            top: "15%",
            right: "5%",
            containLabel: true
        },

        tooltip: {
            trigger: 'item',
            formatter: ' ({c})'
        },
        xAxis: {
            name: 'Summit',
            type: 'category',
            nameLocation: "center",
            nameGap: 30,
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#ffffff',
                    width: 1, //这里是为了突出显示加上的
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#ffffff'
                }
            }
        },
        yAxis: {
            name: 'Elevation',
            nameRotate: '90',
            nameLocation: 'center',
            nameGap: 40,
            axisLine: {
                lineStyle: {
                    color: '#ffffff',
                    width: 1, //这里是为了突出显示加上的
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#ffffff'
                }
            }
        },
        series: [
            {
                symbolSize: 5,
                data: dot_data,
                type: 'scatter',
                color: "#b6da9c"
            }
        ]
    };
    option && myChart.setOption(option);
}

//旭日图
function SunGraph_V(data, ChartID) {
    let Volcano_Region = CountsNum(data, "Vocanoes").Props
    Country = CountsNum(data, "Country").Props
    Counts_Name = CountsNum(data, "Volcano").Counts
    Volcano_Name = CountsNum(data, "Volcano").Props

    gragh_data = []
    for (let i = 0; i < Volcano_Region.length; i++)    // 最外层：区域
    {
        gragh_data.push({name: Volcano_Region[i], children: []})
    }
    for (let i = 0; i < Country.length; i++)    // 第二层：国家
    {
        TempCountry = Country[i]
        for (let j = 0; j < data.length; j++) {
            if (TempCountry == data[j]["Country"]) {
                IndexRegion = Volcano_Region.indexOf(data[j]["Vocanoes"])    // 当前记录所属的区域索引
                gragh_data[IndexRegion].children.push({name: TempCountry, children: []});
                break
            }
        }
    }
    for (let i = 0; i < Volcano_Name.length; i++)      // 第三层：火山名
    {
        TempVolcano = Volcano_Name[i]
        for (let j = 0; j < data.length; j++) {

            if (TempVolcano == data[j]["Volcano"]) {

                IndexRegion = Volcano_Region.indexOf(data[j]["Vocanoes"])    // 当前记录所属的区域索引
                NameCountry = data[j]["Country"]         //记录当前所属的国家索引
                for (let k = 0; k < gragh_data[IndexRegion].children.length; k++) {
                    if (NameCountry == gragh_data[IndexRegion].children[k].name)     // 定位待插入的国家
                    {
                        gragh_data[IndexRegion].children[k].children.push({
                            name: TempVolcano,
                            value: Counts_Name[i]
                        })

                    }

                }
                break;
            }
        }
    }
    const colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
    const bgColor = '#2E2733';
    const itemStyle = {
        star5: {
            color: colors[0]
        },
        star4: {
            color: colors[1]
        },
        star3: {
            color: colors[2]
        },
        star2: {
            color: colors[3]
        }
    };
    var chartDom = document.getElementById("MyCharts4");
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;
    option = {
        //backgroundColor: "",
        color: colors,
        title: {
            text: '火 山 所 在 区 域、国 家 及 其 名 字',
            left: 'center',
            top: "3%",
            textStyle: {
                //文字颜色
                color: '#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight: 'bold',
                //字体系列
                fontFamily: 'sans-serif',
                //字体大小
                fontSize: 15
            },
        },
        series: [
            {
                type: 'sunburst',
                center: ['50%', '55%'],
                data: gragh_data,
                sort: function (a, b) {
                    if (a.depth === 1) {
                        return b.getValue() - a.getValue();
                    } else {
                        return a.dataIndex - b.dataIndex;
                    }
                },
                label: {

                    rotate: 'radial',
                    color: bgColor
                },
                itemStyle: {
                    borderColor: bgColor,
                    borderWidth: 2
                },
                levels: [
                    {},
                    {
                        r0: 0,
                        r: 40,
                        label: {
                            rotate: 0,
                            show: false,
                        }
                    },
                    {
                        r0: 40,
                        r: 105
                    },
                    {
                        r0: 115,
                        r: 140,
                        itemStyle: {
                            shadowBlur: 2,
                            shadowColor: colors[2],
                            color: 'transparent'
                        },
                        label: {

                            rotate: 'tangential',
                            fontSize: 10,
                            color: colors[0]
                        }
                    },
                    {
                        r0: 140,
                        r: 145,
                        itemStyle: {
                            shadowBlur: 80,
                            shadowColor: colors[0]
                        },
                        label: {

                            position: 'outside',
                            textShadowBlur: 5,
                            textShadowColor: '#333'
                        },
                        downplay: {
                            label: {
                                opacity: 0.5
                            }
                        }
                    }
                ]
            }
        ]
    };

    option && myChart.setOption(option);
}
//
// function Volcano_Charts() {
//     $(function () {
//         filename = 'data/volcano_eruption.geojson'
//         Risk_Func(filename, "Eruptions Total")    // 热力图
//         Data_Volcano = GetGeodata(filename)  // 获取数据
//         console.log(Data_Volcano)
//
//         // 绘图
//         VolcanoType(Data_Volcano, "MyCharts1")
//         VolcanoYear(Data_Volcano, "MyCharts2")
//         Summit_Elevation(Data_Volcano, "MyCharts3")
//         SunGraph_V(Data_Volcano, "MyCharts4")
//
//
//     })
// }