"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useHeader } from "@/contexts/HeaderContext";
import { useHierarchicalNavigation } from "@/hooks/core/useHierarchicalNavigation";

const Header: React.FC = () => {
  const { config } = useHeader();
  const { navigateBack } = useHierarchicalNavigation();

  return (
    <header className="bg-white fixed w-full z-40">
      <div className="flex flex-row max-w-[1280px] items-center justify-between px-6 md:px-10 py-4 mx-auto">
        <div className="flex items-center">
          {config.showBackButton && (
            <button
              onClick={navigateBack}
              className="mr-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="戻る"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <Link href="/" className="hover-link">
            <Image className="relative" alt="civicship" src="/images/logo.svg" width="144" height="28" />
          </Link>
        </div>
        <nav className="hidden md:visible md:flex gap-[24px] items-center flex-[0_0_auto]">
          <ul className="flex align-center gap-[8px] relative flex-[0_0_auto]">
            <li>
              <Link href="/" className="ul-link"></Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
};

export default Header;
