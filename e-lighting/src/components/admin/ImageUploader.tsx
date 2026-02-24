// e-lighting/src/components/admin/ImageUploader.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    <div className="border border-zinc-800 p-4 bg-black">
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
      />
      {uploading && <p className="mt-2 text-[10px] text-zinc-500 animate-pulse">UPLOADING ASSET...</p>}
    </div>
  );
}
