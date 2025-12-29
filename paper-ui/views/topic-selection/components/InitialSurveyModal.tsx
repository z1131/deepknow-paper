import React, { useState, useRef } from 'react';
import { SurveyData } from '../types';
import { Upload, CheckCircle2, Circle, ArrowRight, FileText } from 'lucide-react';

interface InitialSurveyModalProps {
    onComplete: (data: SurveyData) => void;
}

export const InitialSurveyModal: React.FC<InitialSurveyModalProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<SurveyData>({
        hasTopic: false,
        topicDescription: '',
        innovationDefined: false,
        needsMajorRevision: false,
        isComplete: false,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNext = () => setStep((prev) => prev + 1);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simple text reading for context
            const text = await file.text();
            setData({ ...data, topicFile: file, topicFileContent: text });
        }
    };

    const finishSurvey = () => {
        onComplete({ ...data, isComplete: true });
    };

    // Step 1: Topic Selection
    const renderStep1 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-light text-slate-800">选题状态</h3>
            <p className="text-slate-500">首先，请问您是否已经确定了具体的论文选题？</p>

            <div className="flex gap-4">
                <button
                    onClick={() => { setData({ ...data, hasTopic: true }); }}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${data.hasTopic ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                    <div className="font-medium">是的，已有选题</div>
                </button>
                <button
                    onClick={() => { setData({ ...data, hasTopic: false, topicFile: null, topicDescription: '' }); }}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${!data.hasTopic ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                    <div className="font-medium">还没有，需要帮助</div>
                </button>
            </div>

            {data.hasTopic && (
                <div className="space-y-4 animate-fadeIn">
                    {/* Text Input Area */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">选题描述 (简要说明)</label>
                        <textarea
                            value={data.topicDescription}
                            onChange={(e) => setData({ ...data, topicDescription: e.target.value })}
                            placeholder="例如：基于深度学习的图像识别在医疗诊断中的应用..."
                            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50 text-sm h-24 resize-none"
                        />
                    </div>

                    {/* File Upload */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <label className="flex flex-col items-center cursor-pointer">
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-600 font-medium">上传选题文档 (可选)</span>
                            <span className="text-xs text-slate-400 mt-1">支持 .txt, .md 格式</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".txt,.md"
                            />
                        </label>
                        {data.topicFile && (
                            <div className="mt-2 text-center text-sm text-indigo-600 font-medium flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {data.topicFile.name}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors"
                >
                    下一步 <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    // Step 2: Innovation Point
    const renderStep2 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-light text-slate-800">创新与新颖性</h3>
            <p className="text-slate-500">您的选题是否有明确的创新点？</p>

            <div className="space-y-3">
                <button
                    onClick={() => { setData({ ...data, innovationDefined: true }); handleNext(); }}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 group-hover:text-indigo-900">是的，非常明确</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                    </div>
                </button>
                <button
                    onClick={() => { setData({ ...data, innovationDefined: false }); handleNext(); }}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 group-hover:text-indigo-900">不太确定 / 还在构思</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                    </div>
                </button>
            </div>
        </div>
    );

    // Step 3: Revision Status
    const renderStep3 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-light text-slate-800">当前状态</h3>
            <p className="text-slate-500">您目前的选题是否需要大幅修改？</p>

            <div className="space-y-3">
                <button
                    onClick={() => { setData({ ...data, needsMajorRevision: false }); setTimeout(finishSurvey, 300); }}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 group-hover:text-emerald-900">不需要，仅需微调</span>
                        <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                    </div>
                </button>
                <button
                    onClick={() => { setData({ ...data, needsMajorRevision: true }); setTimeout(finishSurvey, 300); }}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 group-hover:text-amber-900">需要大改 / 重新定题</span>
                        <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
                    </div>
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header Graphic */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent scale-150"></div>
                </div>

                <div className="p-8">
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mb-8 justify-center">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        ))}
                    </div>

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>
            </div>
        </div>
    );
};
