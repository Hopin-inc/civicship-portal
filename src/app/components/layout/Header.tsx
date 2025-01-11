import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="bg-white fixed w-full z-40">
      <div className="flex flex-row max-w-[1280px] items-center justify-between px-6 md:px-10 py-4 mx-auto">
        <Link href="/" className="hover-link">
          <Image className="relative" alt="civicship" src="/images/logo.svg" width="144" height="28" />
        </Link>
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
