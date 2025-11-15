import { NavbarMenu } from "./navbar-menu";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { IconMenu2 } from "@tabler/icons-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerFooter, } from "./ui/drawer";
import { useEffect, useState } from "react";
import { validateToken } from "@/controllers/auth/authcontroller";
export function Navbar() {
  const [isLogin,setIslogin] = useState(false);
  const navigate = useNavigate();
  const { valid, expired } = validateToken();

  useEffect(() => {
    if (!valid || expired) {
      return setIslogin(false);
    }else{
      return setIslogin(true);
    }
  }, [valid, expired, isLogin]);
  return (
    <nav className="bg-white border-1 border-gray-100 dark:bg-gray-900">
      <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto md:mx-20 px-2 py-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/images/logoname2.png" className="mx-auto w-24 sm:w-36 h-auto" />
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-sm hidden md:block text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            onClick={() => navigate(isLogin ? "/admin" : "/auth/login")}
          >
            {isLogin ? "Admin Dashboard" : "Login"}
          </Button>

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
              ><IconMenu2 /></Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="flex flex-col gap-2 px-6 pt-4">
                <div className="px-4 py-2 rounded-md" onClick={() => navigate("/auth/login")}>
                {isLogin ? "Admin Dashboard" : "Login"}
                </div>
                <div className="px-4 py-2 rounded-md" onClick={() => navigate("/")}>
                  Dashboard
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="rekap">
                    <AccordionTrigger className="outline outline-blue-100 px-4 py-2 rounded-md">
                      Rekap
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 px-6 py-2">
                        <a
                          href="/rekap/harian"
                          className="text-sm text-gray-700 hover:underline"
                        >
                          Rekap Harian
                        </a>
                        <a
                          href="/rekap/bulanan"
                          className="text-sm text-gray-700 hover:underline"
                        >
                          Rekap Bulanan
                        </a>
                        <a
                          href="/rekap/tahunan"
                          className="text-sm text-gray-700 hover:underline"
                        >
                          Rekap Tahunan
                        </a>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <DrawerFooter>
                <DrawerClose>
                  Tutup
                </DrawerClose>

              </DrawerFooter>
            </DrawerContent>

          </Drawer>
        </div>
        <div className="text-left justify-between hidden w-full md:flex md:w-auto md:order-1 z-10" id="navbar-user">
          <NavbarMenu />
        </div>
      </div>
    </nav>)
}