const apiKey = 'AIzaSyAxQtm76Gl2s2Yfv8KX7Zwpj3bfgzKZNkg';
const spreadsheetId = '13aWpgiOD_uZodKXpxLzkLAgidljTH8UZX3F78czGfwQ';

let form1Initialized = false;
let form2Initialized = false;
let myMap;
let zones = {};
let displayedZones = {};
const initialCenter = [60.007899, 30.390313];
const initialZoom = 14;
const zoneMappings = {
    // "48": "Благоустройство и озеленение",
    // "47": "Развитие территории",
    // "46": "Уборка территории",
    // "45": "Образование",
    "Проекты": "Проекты",
    "Общественные инициативы": "Общественные инициативы",
    "Питомцы": "Питомцы",
    "Доска объявлений": "Доска объявлений",
    "Торговля": "Торговля",
    "Социальная инфраструктура": "Социальная инфраструктура",
    "Медицина": "Медицина",
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

const zoneCoordinates = {
    "47": {
        "polygon": [[[30.391337410365303,60.00655929370387],[30.391339546321557,60.006557775085035],[30.392515694974595,60.00628982615836],[30.39365965711945,60.006000385164846],[30.39464671003697,60.00697816173809],[30.395075863479335,60.00684922582946],[30.395086592315412,60.006709544692605],[30.39422828543063,60.00575862275961],[30.397189444183084,60.005060188055225],[30.39689976560948,60.004748573947225],[30.39913136350986,60.00423279239861],[30.400687044738532,60.00583383794996],[30.40154535162334,60.00558670178674],[30.40311176168804,60.00522136664632],[30.403278058646073,60.004821104359536],[30.401818936941975,60.00342418040229],[30.402012055990976,60.00315553439259],[30.402956193564208,60.00297285385548],[30.40405053484241,60.00262898185408],[30.40754813539763,60.00545507339464],[30.407784169791068,60.00533687670293],[30.40817040788897,60.005680720447835],[30.41031617510075,60.004917812288674],[30.410552209494472,60.00503601048339],[30.410788243887914,60.005272405601296],[30.410487836478204,60.005369112206246],[30.410487836478204,60.00546581852723],[30.411185210821866,60.006260948652496],[30.411453431723515,60.00650270738202],[30.411592906592254,60.00650270738202],[30.412225907919648,60.00713664407446],[30.412697976706557,60.007147388659305],[30.413341706869648,60.00726020658625],[30.414253657935053,60.008146619718694],[30.41382450449253,60.0082755505519],[30.414403861639535,60.00880201288649],[30.415390914557385,60.00855489896064],[30.415498202917938,60.008640851840504],[30.41597027170472,60.00903838099504],[30.415111964819758,60.009247887683266],[30.412494128820967,60.00993548998924],[30.413180774328982,60.01004292655349],[30.41396934377965,60.01084331796045],[30.41432875978737,60.01102058322083],[30.415036862967618,60.011721577408245],[30.417483037589232,60.01111727296063],[30.41775125849068,60.01139122568361],[30.414741819975887,60.01214324105861],[30.41453260767278,60.011904209460575],[30.41233319628053,60.012430613830574],[30.412510222075632,60.012648156038146],[30.411153024313936,60.01300266618783],[30.408883875487373,60.010435067131205],[30.39768297064118,60.0133356874628],[30.39149352474093,60.00673407135846],[30.391337410365303,60.00655929370387]]],
        "color": "#FF000088"
    },
    "48": {
        "polygon": [[[30.401467567561678,60.00066642561611],[30.407324749340383,60.001715990694],[30.415597444652164,60.00331000673708],[30.41849423038825,60.00379356571186],[30.42351532566414,60.00722125818702],[30.427892690776428,60.010895692445246],[30.425017362712474,60.011647719128725],[30.426304823039622,60.0129905812359],[30.424352174876766,60.01347399819827],[30.424073225139217,60.01319469148503],[30.420897489665606,60.01397889278717],[30.415382867930983,60.00856430066209],[30.414417272685622,60.00882215855637],[30.413880830882626,60.008295696543556],[30.41426706898078,60.00815602153675],[30.413365846751784,60.00725349183861],[30.41270065891608,60.00715679076224],[30.412207132457347,60.00714604618068],[30.411606317638007,60.00652285445736],[30.411456113933166,60.00650136485945],[30.410479789851752,60.00547522111023],[30.4104690610157,60.00536776965527],[30.410780197261406,60.005271063046315],[30.41054416286812,60.00504004055421],[30.410297399638726,60.00493258768062],[30.40816236126287,60.00567937790965],[30.40776539432869,60.00535702449052],[30.407550817607483,60.00544835827933],[30.404053217052056,60.002633012228266],[30.402958875773983,60.002987630119385],[30.402025467036808,60.00315956469339],[30.401800161479546,60.003428210670045],[30.403270012019718,60.004825134456716],[30.403087621806694,60.00523345484399],[30.40070429478185,60.00584132422075],[30.399116427045044,60.00427251562695],[30.397550016980293,60.00263915610468],[30.395393520932334,60.003171081411644],[30.394696146588444,60.002477964923145],[30.396766811947955,60.00197826725151],[30.396670252423405,60.00185468493864],[30.401455313305977,60.00067256984101],[30.401467567561678,60.00066642561611]]],
        "color": "#FFA50088"
    },
    "46": {
        "polygon": [[[30.391139473151366,60.0066051348012],[30.38561412258077,60.007507682262855],[30.382095064353187,60.00243590441505],[30.378919328879473,59.99921191115044],[30.37733146114277,59.996675481542674],[30.365100588034977,59.99813717666462],[30.36449977321546,59.99757830088728],[30.36402770442891,59.99633154386167],[30.35917827052999,59.99390238184746],[30.374198641013496,59.99181702923897],[30.37578650875015,59.992118016108876],[30.380893434714586,59.99605209185437],[30.39123603267597,59.994783779900494],[30.394926752280522,60.000136154788855],[30.39679356975488,60.001973818056754],[30.394712175559288,60.0024359044061],[30.3953988210671,60.0031558864955],[30.396418060492753,60.00290604373438],[30.397566045951137,60.00263470699678],[30.399132456015813,60.00423045739051],[30.396900858115384,60.00474623896647],[30.39721199436112,60.00505248046856],[30.39422401351853,60.00575360160241],[30.395090367030352,60.00670586677001],[30.39509439034386,60.0068381609527],[30.39464579088613,60.00697952039389],[30.39365974379702,60.00599721083656],[30.392399608474168,60.006322663921914],[30.391139473151366,60.0066051348012]]],
        "color": "#FF634788"
    },
    "45": {
        "polygon": [[[30.417475593202052,60.01929083579034],[30.41228600902542,60.0141256091127],[30.41116434274297,60.01299831888272],[30.41248885108214,60.01264448011072],[30.41234837038497,60.012430966452186],[30.4145350412844,60.01190724784625],[30.41472413701994,60.012132850720135],[30.417720164489594,60.01138620671999],[30.4174680368422,60.01111762560476],[30.41500576896648,60.01170312962573],[30.41431375904067,60.01101019254402],[30.413962913363534,60.010828494760034],[30.413172185407984,60.0100344140961],[30.412556324742237,60.00992885601964],[30.415873629899906,60.00906236389482],[30.420898914806433,60.01395801565387],[30.424074985933576,60.01319166490217],[30.42437606465034,60.01346657430669],[30.42628714008312,60.01297616210255],[30.42507478160839,60.01162255629909],[30.427885736656002,60.010892015772626],[30.43010124130233,60.012758622114546],[30.432316745948683,60.01463586487845],[30.43214508457171,60.015543563338575],[30.43357201976765,60.015221306393244],[30.43280490798939,60.02139197918494],[30.430598545245836,60.021344887961384],[30.430690076551546,60.02123407098226],[30.430486228666414,60.02092529481199],[30.430024888715838,60.02065410639692],[30.429874685010997,60.020503743541305],[30.429585006437396,60.0204178216014],[30.42892518301969,60.02041916412893],[30.42828681727419,60.02030773379736],[30.42732658644683,60.0200016340331],[30.42682233115207,60.0198432128764],[30.426484372816176,60.01984321286741],[30.425894286832943,60.019886174632774],[30.425057437620293,60.02006607634124],[30.42461219092382,60.02008487198543],[30.424183037481455,60.01996135755583],[30.424091842374928,60.01990228527361],[30.42387190123572,60.01990765548542],[30.42364659567846,60.01999894895298],[30.423432018957275,60.02023255167386],[30.423190620145935,60.020366805361576],[30.422959950170647,60.020557444657975],[30.42286339064612,60.02056818486722],[30.422402050695545,60.02050374355936],[30.421211149892947,60.020479578036394],[30.420910742483265,60.02056818486722],[30.420540597639214,60.02058966527515],[30.420299198827873,60.02051448378607],[30.419827130041348,60.02053327919244],[30.418368008337225,60.019051095646994],[30.417475593202052,60.01929083579034]]],
        "color": "#3CB37188"
    }
};

const orderColors = {
    1: '#FFC0CB', // Розовый
    2: '#FFFF00', // Желтый
    3: '#008000', // Зеленый
    4: '#00FFFF', // Голубой
    5: '#800080', // Фиолетовый
    6: '#FFA500', // Оранжевый
    7: '#808080'  // Серый
};

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
        //    console.error('Не удалось найти один из необходимых элементов (photo-modal, photo-status, camera).');
        return;
    }

    // Показываем модальное окно и скрываем уведомление
    photoModal.classList.remove('hidden');
    photoStatus.classList.add('hidden');

    //  console.log('Открываем модальное окно камеры.');

    // Запрашиваем доступ к камере только при открытии модального окна
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            camera.srcObject = stream;
            //    console.log('Камера успешно подключена.');
        })
        .catch((err) => {
            //    console.error('Ошибка доступа к камере:', err);

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
    //  console.log('Нажата кнопка съемки фото.');

    // Проверяем и обновляем координаты перед съемкой
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                //   console.log(`Обновлены координаты: Широта=${latitude}, Долгота=${longitude}`);
                capturePhoto();
            },
            (error) => {
                //   console.warn('Не удалось получить координаты:', error);
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
                    //   console.log('Фото успешно создано в формате Blob.');
                    addGeoDataToPhoto(blob);
                } else {
                    //   console.error('Не удалось создать Blob из изображения.');
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
    //   console.log('Нажата кнопка пересъема.');
    snapshot.style.display = 'none';
    camera.style.display = 'block';
    takePhotoButton.style.display = 'inline';
    savePhotoButton.style.display = 'none';
    retakePhotoButton.style.display = 'none';
    photoBlob = null; // Сбросить текущее фото
});


