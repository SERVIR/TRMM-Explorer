
//configure identify tool
var LAYERLIST_OPACITYID = "hwsdSoils";
var MAPSERVICE_URL_FOR_LAYER_LIST = "http://SERVER IP/ArcGIS/rest/services/ReferenceNode/MODIS_Fire_1DAY/MapServer";
var MAPSERVICE_LAYERID_FORLEGEND = "0";

dojo.require("dijit.Dialog");
dojo.require("dojo.fx");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Slider");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ComboBox");


Date.prototype.addHours = function(h) {
	
            var copiedDate = new Date(this.getTime());
            copiedDate.setHours(copiedDate.getHours()+h);
    
            return copiedDate;
        };

var LayerListTool = {
	
	/*
	 * For initializing the layer list tool (e.g. constructing the legend)
	 */
	"initLayerListTool": function() {
		
		
		
		//query all start-datetime-string values
		var queryTask = new esri.tasks.QueryTask("http://SERVER IP/ArcGIS/rest/services/ReferenceNode/TRMM/MapServer/0");
		
		query = new esri.tasks.Query();
		
		query.returnGeometry = false;
		
		//query.outFields = ["start_datetime_string"];
        query.outFields = ["datetime_string"];
		
        //query.outFields = ["datetime_string"];

		//query.where = "start_datetime_string <> ''";
        query.where = "datetime_string <> ''";
		
        //query.where = "datetime_string <> ''";
        
		queryTask.execute(query, queryCallback);
		
		
		//create array of all start-datetime-string values
		function queryCallback(results) {
			
	        var dateStringValue;
	
	        var values = [];
	
	        var testVals={};
	        
			//values.push({name:"ALL"});
			
			//Loop through the QueryTask results and populate an array with the unique values
			var features = results.features;
			
			dojo.forEach (features, function(feature) {
				
				dateStringValue = feature.attributes.datetime_string;
				
				if (!testVals[dateStringValue]) {
				
					testVals[dateStringValue] = true;
				
					values.push({dateString:dateStringValue});
				}
			});

			
			//sort the array
			//values = values.sort(function(a,b){ return new Date(b.dateString) - new Date(a.dateString);  });
           // values.sort(function(a,b){return new Date(b.dateString) - new Date(a.dateString);});
			


                    values.sort(function(a, b) {
	
	                a = a.dateString.split(" ");
	                b = b.dateString.split(" ");
	
	                datetime1 =  new Date(a[0]).setHours(Number(a[1].split(":")[0]));
	                datetime2 =  new Date(b[0]).setHours(Number(b[1].split(":")[0]));
	
	                return datetime2 - datetime1;
                });

           


			//add all start-datetime-string values to combobox			
			var theCombobox = dojo.byId("TRMM3hourTimesComboBox_Start");
			var theCombobox2 = dojo.byId("TRMM3hourTimesComboBox_End");
			
			for(var i = 1, il = values.length; i < il; i++)
			{
				var option = document.createElement("option");
				var option2 = document.createElement("option");
				
				//console.log(values[i].dateString);
				
				option.text = values[i].dateString;
				option2.text = values[i].dateString;
				
				theCombobox.add(option, null);
				theCombobox2.add(option2, null);

			}
			
			
			//open dialog when all dates are populated in the combobox
			LayerListTool.openLayerListDialog('layerListDialog');
		}
	},
	
	/*
	 * For changing the trmm map service layer definition
	 */
	"timeSelectionMade": function(theItem){
	
		//TODO: update layer definition without removing and re-adding the trmm map service!!!
		
		
		//see if there is a trmm map service added to the map object, if so remove it
		var trmmMapServiceLayer = MAP.getLayer('trmm');
		
		//remove if previously added
		if(trmmMapServiceLayer != undefined)
		{
			MAP.removeLayer(trmmMapServiceLayer);
		}
		

		//dynamically create layer definition for trmm map service
		var imageParameters = new esri.layers.ImageParameters();
		
		var layerDefs = [];
		
		layerDefs[0] = "start_datetime_string = '" +  theItem.value+ "'"; //'2012/03/18 07:30:00.00'";

		imageParameters.layerDefinitions = layerDefs;
		
		
		//create a trmm layer and add it to the map
		var trmmServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://SERVER IP/ArcGIS/rest/services/ReferenceNode/TRMM/MapServer", {"imageParameters": imageParameters, "id": "trmm"});
		
		MAP.addLayer(trmmServiceLayer);
	},
	
	/*
	 * For opening the layer list tool floating dialog
	 */
	"openLayerListDialog": function(layerListDivId){
		
		//get reference to dijit dialog object
		var layerListDlg = dijit.byId(layerListDivId);

		if(!layerListDlg.open){
			
			//slide dialog in
			this.slideInDialog("132", "110", layerListDivId);
	
			//show
			layerListDlg.show();
					
			//fade in dialog
			this.fadeInDialog(layerListDivId);		
		}
		else{
			
			//already open, but fade in to notify user
			this.fadeInDialog(layerListDivId);	
		}
	},
	
	/*
	 * For animating the opening of the layer list tool dialog
	 */
	"slideInDialog": function(inTop, inLeft, inDivId){
		
		var slideArgs = {
        	node: inDivId,
        	top: inTop,
        	left: inLeft,
			duration: 800,
			unit: "px"
    	};
		
    	dojo.fx.slideTo(slideArgs).play();
	},
	
	/*
	 * For animating the opening of the layer list tool dialog
	 */
	"fadeInDialog": function(inDivId){

        dojo.style(inDivId, "opacity", "0");
		
        var fadeArgs = {
            node: inDivId,
            duration: 700,
        };
		
        dojo.fadeIn(fadeArgs).play();
	}
};

