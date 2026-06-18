import type { Metadata } from 'next';
import { ApplicationsList } from '@/components/applications/ApplicationsList';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const metadata: Metadata = {
  title: 'Job Applications',
  description:
    'View, filter, search, and manage all your job applications.',
};

export default function ApplicationsPage() {
  return (
    <PageWrapper>
      <ApplicationsList />
    </PageWrapper>
  );
}
