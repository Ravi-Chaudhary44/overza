import React from 'react';
import { FaBaseballBall, FaGithub, FaGlobe, FaTwitter,FaFacebook, FaHeart,FaLinkedin, FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         
          <div className="space-y-4">
            <div className="flex items-center">
              <FaBaseballBall className="text-3xl text-cricket-green mr-3" />
              <span className="text-2xl font-bold">
                Over<span className="text-cricket-green">Za</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Real-time scoring for local Over cricket matches. Instant updates, zero refresh needed.
            </p>
          <div className="flex space-x-4">
  <a
    href="https://github.com/Ravi-Chaudhary44"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
    aria-label="GitHub"
  >
    <FaGithub className="text-xl" />
  </a>

  <a
    href="https://x.com/RaviCha44"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
    aria-label="X (Twitter)"
  >
    <FaTwitter className="text-xl" />
  </a>

  <a
    href="https://ravi-chaudhary44.github.io/Portfolio/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
    aria-label="Portfolio"
  >
    <FaGlobe className="text-xl" />
  </a>
   <a
    href="https://www.facebook.com/Ravich4444"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="text-gray-400 hover:text-white"
  >
    <FaFacebook className="text-xl" />
  </a>
  <a
    href="https://www.linkedin.com/in/ravi-chaudhary-00a762323/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="text-gray-400 hover:text-white transition-colors"
  >
    <FaLinkedin className="text-xl" />
  </a>
</div>


          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cricket-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/live" className="text-gray-400 hover:text-cricket-green transition-colors">
                  Live Matches
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-400 hover:text-cricket-green transition-colors">
                  Match History
                </Link>
              </li>
              <li>
                <Link to="/scorer" className="text-gray-400 hover:text-cricket-green transition-colors">
                  Scorer Panel
                </Link>
              </li>
            </ul>
          </div>
          
          
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="block">Email: 6312ravi6312@gmail.com</span>
              </li>
              
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Overza. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 text-sm text-gray-400">
              <FaCode className="mr-1" />
              <span>Made with</span>
              <FaHeart className="mx-1 text-red-500" />
              <span>for cricket lovers</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Overza is a free platform for local cricket scoring. 
              We are not affiliated with any official cricket organization.
            </p>
            <p className="mt-1">
             This is a demo project built for learning and portfolio purposes.

            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;