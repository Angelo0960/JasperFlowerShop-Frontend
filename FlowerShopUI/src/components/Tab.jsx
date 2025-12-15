import React, { useState } from 'react';


const Tabs = ({ initialActiveTab, tabs, onTabChange }) => {
  
  const [activeTab, setActiveTab] = useState(initialActiveTab || (tabs.length > 0 ? tabs[0].key : ''));

  
  const handleNavClick = (key) => {
    setActiveTab(key);
    onTabChange(key);
  };

  return (
    <nav className="w-60 h-full bg-white border-r border-gray-200 shadow-md">
      
      <ul className="py-8 space-y-4 px-3"> {}
        {tabs.map((tab) => (
          <li key={tab.key}>
            <button
              onClick={() => handleNavClick(tab.key)}
             
              className={`
                w-full text-left px-4 py-3 flex items-center space-x-3 rounded-xl 
                transition-all duration-200 ease-in-out
                
                ${activeTab === tab.key 
                  ? "bg-pink-800/55 text-white font-semibold " 
                  : "text-gray-600 hover:text-pink-500 hover:bg-gray-50" 
                }
              `}
            >
              {}
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