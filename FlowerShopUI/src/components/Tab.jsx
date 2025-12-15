import React, { useState } from 'react';

// The Tabs component now renders vertically as a side navigation.
// It requires `tabs` (array of {key, label, icon, content}) and `onTabChange` to lift the active state.
const Tabs = ({ initialActiveTab, tabs, onTabChange }) => {
  // Use the local state only to manage the visual active link
  const [activeTab, setActiveTab] = useState(initialActiveTab || (tabs.length > 0 ? tabs[0].key : ''));

  // Handler to set the local state and inform the parent component
  const handleNavClick = (key) => {
    setActiveTab(key);
    onTabChange(key);
  };

  return (
    // Side Navigation Container (Keeping the existing w-60 as the wrapper)
    <nav className="w-60 h-full bg-white border-r border-gray-200 shadow-md">
      
      {/* Navigation Links List */}
      <ul className="py-8 space-y-4 px-3"> {/* Added vertical padding and horizontal margin for the links */}
        {tabs.map((tab) => (
          <li key={tab.key}>
            <button
              onClick={() => handleNavClick(tab.key)}
              // Styling updated to match the Pink Capsule design
              className={`
                w-full text-left px-4 py-3 flex items-center space-x-3 rounded-xl 
                transition-all duration-200 ease-in-out
                
                ${activeTab === tab.key 
                  ? "bg-pink-800/55 text-white font-semibold " // Active style: Pink capsule
                  : "text-gray-600 hover:text-pink-500 hover:bg-gray-50" // Inactive style: Simple hover 
                }
              `}
            >
              {/* Icon placeholder: Adjusted sizing for better alignment */}
              {tab.icon && <span className="text-xl">{tab.icon}</span>}
              
              <span>{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Tabs;