import { Metadata } from 'next';
import ShopClient from './shop-client';

export const metadata: Metadata = {
  title: 'فروشگاه — اَوید کیا',
  description: 'فروشگاه محصولات دیجیتال — قالب، ابزار، آموزش — تحویل آنی، لایسنس مادام‌العمر',
};

export default function Page(){ return <ShopClient /> }
