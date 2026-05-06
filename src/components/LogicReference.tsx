import React from 'react';
import { terminologyRules, formatRules, TERMS, FORMATS, MarketName, Status } from '../lib/compliance';

function getStatusColor(status: Status) {
  switch (status) {
    case 'Compliance':
      return 'bg-[#f0fdf4] text-[#228B22] border-[#228B22]';
    case 'Acceptable':
    case 'AcceptableCondition1':
    case 'AcceptableCondition2':
      return 'bg-[#fffbeb] text-[#b45309] border-[#b45309]';
    case 'Non-Compliance':
      return 'bg-[#fff8f8] text-[#B22222] border-[#B22222]';
    default:
      return 'bg-white text-stone-800 border-black/20';
  }
}

function getStatusLabel(status: Status) {
  switch (status) {
    case 'Compliance': return 'Compliance';
    case 'Acceptable': return 'Acceptable';
    case 'AcceptableCondition1': return 'Acceptable ※';
    case 'AcceptableCondition2': return 'Acceptable **';
    case 'Non-Compliance': return 'Non-Compliance';
    default: return status;
  }
}

export default function LogicReference() {
  const individualMarkets: MarketName[] = ['Brunei', 'Hong Kong', 'Malaysia', 'Singapore', 'Philippines'];
  
  return (
    <div className="space-y-12 animate-in fade-in duration-500 ease-out pb-12 bg-white p-6 border border-black">
      
      {/* SECTION 1: TERMINOLOGY */}
      <section>
        <h2 className="text-xs uppercase tracking-widest font-bold mb-4 border-b border-black pb-2 text-[#000080]">
          1. Terminology Hierarchy (1st Decision)
        </h2>
        <div className="overflow-x-auto border border-black/30 bg-white">
          <table className="w-full text-[10px] sm:text-xs text-left">
            <thead>
              <tr className="border-b border-black/30 bg-slate-50">
                <th className="p-3 font-serif italic text-sm border-r border-black/30 text-black">Markets</th>
                {[1, 2, 3, 4].map(rank => (
                  <th key={rank} className="p-3 font-bold uppercase tracking-wider text-center border-r last:border-r-0 border-black/30 text-black">
                    <span className="opacity-50 block text-[9px] mb-1">Rank {rank}</span>
                    {TERMS[rank as keyof typeof TERMS]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/30">
              {individualMarkets.map(market => (
                <tr key={market} className="hover:bg-slate-50 transition-none">
                  <td className="p-3 font-serif font-medium border-r border-black/30 text-black">{market}</td>
                  {[1, 2, 3, 4].map(rank => {
                    const status = terminologyRules[market][rank];
                    return (
                      <td key={rank} className="p-2 border-r last:border-r-0 border-black/30">
                        <div className={`px-2 py-1.5 text-center text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(status)}`}>
                          {getStatusLabel(status)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Emerging Markets Group */}
              <tr className="hover:bg-slate-50 transition-none">
                <td className="p-3 border-r border-black/30">
                  <span className="font-serif font-medium text-black">Emerging Markets</span>
                  <p className="text-[9px] text-stone-600 mt-1 uppercase tracking-tight">Indonesia, South Korea, Taiwan, Thailand, Vietnam</p>
                </td>
                {[1, 2, 3, 4].map(rank => (
                  <td key={rank} className="p-2 border-r last:border-r-0 border-black/30">
                    <div className={`px-2 py-1.5 text-center text-[10px] uppercase tracking-wider font-bold border ${getStatusColor('Acceptable')}`}>
                      {getStatusLabel('Acceptable')}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: FORMATTING */}
      <section>
        <h2 className="text-xs uppercase tracking-widest font-bold mb-4 border-b border-black pb-2 text-[#000080]">
          2. Formatting Hierarchy (2nd Decision)
        </h2>
        <div className="overflow-x-auto border border-black/30 bg-white">
          <table className="w-full text-[10px] sm:text-xs text-left">
            <thead>
              <tr className="border-b border-black/30 bg-slate-50">
                <th className="p-3 font-serif italic text-sm border-r border-black/30 text-black">Markets</th>
                {[1, 2, 3].map(rank => (
                  <th key={rank} className="p-3 font-bold uppercase tracking-wider text-center border-r last:border-r-0 border-black/30 text-black">
                    <span className="opacity-50 block text-[9px] mb-1">Rank {rank}</span>
                    {FORMATS[rank as keyof typeof FORMATS]}
                    <br />
                    <span className="font-serif italic capitalize text-[10px] opacity-70 font-normal mt-1 block tracking-tight">
                      {rank === 1 ? 'Numeric' : rank === 2 ? 'Alphanumeric' : 'Numeric + Alphanumeric'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/30">
              {individualMarkets.map(market => (
                <tr key={market} className="hover:bg-slate-50 transition-none">
                  <td className="p-3 font-serif font-medium border-r border-black/30 text-black">{market}</td>
                  {[1, 2, 3].map(rank => {
                    const status = formatRules[market][rank];
                    return (
                      <td key={rank} className="p-2 border-r last:border-r-0 border-black/30">
                        <div className={`px-2 py-1.5 text-center text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(status)}`}>
                          {getStatusLabel(status)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {['Indonesia', 'South Korea', 'Taiwan', 'Thailand', 'Vietnam'].map(market => (
                <tr key={market} className="hover:bg-slate-50 transition-none">
                  <td className="p-3 font-serif font-medium border-r border-black/30 text-stone-600">{market}</td>
                  {[1, 2, 3].map(rank => {
                    const status = formatRules[market as MarketName][rank];
                    return (
                      <td key={rank} className="p-2 border-r last:border-r-0 border-black/30">
                        <div className={`px-2 py-1.5 text-center text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(status)}`}>
                          {getStatusLabel(status)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* SECTION 3: DECISION RULEBOOK */}
        <section>
          <h2 className="text-xs uppercase tracking-widest font-bold mb-4 border-b border-black pb-2 text-[#000080]">
            3. Decision Rulebook (Explainer)
          </h2>
          <div className="bg-slate-50 border border-black/30 p-5 space-y-4 text-sm leading-relaxed text-black">
             <p className="font-serif font-bold text-lg mb-2">How Dual Line Logic Works:</p>
             <ol className="list-decimal pl-5 space-y-3 font-sans">
               <li>
                 <strong>The Overlap Check:</strong> The system first looks for a single Terminology Rank that is Green (Compliance) or Yellow (Acceptable) for ALL selected markets.
               </li>
               <li>
                 <strong>The Conflict Trigger:</strong> If any market is Red (Non-Compliance) for a specific Rank, that Rank is discarded from the shared pool.
               </li>
               <li>
                 <strong>The Pivot:</strong> If NO common Rank remains between the selected markets, the system pivots. It pulls "Rank 1" for each selected market and combines them into a Dual Line suggestion.
               </li>
             </ol>
          </div>
        </section>

        {/* SECTION 4: CONDITION LEGEND */}
        <section>
          <h2 className="text-xs uppercase tracking-widest font-bold mb-4 border-b border-black pb-2 text-[#000080]">
            4. Condition Legend
          </h2>
          <div className="bg-slate-50 border border-black/30 p-5 space-y-4 text-sm leading-relaxed text-black">
            <ul className="space-y-4">
               <li className="flex gap-3 items-start">
                 <span className="font-mono text-[#B22222] bg-[#fff8f8] border border-[#B22222]/30 px-1.5 uppercase font-bold text-[10px] mt-0.5">※ Condition</span>
                 <span>Additional panel with translation of Alphabetical "Month" in local language.</span>
               </li>
               <li className="flex gap-3 items-start">
                 <span className="font-mono text-[#B22222] bg-[#fff8f8] border border-[#B22222]/30 px-1.5 uppercase font-bold text-[10px] mt-0.5">** Condition</span>
                 <span>Addition statement of "Read Numeric - First 6 digit or 8 digit" in local language.</span>
               </li>
            </ul>
          </div>
        </section>
      </div>

    </div>
  );
}
