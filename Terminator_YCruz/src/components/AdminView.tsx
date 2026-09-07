import React, { useState } from "react";
import { Plus, Trash2, Edit, Save, X, Layers, ShoppingBag, Eye, RefreshCw, Upload, Check } from "lucide-react";
import { Product, Category } from "../types";
import { 
  insertSupabaseProduct, 
  updateSupabaseProduct, 
  deleteSupabaseProduct,
  insertSupabaseCategory, 
  updateSupabaseCategory, 
  deleteSupabaseCategory 
} from "../supabaseService";

interface AdminViewProps {
  products: Product[];
  categories: Category[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateCategories: (newCategories: Category[]) => void;
  supabaseStatus?: {
    configured: boolean;
    hasProductsTable: boolean;
    hasCategoriesTable: boolean;
    errorMsg?: string;
  };
}

export default function AdminView({ 
  products, 
  categories, 
  onUpdateProducts, 
  onUpdateCategories,
  supabaseStatus 
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: 0,
    image: "",
    stock: 10,
    rating: 5,
    sizes: ["S", "M", "L", "XL"] as string[],
    colors: [] as { name: string; hex: string }[],
    isNew: false,
    isOffer: false,
    isTrending: false,
  });

  // Category Form State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    image: "",
    count: 0,
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [colorInputName, setColorInputName] = useState("");
  const [colorInputHex, setColorInputHex] = useState("#8A7263");

  const [notification, setNotification] = useState("");

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // COLOR HANDLERS
  const handleAddColor = () => {
    if (!colorInputName.trim()) return;
    setProductForm(prev => ({
      ...prev,
      colors: [...prev.colors, { name: colorInputName.trim(), hex: colorInputHex }]
    }));
    setColorInputName("");
  };

