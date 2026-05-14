// ======= 工具函数 =======
// HH:MM -> 小时数
function timeToNumber(t){
  const [h,m] = t.split(':').map(Number);
  return h + m/60;
}

// HH:MM:SS -> 小时数
function dayLengthToNumber(t){
  const [h,m,s] = t.split(':').map(Number);
  return h + m/60 + s/3600;
}

// ======= 区域1：每月1日折线 =======
const monthlyData = sunData.filter(d => d.date.endsWith('-01')); // 每月1号
const monthlyLabels = monthlyData.map(d=>d.date);
const sunriseMonthly = monthlyData.map(d=>timeToNumber(d.sunrise));
const sunsetMonthly = monthlyData.map(d=>timeToNumber(d.sunset));

new Chart(document.getElementById('monthlyChart'), {
  type: 'line',
  data: {
    labels: monthlyLabels,
    datasets:[
      {label:'日出', data:sunriseMonthly, borderColor:'orange', fill:false, tension:0.2},
      {label:'日落', data:sunsetMonthly, borderColor:'blue', fill:false, tension:0.2}
    ]
  },
  options:{
    responsive:true,
    scales:{
      y:{min:0,max:24,title:{display:true,text:'小时'}} 
    }
  }
});

// ======= 区域2：24节气图 =======
// 筛选有 solar_term 的条目
const solarTermData = sunData.filter(d => d.solar_term && d.solar_term.trim() !== '');
const solarLabels = solarTermData.map(d=>d.solar_term);
const sunriseTerms = solarTermData.map(d=>timeToNumber(d.sunrise));
const sunsetTerms = solarTermData.map(d=>timeToNumber(d.sunset));
const dayLength = solarTermData.map(d=>dayLengthToNumber(d.day_length));

new Chart(document.getElementById('solarTermsChart'), {
  data:{
    labels: solarLabels,
    datasets:[
      {type:'line', label:'日出', data:sunriseTerms, borderColor:'orange', fill:false, tension:0.2},
      {type:'line', label:'日落', data:sunsetTerms, borderColor:'blue', fill:false, tension:0.2},
      {type:'bar', label:'昼长', data:dayLength, backgroundColor:'rgba(0,128,0,0.3)'}
    ]
  },
  options:{
    responsive:true,
    scales:{
      y:{min:0,max:24,title:{display:true,text:'小时'}}
    }
  },
});