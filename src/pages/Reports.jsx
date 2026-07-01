import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import { authHeader } from '../utils/auth';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement);

export default function Reports() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const hueRef = useRef(0);
  const [speed, setSpeed] = useState(1);
  const [palette, setPalette] = useState('rainbow');
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if(!canvasRef.current) return;

    // if a Chart already exists for this canvas (maybe from HMR or StrictMode), destroy it
    const existing = Chart.getChart(canvasRef.current);
    if(existing){
      try{ existing.destroy(); }catch(e){ /* ignore */ }
    }

    // Use horizontal bar chart (Power BI-like) for a non-round stylish chart
    const data = {
      labels: ['Revenue', 'Leads', 'Conversion'],
      datasets: [
        {
          label: 'Metrics',
          data: [1500000, 1250, 67],
          backgroundColor: [
            'hsl(260 85% 55%)',
            'hsl(160 85% 45%)',
            'hsl(40 85% 50%)'
          ],
          borderRadius: 12,
          barThickness: 34,
          borderSkipped: false
        }
      ]
    };

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(15,23,42,0.06)' }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });

    let rafId;
    function animate() {
      const inc = (speed || 0) * 0.6;
      hueRef.current = (hueRef.current + inc) % 360;
      const next = getPaletteColors(palette, hueRef.current);
      // apply colors; for bar chart use solid colours per bar
      chartRef.current.data.datasets[0].backgroundColor = next;
      chartRef.current.update('none');
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      try{
        // destroy any chart tied to this canvas
        const c = Chart.getChart(canvasRef.current);
        if(c) c.destroy();
      }catch(e){/* ignore */}
      chartRef.current = null;
    };
  }, [speed, palette]);

  const lineCanvasRef = useRef(null);
  const lineChartRef = useRef(null);

  // fetch snapshot and update chart data
  useEffect(()=>{
    async function fetchSnapshot(){
      try{
        const resp = await axios.get('http://localhost:4000/analytics/snapshot', { headers: authHeader() });
        const snap = resp.data?.snapshot ?? resp.data;
        if(!snap) return;
        if(chartRef.current){
          chartRef.current.data.datasets[0].data = [snap.revenue, snap.leads, Number(snap.conversionRate)];
          chartRef.current.update();
        }
        setError(null);
      }catch(err){
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Unable to fetch metrics');
      }
    }

    fetchSnapshot();
    pollRef.current = setInterval(fetchSnapshot, 15000);
    return ()=> clearInterval(pollRef.current);
  }, []);

  // line chart setup (green/black theme)
  useEffect(()=>{
    if(!lineCanvasRef.current) return;

    const existing = Chart.getChart(lineCanvasRef.current);
    if(existing) existing.destroy();

    lineChartRef.current = new Chart(lineCanvasRef.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Revenue over time',
          data: [],
          borderColor: 'rgba(34,197,94,1)',
          backgroundColor: function(context){
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0,0,0,200);
            gradient.addColorStop(0,'rgba(34,197,94,0.28)');
            gradient.addColorStop(1,'rgba(34,197,94,0.02)');
            return gradient;
          },
          tension: 0.25,
          pointRadius: 3,
          pointBackgroundColor: '#10b981',
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        responsive:true,
        maintainAspectRatio:false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)'}, ticks: { color: '#9ca3af' } },
          y: { grid: { color: 'rgba(255,255,255,0.04)'}, ticks: { color: '#9ca3af' } }
        },
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        }
      }
    });

    return ()=>{
      try{ const c = Chart.getChart(lineCanvasRef.current); if(c) c.destroy(); }catch(e){}
      lineChartRef.current = null;
    };
  }, []);

  function getPaletteColors(kind, hue){
    if(kind === 'pastel'){
      return [
        `hsl(${(20 + hue) % 360} 60% 65%)`,
        `hsl(${(140 + hue) % 360} 60% 65%)`,
        `hsl(${(260 + hue) % 360} 60% 65%)`
      ];
    }
    if(kind === 'cool'){
      return [
        `hsl(${(200 + hue) % 360} 75% 45%)`,
        `hsl(${(260 + hue) % 360} 75% 42%)`,
        `hsl(${(320 + hue) % 360} 75% 42%)`
      ];
    }
    // rainbow
    return [
      `hsl(${(0 + hue) % 360} 85% 48%)`,
      `hsl(${(120 + hue) % 360} 85% 48%)`,
      `hsl(${(240 + hue) % 360} 85% 48%)`
    ];
  }

  return (
    <div className="main-container">
      <Sidebar />

      <div className="dashboard">
        <Navbar />

        <div className="page-inner">
          <h1 className="page-title">Reports</h1>

          <div className="reports-controls">
            <div className="control">
              <label>Animation Speed: <strong>{speed}</strong></label>
              <input type="range" min="0" max="5" step="0.25" value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} />
            </div>
            <div className="control">
              <label>Palette</label>
              <select value={palette} onChange={(e)=>setPalette(e.target.value)}>
                <option value="rainbow">Rainbow</option>
                <option value="pastel">Pastel</option>
                <option value="cool">Cool</option>
              </select>
            </div>
          </div>

          {error && <div className="reports-error">{error}</div>}

          <div className="reports-chart-card">
            <div className="chart-canvas-wrapper">
              <canvas ref={canvasRef} />
            </div>
          </div>

          <div className="line-chart-card">
            <div className="line-canvas-wrapper">
              <canvas ref={lineCanvasRef} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}