  const handleRemoveColor = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index)
    }));
  };

  // SIZE HANDLERS
  const handleToggleSize = (size: string) => {
    setProductForm(prev => {
      const isSelected = prev.sizes.includes(size);
      const updatedSizes = isSelected 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  // PRODUCT SUBMISSION
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category) {
      alert("Por favor rellena los campos obligatorios");
      return;
    }

    if (editingProductId) {
      // Edit mode
      const updatedProduct: Product = {
        id: editingProductId,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        image: productForm.image || "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600&h=800",
        stock: Number(productForm.stock),
        rating: productForm.rating,
        sizes: productForm.sizes.length > 0 ? productForm.sizes : ["S", "M", "L"],
        colors: productForm.colors.length > 0 ? productForm.colors : [{ name: "Beige", hex: "#EADDC9" }],
        isNew: productForm.isNew,
        isOffer: productForm.isOffer,
        isTrending: productForm.isTrending,
      };

      // Call Supabase
      await updateSupabaseProduct(updatedProduct);

      const updated = products.map(p => {
        if (p.id === editingProductId) {
          return updatedProduct;
        }
        return p;
      });
      onUpdateProducts(updated);
      triggerNotification("¡Producto editado en Supabase con éxito!");
    } else {
      // Add mode
      const newId = `prod-${Date.now()}`;
      const newProduct: Product = {
        id: newId,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        image: productForm.image || "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600&h=800",
        rating: 5,
        stock: Number(productForm.stock),
        sizes: productForm.sizes.length > 0 ? productForm.sizes : ["S", "M", "L"],
        colors: productForm.colors.length > 0 ? productForm.colors : [{ name: "Beige", hex: "#EADDC9" }],
        isNew: productForm.isNew,
        isOffer: productForm.isOffer,
        isTrending: productForm.isTrending,
      };

      // Call Supabase
      await insertSupabaseProduct(newProduct);

      onUpdateProducts([newProduct, ...products]);
      triggerNotification("¡Nuevo producto añadido a Supabase!");
    }

    // Reset Form
    resetProductForm();
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      category: "",
      price: 29.99,
      image: "",
      stock: 15,
      rating: 5,
      sizes: ["S", "M", "L"],
      colors: [],
      isNew: false,
      isOffer: false,
      isTrending: false,
    });
    setShowProductForm(false);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      stock: product.stock,
      rating: product.rating,
      sizes: product.sizes,
      colors: product.colors,
      isNew: !!product.isNew,
      isOffer: !!product.isOffer,
      isTrending: !!product.isTrending,
    });
    setShowProductForm(true);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás segura de que deseas eliminar este producto permanentemente?")) {
      // Call Supabase
      await deleteSupabaseProduct(id);

      const filtered = products.filter(p => p.id !== id);
      onUpdateProducts(filtered);
      triggerNotification("Producto eliminado de Supabase.");
    }
  };

  // CATEGORY SUBMISSION
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      alert("Por favor rellena el nombre");
      return;
    }

    const catId = categoryForm.id || categoryForm.name.toLowerCase().replace(/\s+/g, "-");

    if (editingCategoryId) {
      // Edit
      const updatedCategory: Category = {
        id: editingCategoryId,
        name: categoryForm.name,
        image: categoryForm.image || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600&h=600",
        count: Number(categoryForm.count),
      };

      // Call Supabase
      await updateSupabaseCategory(updatedCategory);

      const updated = categories.map(c => {
        if (c.id === editingCategoryId) {
          return updatedCategory;
        }
        return c;
      });
      onUpdateCategories(updated);
      triggerNotification("Categoría editada en Supabase con éxito.");
    } else {
      // Add
      const newCat: Category = {
        id: catId,
        name: categoryForm.name,
        image: categoryForm.image || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600&h=600",
        count: Number(categoryForm.count) || 0,
      };

      // Call Supabase
      await insertSupabaseCategory(newCat);

      onUpdateCategories([...categories, newCat]);
      triggerNotification("Nueva categoría creada en Supabase.");
    }

    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryForm({
      id: "",
      name: "",
      image: "",
      count: 0,
    });
    setShowCategoryForm(false);
  };

  const handleEditCategoryClick = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      image: cat.image,
      count: cat.count,
    });
    setShowCategoryForm(true);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("¿Estás segura de que deseas eliminar esta categoría? Esto podría afectar a los productos asociados.")) {
      // Call Supabase
      await deleteSupabaseCategory(id);

      const filtered = categories.filter(c => c.id !== id);
      onUpdateCategories(filtered);
      triggerNotification("Categoría eliminada de Supabase.");
    }
  };

  return (
    <div id="admin-panel" className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-8 animate-fade-in text-[#4A3F37]">
      
      {/* 1. Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C9A98C]/25 pb-6">
        <div>
          <h2 className="font-serif text-3xl font-light text-[#352C26] tracking-wide uppercase">
            Panel de Administración
          </h2>
          <p className="font-sans text-xs text-[#8A7263] uppercase tracking-widest mt-1">
            Gestiona la colección de YCruz Shop
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div className="flex gap-2 bg-[#F5EFE7]/60 p-1.5 rounded-full border border-[#C9A98C]/20">
          <button
            onClick={() => { setActiveTab("products"); resetProductForm(); resetCategoryForm(); }}
            className={`px-5 py-2 rounded-full font-sans text-xs tracking-widest uppercase font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "products" 
                ? "bg-[#8A7263] text-white shadow-xs" 
                 : "text-[#8A7263] hover:text-[#4A3F37]"
            }`}
          >
            <ShoppingBag size={14} /> Productos
          </button>
          <button
            onClick={() => { setActiveTab("categories"); resetProductForm(); resetCategoryForm(); }}
            className={`px-5 py-2 rounded-full font-sans text-xs tracking-widest uppercase font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "categories" 
                ? "bg-[#8A7263] text-white shadow-xs" 
                : "text-[#8A7263] hover:text-[#4A3F37]"
            }`}
          >
            <Layers size={14} /> Categorías
          </button>
        </div>
      </div>

      {/* Supabase status warning */}
      {supabaseStatus?.configured && (!supabaseStatus.hasProductsTable || !supabaseStatus.hasCategoriesTable) && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 font-sans text-xs text-[#78350F] animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-sm text-[#78350F]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            ⚠️ Base de datos conectada, pero falta crear o recargar las tablas
          </div>
          <p className="leading-relaxed">
            Supabase indica que las tablas de <strong className="font-semibold text-amber-950">products</strong> y <strong className="font-semibold text-amber-950">categories</strong> aún no se encuentran listas en el esquema de tu proyecto (Error <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 text-[11px]">PGRST205</code>).
          </p>
          <p className="font-semibold leading-relaxed">
            Para solucionarlo al instante, copia y ejecuta esto en el "SQL Editor" de tu panel de Supabase y dale a "Run" para refrescar el caché:
          </p>
          <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-xl text-[11px] leading-relaxed select-all overflow-x-auto font-mono">
{`NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');`}
          </pre>
          <p className="text-[10px] text-amber-700 italic">
            * Nota: Si aún no has ejecutado el script completo de tablas, ejecuta primero el script completo que tienes en el archivo <code className="font-mono bg-amber-100/50 px-1 py-0.5 rounded text-amber-900">/supabase-setup.sql</code> de tu proyecto.
          </p>
        </div>
      )}

      {/* Floating alert */}
      {notification && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-sans text-xs font-semibold tracking-wide flex items-center gap-2 animate-scale-up-soft shadow-md max-w-sm ml-auto">
          <Check size={16} /> {notification}
        </div>
      )}

      {/* 2. PRODUCT MANAGEMENT VIEW */}
      {activeTab === "products" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-medium text-[#352C26]">
              Lista de Productos ({products.length})
            </h3>
            
            {!showProductForm && (
              <button
                onClick={() => { resetProductForm(); setShowProductForm(true); }}
                className="py-2.5 px-5 bg-[#F3CBA3] hover:bg-[#ebd2b4] text-[#352C26] font-sans text-xs tracking-widest uppercase font-bold rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Añadir Producto
              </button>
            )}
          </div>

          {/* Form to Create/Edit Product */}
          {showProductForm && (
            <div className="bg-[#FDFBF8] border border-[#C9A98C]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md animate-scale-up-soft">
              <div className="flex justify-between items-center border-b border-[#C9A98C]/15 pb-4">
                <h4 className="font-serif text-lg font-semibold text-[#352C26]">
                  {editingProductId ? "Editar Producto" : "Nuevo Producto"}
                </h4>
                <button 
                  onClick={resetProductForm}
                  className="p-1.5 rounded-full hover:bg-[#F5EFE7] text-[#8A7263]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Pijama Satinada Beige"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                  </div>

                  {/* Category select */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      Categoría *
                    </label>
                    <select
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      Precio ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price || ""}
                      onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      Stock Disponible *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.stock || 0}
                      onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      URL de la Foto
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                    <p className="text-[10px] text-[#8A7263] leading-relaxed">Puedes pegar cualquier URL de imagen de internet para que aparezca.</p>
                  </div>

                </div>

                {/* Tags / Badges flags */}
                <div className="space-y-2">
                  <span className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">Etiquetas Especiales</span>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium font-sans">
                      <input
                        type="checkbox"
                        checked={productForm.isNew}
                        onChange={(e) => setProductForm({...productForm, isNew: e.target.checked})}
                        className="rounded-md border-[#C9A98C]/40 text-[#8A7263] focus:ring-[#8A7263]"
                      />
                      <span>Novedad (NUEVO)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium font-sans">
                      <input
                        type="checkbox"
                        checked={productForm.isOffer}
                        onChange={(e) => setProductForm({...productForm, isOffer: e.target.checked})}
                        className="rounded-md border-[#C9A98C]/40 text-[#8A7263] focus:ring-[#8A7263]"
                      />
                      <span>Oferta especial (OFERTA)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium font-sans">
                      <input
                        type="checkbox"
                        checked={productForm.isTrending}
                        onChange={(e) => setProductForm({...productForm, isTrending: e.target.checked})}
                        className="rounded-md border-[#C9A98C]/40 text-[#8A7263] focus:ring-[#8A7263]"
                      />
                      <span>En Tendencia (TENDENCIA)</span>
                    </label>
                  </div>
                </div>

                {/* SIZES checkboxes */}
                <div className="space-y-2">
                  <span className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">Tallas Disponibles</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["XS", "S", "M", "L", "XL", "Única"].map((size) => {
                      const isChecked = productForm.sizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleToggleSize(size)}
                          className={`px-4 py-1.5 text-xs font-sans font-bold border rounded-lg transition-all ${
                            isChecked 
                              ? "bg-[#8A7263] border-[#8A7263] text-white" 
                              : "bg-white border-[#C9A98C]/35 text-[#4A3F37]"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* COLORS creator */}
                <div className="space-y-3 pt-1 border-t border-[#C9A98C]/10">
                  <span className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">Colores Disponibles</span>
                  
                  {/* Added colors lists */}
                  <div className="flex flex-wrap gap-2">
                    {productForm.colors.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5EFE7] border border-[#C9A98C]/30 text-xs rounded-full">
                        <span className="w-3.5 h-3.5 rounded-full inline-block border border-black/10" style={{backgroundColor: c.hex}} />
                        <span>{c.name}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveColor(i)} 
                          className="text-[#8A7263] hover:text-red-600 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {productForm.colors.length === 0 && (
                      <span className="text-xs text-[#8A7263] italic">No se han agregado colores.</span>
                    )}
                  </div>

                  {/* Add Color inputs */}
                  <div className="flex items-center gap-2 max-w-md bg-white p-2 border border-[#C9A98C]/30 rounded-xl">
                    <input
                      type="text"
                      placeholder="Nombre (ej: Lila)"
                      value={colorInputName}
                      onChange={(e) => setColorInputName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#FDFBF8] border border-transparent rounded-lg font-sans text-xs focus:outline-hidden"
                    />
                    <input
                      type="color"
                      value={colorInputHex}
                      onChange={(e) => setColorInputHex(e.target.value)}
                      className="w-10 h-8 rounded-md overflow-hidden cursor-pointer bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="py-1.5 px-3.5 bg-[#8A7263] text-white font-sans text-[10px] uppercase tracking-wider font-semibold rounded-lg hover:bg-[#6b584b]"
                    >
                      Añadir Color
                    </button>
                  </div>
                </div>

                {/* Actions submit */}
                <div className="flex gap-3 justify-end pt-4 border-t border-[#C9A98C]/15">
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="py-2.5 px-5 border border-[#C9A98C]/40 text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-full hover:bg-[#F5EFE7] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#8A7263] hover:bg-[#6b584b] text-white font-sans text-xs tracking-widest uppercase font-bold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer animate-pulse-slow"
                  >
                    <Save size={14} /> {editingProductId ? "Guardar Cambios" : "Guardar Producto"}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Table of Products */}
          <div className="bg-[#FDFBF8] border border-[#C9A98C]/20 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-[#F5EFE7] text-[#4A3F37] border-b border-[#C9A98C]/15 uppercase tracking-widest text-[10px] font-bold">
                    <th className="p-4">Foto</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Atributos</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C9A98C]/10">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FDFBF8]/50 transition-colors">
                      <td className="p-4">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-12 h-16 object-cover rounded-lg border border-[#C9A98C]/15"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-sm text-[#352C26] block">{p.name}</span>
                        <span className="text-[10px] text-[#8A7263] block">ID: {p.id}</span>
                      </td>
                      <td className="p-4 uppercase font-medium tracking-wide text-[#8A7263]">
                        {p.category.replace("-", " ")}
                      </td>
                      <td className="p-4 font-serif text-sm font-bold text-[#352C26]">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="p-4 font-semibold">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold ${p.stock > 4 ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                          {p.stock} Uds.
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-[#4A3F37] font-medium">Tallas: {p.sizes.join(", ")}</span>
                          <span className="text-[10px] text-[#4A3F37] font-medium flex items-center gap-1">
                            Colores: 
                            {p.colors.map((c, i) => (
                              <span key={i} className="w-2 h-2 rounded-full border border-black/10 inline-block" style={{backgroundColor: c.hex}} title={c.name} />
                            ))}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200 cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY MANAGEMENT VIEW */}
      {activeTab === "categories" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-medium text-[#352C26]">
              Categorías de la Tienda ({categories.length})
            </h3>
            
            {!showCategoryForm && (
              <button
                onClick={() => { resetCategoryForm(); setShowCategoryForm(true); }}
                className="py-2.5 px-5 bg-[#F3CBA3] hover:bg-[#ebd2b4] text-[#352C26] font-sans text-xs tracking-widest uppercase font-bold rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Añadir Categoría
              </button>
            )}
          </div>

          {/* Form to Create/Edit Category */}
          {showCategoryForm && (
            <div className="bg-[#FDFBF8] border border-[#C9A98C]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md animate-scale-up-soft">
              <div className="flex justify-between items-center border-b border-[#C9A98C]/15 pb-4">
                <h4 className="font-serif text-lg font-semibold text-[#352C26]">
                  {editingCategoryId ? "Editar Categoría" : "Nueva Categoría"}
                </h4>
                <button 
                  onClick={resetCategoryForm}
                  className="p-1.5 rounded-full hover:bg-[#F5EFE7] text-[#8A7263]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Category Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Conjuntos Lenceros"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                  </div>

                  {/* Count */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      Cantidad de Productos *
                    </label>
                    <input
                      type="number"
                      required
                      value={categoryForm.count || 0}
                      onChange={(e) => setCategoryForm({...categoryForm, count: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] font-semibold">
                      URL de la Foto de Portada (600x600 px aconsejado)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#C9A98C]/35 rounded-xl font-sans text-sm text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                  </div>

                </div>

                {/* Actions submit */}
                <div className="flex gap-3 justify-end pt-4 border-t border-[#C9A98C]/15">
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="py-2.5 px-5 border border-[#C9A98C]/40 text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-full hover:bg-[#F5EFE7] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#8A7263] hover:bg-[#6b584b] text-white font-sans text-xs tracking-widest uppercase font-bold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={14} /> {editingCategoryId ? "Guardar Cambios" : "Guardar Categoría"}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Table of Categories */}
          <div className="bg-[#FDFBF8] border border-[#C9A98C]/20 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-[#F5EFE7] text-[#4A3F37] border-b border-[#C9A98C]/15 uppercase tracking-widest text-[10px] font-bold">
                    <th className="p-4">Foto Portada</th>
                    <th className="p-4">ID de Categoría</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Cant. Productos</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C9A98C]/10">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FDFBF8]/50 transition-colors">
                      <td className="p-4">
                        <img 
                          src={c.image} 
                          alt={c.name} 
                          className="w-16 h-16 object-cover rounded-full border border-[#C9A98C]/25"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-4 font-mono text-[11px] text-[#8A7263]">
                        {c.id}
                      </td>
                      <td className="p-4 font-semibold text-sm text-[#352C26]">
                        {c.name}
                      </td>
                      <td className="p-4 font-semibold">
                        <span className="px-2 py-0.5 bg-[#F5EFE7] border border-[#C9A98C]/25 text-[#8A7263] rounded-md">
                          {c.count} items
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleEditCategoryClick(c)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200 cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
