import React from 'react';
import { Compass, TreePine, Waves, Trees, Sun, Milestone, Anchor } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: Compass },
  { id: 'cabins', label: 'Cabins', icon: TreePine },
  { id: 'beachfront', label: 'Beachfront', icon: Waves },
  { id: 'treehouses', label: 'Treehouses', icon: Trees },
  { id: 'desert', label: 'Desert', icon: Sun },
  { id: 'historic', label: 'Historic', icon: Milestone },
  { id: 'lake', label: 'Lakefront', icon: Anchor },
];

function FilterBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="bg-[#FAF6F0] border-b border-[#E2DCD5] py-4 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar p-1.5 bg-[#E8E2D9] rounded-full max-w-max mx-auto shadow-inner border border-[#DCD6CC]">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) select-none focus:outline-none active:scale-[0.95] ${
                  isActive
                    ? 'bg-[#2D4030] text-[#FAF6F0] shadow-md transform scale-[1.03]'
                    : 'text-[#605549] hover:text-[#2D4030] hover:bg-[#E2DCD5]/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-semibold whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
