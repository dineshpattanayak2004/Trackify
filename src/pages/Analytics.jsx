import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

export default function Analytics(){
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [stats, setStats] = useState({
    activeUsers: 0,
    leads: 0,
    conversionRate: '0.00',
    revenue: 0,
    timestamp: ''
  });

  useEffect(()=>{
    const socket = io("http://localhost:4000");
    socket.on("welcome", ()=>{});

    socket.on("analytics:update", (payload)=>{
      setStats(payload);
      setDataPoints(prev=>{
        const next = [...prev, { t: Date.now(), value: payload.activeUsers }];
        return next.slice(-30);
      });
    });

    return ()=> socket.disconnect();
  },[]);

  useEffect(()=>{
    if(!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if(!chartInstance.current){
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Active Users',
            data: [],
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124,58,237,0.18)',
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#7c3aed'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 250 },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(15,23,42,0.08)' } }
          }
        }
      });
    }

    const labels = dataPoints.map((d)=>new Date(d.t).toLocaleTimeString());
    const dataset = dataPoints.map(d=>d.value);
    chartInstance.current.data.labels = labels;
    chartInstance.current.data.datasets[0].data = dataset;
    chartInstance.current.update();
  },[dataPoints]);

  return (
    <div className="main-container">
      <Sidebar />
      <div className="dashboard">
        <Navbar />

        <h2 className="dashboard-title">Real-time Analytics</h2>

        <div className="card-grid">
          <div className="stat-card">
            <h3>Active Users</h3>
            <h2 className="card-number">{stats.activeUsers}</h2>
            <p className="text-muted">Live audience count</p>
          </div>
          <div className="stat-card">
            <h3>Leads</h3>
            <h2 className="card-number">{stats.leads}</h2>
            <p className="text-muted">New lead volume</p>
          </div>
          <div className="stat-card">
            <h3>Conversion</h3>
            <h2 className="card-number">{stats.conversionRate}%</h2>
            <p className="text-muted">Conversion rate</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <h2 className="card-number">₹{stats.revenue.toLocaleString()}</h2>
            <p className="text-muted">Estimated revenue</p>
          </div>
        </div>

        <div className="stat-card" style={{ minHeight: 380, paddingBottom: 24 }}>
          <div className="analytics-chart-header">
            <h3 className="mb-3">Active Users Trend</h3>
            <p className="text-muted">Updated at {stats.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : 'waiting...'}</p>
          </div>
          <div className="analytics-chart-wrapper">
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
