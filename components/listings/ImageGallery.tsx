'use client'

import { useState } from 'react'
import Image from 'next/image'

type ImageGalleryProps = {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-lg">Nessuna immagine disponibile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Immagine Principale */}
      <div className="relative w-full h-96 md:h-[500px] bg-gray-900 overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={`${title} - Immagine ${selectedImage + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* Badge contatore */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {selectedImage + 1} / {images.length}
        </div>

        {/* Frecce navigazione */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              aria-label="Immagine precedente"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              aria-label="Immagine successiva"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
