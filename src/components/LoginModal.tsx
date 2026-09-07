import React, { useState } from "react";
import { X, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { User } from "../types";
import { supabase, isSupabaseConfigured } from "../supabaseClient";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "register" && !fullName)) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        if (mode === "register") {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                fullName: fullName,
                full_name: fullName,
              }
            }
          });

          if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
          }

          // Registration succeeded! Since we are doing it without email confirmation, they are logged in or can login.
          const userMeta = data.user?.user_metadata;
          const loggedUser: User = {
            email: data.user?.email || email,
            fullName: userMeta?.fullName || userMeta?.full_name || fullName,
            isLoggedIn: true,
          };
          onLoginSuccess(loggedUser);
          onClose();
        } else {
          // Login
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
          }

          // Login succeeded! Get full name from metadata
          const userMeta = data.user?.user_metadata;
          const loggedUser: User = {
            email: data.user?.email || email,
            fullName: userMeta?.fullName || userMeta?.full_name || email.split("@")[0],
            isLoggedIn: true,
          };
          onLoginSuccess(loggedUser);
          onClose();
        }
      } catch (err: any) {
        setError(err?.message || "Ocurrió un error inesperado al conectar con Supabase.");
      } finally {
        setLoading(false);
      }
    } else {
      // Simulate local/mock fallback
      setTimeout(() => {
        setLoading(false);
        const loggedUser: User = {
          email,
          fullName: mode === "register" ? fullName : email.split("@")[0],
          isLoggedIn: true,
        };
        onLoginSuccess(loggedUser);
        onClose();
      }, 1200);
    }
  };

  return (
    <div 
      id="login-modal-overlay" 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay transition-all duration-300 cursor-pointer"
    >
      <div 
        id="login-modal-container" 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md glass-card-light rounded-2xl overflow-hidden border border-white/30 transition-all duration-500 animate-scale-up-soft animate-float-dream cursor-default shadow-2xl"
      >
        
        {/* Top Accent bar */}
        <div className="h-1.5 bg-[#8A7263]" />

        {/* Close Button */}
        <button 
          id="btn-close-login"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#352C26]/80 hover:text-[#352C26] hover:bg-white/60 transition-all z-50 cursor-pointer"
          title="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Modal Content */}
        <div key={mode} className="p-8 sm:p-10 animate-mode-change">
          <div className="text-center mb-8">
            {/* Elegant Monogram */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#C9A98C]/60 mb-3 bg-white/70 backdrop-blur-xs">
              <span className="font-serif text-[#4A3F37] text-lg font-bold">Y</span>
            </div>
            <h2 id="login-modal-title" className="font-serif text-2xl text-[#352C26] tracking-wide font-semibold">
              {mode === "login" ? "Bienvenida de vuelta" : "Crear una cuenta"}
            </h2>
            <p className="font-sans text-xs tracking-widest text-[#4A3F37] uppercase font-medium mt-1">
              {mode === "login" ? "Duerme para soñar" : "Únete a YCruz Shop"}
            </p>
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div id="login-error-msg" className="p-3 bg-red-50/90 backdrop-blur-xs text-red-800 text-xs rounded-lg border border-red-200 font-sans font-medium">
                {error}
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans tracking-widest uppercase text-[#352C26] font-semibold">Nombre Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#352C26]/70">
                    <UserIcon size={16} />
                  </span>
                  <input
                    id="input-login-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className="w-full pl-10 pr-4 py-3 bg-white/65 border border-[#8A7263]/40 rounded-xl font-sans text-sm text-[#2E2520] placeholder-[#4A3F37]/60 focus:outline-hidden focus:ring-2 focus:ring-[#8A7263] focus:border-[#8A7263] transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-sans tracking-widest uppercase text-[#352C26] font-semibold">Correo Electrónico</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#352C26]/70">
                  <Mail size={16} />
                </span>
                <input
                  id="input-login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/65 border border-[#8A7263]/40 rounded-xl font-sans text-sm text-[#2E2520] placeholder-[#4A3F37]/60 focus:outline-hidden focus:ring-2 focus:ring-[#8A7263] focus:border-[#8A7263] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-sans tracking-widest uppercase text-[#352C26] font-semibold">Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#352C26]/70">
                  <Lock size={16} />
                </span>
                <input
                  id="input-login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/65 border border-[#8A7263]/40 rounded-xl font-sans text-sm text-[#2E2520] placeholder-[#4A3F37]/60 focus:outline-hidden focus:ring-2 focus:ring-[#8A7263] focus:border-[#8A7263] transition-all font-medium"
                />
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <a href="#" className="text-[11px] font-sans tracking-widest uppercase text-[#4A3F37] hover:text-[#352C26] transition-colors font-semibold">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#F3CBA3] hover:bg-[#ebd2b4] active:bg-[#e4be95] text-[#352C26] font-sans text-xs tracking-widest uppercase font-bold rounded-full shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#352C26] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Ingresar" : "Registrarme"} <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle button */}
          <div className="mt-8 pt-6 border-t border-[#C9A98C]/30 text-center">
            <p className="font-sans text-xs text-[#4A3F37] font-medium">
              {mode === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
              <button
                id="btn-toggle-login-mode"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                }}
                className="font-bold text-[#352C26] hover:text-[#8A7263] underline underline-offset-4 ml-1 transition-colors font-sans uppercase text-[11px] tracking-widest cursor-pointer"
              >
                {mode === "login" ? "Regístrate" : "Inicia Sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
