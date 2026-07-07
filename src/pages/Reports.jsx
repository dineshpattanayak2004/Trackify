import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import { authHeader } from '../utils/auth';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement);

export default function Reports() {
  const leadsBySourceRef = useRef(null);
  const opportunitiesByStageRef = useRef(null);
  const tasksOverviewRef = useRef(null);
  const [stats, setStats] = useState({
    totalLeads: 1250,
    totalOpportunities: 320,
    wonOpportunities: 85,
    revenue: 2450000
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Leads by Source - Donut Chart
    if (leadsBySourceRef.current) {
      const existing = Chart.getChart(leadsBySourceRef.current);
      if (existing) existing.destroy();

      new Chart(leadsBySourceRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Website', 'Referral', 'Social Media', 'Email', 'Others'],
          datasets: [{
            data: [45, 25, 15, 10, 5],
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
          cutout: '70%',
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

    // Opportunities by Stage - Bar Chart
    if (opportunitiesByStageRef.current) {
      const existing = Chart.getChart(opportunitiesByStageRef.current);
      if (existing) existing.destroy();

      new Chart(opportunitiesByStageRef.current, {
        type: 'bar',
        data: {
          labels: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
          datasets: [{
            label: 'Opportunities',
            data: [1250, 750, 450, 200, 85],
            backgroundColor: [
              '#7c3aed',
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444'
            ],
            borderRadius: 8,
            barThickness: 40
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

    // Tasks Overview - Doughnut Chart
    if (tasksOverviewRef.current) {
      const existing = Chart.getChart(tasksOverviewRef.current);
      if (existing) existing.destroy();

      new Chart(tasksOverviewRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Pending'],
          datasets: [{
            data: [65, 20, 15],
            backgroundColor: [
              '#10b981',
              '#3b82f6',
              '#f59e0b'
            ],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
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

  // Fetch stats from API
  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await axios.get('http://localhost:4000/analytics/snapshot', { headers: authHeader() });
        const snap = resp.data?.snapshot ?? resp.data;
        if (snap) {
          setStats({
            totalLeads: snap.leads || 1250,
            totalOpportunities: 320,
            wonOpportunities: snap.conversionRate || 85,
            revenue: snap.revenue || 2450000
          });
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Unable to fetch metrics');
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-container">
      <Sidebar />

      <div className="dashboard">
        <Navbar />

        <div className="page-inner">
          {/* Welcome Section */}
          <div className="reports-header">
            <div>
              <h1 className="reports-title">Welcome to Trackify 👋</h1>
              <p className="reports-subtitle">Here's what's happening with your business today.</p>
            </div>
            <div className="reports-date-range">
              <span className="date-icon">📅</span>
              <span>May 20 - May 26, 2024</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="reports-stats-grid">
            <div className="report-stat-card report-stat-purple">
              <div className="report-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="report-stat-content">
                <p className="report-stat-label">Total Leads</p>
                <h3 className="report-stat-value">{stats.totalLeads.toLocaleString()}</h3>
                <span className="report-stat-change up">↑ 18.2% from last week</span>
              </div>
            </div>

            <div className="report-stat-card report-stat-blue">
              <div className="report-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div className="report-stat-content">
                <p className="report-stat-label">Total Opportunities</p>
                <h3 className="report-stat-value">{stats.totalOpportunities}</h3>
                <span className="report-stat-change up">↑ 12.5% from last week</span>
              </div>
            </div>

            <div className="report-stat-card report-stat-green">
              <div className="report-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="report-stat-content">
                <p className="report-stat-label">Won Opportunities</p>
                <h3 className="report-stat-value">{stats.wonOpportunities}</h3>
                <span className="report-stat-change up">↑ 8.4% from last week</span>
              </div>
            </div>

            <div className="report-stat-card report-stat-orange">
              <div className="report-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="report-stat-content">
                <p className="report-stat-label">Revenue</p>
                <h3 className="report-stat-value">₹{(stats.revenue / 100000).toFixed(2)}M</h3>
                <span className="report-stat-change up">↑ 15.7% from last week</span>
              </div>
            </div>
          </div>

          {error && <div className="reports-error">{error}</div>}

          {/* Charts Grid */}
          <div className="reports-charts-grid">
            {/* Sales Pipeline */}
            <div className="report-chart-card report-chart-large">
              <h3 className="report-chart-title">Sales Pipeline</h3>
              <div className="report-chart-wrapper">
                <canvas ref={leadsBySourceRef} />
              </div>
            </div>

            {/* Recent Activities */}
            <div className="report-activity-card">
              <div className="report-activity-header">
                <h3 className="report-chart-title">Recent Activities</h3>
                <a href="#" className="view-all-link">View All</a>
              </div>
              <div className="report-activity-list">
                <div className="activity-item">
                  <div className="activity-icon activity-icon-purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">New lead added</p>
                    <span className="activity-subtext">Rohit Sharma from ABC Corp</span>
                  </div>
                  <span className="activity-time">10:30 AM</span>
                </div>

                <div className="activity-item">
                  <div className="activity-icon activity-icon-blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">Email campaign sent</p>
                    <span className="activity-subtext">Summer Sale Campaign</span>
                  </div>
                  <span className="activity-time">Yesterday</span>
                </div>

                <div className="activity-item">
                  <div className="activity-icon activity-icon-green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">Opportunity won</p>
                    <span className="activity-subtext">Tech Solutions deal closed</span>
                  </div>
                  <span className="activity-time">May 18</span>
                </div>

                <div className="activity-item">
                  <div className="activity-icon activity-icon-orange">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">Meeting scheduled</p>
                    <span className="activity-subtext">Demo with XYZ Pvt. Ltd.</span>
                  </div>
                  <span className="activity-time">May 18</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Charts */}
          <div className="reports-bottom-grid">
            {/* Leads by Source */}
            <div className="report-chart-card">
              <h3 className="report-chart-title">Leads by Source</h3>
              <div className="report-chart-wrapper report-chart-small">
                <canvas ref={leadsBySourceRef} />
              </div>
            </div>

            {/* Opportunities by Stage */}
            <div className="report-chart-card">
              <h3 className="report-chart-title">Opportunities by Stage</h3>
              <div className="report-chart-wrapper report-chart-small">
                <canvas ref={opportunitiesByStageRef} />
              </div>
            </div>

            {/* Tasks Overview */}
            <div className="report-chart-card">
              <h3 className="report-chart-title">Tasks Overview</h3>
              <div className="report-chart-wrapper report-chart-small">
                <canvas ref={tasksOverviewRef} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
