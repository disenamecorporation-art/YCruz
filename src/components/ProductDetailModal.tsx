import React, { useState } from "react";
import { X, Star, ShoppingBag, Check, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { Product } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: "Único", hex: "#8A7263" });
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedSize, selectedColor);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <div 
      id="product-detail-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-md transition-all duration-300"
    >
      <div 
        id="product-detail-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FDFBF8] rounded-2xl overflow-hidden border border-[#C9A98C]/20 shadow-2xl animate-scale-up-soft flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A3F37] shadow-md transition-all z-10 cursor-pointer"
          title="Cerrar"
        >
          <X size={20} />
        </button>

        {/* Left: Product Images with glass effect */}
        <div className="w-full md:w-1/2 relative bg-[#F5EFE7] flex items-center justify-center overflow-hidden aspect-square md:aspect-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Accent Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-[#8A7263] text-white text-[10px] font-sans tracking-widest uppercase font-bold px-3 py-1 rounded-md shadow-xs">
                NUEVO
              </span>
            )}
            {product.isOffer && (
              <span className="bg-[#F3CBA3] text-[#4A3F37] text-[10px] font-sans tracking-widest uppercase font-bold px-3 py-1 rounded-md shadow-xs">
                OFERTA
              </span>
            )}
          </div>
        </div>

        {/* Right: Product details & Add block */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-[#8A7263] font-medium">
                {product.category.replace("-", " ")}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#352C26] font-bold tracking-wide mt-1 leading-snug">
                {product.name}
              </h2>
              
              {/* Review Stars */}
              <div className="flex items-center gap-1.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "fill-[#C9A98C] text-[#C9A98C]" : "text-[#C9A98C]/35"}
                  />
                ))}
                <span className="text-xs font-sans text-[#8A7263] font-semibold">({product.rating} de 5 estrellas)</span>
              </div>
            </div>

            {/* Price block - Large, bold and thick */}
            <div className="py-2.5 border-y border-[#C9A98C]/15 flex items-center justify-between">
              <span className="font-serif text-3xl md:text-4xl font-extrabold text-[#352C26] tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              <span className={`text-[11px] font-sans px-3 py-1 rounded-full uppercase tracking-wider font-bold ${product.stock > 0 ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                {product.stock > 0 ? `En Stock (${product.stock} disp.)` : "Agotado"}
              </span>
            </div>

            {/* Simulated Luxurious Description */}
            <p className="font-sans text-xs md:text-sm text-[#4A3F37]/85 font-light leading-relaxed">
              Diseño sofisticado confeccionado con fibras premium seleccionadas por su suavidad excepcional sobre la piel. Ofrece una caída fluida que brinda libertad de movimiento absoluto para un descanso idílico. Una prenda atemporal de YCruz Shop que redefine el confort.
            </p>

            {/* Options block */}
            <div className="space-y-4 pt-2">
              {/* Sizes Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-[#352C26] tracking-widest uppercase font-bold">Selecciona tu talla:</span>
                  <span className="text-[#8A7263] font-medium font-sans">Guía de tallas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 text-xs font-sans font-bold border rounded-lg transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-[#8A7263] bg-[#8A7263] text-white shadow-xs"
                          : "border-[#C9A98C]/35 text-[#4A3F37] bg-white hover:border-[#8A7263]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors Selection */}
              <div className="space-y-2">
                <span className="block font-sans text-[#352C26] text-xs tracking-widest uppercase font-bold">Selecciona color:</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 px-3 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer text-[11px] font-sans font-semibold ${
                        selectedColor.name === color.name
                          ? "border-[#352C26] bg-white ring-1 ring-[#8A7263]"
                          : "border-[#C9A98C]/40 bg-white"
                      }`}
                      title={color.name}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shrink-0" 
                        style={{ backgroundColor: color.hex }} 
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart & Trust elements */}
          <div className="space-y-4 pt-4 border-t border-[#C9A98C]/15">
            <div className="flex gap-3">
              {/* Quantity block */}
              <div className="flex items-center border border-[#C9A98C]/30 bg-white rounded-xl overflow-hidden shrink-0">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 py-2 hover:bg-[#F5EFE7] text-sm text-[#4A3F37] transition-colors font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-sans font-bold text-[#4A3F37] min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-2 hover:bg-[#F5EFE7] text-sm text-[#4A3F37] transition-colors font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Submit CTA button */}
              <button
                onClick={handleAdd}
                disabled={product.stock === 0 || isAdded}
                className={`flex-1 py-3.5 px-6 font-sans text-xs tracking-widest uppercase font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAdded
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-[#F3CBA3] hover:bg-[#ebd2b4] text-[#352C26] hover:shadow-lg active:scale-99"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} /> ¡Agregado con éxito!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} /> Añadir a la Bolsa
                  </>
                )}
              </button>
            </div>

            {/* Brand benefits summary */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-sans text-[#8A7263] leading-tight">
              <div className="flex flex-col items-center space-y-1">
                <Truck size={14} className="text-[#8A7263]/80" />
                <span>Envío Veloz</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RefreshCw size={13} className="text-[#8A7263]/80" />
                <span>Cambio Gratis</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck size={14} className="text-[#8A7263]/80" />
                <span>Pago Seguro</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
