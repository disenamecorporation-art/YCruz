import { useState } from "react";
import { Search, ShoppingBag, User as UserIcon, Menu, X, LogOut, Shield } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  currentTab: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin" | "user-panel";
  onTabChange: (tab: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin" | "user-panel") => void;
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

  const isAdmin = !!(currentUser && (
    currentUser.isAdmin ||
    currentUser.email.toLowerCase() === "admin@ycruz.com" || 
    currentUser.email.toLowerCase() === "disenamecorporation@gmail.com" || 
    currentUser.email.toLowerCase() === "ycruzshop@gmail.com" ||
    currentUser.email.toLowerCase().includes("admin")
  ));

  const menuItems: { id: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin" | "user-panel"; label: string }[] = [
    { id: "inicio", label: "Inicio" },
    { id: "tienda", label: "Tienda" },
    { id: "nuevo", label: "Nuevo" },
    { id: "sobre-nosotros", label: "Sobre Nosotros" },
    { id: "contacto", label: "Contacto" },
    ...(currentUser ? [{ id: "user-panel" as const, label: "Mi Cuenta" }] : []),
    ...(isAdmin ? [{ id: "admin" as const, label: "Admin" }] : []),
  ];

  const handleNavClick = (tabId: "inicio" | "tienda" | "nuevo" | "sobre-nosotros" | "contacto" | "admin" | "user-panel") => {
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
      <div className="w-full bg-[#8A7263]/90 backdrop-blur-md border-b border-[#C9A98C]/15 px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between text-white">
        
        {/* Left: Logo YCruz */}
        <div className="flex items-center">
          <button 
            onClick={() => handleNavClick("inicio")} 
            className="focus:outline-hidden cursor-pointer"
          >
            <img 
              src="https://i.postimg.cc/7Y6tqRfP/logowebpsd.png" 
              alt="YCruz Logo" 
              className="h-11 md:h-14 lg:h-16 object-contain" 
            />
          </button>
        </div>

        {/* Center: Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 relative py-2 cursor-pointer ${
                  isActive ? "text-[#FDFBF8] font-medium" : "text-[#FDFBF8]/75 hover:text-[#FDFBF8]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#C9A98C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search bar integration */}
          <div className="relative flex items-center">
            {searchOpen && (
              <input
                type="text"
                placeholder="Buscar pijama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#FDFBF8] text-[#4A3F37] rounded-full px-4 py-1.5 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#8A7263] border border-[#C9A98C]/30 w-36 sm:w-48 transition-all animate-fade-in"
              />
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white hover:text-[#F3CBA3] transition-colors focus:outline-hidden cursor-pointer"
              title="Buscar"
            >
              <Search size={18} />
            </button>
          </div>

          {/* User profile action */}
          <div className="relative">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick("user-panel")}
                  className={`p-1.5 px-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all font-sans text-[10px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 ${
                    currentTab === "user-panel" ? "bg-white/15 border-white" : ""
                  }`}
                  title="Mi Cuenta"
                >
                  <UserIcon size={14} />
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">{currentUser.fullName}</span>
                </button>
                
                <button
                  onClick={onLogout}
                  className="p-1.5 text-white/80 hover:text-red-300 transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="p-2 text-white hover:text-[#F3CBA3] transition-colors focus:outline-hidden cursor-pointer flex items-center gap-1.5"
                title="Iniciar Sesión / Registrarse"
              >
                <UserIcon size={18} />
                <span className="hidden lg:inline font-sans text-[10px] tracking-widest uppercase font-semibold">Ingresar</span>
              </button>
            )}
          </div>

          {/* Cart triggers */}
          <button
            onClick={onOpenCart}
            className="p-2 text-white hover:text-[#F3CBA3] transition-colors relative focus:outline-hidden cursor-pointer"
            title="Bolsa de compras"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F3CBA3] text-[#4A3F37] text-[9px] font-sans font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburguer trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-[#F3CBA3] transition-colors focus:outline-hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#8A7263] border-b border-[#C9A98C]/25 text-white py-6 px-6 flex flex-col gap-4 shadow-xl z-50 animate-fade-in">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-sans text-xs tracking-widest uppercase text-left py-2.5 border-b border-white/5 cursor-pointer ${
                  isActive ? "text-[#F3CBA3] font-medium" : "text-white/80"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Mobile User/Session Row */}
          <div className="pt-4 border-t border-white/10 mt-2">
            {currentUser ? (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-[#F3CBA3]">
                  Sesión iniciada como: <strong className="font-semibold">{currentUser.fullName}</strong>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNavClick("user-panel")}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Ver Mi Cuenta
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-100 text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={12} /> Salir
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full bg-[#F3CBA3] text-[#4A3F37] text-center py-3 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserIcon size={14} /> Iniciar Sesión / Registrarse
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
