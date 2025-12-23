import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';

const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, 0.05, 0.9, 0.9] } }
  };

  const socialLinks = [
    { icon: <Github size={22} />, url: "https://github.com/yourusername", label: "GitHub" },
    { icon: <Linkedin size={22} />, url: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
    { icon: <Twitter size={22} />, url: "https://twitter.com/yourusername", label: "Twitter" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[20%] w-64 h-64 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 left-[20%] w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-6 py-24 pt-32 md:pt-40 relative z-10">
        <motion.div 
          className="grid md:grid-cols-5 gap-12 items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="md:col-span-3 text-center md:text-left">
            <motion.div variants={item} className="inline-block px-4 py-1 mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              Available for freelance work
            </motion.div>
            
            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Your Name</span>
            </motion.h1>
            
            <motion.p variants={item} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              I create <span className="font-semibold">beautiful digital experiences</span> that solve real problems and delight users.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="#projects"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-8 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                Contact Me
              </a>
            </motion.div>
            
            <motion.div 
              variants={item} 
              className="flex items-center space-x-4 mt-12 justify-center md:justify-start"
            >
              <span className="text-gray-500 dark:text-gray-400 text-sm">Follow me:</span>
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          <div className="md:col-span-2 hidden md:block relative">
            <motion.div
              variants={item}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-1 rounded-2xl shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Professional headshot" 
                  className="rounded-xl w-full h-[450px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span className="text-gray-500 dark:text-gray-400 text-sm mb-2">Scroll to explore</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={24} className="text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;