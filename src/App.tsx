import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import LoadingSpinner from './components/LoadingSpinner'
import NotificationCenter from './components/NotificationCenter'
import { CartProvider } from './contexts/CartContext'
import { UIProvider, useUI } from './contexts/UIContext'
import './App.css'

const AppContent = () => {
  const { state } = useUI()

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      
      {state.isLoading && (
        <LoadingSpinner 
          size="large" 
          message={state.loadingMessage} 
          overlay 
        />
      )}
      
      <NotificationCenter />
    </div>
  )
}

function App() {
  return (
    <UIProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </UIProvider>
  )
}

export default App