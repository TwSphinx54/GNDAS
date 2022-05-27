// 加载geodata数据
function GetGeodata(filename) {
    data = $.ajax({
        url: filename,    //json文件位置，文件名
        type: "GET",           //请求方式为get
        dataType: "json",     //返回数据格式为json
        async: false,
        success: function (a) {//请求成功完成后要执行的方法
        }
    });     // 此时data是对象
    data = data.responseJSON.features   // 从对象中取出数据内容
    for (let i = 0; i < data.length; i++) {
        data[i] = data[i]["properties"]     // 去除坐标信息 只保留属性
    }
    return data
}


// 绘制热力图
function Risk_Func(geo_data, Pro) {
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2l2aXRhc3YiLCJhIjoiY2s3YXBvdDU1MTZpdDNlcDVhb3FrbjdtaiJ9.kLk_w4wIjIQ6dunGULViqw';
    const map = new mapboxgl.Map({
        container: 'heatmap',
        style: 'mapbox://styles/mapbox/navigation-preview-night-v2',
        center: [110, 39],
        zoom: 2
    });

    map.on('load', () => {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource('earthquakes', {
            'type': 'geojson',
            'data': geo_data
        });

        map.addLayer(
            {
                'id': 'earthquakes-heat',
                'type': 'heatmap',
                'source': 'earthquakes',
                'maxzoom': 9,
                'paint': {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', Pro],
                        0,
                        0,
                        6,
                        1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        9,
                        3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        1,
                        9,
                        0
                    ]
                }
            },
            'waterway-label'
        );

        map.addLayer(
            {
                'id': 'earthquakes-point',
                'type': 'circle',
                'source': 'earthquakes',
                'minzoom': 7,
                'paint': {
                    // Size circle radius by earthquake magnitude and zoom level
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                        16,
                        ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                    ],
                    // Color circle by earthquake magnitude
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        1,
                        'rgba(33,102,172,0)',
                        2,
                        'rgb(103,169,207)',
                        3,
                        'rgb(209,229,240)',
                        4,
                        'rgb(253,219,199)',
                        5,
                        'rgb(239,138,98)',
                        6,
                        'rgb(178,24,43)'
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    // Transition from heatmap to circle layer by zoom level
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        0,
                        8,
                        1
                    ]
                }
            },
            'waterway-label'
        );
    });
}


function CountsNum(Data, Prop)     // 要统计的数据和属性项
{
    let Props = []
    for (let i = 0; i < Data.length; i++) {
        let tempProp = Data[i][Prop]
        if (Props.includes(tempProp)) {
        } else {
            Props.push(tempProp)               // 火山名数组
        }
    }
    let Counts = new Array(Props.length).fill(0)
    for (let i = 0; i < Data.length; i++) {
        let tempProp = Data[i][Prop]
        tempIndex = Props.indexOf(tempProp)
        Counts[tempIndex]++               // 各个火山喷发的次数
    }
    let seriesData = []
    for (let i = 0; i < Counts.length; i++) {
        seriesData.push({
            name: Props[i],
            value: Counts[i]
        });
    }
    return {
        seriesData: seriesData,
        Counts: Counts,
        Props: Props
    }
}