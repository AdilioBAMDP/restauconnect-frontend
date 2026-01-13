import OrdersPage from './List';

// Page consultative pour le restaurant : aucune action, juste consultation
export default function OrdersRestaurant() {
  return <OrdersPage supplierMode={false} />;
}
