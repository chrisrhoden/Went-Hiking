$(function(){
	// Cufon.replace("h2, h3, h4, .cufon");
	
	setTimeout(function(){
		$("#flash_notice, #flash_error").fadeTo(2000, 0).animate({ height: 0, padding: 0, margin: 0 }, 500)
	}, 3000);
	
	$("a[href$='.jpg'],a[href$='.JPG']").fancybox({
		'transitionIn'	: 'elastic',
		'transitionOut'	: 'elastic',
		'easingIn'      : 'easeOutBack',
		'easingOut'     : 'easeInBack',
		'changeSpeed'  	: 100,
		'speedIn'       : 100,
		'speedOut'      : 100,
		'margin' 				: -20,
		'onStart'				: function(){
			$('object, embed, iframe').css("margin-left", "-10000px");
		},
		'onClosed'			: function(){
			$('object, embed, iframe').css("margin-left", "auto");
		},
		'overlayColor' 	: "#fff",
		'titlePosition' : 'inside',
					'titleFormat'   : function(title, currentArray, currentIndex, currentOpts) {
					    return '<div id="tip7-title" style="padding:10px 0; text-align:left">' + title + '<p>Image ' + (currentIndex + 1) + ' of ' + currentArray.length + "</p>" + '<div class="clearer"></div></div>';
		}
	});
});

