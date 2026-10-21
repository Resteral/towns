import { redirect } from 'next/navigation';

export default function DashboardCardsRedirectPage() {
  redirect('/dashboard/storefront');
}
