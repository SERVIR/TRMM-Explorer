
//configure map services

//map services
var MAPLAYERS = {
	
	"baseLayers":[
		{
			"mapServiceId": "baseMapAerial",
			"mapServiceName": "Aerial",
			"mapServiceType": "fusedCache",
			"restUrl": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
			"isVisible": true,
			"opacity": 1.0,
		},
		{
			"mapServiceId": "baseMapStreets",
			"mapServiceName": "Streets",
			"mapServiceType": "fusedCache",
			"restUrl": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
			"isVisible": false,
			"opacity": 1.0,
		},
		{
			"mapServiceId": "baseMapTopo",
			"mapServiceName": "Topographic",
			"mapServiceType": "fusedCache",
			"restUrl": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
			"isVisible": false,
			"opacity": 1.0,
		},
		{
			"mapServiceId": "baseMapTerrain",
			"mapServiceName": "Terrain",
			"mapServiceType": "fusedCache",
			"restUrl": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer",
			"isVisible": false,
			"opacity": 1.0,
		}
	],
	
	"operationalLayers":[
		{
			"mapServiceId": "trmm",
			"mapServiceName": "TRMM 3 Hour",
			"mapServiceType": "dynamic",
			"restUrl": "http://SERVER IP/ArcGIS/rest/services/ReferenceNode/TRMM/MapServer",
			"isVisible": false,
			"opacity": 0.7,
		}
	]
};

var MapServiceLoader = {
	
	"loadMapServiceLayers": function(inMapServiceArray, inMap){
	 
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
};


//for loading map services
function loadMapServiceLayers(inMapServiceArray, inMap){
	 
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
};
