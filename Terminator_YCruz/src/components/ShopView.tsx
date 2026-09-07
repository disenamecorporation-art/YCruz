import React, { useState, useMemo } from "react";
import { Filter, X, Grid, List, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Product, Category } from "../types";
import { categories } from "../data";
import ProductCard from "./ProductCard";

interface ShopViewProps {
  products: Product[];
  initialCategoryFilter?: string;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ShopView({ products, initialCategoryFilter = "", onAddToCart, onSelectProduct }: ShopViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [priceRange, setPriceRange] = useState<number>(60);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const availableSizes = ["XS", "S", "M", "L", "XL"];
  
  const availableColors = [
    { name: "Beige", hex: "#EADDC9" },
    { name: "Lila", hex: "#D6C7E2" },
    { name: "Marfil", hex: "#F5F2EB" },
    { name: "Rosa Pastel", hex: "#F3D5D9" },
    { name: "Gris", hex: "#CBD5E1" },
    { name: "Negro", hex: "#1E1E1E" },
    { name: "Verde Esmeralda", hex: "#14532D" },
    { name: "Borgoña", hex: "#7F1D1D" },
  ];

  // Reset category filter if parent changes initialCategoryFilter
  useMemo(() => {
    if (initialCategoryFilter !== undefined) {
      setSelectedCategory(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleColorToggle = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setPriceRange(60);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy("recent");
    setCurrentPage(1);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. Price Filter
    result = result.filter((p) => p.price <= priceRange);

    // 3. Size Filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    // 4. Color Filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color) => selectedColors.includes(color.name))
      );
    }

    // 5. Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "recent") {
      // Keep original array order or assume id sorting
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, selectedCategory, priceRange, selectedSizes, selectedColors, sortBy]);

  // Pagination (6 items per page in this WooCommerce style)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  // Counting helpers
  const getCategoryCount = (catId: string) => {
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div id="shop-view-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-fade-in">
      
      {/* Title */}
      <div className="text-center md:text-left mb-8 md:mb-10 space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl text-[#4A3F37] tracking-wider font-light uppercase">
          La Tienda
        </h1>
        <p className="font-sans text-xs tracking-widest text-[#8A7263] uppercase">
          {selectedCategory ? `Colección > ${selectedCategory.replace("-", " ")}` : "Todas nuestras prendas"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= SIDEBAR FILTERS (Desktop) ================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 bg-[#FDFBF8] p-6 rounded-2xl border border-[#C9A98C]/15 shadow-xs h-fit">
          
          {/* Header Filters & Reset */}
          <div className="flex items-center justify-between pb-4 border-b border-[#C9A98C]/15">
            <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#4A3F37] flex items-center gap-1.5">
              <SlidersHorizontal size={14} /> Filtros
            </span>
            <button
              onClick={resetFilters}
              className="text-[10px] font-sans tracking-widest uppercase text-[#8A7263] hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={10} /> Limpiar
            </button>
          </div>

          {/* Block Categories */}
          <div className="space-y-3.5">
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
              Categorías
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}
                className={`w-full flex items-center justify-between text-xs font-sans text-left transition-colors cursor-pointer ${
                  selectedCategory === "" ? "text-[#8A7263] font-semibold" : "text-[#4A3F37]/80 hover:text-[#4A3F37]"
                }`}
              >
                <span>Todas las pijamas</span>
                <span className="text-[10px] bg-[#F5EFE7] px-2 py-0.5 rounded-full text-[#8A7263] font-medium">
                  {products.length}
                </span>
              </button>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between text-xs font-sans text-left transition-colors cursor-pointer ${
                      isActive ? "text-[#8A7263] font-semibold" : "text-[#4A3F37]/80 hover:text-[#4A3F37]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-[#F5EFE7] px-2 py-0.5 rounded-full text-[#8A7263] font-medium">
                      {getCategoryCount(cat.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block Price Range */}
          <div className="space-y-4 pt-4 border-t border-[#C9A98C]/15">
            <div className="flex justify-between items-baseline">
              <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
                Filtrar por Precio
              </h4>
              <span className="text-xs font-serif font-semibold text-[#8A7263]">Hasta ${priceRange}</span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              value={priceRange}
              onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
              className="w-full accent-[#F3CBA3] cursor-pointer bg-[#F5EFE7] h-1.5 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#8A7263] font-sans">
              <span>$15.00</span>
              <span>$70.00</span>
            </div>
          </div>

          {/* Block Talla */}
          <div className="space-y-3 pt-4 border-t border-[#C9A98C]/15">
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
              Talla
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`w-10 h-10 rounded-lg text-xs font-sans font-medium border flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#8A7263] border-[#8A7263] text-white"
                        : "bg-white border-[#C9A98C]/25 text-[#4A3F37] hover:border-[#8A7263]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block Color */}
          <div className="space-y-3 pt-4 border-t border-[#C9A98C]/15">
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
              Color
            </h4>
            <div className="grid grid-cols-4 gap-2.5">
              {availableColors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    className={`w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected ? "border-[#4A3F37] ring-2 ring-[#8A7263]" : "border-[#C9A98C]/35"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent decoration button */}
          <button
            onClick={() => {}}
            className="w-full py-3 bg-[#F3CBA3] hover:bg-[#ebd2b4] text-[#4A3F37] font-sans text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
          >
            Aplicar Filtros
          </button>
        </aside>

        {/* ================= PRODUCTS AREA (Right) ================= */}
        <section className="lg:col-span-9 space-y-6">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FDFBF8] p-4 rounded-xl border border-[#C9A98C]/15 shadow-2xs">
            <div className="text-xs font-sans text-[#8A7263]">
              Mostrando <span className="font-semibold text-[#4A3F37]">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span>–
              <span className="font-semibold text-[#4A3F37]">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> de{" "}
              <span className="font-semibold text-[#4A3F37]">{filteredProducts.length}</span> productos
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Button toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex-1 sm:flex-none py-2 px-4 bg-[#8A7263] text-white rounded-lg text-xs font-sans font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <Filter size={14} /> Filtros
              </button>

              <select
                id="select-sort-by"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="flex-1 sm:flex-none py-2 px-4 bg-white border border-[#C9A98C]/25 rounded-lg text-xs font-sans text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
              >
                <option value="recent">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Active filter pills */}
          {(selectedCategory || selectedSizes.length > 0 || selectedColors.length > 0 || priceRange < 60) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-sans text-[#8A7263] uppercase tracking-wider">Activos:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-[#8A7263]/10 text-[#8A7263] text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border border-[#8A7263]/20">
                  Categoría: {selectedCategory.replace("-", " ")}
                  <X size={10} className="cursor-pointer" onClick={() => setSelectedCategory("")} />
                </span>
              )}
              {priceRange < 60 && (
                <span className="inline-flex items-center gap-1 bg-[#8A7263]/10 text-[#8A7263] text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border border-[#8A7263]/20">
                  Precio: &lt; ${priceRange}
                  <X size={10} className="cursor-pointer" onClick={() => setPriceRange(60)} />
                </span>
              )}
              {selectedSizes.map((sz) => (
                <span key={sz} className="inline-flex items-center gap-1 bg-[#8A7263]/10 text-[#8A7263] text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border border-[#8A7263]/20">
                  Talla: {sz}
                  <X size={10} className="cursor-pointer" onClick={() => handleSizeToggle(sz)} />
                </span>
              ))}
              {selectedColors.map((cl) => (
                <span key={cl} className="inline-flex items-center gap-1 bg-[#8A7263]/10 text-[#8A7263] text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border border-[#8A7263]/20">
                  Color: {cl}
                  <X size={10} className="cursor-pointer" onClick={() => handleColorToggle(cl)} />
                </span>
              ))}
            </div>
          )}

          {/* Grid responsive of products (3 columns on desktop) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#FDFBF8] rounded-2xl border border-[#C9A98C]/15 py-20 px-4 text-center space-y-4">
              <div className="text-[#8A7263] w-12 h-12 rounded-full bg-[#F5EFE7] flex items-center justify-center mx-auto">
                <SlidersHorizontal size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-[#4A3F37] font-semibold">Sin resultados</h3>
                <p className="font-sans text-xs text-[#8A7263] max-w-xs mx-auto">
                  Prueba a ajustar tus filtros de búsqueda o restablecerlos para ver más preciosas pijamas.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="py-2.5 px-6 bg-[#F3CBA3] hover:bg-[#ebd2b4] text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-bold rounded-full transition-all cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}

          {/* Minimalist Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2.5 pt-8 md:pt-12 border-t border-[#C9A98C]/15">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-white hover:bg-[#F5EFE7] disabled:opacity-40 rounded-full border border-[#C9A98C]/20 transition-all cursor-pointer text-[#4A3F37]"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isSelected = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-full font-sans text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#8A7263] border-[#8A7263] text-white"
                        : "bg-white border-[#C9A98C]/20 text-[#4A3F37] hover:bg-[#F5EFE7]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white hover:bg-[#F5EFE7] disabled:opacity-40 rounded-full border border-[#C9A98C]/20 transition-all cursor-pointer text-[#4A3F37]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </section>

      </div>

      {/* ================= MOBILE FILTERS DRAWER (Drawer modal) ================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex justify-start">
          <div className="absolute inset-0 -z-10" onClick={() => setMobileFiltersOpen(false)} />
          
          <div className="w-full max-w-xs h-full bg-[#FDFBF8] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div className="space-y-6">
              
              {/* Header Filters */}
              <div className="flex items-center justify-between pb-3 border-b border-[#C9A98C]/15">
                <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#4A3F37] flex items-center gap-1.5">
                  <SlidersHorizontal size={14} /> Filtros de Tienda
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-[#4A3F37]/60 hover:text-[#4A3F37] rounded-full hover:bg-[#F5EFE7] transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Reset trigger */}
              <div className="flex justify-end">
                <button
                  onClick={() => { resetFilters(); setMobileFiltersOpen(false); }}
                  className="text-[9px] font-sans tracking-widest uppercase text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={10} /> Restablecer
                </button>
              </div>

              {/* Block Categories */}
              <div className="space-y-3">
                <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
                  Categorías
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedCategory(""); setCurrentPage(1); setMobileFiltersOpen(false); }}
                    className={`w-full flex items-center justify-between text-xs font-sans text-left py-1 cursor-pointer ${
                      selectedCategory === "" ? "text-[#8A7263] font-semibold" : "text-[#4A3F37]/80"
                    }`}
                  >
                    <span>Todas las pijamas</span>
                    <span className="text-[9px] bg-[#F5EFE7] px-2 py-0.5 rounded-full text-[#8A7263]">
                      {products.length}
                    </span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); setMobileFiltersOpen(false); }}
                      className={`w-full flex items-center justify-between text-xs font-sans text-left py-1 cursor-pointer ${
                        selectedCategory === cat.id ? "text-[#8A7263] font-semibold" : "text-[#4A3F37]/80"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[9px] bg-[#F5EFE7] px-2 py-0.5 rounded-full text-[#8A7263]">
                        {getCategoryCount(cat.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Block Price Range */}
              <div className="space-y-3 pt-4 border-t border-[#C9A98C]/15">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
                    Precio Máximo
                  </h4>
                  <span className="text-xs font-serif font-semibold text-[#8A7263]">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="70"
                  value={priceRange}
                  onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-[#F3CBA3] cursor-pointer"
                />
              </div>

              {/* Block Talla */}
              <div className="space-y-3 pt-4 border-t border-[#C9A98C]/15">
                <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
                  Tallas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans border flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#8A7263] border-[#8A7263] text-white"
                            : "bg-white border-[#C9A98C]/25 text-[#4A3F37]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Block Color */}
              <div className="space-y-3 pt-4 border-t border-[#C9A98C]/15">
                <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#4A3F37]">
                  Colores
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {availableColors.map((color) => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorToggle(color.name)}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                          isSelected ? "border-[#4A3F37] ring-1 ring-[#8A7263]" : "border-[#C9A98C]/35"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-[#C9A98C]/15 mt-6">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#F3CBA3] text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-full shadow-xs cursor-pointer"
              >
                Ver {filteredProducts.length} Resultados
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
