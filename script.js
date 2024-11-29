const apiKey = 'AIzaSyAxQtm76Gl2s2Yfv8KX7Zwpj3bfgzKZNkg';
const spreadsheetId = '13aWpgiOD_uZodKXpxLzkLAgidljTH8UZX3F78czGfwQ';


let myMap;
let zones = {}; 
let displayedZones = {}; 
const initialCenter = [60.007899, 30.390313]; 
const initialZoom = 14; 
const zoneMappings = {
 "48": "Благоустройство и озеленение",
    "47": "Развитие территории",
    "46": "Уборка территории",
    "45": "Образование",
    "Проекты": "Проекты",
    "Общественные инициативы": "Общественные инициативы",
    "Верующие": "Верующие",
    "Питомцы": "Питомцы",
    "Прочая социальная инфраструктура": "Прочая социальная инфраструктура",
    "Торговля": "Торговля",
"Спорт": "Спорт",
"Медицина": "Медицина",
"Образование": "Образование",
"Уборка территории": "Уборка территории",
"Развитие территории": "Развитие территории",
"Благоустройство и озеленение": "Благоустройство и озеленение",
 "Ордера": "Ордера"
};

// const zoneDisplayNames = {
//     "45": "Образование",
//     "46": "Уборка территории",
//     "47": "Развитие территории",
//     "48": "Благоустройство и озеленение",
  
// };

function sanitizeId(name) {
    return name ? name.replace(/\s+/g, '_').replace(/[^\p{L}\d\-_]/gu, '') : '';
}


const camera = document.getElementById('camera');
const snapshot = document.getElementById('snapshot');
const takePhotoButton = document.getElementById('take-photo');
const savePhotoButton = document.getElementById('save-photo');
const retakePhotoButton = document.getElementById('retake-photo');
const closeModalButton = document.getElementById('close-modal');
const photoStatus = document.getElementById('photo-status');
const photoModal = document.getElementById('photo-modal');

let photoBlob;
let latitude = null;
let longitude = null;

// Открытие модального окна
document.getElementById('open-photo-modal').addEventListener('click', () => {
    const photoModal = document.getElementById('photo-modal');
    const photoStatus = document.getElementById('photo-status');
    const camera = document.getElementById('camera');

    if (!photoModal || !photoStatus || !camera) {
        console.error('Не удалось найти один из необходимых элементов (photo-modal, photo-status, camera).');
        return;
    }

    // Показываем модальное окно и скрываем уведомление
    photoModal.classList.remove('hidden');
    photoStatus.classList.add('hidden');

    console.log('Открываем модальное окно камеры.');

    // Запрашиваем доступ к камере только при открытии модального окна
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            camera.srcObject = stream;
            console.log('Камера успешно подключена.');
        })
        .catch((err) => {
            console.error('Ошибка доступа к камере:', err);

            // Выводим сообщение об ошибке и скрываем модальное окно
            alert('Не удалось получить доступ к камере. Проверьте настройки браузера.');
            photoModal.classList.add('hidden');
        });
});


// Закрытие модального окна
closeModalButton.addEventListener('click', () => {
    closePhotoModal();
});

function closePhotoModal() {
    photoModal.classList.add('hidden');
    snapshot.style.display = 'none';
    camera.style.display = 'block';
    takePhotoButton.style.display = 'inline';
    savePhotoButton.style.display = 'none';
    retakePhotoButton.style.display = 'none';
   // photoStatus.classList.add('hidden'); // Убираем сообщение о сохранении
    if (camera.srcObject) {
        // Останавливаем камеру
        const tracks = camera.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        camera.srcObject = null;
    }
}

// Съёмка фото
takePhotoButton.addEventListener('click', () => {
    console.log('Нажата кнопка съемки фото.');

    // Проверяем и обновляем координаты перед съемкой
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                console.log(`Обновлены координаты: Широта=${latitude}, Долгота=${longitude}`);
                capturePhoto();
            },
            (error) => {
                console.warn('Не удалось получить координаты:', error);
                alert('Не удалось получить координаты. Фото будет без геоданных.');
                capturePhoto(); // Делаем фото даже без координат
            }
        );
    } else {
        alert('Геолокация не поддерживается вашим браузером. Фото будет без геоданных.');
        capturePhoto();
    }
});

function capturePhoto() {
    if (camera.videoWidth && camera.videoHeight) {
        const context = snapshot.getContext('2d');
        snapshot.width = camera.videoWidth;
        snapshot.height = camera.videoHeight;
        context.drawImage(camera, 0, 0, snapshot.width, snapshot.height);

        snapshot.style.display = 'block';
        camera.style.display = 'none';
        savePhotoButton.style.display = 'inline';
        retakePhotoButton.style.display = 'inline';
        takePhotoButton.style.display = 'none';

        snapshot.toBlob(
            (blob) => {
                if (blob) {
                    console.log('Фото успешно создано в формате Blob.');
                    addGeoDataToPhoto(blob);
                } else {
                    console.error('Не удалось создать Blob из изображения.');
                }
            },
            'image/jpeg',
            0.9
        );
    } else {
        console.error('Камера не готова. Пожалуйста, попробуйте снова.');
        alert('Камера не готова. Пожалуйста, попробуйте снова.');
    }
}

// Переснять фото
retakePhotoButton.addEventListener('click', () => {
    console.log('Нажата кнопка пересъема.');
    snapshot.style.display = 'none';
    camera.style.display = 'block';
    takePhotoButton.style.display = 'inline';
    savePhotoButton.style.display = 'none';
    retakePhotoButton.style.display = 'none';
    photoBlob = null; // Сбросить текущее фото
});


