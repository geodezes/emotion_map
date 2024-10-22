			var em_map = new L.Map('em_map', {
			center: new L.LatLng(52.2789771, 104.2887651),
			zoom: 14,
			editable: true
			});
			
            /*слой подложки*/
			var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				});
			em_map.addLayer(osm);
			
			/* геолокация */
			L.geolet({ position: 'topright', title:'Где я?' }).addTo(em_map);
			
//L.drawLocal.draw.toolbar.buttons.marker="Marker New Name"

			//позитив
			const em_pozitivPointOptions = {
			  crs: L.CRS.EPSG4326,
			  showExisting: true,
			  geometryField: 'geom',
			  url: `https://historymap.online:8443/geoserver/historymap/ows`,
			  typeNS: 'historymap',
			  typeName: 'em_pozitiv',
			  maxFeatures: 90,
			  opacity: 1,
				style: function(layer) {
				// you can use if statemt etc
				return {
				  color: 'green',
				  weight: 1
				}
			  },
			};
			const em_pozitiv = new L.WFST(em_pozitivPointOptions, new L.Format.GeoJSON({
			  crs: L.CRS.EPSG4326,
			  pointToLayer(geoJsonPoint, latlng) {
				const layer = new L.CircleMarker(latlng, {
				  radius: 5,
				});
				return layer;
			  },
			})).addTo(em_map)
			
			//негатив
			const em_negativPointOptions = {
			  crs: L.CRS.EPSG4326,
			  showExisting: true,
			  geometryField: 'geom',
			  url: `https://historymap.online:8443/geoserver/historymap/ows`,
			  typeNS: 'historymap',
			  typeName: 'em_negativ',
			  maxFeatures: 90,
			  opacity: 1,
			  style: function(layer) {
				// you can use if statemt etc
				return {
				  color: 'red',
				  weight: 1
				}
			  },
			};
			const em_negativ = new L.WFST(em_negativPointOptions, new L.Format.GeoJSON({
			  crs: L.CRS.EPSG4326,
			  pointToLayer(geoJsonPoint, latlng) {
				const layer = new L.CircleMarker(latlng, {
				  radius: 5,
				});
				return layer;
			  },
			}));
			em_negativ.addTo(em_map);
			
					//позитив	 
			var drawControlPozitiv = new L.Control.Draw({ 
				draw:{
				circle:false,
				circlemarker:false,
				rectangle:false,
				polygon: false,
				polyline: false,
					  },
				edit:{
					featureGroup: em_pozitiv,
					edit: false,
					remove: false 
				},
				/* position: 'bottomleft', */
				});




			//негатив
			var drawControlNegatv = new L.Control.Draw({ 
				draw:{
				circle:false,
				circlemarker:false,
				rectangle:false,
				polygon: false,
				polyline: false,
					  },
				edit:{
					featureGroup: em_negativ,
					edit: false,
					remove: false 
				} 
				});
				/* map.addControl(drawControlNegatv); */
				
				



			//// Кнопка для позитивного маркера
			L.easyButton({
				states: [{
					icon: 'fa-smile',
					onClick: function(btn, em_map) {
						drawControlPozitiv = new L.Draw.Marker(em_map);  // Создаем инструмент для маркеров
						drawControlPozitiv.enable();  // Включаем инструмент
						activeMode = 'pozitiv';  // Устанавливаем активный режим
						console.log('Режим: позитивный маркер');
					},
					title: 'Добавить позитивный маркер'
				}]
			}).addTo(em_map).button.classList.add('positive');  // Добавляем класс positive

			// Кнопка для негативного маркера
			L.easyButton({
				states: [{
					icon: 'fa-frown',
					onClick: function(btn, em_map) {
						drawControlNegativ = new L.Draw.Marker(em_map);  // Создаем инструмент для маркеров
						drawControlNegativ.enable();  // Включаем инструмент
						activeMode = 'negativ';  // Устанавливаем активный режим
						console.log('Режим: негативный маркер');
					},
					title: 'Добавить негативный маркер'
				}]
			}).addTo(em_map).button.classList.add('negative');  // Добавляем класс negative

			//определяем в какой слой сохранять маркер в зависимости от использованого инструмента
			em_map.on('draw:created', function (e) {
				console.log('draw:created событие сработало');
				console.log('Тип слоя:', e.layerType);
			const coords = e.layer.getLatLng();
				if (e.layerType === 'marker') {
					console.log('Маркер создан');
					if (activeMode === 'pozitiv') {
						em_pozitiv.addLayer(e.layer);  // Добавляем маркер в позитивный слой
						console.log('Маркер добавлен на карту в позитивный слой');
					} else if (activeMode === 'negativ') {
						em_negativ.addLayer(e.layer);  // Добавляем маркер в негативный слой
						console.log('Маркер добавлен на карту в негативный слой');
					}
					activeMode = null;  // Сбрасываем активный режим
				}
			});



			let positiveMarkers = [];
			let negativeMarkers = [];


			// Запрос GeoJSON с маркерами через L.geoJson.ajax
			const positiveGeoJson = new L.GeoJSON.AJAX("https://historymap.online:8443/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=em_pozitiv&outputFormat=application%2Fjson&format_options=callback%3AgetJson&SrsName=EPSG%3A4326", {
				onEachFeature: function (feature, layer) {
					const coords = feature.geometry.coordinates;
						positiveMarkers.push([coords[1], coords[0], 1]);
				},  
			});


		    const negativeGeoJson = new L.GeoJSON.AJAX("https://historymap.online:8443/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=em_negativ&outputFormat=application%2Fjson&format_options=callback%3AgetJson&SrsName=EPSG%3A4326", {
				onEachFeature: function (feature, layer) {
					const coords = feature.geometry.coordinates;
						negativeMarkers.push([coords[1], coords[0], 1]);
 
				},
			});


			// Создание тепловых карт
			let positiveHeatmap = L.heatLayer(positiveMarkers, { 
				radius: 25, // Радиус влияния каждого маркера
				blur: 15, // Размытие
				gradient: { 0: 'LightYellow', 1: 'Green' }, // Цветовая схема
				maxZoom: 17 // Максимальный уровень масштабирования
			})/* .addTo(em_map) */;

			let negativeHeatmap = L.heatLayer(negativeMarkers, { 
				radius: 25, 
				blur: 15, 
				gradient: {0: 'LightYellow', 1: 'Red' }, // Цветовая схема
				maxZoom: 17 
			})/* .addTo(em_map) */;

			


			// Save button
			L.easyButton('fa-save', function () {
				em_pozitiv.save();
				em_negativ.save();
			}, 'Save changes').addTo(em_map);
				
				
		///////////////// 

		var baseTree =
			{
				label: 'Условные обозначения<div class="tree" id="tree"></div>',
				collapsed: true,
				
			};



        var overlaysTree = 
			{
				label: 'Эмоции',
				collapsed: true,
				children: [
						{label: 'Позитивные эмоции', collapsed: true, children: [
						{label: '<svg width="15" height="15" ><circle cx="9" cy="9" r="5" style="fill:Green; fill-opacity:0.1; stroke-width:1;stroke: Green" /></svg> Точки', layer: em_pozitiv},
						{label: '<svg width="15" height="15"><defs><linearGradient id="Gradient1"><stop class="stop1" offset="0%" /><stop class="stop3" offset="100%" /></linearGradient><style type="text/css"><![CDATA[#rect1 { fill: url(#Gradient1); }.stop1 { stop-color: LightYellow; }.stop3 { stop-color: Green; }]]></style></defs><rect id="rect1" x="0" y="0" width="15" height="15" /></svg> Теплокарта', layer: positiveHeatmap},
						]},
						{label: 'Негативные эмоции', collapsed: true, children: [
						{label: '<svg width="15" height="15" ><circle cx="9" cy="9" r="5" style="fill:Red; fill-opacity:0.1; stroke-width:1;stroke: Red" /></svg> Точки', layer: em_negativ},
						{label: '<svg width="15" height="15"><defs><linearGradient id="Gradient2"><stop class="stop2" offset="0%" /><stop class="stop4" offset="100%" /></linearGradient><style type="text/css"><![CDATA[#rect2 { fill: url(#Gradient2); }.stop2 { stop-color: LightYellow; }.stop4 { stop-color: Red; }]]></style></defs><rect id="rect2" x="0" y="0" width="15" height="15" /></svg> Теплокарта', layer: negativeHeatmap},
						]}		
				]
			};


		        var lay = L.control.layers.tree( 
		          baseTree, 
		          overlaysTree,
            {
                namedToggle: true,
                selectorBack: false,
                closedSymbol: '&#8862',
                openedSymbol: '&#8863',
               // collapseAll: 'Скрыть всё',
              //  expandAll: 'Показать всё',
                collapsed: false,
            });

        lay.addTo(em_map)/*.collapseTree().expandSelected().collapseTree(true);
        L.DomEvent.on(L.DomUtil.get('onlysel'), 'click', function() {
            lay.collapseTree(true).expandSelected(true);
        })*/;  
			