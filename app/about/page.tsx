import { Metadata } from 'next';
import AboutClient from './about-client';

export const metadata: Metadata = {
  title: 'درباره — اَوید کیا',
  description: 'Command Center — اَوید کیا',
};

export default function Page(){ return <AboutClient /> }
