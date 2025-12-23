import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Globe, ChevronUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    { icon: <Github size={20} />, url: "https://github.com/yourusername", label: "GitHub" },
    { icon: <Linkedin size={20} />, url: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
    { icon: <Twitter size={20} />, url: "https://twitter.com/yourusername", label: "Twitter" },
    { icon: <Mail size={20} />, url: "mailto:your.email@example.com", label: "Email" },
    { icon: <Globe size={20} />, url: "https://yourwebsite.com", label: "Website" }
  ];

  const footerLinks = [
    { heading: "Navigation", links: [
      { name: "Home", url: "#" },
      { name: "About", url: "#about" },
      { name: "Projects", url: "#projects" },
      { name: "Contact", url: "#contact" }
    ]},
    { heading: "Resources", links: [
      { name: "Resume", url: "#" },
      { name: "Blog", url: "#" },
      { name: "Case Studies", url: "#" }
    ]}
  ];

  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900 pt-16 pb-10">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <a href="#" className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 inline-block">
                <span className="font-light">Portfolio</span>
                <span className="font-bold">Pro</span>
              </a>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 mb-6 max-w-xs">
                Crafting digital experiences that combine aesthetics with functionality to deliver outstanding results.
              </p>
            </motion.div>
          </div>
          
          {/* Link columns */}
          {footerLinks.map((section, i) => (
            <div key={i} className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  {section.heading}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a 
                        href={link.url}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
          
          {/* Contact/Social column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Want to work together? Let's chat!
              </p>
              <div className="flex space-x-3 mb-6">
                {socialLinks.map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        <hr className="border-gray-200 dark:border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Your Name. All rights reserved.
          </p>
          
          <motion.button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm group"
            whileHover={{ y: -2 }}
          >
            <span>Back to top</span>
            <ChevronUp size={16} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;