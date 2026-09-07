import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Product, CartItem, User, Category } from "./types";
import { products, categories } from "./data";
import { getSupabaseProducts, getSupabaseCategories } from "./supabaseService";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ShopView from "./components/ShopView";
import LoginModal from "./components/LoginModal";
import CartDrawer from "./components/CartDrawer";
import AdminView from "./components/AdminView";
import UserPanelView from "./components/UserPanelView";
import ProductDetailModal from "./components/ProductDetailModal";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin" | "user-panel">("inicio");
  
  // Dynamic collections
  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("ycruz_products");
      return saved ? JSON.parse(saved) : products;
    } catch {
      return products;
    }
  });

  const [categoryList, setCategoryList] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem("ycruz_categories");
      return saved ? JSON.parse(saved) : categories;
    } catch {
      return categories;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("ycruz_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("ycruz_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Connection and tables status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    hasProductsTable: boolean;
    hasCategoriesTable: boolean;
    errorMsg?: string;
  }>({
    configured: isSupabaseConfigured,
    hasProductsTable: true,
    hasCategoriesTable: true
  });

  // Fetch products, categories and restore session from Supabase on mount
  useEffect(() => {
    async function loadSupabaseData() {
      if (isSupabaseConfigured) {
        try {
          const remoteProducts = await getSupabaseProducts();
          const remoteCategories = await getSupabaseCategories();

          setSupabaseStatus({
            configured: true,
            hasProductsTable: remoteProducts !== null,
            hasCategoriesTable: remoteCategories !== null,
            errorMsg: (!remoteProducts || !remoteCategories) ? "Falta crear las tablas en Supabase. Por favor ejecuta el script de SQL en tu panel de Supabase." : undefined
          });

          if (remoteProducts && remoteProducts.length > 0) {
            setProductList(remoteProducts);
          }
          if (remoteCategories && remoteCategories.length > 0) {
            setCategoryList(remoteCategories);
          }
        } catch (err: any) {
          console.error("Error loading Supabase data:", err);
          setSupabaseStatus(prev => ({
            ...prev,
            errorMsg: err?.message || "Error al conectar con Supabase."
          }));
        }

        // Restore active user session from Supabase Auth
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            const userMeta = session.user.user_metadata;
            setCurrentUser({
              email: session.user.email || "",
              fullName: userMeta?.fullName || userMeta?.full_name || session.user.email?.split("@")[0] || "",
              isLoggedIn: true,
            });
          }
        } catch (err) {
          console.error("Error restoring user session:", err);
        }
      }
    }
    loadSupabaseData();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("ycruz_products", JSON.stringify(productList));
  }, [productList]);

  useEffect(() => {
    localStorage.setItem("ycruz_categories", JSON.stringify(categoryList));
  }, [categoryList]);

  useEffect(() => {
    localStorage.setItem("ycruz_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ycruz_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("ycruz_user");
    }
  }, [currentUser]);

  // Safeguard: Redirect to homepage if user tries to access admin tab or user-panel without permissions
  useEffect(() => {
    const isAdmin = !!(currentUser && (
      currentUser.isAdmin ||
      currentUser.email.toLowerCase() === "admin@ycruz.com" ||
      currentUser.email.toLowerCase() === "disenamecorporation@gmail.com" ||
      currentUser.email.toLowerCase() === "ycruzshop@gmail.com" ||
      currentUser.email.toLowerCase().includes("admin")
    ));
    if (currentTab === "admin" && !isAdmin) {
      setCurrentTab("inicio");
    }
    if (currentTab === "user-panel" && !currentUser) {
      setCurrentTab("inicio");
    }
  }, [currentUser, currentTab]);

  // Actions
  const handleAddToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { product, quantity: 1, selectedSize: size, selectedColor: color }];
      }
    });
    // Open Cart Drawer instantly for elegant user feedback
    setCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Error signing out from Supabase:", err);
      }
    }
    setCurrentUser(null);
    setCurrentTab("inicio");
  };

  const handleNavigateToShop = (categoryFilter?: string) => {
    setShopCategoryFilter(categoryFilter || "");
    setCurrentTab("tienda");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSubmitted(true);
    setContactName("");
    setContactEmail("");
    setContactMsg("");
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE7] text-[#4A3F37] flex flex-col justify-between font-sans">
      
      {/* 1. Header with navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === "nuevo") {
            // "Nuevo" navigates to Shop and applies "Pijamas Clásicas" or resets with isNew
            setShopCategoryFilter("");
            setCurrentTab("tienda");
          } else {
            setCurrentTab(tab);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Views */}
      <main className="flex-1">
        {currentTab === "inicio" && (
          <HomeView
            products={productList}
            categories={categoryList}
            onAddToCart={handleAddToCart}
            onNavigateToShop={handleNavigateToShop}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentTab === "tienda" && (
          <ShopView
            products={productList}
            initialCategoryFilter={shopCategoryFilter}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentTab === "sobre-nosotros" && (
          <section className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-fade-in space-y-12">
            <div className="text-center space-y-3">
              <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase font-light text-[#4A3F37]">
                Sobre Nosotros
              </h2>
              <p className="font-sans text-xs tracking-widest text-[#8A7263] uppercase">
                Filosofía de descanso YCruz
              </p>
              <div className="w-16 h-[1px] bg-[#C9A98C] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6 leading-relaxed font-sans text-sm text-[#4A3F37]/90 font-light">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://i.postimg.cc/7Y6tqRfP/logowebpsd.png" 
                    alt="YCruz Logo Icon" 
                    className="h-10 object-contain"
                  />
                  <strong className="text-[#8A7263] text-lg font-serif">YCruz Shop</strong>
                </div>
                <p>
                  En <strong className="text-[#8A7263] font-semibold">YCruz Shop</strong> pensamos que el verdadero lujo empieza al final del día. Creemos que la ropa de dormir no es solo una prenda, sino un ritual de bienestar, amor propio y desconexión.
                </p>
                <p>
                  Nuestra estética aspiracional y relajada busca ofrecerte diseños que abracen tus sueños con la mayor suavidad imaginable. Seleccionamos cuidadosamente fibras de satin premium, seda sintética y el algodón más puro para crear piezas clásicas y atemporales.
                </p>
                <p className="font-serif italic text-[#8A7263] text-base border-l-2 border-[#C9A98C] pl-3.5 py-1">
                  "Duerme para soñar, descansa para vivir."
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#C9A98C]/20 shadow-md aspect-square md:aspect-[4/3]">
                <img
                  src="https://i.postimg.cc/SxnPfP4h/Chat-GPT-Image-3-sept-2026-07-19-14-p-m.png"
                  alt="Elegant silk pajamas lifestyle (YCruz Hero)"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {currentTab === "admin" && (
          <AdminView
            products={productList}
            categories={categoryList}
            onUpdateProducts={setProductList}
            onUpdateCategories={setCategoryList}
            supabaseStatus={supabaseStatus}
          />
        )}

        {currentTab === "user-panel" && currentUser && (
          <UserPanelView
            currentUser={currentUser}
            products={productList}
            onLogout={handleLogout}
            onNavigateToShop={() => handleNavigateToShop()}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentTab === "contacto" && (
          <section className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-fade-in space-y-12">
            <div className="text-center space-y-3">
              <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase font-light text-[#4A3F37]">
                Contacto
              </h2>
              <p className="font-sans text-xs tracking-widest text-[#8A7263] uppercase">
                Estamos aquí para atenderte
              </p>
              <div className="w-16 h-[1px] bg-[#C9A98C] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Info panel */}
              <div className="md:col-span-5 bg-[#FDFBF8] p-6 rounded-2xl border border-[#C9A98C]/15 space-y-6">
                <h3 className="font-serif text-lg text-[#4A3F37] font-medium tracking-wide">
                  Atención Directa
                </h3>
                
                <div className="space-y-4 font-sans text-xs text-[#8A7263] tracking-wide">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-[#F5EFE7] rounded-full text-[#8A7263]">
                      <Mail size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#4A3F37]">Email</p>
                      <p>contacto@ycruzshop.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-[#F5EFE7] rounded-full text-[#8A7263]">
                      <Phone size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#4A3F37]">Teléfono / WhatsApp</p>
                      <p>+54 11 3456-7890</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-[#F5EFE7] rounded-full text-[#8A7263]">
                      <MapPin size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#4A3F37]">Showroom</p>
                      <p>Recoleta, Buenos Aires, Argentina</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#C9A98C]/10 text-[11px] leading-relaxed text-[#8A7263]/90">
                  <p><strong>Horarios:</strong> Lunes a Viernes de 10:00 a 19:00 hs. Sábados de 10:00 a 14:00 hs.</p>
                </div>
              </div>

              {/* Form panel */}
              <div className="md:col-span-7 bg-[#FDFBF8] p-6 sm:p-8 rounded-2xl border border-[#C9A98C]/15 shadow-xs">
                {contactSubmitted ? (
                  <div className="text-center py-8 space-y-3.5 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 border border-green-100 rounded-full text-green-600 shadow-xs">
                      <CheckCircle size={26} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg text-[#4A3F37] font-semibold">¡Mensaje Recibido!</h4>
                      <p className="font-sans text-xs text-[#8A7263] max-w-sm mx-auto leading-relaxed">
                        Gracias por escribirnos. Nuestro equipo de atención personalizada se pondrá en contacto contigo en las próximas horas.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-sans tracking-widest uppercase text-[#8A7263]">Nombre</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Escribe tu nombre"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#C9A98C]/30 rounded-xl font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263] placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-sans tracking-widest uppercase text-[#8A7263]">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#C9A98C]/30 rounded-xl font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263] placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-sans tracking-widest uppercase text-[#8A7263]">Mensaje</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="¿Cómo te podemos ayudar?"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#C9A98C]/30 rounded-xl font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263] placeholder-gray-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 bg-[#F3CBA3] hover:bg-[#ebd2b4] text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-full shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Enviar Mensaje <Send size={12} />
                    </button>
                  </form>
                )}
              </div>

            </div>
          </section>
        )}
      </main>

      {/* 3. Footer row */}
      <Footer />

      {/* 4. Elegant Overlays: Login Modal & Cart Drawer */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 5. Product Quick View Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}
