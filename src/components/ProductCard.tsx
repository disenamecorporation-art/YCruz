import React, { useState } from "react";
import { ShoppingBag, Eye, Star, Check } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onSelectProduct }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative bg-[#FDFBF8] rounded-2xl overflow-hidden border border-[#C9A98C]/15 hover:border-[#8A7263]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Badge Section */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="bg-[#8A7263] text-white text-[9px] font-sans tracking-wider uppercase font-semibold px-2.5 py-1 rounded-md shadow-xs">
            NUEVO
          </span>
        )}
        {product.isOffer && (
          <span className="bg-[#F3CBA3] text-[#4A3F37] text-[9px] font-sans tracking-wider uppercase font-semibold px-2.5 py-1 rounded-md shadow-xs">
            OFERTA
          </span>
        )}
        {product.isTrending && (
          <span className="bg-[#C9A98C] text-[#FDFBF8] text-[9px] font-sans tracking-wider uppercase font-semibold px-2.5 py-1 rounded-md shadow-xs">
            TENDENCIA
          </span>
        )}
      </div>

      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5EFE7]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Hover overlay with Quick-add triggers */}
        <div className="absolute inset-0 bg-[#6B5A4C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickAdd(!showQuickAdd);
            }}
            className="w-11/12 py-2.5 bg-[#FDFBF8] text-[#4A3F37] font-sans text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-md hover:bg-[#F3CBA3] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye size={12} /> {showQuickAdd ? "Cerrar" : "Personalizar"}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-3.5 bg-[#FDFBF8]">
        <div>
          {/* Category */}
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#8A7263] font-light">
            {product.category.replace("-", " ")}
          </p>

          {/* Name - Larger and Thicker */}
          <h4 className="font-sans text-sm md:text-base text-[#352C26] font-bold tracking-wide hover:text-[#8A7263] transition-colors mt-1">
            {product.name}
          </h4>

          {/* Stars */}
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(product.rating) ? "fill-[#C9A98C] text-[#C9A98C]" : "text-[#C9A98C]/35"}
              />
            ))}
            <span className="text-[9px] font-sans text-[#8A7263]/80 ml-1">({product.rating})</span>
          </div>
        </div>

        {/* Quick Add Custom Options inside the card */}
        {showQuickAdd && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="pt-3 border-t border-[#C9A98C]/15 space-y-2.5 animate-fade-in"
          >
            {/* Tallas */}
            <div className="space-y-1">
              <span className="text-[9px] font-sans text-[#8A7263] tracking-widest uppercase">Talla:</span>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2 py-0.5 text-[9px] font-sans border rounded-sm transition-all cursor-pointer ${
                      selectedSize === s
                        ? "border-[#8A7263] bg-[#8A7263] text-white"
                        : "border-[#C9A98C]/30 text-[#4A3F37] hover:border-[#8A7263]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="space-y-1">
              <span className="text-[9px] font-sans text-[#8A7263] tracking-widest uppercase">Color:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      selectedColor.name === c.name
                        ? "border-[#4A3F37] ring-1 ring-[#8A7263]"
                        : "border-[#C9A98C]/40"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && (
                      <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Price & Cart button - Larger and Thicker prices */}
        <div className="flex items-center justify-between pt-1 border-t border-[#C9A98C]/10">
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-2xl lg:text-3xl font-extrabold text-[#352C26] tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center border cursor-pointer ${
              isAdded 
                ? "bg-green-100 border-green-300 text-green-700" 
                : "bg-[#F3CBA3] hover:bg-[#ebd2b4] border-[#C9A98C]/25 text-[#4A3F37] hover:shadow-xs"
            }`}
            title="Añadir al carrito"
          >
            {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
