import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Edit2, X, Check, LogIn, Sparkles } from 'lucide-react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

const CONTENT_DOC_ID = 'digital-card-note';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function DigitalCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState("Dear Bestie,\n\nHappy Birthday! So grateful for all our memories together. You make every day brighter.\n\nHere's to another year of us taking on the world!\n\nLove always,\nYour Best Friend");
  const [tempNote, setTempNote] = useState(note);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const unsubscribeDoc = onSnapshot(doc(db, 'content', CONTENT_DOC_ID), (snapshot) => {
      if (snapshot.exists() && snapshot.data().note) {
        setNote(snapshot.data().note);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'content/' + CONTENT_DOC_ID);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDoc();
    };
  }, []);

  const handleEditOpen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        setUser(res.user);
      } catch (err) {
        console.error("Login failed:", err);
        return;
      }
    }
    setTempNote(note);
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'content', CONTENT_DOC_ID), {
        note: tempNote,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid
      });
      setIsEditing(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'content/' + CONTENT_DOC_ID);
    }
  };

  return (
    <section className="w-full py-16 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <span className="text-xs font-bold tracking-[0.3em] text-[#ff758f] uppercase">Special Delivery</span>
        <h2 className="text-xl font-serif mt-1.5 text-blue-600">A Note For You</h2>
      </motion.div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-[#ff758f] text-sm tracking-widest uppercase mb-4">Edit Note</h3>
              <textarea
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                className="w-full h-64 p-4 border border-[#ffccd5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb3c1] font-handwriting text-2xl resize-none text-gray-800 leading-relaxed"
              />
              <button
                onClick={handleEditSave}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#ff758f] text-white rounded-full text-sm font-bold tracking-widest hover:bg-[#ff607d] transition-colors"
              >
                <Check className="w-4 h-4" />
                SAVE NOTE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-lg flex justify-center mt-4 h-[400px]">
        {/* Envelope Container */}
        <div 
          className="relative w-80 h-56 cursor-pointer transform-gpu perspective-[1200px]"
          onClick={() => !isOpen && setIsOpen(true)}
        >
          {/* Back of Envelope */}
          <motion.div 
            className="absolute inset-0 bg-[#ff8ba3] rounded-xl shadow-xl"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.2, delay: isOpen ? 0.3 : 0 }}
          ></motion.div>

          {/* Letter inside */}
          <motion.div 
            className="absolute left-4 right-4 bg-white rounded-lg shadow-2xl overflow-y-auto"
            initial={{ top: 10, bottom: 10, pointerEvents: 'none' }}
            animate={isOpen ? { 
              top: -80, 
              bottom: -60,
              left: -16,
              right: -16,
              zIndex: 30,
              pointerEvents: 'auto'
            } : {
              top: 10,
              bottom: 10,
              left: 16,
              right: 16,
              zIndex: 10,
              pointerEvents: 'none'
            }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2, delay: isOpen ? 0.3 : 0 }}
          >
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-6 md:p-8 h-full flex flex-col"
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-[#ff758f] transition-colors"
                  aria-label="Close Note"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleEditOpen}
                  className="absolute top-4 left-4 text-gray-400 hover:text-[#ff758f] transition-colors"
                  aria-label="Edit Note"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <div className="mt-8 flex-1">
                  <p className="font-handwriting text-2xl sm:text-3xl text-gray-800 whitespace-pre-wrap leading-relaxed tracking-wide">
                    {note}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Envelope Front (Left + Right + Bottom Flaps) */}
          <motion.div 
            className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-20"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.2, delay: isOpen ? 0.3 : 0 }}
          >
            <div className="absolute inset-0 bg-[#ffc2d1]" style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)' }} />
            <div className="absolute inset-0 bg-[#ffc2d1]" style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }} />
            <div className="absolute inset-0 bg-[#ffb3c1] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }} />
            
            {!isOpen && (
              <div className="absolute inset-0 flex items-center justify-center mt-6 z-20">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 shadow-lg pointer-events-auto hover:bg-white/30 transition-colors group">
                  <Mail className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>
            )}
          </motion.div>

          {/* Top Flap */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-28 origin-top z-30 pointer-events-none"
            animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-full rounded-t-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backgroundColor: '#ff9eb1' }}></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
