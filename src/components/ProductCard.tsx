import { Link } from 'react-router-dom'
import { Product } from '../types/Product'
import { useCart } from '../contexts/CartContext'
import { useUI } from '../contexts/UIContext'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart()
  const { showNotification } = useUI()
  // Handle product status display
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active l1">Disponible</span>
      case 'inactive':
        return <span className="status-badge status-inactive l1">No disponible</span>
      case 'pending':
        return <span className="status-badge status-pending l1">Pendiente</span>
      default:
        return null
    }
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')} CLP`
  }

  // Check stock availability
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="stock-status out-of-stock l1">Sin stock</span>
    } else if (stock < 10) {
      return <span className="stock-status low-stock l1">Stock bajo ({stock})</span>
    }
    return <span className="stock-status in-stock l1">{stock} disponibles</span>
  }

  // Calculate discount percentage
  const getDiscountPrice = () => {
    if (product.priceBreaks && product.priceBreaks.length > 1) {
      const bestDiscount = product.priceBreaks[product.priceBreaks.length - 1]
      return bestDiscount.price
    }
    return null
  }

  return (
    <article 
      className="product-card"
      role="article"
      aria-labelledby={`product-name-${product.id}`}
    >
      <Link 
        to={`/product/${product.id}`} 
        className="product-link"
        aria-label={`Ver detalles de ${product.name}`}
      >
        {/* Product Image */}
        <div className="product-image" role="img" aria-label={`Imagen de ${product.name}`}>
          <div className="image-placeholder">
            <span className="material-icons" aria-hidden="true">image</span>
          </div>
          
          {/* Status Badge */}
          <div className="product-status">
            {getStatusBadge(product.status)}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name p1-medium" id={`product-name-${product.id}`}>
              {product.name}
            </h3>
            <p className="product-sku l1" aria-label={`SKU: ${product.sku}`}>
              {product.sku}
            </p>
          </div>

          <div className="product-details">
            <div className="product-category" aria-label={`Categoría: ${product.category}`}>
              <span className="material-icons" aria-hidden="true">category</span>
              <span className="l1">{product.category}</span>
            </div>
            
            <div role="status" aria-live="polite">
              {getStockStatus(product.stock)}
            </div>
          </div>

          {/* Features - Bug: displays all features without limit */}
          {product.features && (
            <div className="product-features">
              {product.features.map((feature, index) => (
                <span key={index} className="feature-tag l1">{feature}</span>
              ))}
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <span className="colors-label l1">{product.colors.length} colores:</span>
              <div className="colors-preview">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div key={index} className="color-dot" title={color}></div>
                ))}
                {product.colors.length > 3 && (
                  <span className="more-colors l1">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Footer */}
      <div className="product-footer">
        <div className="price-section">
          <div className="current-price p1-medium">{formatPrice(product.basePrice)}</div>
          {getDiscountPrice() && (
            <div className="discount-info">
              <span className="discount-price l1">{formatPrice(getDiscountPrice()!)}</span>
              <span className="discount-label l1">desde 50 unidades</span>
            </div>
          )}
        </div>

        <div className="card-actions" role="group" aria-label="Acciones del producto">
          <button 
            className="btn btn-secondary l1"
            onClick={(e) => {
              e.preventDefault()
              showNotification({
                type: 'info',
                title: 'Función en desarrollo',
                message: 'La función de cotización estará disponible próximamente'
              })
            }}
            aria-label={`Solicitar cotización para ${product.name}`}
          >
            <span className="material-icons" aria-hidden="true">calculate</span>
            Cotizar
          </button>
          <button 
            className="btn btn-primary l1"
            onClick={(e) => {
              e.preventDefault()
              if (product.status === 'active' && product.stock > 0) {
                addToCart(product, 1)
                showNotification({
                  type: 'success',
                  title: 'Producto agregado',
                  message: `${product.name} ha sido agregado al carrito`
                })
              } else {
                showNotification({
                  type: 'error',
                  title: 'Producto no disponible',
                  message: 'Este producto no está disponible en este momento'
                })
              }
            }}
            disabled={product.status !== 'active' || product.stock === 0}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <span className="material-icons" aria-hidden="true">add_shopping_cart</span>
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard