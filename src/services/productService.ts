const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

export const createProduct = async (productData: any) => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création du produit');
  }

  return response.json();
};

export const importProductsBulk = async (file: File) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/products/bulk`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'import des produits');
  }

  return response.json();
};
