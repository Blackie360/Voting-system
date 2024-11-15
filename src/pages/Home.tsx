import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Vote, Users, MessageSquare, Lock, Share2 } from 'lucide-react';

const features = [
  {
    icon: <Vote className="h-6 w-6" />,
    title: 'Nominate and Vote',
    description: 'Nominate your favorite individuals and vote for the winners in real time.'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Open to All',
    description: 'Open voting for students, faculty, and community members.'
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Share Your Voice',
    description: 'Participate in discussions and support nominees through comments.'
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Secure Voting',
    description: 'Your votes remain private and secure through encrypted technology.'
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: 'Instant Sharing',
    description: 'Share the voting link with friends and encourage more votes.'
  }
];

const testimonials = [
  {
    text: "KUSO Awards let me recognize amazing contributions across campus.",
    author: "Anonymous Student #9d35"
  },
  {
    text: "It's fantastic to see our community come together to celebrate excellence.",
    author: "Anonymous Faculty #ff70"
  },
  {
    text: "A great platform to showcase and reward student achievements.",
    author: "Anonymous Staff #9d22"
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
        className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-[#9D2235] to-[#FFD700] text-white"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">KUSO Awards Voting Platform</h1>
          <p className="text-xl mb-8">
            Celebrate excellence at Kabarak University! Nominate, vote, and support your favorite nominees.
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-[#9D2235] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Start Voting
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
        <h2 className="text-3xl font-bold text-center mb-12">Why Vote in the KUSO Awards?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-[#9D2235] mb-4">{feature.icon}</div>
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
        className="bg-[#f8f8f8] py-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Community Says</h2>
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
          <div className="bg-[#FFD700] p-6 rounded-lg">
            <div className="text-3xl font-bold text-[#9D2235] mb-2">5k+</div>
            <div className="text-gray-600">Nominations</div>
          </div>
          <div className="bg-[#FFD700] p-6 rounded-lg">
            <div className="text-3xl font-bold text-[#9D2235] mb-2">20k+</div>
            <div className="text-gray-600">Votes Cast</div>
          </div>
          <div className="bg-[#FFD700] p-6 rounded-lg">
            <div className="text-3xl font-bold text-[#9D2235] mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
}
