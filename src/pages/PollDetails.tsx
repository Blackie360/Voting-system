import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Users } from 'lucide-react';

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  title: string;
  description: string;
  options: Record<string, PollOption>;
  totalVotes: number;
  createdAt: any;
}

interface Comment {
  id: string;
  text: string;
  createdAt: any;
  userId: string;
}

export default function PollDetails() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore(state => state.user);
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const unsubscribePoll = onSnapshot(doc(db, 'polls', id), (doc) => {
      if (doc.exists()) {
        setPoll(doc.data() as Poll);
      }
      setLoading(false);
    });

    const q = query(collection(db, `polls/${id}/comments`), orderBy('createdAt', 'desc'));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
    });

    return () => {
      unsubscribePoll();
      unsubscribeComments();
    };
  }, [id]);

  const handleVote = async (optionKey: string) => {
    if (!user || !id || userVote) return;

    try {
      const pollRef = doc(db, 'polls', id);
      await updateDoc(pollRef, {
        [`options.${optionKey}.votes`]: poll!.options[optionKey].votes + 1,
        totalVotes: poll!.totalVotes + 1
      });
      setUserVote(optionKey);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newComment.trim()) return;

    try {
      await addDoc(collection(db, `polls/${id}/comments`), {
        text: newComment,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  const totalVotes = poll.totalVotes;

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'Just now';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{poll.title}</h1>
        <p className="text-gray-600 mb-6">{poll.description}</p>

        <div className="space-y-4">
          {Object.entries(poll.options).map(([key, option]) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            
            return (
              <button
                key={key}
                onClick={() => handleVote(key)}
                disabled={!user || !!userVote}
                className={`w-full text-left p-4 rounded-lg border ${
                  userVote === key
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-500'
                } transition-colors relative`}
              >
                <div className="flex justify-between items-center relative z-10">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-gray-500">
                    {option.votes} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div
                  className="absolute inset-0 bg-indigo-100 rounded-lg transition-all"
                  style={{ width: `${percentage}%`, opacity: 0.2 }}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{totalVotes} total votes</span>
          </div>
          <span>Created {formatTimestamp(poll.createdAt)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">Comments</h2>
        </div>

        {user ? (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-6">Please log in to comment.</p>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <p className="text-gray-900">{comment.text}</p>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Anonymous User #{comment.userId.slice(-4)}
              </p>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-center text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}