// Сохранение фото
savePhotoButton.addEventListener('click', () => {
    console.log('Нажата кнопка сохранения фото.');
    if (photoBlob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(photoBlob);
        link.download = `photo_${Date.now()}.jpg`;
        link.click();
        console.log('Фото сохранено.');

        // Убедимся, что скрытый класс удалён перед добавлением block
        photoStatus.classList.remove('hidden');
        photoStatus.classList.add('block');
        console.log('Классы элемента photoStatus после отображения:', photoStatus.classList);

        // Скрыть уведомление через 5 секунд
        setTimeout(() => {
            // Удаляем block и возвращаем hidden
            photoStatus.classList.remove('block');
            photoStatus.classList.add('hidden');
            console.log('Классы элемента photoStatus после скрытия:', photoStatus.classList);
        }, 5000);

        // Закрытие модального окна
        closePhotoModal();
    } else {
        console.error('Ошибка: фото не было сделано.');
        alert('Фото не было сделано.');
    }
});









// Добавление геоданных в EXIF
function addGeoDataToPhoto(blob) {
    console.log('Добавление геоданных в EXIF.');
    console.log(`Координаты для добавления: Широта=${latitude}, Долгота=${longitude}`);

    const reader = new FileReader();
    reader.onload = function () {
        try {
            const jpegData = reader.result;
            const exifObj = piexif.load(jpegData);

            if (latitude !== null && longitude !== null) {
                const gps = exifObj['GPS'] || {};
                gps[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(latitude);
                gps[piexif.GPSIFD.GPSLatitudeRef] = latitude >= 0 ? 'N' : 'S';
                gps[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(longitude);
                gps[piexif.GPSIFD.GPSLongitudeRef] = longitude >= 0 ? 'E' : 'W';

                exifObj['GPS'] = gps;
                const newExifData = piexif.dump(exifObj);
                const newJpegData = piexif.insert(newExifData, jpegData);

                // Преобразуем строку base64 обратно в Blob
                const byteString = atob(newJpegData.split(',')[1]);
                const arrayBuffer = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    arrayBuffer[i] = byteString.charCodeAt(i);
                }

                photoBlob = new Blob([arrayBuffer], { type: 'image/jpeg' });
                console.log('EXIF успешно обновлен.');
            } else {
                console.warn('Геоданные отсутствуют. Сохраняем фото без EXIF.');
                photoBlob = blob;
            }
        } catch (error) {
            console.error('Ошибка обработки EXIF данных:', error);
            photoBlob = blob;
        }
    };

    reader.onerror = function (error) {
        console.error('Ошибка при чтении Blob:', error);
        photoBlob = blob;
    };

    reader.readAsDataURL(blob);
}





function flattenCoords(coords) {
    let flatCoords = [];
    coords.forEach(function(coord) {
        if (Array.isArray(coord[0])) {
            flatCoords = flatCoords.concat(flattenCoords(coord));
        } else {
            flatCoords.push(coord);
        }
    });
    return flatCoords;
}
function swapCoordinates(coords) {
    if (Array.isArray(coords)) {
        if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
            // Если это пара координат, меняем местами
            return [coords[1], coords[0]];
        } else {
            // Иначе рекурсивно обрабатываем вложенные массивы
            return coords.map(swapCoordinates);
        }
    } else {
        return coords;
    }
}



///123123123

