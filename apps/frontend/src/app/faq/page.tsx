'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, BookOpen, MessageCircle } from 'lucide-react';

export default function FaqPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: fetch api/support/faq
    setArticles([
      { id: '1', title: 'Comment libérer l\'Escrow ?', content: 'Une fois votre commande reçue, allez dans vos commandes et cliquez sur "Confirmer la réception". Cela libérera les fonds vers le vendeur.', category: 'Paiements' },
      { id: '2', title: 'Comment devenir vendeur vérifié ?', content: 'Rendez-vous dans vos Paramètres > Vérification KYC. Soumettez votre pièce d\'identité. Notre équipe validera votre demande sous 48h.', category: 'Compte & KYC' },
      { id: '3', title: 'Que faire en cas de litige avec un prestataire ?', content: 'Dans le détail de votre contrat, vous pouvez cliquer sur "Ouvrir un litige". Cela bloquera l\'Escrow et notifiera l\'équipe de médiation Siryia.', category: 'Services & Contrats' },
    ]);
  }, []);

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header simple public */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Sir<span className="text-primary-500">y</span>ia.
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600">Connexion</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Base de Connaissances</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Trouvez rapidement des réponses à vos questions concernant la marketplace, les services, et les paiements sécurisés.</p>
          
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher (ex: 'Escrow', 'KYC', 'Remboursement')..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-lg"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredArticles.map(article => (
            <div key={article.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300">
              <button 
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{article.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{article.category}</p>
                  </div>
                </div>
                {expandedId === article.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              
              {expandedId === article.id && (
                <div className="px-6 pb-6 pt-2">
                  <div className="pl-14 text-slate-600 leading-relaxed">
                    {article.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Aucun article trouvé pour "{search}"</p>
            </div>
          )}
        </div>

        <div className="mt-16 bg-primary-50 rounded-3xl p-8 text-center border border-primary-100">
          <MessageCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Vous n'avez pas trouvé votre réponse ?</h2>
          <p className="text-slate-600 mb-6">Notre équipe de support est là pour vous aider.</p>
          <Link href="/dashboard/support" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl transition-colors">
            Ouvrir un Ticket de Support
          </Link>
        </div>
      </main>
    </div>
  );
}
