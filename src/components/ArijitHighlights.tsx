import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, PlayCircle, Heart, Camera, Loader2, Sparkles } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, addDoc, serverTimestamp, query } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuthState } from '../hooks/useAuthState';
import { PhotoEditorModal } from './PhotoEditorModal';

const fallbackCasualPhotos = [
  "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
];

const hits = [
  { title: "Tum Hi Ho", movie: "Aashiqui 2", playing: true },
  { title: "Channa Mereya", movie: "Ae Dil Hai Mushkil", playing: false },
  { title: "Kesariya", movie: "Brahmāstra", playing: false },
];

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

export function ArijitHighlights() {
  const [dbCasualPhotos, setDbCasualPhotos] = useState<Record<number, { id: string; url: string; caption: string }>>({});
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImageSrc, setEditingImageSrc] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCaption, setEditingCaption] = useState("Casual Vibe ✨");
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthState();

  // Load photos from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'casual_photos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: Record<number, { id: string; url: string; caption: string }> = {};
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const indexStr = docSnap.id.replace('slot_', '');
        const idx = parseInt(indexStr, 10);
        if (!isNaN(idx)) {
          loaded[idx] = {
            id: docSnap.id,
            url: data.url,
            caption: data.caption || `Casual Vibe ${idx + 1} ✨`
          };
        }
      });
      setDbCasualPhotos(loaded);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'casual_photos');
    });
    return () => unsubscribe();
  }, []);

  const handleEditClick = (idx: number, currentUrl: string, currentCaption: string) => {
    setEditingIndex(idx);
    setEditingImageSrc(currentUrl);
    setEditingCaption(currentCaption);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImageSrc(reader.result as string);
        setIsEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async (croppedDataUrl: string, caption: string) => {
    if (editingIndex === null) return;
    setIsSaving(true);
    try {
      // 1. Save to casual_photos in Firestore so ArijitHighlights updates in real-time
      await setDoc(doc(db, "casual_photos", `slot_${editingIndex}`), {
        url: croppedDataUrl,
        caption: caption,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || "anonymous"
      });

      // 2. Also automatically upload/save this photo into the Core Memories Gallery collection!
      const rotations = ["rotate-1", "-rotate-2", "rotate-2", "-rotate-3", "rotate-3", "rotate-0"];
      const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
      
      await addDoc(collection(db, 'gallery_photos'), {
        url: croppedDataUrl,
        caption: caption || `Casual Vibe ${editingIndex + 1} ✨`,
        rotation: randomRotation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || "anonymous"
      });

      // Show beautiful notification
      setSuccessToast(`✨ Added to Casual section & posted to your Core Gallery! ✨`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      console.error("Error saving casual photo & uploading to gallery:", err);
    } finally {
      setIsSaving(false);
      setEditingIndex(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getPhotoUrl = (idx: number) => {
    return dbCasualPhotos[idx]?.url || fallbackCasualPhotos[idx];
  };

  const getPhotoCaption = (idx: number) => {
    return dbCasualPhotos[idx]?.caption || (idx === 0 ? "Playing 'Tum Hi Ho' vibe" : `Casual Vibe ${idx + 1} ✨`);
  };

  return (
    <section className="w-full py-20 px-4 relative bg-[#fff0f3] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd1dc] rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffb3c1] rounded-full blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      {/* Embedded Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] bg-[#e05a76] text-white px-6 py-3.5 rounded-full shadow-2xl font-semibold border border-pink-300 text-xs sm:text-sm tracking-wide flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            {successToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full text-[#e05a76] mb-6 shadow-sm border border-[#ffccd5]"
          >
            <Music className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">Arijit Singh Special</span>
          </motion.div>
          <h2 className="font-serif italic text-4xl md:text-6xl text-[#2d3436] mb-4">Casual Vibes & Super Hits</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Some of the best casual moments highlighted along with soul-soothing Arijit Singh melodies.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Music Player Section */}
          <div className="space-y-6">
            {hits.map((hit, index) => (
              <motion.div 
                key={hit.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg hover:shadow-xl border border-white flex items-center gap-5 group cursor-pointer hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-[#fff0f3] rounded-full flex items-center justify-center shrink-0 text-[#e05a76] group-hover:scale-110 transition-transform shadow-inner">
                  {hit.playing ? (
                     <div className="flex gap-1 items-center justify-center h-full">
                       {[1,2,3].map(i => (
                         <motion.div 
                           key={i}
                           animate={{ height: ["4px", "16px", "4px"] }}
                           transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                           className="w-1 bg-[#e05a76] rounded-full"
                         />
                       ))}
                     </div>
                  ) : (
                    <PlayCircle className="w-8 h-8" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 tracking-tight">{hit.title}</h3>
                  <p className="text-sm text-gray-500">Arijit Singh • {hit.movie}</p>
                </div>
                
                <button aria-label="Favorite heart button" className="text-gray-300 hover:text-[#e05a76] transition-colors p-2">
                  <Heart className={`w-6 h-6 ${hit.playing ? 'fill-[#e05a76] text-[#e05a76]' : ''}`} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Casual Photos Section */}
          <div className="grid grid-cols-2 gap-4 h-[500px]">
            {/* Slot 0 (Large Hero Photo) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-2 row-span-2 overflow-hidden rounded-[2rem] shadow-xl border-8 border-white group relative h-[300px]"
            >
              {isSaving && editingIndex === 0 ? (
                <div className="absolute inset-0 bg-[#fff0f3]/80 backdrop-blur-sm z-30 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#e05a76] animate-spin" />
                </div>
              ) : null}
              <img src={getPhotoUrl(0)} alt="Casual Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0" />
              
              {/* Interaction Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                <button
                  type="button"
                  onClick={() => handleEditClick(0, getPhotoUrl(0), getPhotoCaption(0))}
                  className="bg-white hover:bg-[#fff0f3] text-[#e05a76] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" /> Change & Post to Gallery
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pointer-events-none z-10">
                <span className="text-white font-serif italic text-sm flex items-center gap-2">
                   <Music className="w-4 h-4 text-pink-300 animate-pulse" /> {getPhotoCaption(0)}
                </span>
              </div>
            </motion.div>
            
            {/* Slot 1 (Small Left Casual Photo) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="overflow-hidden rounded-[1.5rem] shadow-lg border-4 border-white group relative h-44"
            >
              {isSaving && editingIndex === 1 ? (
                <div className="absolute inset-0 bg-[#fff0f3]/80 backdrop-blur-sm z-30 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#e05a76] animate-spin" />
                </div>
              ) : null}
              <img src={getPhotoUrl(1)} alt="Casual Vibe 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 absolute inset-0" />
              
              {/* Interaction Overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <button
                  type="button"
                  onClick={() => handleEditClick(1, getPhotoUrl(1), getPhotoCaption(1))}
                  className="bg-white hover:bg-[#fff0f3] text-[#e05a76] p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
                  title="Upload & Add to Gallery"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            
            {/* Slot 2 (Small Right Casual Photo) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="overflow-hidden rounded-[1.5rem] shadow-lg border-4 border-white group relative h-44"
            >
              {isSaving && editingIndex === 2 ? (
                <div className="absolute inset-0 bg-[#fff0f3]/80 backdrop-blur-sm z-30 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#e05a76] animate-spin" />
                </div>
              ) : null}
              <img src={getPhotoUrl(2)} alt="Casual Vibe 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 absolute inset-0" />
              
              {/* Interaction Overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center center justify-center z-20">
                <button
                  type="button"
                  onClick={() => handleEditClick(2, getPhotoUrl(2), getPhotoCaption(2))}
                  className="bg-white hover:bg-[#fff0f3] text-[#e05a76] p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
                  title="Upload & Add to Gallery"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hidden file selector trigger */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />

      {/* Reusable premium easy-crop & filter editor modal */}
      <PhotoEditorModal 
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingIndex(null);
        }}
        imageSrc={editingImageSrc}
        initialCaption={editingCaption}
        onSave={handleSavePhoto}
      />
    </section>
  );
}