function fetchZoneData(zoneKey, sheetName, color) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}?key=${apiKey}`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка при загрузке данных с листа ${sheetName}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const rows = data.values;
            if (!rows || rows.length < 2) {
                throw new Error(`Данные с листа ${sheetName} пусты или недоступны`);
            }

            // Тримминг всех заголовков
            const headerRow = rows[0].map(header => header.trim());
            const indices = {
                id: headerRow.indexOf("ID"),
                group: headerRow.indexOf("Группа"),
                subgroup: headerRow.indexOf("Подгруппа"),
                orders: headerRow.indexOf("Ордера"),
                title: headerRow.indexOf("Название"),
                latitude: headerRow.indexOf("Широта"),
                longitude: headerRow.indexOf("Долгота"),
                link: headerRow.indexOf("Ссылка"),
                imageUrl: headerRow.indexOf("URL изображения"),
                iconPreset: headerRow.indexOf("Знак на карте"),
                polygonCoords: headerRow.indexOf("Координаты полигона"),
                firstDate: headerRow.indexOf("Первая дата"),
                firstDateLink: headerRow.indexOf("Первая дата ссылка"),
                secondDate: headerRow.indexOf("Вторая дата"),
                secondDateLink: headerRow.indexOf("Вторая дата ссылка"),
                description: headerRow.indexOf("Описание"),
                extraButton: headerRow.indexOf("Доп кнопка")
            };

            function getRowValue(row, indices, fieldName) {
                const index = indices[fieldName];
                return index !== undefined && index !== -1 ? row[index] : undefined;
            }

            const zoneName = zoneKey;
            const zoneDisplayName = sheetName;

if (!zones[zoneKey]) {
    zones[zoneKey] = {
        polygons: [], 
        label: null,
        groups: {},
        isVisible: false,
        polygonVisible: false,
        zoneName: zoneName,
        zoneDisplayName: zoneDisplayName,
    };

    // Генерация HTML для зоны
    generateZoneHTML(zoneKey, zoneDisplayName, color);

    // Парсинг координат полигона зоны
let polygonCoordsStrings = [];
for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    let polygonCoordsString = getRowValue(row, indices, 'polygonCoords');
    if (polygonCoordsString) {
        polygonCoordsStrings.push(polygonCoordsString);
    }
}

if (polygonCoordsStrings.length > 0) {
    try {
        let allCoordinates = [];

        polygonCoordsStrings.forEach(coordsString => {
            let coordinates = JSON.parse(coordsString);
            console.log('Координаты до перестановки:', JSON.stringify(coordinates));
            coordinates = swapCoordinates(coordinates);
            console.log('Координаты после перестановки:', JSON.stringify(coordinates));

            // Добавляем уровень вложенности для контура полигона
            // Если координаты представляют собой массив точек, оборачиваем их в массив контура
            if (coordinates.length > 0 && !Array.isArray(coordinates[0][0])) {
                coordinates = [coordinates]; // Добавляем уровень для контура
            }

            allCoordinates.push(coordinates);
        });

        // Создаём полигоны и сохраняем их в zones[zoneKey].polygons
        zones[zoneKey].polygons = allCoordinates.map(coordinates => {

    if (coordinates.length > 0 && typeof coordinates[0][0] === 'number') {
        coordinates = [coordinates]; // Добавляем уровень вложенности для контура
    }
         
            return new ymaps.Polygon(coordinates, {}, {
                fillColor: color,
                strokeColor: '#333',
                opacity: 0.6,
                strokeWidth: 2,
            });
        });

        // Вычисляем общие границы и центр для метки
        let flatCoords = [];
        allCoordinates.forEach(coords => {
            flatCoords = flatCoords.concat(flattenCoords(coords));
        });
        const bounds = ymaps.util.bounds.fromPoints(flatCoords);
        const center = ymaps.util.bounds.getCenter(bounds);

        zones[zoneKey].label = new ymaps.Placemark(center, {
            iconCaption: zoneDisplayName,
        }, {
            preset: 'islands#blueCircleDotIconWithCaption',
            iconCaptionMaxWidth: '200',
            iconColor: color,
        });

        console.log(`Полигоны успешно созданы для зоны '${zoneKey}'`);
    } catch (e) {
        console.error(`Ошибка при парсинге координат полигонов для зоны ${zoneDisplayName}:`, e);
    }
} else {
    console.warn(`Координаты полигонов не найдены для зоны '${zoneKey}'`);
}



// Обработка строк с данными объектов
for (let i = 1; i < rows.length; i++) {
    const row = rows[i];



                const id = getRowValue(row, indices, 'id');
                const groupCell = getRowValue(row, indices, 'group');
                const subgroupCell = getRowValue(row, indices, 'subgroup');
                const title = getRowValue(row, indices, 'title');
                const lat = getRowValue(row, indices, 'latitude');
                const lon = getRowValue(row, indices, 'longitude');
                const link = getRowValue(row, indices, 'link');
                const imageUrl = getRowValue(row, indices, 'imageUrl');
                const iconPreset = getRowValue(row, indices, 'iconPreset');
                const firstDate = getRowValue(row, indices, 'firstDate');
                const firstDateLink = getRowValue(row, indices, 'firstDateLink');
                const secondDate = getRowValue(row, indices, 'secondDate');
                const secondDateLink = getRowValue(row, indices, 'secondDateLink');
                const description = getRowValue(row, indices, 'description');
                const ordersCell = getRowValue(row, indices, 'orders');
                const extraButton = getRowValue(row, indices, 'extraButton');
                const polygonCoordsString = getRowValue(row, indices, 'polygonCoords');

                // Проверка и преобразование данных
                const group = groupCell ? groupCell.trim() : 'Без группы';
                const subgroup = subgroupCell ? subgroupCell.trim() : '';
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);

                const ordersCellTrimmed = ordersCell ? ordersCell.trim() : '';
                const order = ordersCellTrimmed;

                // Инициализация группы
// Проверяем наличие секции зоны
if (!document.getElementById(`zone-content-${sanitizeId(zoneKey)}`)) {
    console.warn(`Секция зоны отсутствует: zone-content-${sanitizeId(zoneKey)}. Пропускаем обработку группы '${group}'.`);
    continue; // Пропускаем, если секция зоны отсутствует
}

// Инициализируем группу, если она не существует
if (!zones[zoneKey].groups[group]) {
    zones[zoneKey].groups[group] = { subgroups: {}, orders: {}, objects: [] };
    generateGroupHTML(zoneKey, group);
}


                let targetArray;

                if (subgroup) {
                    // Инициализация подгруппы
                    if (!zones[zoneKey].groups[group].subgroups[subgroup]) {
                        zones[zoneKey].groups[group].subgroups[subgroup] = { orders: {}, objects: [] };
                        generateSubgroupHTML(zoneKey, group, subgroup);
                    }

                    if (order) {
                        // Инициализация ордера внутри подгруппы
                        if (!zones[zoneKey].groups[group].subgroups[subgroup].orders[order]) {
                            zones[zoneKey].groups[group].subgroups[subgroup].orders[order] = [];
                            generateOrderHTML(zoneKey, group, subgroup, order);
                        }
                        targetArray = zones[zoneKey].groups[group].subgroups[subgroup].orders[order];
                    } else {
                        // Объекты без ордера внутри подгруппы
                        targetArray = zones[zoneKey].groups[group].subgroups[subgroup].objects;
                    }
                } else {
                    if (order) {
                        // Инициализация ордера на уровне группы
                        if (!zones[zoneKey].groups[group].orders[order]) {
                            zones[zoneKey].groups[group].orders[order] = [];
                            generateOrderHTMLAtGroupLevel(zoneKey, group, order);
                        }
                        targetArray = zones[zoneKey].groups[group].orders[order];
                    } else {
                        // Объекты без подгруппы и ордера внутри группы
                        targetArray = zones[zoneKey].groups[group].objects;
                    }
                }

                // Генерация HTML для объекта
                generateObjectHTML(zoneKey, group, subgroup, order, id, title);

                const cleanIconPreset = (iconPreset || 'islands#blueDotIcon').replace(/['"]/g, '').trim();

                const firstDateContent = firstDate && firstDateLink
                    ? `<p class="date-link"><a href="${firstDateLink}" target="_blank">${firstDate}</a></p>`
                    : '';
                const secondDateContent = secondDate && secondDateLink
                    ? `<p class="date-link"><a href="${secondDateLink}" target="_blank">${secondDate}</a></p>`
                    : '';
                const ordersContent = order ? `<p>${order}</p>` : '';
                const formattedDescription = description ? description.replace(/\n/g, '<br>') : '';
                const imageContent = imageUrl ? generateImageHTML(imageUrl, title) : '';

                const balloonContent = `
                    <div style="text-align: center;">
                        <div class="balloon-title">${title || ''}</div>
                        ${firstDateContent}
                        ${secondDateContent}
                        ${ordersContent}
                        ${imageContent}
                        <p>${formattedDescription}</p>
                        ${link ? `<a href="${link}" target="_blank" class="balloon-link">Подробнее</a><br>` : ''}
                    </div>
                `;

                // Проверяем, что координаты валидные
                if (!isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0) {
                    const placemark = new ymaps.Placemark([latitude, longitude], {
                        balloonContent: balloonContent,
                    }, {
                        preset: cleanIconPreset,
                    });

                    // Создаем объект для хранения информации об объекте
                    const objectData = { id, placemark };

                    // Обработка полигонов для ордера
                    if (order && polygonCoordsString) {
                        try {
                            let coordinates = JSON.parse(polygonCoordsString);
                            coordinates = swapCoordinates(coordinates);
                         console.log('Координаты после перестановки1111111:', coordinates);

                            const polygon = new ymaps.Polygon(coordinates, {}, {
                                fillColor: color,
                                strokeColor: '#333',
                                opacity: 0.4,
                            });

                            objectData.polygon = polygon; // Сохраняем полигон в объекте

                        } catch (e) {
                            console.error(`Ошибка при создании полигона для зоны '${zoneKey}':`, e);
                        }
                    }

                          //      if (polygonCoordsString) {
              //  try {
              //      let coordinates = JSON.parse(polygonCoordsString);
              //      coordinates = swapCoordinates(coordinates);

                    // Создаем полигон
               //     zones[zoneKey].polygon = new ymaps.Polygon(coordinates, {}, {
               //         fillColor: color,
              //          strokeColor: '#333',
             //           opacity: 0.4,
            //        });
//
              //      // Создаем метку
              //      const flatCoords = flattenCoords(coordinates);
               //     const bounds = ymaps.util.bounds.fromPoints(flatCoords);
               //     const center = ymaps.util.bounds.getCenter(bounds);
//
              //      zones[zoneKey].label = new ymaps.Placemark(center, {
              //          iconCaption: zoneName,
                //    }, {
                  //      preset: 'islands#blueCircleDotIconWithCaption',
                //        iconCaptionMaxWidth: '200',
                 //       iconColor: color,
                 //   });
              //  } catch (e) {
             //       console.error(`Ошибка при парсинге координат полигона для зоны ${zoneName}:`, e);
             //   }
          //  }

                    // Добавляем объект с меткой (и полигоном, если есть)
                    targetArray.push(objectData);
                } else {
                    // Просто пропускаем объект без вывода предупреждений
                    continue;
                }
            }

            // Обновляем количество объектов в группах и подгруппах
           updateGroupCounts(zoneKey);

            // Установка обработчиков для аккордеона
            setupAccordion(zoneKey);
        }})
        .catch(error => {
            console.error(`Ошибка при загрузке данных с листа ${sheetName}:`, error);
        });
}




function generateOrderHTML(zoneName, groupName, subgroupName, orderName) {
    const subgroupSection = document.getElementById(`subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`);
if (!subgroupSection) {
        console.warn(`Секция подгруппы отсутствует: subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}. Пропускаю создание ордера '${orderName}'.`);
        return; // Прерываем выполнение, если секции нет
    }

    // Проверка наличия названия подгруппы
    if (!subgroupName) {
        console.warn(`Отсутствует название подгруппы для ордера '${orderName}' в группе '${groupName}' зоны '${zoneName}'`);
        return;
    }

    const orderDiv = document.createElement('div');
    orderDiv.className = 'order';
    orderDiv.innerHTML = `
        <div class="accordion-header" id="order-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}">
            <span class="order-title">${orderName}</span>
        </div>
        <div class="accordion-content hidden" id="order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}">
        </div>
    `;
    subgroupSection.appendChild(orderDiv);

    // Установка обработчика для аккордеона ордера
    const orderHeader = document.getElementById(`order-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`);
    const orderContent = document.getElementById(`order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`);
    orderHeader.addEventListener('click', () => {
        orderContent.classList.toggle('hidden');
        const isExpanded = !orderContent.classList.contains('hidden');
        toggleOrderObjects(zoneName, groupName, subgroupName, orderName, isExpanded);
    });
}





function generateOrderHTMLAtGroupLevel(zoneName, groupName, orderName) {
    const groupSection = document.getElementById(`group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
    if (!groupSection) {
        console.error(`Не удалось найти секцию группы: group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
        return;
    }

    const orderDiv = document.createElement('div');
    orderDiv.className = 'order';
    orderDiv.innerHTML = `
        <div class="accordion-header" id="order-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(orderName)}">
            <span class="order-title">${orderName}</span>
        </div>
        <div class="accordion-content hidden" id="order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(orderName)}">
        </div>
    `;
    groupSection.appendChild(orderDiv);

    // Установка обработчика для аккордеона ордера
    const orderHeader = document.getElementById(`order-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(orderName)}`);
    const orderContent = document.getElementById(`order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(orderName)}`);
    orderHeader.addEventListener('click', () => {
        orderContent.classList.toggle('hidden');
        const isExpanded = !orderContent.classList.contains('hidden');
        toggleOrderObjectsAtGroupLevel(zoneName, groupName, orderName, isExpanded);
    });
}















ymaps.ready(init);


function init() {
    myMap = new ymaps.Map("map", { center: initialCenter, zoom: initialZoom });

    const colors = [
        '#FFA50088', '#4682B488', '#32CD32', '#1E90FF'
    ];

    let zoneKeys = Object.keys(zoneMappings); // ["Зона 1", "Зона 2", "Зона 3", "Зона 4"]

    let loadPromises = zoneKeys.map((zoneKey, index) => {
        const sheetName = zoneMappings[zoneKey];
        const color = colors[index % colors.length];
        return fetchZoneData(zoneKey, sheetName, color);
    });

    // После загрузки всех зон
    Promise.all(loadPromises).then(() => {
        // Выпадающий список уже содержит фиксированные значения
    });

    // Обработчик для выпадающего списка
    const zoneSelect = document.getElementById('zone-select');
   zoneSelect.addEventListener('change', function () {
    const selectedZone = this.value;

    console.log(`Выбрана зона: '${selectedZone}'`);
    console.log('Доступные ключи в zones:', Object.keys(zones));

    // Скрываем все полигоны
    for (let zoneKey in zones) {
        hideZonePolygon(zoneKey);
    }

    if (selectedZone === 'all') {
        // Отображаем только числовые полигоны
        for (let zoneKey in zones) {
            if (!isNaN(zoneKey)) { // Проверяем, является ли ключ числом
                showZonePolygon(zoneKey);
            }
        }
    } else if (zones[selectedZone]) {
        // Отображаем выбранный полигон
        showZonePolygon(selectedZone);
    } else {
        console.warn(`Зона с ключом '${selectedZone}' не найдена.`);
    }
});

}


function populateZoneDropdown() {
    const zoneSelect = document.getElementById('zone-select');
    zoneSelect.innerHTML = ''; // Очищаем текущие опции

    // Добавляем опции по умолчанию
    zoneSelect.innerHTML = `
        <option value="">Выберите округ:</option>
        <option value="all">Все</option>
    `;

    console.log('Доступные ключи zones:', Object.keys(zones));
    console.log('zoneMappings:', zoneDisplayNames);


    // Используем ключи из zoneMappings для заполнения списка
    for (let zoneKey in zoneMappings) {
        const option = document.createElement('option');
        option.value = zoneKey;
        option.textContent = zoneKey;
        zoneSelect.appendChild(option);
    }
}




function generateZoneHTML(zoneKey, zoneDisplayName, color) {
    // Проверяем, начинается ли ключ с числа
    if (!isNaN(parseInt(zoneKey.charAt(0), 10))) {
        console.warn(`Зона '${zoneKey}' начинается с числа и не будет отображена.`);
        return; // Пропускаем создание для значений, начинающихся с числа
    }

    const controls = document.getElementById('sections-container');

    // Проверяем, отображена ли уже эта зона
    if (displayedZones[zoneKey]) {
        console.warn(`Секция для зоны '${zoneKey}' уже была создана. Пропускаем.`);
        return;
    }

    const zoneDiv = document.createElement('div');
    zoneDiv.className = 'section';
    zoneDiv.id = `zone-section-${sanitizeId(zoneKey)}`;
    zoneDiv.innerHTML = `
        <div class="accordion-header" id="zone-header-${sanitizeId(zoneKey)}">
            <span class="zone-title">${zoneDisplayName}</span>
        </div>
        <div class="accordion-content hidden" id="zone-content-${sanitizeId(zoneKey)}">
        </div>
    `;
    controls.appendChild(zoneDiv);

    // Помечаем зону как отображённую
    displayedZones[zoneKey] = true;
    console.log(`Секция для зоны '${zoneKey}' успешно создана.`);
}





function generateGroupHTML(zoneKey, groupName) {
    const section = document.getElementById(`zone-content-${sanitizeId(zoneKey)}`);
if (!document.getElementById(`zone-content-${sanitizeId(zoneKey)}`)) {
    console.warn(`Секция зоны zone-content-${sanitizeId(zoneKey)} не существует. Создайте её перед добавлением групп.`);
    
}

    const groupDiv = document.createElement('div');
    groupDiv.className = 'subsection';
    groupDiv.innerHTML = `
        <div class="accordion-header" id="group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
            <span class="category-title">${groupName} (<span id="group-count-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">0</span>)</span>
        </div>
        <div class="accordion-content hidden" id="group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
        </div>
    `;
    section.appendChild(groupDiv);

    // Установка обработчика для аккордеона
    const groupHeader = document.getElementById(`group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
    const groupContent = document.getElementById(`group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
    groupHeader.addEventListener('click', () => {
        groupContent.classList.toggle('hidden');
        const isExpanded = !groupContent.classList.contains('hidden');
        toggleGroupObjects(zoneKey, groupName, isExpanded);
    });
}







function toggleGroupObjects(zoneName, groupName, show) {
    const zone = zones[zoneName];
    if (!zone || !zone.groups[groupName]) return;
    const group = zone.groups[groupName];

    // Отображаем или скрываем объекты напрямую в группе
    group.objects.forEach(obj => {
        if (show) {
            myMap.geoObjects.add(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.add(obj.polygon);
            }
        } else {
            myMap.geoObjects.remove(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.remove(obj.polygon);
            }
        }
    });

    // Отображаем или скрываем ордера на уровне группы
    for (let orderName in group.orders) {
        const orderContent = document.getElementById(`order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(orderName)}`);
        const isOrderExpanded = orderContent && !orderContent.classList.contains('hidden');
        toggleOrderObjectsAtGroupLevel(zoneName, groupName, orderName, show && isOrderExpanded);
    }

    // Обрабатываем подгруппы
    for (let subgroupName in group.subgroups) {
        const subgroupContent = document.getElementById(`subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`);
        const isSubgroupExpanded = subgroupContent && !subgroupContent.classList.contains('hidden');
        toggleSubgroupObjects(zoneName, groupName, subgroupName, show && isSubgroupExpanded);
    }
}




function toggleOrderObjectsAtGroupLevel(zoneName, groupName, orderName, show) {
    const zone = zones[zoneName];
    if (!zone || !zone.groups[groupName]) return;

    if (!zone.groups[groupName].orders[orderName]) return;
    const orderObjects = zone.groups[groupName].orders[orderName];

    orderObjects.forEach(obj => {
        if (show) {
            myMap.geoObjects.add(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.add(obj.polygon);
            }
        } else {
            myMap.geoObjects.remove(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.remove(obj.polygon);
            }
        }
    });
}







function countGroupObjects(zoneKey, groupName) {
    const group = zones[zoneKey].groups[groupName];
    if (!group) {
        console.error(`Группа '${groupName}' не найдена в зоне '${zoneKey}'`);
        return 0;
    }
    let count = (group.objects && group.objects.length) || 0;
    for (let subgroupName in group.subgroups) {
        const subgroupObjects = group.subgroups[subgroupName];
        count += (subgroupObjects && subgroupObjects.length) || 0;
    }
    console.log(`Количество объектов в группе '${groupName}' зоны '${zoneKey}': ${count}`);
    return count;
}


function generateSubgroupHTML(zoneName, groupName, subgroupName) {
    if (!subgroupName) {
        // Если подгруппа отсутствует, пропускаем её создание
        console.warn(`Пропущено создание подгруппы: отсутствует название для группы '${groupName}' в зоне '${zoneName}'`);
        return;
    }

    const groupSection = document.getElementById(`group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
    if (!groupSection) {
        console.error(`Не удалось найти секцию группы: group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
        return;
    }

    // Рассчитываем количество объектов в подгруппе
    const subgroup = zones[zoneName].groups[groupName].subgroups[subgroupName];
    let subgroupCount = (subgroup.objects && subgroup.objects.length) || 0;

    // Учет объектов внутри ордеров
    for (let orderName in subgroup.orders) {
        const orderObjects = subgroup.orders[orderName];
        const orderCount = (orderObjects && orderObjects.length) || 0;
        subgroupCount += orderCount;
    }

    const subgroupDiv = document.createElement('div');
    subgroupDiv.className = 'subgroup';
    subgroupDiv.innerHTML = `
        <div class="accordion-header" id="subgroup-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}">
            <span class="subgroup-title">${subgroupName} (<span id="subgroup-count-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}">${subgroupCount}</span>)</span>
        </div>
        <div class="accordion-content hidden" id="subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}">
        </div>
    `;
    groupSection.appendChild(subgroupDiv);

    // Установка обработчика для аккордеона подгруппы
    const subgroupHeader = document.getElementById(`subgroup-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`);
    const subgroupContent = document.getElementById(`subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`);
    subgroupHeader.addEventListener('click', () => {
        subgroupContent.classList.toggle('hidden');
        const isExpanded = !subgroupContent.classList.contains('hidden');
        toggleSubgroupObjects(zoneName, groupName, subgroupName, isExpanded);
    });
}





function generateObjectHTML(zoneName, groupName, subgroupName, orderName, objectId, title) {
    let objectListId;

    if (orderName) {
        if (subgroupName) {
            objectListId = `order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`;
        } else {
            objectListId = `order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(orderName)}`;
        }
    } else if (subgroupName) {
        objectListId = `subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`;
    } else {
        objectListId = `group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`;
    }

    const objectList = document.getElementById(objectListId);
    if (!objectList) {
        console.error(`Не удалось найти список объектов для: ${objectListId}`);
        return;
    }

    const objectLabel = document.createElement('label');
    objectLabel.innerHTML = `
        <input type="checkbox" id="object-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName || '')}-${sanitizeId(orderName || '')}-${sanitizeId(objectId)}" checked onchange="toggleObject('${zoneName}', '${groupName}', '${subgroupName}', '${orderName}', '${objectId}', this.checked)">
        ${title}
    `;
    objectList.appendChild(objectLabel);
}






function updateGroupCounts(zoneKey) {
    const zone = zones[zoneKey];
    if (!zone) return;

    for (let groupName in zone.groups) {
        const group = zone.groups[groupName];
        let groupCount = (group.objects && group.objects.length) || 0;

        // Учет ордеров на уровне группы
        for (let orderName in group.orders) {
            const orderObjects = group.orders[orderName];
            const orderCount = (orderObjects && orderObjects.length) || 0;
            groupCount += orderCount;
        }

        // Учет подгрупп
        for (let subgroupName in group.subgroups) {
            const subgroup = group.subgroups[subgroupName];
            let subgroupCount = (subgroup.objects && subgroup.objects.length) || 0;

            // Учет объектов в ордерах подгруппы
            for (let orderName in subgroup.orders) {
                const orderObjects = subgroup.orders[orderName];
                const orderCount = (orderObjects && orderObjects.length) || 0;
                subgroupCount += orderCount;
            }

            // Обновляем счетчик подгруппы
            const subgroupCountElement = document.getElementById(`subgroup-count-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`);
            if (subgroupCountElement) {
                subgroupCountElement.textContent = subgroupCount;
            }

            groupCount += subgroupCount;
        }

        // Обновляем счетчик группы
        const groupCountElement = document.getElementById(`group-count-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
        if (groupCountElement) {
            groupCountElement.textContent = groupCount;
        }
    }
}






function toggleObject(zoneName, groupName, subgroupName, orderName, objectId, isChecked) {
    const zone = zones[zoneName];
    if (!zone || !zone.groups[groupName]) return;
    let objectList;

    if (subgroupName) {
        if (orderName) {
            objectList = zone.groups[groupName].subgroups[subgroupName].orders[orderName];
        } else {
            objectList = zone.groups[groupName].subgroups[subgroupName].objects;
        }
    } else {
        if (orderName) {
            objectList = zone.groups[groupName].orders[orderName];
        } else {
            objectList = zone.groups[groupName].objects;
        }
    }

    const object = objectList ? objectList.find(obj => obj.id === objectId) : null;

    if (object && object.placemark) {
        if (isChecked) {
            myMap.geoObjects.add(object.placemark);
            if (object.polygon) {
                myMap.geoObjects.add(object.polygon);
            }
        } else {
            myMap.geoObjects.remove(object.placemark);
            if (object.polygon) {
                myMap.geoObjects.remove(object.polygon);
            }
        }
    }
}







function setupAccordion(zoneKey) {
    const zoneHeader = document.getElementById(`zone-header-${sanitizeId(zoneKey)}`);
    const zoneContent = document.getElementById(`zone-content-${sanitizeId(zoneKey)}`);

    if (!zoneHeader) {
        console.warn(`Элемент zone-header-${sanitizeId(zoneKey)} не найден. Пропускаем настройку аккордеона.`);
        return;
    }

    if (!zoneContent) {
        console.warn(`Элемент zone-content-${sanitizeId(zoneKey)} не найден. Аккордеон может работать некорректно.`);
        return;
    }

    zoneHeader.addEventListener('click', () => {
        zoneContent.classList.toggle('hidden');
    });
}