// Сохранение фото
savePhotoButton.addEventListener('click', () => {
    // console.log('Нажата кнопка сохранения фото.');
    if (photoBlob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(photoBlob);
        link.download = `photo_${Date.now()}.jpg`;
        link.click();
        //    console.log('Фото сохранено.');

        // Убедимся, что скрытый класс удалён перед добавлением block
        photoStatus.classList.remove('hidden');
        photoStatus.classList.add('block');
        console.log('Классы элемента photoStatus после отображения:', photoStatus.classList);

        // Скрыть уведомление через 5 секунд
        setTimeout(() => {
            // Удаляем block и возвращаем hidden
            photoStatus.classList.remove('block');
            photoStatus.classList.add('hidden');
            //   console.log('Классы элемента photoStatus после скрытия:', photoStatus.classList);
        }, 5000);

        // Закрытие модального окна
        closePhotoModal();
    } else {
        //  console.error('Ошибка: фото не было сделано.');
        alert('Фото не было сделано.');
    }
});









// Добавление геоданных в EXIF
function addGeoDataToPhoto(blob) {
    //  console.log('Добавление геоданных в EXIF.');
    //  console.log(`Координаты для добавления: Широта=${latitude}, Долгота=${longitude}`);

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
                //    console.log('EXIF успешно обновлен.');
            } else {
                //    console.warn('Геоданные отсутствуют. Сохраняем фото без EXIF.');
                photoBlob = blob;
            }
        } catch (error) {
            //    console.error('Ошибка обработки EXIF данных:', error);
            photoBlob = blob;
        }
    };

    reader.onerror = function (error) {
        //    console.error('Ошибка при чтении Blob:', error);
        photoBlob = blob;
    };

    reader.readAsDataURL(blob);
}





