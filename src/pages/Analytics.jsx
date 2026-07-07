import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config/api";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend, DoughnutController);

export default function Analytics(){
  const activeUsersChartRef = useRef(null);
  const trafficSourcesRef = useRef(null);
  const conversionFunnelRef = useRef(null);
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
    const socket = io(API_BASE_URL);
    socket.on("welcome", ()=>{ });

    socket.on("analytics:update", (payload)=>{
      setStats(payload);
      setDataPoints(prev=>{
        const next = [...prev, { t: Date.now(), value: payload.activeUsers }];
        return next.slice(-30);
      });
    });

    return ()=> socket.disconnect();
  },[]);

  // Active Users Line Chart
  useEffect(()=>{
    if(!activeUsersChartRef.current) return;
    const ctx = activeUsersChartRef.current.getContext('2d');
    
    if(!chartInstance.current){
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Active Users',
            data: [],
            borderColor: '#7c3aed',
            backgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) return null;
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(124,58,237,0.3)');
              gradient.addColorStop(1, 'rgba(124,58,237,0.02)');
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#7c3aed',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 750 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              cornerRadius: 8,
              titleFont: { size: 13, weight: '700' },
              bodyFont: { size: 12 }
            }
          },
          scales: {
            x: { 
              grid: { display: false },
              ticks: { color: '#9ca3af', font: { size: 11, weight: '600' } }
            },
            y: { 
              beginAtZero: true, 
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { color: '#9ca3af', font: { size: 11, weight: '600' } }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
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

  // Traffic Sources Doughnut Chart
  useEffect(() => {
    if (trafficSourcesRef.current) {
      const existing = Chart.getChart(trafficSourcesRef.current);
      if (existing) existing.destroy();

      new Chart(trafficSourcesRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Direct', 'Organic Search', 'Social Media', 'Referral', 'Email'],
          datasets: [{
            data: [35, 28, 20, 12, 5],
            backgroundColor: [
              '#7c3aed',
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ec4899'
            ],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  size: 12,
                  weight: '600'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              cornerRadius: 8
            }
          }
        }
      });
    }
  }, []);

  // Conversion Funnel Bar Chart
  useEffect(() => {
    if (conversionFunnelRef.current) {
      const existing = Chart.getChart(conversionFunnelRef.current);
      if (existing) existing.destroy();

      new Chart(conversionFunnelRef.current, {
        type: 'bar',
        data: {
          labels: ['Visitors', 'Leads', 'Qualified', 'Proposals', 'Closed'],
          datasets: [{
            label: 'Conversion',
            data: [5000, 2500, 1200, 600, 320],
            backgroundColor: [
              '#7c3aed',
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444'
            ],
            borderRadius: 8,
            barThickness: 50
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              cornerRadius: 8
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0,0,0,0.05)'
              },
              ticks: {
                font: {
                  size: 11,
                  weight: '600'
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 11,
                  weight: '600'
                }
              }
            }
          }
        }
      });
    }
  }, []);

  return (
    <div className="main-container">
      <Sidebar />
      <div className="dashboard">
        <Navbar />

        {/* Welcome Section */}
        <div className="analytics-header">
          <div>
            <h1 className="analytics-title">Advanced Analytics 📊</h1>
            <p className="analytics-subtitle">Real-time insights and performance metrics</p>
          </div>
          <div className="analytics-badge">
            <span className="analytics-badge-dot"></span>
            Live Data
          </div>
        </div>

        {/* Stats Cards */}
        <div className="analytics-stats-grid">
          <div className="analytics-stat-card analytics-stat-purple">
            <div className="analytics-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="analytics-stat-content">
              <p className="analytics-stat-label">Active Users</p>
              <h3 className="analytics-stat-value">{stats.activeUsers}</h3>
              <span className="analytics-stat-change">Live now</span>
            </div>
          </div>

          <div className="analytics-stat-card analytics-stat-blue">
            <div className="analytics-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div className="analytics-stat-content">
              <p className="analytics-stat-label">Total Leads</p>
              <h3 className="analytics-stat-value">{stats.leads}</h3>
              <span className="analytics-stat-change up">↑ 12.5% growth</span>
            </div>
          </div>

          <div className="analytics-stat-card analytics-stat-green">
            <div className="analytics-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="analytics-stat-content">
              <p className="analytics-stat-label">Conversion Rate</p>
              <h3 className="analytics-stat-value">{stats.conversionRate}%</h3>
              <span className="analytics-stat-change up">↑ 3.2% increase</span>
            </div>
          </div>

          <div className="analytics-stat-card analytics-stat-orange">
            <div className="analytics-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="analytics-stat-content">
              <p className="analytics-stat-label">Revenue</p>
              <h3 className="analytics-stat-value">₹{stats.revenue.toLocaleString()}</h3>
              <span className="analytics-stat-change up">↑ 18.7% revenue</span>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="analytics-main-chart">
          <div className="analytics-chart-header">
            <div>
              <h3 className="analytics-chart-title">Active Users Trend</h3>
              <p className="analytics-chart-subtitle">Real-time user activity monitoring</p>
            </div>
            <div className="analytics-timestamp">
              Updated: {stats.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : 'waiting...'}
            </div>
          </div>
          <div className="analytics-chart-wrapper analytics-chart-large">
            <canvas ref={activeUsersChartRef} />
          </div>
        </div>

        {/* Bottom Charts Grid */}
        <div className="analytics-bottom-grid">
          {/* Traffic Sources */}
          <div className="analytics-chart-card">
            <h3 className="analytics-chart-title">Traffic Sources</h3>
            <div className="analytics-chart-wrapper">
              <canvas ref={trafficSourcesRef} />
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="analytics-chart-card">
            <h3 className="analytics-chart-title">Conversion Funnel</h3>
            <div className="analytics-chart-wrapper">
              <canvas ref={conversionFunnelRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
