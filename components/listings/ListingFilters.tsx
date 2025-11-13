'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LISTING_TYPES, LISTING_CATEGORIES, PROVINCES } from '@/lib/utils/constants'

export default function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [province, setProvince] = useState(searchParams.get('province') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    if (type) params.set('type', type)
    if (category) params.set('category', category)
    if (city) params.set('city', city)
    if (province) params.set('province', province)
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)

    router.push(`/annunci?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearch('')
    setType('')
    setCategory('')
    setCity('')
    setProvince('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/annunci')
  }

  const hasActiveFilters = search || type || category || city || province || minPrice || maxPrice

  return (
    <div className="space-y-4">
      {/* Ricerca Testuale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cerca
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="Parola chiave..."
          className="input-field text-sm"
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo Annuncio
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">Tutti</option>
          {Object.entries(LISTING_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoria
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">Tutte</option>
          {Object.entries(LISTING_CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Provincia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provincia
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">Tutte</option>
          {PROVINCES.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Città */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Città
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="Es: Milano"
          className="input-field text-sm"
        />
      </div>

      {/* Prezzo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prezzo (€)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="input-field text-sm"
            min="0"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="input-field text-sm"
            min="0"
          />
        </div>
      </div>

      {/* Pulsanti */}
      <div className="space-y-2 pt-4">
        <button
          onClick={applyFilters}
          className="w-full btn-primary text-sm"
        >
          🔍 Applica Filtri
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full btn-secondary text-sm"
          >
            ✖️ Rimuovi Filtri
          </button>
        )}
      </div>

      {/* Filtri Attivi */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Filtri attivi:</p>
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="badge badge-info text-xs">
                Cerca: {search}
              </span>
            )}
            {type && (
              <span className="badge badge-info text-xs">
                {LISTING_TYPES[type as keyof typeof LISTING_TYPES]}
              </span>
            )}
            {category && (
              <span className="badge badge-info text-xs">
                {LISTING_CATEGORIES[category as keyof typeof LISTING_CATEGORIES]}
              </span>
            )}
            {province && (
              <span className="badge badge-info text-xs">
                {province}
              </span>
            )}
            {city && (
              <span className="badge badge-info text-xs">
                {city}
              </span>
            )}
            {minPrice && (
              <span className="badge badge-info text-xs">
                Da €{minPrice}
              </span>
            )}
            {maxPrice && (
              <span className="badge badge-info text-xs">
                A €{maxPrice}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
