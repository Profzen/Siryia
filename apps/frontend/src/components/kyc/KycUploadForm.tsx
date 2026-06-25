"use client";

import { useState, useRef } from "react";
import { uploadKycDocument } from "@/app/actions/kyc";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Props {
  documentType: "ID_CARD" | "PASSPORT" | "SELFIE" | "RCCM";
  title: string;
  description: string;
}

export default function KycUploadForm({ documentType, title, description }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPG, PNG).");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (max 5 Mo).");
      return;
    }
    setError(null);
    setFile(f);
    const objectUrl = URL.createObjectURL(f);
    setPreview(objectUrl);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    const res = await uploadKycDocument(formData);
    if (res.success) {
      setSuccess(true);
      setFile(null);
    } else {
      setError(res.error || "Une erreur est survenue.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-6 border border-green-200 bg-green-50 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
        <h4 className="text-lg font-semibold text-green-800">Document envoyé avec succès</h4>
        <p className="text-sm text-green-600 mt-2">Votre document est en cours de vérification par notre équipe.</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging ? "border-primary-500 bg-primary-50 scale-[0.98]" : "border-slate-300 hover:bg-slate-50 hover:border-primary-400"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden" 
          accept="image/*"
        />

        {preview ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Prévisualisation" className="max-h-full object-contain" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <UploadCloud className="w-8 h-8 text-white mb-2" />
              <span className="text-white font-medium text-sm">Changer d'image</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-100">
              <UploadCloud className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-slate-700 font-medium mb-1">Cliquez ou glissez votre image ici</p>
            <p className="text-slate-400 text-xs">PNG, JPG, JPEG (max. 5Mo)</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {file && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Soumettre le document"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
