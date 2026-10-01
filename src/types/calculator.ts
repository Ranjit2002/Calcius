export type CalculatorCategory = 'all' | 'math' | 'finance' | 'health' | 'measurement' | 'tech';

export interface CalculatorMeta {
  id: string;
  name: string;
  shortName: string;
  path: string;
  description: string;
  category: CalculatorCategory;
  badge?: string;
  iconName: string;
  gradient: string;
  accentColor: string;
  quickInfo: string;
  keywords: string[];
}
