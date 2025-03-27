import { ReactTyped } from 'react-typed';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-32 px-4 text-white">
      <div 
      className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <p className='text-[#00ed64] font-bold p-2'>
          SMART FINANCIAL MANAGEMENT
        </p>
        <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          Easily Control Your Spending.
        </h1>
        <div className='flex justify-center items-center'>
          <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>
            Solutions for
          </p>
          <ReactTyped 
          className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2'
            strings={['Students', 'Professionals', 'Young Adults']}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <p className='md:text-2xl text-xl font-bold text-gray-500'>
          Build saving habits and manage your finances starting today.
        </p>
        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00ed64] text-[#001e2b] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#00ed64]/90 transition-colors duration-300 flex items-center mx-auto mt-2">
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
      </div>
    </section>
  );
};

export default Hero;