'use client';

import { createContext, useContext, useState } from 'react';
import type { TabsContextType, TabValue } from './type';

const TabsContext = createContext<TabsContextType | null>(null);

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs 내부에서만 사용하세요');
  return context;
}

interface TabsProps {
  defaultValue: TabValue;
  children: React.ReactNode;
}

export default function Tabs({ defaultValue, children }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>{children}</TabsContext.Provider>
  );
}
