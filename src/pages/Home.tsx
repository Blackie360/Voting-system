import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Vote, Users, MessageSquare, Lock, Share2 } from 'lucide-react';

const features = [
  {
    icon: <Vote className="h-6 w-6" />,
    title: 'Create Custom Polls',
    description: 'Create engaging polls with multiple options and real-time results tracking.'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Anonymous Voting',
    description: 'Participate in polls anonymously while maintaining transparency.'
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Real-time Discussion',
    description: 'Engage in meaningful discussions with other participants through comments.'
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Secure & Private',
    description: 'Your identity remains protected while participating in polls.'
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: 'Easy Sharing',
    description: 'Share polls instantly with anyone through a simple link.'
  }
];

const testimonials = [
  {
    text: "This platform revolutionized how we conduct team decisions. It's simple yet powerful.",
    author: "Anonymous User #4f92"
  },
  {
    text: "The real-time updates and anonymous voting feature make this tool indispensable.",
    author: "Anonymous User #8h31"
  },
  {
    text: "Perfect for gathering honest feedback without peer pressure.",
    author: "Anonymous User #2k19"
  }
];

export default function Home() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Make Better Decisions Together</h1>
          <p className="text-xl mb-8">
            Create polls, vote anonymously, and get instant results with our real-time voting platform.
          </p>
          <Link
            to="/create"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Create Your First Poll
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        initial={{ opacity: 0, y: 20 }}
        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-indigo-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        ref={testimonialsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <p className="text-sm text-gray-500">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600 mb-2">10k+</div>
            <div className="text-gray-600">Active Polls</div>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600 mb-2">50k+</div>
            <div className="text-gray-600">Monthly Votes</div>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
}