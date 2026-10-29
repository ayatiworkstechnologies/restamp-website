import { redirect } from 'next/navigation';

export default function AgentPlansRedirect() {
  redirect('/agent/packages');
}
