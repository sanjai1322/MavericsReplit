import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Choose Your Path",
    description: "Select from AI-curated learning paths or jump into competitive challenges tailored to your skill level",
    icon: "fas fa-route",
    color: "var(--neon-green)",
    gradient: "from-[var(--neon-green)] to-emerald-400"
  },
  {
    number: 2,
    title: "Code & Learn", 
    description: "Practice in our advanced IDE with real-time feedback and AI assistance that helps you grow faster",
    icon: "fas fa-laptop-code",
    color: "var(--neon-blue)",
    gradient: "from-[var(--neon-blue)] to-blue-400"
  },
  {
    number: 3,
    title: "Compete & Earn",
    description: "Join hackathons, earn XP, unlock badges, and climb the leaderboard to showcase your skills",
    icon: "fas fa-trophy",
    color: "purple-500",
    gradient: "from-purple-500 to-pink-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="font-orbitron text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Three simple steps to master coding and join the elite developers
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number}
              className="gradient-border card-glow transition-all duration-300 group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="gradient-border-content p-8 h-full">
                <div className="text-center">
                  <motion.div 
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <i className={`${step.icon} text-[var(--space-900)] text-2xl`}></i>
                  </motion.div>
                  <div className={`w-8 h-8 mx-auto mb-4 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-[var(--space-900)] font-bold`}>
                    {step.number}
                  </div>
                  <h3 className={`font-orbitron text-xl font-bold mb-4 ${
                    step.number === 1 ? 'text-[var(--neon-green)]' :
                    step.number === 2 ? 'text-[var(--neon-blue)]' :
                    'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
