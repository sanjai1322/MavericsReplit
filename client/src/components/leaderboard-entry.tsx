import { motion } from "framer-motion";

interface LeaderboardEntryProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    profileImageUrl?: string;
    xp: number;
    badges?: string[];
  };
  rank: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardEntry({ user, rank, isCurrentUser }: LeaderboardEntryProps) {
  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User';
  const badgeCount = user.badges?.length || 0;
  
  // Determine user title based on XP
  const getUserTitle = (xp: number) => {
    if (xp >= 50000) return "Elite Developer";
    if (xp >= 25000) return "Senior Developer";
    if (xp >= 10000) return "Full-Stack Developer";
    if (xp >= 5000) return "Frontend Developer";
    if (xp >= 2000) return "Backend Developer";
    return "Aspiring Developer";
  };

  const userTitle = getUserTitle(user.xp);

  return (
    <motion.div 
      className={`px-6 py-4 flex items-center justify-between hover:bg-[var(--space-700)] transition-colors ${
        isCurrentUser ? 'bg-[var(--space-700)] border-l-4 border-[var(--neon-green)]' : ''
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ x: 5 }}
    >
      <div className="flex items-center space-x-4">
        {/* Rank */}
        <span className={`w-8 text-center font-bold ${
          isCurrentUser ? 'text-[var(--neon-green)]' : 'text-gray-400'
        }`}>
          {rank}
        </span>
        
        {/* Profile Image */}
        <div className="relative">
          <img 
            src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1a1a3a&color=ffffff`}
            alt={`${displayName} profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
          />
          {isCurrentUser && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--neon-green)] rounded-full border-2 border-[var(--space-900)]"></div>
          )}
        </div>
        
        {/* User Info */}
        <div>
          <h4 className={`font-semibold ${isCurrentUser ? 'text-[var(--neon-green)]' : 'text-white'}`}>
            {displayName}
            {isCurrentUser && <span className="ml-2 text-xs text-[var(--neon-green)]">(You)</span>}
          </h4>
          <p className="text-sm text-gray-400">{userTitle}</p>
        </div>
      </div>
      
      {/* XP and Badges */}
      <div className="text-right">
        <p className={`font-bold ${isCurrentUser ? 'text-[var(--neon-green)]' : 'text-[var(--neon-green)]'}`}>
          {user.xp.toLocaleString()} XP
        </p>
        <div className="flex justify-end space-x-1 mt-1">
          {badgeCount > 0 && (
            <>
              {Array.from({ length: Math.min(badgeCount, 3) }, (_, i) => (
                <i key={i} className="fas fa-medal text-yellow-400 text-sm"></i>
              ))}
              {badgeCount > 3 && (
                <span className="text-xs text-gray-400 ml-1">+{badgeCount - 3}</span>
              )}
            </>
          )}
          {badgeCount === 0 && (
            <span className="text-xs text-gray-500">No badges yet</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
