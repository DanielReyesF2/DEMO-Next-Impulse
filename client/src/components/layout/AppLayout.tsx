import TopNavigation from "./TopNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <TopNavigation />
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Powered by</span>
            <img 
              src="/images/logo-econova.png" 
              alt="Econova" 
              className="h-4 w-auto"
              style={{ filter: 'invert(1) brightness(0.3)' }}
            />
            <span className="font-medium text-gray-600">Econova</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
