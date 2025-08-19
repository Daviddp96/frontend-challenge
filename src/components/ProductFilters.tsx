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
    <section className="product-filters" role="region" aria-labelledby="filters-title">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box" role="search">
            <span className="material-icons" aria-hidden="true">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
              aria-label="Buscar productos por nombre o SKU"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => onSearchChange('')}
                aria-label="Limpiar búsqueda"
                type="button"
              >
                <span className="material-icons" aria-hidden="true">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium" id="filters-title">Categorías</h3>
          <div className="category-filters" role="group" aria-labelledby="filters-title">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
                aria-pressed={selectedCategory === category.id}
                aria-label={`Filtrar por ${category.name}, ${category.count} productos`}
              >
                <span className="material-icons" aria-hidden="true">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <label htmlFor="sort-select" className="filter-title p1-medium">Ordenar por</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
            aria-label="Ordenar productos por"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Supplier Filter */}
        <div className="filter-section">
          <label htmlFor="supplier-select" className="filter-title p1-medium">Proveedores</label>
          <select 
            id="supplier-select"
            value={selectedSupplier} 
            onChange={(e) => onSupplierChange(e.target.value)}
            className="supplier-select p1"
            aria-label="Filtrar por proveedor"
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
          <fieldset className="price-range-fieldset">
            <legend className="filter-title p1-medium">Rango de precios (CLP)</legend>
            <div className="price-range" role="group" aria-labelledby="price-range-legend">
              <div className="price-input-group">
                <label htmlFor="min-price" className="l1">Desde:</label>
                <input
                  id="min-price"
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                  className="price-input p1"
                  min="0"
                  placeholder="0"
                  aria-label="Precio mínimo"
                />
              </div>
              <div className="price-input-group">
                <label htmlFor="max-price" className="l1">Hasta:</label>
                <input
                  id="max-price"
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) || 999999 })}
                  className="price-input p1"
                  min="0"
                  placeholder="999999"
                  aria-label="Precio máximo"
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Clear Filters */}
        <div className="filter-section">
          <button 
            className="btn btn-secondary clear-filters-btn cta1"
            onClick={onClearFilters}
            aria-label="Limpiar todos los filtros aplicados"
          >
            <span className="material-icons" aria-hidden="true">clear_all</span>
            Limpiar filtros
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductFilters