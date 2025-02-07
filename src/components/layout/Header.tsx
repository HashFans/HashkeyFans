"use client"
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";
// import { SocialLinks } from "../common/SocialLinks";
import { LanguageSelector } from "../common/LanguageSelector";
import { MobileMenu } from "../common/MobileMenu";
import { ConnectButton, useAccount } from "@particle-network/connectkit";
import styled from 'styled-components';

// 创建一个自定义的包装组件
const ConnectButtonWrapper = styled.div`

`;

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setMounted(true);
    const urlLang = pathname.split('/')[1];
    if (urlLang && (urlLang === 'en' || urlLang === 'zh') && urlLang !== i18n.language) {
      i18n.changeLanguage(urlLang);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        console.log('isExploreOpen', isExploreOpen);
        setIsExploreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  const getLocalizedHref = (path: string) => `/${i18n.language}${path}`;

  return (
    <header className="relative z-50">
      <div className="container mx-auto md:px-4 md:py-3">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-6">
            <Link href={getLocalizedHref('/')} className="text-xl font-bold rounded-full">
              <img className="rounded-full" src="/img/logo.png" alt="Logo" width={32} height={32} />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {/* Explore Dropdown */}
              <div className="relative group" ref={exploreRef}>
                <button
                  className="flex items-center text-white space-x-2 px-3 py-2 rounded-md group-hover:bg-gray-800 transition-colors"
                >
                  <Icon name="compass" className="w-5 h-5" />
                  <span>{t('nav.explore')}</span>
                </button>

                <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 top-full left-0 mt-2 w-48 rounded-lg bg-gray-800 shadow-lg py-2 transition-all duration-200">
                  <Link
                    href={getLocalizedHref('/events')}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    <Icon name="calendar" className="w-4 h-4 mr-2" />
                    {t('nav.events')}
                  </Link>
                  <Link
                    href={getLocalizedHref('/news')}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    <Icon name="news" className="w-4 h-4 mr-2" />
                    {t('nav.news')}
                  </Link>
                </div>
              </div>

              {/* Red Packet Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-white space-x-2 px-3 py-2 rounded-md group-hover:bg-gray-800 transition-colors">
                  <Icon name="gift" className="w-5 h-5" />
                  <span>RedPacket🧧</span>
                </button>

                <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 top-full left-0 mt-2 w-48 rounded-lg bg-gray-800 shadow-lg py-2 transition-all duration-200">
                  <Link
                    href={getLocalizedHref('/redpacket/create')}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    <Icon name="plus" className="w-4 h-4 mr-2" />
                    Send RedPacket
                  </Link>
                  <Link
                    href={getLocalizedHref('/redpacket/history')}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    <Icon name="history" className="w-4 h-4 mr-2" />
                    RedPacket History
                  </Link>
                </div>
              </div>

              {/* Projects Link */}
              <Link
                href={getLocalizedHref('/projects')}
                className="flex items-center text-white space-x-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <Icon name="grid" className="w-5 h-5" />
                <span>{t('nav.projects')}</span>
              </Link>
            </nav>
          </div>

          {/* Social Links & Language Selector */}
          <div className="hidden md:flex items-center space-x-6">
            {/* <SocialLinks /> */}
            <LanguageSelector 
              isOpen={isLangMenuOpen}
              onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
              onSelect={(lang) => {
                const segments = pathname.split('/');
                segments[1] = lang;
                router.push(segments.join('/'));
                i18n.changeLanguage(lang);
                setIsLangMenuOpen(false);
              }}
            />
            <ConnectButtonWrapper>
              <ConnectButton />
            </ConnectButtonWrapper>
            {address && (
              <Link 
                href={`/profile/${address}`}
                className="mr-4 text-sm hover:text-gray-600"
              >
                Profile
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="secondary"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            <Icon name="menu" />
          </Button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
      </div>
    </header>
  );
}; 