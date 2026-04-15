import React, { useState, useEffect } from 'react';
import { GraduationCap, Clock, ArrowUpRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { api } from '../services/Api';

const ProgramCard = ({ item, getCategoryColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const id = item.qualificationId || item.QualificationId;
  const name = item.qualificationName || item.QualificationName;
  const shortName = item.qualificationsh || item.Qualificationsh;
  const years = item.qualificationYears || item.QualificationYears;
  const desc = item.qualificationDescription || item.QualificationDescription;
  const style = getCategoryColor(shortName);

  return (
    <div
      key={id}
      className={`group relative bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 transition-all duration-300 hover:border-emerald-500/30 ${
        isExpanded ? 'ring-1 ring-emerald-500/20 bg-slate-900/90' : 'hover:bg-slate-900/80'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${style} border`}>
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter px-2 py-0.5 bg-slate-800/50 rounded border border-slate-700/50">
          {shortName}
        </span>
      </div>

      <h3 className="text-md font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors leading-tight">
        {name}
      </h3>

      <div className="flex items-center gap-2 text-slate-500 text-[10px] mb-3 font-medium">
        <Clock className="w-3 h-3 text-emerald-500/60" />
        <span>{years} Years</span>
      </div>

      <p className={`text-slate-400 text-[11px] leading-snug mb-4 transition-all duration-300 ${
        isExpanded ? 'block' : 'line-clamp-2 opacity-70'
      }`}>
        {desc}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
          {isExpanded ? 'Full Info' : 'Program'}
        </span>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`transition-all duration-300 ${
            isExpanded ? 'rotate-45 text-white bg-emerald-500 rounded-full p-0.5' : 'text-emerald-400 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await api.getPrograms();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const getCategoryColor = (shortName) => {
    const colors = {
      B_TECH: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
      M_TECH: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20',
      MBA: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20',
    };
    return colors[shortName] || 'from-slate-500/20 to-slate-500/5 text-slate-400 border-slate-500/20';
  };

  const displayedPrograms = showAll ? programs : programs.slice(0, 6);

  if (loading) return null;

  return (
    /* Changed py-12 to pt-4 pb-12 to decrease top space significantly */
    <section id="programs" className="pt-4 pb-12 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Subtle separator line to bridge the gap from Stats section */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-10 opacity-50" />

        <div className="mb-6"> {/* Reduced margin-bottom from 8 to 6 */}
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-2.5 h-2.5" /> Catalog
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Academic <span className="text-emerald-400">Programs</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedPrograms.map((item) => (
            <ProgramCard 
              key={item.qualificationId || item.QualificationId} 
              item={item} 
              getCategoryColor={getCategoryColor} 
            />
          ))}
        </div>

        {programs.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 border border-slate-800 text-slate-500 text-[11px] font-bold rounded-md hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
            >
              {showAll ? (
                <>View Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>View More <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};