import React, { useState, useEffect } from "react";
import { User, Product } from "../types";
import { User as UserIcon, Package, Heart, LogOut, CheckCircle, Truck, Clock, ShieldCheck } from "lucide-react";

interface UserPanelViewProps {
  currentUser: User;
  products: Product[];
  onLogout: () => void;
  onNavigateToShop: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function UserPanelView({
  currentUser,
  products,
  onLogout,
  onNavigateToShop,
  onAddToCart
}: UserPanelViewProps) {
  const [activeTab, setActiveTab] = useState<"perfil" | "pedidos" | "favoritos">("perfil");
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Simulated orders
  const simulatedOrders = [
    {
      id: "PED-9831",
      date: "02 de Septiembre, 2026",
      status: "procesando",
      total: 94.98,
      items: [
        { name: "Pijama Satinada Beige", size: "M", price: 49.99, quantity: 1 },
        { name: "Pijama Algodón Rosa", size: "S", price: 44.99, quantity: 1 }
      ]
    },
    {
      id: "PED-8762",
      date: "14 de Agosto, 2026",
      status: "entregado",
      total: 59.99,
      items: [
        { name: "Pijama de Seda Negra", size: "L", price: 59.99, quantity: 1 }
      ]
    }
  ];

  // Load a few random products as mock favorites for a cozy interactive experience
  useEffect(() => {
    if (products.length > 0) {
      setFavorites([products[0], products[2]].filter(Boolean));
    }
  }, [products]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 animate-fade-in space-y-10 font-sans">
      
      {/* 1. Header Area with Cozy Greeting */}
      <div className="bg-[#FDFBF8] border border-[#C9A98C]/15 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#8A7263]/10 text-[#8A7263] rounded-full flex items-center justify-center border border-[#8A7263]/20">
            <UserIcon size={32} />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="font-serif text-2xl text-[#4A3F37] font-light">
              ¡Hola, <span className="font-semibold">{currentUser.fullName}</span>!
            </h2>
            <p className="text-xs text-[#8A7263] tracking-wide">
              Qué bueno tenerte de vuelta en tu espacio de descanso YCruz.
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 border border-red-200/50 hover:bg-red-50 text-red-600 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
      </div>

      {/* 2. Grid with Tabs and Main Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Left: Tab Menu */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("perfil")}
            className={`w-full text-left px-5 py-3 rounded-2xl text-xs tracking-wider uppercase font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
              activeTab === "perfil"
                ? "bg-[#8A7263] text-white shadow-xs"
                : "bg-[#FDFBF8] text-[#8A7263] hover:bg-[#FDFBF8]/80 border border-[#C9A98C]/10"
            }`}
          >
            <UserIcon size={14} /> Mi Perfil
          </button>

          <button
            onClick={() => setActiveTab("pedidos")}
            className={`w-full text-left px-5 py-3 rounded-2xl text-xs tracking-wider uppercase font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
              activeTab === "pedidos"
                ? "bg-[#8A7263] text-white shadow-xs"
                : "bg-[#FDFBF8] text-[#8A7263] hover:bg-[#FDFBF8]/80 border border-[#C9A98C]/10"
            }`}
          >
            <Package size={14} /> Mis Pedidos
          </button>

          <button
            onClick={() => setActiveTab("favoritos")}
            className={`w-full text-left px-5 py-3 rounded-2xl text-xs tracking-wider uppercase font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
              activeTab === "favoritos"
                ? "bg-[#8A7263] text-white shadow-xs"
                : "bg-[#FDFBF8] text-[#8A7263] hover:bg-[#FDFBF8]/80 border border-[#C9A98C]/10"
            }`}
          >
            <Heart size={14} /> Favoritos ({favorites.length})
          </button>
        </div>

        {/* Right: Content panel */}
        <div className="md:col-span-3 bg-[#FDFBF8] border border-[#C9A98C]/15 rounded-3xl p-6 md:p-8 min-h-[350px] shadow-xs">
          
          {/* TAB 1: PROFILE */}
          {activeTab === "perfil" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#C9A98C]/10 pb-4">
                <h3 className="font-serif text-lg text-[#4A3F37] font-medium">Información de Cuenta</h3>
                <p className="text-xs text-[#8A7263]">Detalles personales de tu perfil</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs tracking-wide">
                <div className="space-y-1">
                  <p className="text-[#8A7263] uppercase text-[9px] font-bold">Nombre Completo</p>
                  <p className="text-[#4A3F37] text-sm font-medium">{currentUser.fullName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[#8A7263] uppercase text-[9px] font-bold">Correo Electrónico</p>
                  <p className="text-[#4A3F37] text-sm font-medium">{currentUser.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[#8A7263] uppercase text-[9px] font-bold">Tipo de Cliente</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#4A3F37]">
                    <span>{currentUser.isAdmin ? "Administrador General ✨" : "Cliente Exclusivo YCruz 🌸"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[#8A7263] uppercase text-[9px] font-bold">Estado de Cuenta</p>
                  <div className="flex items-center gap-1.5 text-green-600 font-semibold text-xs uppercase tracking-wider">
                    <ShieldCheck size={14} /> Verificado y Activo
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#C9A98C]/10 space-y-3">
                <h4 className="font-serif text-sm text-[#4A3F37] font-medium">Dirección de Envío</h4>
                <p className="text-xs text-[#8A7263] leading-relaxed">
                  No has registrado ninguna dirección aún. Agrégala al realizar tu primer pedido en la tienda.
                </p>
                <button
                  onClick={onNavigateToShop}
                  className="px-5 py-2 bg-[#8A7263] hover:bg-[#6B5A4C] text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Explorar Tienda
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SIMULATED ORDERS */}
          {activeTab === "pedidos" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#C9A98C]/10 pb-4">
                <h3 className="font-serif text-lg text-[#4A3F37] font-medium">Historial de Pedidos</h3>
                <p className="text-xs text-[#8A7263]">Monitorea tus órdenes y envíos</p>
              </div>

              {simulatedOrders.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <p className="text-xs text-[#8A7263]">Aún no has realizado ningún pedido.</p>
                  <button
                    onClick={onNavigateToShop}
                    className="px-5 py-2.5 bg-[#8A7263] hover:bg-[#6B5A4C] text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Ver Colección Completa
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {simulatedOrders.map((order) => (
                    <div key={order.id} className="border border-[#C9A98C]/15 rounded-2xl p-4 md:p-5 space-y-4 bg-white shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div className="space-y-1">
                          <p className="font-serif text-sm text-[#4A3F37] font-semibold">{order.id}</p>
                          <p className="text-[10px] text-[#8A7263]">{order.date}</p>
                        </div>

                        {/* Status badges */}
                        {order.status === "procesando" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-semibold uppercase tracking-wider max-w-fit">
                            <Clock size={11} /> Procesando
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-semibold uppercase tracking-wider max-w-fit">
                            <CheckCircle size={11} /> Entregado
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-[#4A3F37]">
                            <p className="font-light">
                              {item.name} <span className="text-[#8A7263]">({item.size})</span> x{item.quantity}
                            </p>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                        <p className="text-[#8A7263]">Monto Total:</p>
                        <p className="text-sm font-semibold text-[#8A7263]">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === "favoritos" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#C9A98C]/10 pb-4">
                <h3 className="font-serif text-lg text-[#4A3F37] font-medium">Mis Favoritos</h3>
                <p className="text-xs text-[#8A7263]">Prendas exclusivas guardadas en tu wishlist</p>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <p className="text-xs text-[#8A7263]">No tienes prendas guardadas.</p>
                  <button
                    onClick={onNavigateToShop}
                    className="px-5 py-2.5 bg-[#8A7263] hover:bg-[#6B5A4C] text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Ver Colección Completa
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 bg-white border border-[#C9A98C]/10 rounded-2xl p-3.5 shadow-2xs">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                        <div className="space-y-0.5">
                          <h4 className="font-serif text-[#4A3F37] font-medium truncate">{product.name}</h4>
                          <p className="text-[#8A7263] font-semibold">${product.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onAddToCart(
                                product, 
                                product.sizes[0] || "M", 
                                product.colors[0] || { name: "Beige", hex: "#EADDC9" }
                              );
                            }}
                            className="bg-[#8A7263] hover:bg-[#6B5A4C] text-white px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Bolsa
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(product.id)}
                            className="text-red-500 hover:text-red-700 text-[10px] tracking-wider uppercase font-semibold cursor-pointer"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
