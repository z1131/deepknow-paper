import React from 'react';
import { ThesisPlan } from '../types';
import { Layers, Lightbulb, PenTool, CheckCircle, PlusCircle, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';

interface TopicStatusSidebarProps {
    plan: ThesisPlan;
    onConfirm: () => void;
}

export const TopicStatusSidebar: React.FC<TopicStatusSidebarProps> = ({ plan, onConfirm }) => {

    return (
        <div className="w-96 border-l border-slate-200 bg-white h-full flex flex-col shadow-xl hidden md:flex">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    选题结构看板
                </h2>
                <p className="text-xs text-slate-500 mt-1">请与AI对话完善以下大纲</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* 1. Topic Title Section */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <PenTool className="w-3 h-3" /> 论文题目
                    </label>
                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 min-h-[80px]">
                        {plan.title ? (
                            <p className="text-indigo-900 font-medium leading-relaxed">{plan.title}</p>
                        ) : (
                            <p className="text-slate-400 italic text-sm">题目暂未确定...</p>
                        )}
                    </div>
                </div>

                {/* 2. Core Contents & Innovations */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> 核心内容与创新点
                        </label>
                    </div>

                    {plan.contents.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400 text-sm">暂无核心内容</p>
                            <p className="text-xs text-slate-300 mt-1">请告诉 AI 您的研究思路</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {plan.contents.map((content, idx) => (
                                <div key={content.id || idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
                                    {/* Core Content Title */}
                                    <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-start gap-2">
                                        <div className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">
                                            No.{idx + 1}
                                        </div>
                                        <div className="font-semibold text-slate-700 text-sm leading-tight">
                                            {content.title}
                                        </div>
                                    </div>

                                    {/* Innovations List */}
                                    <div className="p-3 bg-white">
                                        {content.innovations.length > 0 ? (
                                            <ul className="space-y-2">
                                                {content.innovations.map((innovation, iIdx) => (
                                                    <li key={iIdx} className="flex items-start gap-2 text-sm text-slate-600 group">
                                                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                                                        <span className="group-hover:text-slate-900 transition-colors">{innovation}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-xs text-slate-400 italic pl-6 flex items-center gap-1">
                                                <PlusCircle className="w-3 h-3" /> 待挖掘创新点...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer: Confirm Button */}
            <div className="p-5 border-t border-slate-100 bg-slate-50">
                <button
                    onClick={onConfirm}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-medium shadow-lg shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                    <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                    <span>确定选题，进入撰写</span>
                </button>
            </div>
        </div>
    );
};
