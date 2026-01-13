import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Activity, Eye, Download, Calendar } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

export const AdminAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('users');
  const [userStats, setUserStats] = useState<any[]>([]);
  const [revenueStats, setRevenueStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/admin/users'),
      axios.get('/api/admin/transactions')
    ])
      .then(([usersRes, txRes]) => {
        setUserStats(usersRes.data.data || []);
        setRevenueStats(txRes.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des statistiques…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Préparer les données pour le graphique utilisateurs par semaine
  const usersByWeek = Array(4).fill(0);
  userStats.forEach((u: any) => {
    if (u.createdAt) {
      const week = Math.max(0, Math.min(3, Math.floor((new Date().getTime() - new Date(u.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000))));
      usersByWeek[3 - week]++;
    }
  });
  const usersData = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    datasets: [
      {
        label: 'Nouveaux utilisateurs',
        data: usersByWeek,
        backgroundColor: 'rgba(59,130,246,0.7)'
      }
    ]
  };

  // Préparer les données pour le graphique revenus par semaine
  const revenueByWeek = Array(4).fill(0);
  revenueStats.forEach((t: any) => {
    if (t.createdAt && t.amount) {
      const week = Math.max(0, Math.min(3, Math.floor((new Date().getTime() - new Date(t.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000))));
      revenueByWeek[3 - week] += t.amount;
    }
  });
  const revenueData = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    datasets: [
      {
        label: 'Revenus (€)',
        data: revenueByWeek,
        backgroundColor: 'rgba(34,197,94,0.7)'
      }
    ]
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Analytics Plateforme</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Nouveaux utilisateurs (4 semaines)</h3>
          <Bar data={usersData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Revenus par semaine (€)</h3>
          <Bar data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
}
