"use client";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600 mb-4 md:mb-0">
            <span className="text-sm">Developed using</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Next.js Logo */}
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" viewBox="0 0 128 128">
                <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z" fill="currentColor"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Next.js</span>
            </div>
            
            {/* React Logo */}
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-2.497.378-4.71 1.283-6.63 2.708a12.004 12.004 0 0 0-4.18 4.18A11.955 11.955 0 0 0 4.5 12c0 2.497.378 4.71 1.283 6.63a12.004 12.004 0 0 0 4.18 4.18c1.92 1.425 4.133 2.33 6.63 2.708a12.004 12.004 0 0 0 4.18-4.18c1.425-1.92 2.33-4.133 2.708-6.63a12.004 12.004 0 0 0-4.18-4.18c-1.92-1.425-4.133-2.33-6.63-2.708zM12 8.25c-2.07 0-3.75 1.68-3.75 3.75s1.68 3.75 3.75 3.75 3.75-1.68 3.75-3.75-1.68-3.75-3.75-3.75z" fill="#61DAFB"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">React</span>
            </div>
            
            {/* Supabase Logo */}
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zM12 6.75c-2.9 0-5.25 2.35-5.25 5.25S9.1 17.25 12 17.25s5.25-2.35 5.25-5.25S14.9 6.75 12 6.75zm0 2.25c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" fill="#3ECF8E"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 