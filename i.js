const apiKey = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm&daily=weather_code'; // OpenWeatherMap API 키
const button = document.getElementById('getWeather');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

const items = {
    "배낭": {
        description: "탐험 시 필요한 생존 장비를 담을 수 있는 가방.",
        effect: (character) => {
            console.log("배낭에서 랜덤한 서바이벌 아이템을 획득합니다.");
            const survivalItems = ["물", "음식", "텐트", "구급약품"];
            const randomItem = survivalItems[Math.floor(Math.random() * survivalItems.length)];
            console.log(`${character.name}가 ${randomItem}을(를) 얻었습니다.`);
        },
    },
    "태양 전통 복장": {
        description: "각 기후에서 생존율을 높여주는 전통 의상.",
        effect: (character, weather) => {
            if (weather === "Hot") {
                console.log("더운 날씨에서 체온을 유지합니다.");
                character.stamina += 10;
            } else if (weather === "Cold") {
                console.log("추운 날씨에서 체온을 보호를 못합니다.");
                character.stamina -= 15;
            } else if (weather === "Rainy") {
                console.log("비가오는 날씨에서 이동속도로 인해 체력이 감소합니다.");
                character.stamina -= 15;
            }else {
                console.log("적합하지 않은 날씨, 이동속도 감소.");
                character.stamina -= 20;
        }
    },
},
    "눈 전통 복장": {
        description: "각 기후에서 생존율을 높여주는 전통 의상.",
        effect: (character, weather) => {
            if (weather === "Hot") {
                console.log("더운 날씨에서 체온을 유지못합니다.");
                character.stamina -= 15;
            } else if (weather === "Cold") {
                console.log("추운 날씨에서 체온을 보호합니다.");
                character.stamina += 10;
            } else if (weather === "Rainy") {
                console.log("비가오는 날씨에서 이동속도로 인해 체력이 감소합니다.");
                character.stamina -= 15;
            }else {
                console.log("적합하지 않은 날씨, 이동속도 감소.");
                character.stamina -= 20;
        }
    },
},
    "비 전통 복장": {
        description: "각 기후에서 생존율을 높여주는 전통 의상.",
        effect: (character, weather) => {
            if (weather === "Hot") {
                console.log("더운 날씨에서 체온을 유지합니다.");
                character.stamina -= 15;
            } else if (weather === "Cold") {
                console.log("추운 날씨에서 체온을 보호합니다.");
                character.stamina -= 15;
            } else if (weather === "Rainy") {
                console.log("비와 적합하여 체력을 증가합니다.");
                character.stamina += 10;
            }else {
                console.log("적합하지 않은 날씨, 이동속도 감소.");
                character.stamina -= 20;
        }
    },
},
    "환경 진정 악기": {
        description: "날씨와 환경을 안정시켜 생존율을 높입니다.",
        effect: (character, environment) => {
            if (environment.severity > 1) {
                console.log("악기를 연주하여 환경을 진정시킵니다.");
                environment.severity = Math.max(1, environment.severity - 1);
                character.stamina += 10; // 스테미나 회복
            }
        },
    },
    "윈체스터": {
        description: "수렵과 사냥에 최적화된 무기.",
        effect: (character) => {
            console.log("사냥 성공! 잡은 동물로 음식을 준비합니다.");
            character.stamina += 20; // 스테미나 회복
            character.money += 10;  // 추가 자원 확보
        },
    },
    "생존 공구 세트": {
        description: "복잡한 생존 문제를 해결할 수 있는 다목적 도구 세트.",
        effect: (character) => {
            console.log("생존 공구를 사용하여 장비를 수리하고 방어력을 강화합니다.");
            character.defense += 10;
        },
    },
    "크리메이트 완드": {
        description: "기후를 즉시 조정할 수 있는 강력한 마법 지팡이.",
        effect: (environment) => {
            console.log("마법으로 기후를 완전히 바꿉니다!");
            environment.weather = "Sunny"; // 기후를 즉시 변경
            environment.severity = 0;      // 환경 위험 완화
        },
    },
    "랜덤 동물": {
        description: "조련 가능한 동물. 특수 능력을 제공합니다.",
        effect: (character) => {
            const animals = ["늑대", "매", "말", "곰"];
            const tamedAnimal = animals[Math.floor(Math.random() * animals.length)];
            console.log(`${character.name}가 ${tamedAnimal}를 조련했습니다.`);
            character.stamina += 10; // 동물 관리로 이점 획득
        },
    },
    "미스터리 아이템": {
        description: "알 수 없는 효과의 아이템. 결과에 따라 난이도가 바뀝니다.",
        effect: (character) => {
            const outcomes = ["운 좋게 스테미나 회복", "갑작스런 날씨 악화", "보물 발견", "함정 발동"];
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            console.log(`${character.name}가 ${randomOutcome}을(를) 경험했습니다.`);
            if (randomOutcome.includes("스테미나")) character.stamina += 20;
            else if (randomOutcome.includes("날씨")) character.stamina -= 30;
        },
    },
    "지팡이 (환경 예측)": {
        effect: (character) => {
            console.log("날씨를 예측하여 경로를 최적화합니다.");
            character.stamina += 10; // 스테미나 증가
        },
    },
    "멕가이버 칼": {
        effect: (character) => {
            console.log("다목적 칼로 방어력을 강화합니다.");
            character.defense += 5; // 방어력 증가
        },
    },
    "스테미나 약사 레시피": {
        effect: (character) => {
            console.log("약을 만들어 스테미나를 회복합니다.");
            character.stamina += 20; // 스테미나 큰 폭 회복
        },
    },
    "검형우산": {
        effect: (character, weather) => {
            if (weather === "Rainy") {
                console.log("비를 막아 이동 속도를 유지합니다.");
                character.stamina -= 5; // 비로 인한 소모 감소
            } else {
                console.log("방어를 강화합니다.");
                character.defense += 10; // 방어력 증가
            }
        },
    },
};

