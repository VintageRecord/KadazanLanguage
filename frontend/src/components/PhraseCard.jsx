import { Volume2 } from 'lucide-react';

const DIFF_COLOR = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced:     'bg-red-100 text-red-700',
};

const DIFF_LABEL = {
  beginner:     'Asas',
  intermediate: 'Pertengahan',
  advanced:     'Lanjutan',
};

export default function PhraseCard({ phrase }) {
  return (
    <div className="phrase-card group">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFF_COLOR[phrase.difficulty]}`}>
          {DIFF_LABEL[phrase.difficulty]}
        </span>
        <span className="text-xs text-forest-400 font-medium">{phrase.category_name}</span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-forest-400 uppercase tracking-wide font-semibold mb-0.5">English</p>
          <p className="font-semibold text-forest-900">{phrase.english}</p>
        </div>
        <div>
          <p className="text-xs text-forest-400 uppercase tracking-wide font-semibold mb-0.5">Bahasa Malaysia</p>
          <p className="text-forest-700">{phrase.malay}</p>
        </div>
        <div className="bg-forest-50 rounded-xl p-3 mt-3">
          <p className="text-xs text-forest-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
            <Volume2 size={12} /> Bahasa Kadazan
          </p>
          <p className="font-bold text-forest-800 text-lg">{phrase.kadazan}</p>
          {phrase.romanization && (
            <p className="text-earth-600 text-sm mt-0.5 italic">{phrase.romanization}</p>
          )}
        </div>
      </div>
    </div>
  );
}
