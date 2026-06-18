import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ActivityContext } from '../context/ActivityContext';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressPage = () => {
  const navigate = useNavigate();
  const { activities: list, stats } = useContext(ActivityContext);

  const totalCO2e = stats?.totalCO2e || 0;
  const treesNeeded = (totalCO2e / 25).toFixed(1);

  // Calculate streak
  const getStreak = () => {
    if (list.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);
    while (true) {
      const hasActivity = list.some(a => {
        const actDate = new Date(a.date);
        actDate.setHours(0, 0, 0, 0);
        return actDate.getTime() === currentDate.getTime();
      });
      if (!hasActivity) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      if (streak > 365) break;
    }
    return streak;
  };
  const streak = getStreak();

  // Weekly progress for Chart
  const getWeeklyData = () => {
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - i);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 1);

      const weekActivities = list.filter(a => {
        const actDate = new Date(a.date);
        return actDate >= startOfWeek && actDate < endOfWeek;
      });

      const total = weekActivities.reduce((sum, a) => sum + (a.co2e || 0), 0);
      labels.push(startOfWeek.toLocaleDateString('en-US', { weekday: 'short' }));
      data.push(total.toFixed(2));
    }
    return { labels, data };
  };

  const weeklyData = getWeeklyData();

  const lineChartData = {
    labels: weeklyData.labels,
    datasets: [
      {
        fill: true,
        label: 'Emissions (kg CO₂e)',
        data: weeklyData.data,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Type breakdown for Doughnut
  const getTypeData = () => {
    const dataObj = stats?.byType || {};
    return {
      labels: Object.keys(dataObj).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
      datasets: [
        {
          data: Object.values(dataObj),
          backgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#8e44ad'],
          borderWidth: 0,
        },
      ],
    };
  };

  const doughnutData = getTypeData();

  // Month over month
  const getMonthlyData = () => {
    const labels = [];
    const data = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthActivities = list.filter(a => {
        const actDate = new Date(a.date);
        return actDate >= monthStart && actDate <= monthEnd;
      });

      const total = monthActivities.reduce((sum, a) => sum + (a.co2e || 0), 0);
      labels.push(monthNames[date.getMonth()]);
      data.push(total.toFixed(1));
    }
    return { labels, data };
  };

  const monthlyData = getMonthlyData();

  const barChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Monthly Emissions',
        data: monthlyData.data,
        backgroundColor: '#3498db',
        borderRadius: 4,
      },
    ],
  };

  const currentMonthCO2e = monthlyData.data[monthlyData.data.length - 1];
  const lastMonthCO2e = monthlyData.data[monthlyData.data.length - 2];
  const percentageChange = lastMonthCO2e > 0 
    ? (((currentMonthCO2e - lastMonthCO2e) / lastMonthCO2e) * 100).toFixed(1)
    : 0;

  // Smart Insights
  const getInsights = () => {
    const insights = [];
    const highest = Object.entries(stats?.byType || {}).sort((a, b) => b[1] - a[1])[0];
    
    if (highest && totalCO2e > 0) {
      const [category, amount] = highest;
      const percentage = ((amount / totalCO2e) * 100).toFixed(0);
      
      if (category === 'travel') {
        insights.push({ icon: '🚗', title: 'Transportation Impact', desc: `${percentage}% of your footprint comes from travel. Try cycling or public transport!`, color: '#e74c3c' });
      } else if (category === 'energy') {
        insights.push({ icon: '⚡', title: 'Energy Usage', desc: `${percentage}% from energy. Switch to LED bulbs and unplug devices!`, color: '#f39c12' });
      } else if (category === 'diet') {
        insights.push({ icon: '🍽️', title: 'Food Choices', desc: `${percentage}% from diet. Try more plant-based meals!`, color: '#27ae60' });
      }
    }

    if (streak > 0) {
      insights.push({ icon: '🔥', title: 'Streak Alert', desc: `You're on a ${streak}-day streak! Don't break it!`, color: '#e67e22' });
    }

    if (list.length === 0) {
      insights.push({ icon: '💡', title: 'Get Started', desc: 'Log your first activity to see personalized insights!', color: '#3498db' });
    }
    return insights;
  };
  const insights = getInsights();

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>📊 Progress & Insights</h1>
      </div>

      <div className="stats-grid">
        <div className="glass-card text-center">
          <div className="stat-label">Current Streak</div>
          <div className="stat-value text-gradient">{streak} <span style={{fontSize:'1rem', color:'var(--color-text-muted)'}}>days</span></div>
        </div>
        <div className="glass-card text-center">
          <div className="stat-label">Trees to Offset</div>
          <div className="stat-value" style={{color: '#27ae60'}}>{treesNeeded}</div>
          <p style={{fontSize:'0.8rem', color:'var(--color-text-muted)'}}>1 tree absorbs ~25 kg/year</p>
        </div>
        <div className="glass-card text-center">
          <div className="stat-label">vs Last Month</div>
          <div className="stat-value" style={{color: percentageChange <= 0 ? '#27ae60' : '#e74c3c'}}>
            {percentageChange <= 0 ? '↓' : '↑'} {Math.abs(percentageChange)}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>Last 7 Days</h3>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>Emissions by Category</h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#fff' } } } }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>Monthly Trends</h3>
          <div style={{ height: '300px' }}>
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>💡 AI Smart Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {insights.map((insight, i) => (
              <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: `4px solid ${insight.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{insight.icon}</span>
                  <h4 style={{ margin: 0 }}>{insight.title}</h4>
                </div>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;