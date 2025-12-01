
import React from 'react';

interface SectionHeaderProps {
  badge: string;
  title: string;
  description: string;
}

export function SectionHeader({ badge, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-16">
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-educare-100 text-educare-800 inline-block mb-4">
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        {title}
      </h2>
      <p className="text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default SectionHeader;
