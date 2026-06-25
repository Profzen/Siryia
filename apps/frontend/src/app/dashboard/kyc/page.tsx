import { getKycStatus } from "@/app/actions/kyc";
import KycUploadForm from "@/components/kyc/KycUploadForm";
import { ShieldCheck, Clock, XCircle, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Vérification d'identité | Siryia",
};

export default async function KycPage() {
  const status = await getKycStatus();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Vérification d'identité (KYC)</h1>
        <p className="text-slate-600">
          Pour garantir la sécurité de la plateforme Siryia, nous devons vérifier votre identité avant de vous autoriser à vendre ou proposer des services.
        </p>
      </div>

      {/* Affichage du statut actuel */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 flex items-start gap-4 shadow-sm">
        {status.kycStatus === "VERIFIED" && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Identité vérifiée</h2>
              <p className="text-slate-600 mt-1">
                Félicitations, votre identité a été validée. Vous avez accès à toutes les fonctionnalités de vendeur et prestataire. (Niveau actuel : {status.kycLevel})
              </p>
            </div>
          </>
        )}

        {status.kycStatus === "PENDING" && status.documents?.length > 0 && (
          <>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Vérification en cours</h2>
              <p className="text-slate-600 mt-1">
                Vos documents ont bien été reçus. Notre équipe est en train de les vérifier. Cela prend généralement moins de 24h.
              </p>
            </div>
          </>
        )}

        {status.kycStatus === "REJECTED" && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Documents refusés</h2>
              <p className="text-slate-600 mt-1">
                Malheureusement, nous n'avons pas pu valider votre identité. Veuillez soumettre de nouveaux documents plus clairs.
              </p>
            </div>
          </>
        )}

        {(status.kycStatus === "PENDING" && (!status.documents || status.documents.length === 0)) && (
          <>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-[#D49A25]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Vérification requise</h2>
              <p className="text-slate-600 mt-1">
                Vous n'avez pas encore soumis vos documents. Veuillez compléter le formulaire ci-dessous.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Formulaires d'upload */}
      {status.kycStatus !== "VERIFIED" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KycUploadForm 
            documentType="ID_CARD" 
            title="1. Pièce d'identité" 
            description="Téléchargez une photo claire de votre carte nationale d'identité ou passeport."
          />
          <KycUploadForm 
            documentType="SELFIE" 
            title="2. Selfie de vérification" 
            description="Prenez une photo de vous bien éclairée, visage dégagé pour la correspondance."
          />
        </div>
      )}
    </div>
  );
}
