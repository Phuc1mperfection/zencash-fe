
import { ArrowRight, BarChart3, Brain, Lock, Wallet2 } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Take Control of Your Finances with Zen Cash
          </h1>
          <p className="text-xl text-[#FFD678] mb-8 max-w-2xl mx-auto">
            Smart budgeting, expense tracking, and financial insights in one place.
          </p>
          <button className="bg-[#00ed64] text-[#001e2b] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#00ed64]/90 transition-colors duration-300 flex items-center mx-auto">
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#001e2b] mb-16">
            Features that make managing money easier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Wallet2}
              title="Smart Expense Tracking"
              description="Automatically categorize and track your expenses in real-time."
            />
            <FeatureCard
              icon={Brain}
              title="AI Budgeting"
              description="Get personalized recommendations based on your spending habits."
            />
            <FeatureCard
              icon={BarChart3}
              title="Financial Reports"
              description="Detailed analytics and insights to help you make better decisions."
            />
            <FeatureCard
              icon={Lock}
              title="Secure & Private"
              description="Bank-level security to keep your financial data safe."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            What our users say
          </h2>
          <div className="flex overflow-x-auto pb-8 -mx-4">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              name="Sarah Johnson"
              role="Small Business Owner"
              quote="Zen Cash has transformed how I manage both my personal and business finances. The AI recommendations are incredibly helpful!"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              name="David Chen"
              role="Software Engineer"
              quote="The automated expense tracking saves me hours each month. Best financial app I've ever used!"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
              name="Emily Rodriguez"
              role="Freelancer"
              quote="Finally, an app that makes budgeting feel effortless. The interface is beautiful and intuitive."
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;