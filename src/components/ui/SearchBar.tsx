import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: () => void;
  placeholder?: string;
  className?: string;
  showFilter?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilter,
  placeholder = "Rechercher...",
  className = '',
  showFilter = false
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`
        relative flex items-center
        bg-white dark:bg-gray-800 rounded-xl
        border-2 transition-all duration-300
        ${isFocused 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 dark:border-gray-700'
        }
      `}>
        <Search 
          className="absolute left-4 text-gray-400" 
          size={20} 
        />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-16 py-3 
            bg-transparent text-gray-900 dark:text-white
            placeholder-gray-400 focus:outline-none
          "
        />

        <div className="absolute right-2 flex items-center gap-2">
          {query && (
            <motion.button
              type="button"
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <X size={16} />
            </motion.button>
          )}
          
          {showFilter && onFilter && (
            <button
              type="button"
              onClick={onFilter}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Filter size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default SearchBar;