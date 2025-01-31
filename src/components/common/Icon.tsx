import { 
  FaTelegram, 
  FaDiscord, 
  FaSquareXTwitter 
} from "react-icons/fa6";
import { 
  IoNewspaperOutline, 
  IoGridOutline, 
  IoCalendarOutline,
  IoLanguageOutline,
  IoMenuOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCompassOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoGiftOutline,
  IoAddOutline,
  IoTimeOutline
} from "react-icons/io5";


const icons = {
  telegram: FaTelegram,
  discord: FaDiscord,
  twitter: FaSquareXTwitter,
  news: IoNewspaperOutline,
  grid: IoGridOutline,
  calendar: IoCalendarOutline,
  language: IoLanguageOutline,
  menu: IoMenuOutline,
  chevronLeft: IoChevronBackOutline,
  chevronRight: IoChevronForwardOutline,
  compass: IoCompassOutline,
  "chevron-up": IoChevronUpOutline,
  "chevron-down": IoChevronDownOutline,
  gift: IoGiftOutline,
  plus: IoAddOutline,
  history: IoTimeOutline
};

interface IconProps {
  name: keyof typeof icons;
  className?: string;
}

export const Icon = ({ name, className = "w-5 h-5" }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent className={className} />;
}; 