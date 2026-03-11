// MAP BOUNDS - set bounds so the map has limits for visibility 
var southWest = L.latLng(40.567, -74.054),
    northEast = L.latLng(40.749858, -73.861),
    bounds = L.latLngBounds(southWest, northEast);

// MAP OBJECT
var mymap = L.map('mapid', {
    maxBounds: bounds, // Map automatically bounces back to center
    maxZoom: 18,
    minZoom: 12
}).setView([40.65, -73.97], 12);

// BASEMAP
var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA'
}).addTo(mymap);

var zipGroup = new L.layerGroup(); //
var annualCheckHood = new Array(); //
var cervicalScreenZip = new Array(); // TEAL
var ColorectalScreenZip = new Array(); // NAVY BLUE
var MammographZip = new Array(); // PINK
var cancerZip = new Array(); //
var unInsuredZip = new Array(); //
var smokersZip = new Array(); //
var bingeDrinkers = new Array(); //
var obeseZip = new Array(); //
var inactiveZip = new Array(); //
var asthmaZip = new Array(); //
var kidneyZip = new Array(); //
var sleeplessZip = new Array(); //
var diabeticZip = new Array(); //
var zipData = new Array(); //
var displayData;
var zipSelected;
var zipOutlines;

//=========================================================== LANGUAGE LAYERS =================================================================

var languageGroup = new L.featureGroup();
// homeLanguage LAYER ADD
var languageLayer =  L.geoJson(null, {
        style: style,
        onEachFeature: function(feature, layer) {
            //ADD LANGUAGE POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.ntaname +
                ')</h5> <p>Approximately <strong>' + (feature.properties.TotalPop).toLocaleString('en', {maximumFractionDigits:0})   +
                '</strong> people live in ' + feature.properties.TractName + ', and around <strong>' + feature.properties.Multi + '%</strong> of these residents speak a language other than English. <br><br> The predominant non-English spoken language is: <strong>' + feature.properties.Predominan + '</strong></p><p style="font-size: 9px;">Data is from the American Community Survey<br> <i>2014-2018 - Language Spoken at Home</i> </p>');

            // ADD MOUSEOVER 
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    }).addTo(languageGroup);

$.getJSON("Brooklyn_Language.geojson", function(data) {
    languageLayer.addData(data);
});

languageGroup.addTo(mymap)

// LANGUAGE LEGEND
var languageLegend = L.control({
    position: "bottomleft"
});
languageLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Predominant Languages</h4>";
    div.innerHTML += '<i style="background: #ccb8cbff"></i><span>African languages</span><br>';
    div.innerHTML += '<i style="background: #fa9993ff"></i><span>Arabic</span><br>';
    div.innerHTML += '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
    div.innerHTML += '<i style="background: #6b5b95"></i><span>French</span><br>';
    div.innerHTML += '<i style="background: #f7d9b6ff"></i><span>Greek</span><br>';
    div.innerHTML += '<i style="background: #30bfc7ff"></i><span>Haitian Creole</span><br>';
    div.innerHTML += '<i style="background: #eb554dff"></i><span>Hebrew</span><br>';
    div.innerHTML += '<i style="background: #c7e9b4"></i><span>Italian</span><br>';
    div.innerHTML += '<i style="background: #91c1fdff"></i><span>Mixed Indic languages</span><br>';
    div.innerHTML += '<i style="background: #51eba6ff"></i><span>Polish</span><br>';
    div.innerHTML += '<i style="background: #e28513ff"></i><span>Russian</span><br>';
    div.innerHTML += '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>Urdu</span><br>';
    div.innerHTML += '<i style="background: #3288bd"></i><span>Yiddish</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}
languageLegend.addTo(mymap);

function getColor(d) {
    return d == "African languages" ? '#ccb8cbff' :
        d == "Arabic" ? '#fa9993ff' :
        d == "Chinese" ? '#963f92ff' :
        d == "French" ? '#6b5b95' :
        d == "Greek" ? '#f7d9b6ff' :
        d == "Haitian Creole" ? '#30bfc7ff' :
        d == "Hebrew" ? '#eb554dff' :
        d == "Italian" ? '#c7e9b4' :
        d == "Mixed Indic languages" ? '#91c1fdff' :
        d == "Polish" ? '#51eba6ff' :
        d == "Russian" ? '#e28513ff' :
        d == "Spanish" ? '#41ab5d' :
        d == "Urdu" ? '#e7298a' :
        d == "Yiddish" ? '#3288bd' :
        '#606060';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.Predominan),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    };
}

//=========================================================== PLACES ZIP CODE LEVEL =================================================================
var zipGroup = new L.layerGroup();


var zipLabels =  L.geoJson(null, {
       pointToLayer: function(feature,latlng){
    label = String(feature.properties.ZIPCODE) // .bindTooltip can't use straight 'feature.properties.attribute'
    return new L.CircleMarker(latlng, {
      radius: 1,
    }).bindTooltip(label, {permanent: true, opacity: 1, direction:'center'}).openTooltip();
    }
  }).addTo(zipGroup)


$.getJSON("zipPoints.geojson", function(data) {
    zipLabels.addData(data);
});


mymap.createPane("pane650").style.zIndex = 650;

var placesZipLayer = L.geoJson(null, {
    pane: "pane650",
        style: {
    "color": "#fff",
    "weight": 5,
    "opacity": 0.65
},
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3> Zip code: ' + feature.properties.Zip + '</h3> <p>The estimated total population of people living in <strong>' + feature.properties.Zip + ' (' + feature.properties.Hood + ') ' +
                '</strong> is <strong>' + (feature.properties.Total_popu).toLocaleString('en', {maximumFractionDigits:0}) + '</strong>.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.2
                })
            });
        }
    }).addTo(zipGroup)

