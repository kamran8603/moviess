import React from 'react';
import { Share2, Facebook, Twitter, Link } from 'lucide-react';

const ShareButtons = () => {
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = document.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Failed to copy:', err));
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-moviebuster-darkblue/20 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Share</h2>
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={() => handleShare('facebook')}
          className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
        >
          <Facebook className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => handleShare('twitter')}
          className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
        >
          <Twitter className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => handleShare('copy')}
          className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
        >
          <Link className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;