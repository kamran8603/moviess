import React from 'react';
import FavoritesContent from '../components/FavoritesContent';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyList = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-light-primary dark:bg-dark-primary">
        <div className="container mx-auto px-4 py-32">
          <FavoritesContent />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyList;
