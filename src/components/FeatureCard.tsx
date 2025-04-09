import React from 'react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-xl   transition-shadow duration-300 border border-gray-100">
    <div className="h-12 w-12 bg-[#00ed64]/10 rounded-lg flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-[#00ed64]" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-[#001e2b]">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;