'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

/**
 * TabContextType defines the shape of the tab context
 * that will be provided throughout the application.
 */
export interface TabContextType {
  activeTab: string;                      // Currently active tab
  setActiveTab: (tab: string) => void;    // Function to change the active tab
}

/**
 * TabContext provides tab state management throughout the application.
 * Default values are provided for type safety but will be overridden by the provider.
 */
export const TabContext = createContext<TabContextType>({
  activeTab: 'profile',
  setActiveTab: () => {},
});

/**
 * TabProvider component that wraps components requiring tab state management.
 * Handles tab state and tab switching functionality.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to tab context
 * @param {string} props.defaultTab - The default tab to be active initially
 */
export const TabProvider = ({ 
  children, 
  defaultTab = 'profile' 
}: { 
  children: ReactNode;
  defaultTab?: string;
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <TabContext.Provider value={{
      activeTab,
      setActiveTab
    }}>
      {children}
    </TabContext.Provider>
  );
};

/**
 * Custom hook to use the tab context.
 * Throws an error if used outside of a TabProvider.
 * 
 * @returns {TabContextType} The tab context
 */
export const useTabContext = (): TabContextType => {
  const context = useContext(TabContext);
  
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  
  return context;
};
