"use client";
import { useState, useRef, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const router = useRouter();
  // const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const handleChange = (value: string) => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("lang", value);
  //     const path = pathname.replace(/^\/(en|th)/, "");
  //     router.push(`/${value}${path}`);
  //   }
  //   setOpen(false);
  // };

  return <div style={{ display: open ? 'block' : 'none' }} ref={dropdownRef}></div>;
}
