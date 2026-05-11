import React, { useState } from 'react';
import styles from './CheckoutPage.module.css';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { ShippingForm } from './components/ShippingForm';
import { PaymentSection } from './components/PaymentSection';
import { CheckoutOrderSummary } from './components/CheckoutOrderSummary';
import { useCart } from '../../../infrastructure/context/CartContext';
import { useAuthContext } from '../../../infrastructure/context/AuthContext';
import { checkoutService, type PaymentRequest } from '../../../infrastructure/api/checkoutService';
import {
  type ShippingData,
  type PaymentMethod,
  type CardData,
  initialShippingData,
  initialCardData,
} from '../../../domain/checkout/types';

interface Props {
  currentPage?: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout';
  onNavigate?: (page: 'home' | 'dumbbells' | 'bars' | 'clothing' | 'machines' | 'supplements' | 'pharmacology' | 'account' | 'register' | 'cart' | 'checkout') => void;
}

interface FormErrors {
  shipping?: string;
  payment?: string;
  general?: string;
}

export const CheckoutPage: React.FC<Props> = ({ currentPage = 'checkout', onNavigate }) => {
  const { items, summary, clearCart } = useCart();
  const { isAuthenticated } = useAuthContext();

  const [shippingData, setShippingData] = useState<ShippingData>(initialShippingData);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tarjeta');
  const [cardData, setCardData] = useState<CardData>(initialCardData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const handleShippingChange = (field: keyof ShippingData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    if (errors.shipping) setErrors((prev) => ({ ...prev, shipping: undefined }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (errors.payment) setErrors((prev) => ({ ...prev, payment: undefined }));
  };

  const handleCardDataChange = (field: keyof CardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Valida que los campos de envío estén completos
   */
  const validateShipping = (): boolean => {
    const { firstName, lastName, address, city, postalCode } = shippingData;
    
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setErrors((prev) => ({ ...prev, shipping: 'Todos los campos de envío son requeridos' }));
      return false;
    }
    
    return true;
  };

  /**
   * Valida los datos del pago según el método seleccionado
   */
  const validatePayment = (): boolean => {
    if (paymentMethod === 'tarjeta') {
      if (!cardData.number.trim() || !cardData.expiry.trim() || !cardData.cvv.trim()) {
        setErrors((prev) => ({ ...prev, payment: 'Todos los datos de la tarjeta son requeridos' }));
        return false;
      }
    }
    return true;
  };

  /**
   * Valida que el carrito no esté vacío
   */
  const validateCart = (): boolean => {
    if (items.length === 0) {
      setErrors((prev) => ({ ...prev, general: 'Tu carrito está vacío. Agrega productos antes de pagar.' }));
      return false;
    }
    return true;
  };

  /**
   * Valida que el usuario esté autenticado
   */
  const validateAuth = (): boolean => {
    if (!isAuthenticated) {
      setErrors((prev) => ({ ...prev, general: 'Debes iniciar sesión para completar tu compra.' }));
      return false;
    }
    return true;
  };

  /**
   * Maneja la descarga de la factura PDF
   */
  const handleDownloadInvoice = async () => {
    if (!successOrderId) return;

    setIsDownloadingInvoice(true);
    setInvoiceError(null);

    try {
      const result = await checkoutService.downloadInvoice(successOrderId);

      if (result.error || !result.blob) {
        setInvoiceError(result.error || 'Error al descargar la factura');
        return;
      }

      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_order_${successOrderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar factura:', error);
      setInvoiceError('Error al descargar la factura. Por favor intenta de nuevo.');
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  /**
   * Maneja el proceso de pago completo:
   * 1. Crear orden en backend
   * 2. Procesar pago
   * 3. Limpiar carrito y mostrar éxito
   */
  const handleCheckout = async () => {
    setErrors({});
    setSuccessMessage(null);

    if (!validateCart() || !validateAuth() || !validateShipping() || !validatePayment()) {
      return;
    }

    setIsProcessing(true);

    try {
      const createOrderResult = await checkoutService.createOrder(items);

      if (createOrderResult.error || !createOrderResult.data) {
        setErrors({ general: createOrderResult.error || 'Error al crear la orden' });
        setIsProcessing(false);
        return;
      }

      const orderId = createOrderResult.data.id;
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentData: PaymentRequest = {
        payment_method: paymentMethod,
        transaction_id: transactionId,
      };

      const paymentResult = await checkoutService.processPayment(orderId, paymentData);

      if (paymentResult.error || !paymentResult.data) {
        setErrors({ general: paymentResult.error || 'Error al procesar el pago' });
        setIsProcessing(false);
        return;
      }

      clearCart();
      setSuccessOrderId(orderId);
      setSuccessMessage('¡Pedido realizado con éxito! Tu orden ha sido procesada.');

      setTimeout(() => {
        onNavigate?.('home');
      }, 180000);

    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      setErrors({ general: 'Ocurrió un error inesperado. Por favor intenta de nuevo.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const isEmpty = items.length === 0 && !successMessage;

  if (isEmpty) {
    return (
      <div className={styles.layout}>
        <Header currentPage={currentPage} onNavigate={onNavigate} />
        <main className={styles.main}>
          <div className={styles.emptyState}>
            <span className="material-symbols-outlined">shopping_cart</span>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos antes de proceder al checkout</p>
            <button
              className={styles.continueBtn}
              onClick={() => onNavigate?.('home')}
              type="button"
            >
              Continuar Comprando
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Finalizar Compra</h1>
          <p className={styles.subtitle}>
            Completa tus datos para procesar el envío de tu equipamiento profesional.
          </p>
        </div>

        {errors.general && (
          <div className={styles.errorBanner}>
            <span className="material-symbols-outlined">error</span>
            <p>{errors.general}</p>
          </div>
        )}

        {successMessage && (
          <div className={styles.successBanner}>
            <span className="material-symbols-outlined">check_circle</span>
            <p>{successMessage}</p>
            {successOrderId && (
              <button
                className={styles.downloadInvoiceBtn}
                onClick={handleDownloadInvoice}
                disabled={isDownloadingInvoice}
                type="button"
              >
                {isDownloadingInvoice ? (
                  <>
                    <span className={styles.spinner}></span>
                    Descargando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">download</span>
                    Descargar Factura
                  </>
                )}
              </button>
            )}
            {invoiceError && (
              <p className={styles.invoiceError}>{invoiceError}</p>
            )}
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.formSection}>
            <ShippingForm 
              data={shippingData} 
              onChange={handleShippingChange}
              error={errors.shipping}
            />
            <PaymentSection
              paymentMethod={paymentMethod}
              cardData={cardData}
              onPaymentMethodChange={handlePaymentMethodChange}
              onCardDataChange={handleCardDataChange}
              error={errors.payment}
            />
          </div>

          <CheckoutOrderSummary
            items={items}
            summary={summary}
            onCheckout={handleCheckout}
            disabled={isProcessing}
            isProcessing={isProcessing}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};