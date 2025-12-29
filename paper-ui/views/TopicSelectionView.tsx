import React, { useState } from 'react';
import { PaperTask, Topic } from '../types';
import { InitialSurveyModal } from './topic-selection/components/InitialSurveyModal';
import { ChatInterface } from './topic-selection/components/ChatInterface';
import { TopicStatusSidebar } from './topic-selection/components/TopicStatusSidebar';
import { SurveyData, ThesisPlan } from './topic-selection/types';

interface TopicSelectionViewProps {
  task: PaperTask;
  onUpdateTask: (updates: Partial<PaperTask>) => void;
  onComplete: () => void;
}

export const TopicSelectionView: React.FC<TopicSelectionViewProps> = ({ task, onUpdateTask, onComplete }) => {
  // Local state for the UI flow
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    hasTopic: false,
    innovationDefined: false,
    needsMajorRevision: false,
    isComplete: false
  });

  // State to hold the structured thesis plan (Mocked for now)
  const [thesisPlan, setThesisPlan] = useState<ThesisPlan>({
    title: task.title && !task.title.includes("Untitled") ? task.title : "",
    contents: []
  });

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setSurveyComplete(true);

    // Initialize Title if provided in survey
    if (data.topicDescription) {
      setThesisPlan(prev => ({
        ...prev,
        title: data.topicDescription || ""
      }));
      // Update the main task title as well if it was generic
      if (task.title.includes("Untitled") || task.title === "新建未命名论文") {
        onUpdateTask({ title: data.topicDescription.substring(0, 20) + "..." });
      }
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
        <InitialSurveyModal onComplete={handleSurveyComplete} />
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