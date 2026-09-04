import { useState } from "react";
import { Search, ShoppingBag, User as UserIcon, Menu, X } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  currentTab: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin";
  onTabChange: (tab: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin") => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export default function Header({
  currentTab,
  onTabChange,
  cartCount,
  onOpenCart,
  onOpenLogin,
  currentUser,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = currentUser && (
    currentUser.email.toLowerCase() === "admin@ycruz.com" || 
    currentUser.email.toLowerCase() === "disenamecorporation@gmail.com" || 
    currentUser.email.toLowerCase().includes("admin")
  );

  const menuItems: { id: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin"; label: string }[] = [
    { id: "inicio", label: "Inicio" },
    { id: "tienda", label: "Tienda" },
    { id: "nuevo", label: "Nuevo" },
    { id: "sobre-nosotros", label: "Sobre Nosotros" },
    { id: "contacto", label: "Contacto" },
    ...(isAdmin ? [{ id: "admin", label: "✨ Admin" } as const] : []),
  ];

  const handleNavClick = (tabId: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin") => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-40 shadow-xs">
      {/* Topbar - Drastically smaller */}
      <div className="w-full bg-[#6B5A4C] text-[#FDFBF8] py-1.5 px-4 text-center">
        <p className="font-sans text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.25em] uppercase font-bold text-[#FDFBF8]/95">
          Envíos a todo el país • Cambios fáciles y rápidos
        </p>
      </div>

      {/* Main Header Row */}
      <div class="w-full bg-[#8A7263]/90 backdrop-blur-md border-b border-[#C9A98C]/15 px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between text-white">
        
        {/* Left: Logo YCruz */}
        <div class="flex items-center">
          <button 
            onClick={() => handleNavClick("inicio")} 
            class="focus:outline-hidden cursor-pointer"
          >
            <img 
              src="https://i.postimg.cc/7Y6tqRfP/logowebpsd.png" 
              alt="YCruz Logo" 
              class="h-11 md:h-14 lg:h-16 object-contain" 
            />
          </button>
        </div>

        {/* Center: Desktop Navigation Menu */}
        <nav class="hidden md:flex items-center gap-6 lg:gap-8">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                class={`font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 relative py-2 cursor-pointer ${
                  isActive ? "text-[#FDFBF8] font-medium" : "text-[#FDFBF8]/75 hover:text-[#FDFBF8]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#C9A98C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div class="flex items-center gap-3 md:gap-5">
          {/* Search bar integration */}
          <div class="relative flex items-center">
            {searchOpen && (
              <input
                type="text"
                placeholder="Buscar pijama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="absolute right-8 top-1/2 -translate-y-1/2 bg-[#FDFBF8] text-[#4A3F37] rounded-full px-4 py-1.5 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#8A7263] border border-[#C9A98C]/30 w-36 sm:w-48 transition-all animate-fade-in"
              />
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              class="p-2 text-white hover:text-[#F3CBA3] transition-colors focus:outline-hidden cursor-pointer"
              title="Buscar"
            >
              <Search size={18} />
            </button>
          </div>

          {/* User profile action */}
          <div class="relative">
            {currentUser ? (
              <div class="flex items-center gap-1.5">
                <button
                  onClick={onLogout}
                  class="p-2 text-white hover:text-[#F3CBA3] transition-colors focus:outline-hidden font-sans text-[10px] tracking-widest uppercase cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <span class="hidden lg:inline mr-1">{currentUser.fullName}</span>
                  <UserIcon size={18} class="inline" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                class="p-2 text-white hover:text-[#F3CBA3] transition-colors focus:outline-hidden cursor-pointer"
                title="Iniciar Sesión / Registrarse"
              >
                <UserIcon size={18} />
              </button>
            )}
          </div>

          {/* Cart triggers */}
          <button
            onClick={onOpenCart}
            class="p-2 text-white hover:text-[#F3CBA3] transition-colors relative focus:outline-hidden cursor-pointer"
            title="Bolsa de compras"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span class="absolute -top-1 -right-1 w-4 h-4 bg-[#F3CBA3] text-[#4A3F37] text-[9px] font-sans font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburguer trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            class="md:hidden p-2 text-white hover:text-[#F3CBA3] transition-colors focus:outline-hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div class="md:hidden absolute top-full left-0 w-full bg-[#8A7263] border-b border-[#C9A98C]/25 text-white py-6 px-6 flex flex-col gap-4 shadow-xl z-50 animate-fade-in">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                class={`font-sans text-xs tracking-widest uppercase text-left py-2.5 border-b border-white/5 cursor-pointer ${
                  isActive ? "text-[#F3CBA3] font-medium" : "text-white/80"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
