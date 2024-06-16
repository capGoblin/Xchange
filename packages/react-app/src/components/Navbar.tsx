import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

import { Menu } from "lucide-react";
import { useStore } from "../store/store";
import ConnectButton from "./ConnectButton";
import { LogoIcon } from "./Icons";
import SearchBar from "./SearchBar";
import { ModeToggle } from "./mode-toggle";
import { buttonVariants } from "./ui/button";

interface RouteProps {
  href: string;
  label: string;
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { upload, setUpload, purchase, setPurchase } = useStore();

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <LogoIcon />
              Xchange
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Shadcn/React
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  <a
                    rel="noreferrer noopener"
                    // href={}
                    // key={i}
                    onClick={() => {
                      if (!upload) setUpload(true);
                    }}
                    className={`text-[17px] ${buttonVariants({
                      variant: "ghost",
                    })}`}
                  >
                    Upload Listing
                  </a>
                  <a
                    rel="noreferrer noopener"
                    // href={}
                    // key={i}
                    onClick={() => {
                      if (!purchase) setPurchase(true);
                    }}
                    className={`text-[17px] ${buttonVariants({
                      variant: "ghost",
                    })}`}
                  >
                    Purchase
                  </a>
                  {/* {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))} */}
                  {/* <a
                    rel="noreferrer noopener"
                    href="https://github.com/capGoblin/Xchange"
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                    Githsub
                  </a> */}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            <a
              rel="noreferrer noopener"
              // href={}
              // key={i}
              onClick={() => {
                if (!upload) setUpload(true);
              }}
              className={`text-[17px] ${buttonVariants({
                variant: "ghost",
              })}`}
            >
              Upload Listing
            </a>
            <a
              rel="noreferrer noopener"
              // href={}
              // key={i}
              onClick={() => {
                if (!purchase) setPurchase(true);
              }}
              className={`text-[17px] ${buttonVariants({
                variant: "ghost",
              })}`}
            >
              Purchase
            </a>
            {purchase && <SearchBar />}
            {/* {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))} */}
          </nav>

          <div className="hidden md:flex gap-2">
            <ConnectButton />

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
