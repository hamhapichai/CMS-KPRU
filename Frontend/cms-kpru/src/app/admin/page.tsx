
"use client";
import { useEffect } from 'react';
import { getUserRoleFromJWT } from '@/utils/jwt';
import UserManagement from '@/components/UserManagement';

export default function AdminPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      const role = getUserRoleFromJWT(token || "");
      if (!(role?.toLowerCase() === "admin" || role?.toLowerCase() === "dean" || role?.toLowerCase() === "officer")) {
        window.location.href = "/login";
      }
    }
  }, []);
  return <UserManagement />;
}