function showZone(zoneName) {
    const zone = zones[zoneName];
    if (!zone || zone.isVisible) return;

    if (zone.polygon) {
        myMap.geoObjects.add(zone.polygon);
    }
    zone.isVisible = true;

    for (let groupName in zone.groups) {
        const group = zone.groups[groupName];
        group.objects?.forEach(obj => myMap.geoObjects.add(obj.placemark));
        for (let subgroupName in group.subgroups) {
            group.subgroups[subgroupName].forEach(obj => myMap.geoObjects.add(obj.placemark));
        }
    }
}

function hideZone(zoneName) {
    const zone = zones[zoneName];
    if (!zone || !zone.isVisible) return;

    if (zone.polygon) {
        myMap.geoObjects.remove(zone.polygon);
    }
    zone.isVisible = false;

    for (let groupName in zone.groups) {
        const group = zone.groups[groupName];
        group.objects?.forEach(obj => myMap.geoObjects.remove(obj.placemark));
        for (let subgroupName in group.subgroups) {
            group.subgroups[subgroupName].forEach(obj => myMap.geoObjects.remove(obj.placemark));
        }
    }
}

function toggleSubgroupObjects(zoneName, groupName, subgroupName, show) {
    const zone = zones[zoneName];
    if (!zone || !zone.groups[groupName]) return;

    if (!subgroupName) {
        // Если подгруппа отсутствует, отображаем или скрываем объекты из группы
        toggleGroupObjects(zoneName, groupName, show);
        return;
    }

    const subgroup = zone.groups[groupName].subgroups[subgroupName];
    if (!subgroup) return;

    // Отображение или скрытие объектов внутри подгруппы
    subgroup.objects.forEach(obj => {
        if (show) {
            myMap.geoObjects.add(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.add(obj.polygon);
            }
        } else {
            myMap.geoObjects.remove(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.remove(obj.polygon);
            }
        }
    });

    // Отображение или скрытие ордеров
    for (let orderName in subgroup.orders) {
        const orderContent = document.getElementById(`order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`);
        const isOrderExpanded = orderContent && !orderContent.classList.contains('hidden');
        toggleOrderObjects(zoneName, groupName, subgroupName, orderName, show && isOrderExpanded);
    }
}





