'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { SiteSettings } from '@/lib/types'

type SiteSettingsFormProps = {
  settings: SiteSettings | null
}

export default function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    site_name: settings?.site_name || 'Vetrina Immobiliare',
    site_description: settings?.site_description || 'Pubblica e cerca annunci immobiliari gratuitamente',
    primary_color: settings?.primary_color || '#3b82f6',
    hero_background_image: settings?.hero_background_image || '',
    contact_email: settings?.contact_email || 'info@vetrinaimmobiliare.it',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-background.${fileExt}`

      // Upload su Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Ottieni URL pubblico
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, hero_background_image: publicUrl }))
      alert('✅ Immagine caricata con successo!')
    } catch (error: any) {
      console.error('Errore upload:', error)
      alert('Errore durante il caricamento dell\'immagine')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    if (confirm('Rimuovere l\'immagine di sfondo?')) {
      setFormData(prev => ({ ...prev, hero_background_image: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: formData.site_name,
          site_description: formData.site_description,
          primary_color: formData.primary_color,
          hero_background_image: formData.hero_background_image,
          contact_email: formData.contact_email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings?.id || '')

      if (error) throw error

      alert('✅ Impostazioni salvate con successo!')
      router.refresh()
    } catch (error: any) {
      console.error('Errore salvataggio:', error)
      alert('Errore durante il salvataggio: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Nome Sito */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informazioni Base</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Sito
            </label>
            <input
              type="text"
              id="site_name"
              name="site_name"
              value={formData.site_name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="site_description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione Sito
            </label>
            <textarea
              id="site_description"
              name="site_description"
              value={formData.site_description}
              onChange={handleChange}
              rows={3}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Contatto
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      {/* Personalizzazione Hero */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sezione Hero (Homepage)</h2>
        
        <div className="space-y-6">
          {/* Colore Primario */}
          <div>
            <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-1">
              Colore Primario
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                id="primary_color"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleChange}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={formData.primary_color}
                onChange={handleChange}
                name="primary_color"
                className="input-field flex-1"
                placeholder="#3b82f6"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Usato come sfondo se non c'è un'immagine
            </p>
          </div>

          {/* Upload Immagine Hero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Immagine di Sfondo Hero
            </label>
            
            {formData.hero_background_image ? (
              <div className="relative">
                <img
                  src={formData.hero_background_image}
                  alt="Hero background"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  🗑️ Rimuovi
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">Nessuna immagine caricata</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {uploadingImage && <p className="text-sm text-gray-600 mt-2">⏳ Caricamento...</p>}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Consigliato: 1920x600px, formato JPG o PNG
            </p>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anteprima Hero Section
            </label>
            <div
              className="relative h-64 rounded-lg overflow-hidden flex items-center justify-center text-white"
              style={{
                backgroundImage: formData.hero_background_image 
                  ? `url(${formData.hero_background_image})` 
                  : `linear-gradient(to right, ${formData.primary_color}, ${formData.primary_color}dd)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                  {formData.site_name}
                </h1>
                <p className="text-xl drop-shadow">
                  {formData.site_description}
                </p>
              </div>
              {formData.hero_background_image && (
                <div className="absolute inset-0 bg-black/30" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Salva */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="btn-secondary"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? '⏳ Salvataggio...' : '💾 Salva Impostazioni'}
        </button>
      </div>
    </form>
  )
}
