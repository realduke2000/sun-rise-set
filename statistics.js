// 工具函数
function timeToNumber(t){
  if(!t) return 0;
  const parts = t.split(':').map(Number);
  return parts[0] + parts[1]/60 + (parts[2]||0)/3600;
}

// ---------------- 每日图表 ----------------
const dailyLabels = sunData.map(d=>d.date);
const sunriseDaily = sunData.map(d=>timeToNumber(d.sunrise));
const sunsetDaily  = sunData.map(d=>timeToNumber(d.sunset));
const dayLengthDaily = sunData.map(d=>timeToNumber(d.day_length));

new Chart(document.getElementById('dailyChart'), {
  data:{
    labels: dailyLabels,
    datasets:[
      {
        type:'line',
        label:'日出',
        data:sunriseDaily,
        borderColor:'orange',
        fill:false,
        tension:0.2,
        pointRadius:0,
        datalabels:{
          align:'end',
          anchor:'end',
          font:{ size:30, weight:'bold'},
          color:'orange',
          display: function(context){
            // 只在折线中间点显示 label
            const midIndex = Math.floor(context.dataset.data.length / 2);
            return context.dataIndex === midIndex;
          },
          formatter: function(value, context){
            return context.dataset.label; // 显示中文“日出”“日落”
          }
        }
      },
      {
        type:'line',
        label:'日落',
        data:sunsetDaily,
        borderColor:'blue',
        fill:false,
        tension:0.2,
        pointRadius:0,
        datalabels:{
          align:'end',
          anchor:'end',
          font:{ size:30, weight:'bold'},
          color:'blue',
          display: function(context){
            const midIndex = Math.floor(context.dataset.data.length / 2);
            return context.dataIndex === midIndex;
          },
          formatter: function(value, context){
            return context.dataset.label; // 显示中文“日出”“日落”
          }
        }
      },
      {
        type:'bar',
        label:'昼长',
        data:dayLengthDaily,
        backgroundColor:'rgba(0,128,0,0.3)',
        datalabels:{ display:false }
      }
    ]
  },
  options:{
    responsive:true,
    interaction:{mode:'index', intersect:false},
    plugins:{
      legend:{ labels:{ font:{ size:18 } } },
      datalabels:{}
    },
    scales:{
      x:{
        title:{ display:true, text:'日期', font:{ size:18 } },
        ticks:{
          autoSkip:false,
          font:{ size:14 },
          callback:function(val,index){
            const day = parseInt(dailyLabels[index].slice(-2));
            if(day===1 || day===15) return dailyLabels[index];
            return '';
          },
          maxRotation:45,
          minRotation:45
        }
      },
      y:{
        title:{ display:true, text:'小时', font:{ size:18 } },
        ticks:{ font:{ size:14 } },
        min:0,
        max:24
      }
    }
  },
  plugins:[ChartDataLabels]
});

// ---------------- 节气图表 ----------------
const solarTermsData = sunData.filter(d=>d.solar_term);
const solarLabels = solarTermsData.map(d=>d.solar_term);
const sunriseTerms = solarTermsData.map(d=>timeToNumber(d.sunrise));
const sunsetTerms  = solarTermsData.map(d=>timeToNumber(d.sunset));
const dayLengthTerms = solarTermsData.map(d=>timeToNumber(d.day_length));

new Chart(document.getElementById('solarTermsChart'), {
  data:{
    labels: solarLabels,
    datasets:[
      {
        type:'line',
        label:'日出',
        data:sunriseTerms,
        borderColor:'orange',
        fill:false,
        tension:0.2,
        pointRadius:0,
        datalabels:{
          align:'end',
          anchor:'end',
          font:{ size:30, weight:'bold'},
          color:'orange',
          display: function(context){
            const midIndex = Math.floor(context.dataset.data.length / 2);
            return context.dataIndex === midIndex;
          },
          formatter: function(value, context){
            return context.dataset.label; // 显示中文“日出”“日落”
          }
        }
      },
      {
        type:'line',
        label:'日落',
        data:sunsetTerms,
        borderColor:'blue',
        fill:false,
        tension:0.2,
        pointRadius:0,
        datalabels:{
          align:'end',
          anchor:'end',
          font:{ size:30, weight:'bold'},
          color:'blue',
          display: function(context){
            const midIndex = Math.floor(context.dataset.data.length / 2);
            return context.dataIndex === midIndex;
          },
          formatter: function(value, context){
            return context.dataset.label; // 显示中文“日出”“日落”
          }
        }
      },
      {
        type:'bar',
        label:'昼长',
        data:dayLengthTerms,
        backgroundColor:'rgba(0,128,0,0.3)',
        datalabels:{ display:false }
      }
    ]
  },
  options:{
    responsive:true,
    interaction:{mode:'index', intersect:false},
    plugins:{
      legend:{ labels:{ font:{ size:18 } } },
      datalabels:{}
    },
    scales:{
      x:{ title:{ display:true, text:'节气', font:{ size:18 } }, ticks:{ font:{ size:14 } } },
      y:{ title:{ display:true, text:'小时', font:{ size:18 } }, ticks:{ font:{ size:14 } }, min:0, max:24 }
    }
  },
  plugins:[ChartDataLabels]
});
