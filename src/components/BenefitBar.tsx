import { Truck, ShieldCheck, RefreshCw, MessageSquare } from "lucide-react";

export default function BenefitBar() {
  const benefits = [
    {
      icon: <Truck size={24} className="text-[#8A7263]" />,
      title: "Envíos rápidos",
      desc: "a todo el país",
    },
    {
      icon: <ShieldCheck size={24} className="text-[#8A7263]" />,
      title: "Pagos seguros",
      desc: "y protegidos",
    },
    {
      icon: <RefreshCw size={24} className="text-[#8A7263]" />,
      title: "Cambios fáciles",
      desc: "y rápidos",
    },
    {
      icon: <MessageSquare size={24} className="text-[#8A7263]" />,
      title: "Atención personalizada",
      desc: "24/7",
    },
  ];

  return (
    <div id="benefits-bar" class="w-full bg-[#F5EFE7] border-y border-[#C9A98C]/15 py-8 md:py-10">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#C9A98C]/20">
          {benefits.map((b, idx) => (
            <div 
              key={idx} 
              class={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:px-4 lg:px-6 ${
                idx > 0 ? "pt-4 sm:pt-0" : ""
              }`}
            >
              <div class="p-3 bg-[#FDFBF8] rounded-full shadow-xs border border-[#C9A98C]/10 flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div class="space-y-0.5">
                <h4 class="font-sans text-xs uppercase tracking-wider font-semibold text-[#4A3F37]">
                  {b.title}
                </h4>
                <p class="font-sans text-xs text-[#8A7263]">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