$.getJSON("ZIP_CODE.geojson", function(data) {
    placesZipLayer.addData(data);


var codes = new Array(); //ordered zip codes empty array
// ADD DATA IN XY PAIRS FOR CHART
    data.features.forEach(function(feature) {
        // COLLECT NEIGHBORHOOD CHART DATA 
        cancerZip.push([feature.properties.Hood, feature.properties.Ncancer]);
        cervicalScreenZip.push([feature.properties.Hood, feature.properties.Ncervical]);
        ColorectalScreenZip.push([feature.properties.Hood, feature.properties.Ncolorecta]);
        MammographZip.push([feature.properties.Hood, feature.properties.Nmammogr]);
        smokersZip.push([feature.properties.Hood, feature.properties.Nsmoker]);
        bingeDrinkers.push([feature.properties.Hood, feature.properties.Ndrink]);
        obeseZip.push([feature.properties.Hood, feature.properties.Nobese]);
        inactiveZip.push([feature.properties.Hood, feature.properties.Ninactive]);
        unInsuredZip.push([feature.properties.Hood, feature.properties.Nuninsured]);
        annualCheckHood.push([feature.properties.Hood, feature.properties.Nannual]);
        asthmaZip.push([feature.properties.Hood, feature.properties.Nasthma]);
        kidneyZip.push([feature.properties.Hood, feature.properties.Nkidney]);
        sleeplessZip.push([feature.properties.Hood, feature.properties.Nannual]);
        diabeticZip.push([feature.properties.Hood, feature.properties.Ndiabetic]);

// TEXT TO RETURN WITH ZIP CODE SELECTOR 
zipData.push([
feature.properties.Zip, '<h4 style="text-align: center"><strong>'+feature.properties.Zip  +'</strong></h4> <p>Neighborhood: ' +feature.properties.Hood  +'<br>Estimated Population: ' +(feature.properties.Total_popu).toLocaleString('en', {maximumFractionDigits:0})    +'</p><h5><strong>Language Statistics</strong></h5> <li>Speakers of one or more language other than English: ' +feature.properties.P_bilingua  +'%</li><li>Non-English fluent: ' +feature.properties.P_nonFluen  +'%</li> <li>Most commonly spoken non-English language: <span class='+feature.properties.Predominan+'> ' +feature.properties.Predominan  +'</span></li><br> <h5><strong>Health Statistics</strong></h5> <li>Uninsured: ' +feature.properties.UNINSURED  +'%</li><h6 style="line-height: 0.4;margin-bottom: 5px;margin-top: 10px;"><i style="font-size: 13px;line-height: 0px;letter-spacing: 0.069em;font-weight: 600; font-style: normal;">Health Outcomes</i></h6><li>Cancer prevelance '+feature.properties.CANCER  + '%</li><li>Chronic kidney disease: ' +feature.properties.KIDNEY  +'%</li> <li>Asthma: ' +feature.properties.ASTHMA  +'%</li><li>Diabetes: ' +feature.properties.DIABETES  +'%</li>  <li>Obesity (<i>BMI ≥ 30</i>): ' +feature.properties.OBESITY  +'%</li><h6 style="line-height: 0.4;margin-bottom: 5px;margin-top: 10px;"><i style="font-size: 13px;line-height: 0px;letter-spacing: 0.069em;font-weight: 600; font-style: normal;">Unhealthy Behaviors</i></h6><li>Smokers: ' +feature.properties.SMOKING  +'%</li> <li>Binge drinkers: ' +feature.properties.DRINK  +'%</li> <li>Do not participate in physical activities or exercises: ' +feature.properties.INACTIVE  +'%</li><li>Typically sleep fewer than 7 hours per night: ' +feature.properties.SLEEPLESS  +'%</li><h6 style="line-height: 0.4;margin-bottom: 5px;margin-top: 10px;"><i style="font-size: 13px;line-height: 0px;letter-spacing: 0.069em;font-weight: 600; font-style: normal;">Screening Rates</i></h6><li>Recent check up with primary care physician: ' +feature.properties.CHECKUP  +'%</li> <li>Recent colorectal cancer screening: ' +feature.properties.COLORECTAL  +'%</li> <li>Recent cervical cancer screening: ' +feature.properties.CERVICAL  +'%</li> <li>Recent visit to a dentist or dental clinic: ' +feature.properties.DENTAL  +'%</li> <li>Recent mammography scereening (<i>women aged 50-74 years</i>): ' +feature.properties.MAMMO  +'%</li>'
]);

        // SORT ZIP CODES FOR DROPDOWN
        codes.push(feature.properties.Zip);
        codes.sort();
    });

    // ORDERED ZIP CODES FOR DROPDOWN && EXCLUDE 11249 WHICH HAS NO HEALTH DATA
    codes.forEach(function(zip) {
        if (zip !== 11249) { //no health data available for 11249
        $('#zipCodes').append('<option value "' + zip + '">' + zip + '</option>');
        }
    });


    // ON CHANGING ZIP CODE
$(document).ready(function(){
  $('#zipCodes').on('change',function(){
  zipSelected = $("#zipCodes option:selected").text();
console.log(zipSelected)
// MATCH zipData AND RETURN APPROPRIATE TEXT

  for( var i = 0; i < 99; i++ ) {
    if( zipData[i][0] == zipSelected ) {
        document.getElementById("mapContainer1").innerHTML = zipData[i][1];
        highLight(zipSelected)
        break;
    } 
    else {
        document.getElementById("mapContainer1").innerHTML = '<br><br><h3 style= "text-align:center">Select a new zip code</h3><br><h3 style= "text-align:center"><i>or</i></h3><br><h5 style="text-align:center">Check out the charts below to see an overview of the health statistics on a neighborhood level.</h5><br><h4 style= "text-align:center"><i class="fa fa-arrow-down" aria-hidden="true"></i><h4><br><h5 style= "text-align:center"><i class="fa fa-arrow-down" aria-hidden="true"></i></h5><br><br><h6 style= "text-align:center"><i class="fa fa-arrow-down" aria-hidden="true"></i></h6>';
    }
  }
});
});

// NEIGHBORHOOD LEVEL CHARTS

    $('#CHART_screening').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Percentage of Health Screenings by Neighborhood"
        },
        xAxis: {
            type: 'category',
            allowDecimals: false,
            title: {
                text: ""
            }
        },
        yAxis: {
            title: {
                text: "Percentage (%)"
            }
        },
                tooltip:{
  enabled: true,
  pointFormat: '{series.name}: <b>{point.y}{point.percentage:.1f}%</b>'
  },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    rotation: 270,
                    align: 'top',
                    //x: 10,
                    y: -5,
                    crop: true,
                    overflow: "none",
                    verticalAlign: 'top',
                    style: {
                        color: 'black',
                        font: '11px Arial, sans-serif',
                        //fontWeight: 'normal',
                    },
                    pointFormat: '{point.y}{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            name: 'Colorectal Cancer Screening',
            data: ColorectalScreenZip,
            color: '#00008b'
        }, {

            name: 'Cervical Cancer Screening',
            data: cervicalScreenZip,
            color: '#008080'
        }, {

            name: 'Mammography Screening',
            data: MammographZip,
            color: '#ffc0cb'
        }, {
            name: 'Annual Check Up',
            data: annualCheckHood,
            color: '#c0dcec'
        }]
    }); 


    $('#CHART_behavior').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Percentage of Unhealthy Behaviors by Neighborhood"
        },
        xAxis: {
            type: 'category',
            allowDecimals: false,
            title: {
                text: ""
            }
        },
        yAxis: {
            title: {
                text: "Percentage (%)"
            }
        },
                tooltip:{
  enabled: true,
  pointFormat: '{series.name}: <b>{point.y}{point.percentage:.1f}%</b>'
  },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    rotation: 270,
                    align: 'top',
                    //x: 10,
                    y: -5,
                    crop: true,
                    overflow: "none",
                    verticalAlign: 'top',
                    style: {
                        color: 'black',
                        font: '10px Arial, sans-serif',
                        //fontWeight: 'normal',
                    },
                    pointFormat: '{point.y}{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            name: 'Uninsured',
            data: unInsuredZip,
            color: '#f1ced4'
        }, {
            name: 'Current Smokers',
            data: smokersZip,
            color: '#808080'
        }, {
            name: 'Binge Drinkers',
            data: bingeDrinkers,
            color: '#d8ddb8'
        }, {
            name: 'Obesity',
            data: obeseZip,
            color: '#e0ac8e'
        }, {
            name: 'Physical Inactivity',
            data: inactiveZip,
            color: '#6d3d38'
        }]
    });


    $('#CHART_health').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: "Percentage of Health Outcomes by Neighborhood"
        },
        xAxis: {
            type: 'category',
            allowDecimals: false,
            title: {
                text: ""
            }
        },
        yAxis: {
            title: {
                text: "Percentage (%)"
            }
        },
                tooltip:{
  enabled: true,
  pointFormat: '{series.name}: <b>{point.y}{point.percentage:.1f}%</b>'
  },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    align: 'top',
                    //x: 10,
                    y: -5,
                    crop: true,
                    overflow: "none",
                    verticalAlign: 'top',
                    style: {
                        color: 'black',
                        font: '11px Arial, sans-serif',
                        //fontWeight: 'normal',
                    },
                    pointFormat: '{point.y}{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            name: 'Chronic Kidney Disease',
            data: kidneyZip,
            color: '#228b22'
        }, {
            name: 'Overall Cancer Prevelance',
            data: cancerZip,
            color: '#b394c1'
        }, {
            name: 'Asthma',
            data: asthmaZip,
            color: '#c0c0c0'
        }, {
            name: 'Diabetic',
            data: diabeticZip,
            color: '#db7093'
        }]
    });

});