function toggleOrderObjects(zoneName, groupName, subgroupName, orderName, show) {
    const zone = zones[zoneName];
    if (!zone || !zone.groups[groupName]) return;

    const subgroup = zone.groups[groupName].subgroups[subgroupName];
    if (!subgroup || !subgroup.orders[orderName]) return;

    const orderObjects = subgroup.orders[orderName];

    orderObjects.forEach(obj => {
        if (show) {
            myMap.geoObjects.add(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.add(obj.polygon);
            }
        } else {
            myMap.geoObjects.remove(obj.placemark);
            if (obj.polygon) {
                myMap.geoObjects.remove(obj.polygon);
            }
        }
    });
}


function showZonePolygon(zoneKey) {
    const zone = zones[zoneKey];
    if (!zone || zone.polygonVisible) return;

    if (zone.polygons && zone.polygons.length > 0) {
        zone.polygons.forEach(polygon => myMap.geoObjects.add(polygon));
    } else {
        console.warn(`У зоны '${zoneKey}' отсутствуют полигоны для отображения.`);
    }

    if (zone.label) {
        myMap.geoObjects.add(zone.label);
    }
    zone.polygonVisible = true;
}

function hideZonePolygon(zoneKey) {
    const zone = zones[zoneKey];
    if (!zone || !zone.polygonVisible) return;

    if (zone.polygons && zone.polygons.length > 0) {
        zone.polygons.forEach(polygon => myMap.geoObjects.remove(polygon));
    }
    if (zone.label) {
        myMap.geoObjects.remove(zone.label);
    }
    zone.polygonVisible = false;
}




