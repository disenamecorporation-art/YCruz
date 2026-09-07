import { Instagram, Facebook, Twitter, Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer-section" className="w-full bg-[#6B5A4C] text-[#FDFBF8]/90 pt-16 pb-8 border-t border-[#C9A98C]/15">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 mb-12">
          
          {/* Col 1: Brand Logo & Tagline */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <img
                src="https://i.postimg.cc/7Y6tqRfP/logowebpsd.png"
                alt="YCruz Logo Symbol"
                className="h-14 object-contain brightness-105"
              />
            </div>
            <p className="font-sans text-xs text-[#FDFBF8]/75 leading-relaxed max-w-xs font-light">
              La delicadeza y elegancia del mejor satin y algodón para acompañar cada uno de tus sueños con suavidad inigualable.
            </p>
          </div>

          {/* Col 2: Ayuda */}
          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#C9A98C] mb-5">
              Ayuda
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-[#FDFBF8]/80 font-light">
              <li>
                <a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Envíos</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Cambios y devoluciones</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Guía de tallas</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Información */}
          <div className="md:col-span-3 text-center md:text-left">
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#C9A98C] mb-5">
              Información
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-[#FDFBF8]/80 font-light">
              <li>
                <a href="#" className="hover:text-white transition-colors">Sobre nosotros</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Términos y condiciones</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contacto</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Síguenos & Social */}
          <div className="md:col-span-3 text-center md:text-left flex flex-col items-center md:items-start space-y-5">
            <h4 className="font-sans text-[11px] uppercase tracking-widest font-bold text-[#C9A98C]">
              Síguenos
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#8A7263]/30 hover:bg-[#8A7263] border border-[#C9A98C]/25 flex items-center justify-center transition-all text-[#FDFBF8]"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#8A7263]/30 hover:bg-[#8A7263] border border-[#C9A98C]/25 flex items-center justify-center transition-all text-[#FDFBF8]"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#8A7263]/30 hover:bg-[#8A7263] border border-[#C9A98C]/25 flex items-center justify-center transition-all text-[#FDFBF8]"
                aria-label="TikTok"
              >
                <span className="font-sans text-[10px] font-bold">Tk</span>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#8A7263]/30 hover:bg-[#8A7263] border border-[#C9A98C]/25 flex items-center justify-center transition-all text-[#FDFBF8]"
                aria-label="Pinterest"
              >
                <span className="font-sans text-[10px] font-bold">P</span>
              </a>
            </div>
            
            {/* Payment security info badge */}
            <div className="pt-2 flex items-center gap-1.5 text-[10px] text-[#C9A98C] font-sans tracking-wide">
              <Shield size={12} /> Transacción 100% Segura SSL
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="h-[1px] bg-[#C9A98C]/20 w-full mb-6" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FDFBF8]/60 font-sans tracking-wider text-center sm:text-left">
          <div className="flex items-center gap-1">
            Hecho por <a href="https://instagram.com/legaint.ve" target="_blank" rel="noreferrer" className="hover:underline text-[#F3CBA3] font-semibold">Legaint Corporation</a>
          </div>
          <div>
            © 2025 YCruz. Todos los derechos reservados.
          </div>
        </div>

      </div>
    </footer>
  );
}
