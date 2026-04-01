import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  productName: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
  productName
}: ImageLightboxProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        onNavigate(newIndex);
      }
      if (e.key === 'ArrowRight') {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        onNavigate(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center transition-all group"
      >
        <X className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 md:top-6 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl pointer-events-none">
        <span className="text-white text-sm md:text-base font-semibold">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Main Image Container */}
      <div
        className="flex items-center justify-center h-full px-4 md:px-20 pt-16 pb-32 md:pt-20 md:pb-40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        <button
          onClick={() => {
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            onNavigate(newIndex);
          }}
          className="hidden md:flex absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl items-center justify-center transition-all group"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${productName} ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full object-contain"
            />
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <button
          onClick={() => {
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            onNavigate(newIndex);
          }}
          className="hidden md:flex absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl items-center justify-center transition-all group"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Thumbnails Strip */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? 'border-[#FF8000] ring-2 ring-[#FF8000]/50 shadow-lg shadow-[#FF8000]/30 scale-110'
                  : 'border-white/20 hover:border-[#FF8000]/50 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} ${idx + 1}`}
                className="w-full h-full object-cover bg-white"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Buttons */}
      <div className="md:hidden absolute bottom-28 left-0 right-0 flex justify-between px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            onNavigate(newIndex);
          }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            onNavigate(newIndex);
          }}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center transition-all active:scale-95"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </motion.div>
  );
}