
// 按时间统计
function TsunamiYear(data, ChartID) {
    Year = []
    for (let i = 0; i < data.length; i++) {
        let year = data[i]["Year"]
        if (Year.includes(year)) {
        } else {
            Year.push(year)               // 年份数组
        }
    }

    let Counts = new Array(Year.length).fill(0)
    for (let i = 0; i < data.length; i++) {
        let year = data[i]["Year"]
        tempIndex = Year.indexOf(year)
        Counts[tempIndex]++               // 每年发生地震的次数
    }

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
            text: '各 年 份 海 啸 喷 发 的 次 数',
            //top:"3%",
            left:"center",
            textStyle:{
                //文字颜色
                color:'#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bold',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
                fontSize:15
            },
        },
        grid: {
            left:"6%",
            bottom: "15%",
            right:"10px",
            top:"10%",
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
            nameGap: 25,
            type: 'value',
            splitLine: {　　　　 show: false　　 },
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

//旭日图
function SunGraph(data, ChartID) {
    Region = CountsNum(data, "Region").Props
    Country = CountsNum(data, "Country").Props
    Counts_Name = CountsNum(data, "Location_Name").Counts
    Name = CountsNum(data, "Location_Name").Props

    gragh_data = []
    for (let i = 0; i < Region.length; i++)    // 最外层：区域
    {
        gragh_data.push({name: Region[i], children: []})
    }
    for (let i = 0; i < Country.length; i++)    // 第二层：国家
    {
        TempCountry = Country[i]
        for (let j = 0; j < data.length; j++) {
            if (TempCountry == data[j]["Country"]) {
                IndexRegion = Region.indexOf(data[j]["Region"])    // 当前记录所属的区域索引
                gragh_data[IndexRegion].children.push({name: TempCountry, children: []});
                break
            }
        }
    }
    for (let i = 0; i < Name.length; i++)      // 第三层：火山名
    {
        TempTsunami = Name[i]
        for (let j = 0; j < data.length; j++) {

            if (TempTsunami == data[j]["Location_Name"]) {

                IndexRegion = Region.indexOf(data[j]["Region"])    // 当前记录所属的区域索引
                NameCountry = data[j]["Country"]         //记录当前所属的国家索引
                for (let k = 0; k < gragh_data[IndexRegion].children.length; k++) {
                    if (NameCountry == gragh_data[IndexRegion].children[k].name)     // 定位待插入的国家
                    {
                        gragh_data[IndexRegion].children[k].children.push({
                            name: TempTsunami,
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
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;
    option = {
        //backgroundColor: bgColor,
        color: colors,
        title: {
            text: '海 啸 所 处 海 域、国 家、海 洋',
            left: 'center',
            top: "13%",
            textStyle:{
                //文字颜色
                color:'#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bold',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
                fontSize:18
            },},
        series: [
            {
                type: 'sunburst',
                center: ['50%', '60%'],
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
                            show:false,
                            rotate: 0
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

// 海啸发生等级
// <-1 [-1,0) [0,2) [2,4) [4
function CountsIntensity(data, ChartID) {

    let TsunamiCounts = new Array(4).fill(0)       // 将地震强度划分为5个等级
    for (let i = 0; i < data.length; i++) {
        let Mag = data[i]["TS_Intensity"]
        if (Mag >= -1 && Mag < 0) {
            TsunamiCounts[1]++
        } else if (Mag >= 0 && Mag < 2) {
            TsunamiCounts[2]++
        } else if (Mag >= 2 && Mag < 4) {
            TsunamiCounts[4]++
        } else if (Mag >= 4 ) {
            TsunamiCounts[3]++
        }
        else {
            TsunamiCounts[0]++
        }
    }

    // 饼图 海啸等级
    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;

    option = {
        title: {
            text: ' 海 啸 强 度 ',
            left: 'center',
            top: "5%",
            textStyle:{
                //文字颜色
                color:'#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bold',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
                fontSize:20
            },},
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            bottom:"10%",
            textStyle:{
                fontSize: 12,//字体大小
                color: '#ffffff'//字体颜色
            },
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                center: ["50%", '45%'],
                startAngle:110, //起始角度
                itemStyle: {        // 修改字体颜色
                    normal: {
                        label: {
                            textStyle: {
                                color:'#ffffff',
                                fontSize: 12,
                            }
                        },
                    }
                },
                data: [
                    {value: TsunamiCounts[0], name: 'I级海啸'},
                    {value: TsunamiCounts[1], name: 'II级海啸'},
                    {value: TsunamiCounts[2], name: 'III级海啸'},
                    {value: TsunamiCounts[3], name: 'IV级海啸'}
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

// 绘制伤害统计图
function TotalDescription(data,ChartID) {
    Descriptions=["Limited","Moderate","Severe","Extreme","Unknown"]
    Categories=["Damages","Houses","Deaths"]

    Damage = CountsNum(data, "DAMAGE_TOTAL_DESCRIPTION").Counts
    Damages=[Damage[3],Damage[4],Damage[1],Damage[0],Damage[2]]

    House = CountsNum(data, "HOUSES_TOTAL_DESCRIPTION").Counts
    Houses=[House[2],House[3],House[1],House[4],House[0]]

    Death = CountsNum(data, "DEATHS_TOTAL_DESCRIPTION").Counts
    Deaths=[Death[3],Death[4],Death[0],Death[2],Death[1]]

    Limited=[Damage[3],House[2],Death[3]]
    Moderate=[Damage[4],House[3],Death[4]]
    Severe=[Damage[1],House[1],Death[0]]
    Extreme=[Damage[0],House[4],Death[2]]
    Unknown=[Damage[2],House[0],Death[1]]


    var chartDom = document.getElementById(ChartID);
    var myChart = echarts.init(chartDom);
    myChart.clear()
    var option;

    option = {
        title: {
            text: '海 啸 造 成 的 损 失 及 严 重 程 度',
            top:"0%",
            left:"center",
            textStyle:{
                //文字颜色
                color:'#ffffff',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bold',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
                fontSize:15
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            bottom:"2%",
            textStyle:{
                fontSize: 8,//字体大小
                color: '#ffffff'//字体颜色
            },
        },
        grid: {
            left: '0%',
            right: '4%',
            bottom: '15%',
            top:"9%",
            containLabel: true
        },
        xAxis: {
            type: 'value',
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
            type: 'category',
            data:Categories,
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
                name: "Limited",
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: Limited
            },
            {
                name: 'Moderate',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data:Moderate
            },
            {
                name: 'Severe',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: Severe
            },
            {
                name: 'Extreme',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: Extreme
            },
            {
                name: 'Unknown',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: Unknown
            }
        ]
    };

    option && myChart.setOption(option);
}


function Tsunami_Charts() {
    $(function () {
        filename='data/tsunami2.geojson'
        Risk_Func(filename,"Eruptions Total")    // 热力图
        Data_Temp=GetGeodata(filename)  // 获取数据

        // 筛选年份
        Data_Tsunami = []
        for (let i = 0; i < Data_Temp.length; i++) {
            if (Data_Temp[i]["Year"] > 1990) {
                Data_Tsunami.push(Data_Temp[i])
            }
        }

        // 绘图
        TotalDescription(Data_Tsunami, "MyCharts3")
        TsunamiYear(Data_Tsunami, "MyCharts2")
        CountsIntensity(Data_Tsunami, "MyCharts1")
        SunGraph(Data_Tsunami, "MyCharts4")
    })
}



