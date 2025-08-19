import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useUI } from '../contexts/UIContext'
import './QuoteSimulator.css'

interface CompanyData {
  name: string
  rut: string
  email: string
  phone: string
  address: string
  contactPerson: string
}

const QuoteSimulator = () => {
  const { state } = useCart()
  const { setLoading, showNotification } = useUI()
  const [isOpen, setIsOpen] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    rut: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: ''
  })

  const calculateFinalPricing = () => {
    let totalItems = 0
    let subtotal = 0
    let totalDiscount = 0

    state.items.forEach(item => {
      totalItems += item.quantity
      subtotal += item.totalPrice
      
      const originalPrice = item.basePrice * item.quantity
      const discount = originalPrice - item.totalPrice
      totalDiscount += discount
    })

    let additionalDiscount = 0
    if (totalItems >= 500) {
      additionalDiscount = subtotal * 0.05
    } else if (totalItems >= 200) {
      additionalDiscount = subtotal * 0.03
    } else if (totalItems >= 100) {
      additionalDiscount = subtotal * 0.02
    }

    const finalTotal = subtotal - additionalDiscount
    const totalDiscountAmount = totalDiscount + additionalDiscount

    return {
      totalItems,
      subtotal,
      totalDiscountAmount,
      additionalDiscount,
      finalTotal,
      discountPercentage: ((totalDiscountAmount / (subtotal + totalDiscount)) * 100)
    }
  }

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')} CLP`
  }

  const generateQuoteSummary = () => {
    const pricing = calculateFinalPricing()
    const currentDate = new Date().toLocaleDateString('es-CL')
    
    const summary = `
COTIZACIÓN SWAG CHILE
Fecha: ${currentDate}
Válida por 30 días

DATOS DE LA EMPRESA:
Empresa: ${companyData.name}
RUT: ${companyData.rut}
Contacto: ${companyData.contactPerson}
Email: ${companyData.email}
Teléfono: ${companyData.phone}
Dirección: ${companyData.address}

RESUMEN DE PRODUCTOS:
${state.items.map(item => 
  `- ${item.name} (${item.sku})
    Cantidad: ${item.quantity} unidades
    Precio unitario: ${formatPrice(item.unitPrice)}
    Total: ${formatPrice(item.totalPrice)}
    ${item.selectedColor ? `Color: ${item.selectedColor}` : ''}
    ${item.selectedSize ? `Talla: ${item.selectedSize}` : ''}
`).join('\n')}

RESUMEN FINANCIERO:
Total de productos: ${pricing.totalItems} unidades
Subtotal: ${formatPrice(pricing.subtotal)}
Descuento por volumen: ${formatPrice(pricing.totalDiscountAmount)} (${pricing.discountPercentage.toFixed(1)}%)
${pricing.additionalDiscount > 0 ? `Descuento adicional por cantidad: ${formatPrice(pricing.additionalDiscount)}` : ''}

TOTAL FINAL: ${formatPrice(pricing.finalTotal)}

CONDICIONES:
- Precios incluyen IVA
- Tiempo de producción: 7-10 días hábiles
- Envío gratuito para pedidos sobre $50.000 CLP
- Garantía de 30 días
- Bordado/grabado incluido según producto

Para proceder con el pedido, responda a esta cotización o contáctenos al +56 9 1234 5678
    `.trim()

    return summary
  }

  const exportQuote = async () => {
    setLoading(true, 'Generando cotización...')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      const summary = generateQuoteSummary()
      const blob = new Blob([summary], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cotizacion-${companyData.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      showNotification({
        type: 'success',
        title: 'Cotización descargada',
        message: 'La cotización ha sido descargada exitosamente'
      })
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error al descargar',
        message: 'Hubo un problema al generar la cotización'
      })
    } finally {
      setLoading(false)
    }
  }

  const sendQuoteByEmail = () => {
    const summary = generateQuoteSummary()
    const subject = encodeURIComponent(`Cotización SWAG Chile - ${companyData.name}`)
    const body = encodeURIComponent(summary)
    
    window.open(`mailto:${companyData.email}?subject=${subject}&body=${body}`)
    
    showNotification({
      type: 'success',
      title: 'Email preparado',
      message: 'Se ha abierto su cliente de email con la cotización lista para enviar'
    })
  }

  const isFormValid = () => {
    return companyData.name && companyData.rut && companyData.email && companyData.contactPerson
  }

  if (state.items.length === 0) {
    return (
      <div className="quote-simulator empty">
        <div className="empty-cart-message">
          <span className="material-icons">shopping_cart</span>
          <h3>Carrito vacío</h3>
          <p>Agrega productos al carrito para generar una cotización</p>
        </div>
      </div>
    )
  }

  const pricing = calculateFinalPricing()

  return (
    <div className={`quote-simulator ${isOpen ? 'open' : ''}`}>
      <button 
        className="quote-toggle-btn btn btn-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons">request_quote</span>
        {isOpen ? 'Cerrar Cotización' : 'Generar Cotización'}
      </button>

      {isOpen && (
        <div className="quote-content">
          <div className="quote-header">
            <h2 className="h2">Simulador de Cotización</h2>
            <p className="p1">Complete los datos de su empresa para generar una cotización oficial</p>
          </div>

          <div className="quote-form">
            <div className="form-section">
              <h3 className="p1-medium">Datos de la Empresa</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="l1">Nombre de la empresa *</label>
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input p1"
                    placeholder="Ej: Empresa ABC Ltda."
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="l1">RUT *</label>
                  <input
                    type="text"
                    value={companyData.rut}
                    onChange={(e) => handleInputChange('rut', e.target.value)}
                    className="form-input p1"
                    placeholder="Ej: 12.345.678-9"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="l1">Persona de contacto *</label>
                  <input
                    type="text"
                    value={companyData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="form-input p1"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="l1">Email *</label>
                  <input
                    type="email"
                    value={companyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input p1"
                    placeholder="contacto@empresa.cl"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="l1">Teléfono</label>
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input p1"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="form-field full-width">
                  <label className="l1">Dirección</label>
                  <input
                    type="text"
                    value={companyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="form-input p1"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="p1-medium">Resumen de Cotización</h3>
              
              <div className="quote-summary">
                <div className="summary-stats">
                  <div className="stat">
                    <span className="stat-value h2">{pricing.totalItems}</span>
                    <span className="stat-label l1">productos</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value h2">{state.items.length}</span>
                    <span className="stat-label l1">líneas</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value h2">{pricing.discountPercentage.toFixed(1)}%</span>
                    <span className="stat-label l1">descuento</span>
                  </div>
                </div>

                <div className="pricing-breakdown">
                  <div className="pricing-row">
                    <span className="p1">Subtotal:</span>
                    <span className="p1-medium">{formatPrice(pricing.subtotal)}</span>
                  </div>
                  
                  {pricing.totalDiscountAmount > 0 && (
                    <div className="pricing-row discount">
                      <span className="p1">Descuento por volumen:</span>
                      <span className="p1-medium">-{formatPrice(pricing.totalDiscountAmount)}</span>
                    </div>
                  )}

                  {pricing.additionalDiscount > 0 && (
                    <div className="pricing-row discount">
                      <span className="p1">Descuento adicional:</span>
                      <span className="p1-medium">-{formatPrice(pricing.additionalDiscount)}</span>
                    </div>
                  )}

                  <div className="pricing-row total">
                    <span className="p1-medium">Total Final:</span>
                    <span className="h2">{formatPrice(pricing.finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="quote-actions">
              <button 
                className="btn btn-secondary"
                onClick={exportQuote}
                disabled={!isFormValid()}
              >
                <span className="material-icons">download</span>
                Descargar Cotización
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={sendQuoteByEmail}
                disabled={!isFormValid()}
              >
                <span className="material-icons">email</span>
                Enviar por Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuoteSimulator
