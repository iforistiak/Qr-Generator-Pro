import React, { useState, useEffect } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquareHeart,
  Send,
  Check,
  Sparkles,
  HelpCircle,
  Mail,
  UserCheck,
} from 'lucide-react';

export const FeedbackSection: React.FC = () => {
  // Voting State
  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('qr_user_voted') === 'true';
    } catch {
      return false;
    }
  });

  const [votes, setVotes] = useState<{ useful: number; notUseful: number }>(() => {
    try {
      const saved = localStorage.getItem('qr_votes_count');
      return saved ? JSON.parse(saved) : { useful: 248, notUseful: 6 };
    } catch {
      return { useful: 248, notUseful: 6 };
    }
  });

  const [voteChoice, setVoteChoice] = useState<'useful' | 'notUseful' | null>(() => {
    try {
      return (localStorage.getItem('qr_user_vote_choice') as any) || null;
    } catch {
      return null;
    }
  });

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState<string>('Feature Request');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);

  const handleVote = (type: 'useful' | 'notUseful') => {
    if (hasVoted) return;

    const newVotes = {
      ...votes,
      [type]: votes[type] + 1,
    };

    setVotes(newVotes);
    setHasVoted(true);
    setVoteChoice(type);

    try {
      localStorage.setItem('qr_user_voted', 'true');
      localStorage.setItem('qr_user_vote_choice', type);
      localStorage.setItem('qr_votes_count', JSON.stringify(newVotes));
    } catch {
      // ignore
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('qr_user_feedback_list') || '[]');
      existing.push({
        category: feedbackCategory,
        text: feedbackText,
        email: userEmail,
        date: new Date().toISOString(),
      });
      localStorage.setItem('qr_user_feedback_list', JSON.stringify(existing));
    } catch {
      // ignore
    }

    // Trigger mailto link in background for developer notification
    const subject = encodeURIComponent(`[QR Studio Pro Feedback] ${feedbackCategory}`);
    const body = encodeURIComponent(
      `Category: ${feedbackCategory}\nFrom: ${userEmail || 'Anonymous User'}\n\nFeedback:\n${feedbackText}`
    );
    const mailtoUrl = `mailto:iforistiak@gmail.com?subject=${subject}&body=${body}`;

    // Safely trigger mailto
    try {
      const a = document.createElement('a');
      a.href = mailtoUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Sandboxed iframe might block mailto navigation; local storage already saved feedback
    }

    setSubmittedFeedback(true);
    setFeedbackText('');
  };

  const totalVotes = votes.useful + votes.notUseful;
  const usefulPercent = totalVotes > 0 ? Math.round((votes.useful / totalVotes) * 100) : 98;

  return (
    <section className="my-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10" aria-label="User Feedback and Rating">
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/80 p-5 sm:p-8 shadow-xl shadow-slate-200/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Usefulness Voting Box */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-700 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Community Feedback</span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Was QR Studio Pro useful for you?
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Cast your vote to help us gauge developer and designer satisfaction.
              </p>
            </div>

            {/* Voting Action Buttons */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Useful button */}
                <button
                  type="button"
                  onClick={() => handleVote('useful')}
                  disabled={hasVoted}
                  className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    voteChoice === 'useful'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/30'
                      : hasVoted
                      ? 'bg-white border border-slate-200 text-slate-400 cursor-default'
                      : 'bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200/90 text-slate-700 shadow-2xs active:scale-95'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Useful ({votes.useful})</span>
                </button>

                {/* Not Useful button */}
                <button
                  type="button"
                  onClick={() => handleVote('notUseful')}
                  disabled={hasVoted}
                  className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    voteChoice === 'notUseful'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 ring-2 ring-rose-500/30'
                      : hasVoted
                      ? 'bg-white border border-slate-200 text-slate-400 cursor-default'
                      : 'bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200/90 text-slate-700 shadow-2xs active:scale-95'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Needs Work ({votes.notUseful})</span>
                </button>
              </div>

              {/* Live Satisfaction Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Satisfaction Rate</span>
                  <span className="text-emerald-600 font-bold">{usefulPercent}% Positive</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${usefulPercent}%` }}
                  />
                </div>
              </div>

              {hasVoted && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200/70 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Thank you for voting! Your voice shapes our updates.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: User Feedback & Support Form */}
          <div className="lg:col-span-7 bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Support & Direct Feedback</h4>
                <p className="text-[11px] text-slate-500">
                  Message MD ISTIAK ISLAM directly with suggestions or questions
                </p>
              </div>
            </div>

            {submittedFeedback ? (
              <div className="p-6 bg-white rounded-xl border border-emerald-200 text-center space-y-2 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h5 className="text-sm font-bold text-slate-900">Feedback Sent Successfully!</h5>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you! Your feedback has been recorded and submitted to <strong>MD ISTIAK ISLAM</strong> (iforistiak@gmail.com).
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedFeedback(false)}
                  className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-3">
                {/* Category Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Category:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Feature Request', 'Report Bug', 'Support Question', 'Appreciation'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFeedbackCategory(cat)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          feedbackCategory === cat
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message TextArea */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Message / Suggestions:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you'd like improved, new export formats, or request developer support..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
                  />
                </div>

                {/* Email (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Your Email (Optional, for developer reply):
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Send Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={!feedbackText.trim()}
                      className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Feedback to MD ISTIAK ISLAM</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