function flattenCoords(coords) {
    let flatCoords = [];
    coords.forEach(function (coord) {
        if (Array.isArray(coord[0])) {
            flatCoords = flatCoords.concat(flattenCoords(coord));
        } else {
            flatCoords.push(coord);
        }
    });
    return flatCoords;
}
function swapCoordinates(coords) {
    // Логируем входящие данные
    //   console.log('Входящие данные:', coords);
    // Проверяем, является ли coords массивом
    if (!Array.isArray(coords)) {
        //    console.error('Ошибка: переданы некорректные данные. Ожидается массив, получено:', coords);
        return coords; // Возвращаем данные без изменений
    }
    // Если первый элемент массива — это массив (вложенные координаты)
    if (Array.isArray(coords[0])) {
        // Рекурсивно обрабатываем каждый вложенный массив
        return coords.map(swapCoordinates);
    } else {
    }
    // Если массив содержит два числа (широту и долготу)
    if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        // Меняем местами широту и долготу
        return [coords[1], coords[0]];
    } else {
        // Если структура данных не соответствует ожидаемой
        console.error('Ошибка: неверный формат координат. Ожидается массив из двух чисел:', coords);
        return coords; // Возвращаем данные без изменений
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
                    polygon: null,
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
                let polygonCoordsString;
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    polygonCoordsString = getRowValue(row, indices, 'polygonCoords');
                    if (polygonCoordsString) {
                        break; // Нашли координаты, выходим из цикла
                    }
                }

                if (polygonCoordsString) {
                    try {
                        let coordinates = JSON.parse(polygonCoordsString);
                        coordinates = swapCoordinates(coordinates);

                        // Создаём полигон
                        zones[zoneKey].polygon = new ymaps.Polygon(coordinates, {}, {
                            fillColor: color,
                            strokeColor: '#800000',
                            opacity: 0.7,
                        });

                        // Создаём метку
                        const flatCoords = flattenCoords(coordinates);
                        const bounds = ymaps.util.bounds.fromPoints(flatCoords);
                        const center = ymaps.util.bounds.getCenter(bounds);

                        zones[zoneKey].label = new ymaps.Placemark(center, {
                            iconCaption: zoneName,
                        }, {
                            preset: 'islands#blueCircleDotIconWithCaption',
                            iconCaptionMaxWidth: '200',
                            iconColor: color,
                        });

                        //    console.log(`Полигон успешно создан для зоны '${zoneKey}'`);
                    } catch (e) {
                        //    console.error(`Ошибка при парсинге координат полигона для зоны ${zoneName}:`, e);
                    }
                } else {
                    //  console.warn(`Координаты полигона не найдены для зоны '${zoneKey}'`);
                }
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
                // const extraButton = getRowValue(row, indices, 'extraButton');
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
                    //  console.warn(`Секция зоны отсутствует: zone-content-${sanitizeId(zoneKey)}. Пропускаем обработку группы '${group}'.`);
                    continue; // Пропускаем, если секция зоны отсутствует
                }

                // Инициализируем группу, если она не существует
                if (!zones[zoneKey].groups[group]) {
                    zones[zoneKey].groups[group] = { subgroups: {}, orders: {}, objects: [] };
                    generateGroupHTML(zoneKey, group, link);
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

                            // Добавляем кнопку, если ордер не "вне ордера"
                            addButtonToOrder(zoneKey, group, subgroup, order);
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


                            // Добавляем кнопку, если ордер не "вне ордера"
                            addButtonToOrder(zoneKey, group, null, order);
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


                            const orderNumber = parseInt(order, 10);
                            let fillColor, strokeColor, strokeWidth, strokeOpacity, fillOpacity;
                            
                            // Проверка, есть ли номер ордера
                            if (isNaN(orderNumber)) {
                                // Если ордер без номера
                                fillColor = '#FF0000';    // Заливка для отсутствующих номеров
                                strokeColor = '#FF0000';  // Четкая красная граница
                                strokeWidth = 3;
                                strokeOpacity = 1;        // Полная непрозрачность границы
                                fillOpacity = 0;          // Прозрачная заливка
                            } else {
                                // Если ордер с номером
                                fillColor = orderColors[orderNumber] || '#FF0000';
                                strokeColor = '#800000';  // Граница, если есть номер
                                strokeWidth = 0.5;
                                strokeOpacity = 0.8;      // Менее прозрачная граница
                                fillOpacity = 0.5;        // Полупрозрачная заливка
                            }
                            
                            // Создание полигона
                            const polygon = new ymaps.Polygon(coordinates, {}, {
                                fillColor,
                                strokeColor,
                                strokeWidth,
                                strokeOpacity,
                                fillOpacity,
                            });
                            
                            objectData.polygon = polygon; // Сохранение полигона
                            

                        } catch (e) {
                            //  console.error(`Ошибка при создании полигона для зоны '${zoneKey}':`, e);
                        }
                    }


                    if (polygonCoordsString) {
                        try {
                            let coordinates = JSON.parse(polygonCoordsString);
                            coordinates = swapCoordinates(coordinates);

                            // Создаем полигон
                            // zones[zoneKey].polygon = new ymaps.Polygon(coordinates, {}, {
                            //     fillColor: color,
                            //     strokeColor: '#333',
                            //     opacity: 0.7,
                            // });



                            // Создаем метку
                            const flatCoords = flattenCoords(coordinates);
                            const bounds = ymaps.util.bounds.fromPoints(flatCoords);
                            const center = ymaps.util.bounds.getCenter(bounds);

                            zones[zoneKey].label = new ymaps.Placemark(center, {
                                iconCaption: zoneName,
                            }, {
                                preset: 'islands#blueCircleDotIconWithCaption',
                                iconCaptionMaxWidth: '200',
                                iconColor: color,
                            });
                        } catch (e) {
                            //  console.error(`Ошибка при парсинге координат полигона для зоны ${zoneName}:`, e);
                        }
                    }

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
        })
        .catch(error => console.error(`Ошибка при загрузке данных с листа ${sheetName}:`, error));
}


function findRelevantElements(orderName) {
    const allElements = document.querySelectorAll('[id^="object-"]');

    const currentOrderNumber = parseInt(orderName.match(/^\d+/), 10);

    return Array.from(allElements).filter((element) => {
        const title = element.parentElement.textContent.trim();
        const match = title.match(/^(\d+)\.\d+\s([с|ю])$/);
        if (match) {
            const firstDigit = parseInt(match[1], 10);
            const lastChar = match[2];
            return firstDigit === currentOrderNumber && (lastChar === 'с' || lastChar === 'ю');
        }
        return false;
    });
}

