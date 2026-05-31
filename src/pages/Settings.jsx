import { ChevronRight, User, CreditCard, Bell, Lock, HelpCircle, Info, LogOut, Moon, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

const groups = [
  { items: [
    { icon: CreditCard, label: 'Payment', sub: 'Cards, wallets & transactions' },
    { icon: User, label: 'Account', sub: 'Personal info & security' },
  ]},
  { items: [
    { icon: Bell, label: 'Notifications', sub: 'Push, email & in-app' },
    { icon: Lock, label: 'Privacy', sub: 'Who can see your activity' },
    { icon: Globe, label: 'Language', sub: 'English' },
  ]},
  { items: [
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: Info, label: 'About', sub: 'Version 1.0.0' },
  ]},
];

export default function Settings() {
  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold font-heading">Settings</h1>
      </div>

      <Link to="/profile" className="flex items-center gap-3 px-4 py-4 border-b border-border hover:bg-muted/50 transition-colors">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <User className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">My Account</p>
          <p className="text-xs text-muted-foreground">Manage your profile</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Moon className="h-4 w-4" /></div>
          <span className="text-sm font-medium">Dark Mode</span>
        </div>
        <Switch />
      </div>

      {groups.map((g, gi) => (
        <div key={gi}>
          {gi > 0 && <div className="h-2 bg-muted/50" />}
          {g.items.map((item, i) => (
            <button key={i} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      ))}

      <div className="h-2 bg-muted/50" />
      <button onClick={() => base44.auth.logout()} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <LogOut className="h-4 w-4 text-red-500" />
        </div>
        <span className="text-sm font-medium text-red-500">Log Out</span>
      </button>

      <div className="py-8 text-center">
        <p className="text-xs text-muted-foreground">Socialite v1.0.0</p>
      </div>
    </div>
  );
}