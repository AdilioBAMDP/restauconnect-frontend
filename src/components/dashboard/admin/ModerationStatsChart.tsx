import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ModerationStatsChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/applications/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des statistiques…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  const labels = ['Approuvées', 'Rejetées', 'En attente'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Candidatures',
        data: [stats.approved, stats.rejected, stats.pending],
        backgroundColor: [
          'rgba(34,197,94,0.7)',
          'rgba(239,68,68,0.7)',
          'rgba(251,191,36,0.7)'
        ]
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Statistiques de modération (candidatures)' },
    },
  };
  return <Bar data={data} options={options} />;
};

export default ModerationStatsChart;
