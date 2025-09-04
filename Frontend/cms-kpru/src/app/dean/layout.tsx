"use client";
import React, { useEffect } from 'react';
import { getUserRoleFromJWT } from '@/utils/jwt';

export default function DeanLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      const role = getUserRoleFromJWT(token || "");
      if (!(role?.toLowerCase() === "dean")) {
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="nav-container w-full flex items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        <div id="hamburger" className={`relative cursor-pointer ${sidebarOpen ? 'close' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)} style={{height: 50, width: 50, borderRadius: '50%', background: '#fff', boxShadow: sidebarOpen ? '0 0 8px rgba(0,0,0,0.15)' : '0 0 4px rgba(0,0,0,0)', transition: 'all .2s'}}>
          <span style={{position: 'absolute', height: 2, width: 28, left: '50%', background: '#10b981', borderRadius: 10, transition: 'all .15s', top: sidebarOpen ? 15 : 17, transform: sidebarOpen ? 'translate(-14px, 10px) rotate(135deg)' : 'translateX(-50%)'}}></span>
          <span style={{position: 'absolute', height: 2, width: 28, left: sidebarOpen ? -20 : '50%', background: '#10b981', borderRadius: 10, transition: 'all .15s', top: 25, opacity: sidebarOpen ? 0 : 1, transform: 'translateX(-50%)'}}></span>
          <span style={{position: 'absolute', height: 2, width: 28, left: '50%', background: '#10b981', borderRadius: 10, transition: 'all .15s', top: sidebarOpen ? 15 : 33, transform: sidebarOpen ? 'translate(-14px, 10px) rotate(-135deg)' : 'translateX(-50%)'}}></span>
        </div>
        <span className="font-extrabold text-xl tracking-tight text-gray-800 ml-4">CMS-KPRU - Dean Portal</span>
      </div>
      
      {/* Sidebar */}
      <div id="nav" className={`fixed top-0 left-0 h-full z-40 bg-white shadow-xl transition-all duration-200 flex flex-col justify-between ${sidebarOpen ? 'visible' : ''}`} style={{width: 220, boxShadow: '0 1px 20px rgba(0,0,0,0.25)', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-220px)', opacity: sidebarOpen ? 1 : 0}}>
        <ul className="list-none p-0 mt-24">
          <li className="w-full transition-all">
            <a href="/dean/complaints" className="block px-6 py-4 w-full h-full hover:bg-green-600 hover:text-white transition-all font-bold">รายการเรื่องร้องเรียน</a>
          </li>
        </ul>
        <button
          className="block w-full px-6 py-4 mb-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
          onClick={async () => {
            await fetch('/api/logout', { method: 'POST' });
            localStorage.removeItem('jwt');
            window.location.href = '/login';
          }}
        >ออกจากระบบ</button>
      </div>
      
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
