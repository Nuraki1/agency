// File: src/app/components/NavBar.tsx
'use client';

import { useRouter } from 'next/navigation';

interface NavBarProps {
  currentPage?: string;
}

export default function NavBar({ currentPage = 'dashboard' }: NavBarProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/' },
    { id: 'customers', label: 'Customers', path: '/customers' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'settings', label: 'Settings', path: '/settings' }
  ];

  return (
    <header className="bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">H&S Foreign Employment System</h1>
        <nav>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`font-medium cursor-pointer hover:text-blue-200 ${
                  currentPage === item.id ? 'text-blue-200 underline' : ''
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}