function addButtonToOrder(zoneKey, groupName, subgroupName, orderName) {
    if (!orderName || orderName.toLowerCase() === 'вне ордера') {
        console.log(`Пропущено добавление кнопки для ордера: '${orderName}'`);
        return;
    }

    const orderId = subgroupName
        ? `order-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`
        : `order-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}-${sanitizeId(orderName)}`;

    const orderContent = document.getElementById(orderId);

    if (!orderContent) {
        console.warn(`⚠️ Не удалось найти контент ордера: ${orderId}`);
        return;
    }

    const button = document.createElement('button');
    button.className = 'custom-button';
    button.textContent = 'вне ордера';

    let allElementsVisible = false;

    button.addEventListener('click', () => {
        const extraContentId = `extra-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`;
        let extraContent = document.getElementById(extraContentId);

        if (!extraContent) {
            extraContent = document.createElement('div');
            extraContent.className = 'accordion-content hidden';
            extraContent.id = extraContentId;

            const filteredElements = findRelevantElements(orderName);

            filteredElements.forEach((element) => {
                const label = document.createElement('label');
                const title = element.parentElement.textContent.trim();
                const elementId = element.id.split('-').pop();

                label.innerHTML = `
                    <input type="checkbox" 
                           id="object-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}-${sanitizeId(elementId)}"
                           onchange="toggleObject('${zoneKey}', '${groupName}', '${subgroupName}', '${'вне ордера'}', '${elementId}', this.checked)">
                    ${title}
                `;
                const checkbox = label.querySelector('input[type="checkbox"]');
                checkbox.checked = false;
                extraContent.appendChild(label);
            });

            orderContent.insertBefore(extraContent, button.nextSibling);
        }

        // Переключаем видимость элементов
        allElementsVisible = !allElementsVisible;

        const checkboxes = extraContent.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            const objectId = checkbox.id.split('-').pop();
            checkbox.checked = allElementsVisible;
            toggleObject(zoneKey, groupName, subgroupName, 'вне ордера', objectId, allElementsVisible);
        });
        // Управление видимостью полигона
        // if (zones[zoneKey] && zones[zoneKey].polygon) {
        //     if (allElementsVisible) {
        //         myMap.geoObjects.add(zones[zoneKey].polygon);
        //     } else {
        //         myMap.geoObjects.remove(zones[zoneKey].polygon);
        //     }
        // }

        extraContent.classList.toggle('hidden', !allElementsVisible);
    });

    orderContent.appendChild(button);
    // console.log(`✔️ Кнопка добавлена в ордер: ${orderName}`);
}





















// function displayPolygonsForOrderPrefix(prefix) {
//     // Удаляем все полигоны перед добавлением новых
//     myMap.geoObjects.removeAll();

//     // Найти все полигоны для ордеров, начинающихся с заданного префикса
//     const zone = zones["Ордера"]; 
//     if (!zone) {
//         console.error("Зона 'Ордера' не найдена.");
//         return;
//     }

//     Object.keys(zone.groups).forEach(groupName => {
//         const group = zone.groups[groupName];

//         // Проверяем подгруппы
//         Object.keys(group.subgroups).forEach(subgroupName => {
//             const subgroup = group.subgroups[subgroupName];

//             // Перебираем ордера внутри подгруппы
//             Object.keys(subgroup.orders).forEach(orderName => {
//                 if (orderName.startsWith(prefix)) { // Проверяем, начинается ли ордер с префикса
//                     subgroup.orders[orderName].forEach(obj => {
//                         if (obj.polygon) {
//                             myMap.geoObjects.add(obj.polygon);
//                         }
//                     });
//                 }
//             });
//         });

//         // Проверяем ордера на уровне группы
//         Object.keys(group.orders).forEach(orderName => {
//             if (orderName.startsWith(prefix)) { // Проверяем, начинается ли ордер с префикса
//                 group.orders[orderName].forEach(obj => {
//                     if (obj.polygon) {
//                         myMap.geoObjects.add(obj.polygon);
//                     }
//                 });
//             }
//         });
//     });
// }



function generateOrderHTML(zoneName, groupName, subgroupName, orderName) {
    // Находим секцию подгруппы
    const subgroupSection = document.getElementById(
        `subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`
    );

    if (!subgroupSection) {
        //  console.warn(
        //     `Секция подгруппы отсутствует: subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}. Пропускаю создание ордера '${orderName}'.`
        // );
        return;
    }

    // Создаем HTML-структуру для ордера
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order';
    orderDiv.innerHTML = `
        <div class="accordion-header hidden" id="order-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}">
            <span class="order-title">${orderName}</span>
        </div>
        <div class="accordion-content hidden" id="order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}">
        </div>
    `;
    subgroupSection.appendChild(orderDiv);

    // Получаем элементы заголовка и контента
    const orderHeader = document.getElementById(
        `order-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`
    );
    const orderContent = document.getElementById(
        `order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`
    );

    if (!orderHeader || !orderContent) {
        //  console.error(
        //     `Ошибка: не удалось найти элементы заголовка или контента для ордера '${orderName}'. Проверьте структуру HTML.`
        // );
        return;
    }

    // Переменная для отслеживания состояния ордера
    let isOrderExpanded = false;

    // Обработчик клика по заголовку ордера
    orderHeader.addEventListener('click', () => {
        //  console.log(`Клик по заголовку ордера: ${orderName}`);

        // Переключение видимости текущего контента
        orderContent.classList.toggle('hidden');
        isOrderExpanded = !orderContent.classList.contains('hidden');
        //  console.log(`Состояние ордера '${orderName}': ${isOrderExpanded ? 'раскрыт' : 'свернут'}`);

        // Снятие hidden со всех заголовков внутри подгруппы
        const allHeaders = subgroupSection.querySelectorAll('.accordion-header');
        //  console.log(`Найдено ${allHeaders.length} элементов`);
        allHeaders.forEach((header) => {
            //  console.log(`Обрабатывается элемент: ${header.tagName}`);
            header.classList.remove('hidden');
        });

        // Логика отображения/скрытия объектов
        toggleOrderObjects(zoneName, groupName, subgroupName, orderName, isOrderExpanded);

        // Логика отображения/скрытия полигонов
        if (!isOrderExpanded) {
            //  console.log(`Полигоны для '${orderName}' скрыты.`);
        }
    });

    // Снятие hidden со всех заголовков после инициализации
    const headers = subgroupSection.querySelectorAll('.accordion-header');
    headers.forEach((header) => header.classList.remove('hidden'));
}