const controls = document.getElementById('controls');
const toggleButton = document.getElementById('toggle-button');
const mapContainer = document.getElementById('map');

toggleButton.addEventListener('click', () => {
    // Проверяем текущее состояние и меняем display
    if (controls.style.display === 'none') {
        controls.style.display = 'flex'; // Восстанавливаем flex
        toggleButton.textContent = 'Скрыть настройки';
    } else {
        controls.style.display = 'none'; // Убираем flex
        toggleButton.textContent = 'Показать настройки';
    }

    // Обновляем размеры карты
    setTimeout(() => {
        if (typeof myMap !== 'undefined' && myMap.container) {
            myMap.container.fitToViewport();
        }
    }, 100); // Небольшая задержка для правильной обработки
});







document.addEventListener("DOMContentLoaded", function() {
    const formButton = document.getElementById('form-button');
    const formPopup = document.getElementById('form-popup');
    const formHolder = document.getElementById('formHolder');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeImageModalButton = document.getElementById('close-image-modal');

        if (closeImageModalButton) {
        closeImageModalButton.addEventListener('click', function() {
            imageModal.classList.add('hidden');
            modalImage.src = ''; // Очищаем изображение
        });
    }

    // Закрытие модального окна при клике вне его содержимого
    imageModal.addEventListener('click', function(event) {
        if (event.target === imageModal) {
            imageModal.classList.add('hidden');
            modalImage.src = ''; 
        }
    });

    if (formButton) {
        formButton.addEventListener('click', function() {
            formPopup.classList.remove('hidden');

            // Инициализируем форму при первом открытии
            if (!window.formInitialized) {
                window.formInitialized = true; // Устанавливаем флаг, чтобы предотвратить повторную инициализацию

                (function() {
                    var f = 'externalFormStarterCallback', s = document.createElement('script');
                    window[f] = function(h) {
                        if (formHolder) {
                            console.log('Форма инициализируется');
                            h.bind(formHolder);
                        } else {
                            console.error('formHolder не найден');
                        }
                    };
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://pyrus.com/js/externalformstarter?jsonp=' + f + '&id=1524907';
                    document.head.appendChild(s);
                })();
            }
        });
    }

    // Закрытие модального окна при клике на крестик
    window.closeFormPopup = function() {
        formPopup.classList.add('hidden');
    };

    // Закрытие модального окна при клике вне формы
    formPopup.addEventListener('click', function(event) {
        if (event.target === formPopup) {
            closeFormPopup();
        }
    });
});


