"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserRoleFromJWT } from "@/utils/jwt";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      setRole(getUserRoleFromJWT(token || ""));
    }
  }, []);

  // Show different menus based on role
  const showAdminMenu = role?.toLowerCase() === "admin" || role?.toLowerCase() === "officer";
  const showDeanMenu = role?.toLowerCase() === "dean";

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          ระบบสายตรงคณบดี - มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน
        </Link>
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="focus:outline-none"
            aria-label="เปิดเมนู"
          >
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-blue-200">
            ส่งเรื่องร้องเรียน
          </Link>
          {showDeanMenu && (
            <Link href="/dean/complaints" className="hover:text-blue-200">
              รายการเรื่องร้องเรียน (คณบดี)
            </Link>
          )}
          {showAdminMenu && (
            <>
              <Link href="/admin/complaints" className="hover:text-blue-200">
                จัดการเรื่องร้องเรียน
              </Link>
              <Link href="/admin" className="hover:text-blue-200">
                จัดการผู้ใช้
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-2 bg-blue-700 rounded-lg shadow-lg">
          <Link
            href="/"
            className="block px-4 py-2 hover:bg-blue-500"
            onClick={() => setOpen(false)}
          >
            ส่งเรื่องร้องเรียน
          </Link>
          {showDeanMenu && (
            <Link
              href="/dean/complaints"
              className="block px-4 py-2 hover:bg-blue-500"
              onClick={() => setOpen(false)}
            >
              รายการเรื่องร้องเรียน (คณบดี)
            </Link>
          )}
          {showAdminMenu && (
            <>
              <Link
                href="/admin/complaints"
                className="block px-4 py-2 hover:bg-blue-500"
                onClick={() => setOpen(false)}
              >
                จัดการเรื่องร้องเรียน
              </Link>
              <Link
                href="/admin"
                className="block px-4 py-2 hover:bg-blue-500"
                onClick={() => setOpen(false)}
              >
                จัดการผู้ใช้
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
