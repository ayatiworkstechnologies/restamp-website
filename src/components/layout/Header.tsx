"use client";

import { useEffect, useState } from 'react';
import { getProfile, type Profile } from '@/lib/profile';
import { useWishlist } from '@/lib/wishlist';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  FavouriteIcon,
  UserIcon,
  Menu01Icon,
} from '@hugeicons/core-free-icons';
import { ChevronDown, ChevronRight, CircleUserRound, X } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const wishlistCount = useWishlist().length;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const sync = () => setProfile(getProfile());
    sync();
    window.addEventListener('profile-change', sync);
    return () => window.removeEventListener('profile-change', sync);
  }, []);

  const roleMenus = [
    {
      label: 'For Buyers',
      links: [
        { label: 'Buyer Login', href: '/login?role=buyer' },
        { label: 'Buy Property', href: '/buy' },
        { label: 'Saved Homes', href: '/saved' },
        { label: 'My Activity', href: '/activity' },
      ],
    },
    {
      label: 'For Owners',
      links: [
        { label: 'Owner Login', href: '/login?role=owner' },
        { label: 'Post Property', href: '/sell' },
        { label: 'Rent Out Property', href: '/rent' },
        { label: 'Owner Plans', href: '/owner/plans' },
      ],
    },
    {
      label: 'For Agents',
      links: [
        { label: 'Agent Login', href: '/login?role=agent' },
        { label: 'New Projects', href: '/projects' },
        { label: 'Agent Registration', href: '/register?role=agent' },
      ],
    },
  ];

  const closeMenu = () => {
    setOpen(false);
    setExpanded(null);
  };

  const navLinks = [
    { label: 'Buy', href: '/buy', hasDropdown: true },
    { label: 'Rent', href: '/rent', hasDropdown: true },
    { label: 'New projects', href: '/projects', hasDropdown: true },
    { label: 'For property owners', href: '/sell', hasDropdown: false },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-2xs">
      <div className="container-site flex h-18 items-center justify-between gap-5">
        {/* Brand Logo with Hugeicons Home01Icon */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#087ed9] font-extrabold text-xl tracking-tight"
        >
          <span className="p-1.5 bg-sky-50 rounded-lg text-[#087ed9] flex items-center justify-center">
            <HugeiconsIcon icon={Home01Icon} size={20} />
          </span>
          <span className="text-slate-900 font-bold">
            Re<span className="text-[#087ed9]">stamp</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 transition ${
                  isActive
                    ? 'text-[#087ed9] font-bold'
                    : 'text-slate-700 hover:text-[#087ed9]'
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown
                    size={14}
                    className={`transition ${isActive ? 'text-[#087ed9]' : 'text-slate-400'}`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions with Hugeicons */}
        <div className="flex items-center gap-3 text-slate-700">
          <Link
            href="/sell"
            className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 hover:border-slate-300 hover:shadow-sm transition"
          >
            Post property
            <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Free</span>
          </Link>
          <Link
            aria-label="Saved homes"
            href="/saved"
            className="relative p-2 hover:bg-slate-100 rounded-full transition text-slate-600 hover:text-red-500 flex items-center justify-center"
          >
            <HugeiconsIcon icon={FavouriteIcon} size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href={profile ? '/profile' : '/login'}
            aria-label={profile ? 'My profile' : 'Login'}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600 hover:text-slate-900 flex items-center justify-center"
          >
            {profile ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#087ed9] text-[11px] font-bold text-white">
                {(profile.name || 'U').charAt(0).toUpperCase()}
              </span>
            ) : (
              <HugeiconsIcon icon={UserIcon} size={20} />
            )}
          </Link>
          <button
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-700 cursor-pointer flex items-center justify-center"
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
          >
            <HugeiconsIcon icon={Menu01Icon} size={22} />
          </button>
        </div>
      </div>

      {/* Menu Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeMenu} />
          <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between bg-slate-100 px-5 py-4">
              <Link
                href={profile ? '/profile' : '/login'}
                onClick={closeMenu}
                className="flex items-center gap-3 text-[#087ed9] font-medium uppercase tracking-wide"
              >
                <CircleUserRound size={28} className="text-slate-600" />
                {profile ? profile.name || `+91 ${profile.mobile}` : 'Login / Register'}
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <Link
              href="/sell"
              onClick={closeMenu}
              className="flex items-center gap-3 px-5 py-5 font-bold text-slate-900 border-b border-slate-200 mx-0"
            >
              Post Property
              <span className="rounded bg-[#087ed9] px-1.5 py-0.5 text-[10px] font-bold text-white">FREE</span>
            </Link>

            <p className="px-5 py-4 text-slate-800 border-b border-slate-200">Explore our Services</p>

            <nav className="flex flex-col border-b border-slate-200 py-2">
              {roleMenus.map((menu) => {
                const isOpen = expanded === menu.label;
                return (
                  <div key={menu.label}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : menu.label)}
                      className="flex w-full items-center gap-4 px-5 py-3 text-left text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <ChevronRight
                        size={16}
                        className={`text-slate-400 fill-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                      />
                      {menu.label}
                    </button>
                    {isOpen && (
                      <div className="flex flex-col pb-2 pl-14">
                        {menu.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className="py-2 text-sm text-slate-600 hover:text-[#087ed9]"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <nav className="md:hidden flex flex-col px-5 py-3 text-sm">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  onClick={closeMenu}
                  href={item.href}
                  className={`py-2 ${pathname === item.href ? 'text-[#087ed9] font-bold' : 'text-slate-700'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}