import { redirect } from 'next/navigation';

// Root / is handled by proxy.ts which redirects to /{locale}/
// This fallback fires only if the proxy is bypassed.
export default function RootPage() {
  redirect('/en');
}
