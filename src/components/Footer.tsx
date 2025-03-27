import React from 'react';

const Footer = () => (
  <footer className="bg-[#001e2b] py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Zen Cash</h3>
          <p className="text-gray-400">Making financial management peaceful.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Features</a></li>
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Pricing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Security</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">About</a></li>
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Blog</a></li>
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Contact</a></li>
            <li><a href="#" className="text-gray-400 hover:text-[#00ed64]">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center">
        <p className="text-gray-400">&copy; 2025 Zen Cash. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;