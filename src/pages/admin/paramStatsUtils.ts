// Ce fichier utilitaire fournit des fonctions pour générer des données de test pour les graphiques et stats de paramètres.

export function generateRandomHistory(key: string, count = 8) {
  const users = ['admin1', 'admin2', 'superadmin', 'ops', 'tech'];
  const now = Date.now();
  let value = Math.floor(Math.random() * 100);
  return Array.from({ length: count }).map((_, i) => {
    const oldValue = value;
    value += Math.floor(Math.random() * 10 - 5);
    return {
      date: new Date(now - i * 86400000).toISOString(),
      oldValue,
      newValue: value,
      user: users[Math.floor(Math.random() * users.length)]
    };
  }).reverse();
}

export function generateChartData(history) {
  return history.map(h => ({
    date: h.date.slice(0, 10),
    value: typeof h.newValue === 'number' ? h.newValue : 0
  }));
}
