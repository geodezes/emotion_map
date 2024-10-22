			var map = new L.Map('map', {
			center: new L.LatLng(52.2789771, 104.2887651),
			zoom: 14,
			editable: true
			});
			
            /*слой подложки*/
			var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				});
			map.addLayer(osm);
			
			/* геолокация */
			L.geolet({ position: 'topright', title:'Где я?' }).addTo(map);
			
L.drawLocal.draw.toolbar.buttons.marker="Marker New Name"

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
			})).addTo(map)
			
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
			em_negativ.addTo(map);
			
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
				/* map.addControl(drawControlPozitiv); */
drawControlPozitiv.addTo(map);


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
				
				
drawControlNegatv.addTo(map);

/* 			    map.on('draw:created', function (e) {
				var layer = e.layer;
				em_negativ.addLayer(layer)
				});
 */

var activeMode = null;


// Отслеживаем активацию инструментов

map.on('draw:drawstart', function (e) {

    console.log('draw:drawstart событие сработало');

    console.log('e (всё событие):', e);
 // Печатаем полное событие для отладки

    console.log('Тип инструмента:', e.layerType);


    // Проверяем, какой инструмент активен

    if (e.layerType === 'marker') {

        console.log('Это инструмент для маркеров');


        // Проверяем, что именно активировано

        if (e.sourceTarget === drawControlPozitiv) {

            activeMode = 'pozitiv';

            console.log('Активирован инструмент для добавления позитивного маркера');

        } else if (e.sourceTarget === drawControlNegatv) {

            activeMode = 'negativ';

            console.log('Активирован инструмент для добавления негативного маркера');

        } else {
            console.log('Активный инструмент не определён');

        }

    }

});


// Слушаем событие завершения рисования маркера

map.on('draw:created', function (e) {

    console.log('draw:created событие сработало');

    console.log('e (всё событие):', e);
 // Печатаем полное событие для отладки

    console.log('Тип слоя:', e.layerType);


    var layer = e.layer;

    console.log('Добавленный слой:', layer);
 // Печатаем информацию о слое


    if (e.layerType === 'marker') {

        console.log('Активный режим:', activeMode);


        if (activeMode === 'pozitiv') {

            em_pozitiv.addLayer(layer);

            console.log('Маркер добавлен в позитивный слой');

        } else if (activeMode === 'negativ') {

            em_negativ.addLayer(layer);

            console.log('Маркер добавлен в негативный слой');

        } else {

            console.log('Не удалось определить, в какой слой добавлять маркер');

        }


        // Добавляем слой на карту

        map.addLayer(layer);

        console.log('Маркер добавлен на карту');


        // Сбрасываем активный режим

        activeMode = null;

        console.log('Режим сброшен после добавления маркера');

    } else {

        console.log('Добавленный объект не является маркером');

    }

});




// Сбрасываем режим при закрытии панели инструментов

map.on('draw:toolbarclosed', function () {

    activeMode = null;

    console.log('Инструмент деактивирован');

});


// Слушаем событие завершения рисования маркера

map.on('draw:created', function (e) {

    var layer = e.layer;

    console.log('draw:created событие сработало');

    console.log('Тип слоя:', e.layerType);


    // Проверяем, какой режим был активен

    if (e.layerType === 'marker') {

        console.log('Активный режим:', activeMode);


        if (activeMode === 'pozitiv') {

            em_pozitiv.addLayer(layer);

            console.log('Маркер добавлен в позитивный слой');

        } else if (activeMode === 'negativ') {

            em_negativ.addLayer(layer);

            console.log('Маркер добавлен в негативный слой');

        } else {

            console.log('Не удалось определить, в какой слой добавлять маркер');

        }


        // Добавляем слой на карту

        map.addLayer(layer);

        console.log('Маркер добавлен на карту');

    } else {

        console.log('Добавленный объект не является маркером');

    }

});








			// Save button
			L.easyButton('fa-save', function () {
				em_pozitiv.save();
				em_negativ.save();
			}, 'Save changes').addTo(map);
				
			// Изменение цвета иконок маркеров
			document.querySelector('.leaflet-draw-toolbar a.leaflet-draw-draw-marker').classList.add('leaflet-draw-draw-marker-negativ');
