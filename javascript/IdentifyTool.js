

//configure identify tool	
var IDENTIFYTOOL_LAYERURL = "http://SERVER IP ADDRESS/ArcGIS/rest/services/ReferenceNode/TRMM/MapServer";
var IDENTIFYTOOL_INFOWINDOW_WIDTH = 250;
var IDENTIFYTOOL_INFOWINDOW_HEIGHT = 250;
var IDENTIFYTOOL_INFOWINDOW_TITLE = "Identify"

//identify tool behavior
var IdentifyTool = {
	
	"initIdentifyTool": function(inMap) {
		
		//wire up identify task to map clicks
		dojo.connect(inMap, "onClick", this.doIdentify);	

	},	
	
	"doIdentify": function(evt) {
		
		//identify operation
		identifyTask = new esri.tasks.IdentifyTask(IDENTIFYTOOL_LAYERURL); 
        identifyParams = new esri.tasks.IdentifyParameters();
        identifyParams.tolerance = 5;
        identifyParams.returnGeometry = true;
        identifyParams.layerIds = [0];
        identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.width  = MAP.width;
        identifyParams.height = MAP.height;
		identifyParams.geometry = evt.mapPoint;
		identifyParams.mapExtent = MAP.extent;
		
		identifyTask.execute(identifyParams, function(idResults) { 
			
			//-->
			console.log(idResults);

			//show window if we have results to show
			if(idResults.length > 0)
			{
	
				//identify results placeholder
				var identifyContent = "Name: " + idResults[0].feature.attributes.Name + 
				"<br/>Algorithm ID: " + idResults[0].feature.attributes.algorithm_ID +
				"<br/>Algorithm Version: " + idResults[0].feature.attributes.algorithm_version + 
				"<br/>Date Time (string): " + idResults[0].feature.attributes.datetime_string + 
				"<br/>Variable Name: " + idResults[0].feature.attributes.variable_name +
				"<br/>Variable Units: " + idResults[0].feature.attributes.variable_units;
			
				//present results to user
				MAP.infoWindow.setTitle(IDENTIFYTOOL_INFOWINDOW_TITLE);
				MAP.infoWindow.setContent(identifyContent);
				MAP.infoWindow.resize(IDENTIFYTOOL_INFOWINDOW_WIDTH, IDENTIFYTOOL_INFOWINDOW_HEIGHT);
				MAP.infoWindow.show(evt.screenPoint, MAP.getInfoWindowAnchor(evt.screenPoint));
			}
			
		});
	}
};
