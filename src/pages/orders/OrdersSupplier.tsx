import React from 'react';
import OrdersPage from './List';

// Page fournisseur : actions de confirmation/refus visibles
export default function OrdersSupplier() {
  // On pourra ajouter des props ou context spécifiques fournisseur ici si besoin
  return <OrdersPage supplierMode={true} />;
}
