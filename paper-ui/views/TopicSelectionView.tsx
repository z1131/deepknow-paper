import React, { useState } from 'react';
import { PaperTask } from '../types';
import { InitialSurveyModal } from './topic-selection/components/InitialSurveyModal';
import { ChatInterface } from './topic-selection/components/ChatInterface';
import { TopicStatusSidebar } from './topic-selection/components/TopicStatusSidebar';
import { SurveyData, ThesisPlan } from './topic-selection/types';
import { topicService } from '../services/topicService';

interface TopicSelectionViewProps {
  task: PaperTask;
  onUpdateTask: (updates: Partial<PaperTask>) => void;
  onComplete: () => void;
}

export const TopicSelectionView: React.FC<TopicSelectionViewProps> = ({ task, onUpdateTask, onComplete }) => {
  // Check if we should skip the survey based on status
  const isAlreadyGenerating = task.status === 'TOPIC_GENERATING';
  
  // Local state for the UI flow
  const [surveyComplete, setSurveyComplete] = useState(isAlreadyGenerating);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    hasTopic: isAlreadyGenerating,
    topicDescription: task.title || '',
    innovationDefined: false,
    needsMajorRevision: false,
    isComplete: isAlreadyGenerating
  });

  // State to hold the structured thesis plan (Mocked for now)
  const [thesisPlan, setThesisPlan] = useState<ThesisPlan>({
    title: task.title && !task.title.includes("Untitled") ? task.title : "",
    contents: []
  });

  const handleSurveyComplete = async (data: SurveyData) => {
    try {
      // Notify backend that we've started generating (even if no file was uploaded)
      // Only update intent if description is provided, to avoid overwriting with empty
      if (data.topicDescription) {
          await topicService.updateIntent(Number(task.id), data.topicDescription);
      }
      
      setSurveyData(data);
      setSurveyComplete(true);

      // Initialize Title if provided in survey
      if (data.topicDescription) {
        setThesisPlan(prev => ({
          ...prev,
          title: data.topicDescription || ""
        }));
        // Update the main task title as well if it was generic
        if (task.title.includes("Untitled") || task.title === "新建未命名论文" || task.title === "未命名论文") {
          onUpdateTask({ title: data.topicDescription.substring(0, 20) + "..." });
        }
      }
    } catch (error) {
        console.error("Failed to update intent:", error);
        // Still proceed to show UI even if backend sync failed (graceful degradation)
        setSurveyData(data);
        setSurveyComplete(true);
    }
  };

  const handleConfirmTopic = () => {
    // Logic to finalize topic
    if (!thesisPlan.title) {
      alert("请先确定一个论文题目");
      return;
    }

    // Update global task
    onUpdateTask({
      title: thesisPlan.title,
      // You might want to store the plan structure in the task as well later
    });

    onComplete();
  };

  return (
    <div className="h-full w-full bg-slate-100 overflow-hidden font-sans text-slate-900 flex flex-col relative">
      {!surveyComplete && (
        <InitialSurveyModal projectId={task.id} onComplete={handleSurveyComplete} />
      )}

      {/* Main Layout */}
      <div className={`flex-1 flex overflow-hidden transition-opacity duration-700 ${surveyComplete ? 'opacity-100' : 'opacity-0'}`}>
        {/* Main Chat Area */}
        <main className="flex-1 h-full relative">
          <ChatInterface surveyData={surveyData} />
        </main>

        {/* Right Sidebar - Status */}
        <aside className="h-full z-20 shadow-xl">
          <TopicStatusSidebar plan={thesisPlan} onConfirm={handleConfirmTopic} />
        </aside>
      </div>
    </div>
  );
};
