dojo.require("esri.map");
dojo.require("esri.tasks.gp");


var MAP, gp;
var  _resultImageID = '10';

function init() {
	
	
	/*
	//------------INITIALIZE MAP------------
	*/
	
    //configure map slider on map
    esriConfig.defaults.map.slider = { left: "30px", top: "60px", width: null, height: "200px" };
    
    //create map extent (san fran)
    var initialExtent = new esri.geometry.Extent({"xmin":-13215580.33,"ymin":-1451997.95,"xmax":4395510.99,"ymax":10288729.59,"spatialReference":{"wkid":102100}});

	//instantiate map
	MAP = new esri.Map("map", { extent: initialExtent });
		
	
	/*
	//------------INITIALIZE MAP LAYERS------------
	*/

	//base map layers
	MapServiceLoader.loadMapServiceLayers(MAPLAYERS.baseLayers, MAP);
		
	
	/*
	//------------INITIALIZE TOOLS------------
	*/
	
	//identify tool - pass in the global map object
	IdentifyTool.initIdentifyTool(MAP);
	
	//layer list tool - pass in map service rest url and layer id to use for legend
	LayerListTool.initLayerListTool();

	//Initialize GP Tool
	gp = new esri.tasks.Geoprocessor("http://SERVER IP/ArcGIS/rest/services/TRMM_CustomRaster/GPServer/TRMMCustomRaster");
				
                                      

}

dojo.addOnLoad(init);

//for loading map services
function loadMapServiceLayers(inMapServiceArray, inMap) {
		var currentMapService = null;
		var mapControl = inMap;
 
		try {
		 
		    //iterate all base map services in json config and add to map control
			for (var i = 0, il = inMapServiceArray.length; i < il; i++) {
				
				if (inMapServiceArray[i].mapServiceType == "fusedCache") {
			
				currentMapService = new esri.layers.ArcGISTiledMapServiceLayer(inMapServiceArray[i].restUrl, {
					id: inMapServiceArray[i].mapServiceId,
					opacity: inMapServiceArray[i].opacity,
					visible: inMapServiceArray[i].isVisible
				});
			}	
		else if (inMapServiceArray[i].mapServiceType == "dynamic") {
		 			
		 			currentMapService = new esri.layers.ArcGISDynamicMapServiceLayer(inMapServiceArray[i].restUrl, {
		 				id: inMapServiceArray[i].mapServiceId,
		 				opacity: inMapServiceArray[i].opacity,
		 				visible: inMapServiceArray[i].isVisible
		 			});
		 		}				
				
				mapControl.addLayer(currentMapService);	
		    }
		}
		catch(err){
			
			console.error("Error at loadMapServiceLayers() method." + "\nError Description:" + err.description);
		}
	}

	function convertToTRMMDatetimeString(in_datetime_string) {
	    //in_datetime_string format --> "2012/01/30 09:00:00:00" (yyyy/mm/dd HH:MM:SS:MM);
	    if (!in_datetime_string)
	        return;
	    in_datetime_string = in_datetime_string.split(" ");
	    var date_part = in_datetime_string[0].split("/");
	    var time_part = in_datetime_string[1].split(":")[0];
	    var out_datetime_string = date_part[0] + date_part[1] + date_part[2] + time_part;
	    // out_datetime_string format --> "2012013009 (yyyymmddHH)"
	    return out_datetime_string;
	};


	function executeGP() {
	    var startDate = dojo.byId("TRMM3hourTimesComboBox_Start").value;
	    var endDate = dojo.byId("TRMM3hourTimesComboBox_End").value;
	    var clipCountry = dojo.byId("uxCountry").value;
	    //console.log(clipCountry);
	    var formattedStartDate = convertToTRMMDatetimeString(startDate);
	    var formattedEndDate = convertToTRMMDatetimeString(endDate);
	    if (clipCountry == "Whole World")
	        clipCountry = "";
	    var params = { "start_date_YYYYMMDDHH_": formattedStartDate, "end_date_YYYYMMDDHH_": formattedEndDate, "clip_country": clipCountry };

	    gp.submitJob(params, completeCallback, statusCallback);
	}
	
    //function statusCallback(jobInfo) {
	 //   console.log(jobInfo.jobStatus);
        //console.log(jobInfo.messages[1]); 
	    //console.log(jobInfo.gpMessages["esriJobMessageTypeInformative"]);
	//}
	function statusCallback(jobInfo) {
	    // Display the status for debugging purposes

	    //dojo.style(dojo.byId("uxWait"), "display", "inline");
	    //jobInfo.gpMessages["esriJobMessageTypeInformative"];
	    var statusString = "<b>Status</b>";
	    dojo.forEach(jobInfo.messages, function (message) {
	        statusString += "<div class='statusMessage'>" + message.description + "</div>";
	    });

	    dojo.byId("uxGPMessages").innerHTML = statusString;
	}



	function completeCallback(jobInfo) {
	    var imageParams = new esri.layers.ImageParameters();
	    imageParams.imageSpatialReference = MAP.spatialReference;
	    gp.getResultImageLayer(jobInfo.jobId, "rainfall_ras", imageParams, function (gpLayer) {
	        gpLayer.setOpacity(0.6);
	        gpLayer.id = "trmm";
	        //MAP.removeLayer(gpLayer);
	        //MAP.removeAllLayers();
	        //MAP.removeLayer(MAP.layers[])
	        ///MAP.removeLayer(_resultImageID);
	        //_resultImageID = MAP.getLayer("trmm");
	        //if (_resultImageID != undefined) {
	        //    MAP.removeLayer(_resultImageID);
	        //}
	        //MAP.removeLayer('layer0');
	        MAP.addLayer(gpLayer);
	        //gpLayer.id = "trmm";
	        //_resultImageID = gpLayer.id;
	    });
	}





//Handle resize of browser
var RESIZETIMER;
function resizeMap() {
	
    clearTimeout(RESIZETIMER);
	
    RESIZETIMER = setTimeout(function() {
		MAP.resize(); 
		MAP.reposition();
    }, 800);
};




