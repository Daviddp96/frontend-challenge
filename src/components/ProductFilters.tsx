import { categories, suppliers } from '../data/products'
import './ProductFilters.css'

interface ProductFiltersProps {
  selectedCategory: string
  searchQuery: string
  sortBy: string
  selectedSupplier: string
  priceRange: { min: number; max: number }
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
  onSupplierChange: (supplier: string) => void
  onPriceRangeChange: (range: { min: number; max: number }) => void
  onClearFilters: () => void
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  selectedSupplier,
  priceRange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSupplierChange,
  onPriceRangeChange,
  onClearFilters
}: ProductFiltersProps) => {
  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => onSearchChange('')}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Supplier Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <select 
            value={selectedSupplier} 
            onChange={(e) => onSupplierChange(e.target.value)}
            className="supplier-select p1"
          >
            <option value="">Todos los proveedores</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} ({supplier.products})
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de precios (CLP)</h3>
          <div className="price-range">
            <div className="price-input-group">
              <label className="l1">Desde:</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                className="price-input p1"
                min="0"
                placeholder="0"
              />
            </div>
            <div className="price-input-group">
              <label className="l1">Hasta:</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) || 999999 })}
                className="price-input p1"
                min="0"
                placeholder="999999"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="filter-section">
          <button 
            className="btn btn-secondary clear-filters-btn cta1"
            onClick={onClearFilters}
          >
            <span className="material-icons">clear_all</span>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters