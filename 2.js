const timeSelection = document.getElementById('timeSelection');
const gameScreen = document.getElementById('gameScreen');
const player = document.getElementById('player');
const startButton = document.getElementById('startButton');
const timeSelect = document.getElementById('timeSelect');
const timerDisplay = document.getElementById('timerDisplay');

// 初始化玩家位置
let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

// 儲存上一位置來計算速度
let previousX = playerX;
let previousY = playerY;
let playerSpeed = 0;

// 儲存威力們
const willies = [];

// 添加威力們
const createWilly = () => {
  const willy = document.createElement('div');
  willy.classList.add('willy');

  // 隨機選擇威力圖片
  const willyImages = ['W21.jpg', 'W22.jpg', 'W23.jpg'];
  const randomImage = willyImages[Math.floor(Math.random() * willyImages.length)];
  willy.style.backgroundImage = `url('${randomImage}')`;

  willy.style.left = Math.random() * window.innerWidth + 'px';
  willy.style.top = Math.random() * window.innerHeight + 'px';
  gameScreen.appendChild(willy);
  willies.push(willy);
};

// 切換至遊戲頁面
startButton.addEventListener('click', () => {
  const time = parseInt(timeSelect.value);

  // 隱藏時間選擇頁面，顯示遊戲頁面
  timeSelection.style.display = 'none';
  gameScreen.style.display = 'block';

  // 初始化威力們
  for (let i = 0; i < 20; i++) {
    createWilly();
  }

  // 倒數計時
  let timer = time;
  timerDisplay.textContent = `剩餘時間：${timer}秒`;
  const interval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `剩餘時間：${timer}秒`;

    // 檢查是否所有威力消失
    if (willies.length === 0) {
      clearInterval(interval);
      alert('恭喜！玩家獲勝！');
      window.location.reload(); // 返回選擇頁面
    }

    // 檢查時間是否到
    if (timer <= 0) {
      clearInterval(interval);
      if (willies.length > 0) {
        alert('時間到！玩家失敗！');
      } else {
        alert('恭喜！玩家獲勝！');
      }
      window.location.reload(); // 返回選擇頁面
    }
  }, 1000);
});

// 更新玩家位置並計算速度
document.addEventListener('mousemove', (event) => {
  playerX = event.clientX;
  playerY = event.clientY;

  // 更新玩家位置
  player.style.left = playerX + 'px';
  player.style.top = playerY + 'px';

  // 計算玩家速度
  const deltaX = playerX - previousX;
  const deltaY = playerY - previousY;
  playerSpeed = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  previousX = playerX;
  previousY = playerY;

  // 威力逃跑或消失邏輯
  willies.forEach((willy, index) => {
    const willyX = willy.offsetLeft + 25;
    const willyY = willy.offsetTop + 25;
    const distance = Math.hypot(willyX - playerX, willyY - playerY);

    if (distance < 100) { // 偵測玩家靠近範圍
      const angle = Math.atan2(willyY - playerY, willyX - playerX);
      let newLeft = willy.offsetLeft + Math.cos(angle) * 20;
      let newTop = willy.offsetTop + Math.sin(angle) * 20;

      // 偵測牆角並改變方向
      if (newLeft <= 0 || newLeft >= window.innerWidth - 50 ||
          newTop <= 0 || newTop >= window.innerHeight - 50) {
        setTimeout(() => {
          const escapeAngle = Math.random() * 2 * Math.PI; // 隨機方向
          newLeft = willy.offsetLeft + Math.cos(escapeAngle) * 50;
          newTop = willy.offsetTop + Math.sin(escapeAngle) * 50;

          willy.style.left = Math.min(Math.max(newLeft, 0), window.innerWidth - 50) + 'px';
          willy.style.top = Math.min(Math.max(newTop, 0), window.innerHeight - 50) + 'px';
        }, 300);
      } else {
        willy.style.left = newLeft + 'px';
        willy.style.top = newTop + 'px';
      }

      // 若玩家速度過快並撞上威力，威力消失
      if (playerSpeed > 15 && distance < 50) {
        willy.remove();
        willies.splice(index, 1); // 從列表移除
      }
    }
  });
});