function generateOrderHTMLAtGroupLevel(zoneName, groupName, orderName) {
    const groupSection = document.getElementById(`group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
    if (!groupSection) {
        //  console.error(`Не удалось найти секцию группы: group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
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
        '#FFA50088', // Оранжевый
        '#4682B488', // Синий стальной
        '#32CD32',   // Зеленый лаймовый
        '#1E90FF',   // Голубой Доджера
        '#FF634788', // Кораловый
        '#9400D388', // Темный фиолетовый
        '#FFD70088', // Золотой
        '#00808088', // Бирюзовый
        '#DC143C88', // Малиновый
        '#7B68EE88', // Средний голубой
        '#8B451388', // Седло-коричневый
        '#00CED188', // Темный бирюзовый
        '#ADFF2F88', // Желто-зеленый
        '#FF450088', // Оранжево-красный
        '#8A2BE288', // Сине-фиолетовый
        '#5F9EA088', // Лазурный
        '#9932CC88', // Темно-орхидеевый
        '#FF8C0088', // Темно-оранжевый
        '#3CB37188', // Морской зеленый
        '#6A5ACD88'  // Темный васильковый
    ];




    let zoneKeys = Object.keys(zoneMappings);

    let loadPromises = zoneKeys.map((zoneKey, index) => {
        const sheetName = zoneMappings[zoneKey];
        const color = colors[index % colors.length];

        // Если зона есть в `zoneCoordinates`, пропускаем загрузку из Google Sheets
        if (zoneCoordinates[zoneKey]) {
            return Promise.resolve(); // Пропускаем, не делаем fetch
        }

        // Иначе загружаем из Google Sheets
        return fetchZoneData(zoneKey, sheetName, color);
    });

    // После загрузки всех зон
    Promise.all(loadPromises).then(() => {
        console.log('Все зоны загружены');
    });

    // Обработчик для выпадающего списка
    const zoneSelect = document.getElementById('zone-select');
    zoneSelect.addEventListener('change', function () {
        const selectedZone = this.value;
    
        // Удаляем все полигоны с карты
        myMap.geoObjects.removeAll();
    
        if (selectedZone === '') {
            console.log('Выбрано пустое значение. Все полигоны скрыты.');
            return;
        }
    
        if (selectedZone === 'all') {
            // Показываем только полигоны из `zoneCoordinates`
            let bounds = []; // Для масштабирования карты
    
            for (let zoneKey in zoneCoordinates) {
                const zoneData = zoneCoordinates[zoneKey];
                const coordinates = swapCoordinates(zoneData.polygon);
    
                // Добавляем полигон
                const polygon = new ymaps.Polygon(coordinates, {}, {
                    fillColor: zoneData.color || '#00FF0088',
                    strokeColor: '#000000',
                    strokeWidth: 2,
                    opacity: 0.5,
                });
                myMap.geoObjects.add(polygon);
    
                // Центрируем карту
                const flatCoords = flattenCoords(coordinates);
                bounds = bounds.concat(flatCoords);
    
                // Добавляем метку
                const zoneBounds = ymaps.util.bounds.fromPoints(flatCoords);
                const center = ymaps.util.bounds.getCenter(zoneBounds);
                const label = new ymaps.Placemark(center, {
                    iconCaption: `Зона ${zoneKey}`,
                }, {
                    preset: 'islands#blueCircleDotIconWithCaption',
                    iconColor: zoneData.color || '#0000FF',
                });
                myMap.geoObjects.add(label);
            }
    
            // Масштабируем карту, чтобы включить все полигоны
            if (bounds.length > 0) {
                const allBounds = ymaps.util.bounds.fromPoints(bounds);
                myMap.setBounds(allBounds, { checkZoomRange: true });
            }
    
            console.log('Все полигоны из zoneCoordinates успешно отображены.');
            return;
        }
    
        if (zoneCoordinates[selectedZone]) {
            // Если зона есть в `zoneCoordinates`, отображаем её
            showPolygonFromVariable(selectedZone);
        } else {
            console.warn(`Зона с ключом '${selectedZone}' не найдена в zoneCoordinates.`);
        }
    });
    


    // Функция отображения полигона из переменной
    function showPolygonFromVariable(zoneKey) {
        const zoneData = zoneCoordinates[zoneKey];
        if (!zoneData) {
            console.error(`Координаты для зоны '${zoneKey}' не найдены.`);
            return;
        }
    
        try {
            const correctedCoordinates = swapCoordinates(zoneData.polygon);
    
            const polygon = new ymaps.Polygon(correctedCoordinates, {}, {
                fillColor: zoneData.color || '#00FF0088', // Используем цвет из zoneCoordinates или по умолчанию
                strokeColor: '#000000',
                strokeWidth: 2,
                opacity: 0.5,
            });
    
            // Рассчитываем центр автоматически
            const flatCoords = flattenCoords(correctedCoordinates);
            const bounds = ymaps.util.bounds.fromPoints(flatCoords);
            const center = ymaps.util.bounds.getCenter(bounds);
    
            const placemark = new ymaps.Placemark(center, {
                iconCaption: `${zoneKey}`,
            }, {
                preset: 'islands#blueCircleDotIconWithCaption',
                iconColor: zoneData.color || '#0000FF', // Цвет метки совпадает с цветом полигона
            });
    
            myMap.geoObjects.add(polygon);
            myMap.geoObjects.add(placemark);
            myMap.setBounds(bounds, { checkZoomRange: true });
    
            console.log(`Полигон для зоны '${zoneKey}' успешно добавлен.`);
        } catch (error) {
            console.error(`Ошибка при отображении полигона для зоны '${zoneKey}':`, error);
        }
    }
    
    
}


// function populateZoneDropdown() {
//     const zoneSelect = document.getElementById('zone-select');
//     zoneSelect.innerHTML = ''; // Очищаем текущие опции

//     // Добавляем опции по умолчанию
//     zoneSelect.innerHTML = `
//         <option value="">Выберите округ:</option>
//         <option value="all">Все</option>
//     `;

//     //   console.log('Доступные ключи zones:', Object.keys(zones));
//     //  console.log('zoneMappings:', zoneDisplayNames);


//     // Используем ключи из zoneMappings для заполнения списка
//     for (let zoneKey in zoneMappings) {
//         const option = document.createElement('option');
//         option.value = zoneKey;
//         option.textContent = zoneKey;
//         zoneSelect.appendChild(option);
//     }
// }




