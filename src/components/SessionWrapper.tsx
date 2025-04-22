import { auth } from "@/auth"
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default async function SessionWrapper({ children }: Props) {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>
  return {children};
}