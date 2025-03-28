
import React from 'react';
import { Eye } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Eye className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">AttentionMapper</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/attention-mapper" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Documentation
          </a>
          <a 
            href="#feedback"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Feedback
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
