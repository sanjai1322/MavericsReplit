import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import LeaderboardEntry from "@/components/leaderboard-entry";
import AIChatbot from "@/components/ai-chatbot";
import { motion } from "framer-motion";

const timePeriods = [
  { id: 'all', name: 'All Time' },
  { id: 'week', name: 'This Week' },
  { id: 'today', name: 'Today' },
];

export default function Leaderboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--space-900)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--neon-green)]"></div>
      </div>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const restOfLeaderboard = leaderboard?.slice(3, 10) || [];
  const currentUserRank = leaderboard?.findIndex((u: any) => u.id === user?.id) + 1 || 0;

  return (
    <div className="min-h-screen bg-[var(--space-900)]">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--neon-blue)] opacity-5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-[var(--neon-green)] opacity-5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <motion.h1 
                className="font-orbitron text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Leaderboard
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Compete with developers worldwide and climb the ranks
              </motion.p>
              
              {/* Time Period Filters */}
              <motion.div 
                className="flex justify-center space-x-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {timePeriods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 ${
                      selectedPeriod === period.id
                        ? 'bg-[var(--neon-green)] text-[var(--space-900)]'
                        : 'border border-gray-600 text-gray-300 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]'
                    }`}
                  >
                    {period.name}
                  </button>
                ))}
              </motion.div>

              {/* Current User Rank */}
              {currentUserRank > 0 && (
                <motion.div 
                  className="mt-8 glass-morphism p-4 rounded-lg max-w-md mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <p className="text-gray-300">
                    Your Rank: <span className="text-[var(--neon-green)] font-bold">#{currentUserRank}</span>
                  </p>
                  <p className="text-sm text-gray-400">Keep coding to climb higher!</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {leaderboardLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--neon-green)]"></div>
                </div>
              ) : leaderboard && leaderboard.length > 0 ? (
                <>
                  {/* Top 3 */}
                  <motion.div 
                    className="grid md:grid-cols-3 gap-6 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {/* 2nd Place */}
                    {topThree[1] && (
                      <div className="order-2 md:order-1 text-center">
                        <div className="glass-morphism p-6 rounded-xl">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">2</span>
                          </div>
                          <img 
                            src={topThree[1].profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[1].firstName + ' ' + topThree[1].lastName)}&background=1a1a3a&color=ffffff`}
                            alt="Profile" 
                            className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" 
                          />
                          <h3 className="font-orbitron font-bold text-lg">
                            {topThree[1].firstName} {topThree[1].lastName}
                          </h3>
                          <p className="text-[var(--neon-blue)] text-2xl font-bold">{topThree[1].xp || 0} XP</p>
                          <div className="flex justify-center space-x-1 mt-2">
                            {(topThree[1].badges || []).slice(0, 3).map((badge: string, i: number) => (
                              <i key={i} className="fas fa-medal text-yellow-400"></i>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 1st Place */}
                    {topThree[0] && (
                      <div className="order-1 md:order-2 text-center">
                        <div className="glass-morphism p-6 rounded-xl border-2 border-[var(--neon-green)]">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--neon-green)] to-emerald-400 flex items-center justify-center animate-pulse-neon">
                            <i className="fas fa-crown text-[var(--space-900)] text-3xl"></i>
                          </div>
                          <img 
                            src={topThree[0].profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[0].firstName + ' ' + topThree[0].lastName)}&background=1a1a3a&color=ffffff`}
                            alt="Profile" 
                            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" 
                          />
                          <h3 className="font-orbitron font-bold text-xl text-[var(--neon-green)]">
                            {topThree[0].firstName} {topThree[0].lastName}
                          </h3>
                          <p className="text-[var(--neon-green)] text-3xl font-bold">{topThree[0].xp || 0} XP</p>
                          <div className="flex justify-center space-x-1 mt-2">
                            {(topThree[0].badges || []).slice(0, 5).map((badge: string, i: number) => (
                              <i key={i} className="fas fa-medal text-yellow-400"></i>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 3rd Place */}
                    {topThree[2] && (
                      <div className="order-3 text-center">
                        <div className="glass-morphism p-6 rounded-xl">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">3</span>
                          </div>
                          <img 
                            src={topThree[2].profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[2].firstName + ' ' + topThree[2].lastName)}&background=1a1a3a&color=ffffff`}
                            alt="Profile" 
                            className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" 
                          />
                          <h3 className="font-orbitron font-bold text-lg">
                            {topThree[2].firstName} {topThree[2].lastName}
                          </h3>
                          <p className="text-amber-400 text-2xl font-bold">{topThree[2].xp || 0} XP</p>
                          <div className="flex justify-center space-x-1 mt-2">
                            {(topThree[2].badges || []).slice(0, 2).map((badge: string, i: number) => (
                              <i key={i} className="fas fa-medal text-yellow-400"></i>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Full Leaderboard */}
                  <motion.div 
                    className="glass-morphism rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <div className="bg-[var(--space-700)] px-6 py-4 border-b border-gray-600">
                      <h3 className="font-orbitron font-bold text-[var(--neon-blue)]">Top 10 Developers</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-600">
                      {restOfLeaderboard.map((user: any, index: number) => (
                        <LeaderboardEntry
                          key={user.id}
                          user={user}
                          rank={index + 4}
                          isCurrentUser={user.id === user?.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : (
                <div className="text-center">
                  <div className="glass-morphism p-12 rounded-xl max-w-md mx-auto">
                    <i className="fas fa-trophy text-4xl text-[var(--neon-blue)] mb-4"></i>
                    <h3 className="font-orbitron text-xl font-bold mb-4">No Rankings Yet</h3>
                    <p className="text-gray-300 mb-6">
                      Start coding and earning XP to appear on the leaderboard!
                    </p>
                    <button
                      onClick={() => window.location.href = '/ide'}
                      className="px-6 py-3 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)] font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                      Start Coding
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}
