import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import QuoteSimulator from '../components/QuoteSimulator'
import { products as allProducts } from '../data/products'
import { Product } from '../types/Product'
import './ProductList.css'

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 })

  // Filter and sort products based on criteria
  const filterProducts = (category: string, search: string, sort: string, supplier: string, priceMin: number, priceMax: number) => {
    let filtered = [...allProducts]

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category)
    }

    // Search filter
    if (search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Supplier filter
    if (supplier) {
      filtered = filtered.filter(product => product.supplier === supplier)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.basePrice >= priceMin && product.basePrice <= priceMax
    )

    // Sorting logic
    switch (sort) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price':
        filtered.sort((a, b) => a.basePrice - b.basePrice)
        break
      case 'stock':
        filtered.sort((a, b) => b.stock - a.stock)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterProducts(category, searchQuery, sortBy, selectedSupplier, priceRange.min, priceRange.max)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    filterProducts(selectedCategory, search, sortBy, selectedSupplier, priceRange.min, priceRange.max)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterProducts(selectedCategory, searchQuery, sort, selectedSupplier, priceRange.min, priceRange.max)
  }

  const handleSupplierChange = (supplier: string) => {
    setSelectedSupplier(supplier)
    filterProducts(selectedCategory, searchQuery, sortBy, supplier, priceRange.min, priceRange.max)
  }

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setPriceRange(range)
    filterProducts(selectedCategory, searchQuery, sortBy, selectedSupplier, range.min, range.max)
  }

  const handleClearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('name')
    setSelectedSupplier('')
    setPriceRange({ min: 0, max: 999999 })
    filterProducts('all', '', 'name', '', 0, 999999)
  }

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>
          
          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">{filteredProducts.length}</span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">6</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedSupplier={selectedSupplier}
          priceRange={priceRange}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onSupplierChange={handleSupplierChange}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={handleClearFilters}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button 
                className="btn btn-primary cta1"
                onClick={handleClearFilters}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Quote Simulator */}
      <QuoteSimulator />
    </div>
  )
}

export default ProductList