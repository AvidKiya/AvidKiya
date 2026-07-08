import { Metadata } from 'next';
import ShopClient from './shop-client';
export const metadata: Metadata = {
  title: 'فروشگاه — اَوید کیا',
  description: 'محصولات دیجیتال — قالب، ابزار، آموزش',
};
export default function Page(){ return <ShopClient /> }
