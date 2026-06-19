import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Loader2, Trash2 } from 'lucide-react';
import { PhotoEditorModal } from './PhotoEditorModal';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useAuthState } from '../hooks/useAuthState';

const darkPortrait = new URL('../assets/images/gallery_bestie_dark_portrait_1781879189320.jpg', import.meta.url).href;
const blueStructure = new URL('../assets/images/gallery_bestie_blue_structure_1781879202945.jpg', import.meta.url).href;
const stripedShirt = new URL('../assets/images/gallery_bestie_striped_shirt_1781879217150.jpg', import.meta.url).href;

const initialPhotos = [
  {
    id: "demo1",
    url: darkPortrait,
    caption: "Always my rock 🤍",
    rotation: "-rotate-2"
  },
  {
    id: "demo2",
    url: blueStructure,
    caption: "Smiles for miles ✨",
    rotation: "rotate-2"
  },
  {
    id: "demo3",
    url: stripedShirt,
    caption: "Golden hour memories 🌅",
    rotation: "-rotate-3"
  }
];

interface GalleryPhoto {
    id: string;
    url: string;
    caption: string;
    rotation: string;
}

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

export function Gallery() {
  const [dbPhotos, setDbPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImageSrc, setEditingImageSrc] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCaption, setEditingCaption] = useState("New Memory \u2728");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { user } = useAuthState();

  useEffect(() => {
    const q = query(collection(db, 'gallery_photos'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        url: doc.data().url,
        caption: doc.data().caption,
        rotation: doc.data().rotation,
      }));
      setDbPhotos(loadedPhotos);
      setIsLoading(false);
    }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'gallery_photos');
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const photos = dbPhotos.length > 0 ? dbPhotos : initialPhotos;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImageSrc(reader.result as string);
        setEditingIndex(null); // It's a new upload
        setEditingCaption("New Memory ✨");
        setIsEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditExistingPhoto = (index: number) => {
    setEditingImageSrc(photos[index].url);
    setEditingIndex(index);
    setEditingCaption(photos[index].caption);
    setIsEditorOpen(true);
  };

  const handleDeletePhoto = (e: React.MouseEvent, photoId: string) => {
      e.stopPropagation();
      if (photoId.startsWith("demo")) return; // Cannot delete demo photos
      setDeletingId(photoId);
  };

  const handleConfirmDeletePhoto = async (photoId: string) => {
      try {
        await deleteDoc(doc(db, "gallery_photos", photoId));
        setDeletingId(null);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'gallery_photos/' + photoId);
      }
  };

  const handleSavePhoto = async (croppedDataUrl: string, caption: string) => {
    setIsSaving(true);
    try {
        if (editingIndex !== null && !photos[editingIndex].id.startsWith("demo")) {
            // Edit existing photo in DB
            const photoId = photos[editingIndex].id;
            try {
              await updateDoc(doc(db, "gallery_photos", photoId), {
                  url: croppedDataUrl,
                  caption: caption,
                  updatedAt: serverTimestamp(),
                  updatedBy: user?.uid || "anonymous"
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.UPDATE, 'gallery_photos/' + photoId);
            }
        } else {
            // Add new photo (or editing a demo photo creates a new one)
            const rotations = ["rotate-1", "-rotate-2", "rotate-2", "-rotate-3", "rotate-3", "rotate-0"];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            
            try {
              await addDoc(collection(db, 'gallery_photos'), {
                  url: croppedDataUrl,
                  caption: caption,
                  rotation: randomRotation,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                  updatedBy: user?.uid || "anonymous"
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, 'gallery_photos');
            }
        }
    } catch (e) {
        console.error("Error saving photo:", e);
    } finally {
        setIsSaving(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  return (
    <section className="flex flex-col gap-6 h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-between items-end border-b border-pink-100/50 pb-4"
      >
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#ffb3c1] mb-2">Our Core Memories</h2>
          <p className="font-serif italic text-sm text-[#636e72]">Just a few of my favorites</p>
        </div>
      </motion.div>
      
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.15 }}
            className={`w-full bg-[#fce4ec] rounded-2xl border-8 border-white shadow-xl flex flex-col p-3 transform ${photo.rotation} hover:rotate-0 hover:scale-[1.02] hover:z-10 transition-all duration-300 origin-center aspect-square sm:aspect-auto group/item`}
          >
            <div className="flex-1 bg-[#dcdde1] rounded-lg mb-3 flex items-center justify-center overflow-hidden relative group">
              <img 
                src={photo.url} 
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                <button 
                  onClick={() => handleEditExistingPhoto(index)}
                  title="Crop & Edit memory preset"
                  className="bg-white/90 text-[#ff758f] p-3 rounded-full hover:bg-white transition-all hover:scale-110 shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {!photo.id.startsWith("demo") && (
                  <button 
                    onClick={(e) => handleDeletePhoto(e, photo.id)}
                    title="Delete memory"
                    className="bg-white/90 text-[#ff758f] p-3 rounded-full hover:bg-white transition-all hover:scale-110 shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Inline, Premium Confirmed Delete Dialog */}
              {deletingId === photo.id && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-rose-500 text-2xl mb-2 animate-bounce">💔</span>
                  <p className="text-gray-800 font-serif italic text-xs font-bold mb-4">Delete this memory?</p>
                  <div className="flex gap-2 w-full justify-center">
                    <button
                      onClick={() => handleConfirmDeletePhoto(photo.id)}
                      className="px-4 py-2 bg-[#ff758f] hover:bg-[#ff4d6d] text-white text-[10px] font-bold rounded-full shadow-md active:scale-95 transition-all uppercase tracking-wider"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-full shadow-md active:scale-95 transition-all uppercase tracking-wider border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-10 flex items-center justify-between px-2 shrink-0">
              <p className="font-serif italic text-sm text-[#2d3436] truncate pr-2">
                {photo.caption}
              </p>
              <div className="flex gap-2 shrink-0">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#ff758f]"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-[#ffb3c1]"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <PhotoEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        imageSrc={editingImageSrc}
        initialCaption={editingCaption}
        onSave={handleSavePhoto}
      />
    </section>
  );
}
