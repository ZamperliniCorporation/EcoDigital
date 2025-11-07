// app/components/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home, Users, FileText, UserCircle, LogOut, UserPlus, UserCog,
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  soon?: boolean;
  devTag?: boolean;
};

// "Relatórios" passa a ser o último item e recebe o balão "Em desenvolvimento"
const menuItems: MenuItem[] = [
  { label: "Visão Geral", href: "/dashboard", icon: <Home size={22} /> },
  { label: "Colaboradores", href: "/dashboard/colaboradores/engajamento", icon: <Users size={22} /> },
  { label: "Novo colaborador", href: "/dashboard/colaboradores/adicionar", icon: <UserPlus size={22} /> },
  { label: "Gerenciar colaboradores", href: "/dashboard/colaboradores/remover", icon: <UserCog size={22} /> },
  { label: "Relatórios", href: "#", icon: <FileText size={22} />, soon: true, devTag: true },
];

const extraItems: MenuItem[] = [
  { label: "Perfil", href: "/dashboard/perfil", icon: <UserCircle size={22} /> },
  // Configurações removido conforme solicitado
];

// NavLink otimizado para navegação instantânea
const NavLink: React.FC<{ item: MenuItem; isExpanded: boolean }> = ({ item, isExpanded }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isSelected =
    item.href !== "#" &&
    pathname &&
    (pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href)));

  const handleClick = (e: React.MouseEvent) => {
    if (!item.soon && item.href !== "#") {
      e.preventDefault();
      router.push(item.href);
    }
  };

  return (
    <li className="mb-1" key={item.label}>
      <button
        onClick={handleClick}
        className={`flex items-center w-full text-left py-2.5 rounded-md transition-colors duration-200 group font-semibold ${
          isExpanded ? "px-4" : "px-3 justify-center"
        } ${
          isSelected
            ? "bg-ecodigital-green/20 text-ecodigital-green"
            : item.soon
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-200/50 hover:text-ecodigital-green"
        }`}
        disabled={item.soon}
        tabIndex={item.soon ? -1 : 0}
        type="button"
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span
          className={`whitespace-nowrap transition-all duration-200 ${
            isExpanded ? "w-auto ml-3 opacity-100" : "w-0 ml-0 opacity-0"
          } flex items-center`}
        >
          {item.label}
          {item.devTag && isExpanded && (
            <span
              className="
                ml-2
                bg-ecodigital-green
                text-white
                text-xs
                font-semibold
                px-3
                py-0.5
                rounded-full
                border
                border-ecodigital-green
                shadow-sm
                pointer-events-none
                select-none
                "
              style={{
                letterSpacing: "0.05em",
                fontWeight: 700,
              }}
            >
              Em Breve
            </span>
          )}
        </span>
      </button>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`absolute top-0 left-0 h-full bg-white shadow-lg flex flex-col justify-between z-50 transition-[width] duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className="overflow-x-hidden">
        <nav className="px-2 py-4">
          <ul>
            {menuItems.map((item) => (
              <NavLink key={item.label} item={item} isExpanded={isExpanded} />
            ))}
          </ul>
        </nav>
      </div>
      <div className="overflow-x-hidden">
        <div className="px-2 py-4 border-t border-gray-200">
          <ul>
            {extraItems.map((item) => (
              <NavLink key={item.label} item={item} isExpanded={isExpanded} />
            ))}
          </ul>
          <div className="mt-2 px-2">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full text-left py-2.5 rounded-md transition-colors duration-200 group font-semibold text-red-600 hover:bg-red-50 ${
                isExpanded ? "px-4" : "px-3 justify-center"
              }`}
              type="button"
            >
              <LogOut size={22} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-all duration-200 ${
                  isExpanded ? "w-auto ml-3 opacity-100" : "w-0 ml-0 opacity-0"
                }`}
              >
                Sair
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
