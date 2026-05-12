// src/components/admin/ImageUploader.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2 } from 'lucide-react';

interface UploaderProps {
  bucket: 'product-assets' | 'category-images';
  onUploadComplete: (url: string) => void;
  acceptedTypes?: string;
  maxSizeMb?: number;
}

function acceptsFile(file: File, acceptedTypes: string) {
  if (!acceptedTypes) return true;

  return acceptedTypes.split(',').some((type) => {
    const trimmedType = type.trim();
    if (trimmedType.endsWith('/*')) {
      return file.type.startsWith(trimmedType.replace('/*', '/'));
    }
    return file.type === trimmedType;
  });
}

export default function ImageUploader({
  bucket,
  onUploadComplete,
  acceptedTypes = 'image/*,video/*',
  maxSizeMb = 25,
}: UploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const maxSizeBytes = maxSizeMb * 1024 * 1024;

      if (!acceptsFile(file, acceptedTypes)) {
        alert(`Invalid file type. Allowed: ${acceptedTypes}`);
        return;
      }

      if (file.size > maxSizeBytes) {
        alert(`File is too large. Maximum size is ${maxSizeMb}MB.`);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const safeName = file.name
        .replace(`.${fileExt}`, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}.${fileExt}`;
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
      event.target.value = '';
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
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        accept={acceptedTypes}
      />
    </div>
  );
}
