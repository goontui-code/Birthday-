import { Instagram, ExternalLink, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export function InstagramFeed() {
  const username = "udeeksha_";
  const profileUrl = `https://www.instagram.com/${username}`;

  return (
    <section className="w-full py-16 px-4 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-[#ffe4e8]"
      >
        {/* Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-[3px]">
             <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                <Instagram className="w-10 h-10 text-gray-300" />
             </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
              {username}
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto md:mx-0">
              Instagram integration component. Connect to view posts directly in the timeline.
            </p>
          </div>

          <a 
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors shrink-0"
          >
            Open Instagram
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Feed Area */}
        <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center bg-gray-50/50 min-h-[300px]">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-[#ff758f]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Instagram API Required</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm leading-relaxed">
            To automatically show all real posts from <span className="font-semibold">@{username}</span>, we need to integrate the Instagram Graph API with a Facebook Developer account and configure OAuth credentials.
          </p>
          <a
            href="https://developers.facebook.com/docs/instagram-basic-display-api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff758f] font-bold text-sm hover:underline"
          >
            Learn more about Instagram Integration
          </a>
        </div>
      </motion.div>
    </section>
  );
}