// Функция для открытия модального окна с изображением
window.openImageModal = function(imageUrl) {
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');

    if (imageModal && modalImage) {
        modalImage.src = imageUrl;
        imageModal.classList.remove('hidden');
    }
};



function generateImageHTML(imageUrl, title) {
    const safeTitle = (title || 'Изображение')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const cleanedImageUrl = imageUrl.trim();

    if (cleanedImageUrl.startsWith('http')) {
        const encodedImageUrl = encodeURI(cleanedImageUrl);
        return `<img src="${encodedImageUrl}" alt="${safeTitle}" class="balloon-image" onclick="openImageModal('${encodedImageUrl}')" style="width:200px; cursor:pointer; margin-top: 10px;">`;
    } else {
        const folderName = cleanedImageUrl.split('/').pop(); // Берём только последнюю часть пути
        const encodedFolderName = encodeURIComponent(folderName);

        return `<img src="https://raw.githubusercontent.com/mo-grajdanka/map_task/main/img/${encodedFolderName}/1.jpg" alt="${safeTitle}" class="balloon-image" onclick="openSlider('${folderName.replace(/'/g, "\\'")}')" style="width:200px; cursor:pointer; margin-top: 10px;">`;
    }
}




function openSlider(folderName) {
    const sliderModal = document.getElementById('slider-modal');
    const sliderImage = document.getElementById('slider-image');

    let slideImages = [];
    let currentSlideIndex = 0;

    // Оставляем только имя папки
    const cleanedFolderName = folderName.split('/').pop(); // Берём последнюю часть пути
    const encodedFolderName = encodeURIComponent(cleanedFolderName);

    let i = 1;

    function loadImages() {
        const imgSrc = `https://raw.githubusercontent.com/mo-grajdanka/map_task/main/img/${encodedFolderName}/${i}.jpg`;
        const img = new Image();
        img.onload = () => {
            slideImages.push(imgSrc);
            i++;
            loadImages(); 
        };
        img.onerror = () => {
            if (slideImages.length > 0) {
                startSlider();
            } else {
                alert('Изображения не найдены.');
            }
        };
        img.src = imgSrc;
    }

    function startSlider() {
        currentSlideIndex = 0;
        updateSlide();
        sliderModal.classList.remove('hidden');
    }

    function updateSlide() {
        if (slideImages.length > 0) {
            sliderImage.src = slideImages[currentSlideIndex];
        } else {
            sliderImage.src = ''; // Если нет изображений
        }
    }

    function closeSlider() {
        sliderModal.classList.add('hidden');
    }

    document.getElementById('next-slide').addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex + 1) % slideImages.length;
        updateSlide();
    });

    document.getElementById('prev-slide').addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex - 1 + slideImages.length) % slideImages.length;
        updateSlide();
    });

    document.getElementById('close-slider-modal').addEventListener('click', closeSlider);

    // Начать загрузку изображений
    loadImages();
}
