 
dojo.require("dojo.fx");

var BaseMapTool = {
	
	/*
	 * For opening the base map tool
	 */
	"wipeInBaseMapPanel": function(inDivId){

		//get div object from div name
		var inDivIdNode = dojo.byId(inDivId);
		
		var displayValue = dojo.style(inDivId, "display");
		
		if (displayValue == "none") {
		
			//create animation arguments
			var wipeArgs = {
				node: inDivIdNode,
				duration: 500
			};
			
			//perform wipe in animation
			dojo.fx.wipeIn(wipeArgs).play();
			
		}
		else if (displayValue == "block") {
			
			//set style of height to nothing and display to block
			dojo.style(inDivId, "height", "");
			dojo.style(inDivId, "display", "block");
			
			//create animation arguments
			var wipeArgs = {
				node: inDivIdNode,
				duration: 500
			};
			
			//perform wipe out
			dojo.fx.wipeOut(wipeArgs).play();
		}
	},
	
	/*
	 * For toggling on/off a base map layer
	 */
	"toggleBaseMapService": function(inMap, arrayOfBaseMapLayerIds, selectedBaseMapLayerId){
		

	    var mapControl = inMap;
			
		//hide all base map layers			
		for(var j = 0, jl = arrayOfBaseMapLayerIds.length; j < jl; j++)
		{
		
			var currentBaseLayer = mapControl.getLayer(arrayOfBaseMapLayerIds[j].mapServiceId);
				
			currentBaseLayer.hide();
		}
		
		//show the chosen map service
       	var targetBaseMapService = mapControl.getLayer(selectedBaseMapLayerId);

		targetBaseMapService.show();	
	}
};

