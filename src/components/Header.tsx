import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useUI } from '../contexts/UIContext'
import './Header.css'

const Header = () => {
  const { state } = useCart()
  const { showNotification } = useUI()
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">
              <span className="material-icons">store</span>
            </div>
            <span className="logo-text p1-medium">SWAG Challenge</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link l1">
              <span className="material-icons">home</span>
              Catálogo
            </Link>
            <button className="nav-link l1" onClick={() => {
              if (state.totalItems > 0) {
                showNotification({
                  type: 'info',
                  title: 'Resumen del carrito',
                  message: `${state.totalItems} productos - Total: $${state.totalPrice.toLocaleString('es-CL')} CLP`
                })
              } else {
                showNotification({
                  type: 'info',
                  title: 'Carrito vacío',
                  message: 'Agrega productos al carrito para comenzar tu compra'
                })
              }
            }}>
              <span className="material-icons">shopping_cart</span>
              Carrito ({state.totalItems})
            </button>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button className="btn btn-secondary cta1">
              <span className="material-icons">person</span>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header