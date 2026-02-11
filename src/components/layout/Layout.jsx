import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
       <div className="glass-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 container mx-auto px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};


export default Layout;
