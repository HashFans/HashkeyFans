"use client"
import { generateShareCode } from "@/lib/utils";
import { ConnectButton, useAccount } from "@particle-network/connectkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../common/Icon";
import { LanguageSelector } from "../common/LanguageSelector";
import { menuConfig } from '@/config/menu';

export const Header = () => {
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

  const renderMenuItem = (item: any) => {
    if (item.type === 'divider') return <li className="divider"></li>;
    
    if (item.requireAuth && !address) return null;
    
    const link = item.requireAuth ? `${item.link}/${generateShareCode(address || '')}` : item.link;
    
    return (
      <li key={item.key}>
        <Link 
          href={link} 
          onClick={() => {
            const dropdown = document.querySelector('.dropdown-content');
            if (dropdown) {
              (dropdown as HTMLElement).style.display = 'none';
              setTimeout(() => {
                (dropdown as HTMLElement).style.display = '';
              }, 100);
            }
          }}
        >
          <Icon name={item.icon} className={`h-4 w-4 ${item.iconClass || ''}`} />
          {t(item.key)}
        </Link>
      </li>
    );
  };

  if (!mounted) return null;

  return (
    <div className="navbar">
      <div className="navbar-start flex-1">
        <Link href="/" className="btn btn-ghost px-0">
          <img src="/img/hashfans.png" alt="HashFans" className="w-32 h-8" />
        </Link>

        <ul className="hidden lg:flex menu menu-horizontal ml-2">
          {/* Explore 菜单 */}
          <li className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="flex items-center gap-2">
              <Icon name={menuConfig.explore.icon} className="h-4 w-4" />
              {t('nav.explore')}
            </div>
            <ul className="dropdown-content z-[1] ml-0 menu p-2 shadow bg-base-100 rounded-box w-48">
              {menuConfig.explore.items.map((item, index) => renderMenuItem(item))}
            </ul>
          </li>

          {menuConfig.main.map((item) => (
            <li key={item.key}>
              <Link href={item.link} className="flex items-center gap-2">
                <Icon name={item.icon} className="h-4 w-4" />
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <button 
          className="btn btn-ghost lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name="menu" className="h-5 w-5 text-white" />
        </button>

        <div className="hidden lg:flex items-center gap-2">
          {address && (
            <Link href="/profile" className="btn btn-ghost btn-circle">
              <Icon name="user" className="h-5 w-5" />
            </Link>
          )}
          <ConnectButton />
          <LanguageSelector 
            isOpen={isLangMenuOpen}
            onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
            onSelect={(lang) => {
              i18n.changeLanguage(lang);
              setIsLangMenuOpen(false);
            }}
          />
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="h-[100dvh] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
            {/* 顶部导航栏 */}
            <div className="p-4 pt-safe border-b border-white/10">
              <div className="flex justify-between items-center">
                <img src="/img/hashfans.png" alt="HashFans" className="w-32 h-8" />
                <button 
                  className="btn btn-ghost btn-circle"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon name="close" className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* 主菜单内容 */}
            <div className="flex-1 overflow-y-auto p-4 pb-safe">
              <ul className="menu menu-lg gap-2 w-full text-white">
                <li>
                  <details>
                    <summary className="flex items-center gap-2">
                      <Icon name="compass" className="h-5 w-5" />
                      {t('nav.explore')}
                    </summary>
                    <ul className="menu gap-2 pl-4">
                      <li>
                        <Link href="/news" onClick={() => setIsMenuOpen(false)}>
                          <Icon name="news" className="h-4 w-4" />
                          {t('nav.news')}
                        </Link>
                      </li>
                      <li>
                        <Link href="/events" onClick={() => setIsMenuOpen(false)}>
                          <Icon name="calendar" className="h-4 w-4" />
                          {t('nav.events')}
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>
                <li>
                  <details>
                    <summary className="flex items-center gap-2">
                      <Icon name="compass" className="h-5 w-5" />
                      {t('nav.activities')}
                    </summary>
                    <ul className="menu gap-2 pl-4">
                      <li>
                        <Link 
                          href="/redpacket" 
                          onClick={() => setIsMenuOpen(false)}
                          className="relative"
                        >
                          <Icon name="gift" className="h-4 w-4 text-red-500" />
                          {t('nav.redpacket')}
                        </Link>
                      </li>
                      <li>
                        <details>
                          <summary>
                            <Icon name="gift" className="h-4 w-4" />
                            {t('nav.consensus')}
                          </summary>
                          <ul>
                            <li>
                              <Link href="/rankings" onClick={() => setIsMenuOpen(false)}>
                                <Icon name="trophy" className="h-4 w-4" />
                                {t('nav.rankings')}
                              </Link>
                            </li>
                            {address && 
                              <li>
                                <Link 
                                  href={`/consensuscard/${generateShareCode(address)}`}
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <Icon name="trophy" className="h-4 w-4" />
                                  {t('nav.card')}
                                </Link>
                              </li>
                            }
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </details>
                </li>
                <li>
                  <Link href="/projects" onClick={() => setIsMenuOpen(false)}>
                    <Icon name="grid" className="h-4 w-4" />
                    {t('nav.projects')}
                  </Link>
                </li>
              </ul>

              <div className="divider my-8"></div>

              {/* 底部功能区 */}
              <div className="space-y-4">
                {address && (
                  <Link 
                    href="/profile" 
                    className="btn btn-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon name="user" className="h-5 w-5" />
                    {t('nav.profile')}
                  </Link>
                )}
                <div className="w-full flex justify-between items-center">
                  <ConnectButton />
                  <LanguageSelector 
                    isOpen={isLangMenuOpen}
                    onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    onSelect={(lang) => {
                      i18n.changeLanguage(lang);
                      setIsLangMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 