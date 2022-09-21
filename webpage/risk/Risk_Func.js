

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

const sourceId = 'sourceId'
const layerId = 'layerId'
const layerId2 = 'layerId2'
function Initialize(geo_data, Pro)
{
    heatmap.on('load', () => {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        heatmap.addSource(sourceId, {
            'type': 'geojson',
            'data': geo_data
        });

        heatmap.addLayer(
            {
                'id': layerId,
                'type': 'heatmap',
                'source': sourceId,
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

        heatmap.addLayer(
            {
                'id': layerId2,
                'type': 'circle',
                'source': sourceId,
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


// 绘制热力图
function Risk_Func(geo_data, Pro) {
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com


    if (heatmap.getLayer(layerId)) // 不存在 source => undefined
    {
        heatmap.removeLayer(layerId)
    }
    if (heatmap.getLayer(layerId2)) // 不存在 source => undefined
    {
        heatmap.removeLayer(layerId2)
    }
    if (heatmap.getSource(sourceId)) // 不存在 source => undefined
    {
        heatmap.removeSource(sourceId)
    }


        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        heatmap.addSource(sourceId, {
            'type': 'geojson',
            'data': geo_data
        });

        heatmap.addLayer(
            {
                'id': layerId,
                'type': 'heatmap',
                'source': sourceId,
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
                        parseInt(slide_value.value) / 2,
                        9,
                        parseInt(slide_value.value)
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

        heatmap.addLayer(
            {
                'id': layerId2,
                'type': 'circle',
                'source': sourceId,
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

function Get_Cluster(pointdata) {
    cc = turf.clustersKmeans(pointdata)
    cluster_num = []
    cluster_center = []
    for (let i = 0; i < cc.features.length; i++)
    {
        let temp_id = cc['features'][i]['properties']["cluster"];
        let temp_center = cc['features'][i]['properties']["centroid"];
        if (cluster_num.indexOf(temp_id)==-1)
        {
            cluster_num.push(temp_id)
            cluster_center.push(temp_center)
        }
    }
    cluster_groups=[]
    for(let i=0;i<cluster_num.length;i++)
    {
        temp_cluster=turf.getCluster(cc, { cluster: cluster_num[i] })
        cluster_groups.push(temp_cluster)
    }
    return cluster_center
}


function showbuffer() {
    const buffer_Id = "polygon"
    const center_Id = "point"
     for(let k=0;k<100;k++){

        if (heatmap.getLayer(buffer_Id + k)) // 不存在 source => undefined
        {
            heatmap.removeLayer(buffer_Id + k)
        }
        if (heatmap.getSource(buffer_Id + k)) // 不存在 source => undefined
        {
            heatmap.removeSource(buffer_Id + k)
        }
        if (heatmap.getLayer(center_Id + k)) // 不存在 source => undefined
        {
            heatmap.removeLayer(center_Id + k)
        }
        if (heatmap.getSource(center_Id + k)) // 不存在 source => undefined
        {
            heatmap.removeSource(center_Id + k)
        }}
    let temp_buffer = flag.indexOf(true);
    let cluster_center=Get_Cluster(vol_o);
        switch (temp_buffer) {
            case 0:
                cluster_center = Get_Cluster(vol_o)
                break;
            case 1:
                cluster_center = Get_Cluster(eqk_o)
                break;
            case 2:
                cluster_center = Get_Cluster(tnm_o)
                break;
        }

    for (let i = 0; i < cluster_center.length; i++) {
        let temp_lng = cluster_center[i][0]
        let temp_lat = cluster_center[i][1]
        //创建点
        var point = turf.point([parseFloat(temp_lng), parseFloat(temp_lat)]);

        //创建缓冲区面
        var buffered = turf.buffer(point, 500, {units: "miles"});/*parseFloat(radius), {steps:2,units: units});*/
        //获取缓冲区面坐标数组
        var coordinates = buffered.geometry.coordinates[0];
        // 获取缓冲区四至
        // 左下角坐标，min_lng，min_lat
        var es = [180, 90]
        // 右上角坐标，max_lng，max_lat
        var wn = [0, 0]
        for (var j = 0; j < coordinates.length; j++) {
            if (coordinates[j][0] < es[0]) {
                es[0] = coordinates[j][0];
            }
            if (coordinates[j][1] < es[1]) {
                es[1] = coordinates[j][1];
            }
            if (coordinates[j][0] > wn[0]) {
                wn[0] = coordinates[j][0];
            }
            if (coordinates[j][1] > wn[1]) {
                wn[1] = coordinates[j][1]
            }
        }
        //计算左下角到右上角的距离
        //var distance = turf.distance(turf.point(es), turf.point(wn), {units: "miles"});
         //添加资源和图层

        heatmap.addSource(buffer_Id + i, {
            'type': 'geojson',
            'data': buffered
        });
        heatmap.addLayer({
            'id': buffer_Id + i,
            'type': 'fill',
            'source': buffer_Id + i,
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        });
        heatmap.addSource(center_Id + i, {
            'type': 'geojson',
            'data': point
        });
        heatmap.addLayer({
            'id': center_Id + i,
            'type': 'circle',
            'source': center_Id + i,
            'paint': {
                'circle-radius': 6,
                'circle-color': '#B42222'
            }
        });
        /*//飞行至四至范围内

        heatmap.fitBounds([es,wn], {

            padding: 20

        });*/
        console.log(i)
    }
};
