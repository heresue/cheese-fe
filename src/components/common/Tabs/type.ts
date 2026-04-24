export type TabValue = string;

export interface TabsContextType {
  value: TabValue;
  onChange: (value: TabValue) => void;
}