//IF WE STILL WANT TO DO A DRILL: arr1.push({label:data.features[i].properties.NAME, value:"senate"});


//=========================================================== PLACES TRACT LEVEL =================================================================

//   OUTCOMES ---- 

//CANCER
var cancerLayer =  L.geoJson(null, {
        style: styleCancer,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0}) +
                '</strong> people live in this census tract, and the estimated prevalence rate of cancer (excluding skin cancer) among adults, 18 years and older, is: <strong>' + feature.properties.CANCER + '%</strong>. </p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    });

var cancerLegend = L.control({
    position: "bottomleft"
});
cancerLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Cancer Prevelance</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>for all types but skin</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>9.8% - 15%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>7.8% - 9.8%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>6.6% - 7.8%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>5.7% - 6.6%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>4.9% - 5.7%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>4.1% - 4.9%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 4.1%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCancer(percent) {
    return percent > 9.8 ?
        "#91003f" :
        percent > 7.8 ?
        "#ce1256" :
        percent > 6.6 ?
        "#e7298a" :
        percent > 5.7 ?
        "#df65b0" :
        percent > 4.9 ?
        "#c994c7" :
        percent > 4.1 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleCancer(feature) {
    return {
        fillColor: colorCancer(feature.properties.CANCER),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//High_blood

var bloodPressureLayer =  L.geoJson(null, {
        style: styleBP,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.High_blood + '%</strong> of residents have high blood pressure.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var bpLegend = L.control({
    position: "bottomleft"
});
bpLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>High Blood Pressure</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>46.3% - 57.6%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>35.5% - 46.3%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>31.1% - 35.5%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>27.5% - 31.1%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>23.7% - 27.5%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>19.1% - 23.7%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 19.1%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorBP(percent) {
    return percent > 46.3 ?
        "#91003f" :
        percent > 35.5 ?
        "#ce1256" :
        percent > 31.1 ?
        "#e7298a" :
        percent > 27.5 ?
        "#df65b0" :
        percent > 23.7 ?
        "#c994c7" :
        percent > 19.1 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleBP(feature) {
    return {
        fillColor: colorBP(feature.properties.High_blood),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//ASTHMA 

var asthmaLayer =  L.geoJson(null, {
        style: styleAsthma,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.ASTHMA + '%</strong> of residents have asthma.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var asthmaLegend = L.control({
    position: "bottomleft"
});
asthmaLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Asthma Prevalence</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>13.4% - 16%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>12.2% - 13.4%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>11.3% - 12.2%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>10.4% - 11.3%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>9.4% - 10.4%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>8.6% - 9.4%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 8.6%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorAsthma(percent) {
    return percent > 13.4 ?
        "#91003f" :
        percent > 12.2 ?
        "#ce1256" :
        percent > 11.3 ?
        "#e7298a" :
        percent > 10.4 ?
        "#df65b0" :
        percent > 9.4 ?
        "#c994c7" :
        percent > 8.6 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleAsthma(feature) {
    return {
        fillColor: colorAsthma(feature.properties.ASTHMA),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//Coronary_h 

var heartDiseaseLayer =  L.geoJson(null, {
        style: styleHeart,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.Coronary_h + '%</strong> of residents have had angina or coronary heart disease.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var heartLegend = L.control({
    position: "bottomleft"
});
heartLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Coronary Heart Disease</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>16% - 26.7%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>10.5% - 16%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>7.6% - 10.5%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>6.1% - 7.6%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>5% - 6.1%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>3.8% - 5%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 3.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorHeart(percent) {
    return percent > 16 ?
        "#91003f" :
        percent > 10.5 ?
        "#ce1256" :
        percent > 7.6 ?
        "#e7298a" :
        percent > 6.1 ?
        "#df65b0" :
        percent > 5 ?
        "#c994c7" :
        percent > 3.8 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleHeart(feature) {
    return {
        fillColor: colorHeart(feature.properties.Coronary_h),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//DIABETES
var diabetesLayer =  L.geoJson(null, {
        style: styleDiabetes,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.DIABETES + '%</strong> of residents have diabetes (excluding diabetes during pregnancy).</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var diabetesLegend = L.control({
    position: "bottomleft"
});
diabetesLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Diabetes Prevalence</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>18.4% - 31%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>14.7% - 18.4%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>12.3% - 14.7%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>10.6% - 12.3%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>8.8% - 10.6%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>6.4% - 8.8%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 6.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorDiabetes(percent) {
    return percent > 18.4 ?
        "#91003f" :
        percent > 14.7 ?
        "#ce1256" :
        percent > 12.3 ?
        "#e7298a" :
        percent > 10.6 ?
        "#df65b0" :
        percent > 8.8 ?
        "#c994c7" :
        percent > 6.4 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleDiabetes(feature) {
    return {
        fillColor: colorDiabetes(feature.properties.DIABETES),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
    //High_chole
var hCholestorolLayer =  L.geoJson(null, {
        style: styleCholestorol,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.High_chole + '%</strong> of residents have high cholesterol.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var cholestorolLegend = L.control({
    position: "bottomleft"
});
cholestorolLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>High Cholestorol</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>37.2% - 51.2%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>33% - 37.2%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>30.7% - 33%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>28.4% - 30.7%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>25.8% - 28.4%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>22.4% - 25.8%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 22.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCholestorol(percent) {
    return percent > 37.2 ?
        "#91003f" :
        percent > 33 ?
        "#ce1256" :
        percent > 30.7 ?
        "#e7298a" :
        percent > 28.4 ?
        "#df65b0" :
        percent > 25.8 ?
        "#c994c7" :
        percent > 22.4 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleCholestorol(feature) {
    return {
        fillColor: colorCholestorol(feature.properties.High_chole),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
    //KIDNEY
var kidneyLayer =  L.geoJson(null, {
        style: styleKidney,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.KIDNEY + '%</strong> of residents have kidney disease.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var kidneyLegend = L.control({
    position: "bottomleft"
});
kidneyLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Chronic Kidney Disease</h4>";
    div.innerHTML += '<i style="background: #91003f"></i><span>6.3% - 10.8%</span><br>';
    div.innerHTML += '<i style="background: #ce1256"></i><span>4.4% - 6.3%</span><br>';
    div.innerHTML += '<i style="background: #e7298a"></i><span>3.6% - 4.4%</span><br>';
    div.innerHTML += '<i style="background: #df65b0"></i><span>3.1% - 3.6%</span><br>';
    div.innerHTML += '<i style="background: #c994c7"></i><span>2.6% - 3.1%</span><br>';
    div.innerHTML += '<i style="background: #d4b9da"></i><span>2% - 2.6%</span><br>';
    div.innerHTML += '<i style="background: #e7e1ef"></i><span>0% - 2%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorKidney(percent) {
    return percent > 6.3 ?
        "#91003f" :
        percent > 4.4 ?
        "#ce1256" :
        percent > 3.6 ?
        "#e7298a" :
        percent > 3.1 ?
        "#df65b0" :
        percent > 2.6 ?
        "#c994c7" :
        percent > 2 ?
        "#d4b9da" :
        percent > 0 ?
        "#e7e1ef" :
        "#606060";
}

function styleKidney(feature) {
    return {
        fillColor: colorKidney(feature.properties.KIDNEY),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//   SCREENING ---- 

//=========================


var cervicalLayer =  L.geoJson(null, {
        style: styleCervical,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.CERVICAL + '%</strong> of female residents (age 21–65) who have had cervical cancer screening test.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var cervicalLegend = L.control({
    position: "bottomleft"
});
cervicalLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Cervical Cancer Screening</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>87.4% - 91%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>85.2% - 87.4%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>82.6% - 85.2%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>79.1% - 82.6%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>74.6% - 79.1%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>66.6% - 74.6%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 66.6%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCervical(percent) {
    return percent > 87.4 ?
        "#6e016b" :
        percent > 85.2 ?
        "#88419d" :
        percent > 82.6 ?
        "#8c6bb1" :
        percent > 79.1 ?
        "#8c96c6" :
        percent > 74.6 ?
        "#9ebcda" :
        percent > 66.6 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleCervical(feature) {
    return {
        fillColor: colorCervical(feature.properties.CERVICAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//CHECKUP

var checkupLayer =  L.geoJson(null, {
        style: styleCheck,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.CHECKUP + '%</strong> of residents  having been to a doctor for a routine checkup (e.g., a general physical exam) in the previous year.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var checkLegend = L.control({
    position: "bottomleft"
});
checkLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Annual Check Up</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>85.2% - 88.9%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>83.4% - 85.2%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>81.5% - 83.4%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>79.5% - 81.5%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>77.5% - 79.5%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>75.4% - 77.5%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 75.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorCheck(percent) {
    return percent > 85.2 ?
        "#6e016b" :
        percent > 83.4 ?
        "#88419d" :
        percent > 81.5 ?
        "#8c6bb1" :
        percent > 79.5 ?
        "#8c96c6" :
        percent > 77.5 ?
        "#9ebcda" :
        percent > 75.4 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleCheck(feature) {
    return {
        fillColor: colorCheck(feature.properties.CHECKUP),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//COLORECTAL

var colorectalLayer =  L.geoJson(null, {
        style: styleColorectal,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.COLORECTAL + '%</strong> of residents have received a recommended colorectal cancer screening test within the appropriate time interval.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var colorectalLegend = L.control({
    position: "bottomleft"
});
colorectalLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Colorectal Cancer Screening</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>69.2% - 74.1%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>65.9% - 69.2%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>62.6% - 65.9%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>58.8% - 62.6%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>54.4% - 58.8%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>48.8% - 54.4%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 48.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorColorectal(percent) {
    return percent > 69.2 ?
        "#6e016b" :
        percent > 65.9 ?
        "#88419d" :
        percent > 62.6 ?
        "#8c6bb1" :
        percent > 58.8 ?
        "#8c96c6" :
        percent > 54.4 ?
        "#9ebcda" :
        percent > 48.8 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleColorectal(feature) {
    return {
        fillColor: colorColorectal(feature.properties.COLORECTAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//DENTAL
var dentistLayer =  L.geoJson(null, {
        style: styleDentist,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.DENTAL + '%</strong> of residents report having been to the dentist or dental clinic in the previous year. </p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var dentistLegend = L.control({
    position: "bottomleft"
});
dentistLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Dental Check Up</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>76.8% - 85.1%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>71.1% - 76.8%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>66.1% - 71.1%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>61.1% - 66.1%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>55.8% - 61.1%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>48.8% - 55.8%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 48.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorDentist(percent) {
    return percent > 76.8 ?
        "#6e016b" :
        percent > 71.1 ?
        "#88419d" :
        percent > 66.1 ?
        "#8c6bb1" :
        percent > 61.1 ?
        "#8c96c6" :
        percent > 55.8 ?
        "#9ebcda" :
        percent > 48.8 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleDentist(feature) {
    return {
        fillColor: colorDentist(feature.properties.DENTAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
    //MAMMO
var mammogramLayer =  L.geoJson(null, {
        style: styleMammo,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.MAMMO + '%</strong> of female residents (aged 50–74 years) report having had a mammogram within the previous 2 years.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var mammoLegend = L.control({
    position: "bottomleft"
});
mammoLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Mammamography Screening</h4>";
    div.innerHTML += '<i style="background: #6e016b"></i><span>85.3% - 88.3%</span><br>';
    div.innerHTML += '<i style="background: #88419d"></i><span>84% - 85.3%</span><br>';
    div.innerHTML += '<i style="background: #8c6bb1"></i><span>82.4% - 84%</span><br>';
    div.innerHTML += '<i style="background: #8c96c6"></i><span>80.9% - 82.4%</span><br>';
    div.innerHTML += '<i style="background: #9ebcda"></i><span>79.7% - 80.9%</span><br>';
    div.innerHTML += '<i style="background: #bfd3e6"></i><span>78.2% - 79.7%</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 78.2%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorMammo(percent) {
    return percent > 85.3 ?
        "#6e016b" :
        percent > 84 ?
        "#88419d" :
        percent > 82.4?
        "#8c6bb1" :
        percent > 80.9 ?
        "#8c96c6" :
        percent > 79.7 ?
        "#9ebcda" :
        percent > 78.2 ?
        "#bfd3e6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function styleMammo(feature) {
    return {
        fillColor: colorMammo(feature.properties.MAMMO),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//   BEHAVIORS ---- 

//smokersTract 
var smokerLayer =  L.geoJson(null, {
        style: styleSmoke,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.SMOKING + '%</strong> of residents report having smoked ≥100 cigarettes in their lifetime and currently smoke every day or some days.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

// SMOKE LEGEND 
var smokeLegend = L.control({
    position: "bottomleft"
});
smokeLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Adult Smokers</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>25.3% - 32%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>21% - 25.3%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>17.6% - 21%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>15% - 17.6%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>12.8% - 15%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>10.3% - 12.8%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 10.3%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorSmoke(percent) {
    return percent > 25.3 ?
        "#034e7b" :
        percent > 21 ?
        "#0570b0" :
        percent > 17.6 ?
        "#3690c0" :
        percent > 15 ?
        "#74a9cf" :
        percent > 12.8 ?
        "#a6bddb" :
        percent > 10.3 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

// PLACES POLYGON OUTLINE COLORS
function styleSmoke(feature) {
    return {
        fillColor: colorSmoke(feature.properties.SMOKING),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
//drinkersTract  

var drinkersLayer =  L.geoJson(null, {
        style: styleDrink,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.DRINK + '%</strong> of residents have 4 or more alcoholic beverages on an occasion in the past 30 days.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var drinkLegend = L.control({
    position: "bottomleft"
});
drinkLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Frequent Drinkers</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>23.1% - 26.9%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>20.6% - 23.1%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>18.4% - 20.6%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>16.6% - 18.46%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>15.5% - 16.6%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>13.1% - 15.5%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 13.1%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorDrink(percent) {
    return percent > 23.1 ?
        "#034e7b" :
        percent > 20.6 ?
        "#0570b0" :
        percent > 18.4 ?
        "#3690c0" :
        percent > 16.6 ?
        "#74a9cf" :
        percent > 15.5 ?
        "#a6bddb" :
        percent > 13.1 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleDrink(feature) {
    return {
        fillColor: colorDrink(feature.properties.DRINK),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}


//=========================
    //INACTIVE
var sedentaryLayer =  L.geoJson(null, {
        style: styleInactive,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.INACTIVE + '%</strong> of residents do not participate in physical activity or exercise other than their regular work.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

var inactiveLegend = L.control({
    position: "bottomleft"
});
inactiveLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Physically Inactive</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>38.1% - 51%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>32.4% - 38.1%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>28.2% - 32.4%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>24.6% - 28.2%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>20.9% - 24.6%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>16.5% - 20.9%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 16.5%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorInactive(percent) {
    return percent > 38.1 ?
        "#034e7b" :
        percent > 32.4 ?
        "#0570b0" :
        percent > 28.2 ?
        "#3690c0" :
        percent > 24.6 ?
        "#74a9cf" :
        percent > 20.9 ?
        "#a6bddb" :
        percent > 16.5 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}


function styleInactive(feature) {
    return {
        fillColor: colorInactive(feature.properties.INACTIVE),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
    //OBESITY
var obesityLayer =  L.geoJson(null, {
        style: styleObese,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.OBESITY + '%</strong> of residents are obese (having a body mass index measure ≥ 30).</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // OBESITY LEGEND 
var obeseLegend = L.control({
    position: "bottomleft"
});
obeseLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Obesity Prevalence</h4>";
    div.innerHTML += "<h4 style='font-size: 0.7rem;font-style: italic;'>BMI ≥ 30</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>34.3% - 40.6%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>31.1% - 34.3%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>28.2% - 31.1%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>25.2% - 28.2%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>22.3% - 25.2%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>19.7% - 22.3%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 19.7%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorObesity(percent) {
    return percent > 34.3 ?
        "#034e7b" :
        percent > 31.1 ?
        "#0570b0" :
        percent > 28.2 ?
        "#3690c0" :
        percent > 25.2 ?
        "#74a9cf" :
        percent > 22.3 ?
        "#a6bddb" :
        percent > 19.7 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleObese(feature) {
    return {
        fillColor: colorObesity(feature.properties.OBESITY),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
    //SLEEPLESS
var sleepLayer =  L.geoJson(null, {
        style: styleSleep,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.SLEEPLESS + '%</strong> of residents sleep <7 hours on average, during a 24-hour period.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // SLEEP LEGEND 
var sleepLegend = L.control({
    position: "bottomleft"
});
sleepLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Sleep <7 Hours</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>47.7% - 51.8%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>45.2% - 47.7%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>42.8% - 45.2%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>40.4% - 48.2%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>38% - 40.4%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>35.4% - 38%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 35.4%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

// PLACES CHOROPLETH BY % CANCER PREVELANCE 51.8
function colorSleep(percent) {
    return percent > 47.7 ?
        "#034e7b" :
        percent > 45.2 ?
        "#0570b0" :
        percent > 42.8 ?
        "#3690c0" :
        percent > 40.4 ?
        "#74a9cf" :
        percent > 38 ?
        "#a6bddb" :
        percent > 35.4 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleSleep(feature) {
    return {
        fillColor: colorSleep(feature.properties.SLEEPLESS),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
//UNINSURED
var uninsuredLayer =  L.geoJson(null, {
        style: styleUninsured,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract, and ' + feature.properties.UNINSURED + '%</strong> of residents (aged 18–64) report having no current health insurance coverage.</p><p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // UNINSURED LEGEND 
var uninsuredLegend = L.control({
    position: "bottomleft"
});
uninsuredLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Percent Uninsured</h4>";
    div.innerHTML += '<i style="background: #034e7b"></i><span>28.3% - 35.8%</span><br>';
    div.innerHTML += '<i style="background: #0570b0"></i><span>23.4% - 28.3%</span><br>';
    div.innerHTML += '<i style="background: #3690c0"></i><span>19.1% - 23.4%</span><br>';
    div.innerHTML += '<i style="background: #74a9cf"></i><span>15.6% - 19.1%</span><br>';
    div.innerHTML += '<i style="background: #a6bddb"></i><span>12.8% - 15.6%</span><br>';
    div.innerHTML += '<i style="background: #d0d1e6"></i><span>9.8% - 12.8%</span><br>';
    div.innerHTML += '<i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

// PLACES CHOROPLETH BY % CANCER PREVELANCE 35.8
function colorUninsured(percent) {
    return percent > 28.3 ?
        "#034e7b" :
        percent > 23.4 ?
        "#0570b0" :
        percent > 19.1 ?
        "#3690c0" :
        percent > 15.6 ?
        "#74a9cf" :
        percent > 12.8 ?
        "#a6bddb" :
        percent > 9.8 ?
        "#d0d1e6" :
        percent > 0 ?
        "#f1eef6" :
        "#606060";
}

function styleUninsured(feature) {
    return {
        fillColor: colorUninsured(feature.properties.UNINSURED),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}

//=========================
//POPULATION
var popLayer =  L.geoJson(null, {
        style: stylePop,
        onEachFeature: function(feature, layer) {
            //ADD POP UP
            layer.bindPopup('<h3>' + feature.properties.TractName + '</h3> <h5>(' + feature.properties.Hood +
                ')</h5> <p>Approximately <strong>' + (feature.properties.POPULATION).toLocaleString('en', {maximumFractionDigits:0})  +
                '</strong> people live in this census tract. <p style="font-size: 9px;">Data is from the 2020 PLACES: Local Data for Better Health project</p>');
            layer.on('mouseover', function() {
                layer.setStyle({
                    fillOpacity: 0.3
                })
            })
            layer.on('mouseout', function() {
                layer.setStyle({
                    fillOpacity: 0.8
                })
            });
        }
    })

    // UNINSURED LEGEND 
var popLegend = L.control({
    position: "bottomleft"
});
popLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Population by Tract</h4>";
    div.innerHTML += '<i style="background: #005824"></i><span>6,126 - 8,938</span><br>';
    div.innerHTML += '<i style="background: #238b45"></i><span>4,848 - 6,126</span><br>';
    div.innerHTML += '<i style="background: #41ae76"></i><span>3,891 - 4,848</span><br>';
    div.innerHTML += '<i style="background: #66c2a4"></i><span>3,106 - 3,891</span><br>';
    div.innerHTML += '<i style="background: #99d8c9"></i><span>2,392 - 3,106</span><br>';
    div.innerHTML += '<i style="background: #ccece6"></i><span>1,678 - 2,392</span><br>';
    div.innerHTML += '<i style="background: #edf8fb"></i><span>0% - 1,678</span><br>';
    div.innerHTML += '<i style="background: #606060"></i><span>No Data</span><br>';
    return div;
}

function colorPop(percent) {
    return percent > 6126 ?
        "#005824" :
        percent > 4848 ?
        "#238b45" :
        percent > 3891 ?
        "#41ae76" :
        percent > 3106 ?
        "#66c2a4" :
        percent > 2392 ?
        "#99d8c9" :
        percent > 1678 ?
        "#ccece6" :
        percent > 0 ?
        "#edf8fb" :
        "#606060";
}

function stylePop(feature) {
    return {
        fillColor: colorPop(feature.properties.POPULATION),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        //dashArray: '3',
        fillOpacity: 0.8
    }
}
//=========================
// PLACES TRACT GEOJSON

$.getJSON("PLACEStract_FeaturesToJSON.geojson", function(data) {
    cancerLayer.addData(data);
    smokerLayer.addData(data);
    heartDiseaseLayer.addData(data);
    checkupLayer.addData(data);
    colorectalLayer.addData(data);
    dentistLayer.addData(data);
    diabetesLayer.addData(data);
    hCholestorolLayer.addData(data);
    kidneyLayer.addData(data);
    sedentaryLayer.addData(data);
    mammogramLayer.addData(data);
    obesityLayer.addData(data);
    sleepLayer.addData(data);
    uninsuredLayer.addData(data);
    cervicalLayer.addData(data);
    asthmaLayer.addData(data);
    bloodPressureLayer.addData(data);
    drinkersLayer.addData(data);
    popLayer.addData(data);
});


//===================================================== CHARTS TABBED BOX  =============================================================

function openCity(evt, cityName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-blue", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " w3-blue";
}

//=================================================== ZIPCODE OUTLINES =====================================================
// highlight above all other layers
mymap.createPane("pane660").style.zIndex = 660;

// HIGHLIGHT SELECTED ZIP CODE BOUNDARY

zipOutlines = L.geoJson(null, {
    style: styleZIP
    }).addTo(mymap); 

function highLight(zipSelected) {
    mymap.removeLayer(zipOutlines);
    zipOutlines = L.geoJson(null, {
    pane: "pane660",
    style: styleZIP,
    interactive: false 
    }).addTo(mymap); 

$.getJSON("ZIP_CODE_outlines.geojson", function(data) {   
    var objects = data.features.find(function(feature) {
    return feature.properties.ZIPCODE == zipSelected;
});
    zipOutlines.addData(objects);
});
        }

function styleZIP(feature) {
    if (zipSelected == feature.properties.ZIPCODE) {
    return {
        fillColor: feature.properties.ZIPCODE,
        weight: 5,
        opacity: 1,
        color: 'yellow',
        fillOpacity: 0.1,
    }} else {
            return {
                weight: 0.1,
                opacity: 0.1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0,
                fillColor: 'white',
            };
        } 
    }


//=================================================== CONTROL LAYER VISIBILITY =====================================================

// LAYER GROUPS

var demoGroup = {
    "Brooklyn Language Map": languageLayer,
    "Population by Tract": popLayer,
}

var outcomesGroup = {
    "Cancer Prevalence": cancerLayer,
    "Coronary Heart Disease": heartDiseaseLayer,
    "Asthma Prevalence": asthmaLayer,
    "High Blood Pressure": bloodPressureLayer,
    "Diabetes Prevalence": diabetesLayer,
    "High Cholestorol": hCholestorolLayer,
    "Chronic Kidney Disease": kidneyLayer,
}

var screeningGroup = {
    "Recent Annual Check Up": checkupLayer,
    "Recent Dentist Visits": dentistLayer,
    "Cervical Cancer Screening": cervicalLayer,
    "Mammography Screening": mammogramLayer,
    "Colorectal Cancer Screening" : colorectalLayer
}

var behaviorGroup = {
    "Percent Uninsured": uninsuredLayer,
    "Current Smokers": smokerLayer,
    "Frequent Drinkers": drinkersLayer,
    "Obesity Prevalence": obesityLayer,
    "Sedentary Lifestyle": sedentaryLayer,
    "<7 Hours Sleep": sleepLayer,
}

var overlay = {
    "See Zip Code Boundaries ": zipGroup
}

// LAYER CONTROLS

var demographics = L.control.layers(demoGroup, overlay,{
    collapsed:false 
}).addTo(mymap);

var outcomes = L.control.layers(outcomesGroup, overlay,{
    collapsed:false 
})

var screening = L.control.layers(screeningGroup, overlay,{
    collapsed:false 
})

var behaviors = L.control.layers(behaviorGroup, overlay,{
    collapsed:false 
})

// SWITCH LAYERS BASED ON BUTTONS

currentLayerControl = demographics
currentLayer = languageLayer
currentLegend = languageLegend
$("#demographics").click(function() {
        mymap.eachLayer(function (layer) {
    mymap.removeLayer(layer);
});
baseLayer.addTo(mymap);
        currentLayer = languageLayer;
        languageLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        currentLayerControl = demographics;
        demographics.addTo(mymap);
        mymap.removeControl(currentLegend);
        currentLegend = languageLegend;
        languageLegend.addTo(mymap);
        });
        $("#outcomes").click(function() {
        mymap.eachLayer(function (layer) {
    mymap.removeLayer(layer);
});
baseLayer.addTo(mymap);
        currentLayer = cancerLayer;
        cancerLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        currentLayerControl = outcomes;
        outcomes.addTo(mymap);
        mymap.removeControl(currentLegend);
        currentLegend = cancerLegend;
        cancerLegend.addTo(mymap);
        });
        $("#screening").click(function() {
        mymap.eachLayer(function (layer) {
    mymap.removeLayer(layer);
});
baseLayer.addTo(mymap);
        currentLayer = checkupLayer;
        checkupLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        currentLayerControl = screening;
        screening.addTo(mymap);
        mymap.removeControl(currentLegend);
        currentLegend = checkLegend;
        checkLegend.addTo(mymap);
        });
        $("#unhealthy").click(function() {
        mymap.eachLayer(function (layer) {
    mymap.removeLayer(layer);
});
baseLayer.addTo(mymap);
        currentLayer = uninsuredLayer;
        uninsuredLayer.addTo(mymap);
        mymap.removeControl(currentLayerControl);
        currentLayerControl = behaviors;
        behaviors.addTo(mymap);
        mymap.removeControl(currentLegend);
        currentLegend = uninsuredLegend;
        uninsuredLegend.addTo(mymap);
        });



//SWITCH LEGENDS
mymap.on('baselayerchange', function(eventLayer) {
    if (eventLayer.name === "Brooklyn Language Map") {
        mymap.removeControl(currentLegend);
        currentLegend = languageLegend;
        languageLegend.addTo(mymap);
    } else if (eventLayer.name === "Cancer Prevalence") { 
        mymap.removeControl(currentLegend);
        currentLegend = cancerLegend;
        cancerLegend.addTo(mymap);
    } else if (eventLayer.name === "Current Smokers") { 
        mymap.removeControl(currentLegend);
        currentLegend = smokeLegend;
        smokeLegend.addTo(mymap);
    } else if (eventLayer.name === "Coronary Heart Disease") { 
        mymap.removeControl(currentLegend);
        currentLegend = heartLegend;
        heartLegend.addTo(mymap);
    } else if (eventLayer.name === "Recent Annual Check Up") { 
        mymap.removeControl(currentLegend);
        currentLegend = checkLegend;
        checkLegend.addTo(mymap);
    } else if (eventLayer.name === "Recent Dentist Visits") { 
        mymap.removeControl(currentLegend);
        currentLegend = dentistLegend;
        dentistLegend.addTo(mymap);
    } else if (eventLayer.name === "Diabetes Prevalence") { 
        mymap.removeControl(currentLegend);
        currentLegend = diabetesLegend;
        diabetesLegend.addTo(mymap);
    } else if (eventLayer.name === "High Cholestorol") { 
        mymap.removeControl(currentLegend);
        currentLegend = cholestorolLegend;
        cholestorolLegend.addTo(mymap);
    } else if (eventLayer.name === "Chronic Kidney Disease") { 
        mymap.removeControl(currentLegend);
        currentLegend = kidneyLegend;
        kidneyLegend.addTo(mymap);
    } else if (eventLayer.name === "Sedentary Lifestyle") { 
        mymap.removeControl(currentLegend);
        currentLegend = inactiveLegend;
        inactiveLegend.addTo(mymap);
    } else if (eventLayer.name === "Mammography Screening") { 
        mymap.removeControl(currentLegend);
        currentLegend = mammoLegend;
        mammoLegend.addTo(mymap);
    } else if (eventLayer.name === "Obesity Prevalence") { 
        mymap.removeControl(currentLegend);
        currentLegend = obeseLegend;
        obeseLegend.addTo(mymap);
    } else if (eventLayer.name === "<7 Hours Sleep") { 
        mymap.removeControl(currentLegend);
        currentLegend = sleepLegend;
        sleepLegend.addTo(mymap);
    } else if (eventLayer.name === "Uninsured") { 
        mymap.removeControl(currentLegend);
        currentLegend = uninsuredLegend;
        uninsuredLegend.addTo(mymap);
    } else if (eventLayer.name === "Cervical Cancer Screening") { 
        mymap.removeControl(currentLegend);
        currentLegend = cervicalLegend;
        cervicalLegend.addTo(mymap);
    } else if (eventLayer.name === "Asthma Prevalence") { 
        mymap.removeControl(currentLegend);
        currentLegend = asthmaLegend;
        asthmaLegend.addTo(mymap);
    } else if (eventLayer.name === "High Blood Pressure") { 
        mymap.removeControl(currentLegend);
        currentLegend = bpLegend;
        bpLegend.addTo(mymap);
    } else if (eventLayer.name === "Frequent Drinkers") { 
        mymap.removeControl(currentLegend);
        currentLegend = drinkLegend;
        drinkLegend.addTo(mymap);
    } else if (eventLayer.name === "Population by Tract") { 
        mymap.removeControl(currentLegend);
        currentLegend = popLegend;
        popLegend.addTo(mymap);
    } else if (eventLayer.name === "Colorectal Cancer Screening") { 
        mymap.removeControl(currentLegend);
        currentLegend = colorectalLegend;
        colorectalLegend.addTo(mymap);
    }
});

