import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../lib/cropImage';
import { X, Check } from 'lucide-react';

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedDataUrl: string, caption: string) => void;
  imageSrc: string | null;
  initialCaption?: string;
}

const FILTERS = [
  { id: 'none', name: 'Original', value: 'none' },
  { id: 'nostalgia', name: 'Nostalgia', value: 'sepia(80%) contrast(90%) brightness(105%)' },
  { id: 'charcoal', name: 'Charcoal', value: 'grayscale(100%) contrast(120%)' },
  { id: 'sunny', name: 'Sunny Glow', value: 'sepia(30%) saturate(130%) contrast(105%)' },
  { id: 'cool', name: 'Cool Breeze', value: 'hue-rotate(15deg) saturate(110%) brightness(95%)' },
  { id: 'golden', name: 'Golden Hour', value: 'saturate(140%) sepia(15%) brightness(110%)' }
];

export function PhotoEditorModal({ isOpen, onClose, onSave, imageSrc, initialCaption = '' }: PhotoEditorModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [caption, setCaption] = useState(initialCaption);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const filterValue = FILTERS.find(f => f.id === selectedFilter)?.value || 'none';
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, filterValue);
        onSave(croppedImage, caption);
        onClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!isOpen || !imageSrc) return null;

  const activeFilterValue = FILTERS.find(f => f.id === selectedFilter)?.value || 'none';

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[95vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-[#ff758f] text-xs tracking-widest uppercase">Edit & Crop Photo</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-150 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Cropper Container - Visual preview carries selected filters */}
        <div 
          className="relative w-full h-64 sm:h-80 bg-gray-950 shrink-0 overflow-hidden"
          style={{ filter: activeFilterValue }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        <div className="p-5 flex flex-col gap-4 bg-white overflow-y-auto flex-1">
          {/* Zoom Adjustment */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zoom Stretch</label>
              <span className="text-[10px] font-bold font-mono text-[#ff758f]">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-[#ff758f]"
            />
          </div>

          {/* Rotation Control */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Angle & Tilt</label>
              <button 
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="text-[10px] text-[#ff758f] font-bold hover:underline"
              >
                Rotate 90°
              </button>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-[#ff758f]"
            />
          </div>

          {/* Filter Aesthetic Presets */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Aesthetic Vibe</label>
            <div className="flex gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-thin">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  type="button"
                  className="flex flex-col items-center gap-1 shrink-0 select-none group"
                >
                  <div 
                    className={`w-11 h-11 rounded-xl bg-gray-100 overflow-hidden border-2 transition-all relative ${
                      selectedFilter === f.id ? 'border-[#ff758f] ring-2 ring-[#ffccd5]' : 'border-transparent group-hover:border-gray-200'
                    }`}
                  >
                    <img 
                      src={imageSrc} 
                      alt={f.name} 
                      className="w-full h-full object-cover" 
                      style={{ filter: f.value }} 
                    />
                  </div>
                  <span className={`text-[9px] ${selectedFilter === f.id ? 'text-[#ff758f] font-bold' : 'text-gray-400'} font-sans`}>
                    {f.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Caption Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Memory Label</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a sweet caption..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffccd5] focus:border-[#ffb3c1] text-xs text-gray-700 font-serif italic"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-1 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#ff758f] text-white rounded-full text-xs font-bold tracking-widest shadow-lg hover:shadow-xl hover:bg-[#ff607d] transition-all"
          >
            <Check className="w-4 h-4" />
            APPLY & SAVE MEMORY
          </button>
        </div>
      </div>
    </div>
  );
}
