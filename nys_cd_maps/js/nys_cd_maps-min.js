L.TopoJSON=L.GeoJSON.extend({addData:function(t){let e,o;if("Topology"===t.type){for(o in t.objects)t.objects.hasOwnProperty(o)&&(e=topojson.feature(t,t.objects[o]),L.GeoJSON.prototype.addData.call(this,e));return this}return L.GeoJSON.prototype.addData.call(this,t),this}}),L.topoJson=function(t,e){return new L.TopoJSON(t,e)},L.Control.coordProjection=L.Control.extend({options:{position:"bottomleft",separator:" | ",zoomLevel:!0,emptyString:" ",lngFirst:!1,numDigits:3,lngFormatter:void 0,latFormatter:void 0,prefix:"",crs:"EPSG4326"},onAdd:function(t){return this._container=L.DomUtil.create("div","leaflet-control-coord-projection"),L.DomEvent.disableClickPropagation(this._container),t.on("mousemove",this._onMouseMove,this),this._container.innerHTML=this.options.emptyString,this._container},onRemove:function(t){t.off("mousemove",this._onMouseMove)},_onMouseMove:function(t){let e=this._projectTo(this.options.crs,t.latlng,this.options.crsProjObject);this.options.crsProjObject||"EPSG4326"!==this.options.crs?(e=L.latLng(e.x,e.y),this.options.numDigits=3):this.options.numDigits=6;let o=this.options.lngFormatter?this.options.lngFormatter(e.lng):L.Util.formatNum(e.lng,this.options.numDigits),a=this.options.latFormatter?this.options.latFormatter(e.lat):L.Util.formatNum(e.lat,this.options.numDigits),r=this.options.lngFirst?o+this.options.separator+a:a+this.options.separator+o,s=(this.options.zoomLevel?"Zoom level: "+t.target.getZoom()+" at ":"")+this.options.prefix+" "+r;this._container.innerHTML=s},_projectTo:function(t,e){let o=[0,0];switch(t){case"EPSG3395":o=L.Projection.Mercator.project(e);break;case"EPSG3857":o=L.Projection.SphericalMercator.project(e);break;default:return e}return o},changeCrs:function(t){this.options.crs=t}}),L.Map.mergeOptions({positionControl:!1}),L.Map.addInitHook((function(){this.options.positionControl&&(this.positionControl=new L.Control.coordProjection,this.addControl(this.positionControl))})),L.control.coordProjection=function(t){return new L.Control.coordProjection(t)},String.prototype.format=function(){var t=arguments;return this.replace(/{(\d+)}/g,(function(e,o){return void 0!==t[o]?t[o]:e}))};let checkStr=String.fromCharCode(10003,32),spaceStr=String.fromCharCode(160,160,160,160);var map=L.map("map",{fullscreenControl:!0}).setView([42.61,-75.33],7).fitBounds([[40.1,-79.86],[45.17,-71.69]]);let coordP=L.control.coordProjection({crs:"EPSG4326",lngFormatter:t=>Number(t).toFixed(3)+String.fromCharCode(176),latFormatter:t=>Number(t).toFixed(3)+String.fromCharCode(176)}).addTo(map),reAlignMapDIV=()=>{$("#map").height(window.innerHeight-$("#pageHeader").height())};$(document).ready((()=>{reAlignMapDIV(),map.invalidateSize(!1),map.fitBounds([[40.1,-79.86],[45.17,-71.69]])})),$(window).resize(reAlignMapDIV);let baseMapLayerNames=["Esri.WorldGrayCanvas","CartoDB.Positron","OpenStreetMap.Mapnik","Stadia.AlidadeSmooth"],baseMapLayers=Array(baseMapLayerNames.length).fill(null);baseMapLayerNames.forEach(((t,e)=>{$("#baseMapDIV").append('<a href="#" class="w3-bar-item w3-button" id="bmap{0}" onclick="switchBaseMap({0})">{1}</a>'.format(e,t+spaceStr)),baseMapLayers[e]=L.tileLayer.provider(t)})),switchBaseMap=t=>{let e=$("#bmap"+t).text();for(let o=0;o<baseMapLayerNames.length;++o)o!=t||e.includes(checkStr)?(baseMapLayers[o].removeFrom(map),$("#bmap"+o).text(baseMapLayerNames[o]+spaceStr)):(baseMapLayers[o].addTo(map),$("#bmap"+o).text(checkStr+baseMapLayerNames[o]))},switchBaseMap(0);let dataNames=["IRC Plan A","IRC Plan B","State Legislature","State Court"],jsonMapLayers={},layerColors=d3.schemeSet1.slice(0,4),opacityInterpolator=d3.scaleSequential().domain([.5,-.3]);for(let t=0;t<dataNames.length;++t)jsonMapLayers[dataNames[t]]=L.topoJson(null,{style:function(e){return{color:layerColors[t],opacity:1,weight:1,fillColor:layerColors[t],fillOpacity:opacityInterpolator(e.properties.CCDistPop)}},onEachFeature:function(e,o){o.bindPopup("<p><strong>The compactness measure of the district:</strong> <br>                         Geometry CCPD: {0} <br>                         Populate Weighted CCPD: {1} <br><br>                         * CCPD is maximum Coverage Circle Path Distance-based metric. <br>                        * compactness is opposite of gerrymandering.</p>".format(e.properties.CCDist,e.properties.CCDistPop)),o.on({mouseover:t=>{t.target.setStyle({fillColor:"#000",fillOpacity:o.options.fillOpacity+.2,weight:2})},mouseout:e=>jsonMapLayers[dataNames[t]].resetStyle(e.target)})}}),fetch("./data/"+dataNames[t]+".topojson").then((t=>t.json())).then((e=>{jsonMapLayers[dataNames[t]].addData(e)}));jsonMapLayers[dataNames[0]].addTo(map),$("#cd_map_list").sortable({start:(t,e)=>{},update:(t,e)=>{$("#cd_map_list li a").each(((t,e)=>{e.innerText&&e.innerText.replace(checkStr,"")&&jsonMapLayers&&jsonMapLayers[e.innerText.replace(checkStr,"")]&&jsonMapLayers[e.innerText.replace(checkStr,"")].setZIndex(jsonMapLayerZs[t])})),switchMapLayer(dataNames.indexOf(e.item[0].innerText.replace(checkStr,"")))}});let jsonMapLayerZs=Array(dataNames.length).fill(null);dataNames.forEach(((t,e)=>{jsonMapLayerZs[e]=499-e,jsonMapLayers[dataNames[e]].setZIndex(499-e)})),switchMapLayer=t=>{let e=$("#map"+t).text();e.includes(checkStr)?(jsonMapLayers[dataNames[t]].removeFrom(map),$("#map"+t).text(e.replace(checkStr,""))):(jsonMapLayers[dataNames[t]].addTo(map),$("#map"+t).text(checkStr+e))};