import React from 'react';
import styles from './CartPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { CartItem } from '../../components/cart/CartItem';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { useCart } from '../../../infrastructure/context/CartContext';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout') => void;
}

const FREE_SHIPPING_THRESHOLD = 500;

export const CartPage: React.FC<Props> = ({ currentPage = 'cart', onNavigate }) => {
  const { items, summary, totalItems, updateQuantity, removeFromCart } = useCart();

  const handleCheckout = () => {
    onNavigate?.('checkout');
  };

  const isEmpty = items.length === 0;

  return (
    <div className={styles.layout}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className={styles.main}>
        <h1 className={styles.title}>Tu Carrito ({totalItems})</h1>

        <div className={styles.content}>
          <div className={styles.itemsSection}>
            {isEmpty ? (
              <div className={styles.emptyCart}>
                <span className="material-symbols-outlined">shopping_cart</span>
                <p>Tu carrito está vacío</p>
                <button
                  className={styles.continueBtn}
                  onClick={() => onNavigate?.('home')}
                  type="button"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <>
                <div className={styles.itemsList}>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {summary.shipping === 0 && (
                  <div className={styles.freeShipping}>
                    <span className="material-symbols-outlined">local_shipping</span>
                    <p>Envío gratuito disponible para pedidos superiores a ${FREE_SHIPPING_THRESHOLD}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {!isEmpty && (
            <OrderSummary
              summary={summary}
              onCheckout={handleCheckout}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
