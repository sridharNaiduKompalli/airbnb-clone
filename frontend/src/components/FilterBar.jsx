import React, { useRef, useEffect, useState } from 'react';
import { Compass, TreePine, Waves, Trees, Sun, Milestone, Anchor, Castle, Mountain, Umbrella, Wind, Flame } from 'lucide-react';

const categories = [
  { id: 'all',        label: 'All',        icon: Compass   },
  { id: 'cabins',     label: 'Cabins',     icon: TreePine  },
  { id: 'beachfront', label: 'Beachfront', icon: Waves     },
  { id: 'treehouses', label: 'Treehouses', icon: Trees     },
  { id: 'desert',     label: 'Desert',     icon: Sun       },
  { id: 'historic',   label: 'Historic',   icon: Castle    },
  { id: 'lake',       label: 'Lakefront',  icon: Anchor    },
  { id: 'mountain',   label: 'Mountain',   icon: Mountain  },
  { id: 'tropical',   label: 'Tropical',   icon: Umbrella  },
  { id: 'arctic',     label: 'Arctic',     icon: Wind      },
  { id: 'glamping',   label: 'Glamping',   icon: Flame     },
];

function FilterBar({ selectedCategory, onSelectCategory }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const activeBtn = buttonRefs.current[selectedCategory];
    if (!activeBtn) return;

    // Use offsetLeft instead of getBoundingClientRect to correctly account for horizontal scroll
    setPillStyle({
      left: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
      opacity: 1,
    });
  }, [selectedCategory]);

  return (
    <div className="bg-[#FAF6F0] border-b border-[#E2DCD5] py-4 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="relative flex items-center space-x-1 overflow-x-auto no-scrollbar p-1.5 bg-[#E8E2D9] rounded-full max-w-max mx-auto shadow-inner border border-[#DCD6CC]"
        >
          {/* Animated sliding pill background */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1.5 rounded-full bg-[#2D4030] shadow-md transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              height: 'calc(100% - 12px)',
              opacity: pillStyle.opacity,
            }}
          />

          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => (buttonRefs.current[cat.id] = el)}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full select-none focus:outline-none transition-colors duration-200 active:scale-[0.95] ${
                  isSelected ? 'text-[#FAF6F0]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
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