// OpenCage Geocoding API 키
const geocodingApiKey = '6d0e711d72d74daeb2b0bfd2a5cdfdba';

// 버튼 클릭 이벤트
button.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) {
        weatherResult.textContent = 'Please enter a valid city name.';
        return;
    }

    // OpenCage API로 도시 이름 -> 위도/경도 변환
    const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${geocodingApiKey}`;

    fetch(geocodingUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }
            return response.json();
        })
        .then(data => {
            if (data.results.length === 0) {
                throw new Error('City not found');
            }

            // 위도와 경도 추출
            const { lat, lng } = data.results[0].geometry;

            // Open-Meteo API 호출
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
            return fetch(weatherUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        })
        .then(data => {
            // 랜덤 값 생성
            const randomTemperature = (Math.random() * 40 - 10).toFixed(1); // -10°C ~ 30°C
            const randomWindspeed = (Math.random() * 30).toFixed(1); // 0 m/s ~ 30 m/s
            const randomWeatherCode = generateWeatherCode(randomTemperature); // 온도 기반 날씨 코드 생성
            const weatherDescription = getWeatherDescription(randomWeatherCode);

            // 결과 출력
            weatherResult.innerHTML = `
                <h2>Random Weather</h2>
                <p>Temperature: ${randomTemperature}°C</p>
                <p>Windspeed: ${randomWindspeed} m/s</p>
                <p>Weather: ${weatherDescription}</p>
            `;
        })
        .catch(error => {
            weatherResult.textContent = error.message;
        });
});

// 온도에 따른 날씨 코드 생성 함수
function generateWeatherCode(temperature) {
    const temp = parseFloat(temperature); // 문자열 -> 숫자 변환

    if (temp <= 0) {
        // 영하일 경우 눈만 가능
        return 5; // Snowy
    } else if (temp > 0 && temp <= 10) {
        // 0°C ~ 10°C: 비나 흐림
        return Math.random() > 0.5 ? 4 : 3; // Rainy 또는 Overcast
    } else if (temp > 10 && temp <= 25) {
        // 10°C ~ 25°C: 흐림이나 맑음
        return Math.random() > 0.5 ? 3 : 2; // Overcast 또는 Partly Cloudy
    } else {
        // 25°C 이상: 맑음만 가능
        return 1; // Clear sky
    }
}

// 날씨 코드 설명 반환 함수
function getWeatherDescription(code) {
    switch (code) {
        case 1:
            return 'Clear sky';
        case 2:
            return 'Partly cloudy';
        case 3:
            return 'Overcast';
        case 4:
            return 'Rainy';
        case 5:
            return 'Snowy';
        default:
            return 'Unknown weather';
    }
}

const characters = [
    {
      name: "고독한 생존 전문가",
      difficulty: "보통",
      species: "늑대",
      mainItem: ["지팡이 (환경 예측)", "멕가이버 칼"],
      subItem: ["가죽 갑옷", "생존 장갑"],
      ability: "날씨 변화 감지 및 경로 최적화",
      passive: "스테미나 소모율 10% 감소",
      stamina: 100,
      money: 50,
    },
    {
      name: "기후학원청소년",
      difficulty: "어려움",
      species: "인간",
      mainItem: null,
      subItem: null,
      ability: null,
      passive: "스테미나 회복량 증가",
      stamina: 80,
      money: 30,
    },
    {
      name: "약초사/치유사",
      difficulty: "보통",
      species: "인간",
      mainItem: ["스테미나 약사 레시피"],
      subItem: ["치유 허브"],
      ability: "약을 조합해 스테미나를 회복",
      passive: "허브 아이템 소모율 감소",
      stamina: 100,
      money: 60,
    },
    {
      name: "미래형 환경 전사",
      difficulty: "쉬움",
      species: "인간",
      mainItem: ["검형우산"],
      subItem: ["임시 보호 장비"],
      ability: "기후 스탯 상승",
      passive: "기후 스탯 만렙 시 모든 기후 면제",
      stamina: 100,
      money: 50,
    },
    {
      name: "여행가/탐험가",
      difficulty: "보통",
      species: "인간",
      mainItem: ["배낭"],
      subItem: ["랜덤 서바이벌 아이템"],
      ability: "랜덤 서브아이템 3회 사용 가능",
      passive: "높은 탐험 능력",
      stamina: 90,
      money: 70,
    },
    {
      name: "고대 부족 생존자",
      difficulty: "보통",
      species: "인간",
      mainItem: ["기후별 전통 복장"],
      subItem: ["소형 방어 도구"],
      ability: "기후별 복장 효과",
      passive: "잘못된 복장 착용 시 이동속도 감소 및 데미지 증가",
      stamina: 80,
      money: 30,
    },
    {
    name: "유랑 예술가",
    difficulty: "어려움",
    species: "인간",
    mainItem: ["환경 진정 악기"],
    subItem: ["악보"],
    ability: "환경을 1% 이하로 진정",
    passive: "진정 효과 적용 시 스테미나 회복",
    stamina: 70,
    money: 40,
    },
    {
    name: "사냥꾼",
    difficulty: "쉬움",
    species: "인간",
    mainItem: ["윈체스터"],
    subItem: ["수렵용 칼"],
    ability: "잡은 동물을 요리하여 스테미나 회복",
    passive: "추적 능력 증가",
    stamina: 100,
    money: 60,
    },
    {
    name: "생존 수리공",
    difficulty: "쉬움",
    species: "인간",
    mainItem: ["생존 공구 세트"],
    subItem: ["플렉시드 멀티툴", "플렉시드 스패너", "플렉시드 와이어레스"],
    ability: "기후 면역 공사 가능",
    passive: "수리 속도 증가",
    stamina: 85,
    money: 80,
    },
    {
    name: "마법사",
    difficulty: "치트키",
    species: "인간",
    mainItem: ["크리메이트 완드"],
    subItem: ["마법 책"],
    ability: "기후 즉시 변경",
    passive: "재사용 대기 시간 없음",
    stamina: 999,
    money: 999,
    },
    {
    name: "동물 조련사",
    difficulty: "보통",
    species: "인간",
    mainItem: ["랜덤 동물"],
    subItem: ["동물 먹이"],
    ability: "동물 능력 적용",
    passive: "동물 관리 효과 증가",
    stamina: 80,
    money: 50,
    },
    {
    name: "망명자/추방자",
    difficulty: "???",
    species: "인간",
    mainItem: ["미스터리 아이템"],
    subItem: ["변화의 석", "저주의 석"],
    ability: "아이템 결과에 따라 난이도 변경",
    assive: "높은 불확실성",
    stamina: 70,
    money: 20,
    }
      
  ];
  

  const weatherEffects = (weather, character) => {
    let staminaDrain = 10; // 기본 소모량
  
    // 날씨에 따라 스테미나 소모량 변화
    if (weather.temperature > 35) {
      staminaDrain += 10; // 더위로 인한 추가 소모
      console.log("더운 날씨로 스테미나 추가 소모!");
    } else if (weather.temperature < 0) {
      staminaDrain += 15; // 추위로 인한 추가 소모
      console.log("추운 날씨로 스테미나 추가 소모!");
    }
  
    if (weather.windspeed > 15) {
      staminaDrain += 5; // 강풍으로 인해 소모 증가
      console.log("강풍으로 스테미나 소모 증가!");
    }
  
    // 캐릭터 패시브 반영
    if (character.passive.includes("스테미나 소모율 10% 감소")) {
      staminaDrain *= 0.9; // 감소율 적용
    }
  
    // 스테미나 감소
    character.stamina -= Math.ceil(staminaDrain);
    if (character.stamina <= 0) {
      console.log(`${character.name}은(는) 스테미나가 부족하여 생존 실패!`);
    }
  };

  
  const trade = (character, item, price) => {
    if (character.money >= price) {
      character.money -= price;
      console.log(`${item}를 구매했습니다! 남은 돈: ${character.money}`);
    } else {
      console.log("돈이 부족합니다.");
    }
  };
  
  const itemsForSale = [
    { name: "빵", price: 10, staminaRestore: 20 },
    { name: "물", price: 5, staminaRestore: 10 },
    { name: "생존 도구", price: 30, staminaRestore: 50 },
  ];
  
  // 음식 구매 예시
  const buyFood = (character, food) => {
    const item = itemsForSale.find((i) => i.name === food);
    if (item) {
      trade(character, item.name, item.price);
      character.stamina += item.staminaRestore;
      console.log(`${food}를 사용하여 스테미나를 ${item.staminaRestore} 회복했습니다!`);
    }
  };

  function startGame(characterName) {
    selectedCharacter = characters.find((char) => char.name === characterName);

    // 캐릭터 정보 출력
    if (selectedCharacter) {
        document.getElementById("character-selection").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        document.getElementById("inventory-list").innerHTML = selectedCharacter.mainItem
            ? selectedCharacter.mainItem.map(item => `<li>${item}</li>`).join('')
            : '<li>아이템 없음</li>';

        console.log(`${selectedCharacter.name} 선택됨!`);
    } else {
        console.error("선택한 캐릭터를 찾을 수 없습니다.");
    }
}


function endTurn() {
    if (!selectedCharacter) return;

    // 랜덤 날씨 값 생성
    const randomWeatherCode = generateWeatherCode((Math.random() * 40 - 10).toFixed(1));
    const weatherDescription = getWeatherDescription(randomWeatherCode);

    console.log(`현재 날씨: ${weatherDescription}`);
    
    // 날씨에 따른 체력 소모
    const staminaLoss = randomWeatherCode === 5 ? 20 : 10; // 눈이 내릴 경우 추가 소모
    selectedCharacter.stamina -= staminaLoss;

    // 특정 조건에서 체력 회복
    if (randomWeatherCode === 2) { // 예: 맑은 날씨일 경우 체력 회복
        const recovery = 60; // 회복량
        selectedCharacter.stamina = Math.min(1000, selectedCharacter.stamina + recovery); // 최대 100을 넘지 않도록 제한
        console.log(`맑은 날씨로 인해 체력이 ${recovery}만큼 회복되었습니다.`);
    }

    // 체력 업데이트
    document.getElementById("stamina-fill").style.width = `${selectedCharacter.stamina}%`;

    // 체력이 0 이하일 경우 게임 오버 처리
    if (selectedCharacter.stamina <= 0) {
        alert("스테미나가 모두 소모되었습니다. 게임 오버!");
        location.reload();
    } else {
        console.log(`${selectedCharacter.name}의 남은 스테미나: ${selectedCharacter.stamina}`);
    }
};


function useItem(itemName, character, weather = null) {
    if (items[itemName]) {
        items[itemName].effect(character, weather);
        console.log(`${character.name}가 ${itemName}을(를) 사용했습니다.`);
    } else {
        console.log("해당 아이템은 사용할 수 없습니다.");
    }
};

function interactWithEnvironment(character, environment) {
    console.log(`${character.name}가 아이템을 사용합니다.`);
    items[character.mainItem].effect(character, environment.weather);
    if (character.ability) character.ability(character, environment);
    console.log(`현재 스테미나: ${character.stamina}`);
};

let currentStamina = 100; // 초기 체력 (0~100)
const staminaBar = document.getElementById("stamina-fill");

document.getElementById("stamina-fill").addEventListener("click", () => {
  currentStamina = Math.min(100, currentStamina + 10); // 체력을 최대 100까지 회복
  updateStaminaBar();
});

function updateStaminaBar() {
  staminaBar.style.width = currentStamina + "%";
}

// 초기 업데이트
updateStaminaBar();