'use client';

import { DeveloperProfile } from '@/lib/types';
import LanguageOrbit from './language-orbit';
import RepositoryComplexity from './repository-complexity';

interface DataGridProps {
  data: DeveloperProfile;
}

export default function DataGrid({ data }: DataGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      <LanguageOrbit languages={data.topLanguages} />
      <RepositoryComplexity repositories={data.repositories} />
    </div>
  );
}