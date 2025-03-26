import { JSX } from 'react';

export interface CardInfo {
  id: number;
  path: string;
  title: string;
  description: string;
  icon: JSX.Element;
}