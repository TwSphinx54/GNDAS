import geopandas

data1 = geopandas.read_file('data/tsunami.geojson')
TS_Intensity=data1["TS_Intensity"]
TS_Intensity_re=TS_Intensity.replace("UnKnown","-5")
TS_Intensity_astype=TS_Intensity_re.astype("float")
data1["TS_Intensity"]=TS_Intensity_astype
data1.to_file("data/tsunami2.geojson", driver='GeoJSON')
print(" ")