// 示例数据，可替换为全年数据
// const sunData = [];
// import { sunData } from './data.js';


const tbody = document.querySelector("#sun-table tbody");
const status = document.getElementById("status-container");
const refreshBtn = document.getElementById("refresh-btn");

let index = 0;
let dotCount = 0;
let dotInterval, rowInterval;

// 添加一行数据，并自动滚动到最后
function addRow() {
  if(index >= sunData.length) {
    clearInterval(rowInterval);
    clearInterval(dotInterval);
    status.textContent = "数据抓取完成";
    refreshBtn.style.display = "none"; // 隐藏齿轮
    return;
  }
  const row = sunData[index];
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row.date}</td>
    <td><img class="sun-icon" src="sunrise.jpeg" alt="日出"> ${row.sunrise}</td>
    <td><img class="sun-icon" src="sunset.jpg" alt="日落"> ${row.sunset}</td>
    <td>${row.day_length}</td>
  `;
  tbody.appendChild(tr);
  index++;
  // 自动滚动到最后
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// 循环更新“数据抓取中...”后面的点
function startDotAnimation() {
  dotInterval = setInterval(() => {
    dotCount = (dotCount % 3) + 1;
    status.textContent = "数据抓取中" + ".".repeat(dotCount);
  }, 500);
}

function startDataLoad() {
  tbody.innerHTML = "";
  index = 0;
  refreshBtn.style.display = "block";
  startDotAnimation();
  rowInterval = setInterval(addRow, 30);
}

// 初始加载
startDataLoad();

// 点击刷新按钮重新加载
refreshBtn.addEventListener("click", () => {
  clearInterval(dotInterval);
  clearInterval(rowInterval);
  startDataLoad();
}); 