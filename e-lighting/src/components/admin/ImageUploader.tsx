// src/components/admin/ImageUploader.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2 } from 'lucide-react';

interface UploaderProps {
  bucket: 'product-assets' | 'category-images';
  onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ bucket, onUploadComplete }: UploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onUploadComplete(data.publicUrl);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center group cursor-pointer min-h-[100px]">
      {uploading ? (
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      ) : (
        <>
          <Plus className="w-6 h-6 text-zinc-700 group-hover:text-white transition-colors" />
          <span className="text-[8px] text-zinc-700 uppercase font-mono mt-2 group-hover:text-white">Add Asset</span>
        </>
      )}
      
      {/* INVISIBLE INPUT FIX: 
        Stretches to fill the container so the standard 'Choose File' button 
        is hidden but the whole area remains clickable.
      */}
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        accept="image/*,video/*"
      />
    </div>
  );
}
