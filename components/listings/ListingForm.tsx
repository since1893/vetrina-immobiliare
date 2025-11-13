'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LISTING_TYPES, LISTING_CATEGORIES, PROVINCES } from '@/lib/utils/constants'
import type { Listing } from '@/lib/types'

type ListingFormProps = {
  userId: string
  mode: 'create' | 'edit'
  listing?: Listing
}

export default function ListingForm({ userId, mode, listing }: ListingFormProps) {
  const router = useRouter()
  const supabase = createClient()

  // State del form
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>(listing?.images || [])
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    type: listing?.type || 'vendita',
    category: listing?.category || 'appartamento',
    price: listing?.price || '',
    location: listing?.location || '',
    city: listing?.city || '',
    province: listing?.province || '',
    address: listing?.address || '',
    surface: listing?.surface || '',
    rooms: listing?.rooms || '',
    bathrooms: listing?.bathrooms || '',
    floor: listing?.floor || '',
    energy_class: listing?.energy_class || '',
    features: listing?.features || [],
  })

  const availableFeatures = [
    'balcone',
    'terrazzo',
    'giardino',
    'piscina',
    'garage',
    'cantina',
    'ascensore',
    'aria_condizionata',
    'riscaldamento_autonomo',
    'porta_blindata',
    'allarme',
    'wifi',
    'cucina_attrezzata',
    'arredato',
    'parcheggio',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}_${i}.${fileExt}`

        // Upload su Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('listings')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Ottieni URL pubblico
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
      }

      setImageUrls(prev => [...prev, ...uploadedUrls])
    } catch (error: any) {
      console.error('Errore upload:', error)
      setError('Errore durante il caricamento delle immagini')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent, saveAs: 'bozza' | 'in_attesa') => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validazione
    if (!formData.title.trim()) {
      setError('Il titolo è obbligatorio')
      setLoading(false)
      return
    }

    if (!formData.description.trim()) {
      setError('La descrizione è obbligatoria')
      setLoading(false)
      return
    }

    if (!formData.price || parseFloat(formData.price.toString()) <= 0) {
      setError('Inserisci un prezzo valido')
      setLoading(false)
      return
    }

    if (!formData.city.trim()) {
      setError('La città è obbligatoria')
      setLoading(false)
      return
    }

    if (!formData.province) {
      setError('La provincia è obbligatoria')
      setLoading(false)
      return
    }

    try {
      const listingData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        category: formData.category,
        price: parseFloat(formData.price.toString()),
        location: formData.location.trim() || formData.city,
        city: formData.city.trim(),
        province: formData.province,
        address: formData.address.trim() || null,
        images: imageUrls,
        surface: formData.surface ? parseFloat(formData.surface.toString()) : null,
        rooms: formData.rooms ? parseInt(formData.rooms.toString()) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms.toString()) : null,
        floor: formData.floor ? parseInt(formData.floor.toString()) : null,
        energy_class: formData.energy_class || null,
        features: formData.features,
        status: saveAs,
      }

      if (mode === 'create') {
        // Crea nuovo annuncio
        const { error: insertError } = await supabase
          .from('listings')
          .insert({
            ...listingData,
            owner_id: userId,
          })

        if (insertError) throw insertError

        router.push('/dashboard/inserzionista/annunci?success=created')
      } else {
        // Aggiorna annuncio esistente
        const { error: updateError } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', listing!.id)

        if (updateError) throw updateError

        router.push(`/dashboard/inserzionista/annunci?success=updated`)
      }

      router.refresh()
    } catch (error: any) {
      console.error('Errore salvataggio:', error)
      setError(error.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Informazioni Base */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Informazioni Base</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titolo Annuncio *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="es: Appartamento moderno in centro"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="input-field"
              placeholder="Descrivi dettagliatamente l'immobile..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Annuncio *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
                required
              >
                {Object.entries(LISTING_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                {Object.entries(LISTING_CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Prezzo (€) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              placeholder="es: 250000"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
      </div>

      {/* Posizione */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Posizione</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Città *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
                placeholder="es: Milano"
                required
              />
            </div>

            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                Provincia *
              </label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Seleziona provincia</option>
                {PROVINCES.map(prov => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Zona/Quartiere
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="es: Centro Storico"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Indirizzo (opzionale)
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="es: Via Roma, 15"
            />
          </div>
        </div>
      </div>

      {/* Caratteristiche */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏠 Caratteristiche</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="surface" className="block text-sm font-medium text-gray-700 mb-1">
              Superficie (m²)
            </label>
            <input
              type="number"
              id="surface"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              className="input-field"
              placeholder="85"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
              Camere
            </label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="input-field"
              placeholder="3"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bagni
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="input-field"
              placeholder="2"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
              Piano
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="input-field"
              placeholder="2"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="energy_class" className="block text-sm font-medium text-gray-700 mb-1">
            Classe Energetica
          </label>
          <select
            id="energy_class"
            name="energy_class"
            value={formData.energy_class}
            onChange={handleChange}
            className="input-field max-w-xs"
          >
            <option value="">Non specificata</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
        </div>

        {/* Features */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Dotazioni e Servizi
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableFeatures.map(feature => (
              <label
                key={feature}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {feature.replace(/_/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Immagini */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📸 Immagini</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carica immagini (max 10)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImage || imageUrls.length >= 10}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
            />
            {uploadingImage && (
              <p className="text-sm text-gray-600 mt-2">⏳ Caricamento in corso...</p>
            )}
          </div>

          {/* Preview Immagini */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      Principale
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pulsanti Salvataggio */}
      <div className="card bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'bozza')}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            {loading ? '⏳ Salvataggio...' : '📝 Salva come Bozza'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'in_attesa')}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? '⏳ Invio...' : '📤 Invia per Approvazione'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          * Le bozze vengono salvate ma non pubblicate. 
          Gli annunci "in attesa" verranno revisionati da un admin prima della pubblicazione.
        </p>
      </div>
    </form>
  )
}