function generateZoneHTML(zoneKey, zoneDisplayName, color) {
    // Проверяем, начинается ли ключ с числа
    if (!isNaN(parseInt(zoneKey.charAt(0), 10))) {
        //   console.warn(`Зона '${zoneKey}' начинается с числа и не будет отображена.`);
        return; // Пропускаем создание для значений, начинающихся с числа
    }

    const controls = document.getElementById('sections-container');

    // Проверяем, отображена ли уже эта зона
    if (displayedZones[zoneKey]) {
        //   console.warn(`Секция для зоны '${zoneKey}' уже была создана. Пропускаем.`);
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
    //   console.log(`Секция для зоны '${zoneKey}' успешно создана.`);
}



// function generateGroupHTML(zoneKey, groupName, groupLink = null) {
//     const section = document.getElementById(`zone-content-${sanitizeId(zoneKey)}`);
    
//     if (!section) {
//         console.warn(`Секция зоны zone-content-${sanitizeId(zoneKey)} не найдена. Создайте её перед добавлением групп.`);
//         return;
//     }

//     const groupDiv = document.createElement('div');
//     groupDiv.className = 'subsection';

//     // Проверяем, если ссылка есть, добавляем протокол, если его нет
//     if (groupLink && !groupLink.startsWith('http://') && !groupLink.startsWith('https://')) {
//         console.warn(`Ссылка "${groupLink}" не содержит протокола. Добавляю "https://".`);
//         groupLink = `https://${groupLink}`;
//     }

//     // Специальный случай: "Предложения, жалобы" внутри "Доска объявлений"
//     if (zoneKey === 'Доска объявлений' && groupName === 'Предложения, жалобы') {
//         groupDiv.innerHTML = `
//             <div class="accordion-header" id="group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
//                 <span class="category-title">${groupName}</span>
//             </div>
//         `;

//         section.appendChild(groupDiv);

//         // Добавляем обработчик клика для заголовка группы
//         const groupHeader = groupDiv.querySelector(`#group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
//         if (groupHeader) {
//             groupHeader.addEventListener('click', (event) => {
//                 event.preventDefault(); // Предотвращаем любое стандартное поведение

//                 const modal = document.getElementById('feedback-modal');

//                 if (modal) {
//                     // Показываем модальное окно
//                     modal.classList.remove('hidden');

//                     // Инициализация формы, если ещё не была инициализирована
//                     if (!form2Initialized) {
//                         form2Initialized = true; 
//                         initializeExternalForm(formHolder2, 'externalFormStarterCallback2', '1534475'); // Передаём необходимые аргументы
//                     }
//                 } else {
//                     console.error('Модальное окно "feedback-modal" не найдено.');
//                 }
//             });
//         } else {
//             console.error(`Не удалось найти заголовок группы: group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
//         }

//         // Добавляем обработчик для кнопки закрытия модального окна
//         const closeModalButton = document.getElementById('close-feedback-modal');
//         if (closeModalButton) {
//             closeModalButton.addEventListener('click', () => {
//                 const modal = document.getElementById('feedback-modal');
//                 if (modal) {
//                     modal.classList.add('hidden');
//                 }
//             });
//         } else {
//             console.error('Кнопка закрытия модального окна "close-feedback-modal" не найдена.');
//         }

//         return; // Прерываем выполнение, чтобы не добавлять стандартное содержимое
//     }

//     // Если это "Доска объявлений" и есть ссылка, создаём ссылку
//     if (zoneKey === 'Доска объявлений' && groupLink) {
//         groupDiv.innerHTML = `
//             <a href="${groupLink}" target="_blank" class="accordion-header" id="group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
//                 ${groupName}
//             </a>
//         `;

//         section.appendChild(groupDiv);
//         return; // Прерываем выполнение, так как нет дополнительного содержимого
//     }

//     // Для остальных групп создаём стандартный аккордеон
//     groupDiv.innerHTML = `
//         <div class="accordion-header" id="group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
//             <span class="category-title">${groupName} (<span id="group-count-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">0</span>)</span>
//         </div>
//         <div class="accordion-content hidden" id="group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}"></div>
//     `;

//     section.appendChild(groupDiv);

//     // Проверяем существование заголовка
//     const groupHeader = groupDiv.querySelector(`#group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
//     if (!groupHeader) {
//         console.error(`Не удалось найти заголовок группы: group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
//         return;
//     }

//     // Проверяем существование содержимого только для случаев, где оно создается
//     let groupContent = null;
//     if (!(zoneKey === 'Доска объявлений' && groupName === 'Предложения, жалобы')) {
//         groupContent = document.getElementById(`group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
//         if (!groupContent) {
//             console.error(`Не удалось найти содержимое группы: group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
//             return;
//         }
//     }

//     // Добавляем обработчик клика, если есть groupContent
//     if (groupContent) {
//         groupHeader.addEventListener('click', () => {
//             groupContent.classList.toggle('hidden');
//             const isExpanded = !groupContent.classList.contains('hidden');
//             console.log(`Группа "${groupName}" в зоне "${zoneKey}" ${isExpanded ? 'открыта' : 'закрыта'}`);
//             toggleGroupObjects(zoneKey, groupName, isExpanded);
//         });
//     }
// }











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
        //    console.error(`Группа '${groupName}' не найдена в зоне '${zoneKey}'`);
        return 0;
    }
    let count = (group.objects && group.objects.length) || 0;
    for (let subgroupName in group.subgroups) {
        const subgroupObjects = group.subgroups[subgroupName];
        count += (subgroupObjects && subgroupObjects.length) || 0;
    }
    //    console.log(`Количество объектов в группе '${groupName}' зоны '${zoneKey}': ${count}`);
    return count;
}


