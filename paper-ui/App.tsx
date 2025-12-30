import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WorkflowNode } from './components/WorkflowNode';
import { TopicSelectionView } from './views/TopicSelectionView';
import { OutlineView } from './views/OutlineView';
import { RefinementView } from './views/RefinementView';
import { PaperTask, WorkflowStep } from './types';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { projectService } from './services/projectService';
import { authService } from './services/authService';
import { LoginModal } from './components/LoginModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<PaperTask[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>('');
  const [isOverviewMode, setIsOverviewMode] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  // Helper function to map project status to workflow step
  const mapStatusToStep = (status: string): WorkflowStep => {
    if (status === 'INIT' || status === 'TOPIC_GENERATING') return WorkflowStep.TOPIC_SELECTION;
    if (status === 'TOPIC_SELECTED') return WorkflowStep.OUTLINE_OVERVIEW;
    // Add more mappings as needed
    return WorkflowStep.TOPIC_SELECTION; // Default
  };

  const loadProjects = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setIsLoginModalOpen(true);
        return;
      }

      const projects = await projectService.listProjects();
              const loadedTasks: PaperTask[] = projects.map(p => ({
                id: p.id.toString(),
                title: p.title || '未命名论文',
                status: p.status, // Pass the business status
                currentStep: mapStatusToStep(p.status),
                outline: [],
                images: []
              }));      setTasks(loadedTasks);

      // Auto-select the most recent project if none selected
      if (loadedTasks.length > 0 && !activeTaskId) {
        setActiveTaskId(loadedTasks[0].id);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, [activeTaskId]);

  // Initial load and event listeners
  useEffect(() => {
    loadProjects();

    const handleUnauthorized = () => setIsLoginModalOpen(true);
    const handleLogout = () => {
      setTasks([]);
      setActiveTaskId('');
      setIsLoginModalOpen(true);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [loadProjects]);

  useEffect(() => {
    // When switching tasks, revert to overview mode
    setIsOverviewMode(true);
  }, [activeTaskId]);

  const updateTask = (id: string, updates: Partial<PaperTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addTask = async () => {
    try {
      const projectDTO = await projectService.createProject();
      const newTask: PaperTask = {
        id: projectDTO.id.toString(),
        title: projectDTO.title || '新建未命名论文',
        status: projectDTO.status,
        currentStep: WorkflowStep.TOPIC_SELECTION,
        outline: [],
        images: []
      };
      setTasks([...tasks, newTask]);
      setActiveTaskId(newTask.id);
    } catch (error) {
      console.error("Failed to create project", error);
      alert("创建项目失败，请检查网络或后端服务");
    }
  };

  const handleStepClick = (step: WorkflowStep) => {
    if (!activeTask) return;
    if (step <= activeTask.currentStep) {
      setIsOverviewMode(false);
      updateTask(activeTask.id, { currentStep: step });
    }
  };

  const advanceStep = () => {
    if (!activeTask) return;
    const nextStep = activeTask.currentStep + 1;
    if (nextStep <= 4) {
      updateTask(activeTask.id, { currentStep: nextStep });
      setIsOverviewMode(false);
    }
  };

  // Smart Back Navigation
  const handleBack = () => {
    if (!activeTask) return;
    if (activeTask.currentStep === WorkflowStep.TOPIC_SELECTION) {
      // If viewing a selected topic details, go back to generated list/form
      if (activeTask.selectedTopic) {
        updateTask(activeTask.id, { selectedTopic: undefined });
        return;
      }
      // If in a specific mode (New/Existing) but not finalized, go back to mode selection cards
      if (activeTask.topicMode) {
        updateTask(activeTask.id, { topicMode: undefined });
        return;
      }
    }
    // Default: Go back to workflow overview
    setIsOverviewMode(true);
  };

  const getBackLabel = () => {
    if (!activeTask) return "";
    if (activeTask.currentStep === WorkflowStep.TOPIC_SELECTION) {
      if (activeTask.selectedTopic) return "返回列表";
      if (activeTask.topicMode) return "返回选题方式";
    }
    return "返回流程图";
  };

  // Render content based on current workflow step
  const renderContent = () => {
    if (!activeTask) return null;
    switch (activeTask.currentStep) {
      case WorkflowStep.TOPIC_SELECTION:
        return (
          <TopicSelectionView
            task={activeTask}
            onUpdateTask={(u) => updateTask(activeTask.id, u)}
            onComplete={advanceStep}
          />
        );
      case WorkflowStep.OUTLINE_OVERVIEW:
        return (
          <OutlineView
            task={activeTask}
            mode="outline"
            onUpdateTask={(u) => updateTask(activeTask.id, u)}
            onComplete={advanceStep}
          />
        );
      case WorkflowStep.DRAFTING:
        return (
          <OutlineView
            task={activeTask}
            mode="drafting"
            onUpdateTask={(u) => updateTask(activeTask.id, u)}
            onComplete={advanceStep}
          />
        );
      case WorkflowStep.REFINEMENT:
        return <RefinementView task={activeTask} />;
      default:
        return <div>未知步骤</div>;
    }
  };

  const renderWorkflowMap = () => {
    if (!activeTask) return null;

    const renderStepCard = (stepId: WorkflowStep, label: string, isSoul: boolean = false) => {
      const isActive = activeTask.currentStep === stepId;
      const isCompleted = activeTask.currentStep > stepId;
      const isLocked = activeTask.currentStep < stepId;

      return (
        <div
          key={stepId}
          onClick={() => !isLocked && handleStepClick(stepId)}
          className={`
            w-64 h-20 bg-white border rounded-xl flex items-center justify-between px-5 py-3 transition-all duration-200
            ${isActive
              ? 'border-blue-500 border-dashed ring-4 ring-blue-50/50 shadow-md z-10 scale-105'
              : isCompleted
                ? 'border-green-500/30 hover:border-green-500 shadow-sm'
                : 'border-gray-200 opacity-60 bg-gray-50/50'}
            ${!isLocked ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'}
            ${isSoul ? 'ring-2 ring-amber-100 border-amber-200 bg-gradient-to-br from-white to-amber-50/30' : ''}
          `}
        >
          <div className="flex items-center gap-4 w-full">
            <div className="shrink-0">
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-[#1a7f37] flex items-center justify-center text-white">
                  <Check size={14} strokeWidth={4} />
                </div>
              ) : isActive ? (
                <Loader2 className="text-[#0969da] animate-spin" size={24} strokeWidth={2.5} />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
            </div>

            <div className="flex flex-col overflow-hidden text-left">
              <span className={`font-bold text-sm uppercase tracking-wider ${isSoul ? 'text-amber-600' : 'text-gray-400'}`}>
                {isSoul ? '核心基石' : 'AI 执行'}
              </span>
              <span className={`font-extrabold text-base truncate ${isCompleted || isActive ? 'text-[#1f2328]' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="h-full flex items-center justify-center bg-[#f6f8fa] overflow-auto">
        <div className="flex flex-col items-center gap-16 p-10">
          {/* Top: The Soul (Topic Selection) */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">确立论文灵魂</div>
            {renderStepCard(WorkflowStep.TOPIC_SELECTION, "选题", true)}
          </div>

          {/* Bottom: The AI Execution Engine */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">AI 辅助生产流水线</div>
            <div className="flex items-start gap-8">
              {renderStepCard(WorkflowStep.OUTLINE_OVERVIEW, "大纲及概述")}
              {renderStepCard(WorkflowStep.DRAFTING, "文本内容撰写")}
              {renderStepCard(WorkflowStep.REFINEMENT, "精修")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-800 font-sans">
      <Sidebar
        tasks={tasks}
        activeTaskId={activeTaskId}
        onSelectTask={setActiveTaskId}
        onAddTask={addTask}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation - Only show if not in overview mode */}
        {!isOverviewMode && activeTask && (
          <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm justify-between z-10 animate-fade-in-down">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-gray-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={16} />
                {getBackLabel()}
              </button>
              <div className="h-4 w-px bg-gray-300 mx-2"></div>
              <h2 className="font-bold text-gray-800 truncate max-w-xs">{activeTask.title}</h2>
            </div>

            <div className="flex items-center space-x-2">
              <WorkflowNode step={WorkflowStep.TOPIC_SELECTION} currentStep={activeTask.currentStep} label="选题" stepNumber={1} onClick={handleStepClick} />
              <WorkflowNode step={WorkflowStep.OUTLINE_OVERVIEW} currentStep={activeTask.currentStep} label="大纲" stepNumber={2} onClick={handleStepClick} />
              <WorkflowNode step={WorkflowStep.DRAFTING} currentStep={activeTask.currentStep} label="撰写" stepNumber={3} onClick={handleStepClick} />
              <WorkflowNode step={WorkflowStep.REFINEMENT} currentStep={activeTask.currentStep} label="精修" stepNumber={4} onClick={handleStepClick} />
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex-1 overflow-hidden relative bg-[#f6f8fa]">
          {activeTask ? (
            isOverviewMode ? renderWorkflowMap() : renderContent()
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg mb-4">暂无项目，请先创建</p>
              <button
                onClick={addTask}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-colors"
              >
                新建论文项目
              </button>
            </div>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={loadProjects}
      />
    </div>
  );
};

export default App;