// 按年份统计地震次数
function CountsYear(data, ChartID) {
// 按年统计地震发生次数
    Year = []
    for (let i = 0; i < data.length; i++) {
        let year = data[i]["Year"]
        if (Year.includes(year)) {
        } else {
            Year.push(year)               // 年份数组
        }
    }
    Year.reverse()
    let Counts = new Array(Year.length).fill(0)
    for (let i = 0; i < data.length; i++) {
        let year = data[i]["Year"]
        tempIndex = Year.indexOf(year)
        Counts[tempIndex]++               // 每年发生地震的次数
    }

    //画图
    // 折线图 年份
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;

    option = {
        animationDuration: 10000,
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
            text: '各 年 份 发 生 地 震 的 次 数',
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
            left: "8%",
            bottom: "8%",
            right: "5%",
            top: "15%",
            containLabel: true
        },
        xAxis: {
            type: 'category',
            name: 'Year',
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

// 统计地震等级
function CountsMag(data, ChartID) {
// 地震强度
    /*  M<3 无感地震
        M≥3级，小于4.5级的称为有感地震，这种地震人们能够感觉到，但一般不会造成破坏。
        M≥4.5级，小于6级的称为中强震。
        M≥6级，小于7级的称为强震。
        M≥7级，小于8级的称为大地震。
        8级以及8级以上的称为巨大地震 (5·12汶川地震，3·11日本地震)。      */
    let MagCounts = new Array(6).fill(0)       // 将地震强度划分为5个等级
    for (let i = 0; i < data.length; i++) {
        let Mag = data[i]["Magnitude"]
        if (Mag >= 3 && Mag < 4.5) {
            MagCounts[1]++
        } else if (Mag >= 4.5 && Mag < 6) {
            MagCounts[2]++
        } else if (Mag >= 6 && Mag < 7) {
            MagCounts[3]++
        } else if (Mag >= 7 && Mag < 8) {
            MagCounts[4]++
        } else if (Mag >= 8) {
            MagCounts[5]++
        } else {
            MagCounts[0]++
        }
    }

    // 饼图 地震强度
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;

    option = {
        title: {
            text: '地 震 强 度',
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
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            bottom: "5%",
            textStyle: {
                fontSize: 10,//字体大小
                color: '#ffffff'//字体颜色
            },
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                center: ["50%", '50%'],
                startAngle: 80, //起始角度
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
                data: [
                    {value: MagCounts[0], name: '小地震'},
                    {value: MagCounts[1], name: '有感地震'},
                    {value: MagCounts[2], name: '中强地震'},
                    {value: MagCounts[3], name: '强烈地震'},
                    {value: MagCounts[4], name: '大地震'},
                    {value: MagCounts[5], name: '巨大地震'}
                ],
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

// 统计震源深度
function CountsDepth(data, ChartID) {
// 震源深度
// 震源深度等级被划分为三类 [0,60) [60,300) >=300
    let DepthCounts = new Array(3).fill(0)       // 将地震强度划分为5个等级
    for (let i = 0; i < data.length; i++) {
        let Depth = data[i]["Depth"]
        if (Depth >= 0 && Depth < 60) {
            DepthCounts[0]++
        } else if (Depth >= 60 && Depth < 300) {
            DepthCounts[1]++
        } else if (Depth >= 300) {
            DepthCounts[2]++
        }
    }


    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;

    option = {
        title: {
            text: '震 源 深 度',
            left: 'center',
            top: '3%',
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
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            bottom: "5%",
            textStyle: {
                fontSize: 12,//字体大小
                color: '#ffffff',//字体颜色

            },
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                startAngle: 80, //起始角度
                center: ["50%", '50%'],
                itemStyle: {        // 修改字体颜色
                    normal: {
                        label: {
                            textStyle: {
                                color: '#ffffff',
                                fontSize: 12,

                            }
                        },
                    }
                },


                data: [
                    {value: DepthCounts[0], name: '浅源地震'},
                    {value: DepthCounts[1], name: '中源地震'},
                    {value: DepthCounts[2], name: '深源地震'}
                ],
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

// 地震等级和震源深度散点图
function MagDepth(data, ChartID) {
    let dot_data = []
    for (let i = 0; i < data.length; i++) {
        let temp = [data[i]["Magnitude"], data[i]["Depth"]]
        dot_data.push(temp)
    }
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;

    option = {
        title: {
            text: '地 震 强 度 和 震 源 深 度 ',
            top: "3%",
            left: 'center',
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
        tooltip: {
            trigger: 'item',
            formatter: '(Magnitude,Depth): ({c})'
        },
        grid: {
            left: "10%",
            bottom: "10%",
            top: "15%",
            right: "5%",
            containLabel: true
        },
        xAxis: {
            name: 'Magnitude',
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
            name: 'Depth',
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


// function Earthquake_Charts() {
//     $(function () {
//         filename = 'data/earthquake_new.geojson'
//         Risk_Func(filename, "Magnitude")    // 热力图
//         Data_Earthquake = GetGeodata(filename)  // 获取数据
//
//         // 绘图
//         CountsYear(Data_Earthquake, "MyCharts1")
//         CountsMag(Data_Earthquake, "MyCharts2")
//         CountsDepth(Data_Earthquake, "MyCharts3")
//         MagDepth(Data_Earthquake, "MyCharts4")
//
//     })
// }