import React, { useState } from "react";
import { Gift, Sparkles, Heart } from "lucide-react";
import { Product, Category } from "../types";
import BenefitBar from "./BenefitBar";
import ProductCard from "./ProductCard";

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onNavigateToShop: (categoryFilter?: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export default function HomeView({ products, categories, onAddToCart, onNavigateToShop, onSelectProduct }: HomeViewProps) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Filter 4 featured products (isNew)
  const featuredProducts = products.filter((p) => p.isNew).slice(0, 4);

  // Filter trending products
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setEmailInput("");
  };

  return (
    <div id="home-view-container" className="space-y-16 md:space-y-24 bg-[#F5EFE7] text-[#4A3F37] pb-12 animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section 
        id="hero-section"
        className="relative min-h-[500px] md:h-[700px] flex items-center bg-[#8A7263] overflow-hidden"
      >
        {/* Background Image with Warm Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://i.postimg.cc/SxnPfP4h/Chat-GPT-Image-3-sept-2026-07-19-14-p-m.png"
            alt="Woman wearing elegant pajamas"
            className="w-full h-full object-cover object-center scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#8A7263]/35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        {/* Hero Content - Glassmorphism Card */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10 flex justify-start">
          <div className="glass-card rounded-2xl p-6 sm:p-10 md:p-12 max-w-[500px] text-white space-y-6 shadow-2xl backdrop-blur-md animate-parallax-left animate-hero-float">
            <div className="flex items-center justify-center text-center mb-1">
              <img 
                src="https://i.postimg.cc/7Y6tqRfP/logowebpsd.png" 
                alt="YCruz Logo Icon" 
                className="h-10 md:h-12 object-contain"
              />
            </div>

            <div className="space-y-3.5 text-center sm:text-left">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1.1] tracking-wide text-[#FDFBF8]">
                Pijamas que abrazan tus sueños
              </h1>
              <p className="font-sans text-xs md:text-sm text-[#FDFBF8]/90 font-light leading-relaxed">
                Comodidad, suavidad y estilo en cada detalle. Descubre nuestras piezas favoritas.
              </p>
            </div>

            <div className="flex justify-center sm:justify-start">
              <button
                id="btn-hero-cta"
                onClick={() => onNavigateToShop()}
                className="py-3 px-8 bg-[#F3CBA3] hover:bg-[#ebd2b4] active:bg-[#e4be95] text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-full shadow-md hover:scale-101 transition-all flex items-center gap-2 cursor-pointer animate-shine-button"
              >
                Comprar Ahora <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS BAR */}
      <BenefitBar />

      {/* 3. PRODUCTOS DESTACADOS (NOW COMES ABOVE CATEGORIES) */}
      <section id="featured-products-section" className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase font-light text-[#4A3F37]">
            Productos Destacados
          </h2>
          <div className="w-16 h-[1px] bg-[#C9A98C] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. NUESTRAS CATEGORÍAS */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase font-light text-[#4A3F37]">
            Nuestras Categorías
          </h2>
          <div className="w-16 h-[1px] bg-[#C9A98C] mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="flex flex-col items-center group text-center space-y-4 cursor-pointer"
              onClick={() => onNavigateToShop(cat.id)}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden border-2 border-[#C9A98C]/20 group-hover:border-[#8A7263] transition-all duration-500 shadow-md aspect-square">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg text-[#4A3F37] font-medium group-hover:text-[#8A7263] transition-colors">
                  {cat.name}
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToShop(cat.id);
                  }}
                  className="font-sans text-[10px] tracking-widest uppercase text-[#8A7263] hover:text-[#4A3F37] underline underline-offset-4 transition-colors block mx-auto cursor-pointer"
                >
                  Ver Todo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FULL-SCREEN WIDTH GLASS CALL-TO-ACTION (Llamada a la acción con glass) */}
      <section 
        id="cta-glass-banner"
        className="w-full relative min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-[#6B5A4C] overflow-hidden py-16"
      >
        {/* Background Bed/Linen Texture with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1600&h=800"
            alt="Cozy elegant bedroom"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#6B5A4C]/50 mix-blend-multiply" />
        </div>

        {/* Floating Glassmorphic Container */}
        <div className="max-w-4xl mx-auto px-4 relative z-10 w-full">
          <div className="glass-card rounded-2xl p-8 sm:p-12 md:p-16 text-center text-white space-y-6 shadow-2xl max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F3CBA3]/15 rounded-full border border-[#F3CBA3]/30 text-[#F3CBA3] font-sans text-[10px] tracking-widest uppercase font-semibold">
              <Sparkles size={12} /> Colección Seda Premium
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1.15] text-[#FDFBF8]">
              Siente el abrazo de la suavidad pura
            </h2>
            
            <p className="font-sans text-xs sm:text-sm text-[#FDFBF8]/95 max-w-md mx-auto font-light leading-relaxed">
              Descubre diseños exclusivos pensados para elevar tus momentos de descanso. Tu piel merece la delicadeza del satin premium de YCruz.
            </p>

            <div className="pt-2">
              <button
                id="btn-cta-banner-shop"
                onClick={() => onNavigateToShop("pijamas-satinadas")}
                className="py-3.5 px-10 bg-[#F3CBA3] hover:bg-[#ebd2b4] active:bg-[#e4be95] text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Explorar Satinadas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCTOS EN TENDENCIA (Products en Tendencia) */}
      <section id="trending-products-section" className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase font-light text-[#4A3F37]">
            Productos en Tendencia
          </h2>
          <div className="w-16 h-[1px] bg-[#C9A98C] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trendingProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER BANNER */}
      <section id="newsletter-section" className="max-w-7xl mx-auto px-4 md:px-8">
        <div class="bg-[#8A7263] rounded-2xl p-8 sm:p-10 md:p-12 shadow-xl border border-[#C9A98C]/20">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div class="md:col-span-7 flex items-start gap-4 text-white text-center sm:text-left">
              <div class="p-3.5 bg-[#FDFBF8]/15 rounded-xl border border-white/10 hidden sm:flex shrink-0">
                <Gift size={26} className="text-[#F3CBA3]" />
              </div>
              <div class="space-y-1.5 flex-1">
                <h3 class="font-serif text-xl sm:text-2xl font-light text-[#FDFBF8]">
                  Suscríbete y obtén 10% OFF
                </h3>
                <p class="font-sans text-xs md:text-sm text-[#FDFBF8]/85 font-light">
                  En tu primera compra. Recibe lanzamientos exclusivos y consejos de descanso.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div class="md:col-span-5 w-full">
              {!subscribed ? (
                <form onSubmit={handleSubscribe} class="flex flex-col sm:flex-row gap-2.5 w-full">
                  <input
                    id="input-newsletter-email"
                    type="email"
                    required
                    placeholder="Tu correo electrónico"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    class="flex-1 px-4 py-3.5 bg-white/10 text-white placeholder-white/50 border border-[#C9A98C]/35 rounded-xl text-xs font-sans tracking-wide focus:outline-hidden focus:bg-white/15 focus:ring-1 focus:ring-[#F3CBA3]"
                  />
                  <button
                    id="btn-newsletter-subscribe"
                    type="submit"
                    class="py-3.5 px-6 bg-[#F3CBA3] hover:bg-[#ebd2b4] text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Suscribirme
                  </button>
                </form>
              ) : (
                <div class="bg-white/10 border border-green-400/30 p-4 rounded-xl text-center text-white font-sans animate-fade-in space-y-1.5">
                  <p class="text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Sparkles size={14} className="text-[#F3CBA3]" /> ¡Te has suscrito con éxito!
                  </p>
                  <p class="text-[10px] text-white/80 tracking-widest uppercase">
                    Usa el código <span class="bg-[#F3CBA3] text-[#4A3F37] font-bold px-2 py-0.5 rounded-xs">YCRUZ10</span> en tu carrito para 10% OFF.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
