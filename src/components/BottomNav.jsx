import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Mic, User, Settings } from 'lucide-react';

const tabs = [
  { path: '/contacts', icon: Users, label: 'Contacts' },
  { path: '/', icon: Home, label: 'Feed' },
  { path: '/live', icon: Mic, label: 'Live' },
  { path: '/profile', icon: User, label: 'Me' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border flex justify-around items-center h-14 z-50">
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = pathname === path;
        return (
          <Link key={path} to={path} className={`flex flex-col items-center gap-0.5 transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}