var map;
var	beef = {
		variables: {
			markers: {},
			kmls: {},
			lines: {},
			info: new google.maps.InfoWindow({content: ""}),
			polyline: new google.maps.Polyline({
				strokeColor: 		"#ff0000",
				strokeOpacity: 	0.9,
				strokeWeight: 	3,
				map: 						map 
			}),
			polylinePath: null,
			polylineLength: 0,
			polylineElevation: 0
		},
		
		defaults: {
			zoom: 				5,
			lat: 					45,
			lng: 					-90,
			type: 				google.maps.MapTypeId.TERRAIN,
			scrollwheel: 	true,
			doubleclick: 	false,
			id: 					"map",
			markerstyle: 	new google.maps.MarkerImage("http://wenthiking.com/images/marker.png",
				new google.maps.Size(16,37),
				new google.maps.Point(0,0)
			),
			shadowstyle: new google.maps.MarkerImage("http://wenthiking.com/images/marker_shadow.png",
				new google.maps.Size(27,18),
				new google.maps.Point(0,0),
				new google.maps.Point(0,18)
			)
		},

		load: function(){
			map = new google.maps.Map(document.getElementById(this.defaults.id), {
				zoom: 									this.defaults.zoom,
				center: 								new google.maps.LatLng(this.defaults.lat, this.defaults.lng),
				mapTypeId: 							this.defaults.type,
				disableDoubleClickZoom: !this.defaults.doubleclick,
				scrollwheel: 						this.defaults.scrollwheel,
				mapTypeControlOptions: {
				   mapTypeIds: [
						 google.maps.MapTypeId.TERRAIN,
				     google.maps.MapTypeId.SATELLITE,
				     google.maps.MapTypeId.HYBRID,
				     'topography',
						google.maps.MapTypeId.ROADMAP
				   ]
				 }
			});
		},
		
		infoWindow: {
			open: function(id, info){
					beef.variables.info.setContent(info);
					beef.variables.info.open(map, beef.variables.markers[id]);
			},
			listener: function(id, info){
				google.maps.event.addListener(beef.variables.markers[id], "click", function(){
					beef.infoWindow.open(id, info);
				})
			} 
		},
			
		markers: {
			populate: function(markers, zoom){
				jQuery.each(markers, function(key, marker){
						beef.variables.markers[marker.id] = new google.maps.Marker({
							position: 		new google.maps.LatLng(marker.lat, marker.lng),
							map: 					map,
							cursor: 			"pointer",
							icon: 				beef.defaults.markerstyle,
							shadow: 			beef.defaults.shadowstyle,
							animation: 		google.maps.Animation.DROP
						});
						beef.infoWindow.listener(marker.id, marker.info);
					if (zoom == true)
						beef.zoomToMarkers();
				})
			}
		},
		
		polylines: {
			populate: function(lines){
				jQuery.each(lines, function(key, line){
					var latlngs = jQuery.map(line.path, function(point, key){
						 return new google.maps.LatLng(parseFloat(point[0]), parseFloat(point[1]))
					});
					
					beef.variables.lines[line.id] = new google.maps.Polyline({
						strokeColor: 		"#1A1",
						strokeOpacity: 	0.8,
						strokeWeight: 	5,
						path: 					latlngs
					});
					beef.variables.lines[line.id].setMap(map);
					
					google.maps.event.addListener(beef.variables.lines[line.id], "click", function(e){
						beef.variables.info.setContent(line.info);
						beef.variables.info.setPosition(e.latLng);
						beef.variables.info.open(map);
					})
				})
			},
			
			startDrawing: function(){
				beef.variables.polylinePath = beef.variables.polyline.getPath();
				beef.variables.polyline.setMap(map);
				google.maps.event.addListener(map, "click", this.addLatLng);
				map.setOptions({draggableCursor: "crosshair"});
				
			},
			stopDrawing: function(){
				google.maps.event.clearListeners(map, "click");
				map.setOptions({draggableCursor: "pointer"});
			},
			
			stepBack: function(){
				beef.variables.polylinePath.pop();
			},
			
			addLatLng: function(event){
				beef.variables.polylinePath.push(event.latLng);
				var distance = 0;
				
				if (beef.variables.polylinePath.getLength() == 1) {
					beef.variables.markers["new"] = new google.maps.Marker({
						map: 				map,
						position: 	beef.variables.polylinePath.getAt(0),
						icon: 				beef.defaults.markerstyle,
						shadow: 			beef.defaults.shadowstyle
					});
					beef.infoWindow.open("new", "This hike is " + distance.toFixed(1) + "mi long. <br /><br /><a href='javascript:beef.undo();'>Remove this trail?</a></em></div>");
				}
				
				if (beef.variables.polylinePath.getLength() > 1) {
					distance = google.maps.geometry.spherical.computeLength(beef.variables.polylinePath.getArray(), 3963.19);
;
					beef.polylines.calculateElevation(function(){
						beef.variables.info.setContent("This hike is " + distance.toFixed(1) + "mi long with " + beef.variables.polylineElevation.toFixed(0) + "' of climbing. <br /><br /><a href='javascript:beef.undo();'>Remove this trail?</a></em></div>");
						beef.infoWindow.listener("new", "This hike is " + distance.toFixed(1) + "mi long with " + beef.variables.polylineElevation.toFixed(0) + "' of climbing. <br /><br /><a href='javascript:beef.undo();'>Remove this trail?</a></em></div>");
					});
				}
			},
			
			calculateElevation: function(callback){
				var elevation = 0;
				
				eService = new google.maps.ElevationService();
				eService.getElevationAlongPath({path: beef.variables.polylinePath.getArray(),	samples: 500}, 			
					function(result,status){
						lastElevation = 0;
						result.forEach(function(element, index){
							if (index != 0) {
								if (element.elevation > lastElevation) {
									elevation += (element.elevation - lastElevation);
									// alert("Adding " + (element.elevation - lastElevation) + "' of elevation");
								}
							} else {
								lastElevation = element.elevation;
							}
							lastElevation = element.elevation;
						});
						beef.variables.polylineElevation = elevation * 3.2808399; //convert to feet
						callback();
				});
			}
		},
		
		kmls: {
			populate: function(kmls){
				jQuery.each(kmls, function(key, kml){
					beef.variables.kmls[kml.id] = new google.maps.KmlLayer(
					kml.url,
					{
						map: 								 map,
						preserveViewport: 	 true,
						suppressInfoWindows: true
					});
				});
			}
		},

		undo: function(){
			//resets the markers for point placement
			this.variables.markers["new"].setMap(null);
			this.variables.polyline.setPath(new google.maps.MVCArray());
			this.variables.info.close();
			this.markerOnMap = false;
			google.maps.event.clearListeners(map, "click");
	    $("#comments").fadeOut();
			$("#map_lat, #map_lng, #map_zoom, #map_study_area, #comment_lat, #comment_lng, #comment_line").val("");
			map.setOptions({draggableCursor: "pointer"});
		},

		markerListeners: function(){
			that = this;
			google.maps.event.addListener(map, "dblclick", function(e){
				that.placeMarker(e);
			});
		}, 
		
		lineListeners: function(){
			google.maps.event.addListener(map, "dblclick", function(e){
				beef.polylines.startDrawing();
				beef.polylines.addLatLng(e);
			})
		},

		placeMarker: function(e){
			if (!that.markerOnMap) {
					//Form insertion
					$("#hike_lat").val(e.latLng.lat());
					$("#hike_lng").val(e.latLng.lng());

					beef.variables.markers["new"] = new google.maps.Marker({
						map: 					map,
						position: 		e.latLng,
						icon: 				beef.defaults.markerstyle,
						shadow: 			beef.defaults.shadowstyle,
						animation: 		google.maps.Animation.DROP
					});

					beef.infoWindow.listener("new", "Mess up? No problem, <a href='javascript:beef.undo();'>just undo.</a>");
					beef.infoWindow.open("new", "<div class='added'>Mess up? No problem, <a href='javascript:beef.undo();'>just undo.</a>");
					 
					
					that.markerOnMap = true;
			} else { beef.variables.info.open(map, beef.variables.markers["new"]) }
		},
		
		zoomToMarkers: function() {
			var bounds = new google.maps.LatLngBounds();
			for (var i in beef.variables.markers) {
				bounds.extend(beef.variables.markers[i].getPosition());
			}
			map.fitBounds(bounds);
		},

		updateForm: function() {
			$("#hike_lat").val(map.getCenter().lat());
		 	$("#hike_lng").val(map.getCenter().lng());
			// $("#hike_zoom").val(map.getZoom());
		},

		toggleKML: function(id) {
			if (beef.variables.kmls[id].getMap() != null) {
				beef.variables.kmls[id].setMap(null);
				$("#layer_" + id + " a").css({
					textDecoration: "line-through",
					opacity: 0.75
				})
			} else {
				beef.variables.kmls[id].setMap(map);
				$("#layer_" + id + " a").css({
					textDecoration: "none",
					opacity: 1
				})
			}
		},
		toggleMapSize: function(original){
			if ($("#map").height() == original) {
				$("#map").animate({height: 600}, 100, "easeOutBack");
				setTimeout(function(){
					google.maps.event.trigger(map, 'resize');
					map.panBy(0,original *-1);
					}, 150);
			} else {
				$("#map").animate({height: original}, 100, "easeOutBack");
				setTimeout(function(){
					google.maps.event.trigger(map, 'resize');
					map.panBy(0,original);
				}, 150);
			}
		}
	}
	
	function topo() {
		var topo_layer = new google.maps.ImageMapType({
			getTileUrl: function(tile, zoom) {
				return "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/" + zoom + "/" + tile.y + "/" + tile.x
			},
			tileSize: new google.maps.Size(256, 256),
      isPng: true,
			maxZoom: 15,
			minZoom: 5,
			name: "Topography",
			alt: "Detailed topographic maps"
		});
		map.mapTypes.set('topography', topo_layer);
	}
	
	
	// // ADD MYTOPO MAPS
	// function mytopo() {
	//     var mytopo_var = new google.maps.ImageMapType({
	//       getTileUrl: function(ll, z) {
	//         return "http://maps.mytopo.com/wenthiking/tilecache.py/1.0.0/topoG/" + z + "/" + ll.x + "/" + ll.y + ".jpg";
	//       },
	//      tileSize: new google.maps.Size(256, 256),
	//      isPng: true,
	//      maxZoom: 15,
	// 	 	 minZoom: 9,
	//      name: "MyTopo",
	//      alt: "Detailed topographic maps"
	//     }); 
	// 		// 	    var options = {
	// 		// 	      mapTypeControlOptions: {
	// 		// 	        mapTypeIds: [
	// 		// 	          google.maps.MapTypeId.ROADMAP,
	// 		// 	          google.maps.MapTypeId.SATELLITE,
	// 		// 	          google.maps.MapTypeId.HYBRID,
	// 		// 	          google.maps.MapTypeId.TERRAIN,
	// 		// 	          'mytopo_id'
	// 		// 	        ]
	// 		// 	      }
	// 		// 	    };
	// 		// map.setOptions(options);
	//     map.mapTypes.set('mytopo_id', mytopo_var);
	// 		// Now add the MyTopo notice to the map
	//     map.controls[google.maps.ControlPosition.BOTTOM].push(add_link());
	// }
	// 
	// // ADD USGS MAPS
	// function usgs() {
	//     var usgs_var = new google.maps.ImageMapType({
	//       getTileUrl: function(tile, zoom) {
	// 
	//         var southWestPixel = new google.maps.Point((tile.x * 256)/ Math.pow(2, zoom), ((tile.y + 1) * 256)/ Math.pow(2, zoom)) ;
	//         var northEastPixel = new google.maps.Point(((tile.x + 1) * 256)/ Math.pow(2, zoom), (tile.y * 256)/ Math.pow(2, zoom));
	// 				var southWestCoords = map.getProjection().fromPointToLatLng(southWestPixel);
	// 				var northEastCoords = map.getProjection().fromPointToLatLng(northEastPixel);
	// 				
	// 					// alert("tile is" + tile+ "\n\n SWPIXEL = " + southWestPixel + "\n\n SWCoords = " + southWestCoords.lat() + "    " + southWestCoords.lng());
	// 
	// 				
	// 				var bbox = southWestCoords.lng()+ "," + southWestCoords.lat() + "," + northEastCoords.lng() + "," + northEastCoords.lat();
	// 				return "http://www.terraserver-usa.com/ogcmap6.ashx?VERSION=1.1.1&REQUEST=GetMap&LAYERS=DRG&STYLES=&SRS=EPSG:4326&BBOX=" + bbox + "&WIDTH=256&HEIGHT=256&FORMAT=image/jpeg&BGCOLOR=0xCCCCCC&EXCEPTIONS=INIMAG"
	//       },
	//      tileSize: new google.maps.Size(256, 256),
	//      isPng: true,
	//      maxZoom: 17,
	// 	 	 minZoom: 4,
	//      name: "USGS",
	//      alt: "Detailed topographic maps from the USGS"
	//     }); 
	//     map.mapTypes.set('usgs_id', usgs_var);
	// }
	// 
	// function add_link() {
	//    var link_div = document.createElement('div');
	//    link_div.style.fontFamily = 'Arial,sans-serif';
	//    link_div.style.fontSize = '10px';
	//    link_div.style.marginBottom = '2px';
	// 	 link_div.style.opacity = "0.5";
	//    link_div.innerHTML = '<a href="http://www.mytopo.com/index.cfm" target="_blank">Topo maps provided by MyTopo.com</a>';
	//   return link_div;
	// }
	
	