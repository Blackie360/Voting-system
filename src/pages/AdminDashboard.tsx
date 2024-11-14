import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, AlertCircle, Users } from 'lucide-react';

interface Poll {
  id: string;
  title: string;
  description: string;
  createdAt: any;
  createdBy: string;
  totalVotes: number;
}

interface Comment {
  id: string;
  pollId: string;
  text: string;
  userId: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'polls' | 'comments'>('polls');

  useEffect(() => {
    const pollsQuery = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
    const unsubscribePolls = onSnapshot(pollsQuery, (snapshot) => {
      const pollsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Poll[];
      setPolls(pollsData);
    });

    // Fetch comments from all polls
    const fetchComments = async () => {
      const commentsQuery = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
      const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];
        setComments(commentsData);
      });

      return unsubscribeComments;
    };

    const unsubscribeCommentsPromise = fetchComments();

    return () => {
      unsubscribePolls();
      unsubscribeCommentsPromise.then(unsubscribe => unsubscribe());
    };
  }, []);

  const handleDeletePoll = async (pollId: string) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await deleteDoc(doc(db, 'polls', pollId));
      } catch (error) {
        console.error('Error deleting poll:', error);
      }
    }
  };

  const handleDeleteComment = async (pollId: string, commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteDoc(doc(db, `polls/${pollId}/comments/${commentId}`));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('polls')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'polls'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Polls
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'polls' ? (
            <div className="space-y-6">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{poll.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{poll.totalVotes} votes</span>
                      </div>
                      <span>
                        Created {formatDistanceToNow(poll.createdAt.toDate(), { addSuffix: true })}
                      </span>
                      <span>by User #{poll.createdBy.slice(-4)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeletePoll(poll.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {polls.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No polls</h3>
                  <p className="mt-1 text-sm text-gray-500">No polls have been created yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-gray-900">{comment.text}</p>
                    <div className="flex items-center space x-4 mt-2 text-sm text-gray-500">
                      <span>
                        Posted {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
                      </span>
                      <span>by User #{comment.userId.slice(-4)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteComment(comment.pollId, comment.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No comments</h3>
                  <p className="mt-1 text-sm text-gray-500">No comments have been posted yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}