function generateSubgroupHTML(zoneName, groupName, subgroupName) {

    // console.log('generateSubgroupHTML called with:', {
    //     zoneName,
    //     groupName,
    //     subgroupName
    // });


    if (!subgroupName) {
        //    console.warn(`Пропущено создание подгруппы: отсутствует название для группы '${groupName}' в зоне '${zoneName}'`);
        return;
    }

    const groupSection = document.getElementById(`group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
    if (!groupSection) {
        console.error(`Не удалось найти секцию группы: group-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}`);
        return;
    }

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
    subgroupDiv.id = `subgroup-section-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`;
    subgroupDiv.innerHTML = `
        <div class="accordion-header" id="subgroup-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}">
            <span class="subgroup-title">${subgroupName} (<span id="subgroup-count-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}">${subgroupCount}</span>)</span>
        </div>
        <div class="accordion-content hidden" id="subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}">
        </div>
    `;
    groupSection.appendChild(subgroupDiv);






    const subgroupHeader = document.getElementById(
        `subgroup-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`
    );
    const subgroupContent = document.getElementById(
        `subgroup-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`
    );

    if (!subgroupHeader || !subgroupContent) {
        // console.error(
        //    `Ошибка: не удалось найти элементы subgroupHeader или subgroupContent для подгруппы '${subgroupName}'. Проверьте структуру HTML.`
        // );
        return;
    }

    let isSubgroupExpanded = false; // Отслеживание состояния открытия/закрытия

    subgroupHeader.addEventListener('click', () => {
        // Переключаем состояние подгруппы
        subgroupContent.classList.toggle('hidden');
        isSubgroupExpanded = !subgroupContent.classList.contains('hidden');

        // Раскрываем или скрываем все ордера в подгруппе
        toggleSubgroupOrders(zoneName, groupName, subgroupName, isSubgroupExpanded);

        // Отображаем или скрываем все полигоны и метки
        toggleSubgroupObjects(zoneName, groupName, subgroupName, isSubgroupExpanded);
    });

    function toggleSubgroupOrders(zoneName, groupName, subgroupName, show) {
        const subgroup = zones[zoneName].groups[groupName].subgroups[subgroupName];
        if (!subgroup) return;

        for (let orderName in subgroup.orders) {
            const orderHeader = document.getElementById(
                `order-header-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`
            );
            const orderContent = document.getElementById(
                `order-content-${sanitizeId(zoneName)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}-${sanitizeId(orderName)}`
            );

            if (orderHeader && orderContent) {
                if (show) {
                    orderContent.classList.remove('hidden');
                    orderHeader.classList.remove('hidden');
                } else {
                    orderContent.classList.add('hidden');
                    orderHeader.classList.add('hidden');
                }
            }
        }
    }

    function toggleSubgroupObjects(zoneName, groupName, subgroupName, show) {
        const zone = zones[zoneName];
        if (!zone || !zone.groups[groupName]) return;

        const subgroup = zone.groups[groupName].subgroups[subgroupName];
        if (!subgroup) return;

        // Отображение или скрытие объектов внутри подгруппы
        subgroup.objects.forEach((obj) => {
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

        // Отображение или скрытие объектов в ордерах
        for (let orderName in subgroup.orders) {
            const orderObjects = subgroup.orders[orderName];
            orderObjects.forEach((obj) => {
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
    }



}








function generateObjectHTML(zoneName, groupName, subgroupName, orderName, objectId, title) {
    
    // console.log('generateObjectHTML called with:', {
    //     zoneName,
    //     groupName,
    //     subgroupName,
    //     orderName,
    //     objectId,
    //     title
    // });

    

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
        //    console.error(`Не удалось найти список объектов для: ${objectListId}`);
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

        // **Добавьте сортировку подгрупп здесь**
        // Получаем массив подгрупп с их именами и количеством
        const sortedSubgroups = Object.keys(group.subgroups).sort((a, b) => {
            const countA = group.subgroups[a].objects.length + Object.keys(group.subgroups[a].orders).reduce((acc, order) => acc + group.subgroups[a].orders[order].length, 0);
            const countB = group.subgroups[b].objects.length + Object.keys(group.subgroups[b].orders).reduce((acc, order) => acc + group.subgroups[b].orders[order].length, 0);
            return countB - countA; // Сортировка по убыванию
        });

        // Получаем DOM элемент, содержащий подгруппы
        const groupContent = document.getElementById(`group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
        if (groupContent) {
            // Перемещаем подгруппы в отсортированном порядке
            sortedSubgroups.forEach(subgroupName => {
                const subgroupDiv = document.getElementById(`subgroup-section-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}-${sanitizeId(subgroupName)}`);
                if (subgroupDiv) {
                    groupContent.appendChild(subgroupDiv); // Перемещаем в конец, что соответствует отсортированному порядку
                }
            });
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
        //    console.warn(`Элемент zone-header-${sanitizeId(zoneKey)} не найден. Пропускаем настройку аккордеона.`);
        return;
    }

    if (!zoneContent) {
        //    console.warn(`Элемент zone-content-${sanitizeId(zoneKey)} не найден. Аккордеон может работать некорректно.`);
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

    if (zone.polygon) {
        myMap.geoObjects.add(zone.polygon);
    }
    if (zone.label) {
        myMap.geoObjects.add(zone.label);
    }
    zone.polygonVisible = true;
}




function hideZonePolygon(zoneKey) {
    const zone = zones[zoneKey];
    if (!zone || !zone.polygonVisible) return;

    if (zone.polygon) {
        myMap.geoObjects.remove(zone.polygon);
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





// Определение функции initializeExternalForm
function initializeExternalForm(formHolder, callbackName, formId) {
    if (!formHolder) {
        console.error(`Элемент formHolder с id=${formHolder ? formHolder.id : 'undefined'} не найден.`);
        return;
    }

    // Проверяем, не был ли уже загружен скрипт для этой формы
    if (formHolder.dataset.scriptLoaded) {
        console.warn(`Скрипт для формы с id=${formId} уже загружен.`);
        return;
    }

    (function () {
        var f = callbackName,
            s = document.createElement('script');
        window[f] = function (h) {
            if (formHolder) {
                h.bind(formHolder);
            } else {
                console.error(`Элемент ${formHolder.id} не найден`);
            }
        };
        s.type = 'text/javascript';
        s.async = true;
        s.src = `https://pyrus.com/js/externalformstarter?jsonp=${f}&id=${formId}`;
        s.onload = function () {
            formHolder.dataset.scriptLoaded = true;
            console.log(`Скрипт для формы с id=${formId} успешно загружен.`);
        };
        s.onerror = function () {
            console.error(`Не удалось загрузить скрипт для формы с id=${formId}.`);
        };
        document.head.appendChild(s);
    })();
}

document.addEventListener("DOMContentLoaded", function () {
    // Получаем кнопки для открытия форм
    const formButton1 = document.getElementById('form-button1');
    const openFeedbackModalButton = document.getElementById('open-feedback-modal');

    // Получаем модальные окна и элементы внутри них
    const formPopup1 = document.getElementById('form-popup1');
    const feedbackModal = document.getElementById('feedback-modal');

    const formHolder1 = document.getElementById('formHolder1');
    const formHolder2 = document.getElementById('formHolder2');

    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeImageModalButton = document.getElementById('close-image-modal');

    // Обработчик для закрытия модальных окон формы 1
    window.closeFormPopup1 = function () {
        formPopup1.classList.add('hidden');
    };

    // Обработчик для закрытия модальных окон обратной связи (Форма 2)
    window.closeFeedbackModal = function () {
        feedbackModal.classList.add('hidden');
    };

    // Обработчик для кнопки закрытия image-modal
    if (closeImageModalButton) {
        closeImageModalButton.addEventListener('click', function () {
            imageModal.classList.add('hidden');
            modalImage.src = ''; // Очищаем изображение
        });
    }

    // Закрытие модального окна при клике вне его содержимого
    imageModal.addEventListener('click', function (event) {
        if (event.target === imageModal) {
            imageModal.classList.add('hidden');
            modalImage.src = '';
        }
    });

    // Обработчики для открытия форм
    if (formButton1) {
        formButton1.addEventListener('click', function () {
            formPopup1.classList.remove('hidden');

            // Инициализируем форму при первом открытии
            if (!form1Initialized) {
                form1Initialized = true; // Устанавливаем флаг, чтобы предотвратить повторную инициализацию
                initializeExternalForm(formHolder1, 'externalFormStarterCallback1', '1524907'); // id=1524907 для Формы 1
            }
        });
    }

    if (openFeedbackModalButton) {
        openFeedbackModalButton.addEventListener('click', function () {
            feedbackModal.classList.remove('hidden');

            // Инициализируем форму при первом открытии
            if (!form2Initialized) {
                form2Initialized = true; // Устанавливаем флаг, чтобы предотвратить повторную инициализацию
                initializeExternalForm(formHolder2, 'externalFormStarterCallback2', '1534475'); // id=1534475 для Формы 2
            }
        });
    }

    // Закрытие модальных окон при клике вне формы
    formPopup1.addEventListener('click', function (event) {
        if (event.target === formPopup1) {
            closeFormPopup1();
        }
    });

    feedbackModal.addEventListener('click', function (event) {
        if (event.target === feedbackModal) {
            closeFeedbackModal();
        }
    });

    // Дополнительные обработчики или функции можно добавить здесь
});

// Глобальные переменные для отслеживания инициализации форм
// let form1Initialized = false;
// let form2Initialized = false;

// Функция для инициализации внешней формы
function initializeExternalForm(formHolder, callbackName, formId) {
    if (!formHolder) {
        console.error(`Элемент formHolder с id=${formHolder ? formHolder.id : 'undefined'} не найден.`);
        return;
    }

    // Проверяем, не был ли уже загружен скрипт для этой формы
    if (formHolder.dataset.scriptLoaded) {
        console.warn(`Скрипт для формы с id=${formId} уже загружен.`);
        return;
    }

    (function () {
        var f = callbackName,
            s = document.createElement('script');
        window[f] = function (h) {
            if (formHolder) {
                h.bind(formHolder);
            } else {
                console.error(`Элемент ${formHolder.id} не найден`);
            }
        };
        s.type = 'text/javascript';
        s.async = true;
        s.src = `https://pyrus.com/js/externalformstarter?jsonp=${f}&id=${formId}`;
        s.onload = function () {
            formHolder.dataset.scriptLoaded = true;
            console.log(`Скрипт для формы с id=${formId} успешно загружен.`);
        };
        s.onerror = function () {
            console.error(`Не удалось загрузить скрипт для формы с id=${formId}.`);
        };
        document.head.appendChild(s);
    })();
}

// Функция генерации групп
function generateGroupHTML(zoneKey, groupName, groupLink = null) {
    const section = document.getElementById(`zone-content-${sanitizeId(zoneKey)}`);
    
    if (!section) {
        console.warn(`Секция зоны zone-content-${sanitizeId(zoneKey)} не найдена. Создайте её перед добавлением групп.`);
        return;
    }

    const groupDiv = document.createElement('div');
    groupDiv.className = 'subsection';

    // Проверяем, если ссылка есть, добавляем протокол, если его нет
    if (groupLink && !groupLink.startsWith('http://') && !groupLink.startsWith('https://')) {
        console.warn(`Ссылка "${groupLink}" не содержит протокола. Добавляю "https://".`);
        groupLink = `https://${groupLink}`;
    }

    // Специальный случай: "Предложения, жалобы" внутри "Доска объявлений"
    if (zoneKey === 'Доска объявлений' && groupName === 'Предложения, жалобы') {
        groupDiv.innerHTML = `
            <div class="accordion-header" id="group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
                <span class="category-title">${groupName}</span>
            </div>
        `;

        section.appendChild(groupDiv);

        // Добавляем обработчик клика для заголовка группы
        const groupHeader = groupDiv.querySelector(`#group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
        if (groupHeader) {
            groupHeader.addEventListener('click', (event) => {
                event.preventDefault(); // Предотвращаем любое стандартное поведение

                const modal = document.getElementById('feedback-modal');

                if (modal) {
                    // Показываем модальное окно
                    modal.classList.remove('hidden');

                    // Инициализация формы, если ещё не была инициализирована
                    if (!form2Initialized) {
                        form2Initialized = true; 
                        initializeExternalForm(formHolder2, 'externalFormStarterCallback2', '1534475'); // Передаём необходимые аргументы
                    }
                } else {
                    console.error('Модальное окно "feedback-modal" не найдено.');
                }
            });
        } else {
            console.error(`Не удалось найти заголовок группы: group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
        }

        // Добавляем обработчик для кнопки закрытия модального окна
        const closeModalButton = document.getElementById('close-feedback-modal');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => {
                const modal = document.getElementById('feedback-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        } else {
            console.error('Кнопка закрытия модального окна "close-feedback-modal" не найдена.');
        }

        return; // Прерываем выполнение, чтобы не добавлять стандартное содержимое
    }

    // Если это "Доска объявлений" и есть ссылка, создаём ссылку
    if (zoneKey === 'Доска объявлений' && groupLink) {
        groupDiv.innerHTML = `
            <a href="${groupLink}" target="_blank" class="accordion-header" id="group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
                ${groupName}
            </a>
        `;

        section.appendChild(groupDiv);
        return; // Прерываем выполнение, так как нет дополнительного содержимого
    }

    // Для остальных групп создаём стандартный аккордеон
    groupDiv.innerHTML = `
        <div class="accordion-header" id="group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">
            <span class="category-title">${groupName} (<span id="group-count-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}">0</span>)</span>
        </div>
        <div class="accordion-content hidden" id="group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}"></div>
    `;

    section.appendChild(groupDiv);

    // Проверяем существование заголовка
    const groupHeader = groupDiv.querySelector(`#group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
    if (!groupHeader) {
        console.error(`Не удалось найти заголовок группы: group-header-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
        return;
    }

    // Проверяем существование содержимого только для случаев, где оно создается
    let groupContent = null;
    if (!(zoneKey === 'Доска объявлений' && groupName === 'Предложения, жалобы')) {
        groupContent = document.getElementById(`group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
        if (!groupContent) {
            console.error(`Не удалось найти содержимое группы: group-content-${sanitizeId(zoneKey)}-${sanitizeId(groupName)}`);
            return;
        }
    }

    // Добавляем обработчик клика, если есть groupContent
    if (groupContent) {
        groupHeader.addEventListener('click', () => {
            groupContent.classList.toggle('hidden');
            const isExpanded = !groupContent.classList.contains('hidden');
            console.log(`Группа "${groupName}" в зоне "${zoneKey}" ${isExpanded ? 'открыта' : 'закрыта'}`);
            toggleGroupObjects(zoneKey, groupName, isExpanded);
        });
    }
}


// Функция для открытия модального окна с изображением
window.openImageModal = function (imageUrl) {
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


