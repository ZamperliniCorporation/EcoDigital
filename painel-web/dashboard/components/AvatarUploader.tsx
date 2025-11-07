'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

export default function AvatarUploader({ onUpload }: { onUpload: (filePath: string) => void }) {
  const supabase = createClientComponentClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(publicUrl);
      onUpload(publicUrl);

    } catch (error) {
      // --- INÍCIO DA CORREÇÃO ---
      // Verificamos se o erro é uma instância da classe Error
      if (error instanceof Error) {
        alert(`Erro no upload: ${error.message}`);
      } else {
        // Se não for, tratamos como um erro genérico
        alert('Ocorreu um erro desconhecido durante o upload.');
      }
      // --- FIM DA CORREÇÃO ---
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Avatar</label>
      <div className="mt-1 flex items-center space-x-4">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" width={80} height={80} />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200" />
        )}
        <label htmlFor="single" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
          {uploading ? 'Enviando...' : 'Enviar foto'}
        </label>
        <input
          style={{ visibility: 'hidden', position: 'absolute' }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}