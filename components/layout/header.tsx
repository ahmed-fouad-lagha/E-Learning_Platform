
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, User, LogOut, BookOpen, CreditCard, BarChart3, Settings, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: BookOpen },
    { href: '/courses', label: 'الدورات', icon: BookOpen },
    ...(user ? [
      { href: '/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
      { href: '/dashboard/credits', label: 'الرصيد', icon: CreditCard },
    ] : []),
    ...(user?.role === 'admin' ? [
      { href: '/admin', label: 'الإدارة', icon: Settings },
    ] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold text-sm">
                EVA
              </div>
              <span className="hidden sm:block font-bold text-xl text-gray-900">
                منصة التعلم الجزائرية
              </span>
              <span className="sm:hidden font-bold text-lg text-gray-900">
                EVA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop User Menu & Mobile Menu Button */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Search Button (Mobile) */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              {user && (
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
              )}

              {/* Desktop User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        لوحة التحكم
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/credits" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        الرصيد
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                  <Button variant="ghost" asChild>
                    <Link href="/auth">تسجيل الدخول</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth">إنشاء حساب</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-right">القائمة</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {/* User Info (Mobile) */}
                    {user && (
                      <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url} alt={user.name} />
                          <AvatarFallback>
                            {user.name?.charAt(0) || user.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-right">
                          <p className="font-medium text-sm">{user.name || user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.role === 'admin' ? 'مدير' : 
                             user.role === 'teacher' ? 'معلم' : 'طالب'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Items */}
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </nav>

                    {/* Auth Buttons (Mobile) */}
                    {!user && (
                      <div className="space-y-2 pt-4 border-t">
                        <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                          <Link href="/auth">تسجيل الدخول</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full" onClick={() => setIsOpen(false)}>
                          <Link href="/auth">إنشاء حساب</Link>
                        </Button>
                      </div>
                    )}

                    {/* Logout (Mobile) */}
                    {user && (
                      <div className="pt-4 border-t">
                        <Button
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          تسجيل الخروج
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
          <div className="grid grid-cols-4 gap-1">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                  isActive(item.href)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-600'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="truncate max-w-full">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
