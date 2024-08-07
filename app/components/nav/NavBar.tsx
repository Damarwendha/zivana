import Link from "next/link";
import Container from "../Container";
import { Redressed } from "next/font/google";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import getCurrentUser from "@/actions/getCurrentUser";
import Categories from "./Categories";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { MdMessage } from "react-icons/md";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const NavBar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="sticky top-0 z-30 w-full shadow-sm bg-slate-200">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <a href="/" className={`${redressed.className} font-bold text-2xl`}>
              <Image
                src="/Zivana.png"
                alt="Logo Zivana"
                width={148}
                height={148}
              />
            </a>

            <div className="hidden md:block">
              <SearchBar />
            </div>

            <div className="flex items-center gap-8 md:gap-12">
              <Link href={"/feedback"}>
                <MdMessage size={32} />
              </Link>
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default NavBar;
