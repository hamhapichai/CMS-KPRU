"use client";
import React from "react";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger";
  children: React.ReactNode;
};
export default function Button({ variant = "primary", children, ...props }: ButtonProps) {
  const className =
    "btn " +
    (variant === "danger" ? "btn-danger" : "");
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
