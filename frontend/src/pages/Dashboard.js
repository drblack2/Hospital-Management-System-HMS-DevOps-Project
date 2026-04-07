import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { getAllPatients } from '../api';
import './Dashboard.css';

const COLORS = ['#2563eb', '#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

function Dashboard({ user }) {
  const [statsData, setStatsData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getAllPatients();

      const patients = response.data;

      // Calculate stats
      const totalPatients = patients.length;
      const malePatients = patients.filter(p => p.gender === 'Male').length;
      const femalePatients = patients.filter(p => p.gender === 'Female').length;
      const admittedPatients = patients.filter(p => p.status === 'admitted').length;

      // Prepare weekly trend data
      const weeksData = generateWeeklyData(patients);

      // Prepare gender distribution
      const genderData = [
        { name: 'Male', value: malePatients, percentage: ((malePatients / totalPatients) * 100).toFixed(1) },
        { name: 'Female', value: femalePatients, percentage: ((femalePatients / totalPatients) * 100).toFixed(1) },
      ].filter(d => d.value > 0);

      setStatsData({
        totalPatients,
        malePatients,
        femalePatients,
        admittedPatients,
        dischargedPatients: totalPatients - admittedPatients,
      });

      setChartData({
        weeklyTrend: weeksData,
        genderDistribution: genderData,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const generateWeeklyData = (patients) => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, index) => ({
      name: week,
      patients: Math.floor(patients.length / 4) + Math.floor(Math.random() * 5),
      appointments: Math.floor(Math.random() * 15),
    }));
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, {user?.firstName}! 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={statsData?.totalPatients || 0}
          color="#2563eb"
          trend="+12%"
        />
        <StatCard
          icon={TrendingUp}
          label="Admitted"
          value={statsData?.admittedPatients || 0}
          color="#10b981"
          trend="+5%"
        />
        <StatCard
          icon={Calendar}
          label="Discharged"
          value={statsData?.dischargedPatients || 0}
          color="#4f46e5"
          trend="+8%"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value="₹45,231"
          color="#f59e0b"
          trend="+23%"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Weekly Trend Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Patient Trend</h3>
            <span className="chart-period">This Month</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData?.weeklyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-tertiary)" />
              <YAxis stroke="var(--text-tertiary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 5 }}
                activeDot={{ r: 7 }}
                name="Patients"
              />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
                name="Appointments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Gender Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData?.genderDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData?.genderDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Stats */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Department Performance</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { dept: 'Cardiology', revenue: 24000, patients: 40 },
              { dept: 'Orthopedics', revenue: 21000, patients: 30 },
              { dept: 'Neurology', revenue: 29000, patients: 24 },
              { dept: 'Pediatrics', revenue: 20000, patients: 20 },
              { dept: 'Surgery', revenue: 32000, patients: 35 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="dept" stroke="var(--text-tertiary)" />
            <YAxis stroke="var(--text-tertiary)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#2563eb" name="Revenue (₹)" />
            <Bar dataKey="patients" fill="#10b981" name="Patients" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span>Add Patient</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📅</span>
            <span>Schedule Appointment</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">💊</span>
            <span>Add Prescription</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
          <Icon size={24} />
        </div>
        <span className="stat-trend" style={{ color: color }}>
          {trend}
        </span>
      </div>
      <div className="stat-body">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

export default Dashboard;
