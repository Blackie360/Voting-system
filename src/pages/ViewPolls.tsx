import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Users, BarChart2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface Poll {
  id: string;
  title: string;
  description: string;
  createdAt: any;
  totalVotes: number;
  options: Record<string, { text: string; votes: number }>;
}

export default function ViewPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pollsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Poll[];
      
      setPolls(pollsData);
    });

    return () => unsubscribe();
  }, []);

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'active':
        return poll.totalVotes < 100; // Example condition
      case 'ended':
        return poll.totalVotes >= 100; // Example condition
      default:
        return true;
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Live Polls</h1>
        
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'ended')}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Polls</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPolls.map((poll, index) => (
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              to={`/poll/${poll.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {poll.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {poll.description}
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <BarChart2 className="h-4 w-4" />
                    <span>{Object.keys(poll.options).length} options</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>Discuss</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Created {formatDistanceToNow(poll.createdAt.toDate(), { addSuffix: true })}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredPolls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No polls found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}