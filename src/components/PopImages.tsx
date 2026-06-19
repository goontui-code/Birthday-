import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Plus, Trash2, Edit2, Loader2, Camera, Sparkles } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { useAuthState } from '../hooks/useAuthState';
import { PhotoEditorModal } from './PhotoEditorModal';

// Load initial, beautiful generated portraits for the memories timeline
const darkPortrait = new URL('../assets/images/gallery_bestie_dark_portrait_1781879189320.jpg', import.meta.url).href;
const blueStructure = new URL('../assets/images/gallery_bestie_blue_structure_1781879202945.jpg', import.meta.url).href;
const stripedShirt = new URL('../assets/images/gallery_bestie_striped_shirt_1781879217150.jpg', import.meta.url).href;
const candidConfetti = new URL('../assets/images/candid_confetti_laugh_1781879551300.jpg', import.meta.url).href;
const picnicFlowers = new URL('../assets/images/picnic_flowers_bestie_1781879566685.jpg', import.meta.url).href;

interface PopMemory {
  id: string;
  url: string;
  caption: string;
  align: string;
  rotate: number;
  margin: string;
}

const initialPhotos: PopMemory[] = [
  { 
    id: "demo1", 
    url: darkPortrait, 
    caption: "Always my rock 🤍", 
    align: "self-start", 
    rotate: -10, 
    margin: "ml-4 md:ml-[10%]" 
  },
  { 
    id: "demo2", 
    url: blueStructure, 
    caption: "The best deep talks & laughter 😂", 
    align: "self-end", 
    rotate: 8, 
    margin: "mr-4 md:mr-[10%]" 
  },
  { 
    id: "demo3", 
    url: candidConfetti, 
    caption: "Party mode forever with you 🎉", 
    align: "self-start", 
    rotate: -6, 
    margin: "ml-12 md:ml-[20%]" 
  },
  { 
    id: "demo4", 
    url: picnicFlowers, 
    caption: "Sunny spring afternoon picnic 🌸", 
    align: "self-end", 
    rotate: 12, 
    margin: "mr-12 md:mr-[15%]" 
  },
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

export function PopImages() {
  const [dbMemories, setDbMemories] = useState<PopMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImageSrc, setEditingImageSrc] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState("Pop-up Memory ✨");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuthState();

  const [deletedDemoIds, setDeletedDemoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deleted_pop_memories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load digital pop-up memories from Firestore
  useEffect(() => {
    const q = query(collection(db, 'pop_memories'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        url: doc.data().url,
        caption: doc.data().caption,
        align: doc.data().align || "self-start",
        rotate: doc.data().rotate || 0,
        margin: doc.data().margin || "mx-auto",
      }));
      setDbMemories(loaded);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'pop_memories');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const memories = (dbMemories.length > 0 ? dbMemories : initialPhotos).filter(
    photo => !deletedDemoIds.includes(photo.id)
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImageSrc(reader.result as string);
        setEditingId(null);
        setEditingCaption("Special Moment ✨");
        setIsEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditMemory = (item: PopMemory) => {
    setEditingImageSrc(item.url);
    setEditingId(item.id);
    setEditingCaption(item.caption);
    setIsEditorOpen(true);
  };

  const handleDeleteMemory = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleConfirmDelete = async (id: string) => {
    if (id.startsWith("demo")) {
      setDeletedDemoIds(prev => {
        const next = [...prev, id];
        try {
          localStorage.setItem('deleted_pop_memories', JSON.stringify(next));
        } catch (err) {
          console.warn("Storage write failure in sandbox iframe:", err);
        }
        return next;
      });
      setDeletingId(null);
      return;
    }

    try {
      await deleteDoc(doc(db, "pop_memories", id));
      setDeletingId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'pop_memories/' + id);
    }
  };

  const handleSaveMemory = async (croppedDataUrl: string, caption: string) => {
    setIsSaving(true);
    try {
      const rotations = [-12, -8, -4, 4, 8, 12];
      const randomRotate = rotations[Math.floor(Math.random() * rotations.length)];
      
      const alignments = ["self-start", "self-end"];
      const randomAlign = alignments[Math.floor(Math.random() * alignments.length)];
      
      const margins = randomAlign === "self-start" 
        ? ["ml-4 md:ml-[10%]", "ml-12 md:ml-[20%]"] 
        : ["mr-4 md:mr-[10%]", "mr-12 md:mr-[15%]"];
      const randomMargin = margins[Math.floor(Math.random() * margins.length)];

      if (editingId && !editingId.startsWith("demo")) {
        // Edit existing in DB
        try {
          await updateDoc(doc(db, "pop_memories", editingId), {
            url: croppedDataUrl,
            caption: caption,
            updatedAt: serverTimestamp(),
            updatedBy: user?.uid || "anonymous"
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, 'pop_memories/' + editingId);
        }
      } else {
        // Create new (or rewrite demo to a cloud item)
        try {
          await addDoc(collection(db, 'pop_memories'), {
            url: croppedDataUrl,
            caption: caption,
            align: randomAlign,
            rotate: randomRotate,
            margin: randomMargin,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            updatedBy: user?.uid || "anonymous"
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'pop_memories');
        }
      }
    } catch (e) {
      console.error("Error saving pop memory:", e);
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <section className="w-full py-16 relative flex flex-col gap-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 border-b border-[var(--theme-brand-border)]/30 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--theme-brand)] mb-1 block">Keep Scrolling</span>
          <h2 className="font-serif italic text-4xl text-[var(--theme-text-main)] transition-colors duration-500 flex items-center gap-2">
            Pop-Up Memories
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
          </h2>
          <p className="font-serif italic text-xs text-gray-400 mt-1">Savoring our beautiful shared moments</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-28 relative w-full pt-8 pb-12">
        {/* Dashed center line styled dynamically matching the active theme */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-4 border-dashed border-[var(--theme-brand-border)] opacity-60 z-0" />
        
        {memories.map((photo, i) => (
          <motion.div
            key={photo.id || i}
            initial={{ scale: 0.3, opacity: 0, y: 150, rotate: photo.rotate * 3 }}
            whileInView={{ scale: 1, opacity: 1, y: 0, rotate: photo.rotate }}
            viewport={{ once: true, margin: "0px 0px -150px 0px" }}
            transition={{ type: "spring", bounce: 0.45, duration: 1.2 }}
            className={`w-64 h-72 md:w-80 md:h-[22rem] rounded-3xl border-[12px] border-white shadow-2xl overflow-hidden bg-gray-50 relative z-10 flex flex-col p-2 ${photo.align} ${photo.margin} hover:rotate-0 hover:scale-[1.05] hover:z-20 transition-all duration-500 group`}
          >
            {/* Image section */}
            <div className="flex-1 rounded-2xl bg-gray-100 overflow-hidden relative">
              <img 
                src={photo.url} 
                alt={photo.caption} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              
              {/* Floating, highly interactive actions removed as requested */}
            </div>

            {/* Caption polaroid block */}
            <div className="h-10 pt-2 pb-1 px-3 flex items-center justify-between shrink-0">
              <span className="font-serif italic text-xs md:text-sm text-[var(--theme-text-main)] font-semibold truncate pr-2">
                {photo.caption}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--theme-brand)] font-bold shrink-0 bg-[var(--theme-brand-light)] px-2 py-0.5 rounded-md">
                BESTIE
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <PhotoEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        imageSrc={editingImageSrc}
        initialCaption={editingCaption}
        onSave={handleSaveMemory}
      />
    </section>
  );
}
