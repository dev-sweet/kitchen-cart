"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ChefHat, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/* ========== Social Media Icons (Inline SVGs) ========== */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ========== Footer Link with underline animation ========== */

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="footer-link inline-block text-[14px] leading-[2.2] text-[#9E9E9E] hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

/* ========== Footer Section Heading ========== */

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase text-white mb-5">
      {children}
    </h3>
  );
}

/* ========== Newsletter Column ========== */

function NewsletterColumn() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div>
      <FooterHeading>Stay in the loop</FooterHeading>
      <p className="text-[14px] text-[#9E9E9E] mb-4 leading-relaxed">
        Get recipes, deals &amp; new arrivals to your inbox
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-2 text-green-400 text-sm mt-3">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>Thanks for subscribing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E] pointer-events-none" />
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="h-10 bg-white/5 border-white/10 text-white placeholder:text-[#9E9E9E] pl-10 pr-3 text-sm focus:border-[#2a5fb5] focus:ring-[#2a5fb5]/30"
                disabled={status === "loading"}
              />
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-10 px-5 bg-[#1E51A4] hover:bg-[#1E51A4] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
          {status === "error" && errorMsg && (
            <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
          )}
        </form>
      )}
    </div>
  );
}

/* ========== Main Footer Component ========== */

export default function Footer() {
  const companyLinks = [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ];

  const purchaseLinks = [
    { href: "/shop", label: "Shop All Products" },
    { href: "/faq", label: "FAQ" },
    { href: "/faq#payment", label: "Payment Methods" },
    { href: "/faq#shipping", label: "Shipping & Delivery" },
    { href: "/faq#returns", label: "Refunds & Returns" },
  ];

  const socialLinks = [
    { icon: FacebookIcon, href: "https://facebook.com/LaventerPrise", label: "Facebook" },
    { icon: InstagramIcon, href: "https://instagram.com/LaventerPrise", label: "Instagram" },
    { icon: TwitterIcon, href: "https://twitter.com/LaventerPrise", label: "Twitter" },
    { icon: YoutubeIcon, href: "https://youtube.com/LaventerPrise", label: "YouTube" },
  ];

  return (
    <footer className="bg-[#1A1A1A]">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* 1. Brand Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
             <Image className="w-52" src="/logo.png" alt="LaventerPrise Logo" width={100} height={40} />
            </Link>
            <p className="text-[13px] text-[#9E9E9E] leading-relaxed mb-1">
              Everything for your kitchen
            </p>
            <p className="text-[14px] text-[#9E9E9E] leading-relaxed mb-6">
              Premium kitchen tools and accessories curated for passionate home
              cooks and professional chefs alike. Quality you can trust, prices
              you&apos;ll love.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-[#4dade6]/15 transition-all duration-200 group/social"
                >
                  <Icon className="h-[20px] w-[20px] text-[#9E9E9E] group-hover/social:text-[#4dade6] transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Company Info Column */}
          <div>
            <FooterHeading>Company Info</FooterHeading>
            <nav aria-label="Company links">
              <ul className="space-y-0">
                {companyLinks.map(({ href, label }) => (
                  <li key={href}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 3. Purchase Info Column */}
          <div>
            <FooterHeading>Purchase Info</FooterHeading>
            <nav aria-label="Purchase information links">
              <ul className="space-y-0">
                {purchaseLinks.map(({ href, label }) => (
                  <li key={href}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 4. Newsletter Column */}
          <NewsletterColumn />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#9E9E9E]">
            &copy; 2025 LaventerPrise. All rights reserved.
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Visa", "Mastercard", "PayPal", "Stripe", "Apple Pay"].map(
              (method) => (
                <span
                  key={method}
                  className="text-[12px] font-medium text-[#9E9E9E] bg-white/5 px-2.5 py-1 rounded"
                >
                  {method}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
