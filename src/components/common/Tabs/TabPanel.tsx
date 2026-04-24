'use client';

import { useTabs } from './Tabs';

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}

export default function TabPanel({ value, children }: TabPanelProps) {
  const { value: active } = useTabs();

  if (active !== value) return null;

  return <div>{children}</div>;
}
