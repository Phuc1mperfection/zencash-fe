import React from 'react';

interface TestimonialCardProps {
  image: string;
  name: string;
  role: string;
  quote: string;
}

const TestimonialCard = ({ image, name, role, quote }: TestimonialCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-lg mx-4">
    <div className="flex items-center mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div className="ml-4">
        <h4 className="font-semibold text-[#001e2b]">{name}</h4>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 italic">"{quote}"</p>
  </div>
);

export default TestimonialCard;