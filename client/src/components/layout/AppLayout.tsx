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
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-500">Powered by</span>
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo-econova.png" 
                alt="Econova" 
                className="h-6 w-auto"
                style={{ filter: 'invert(1) brightness(0.2)' }}
              />
              <span className="text-sm font-semibold text-gray-700">Econova</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
