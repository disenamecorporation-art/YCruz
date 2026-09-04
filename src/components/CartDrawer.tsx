import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, Check, ArrowLeft, Send } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout_form" | "loading" | "success">("cart");

  // Checkout Form States
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pago Móvil");
  const [customerNotes, setCustomerNotes] = useState("");
  const [generatedOrderNum, setGeneratedOrderNum] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 4.99;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === "ycruz10" || promoCode.trim().toLowerCase() === "bienvenida") {
      setPromoApplied(true);
    } else {
      alert("Código promocional inválido. Prueba con 'YCRUZ10' para 10% OFF.");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep("checkout_form");
  };

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim() || !customerCity.trim()) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const orderNum = `YC-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderNum(orderNum);
    setCheckoutStep("loading");

    const orderDate = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    let productsText = "";
    cart.forEach((item) => {
      productsText += `• *${item.quantity}x* ${item.product.name} (Talla: ${item.selectedSize}, Color: ${item.selectedColor.name}) - $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });

    const finalTotal = total;

    const message = `🌟 *NUEVO PEDIDO - YCRUZ SHOP (VENEZUELA)* 🌟\n\n` +
      `*Código:* #${orderNum}\n` +
      `*Fecha:* ${orderDate}\n\n` +
      `👤 *DATOS DEL CLIENTE:*\n` +
      `• *Nombre:* ${customerName.trim()}\n` +
      `• *Teléfono:* ${customerPhone.trim()}\n` +
      `• *Dirección:* ${customerAddress.trim()}\n` +
      `• *Ciudad/Estado:* ${customerCity.trim()}\n` +
      `• *Método de Pago:* ${paymentMethod}\n` +
      (customerNotes.trim() ? `• *Notas:* ${customerNotes.trim()}\n` : "") +
      `\n` +
      `🛍️ *DETALLE DEL PEDIDO:*\n` +
      productsText +
      `\n` +
      `💰 *RESUMEN DE PAGO:*\n` +
      `• *Subtotal:* $${subtotal.toFixed(2)}\n` +
      (promoApplied ? `• *Cupón (YCRUZ10):* -$${discount.toFixed(2)}\n` : "") +
      `• *Envío:* ${shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}\n` +
      `• *TOTAL A PAGAR:* *$${finalTotal.toFixed(2)}*\n\n` +
      `---\n` +
      `Muchas gracias por comprar en *YCruz Shop*. ¡Aguardamos tu contacto para coordinar la entrega en Venezuela! 🛌✨`;

    const cleanPhone = "584123456789"; 
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setCheckoutStep("success");
      window.open(waUrl, "_blank");
    }, 1500);
  };

  const handleCloseSuccess = () => {
    onClearCart();
    setCheckoutStep("cart");
    setPromoApplied(false);
    setPromoCode("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerCity("");
    setCustomerNotes("");
    onClose();
  };

  return (
    <div id="cart-drawer-overlay" class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-all">
      {/* Click outside target */}
      <div class="absolute inset-0 -z-10" onClick={onClose} />

      <div id="cart-drawer-container" class="w-full max-w-md h-full bg-[#FDFBF8] shadow-2xl flex flex-col justify-between border-l border-[#C9A98C]/20 relative animate-slide-in">
        {/* Top Header */}
        <div class="p-6 border-b border-[#C9A98C]/15 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <ShoppingBag size={20} class="text-[#8A7263]" />
            <h3 class="font-serif text-lg text-[#4A3F37] font-medium tracking-wide">Tu Bolsa de Compra</h3>
            <span class="bg-[#F5EFE7] text-[#8A7263] text-xs font-sans font-medium px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            class="p-1.5 rounded-full text-[#4A3F37]/60 hover:text-[#4A3F37] hover:bg-[#F5EFE7] transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {checkoutStep === "cart" && (
          <>
            {/* Scrollable Cart Items */}
            <div class="flex-1 overflow-y-auto p-6 space-y-5">
              {cart.length === 0 ? (
                <div class="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div class="w-16 h-16 rounded-full bg-[#F5EFE7] flex items-center justify-center text-[#8A7263]">
                    <ShoppingBag size={30} />
                  </div>
                  <div>
                    <h4 class="font-serif text-lg text-[#4A3F37] font-medium">Bolsa vacía</h4>
                    <p class="font-sans text-xs text-[#8A7263] mt-1 max-w-[240px] leading-relaxed">
                      Explora nuestras colecciones y añade tus pijamas favoritas para sentir la suavidad.
                    </p>
                  </div>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} class="flex gap-4 p-3 bg-white rounded-xl border border-[#C9A98C]/10 shadow-xs relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      class="w-20 h-24 object-cover rounded-lg bg-[#F5EFE7]"
                    />
                    <div class="flex-1 flex flex-col justify-between">
                      <div>
                        <div class="flex justify-between items-start gap-1">
                          <h4 class="font-sans text-xs uppercase tracking-wider font-semibold text-[#4A3F37] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            class="text-[#8A7263]/50 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-1.5 text-[10px] font-sans text-[#8A7263] uppercase tracking-wider">
                          <span class="bg-[#F5EFE7] px-2 py-0.5 rounded-sm">Talla: {item.selectedSize}</span>
                          <span class="bg-[#F5EFE7] px-2 py-0.5 rounded-sm flex items-center gap-1">
                            Color:
                            <span
                              class="w-2 h-2 rounded-full inline-block border border-gray-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        </div>
                      </div>

                      <div class="flex justify-between items-center mt-2">
                        {/* Quantity controls */}
                        <div class="flex items-center border border-[#C9A98C]/30 rounded-md bg-[#FDFBF8]">
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            class="p-1 px-2 text-[#8A7263] hover:bg-[#F5EFE7] active:bg-[#C9A98C]/20 disabled:opacity-40 transition-all cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span class="px-2.5 text-xs font-sans text-[#4A3F37] font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            class="p-1 px-2 text-[#8A7263] hover:bg-[#F5EFE7] active:bg-[#C9A98C]/20 transition-all cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Price */}
                        <span class="font-serif text-sm font-medium text-[#4A3F37]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom calculation & checkout */}
            {cart.length > 0 && (
              <div class="p-6 bg-[#FDFBF8] border-t border-[#C9A98C]/15 space-y-4 shadow-[0_-8px_24px_rgba(107,90,76,0.03)]">
                {/* Promo Code section */}
                {!promoApplied ? (
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="CÓDIGO DE CUPÓN (Ej: YCRUZ10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      class="flex-1 px-3 py-2 bg-white border border-[#C9A98C]/20 rounded-lg font-sans text-[11px] tracking-wider uppercase text-[#4A3F37] placeholder-[#8A7263]/50 focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                    />
                    <button
                      onClick={handleApplyPromo}
                      class="px-4 py-2 bg-[#F5EFE7] hover:bg-[#C9A98C]/20 text-[#4A3F37] font-sans text-[11px] tracking-widest uppercase font-semibold rounded-lg transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                ) : (
                  <div class="flex items-center justify-between p-2.5 bg-green-50 border border-green-100 rounded-lg text-green-700 text-xs font-sans">
                    <span class="flex items-center gap-1.5">
                      <Check size={14} /> Cupón YCRUZ10 aplicado (10% OFF)
                    </span>
                    <button
                      onClick={() => setPromoApplied(false)}
                      class="text-green-700/60 hover:text-green-800 underline uppercase text-[9px] tracking-wider"
                    >
                      Quitar
                    </button>
                  </div>
                )}

                {/* Pricing Summary */}
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-sans text-[#8A7263]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div class="flex justify-between text-xs font-sans text-green-600">
                      <span>Descuento (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div class="flex justify-between text-xs font-sans text-[#8A7263]">
                    <span>Envío</span>
                    <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p class="text-[9px] font-sans text-amber-600 text-right">
                      ¡Agrega ${(100 - subtotal).toFixed(2)} más para envío gratis!
                    </p>
                  )}
                  <div class="h-[1px] bg-[#C9A98C]/15 my-2" />
                  <div class="flex justify-between items-baseline">
                    <span class="font-serif text-sm font-medium text-[#4A3F37]">Total</span>
                    <span class="font-serif text-xl font-bold text-[#4A3F37]">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* CTA Checkout */}
                <button
                  id="btn-checkout"
                  onClick={handleCheckout}
                  class="w-full py-3.5 px-6 bg-[#F3CBA3] hover:bg-[#ebd2b4] active:bg-[#e4be95] text-[#4A3F37] font-sans text-xs tracking-widest uppercase font-semibold rounded-full shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </>
        )}

        {checkoutStep === "checkout_form" && (
          <form onSubmit={handleSendWhatsAppOrder} class="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Header / Back Action */}
            <div class="px-6 py-4 bg-[#F5EFE7]/50 border-b border-[#C9A98C]/15 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCheckoutStep("cart")}
                class="p-1 rounded-full text-[#8A7263] hover:bg-[#C9A98C]/20 transition-all cursor-pointer"
                title="Volver a la bolsa"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h4 class="font-serif text-sm font-semibold text-[#4A3F37]">Datos de Envío</h4>
                <p class="font-sans text-[10px] text-[#8A7263]">Completa para finalizar por WhatsApp</p>
              </div>
            </div>

            {/* Scrollable Fields */}
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <div class="space-y-1">
                <label class="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#8A7263]">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofía Rodríguez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  class="w-full px-3 py-2 bg-white border border-[#C9A98C]/25 rounded-lg font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                />
              </div>

              <div class="space-y-1">
                <label class="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#8A7263]">
                  Teléfono (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +58 412 1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  class="w-full px-3 py-2 bg-white border border-[#C9A98C]/25 rounded-lg font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                />
              </div>

              <div class="space-y-1">
                <label class="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#8A7263]">
                  Dirección de Entrega *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Calle, Sector, Urbanización, Edificio / Casa"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  class="w-full px-3 py-2 bg-white border border-[#C9A98C]/25 rounded-lg font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                />
              </div>

              <div class="space-y-1">
                <label class="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#8A7263]">
                  Ciudad / Estado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Chacao, Caracas / Zulia"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  class="w-full px-3 py-2 bg-white border border-[#C9A98C]/25 rounded-lg font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                />
              </div>

              <div class="space-y-1">
                <label class="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#8A7263]">
                  Método de Pago *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  class="w-full px-3 py-2 bg-white border border-[#C9A98C]/25 rounded-lg font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263]"
                >
                  <option value="Pago Móvil">Pago Móvil</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Binance Pay (USDT)">Binance Pay (USDT)</option>
                  <option value="Zelle">Zelle</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block font-sans text-[10px] uppercase tracking-wider font-bold text-[#8A7263]">
                  Notas adicionales (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Talla alternativa, indicaciones para la entrega, etc."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  class="w-full px-3 py-2 bg-white border border-[#C9A98C]/25 rounded-lg font-sans text-xs text-[#4A3F37] focus:outline-hidden focus:ring-1 focus:ring-[#8A7263] resize-none"
                />
              </div>
            </div>

            {/* Price Preview and CTA Submit */}
            <div class="p-6 bg-[#FDFBF8] border-t border-[#C9A98C]/15 space-y-4 shadow-[0_-8px_24px_rgba(107,90,76,0.03)]">
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-sans text-[#8A7263]">
                  <span>Subtotal + Envío</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between items-baseline pt-1.5 border-t border-[#C9A98C]/10">
                  <span class="font-serif text-sm font-medium text-[#4A3F37]">Total a Pagar</span>
                  <span class="font-serif text-lg font-bold text-[#4A3F37]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                class="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-sans text-xs tracking-widest uppercase font-semibold rounded-full shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                Enviar Pedido por WhatsApp
              </button>
            </div>
          </form>
        )}

        {checkoutStep === "loading" && (
          <div class="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 bg-white">
            <div class="w-14 h-14 border-3 border-[#8A7263] border-t-transparent rounded-full animate-spin" />
            <h4 class="font-serif text-lg text-[#4A3F37] font-medium">Procesando tu pedido...</h4>
            <p class="font-sans text-xs text-[#8A7263] max-w-xs">
              Estamos validando la disponibilidad y preparando tu confirmación segura de YCruz.
            </p>
          </div>
        )}

        {checkoutStep === "success" && (
          <div class="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6 bg-white animate-fade-in">
            <div class="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200 shadow-xs">
              <Check size={36} />
            </div>
            <div class="space-y-2">
              <h4 class="font-serif text-xl text-[#4A3F37] font-semibold">¡Pedido Enviado!</h4>
              <p class="font-sans text-xs text-[#8A7263] max-w-xs leading-relaxed">
                Hemos enviado el detalle de tu pedido a nuestro canal de WhatsApp de **YCruz Shop**. Haz clic abajo si necesitas volver a enviar o sigue explorando.
              </p>
            </div>
            <div class="p-4 bg-[#F5EFE7]/40 rounded-xl w-full border border-[#C9A98C]/15 font-sans text-[11px] text-left space-y-1.5">
              <div class="flex justify-between font-semibold text-[#4A3F37]">
                <span>Código de Pedido:</span>
                <span>#{generatedOrderNum}</span>
              </div>
              <div class="flex justify-between">
                <span>Método de Envío:</span>
                <span>Envío Rápido Asegurado</span>
              </div>
              <div class="flex justify-between">
                <span>Método de Pago:</span>
                <span>{paymentMethod}</span>
              </div>
              <div class="flex justify-between font-semibold border-t border-[#C9A98C]/10 pt-1.5 mt-1.5 text-xs">
                <span>Total estimado:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              id="btn-close-success-checkout"
              onClick={handleCloseSuccess}
              class="py-3 px-8 bg-[#8A7263] hover:bg-[#6B5A4C] text-white font-sans text-xs tracking-widest uppercase font-semibold rounded-full transition-all cursor-pointer"
            >
              Seguir explorando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
