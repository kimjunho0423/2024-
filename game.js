// 초기 상태 설정
let stamina = 100; // 스테미나 100%
let money = 50; // 50 코인
let weather = "맑음"; // 초기 날씨 상태

// DOM 요소
const staminaFill = document.getElementById("stamina-fill");
const moneyDisplay = document.getElementById("money");
const weatherStatus = document.getElementById("weather-status");

// 스테미나 업데이트 함수
function updateStamina(amount) {
  stamina = Math.max(0, Math.min(100, stamina + amount));
  staminaFill.style.width = stamina + "%";
}

// 돈 업데이트 함수
function updateMoney(amount) {
  money = Math.max(0, money + amount);
  moneyDisplay.textContent = money;
}

// 날씨 업데이트 함수
function updateWeather(newWeather) {
  weather = newWeather;
  weatherStatus.textContent = "현재 날씨: " + weather;
}

document.getElementById("buy-food").addEventListener("click", () => {
  if (money >= 10) {
    updateMoney(-10); // 10 코인 차감
    updateStamina(+30); // 스테미나 30 회복
  } else {
    alert("코인이 부족합니다!");
  }
});

// 날씨 데이터 시뮬레이션
setInterval(() => {
  const weatherOptions = ["맑음", "비", "눈", "폭풍"];
  const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  updateWeather(randomWeather);
}, 5000); // 5초마다 날씨 변경