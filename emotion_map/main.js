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



/*  			map.on('draw:created', function (e) {
				var layer = e.layer;
				em_pozitiv.addLayer(layer);
				}); 
			 */
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




em_map.on('draw:created', function (e) {
    console.log('draw:created событие сработало');
    console.log('Тип слоя:', e.layerType);

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



			// Save button
			L.easyButton('fa-save', function () {
				em_pozitiv.save();
				em_negativ.save();
			}, 'Save changes').addTo(em_map);
				
			