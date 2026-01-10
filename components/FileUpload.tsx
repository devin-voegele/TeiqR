'use client';

import { useRef, useState, useEffect } from 'react';
import { Paperclip, X, File, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export default function FileUpload({ onFilesSelected, selectedFiles, onRemoveFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Generate previews when files change
  useEffect(() => {
    selectedFiles.forEach((file, index) => {
      if (file.type.startsWith('image/') && !imagePreviews[index]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => ({
            ...prev,
            [index]: reader.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  }, [selectedFiles, imagePreviews]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="relative inline-block">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.doc,.docx,.csv,.json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
        title="Attach files"
      >
        <Paperclip className="w-5 h-5 text-gray-500 hover:text-gray-300" />
      </button>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full mb-2 left-0 min-w-[300px] p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-xl max-h-[150px] overflow-y-auto z-50"
          >
            <div className="flex flex-col gap-2">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] rounded-lg group"
                >
                  {file.type.startsWith('image/') && imagePreviews[index] ? (
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className="w-12 h-12 rounded overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                    >
                      <img 
                        src={imagePreviews[index]} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : (
                    <div className="text-blue-400">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate max-w-[150px]">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveFile(index);
                      setImagePreviews(prev => {
                        const newPreviews = { ...prev };
                        delete newPreviews[index];
                        return newPreviews;
                      });
                    }}
                    className="p-1 hover:bg-[#3A3A3A] rounded transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && imagePreviews[selectedImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImageIndex(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <img
                src={imagePreviews[selectedImageIndex]}
                alt={selectedFiles[selectedImageIndex]?.name}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium">{selectedFiles[selectedImageIndex]?.name}</p>
                <p className="text-gray-400 text-sm">{formatFileSize(selectedFiles[selectedImageIndex]?.size)}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
