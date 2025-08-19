import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useUI } from '../contexts/UIContext'
import './Cart.css'

const Cart = () => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const { showNotification } = useUI()
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')} CLP`
  }

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      showNotification({
        type: 'info',
        title: 'Producto eliminado',
        message: 'El producto ha sido eliminado del carrito'
      })
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: number, itemName: string) => {
    removeFromCart(itemId)
    showNotification({
      type: 'info',
      title: 'Producto eliminado',
      message: `${itemName} ha sido eliminado del carrito`
    })
  }

  const handleClearCart = () => {
    clearCart()
    showNotification({
      type: 'info',
      title: 'Carrito vaciado',
      message: 'Todos los productos han sido eliminados del carrito'
    })
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Simular proceso de checkout
    setTimeout(() => {
      showNotification({
        type: 'success',
        title: '¡Pedido procesado!',
        message: 'Tu pedido ha sido enviado exitosamente. Te contactaremos pronto.'
      })
      clearCart()
      setIsProcessing(false)
    }, 2000)
  }

  if (state.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1 className="page-title h2">Carrito de Compras</h1>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-content">
              <span className="material-icons empty-cart-icon" aria-hidden="true">shopping_cart</span>
              <h2 className="empty-title">Tu carrito está vacío</h2>
              <p className="empty-description">
                Explora nuestro catálogo y agrega productos para comenzar tu compra
              </p>
              <a href="/" className="btn btn-primary">
                <span className="material-icons" aria-hidden="true">store</span>
                Ver Catálogo
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="page-title h2">Carrito de Compras</h1>
          <div className="cart-summary-header">
            <span className="cart-count">{state.totalItems} productos</span>
            <button 
              className="btn btn-secondary clear-cart-btn"
              onClick={handleClearCart}
              aria-label="Vaciar carrito completamente"
            >
              <span className="material-icons" aria-hidden="true">delete_sweep</span>
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <h2 className="section-title p1-medium">Productos en tu carrito</h2>
            </div>

            <div className="cart-items-list">
              {state.items.map(item => (
                <article key={item.id} className="cart-item">
                  <div className="item-image">
                    <div className="image-placeholder" role="img" aria-label={`Imagen de ${item.name}`}>
                      <span className="material-icons" aria-hidden="true">image</span>
                    </div>
                  </div>

                  <div className="item-details">
                    <h3 className="item-name p1-medium">{item.name}</h3>
                    <p className="item-sku l1" aria-label={`SKU: ${item.sku}`}>
                      {item.sku}
                    </p>
                    <div className="item-category" aria-label={`Categoría: ${item.category}`}>
                      <span className="material-icons" aria-hidden="true">category</span>
                      <span className="l1">{item.category}</span>
                    </div>
                    <div className="item-price">
                      <span className="price-label l1">Precio unitario:</span>
                      <span className="unit-price p1-medium">{formatPrice(item.unitPrice)}</span>
                    </div>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <label htmlFor={`quantity-${item.id}`} className="quantity-label l1">
                        Cantidad:
                      </label>
                      <div className="quantity-input-group" role="group" aria-label={`Controles de cantidad para ${item.name}`}>
                        <button 
                          className="quantity-btn decrease"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          aria-label={`Disminuir cantidad de ${item.name}`}
                          disabled={item.quantity <= 1}
                        >
                          <span className="material-icons" aria-hidden="true">remove</span>
                        </button>
                        <input
                          id={`quantity-${item.id}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="quantity-input"
                          min="1"
                          max={item.stock}
                          aria-label={`Cantidad de ${item.name}`}
                        />
                        <button 
                          className="quantity-btn increase"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          disabled={item.quantity >= item.stock}
                        >
                          <span className="material-icons" aria-hidden="true">add</span>
                        </button>
                      </div>
                      {item.stock <= 10 && (
                        <p className="stock-warning l1" role="status" aria-live="polite">
                          Solo quedan {item.stock} unidades
                        </p>
                      )}
                    </div>

                    <div className="item-total">
                      <span className="total-label l1">Subtotal:</span>
                      <span className="total-price h3">{formatPrice(item.totalPrice)}</span>
                    </div>

                    <button 
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      aria-label={`Eliminar ${item.name} del carrito`}
                    >
                      <span className="material-icons" aria-hidden="true">delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="cart-sidebar" role="complementary" aria-labelledby="order-summary-title">
            <div className="order-summary">
              <h2 id="order-summary-title" className="summary-title p1-medium">Resumen del pedido</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label l1">Subtotal ({state.totalItems} productos):</span>
                  <span className="summary-value p1">{formatPrice(state.totalPrice)}</span>
                </div>
                
                <div className="summary-row">
                  <span className="summary-label l1">Envío:</span>
                  <span className="summary-value p1">A consultar</span>
                </div>
                
                <div className="summary-row total-row">
                  <span className="summary-label p1-medium">Total estimado:</span>
                  <span className="summary-value h3">{formatPrice(state.totalPrice)}</span>
                </div>
              </div>

              <div className="checkout-section">
                <button 
                  className={`btn btn-primary checkout-btn ${isProcessing ? 'processing' : ''}`}
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  aria-describedby="checkout-help"
                >
                  {isProcessing ? (
                    <>
                      <span className="processing-spinner" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span className="material-icons" aria-hidden="true">shopping_bag</span>
                      Procesar Pedido
                    </>
                  )}
                </button>
                <p id="checkout-help" className="checkout-help l1">
                  Te contactaremos para confirmar detalles y coordinar el envío
                </p>
              </div>

              <div className="continue-shopping">
                <a href="/" className="btn btn-secondary">
                  <span className="material-icons" aria-hidden="true">arrow_back</span>
                  Seguir comprando
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Cart
