import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ThemeProvider from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <Hero />
          {/* Additional sections would be added here */}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;