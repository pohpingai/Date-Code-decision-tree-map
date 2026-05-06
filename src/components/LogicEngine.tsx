import React, { useState } from 'react';
import { calculateCompliance, MarketName, MARKETS } from '../lib/compliance';
import { ChevronRight, ShieldAlert, SlidersHorizontal, BookOpen } from 'lucide-react';
import LogicReference from './LogicReference';

type TabId = 'engine' | 'reference';

export default function LogicEngine() {
  const [selectedMarkets, setSelectedMarkets] = useState<MarketName[]>(['Hong Kong', 'Philippines']);
  const [activeTab, setActiveTab] = useState<TabId>('engine');

  const toggleMarket = (market: MarketName) => {
    setSelectedMarkets(prev =>
      prev.includes(market) ? prev.filter(m => m !== market) : [...prev, market]
    );
  };

  const result = calculateCompliance(selectedMarkets);

  return (
    <div className="min-h-screen bg-white text-black font-sans p-6 md:p-8 flex flex-col">
      <div className="max-w-6xl w-full mx-auto flex flex-col flex-grow">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b-4 border-[#000080] pb-6 mb-8 mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">System Intelligence v4.02</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight pb-2 md:pb-0 text-[#000080]">
              Compliance Logic Engine
            </h1>
            <p className="text-sm mt-2 max-w-2xl text-stone-700">
              Select target markets to dynamically generate compliant date marking label patterns.
            </p>
          </div>
          <div className="flex flex-col pt-4 md:pt-0 items-start md:items-end gap-4">
             <div className="flex bg-white border border-[#000080]">
               <button 
                onClick={() => setActiveTab('engine')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-none ${activeTab === 'engine' ? 'bg-[#000080] text-white' : 'text-[#000080] hover:bg-slate-100'}`}
               >
                 <SlidersHorizontal className="w-3.5 h-3.5" /> Engine
               </button>
               <button 
                onClick={() => setActiveTab('reference')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-none border-l border-[#000080] ${activeTab === 'reference' ? 'bg-[#000080] text-white' : 'text-[#000080] hover:bg-slate-100'}`}
               >
                 <BookOpen className="w-3.5 h-3.5" /> Logic Reference
               </button>
             </div>
             <div className="text-left md:text-right">
               <span className="text-sm font-mono bg-black text-white px-2 py-1 inline-block mb-1">STATUS: {activeTab === 'engine' ? 'ACTIVE_ANALYSIS' : 'REFERENCE_MODE'}</span>
               <p className="text-[10px] uppercase tracking-widest text-[#000080]">Session: APAC-MARKETS-2024</p>
             </div>
          </div>
        </header>

        {activeTab === 'engine' ? (
          <main className="grid lg:grid-cols-12 gap-0 flex-grow border border-[#000080]">
            
            {/* Controls / Inputs */}
            <section className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-[#000080] bg-slate-50">
              <h2 className="text-xs uppercase tracking-widest font-bold mb-4 text-[#000080] border-b border-[#000080]/30 pb-2">Input Parameters</h2>
              
              <div className="grid grid-cols-1 gap-2">
                {MARKETS.map(market => {
                  const isSelected = selectedMarkets.includes(market);
                  return (
                    <button
                      key={market}
                      onClick={() => toggleMarket(market)}
                      className={`text-left flex items-center justify-between p-3 border transition-none ${
                        isSelected 
                          ? 'bg-[#000080] text-white border-[#000080]' 
                          : 'bg-white border-black/20 hover:border-[#000080]'
                      }`}
                    >
                      <div className="flex flex-col flex-1 min-w-0 pr-2">
                        <span className="font-serif text-lg leading-none truncate">{market}</span>
                        <span className={`text-[9px] uppercase tracking-tighter mt-1 ${isSelected ? 'opacity-80' : 'opacity-50 text-black'}`}>
                          {isSelected ? 'Included in Analysis' : 'Standard Regulatory Subset'}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {isSelected ? (
                          <>
                            <span className="w-4 h-4 border border-white bg-white"></span>
                            <span className="w-4 h-4 bg-white"></span>
                          </>
                        ) : (
                          <>
                            <span className="w-4 h-4 bg-stone-300"></span>
                            <span className="w-4 h-4 border border-stone-300 bg-transparent"></span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedMarkets.length === 0 && (
                <div className="p-4 border border-[#B22222] bg-white mt-6">
                  <p className="text-[10px] leading-tight uppercase tracking-wider text-[#B22222] font-bold flex items-start gap-2">
                    <ShieldAlert className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    No markets selected. Pipeline suspended.
                  </p>
                </div>
              )}
            </section>

            {/* Results Display */}
            <section className="lg:col-span-8 flex flex-col bg-white">
              {result ? (
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between animate-in fade-in duration-500 ease-out">
                  <div>
                    <h2 className="text-xs uppercase tracking-widest font-bold mb-6 text-[#000080] border-b border-[#000080]/30 pb-2">Decision Matrix</h2>
                    
                    {result.isDualLine && (
                      <div className="border border-[#B22222] p-5 bg-[#fff8f8] mb-8">
                        <div className="flex items-center gap-2 text-[#B22222] font-bold uppercase text-sm tracking-wider mb-3">
                           <ShieldAlert className="w-5 h-5" />
                           Conflict Advisory
                        </div>
                        <p className="text-sm mb-3 text-stone-800">
                          A universal terminology rank could not be established. The following markets are non-compliant with the baseline rank:
                        </p>
                        <ul className="list-disc pl-6 text-sm font-bold text-[#B22222] mb-3">
                          {result.conflictingMarkets?.map(m => (
                            <li key={m}>{m}</li>
                          ))}
                        </ul>
                        <p className="text-sm text-stone-800 pt-2 border-t border-[#B22222]/20">
                          <strong>Resolution:</strong> System pivoted to dual-line mode to ensure compliance.
                        </p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {/* Terminology */}
                      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-4">
                        <div>
                          <label className="text-[10px] uppercase text-stone-500 block mb-1 font-bold tracking-widest">1st Decision: Terminology</label>
                          <p className={`text-2xl font-serif text-[#000080]`}>
                            {result.terminologyDecision}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <p className={`text-[10px] uppercase font-mono tracking-widest font-bold ${result.isDualLine ? 'text-[#B22222]' : 'text-[#228B22]'}`}>
                             STATUS: {result.isDualLine ? 'CONFLICT TRIGGERED' : 'UNIVERSAL COMPLIANCE'}
                          </p>
                        </div>
                      </div>

                      {/* Format */}
                      <div className="flex flex-col md:flex-row justify-between border-b border-black/10 pb-4">
                        <div>
                          <label className="text-[10px] uppercase text-stone-500 block mb-1 font-bold tracking-widest">2nd Decision: Format</label>
                          <p className={`text-2xl font-serif text-[#000080]`}>
                            {result.formatDecision}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 text-left md:text-right flex flex-col items-start md:items-end justify-center">
                          {result.conditions.requiresMonthPanel && (
                            <p className="text-[10px] text-[#B22222] uppercase font-mono tracking-widest font-bold bg-[#fff8f8] px-2 py-1 border border-[#B22222]/30 inline-block mb-1">
                              TRIGGER: CONDITION ※ MONTH PANEL
                            </p>
                          )}
                          {result.conditions.requiresNumericReadStmt && (
                            <p className="text-[10px] text-[#B22222] uppercase font-mono tracking-widest font-bold bg-[#fff8f8] px-2 py-1 border border-[#B22222]/30 inline-block">
                              TRIGGER: CONDITION ** READ NUMERIC
                            </p>
                          )}
                          {!result.conditions.requiresMonthPanel && !result.conditions.requiresNumericReadStmt && (
                             <p className="text-[10px] text-[#228B22] uppercase font-mono tracking-widest font-bold">
                               NO CONDITIONS TRIGGERED
                             </p>
                          )}
                        </div>
                      </div>

                      {/* Rendered Visual Output */}
                      <div className="pt-6">
                        <label className="text-xs uppercase font-bold text-[#000080] block mb-3 underline underline-offset-4 decoration-2">
                          Official Labeling Output
                        </label>
                        <div className="bg-slate-50 p-6 border-2 border-black/80">
                          {result.patternContent.map((line, idx) => (
                            <p key={idx} className="text-lg md:text-xl font-mono tracking-tighter text-left uppercase whitespace-pre-wrap leading-relaxed text-black font-semibold">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Legend Tables */}
                  {(result.conditions.requiresMonthPanel || result.conditions.requiresNumericReadStmt) && (
                    <footer className="mt-12 pt-6 border-t border-black/20 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                      <div className="md:col-span-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#000080]">Conditional<br/>References</p>
                      </div>
                      <div className="md:col-span-9 space-y-6">
                        {result.conditions.requiresMonthPanel && (
                          <div className="overflow-x-auto">
                            <p className="text-xs mb-2 uppercase text-[#B22222] font-bold">Condition ※ : Month Translation Panel required</p>
                            <table className="w-full text-left text-xs font-mono border-collapse border border-black/20 text-black">
                              <thead className="bg-[#f3f4f6] text-[10px] uppercase border-b border-black/20">
                                <tr>
                                  <th colSpan={6} className="py-2 px-3 font-semibold tracking-widest text-center">HOW TO READ</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-black/10 bg-white">
                                  <td className="py-2 px-3 border-r border-black/10">JAN = 01</td>
                                  <td className="py-2 px-3 border-r border-black/10">FEB = 02</td>
                                  <td className="py-2 px-3 border-r border-black/10">MAR = 03</td>
                                  <td className="py-2 px-3 border-r border-black/10">APR = 04</td>
                                  <td className="py-2 px-3 border-r border-black/10">MAY = 05</td>
                                  <td className="py-2 px-3">JUN = 06</td>
                                </tr>
                                <tr className="bg-white">
                                  <td className="py-2 px-3 border-r border-black/10">JUL = 07</td>
                                  <td className="py-2 px-3 border-r border-black/10">AUG = 08</td>
                                  <td className="py-2 px-3 border-r border-black/10">SEP = 09</td>
                                  <td className="py-2 px-3 border-r border-black/10">OCT = 10</td>
                                  <td className="py-2 px-3 border-r border-black/10">NOV = 11</td>
                                  <td className="py-2 px-3">DEC = 12</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {result.conditions.requiresNumericReadStmt && (
                          <div className="border border-[#B22222]/30 bg-[#fff8f8] p-4 text-[#B22222]">
                            <p className="text-xs uppercase font-bold mb-1">Condition ** : Numeric Read Statement required</p>
                            <p className="text-sm font-sans">Addition statement of "Read Numeric - First 6 digit or 8 digit" in local language.</p>
                          </div>
                        )}
                      </div>
                    </footer>
                  )}
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-stone-500 bg-white p-6">
                  <ChevronRight className="w-16 h-16 text-stone-300 mb-6" />
                  <p className="text-2xl font-serif text-[#000080] mb-2 font-bold">Awaiting Parameters</p>
                  <p className="text-sm font-sans text-center max-w-sm uppercase tracking-wider text-xs">
                    Select valid market combinations on the left to initialize analysis sequence.
                  </p>
                </div>
              )}
            </section>
          </main>
        ) : (
          <LogicReference />
        )}
      </div>
    </div>
  );
}

