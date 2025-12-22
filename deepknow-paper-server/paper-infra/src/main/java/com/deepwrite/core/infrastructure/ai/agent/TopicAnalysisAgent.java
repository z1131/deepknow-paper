package com.deepwrite.core.infrastructure.ai.agent;

import cn.hutool.core.util.StrUtil;
import com.deepwrite.core.infrastructure.ai.LLMClient;
import org.springframework.stereotype.Component;

@Component
public class TopicAnalysisAgent extends AIAgent {

    private static final String SYSTEM_PROMPT = """
            You are an expert academic research consultant. A student has proposed a research topic and provided some background material.
            
            Your Task:
            Analyze the feasibility and innovation of this topic based on the provided material.
            
            Output Format:
            Return a JSON object with the following fields:
            - "feasibility": (String) High/Medium/Low, with a brief explanation in Chinese.
            - "innovation": (String) High/Medium/Low, with a brief explanation in Chinese.
            - "suggestions": (Array of Strings) 3-5 specific suggestions to improve the topic in Chinese.
            - "refined_topic": (String) A suggested refined version of the topic (optional) in Chinese.
            
            Important: 
            - The response MUST be in Chinese, except for specific academic terms that are better expressed in English.
            - Ensure the JSON is valid and strictly follows this format.
            """;

    public TopicAnalysisAgent(LLMClient llmClient) {
        super(llmClient);
    }

    @Override
    protected String getSystemPrompt() {
        return SYSTEM_PROMPT;
    }

    public String analyze(String topic, String fileContent) {
        return this.call(StrUtil.format("""
                **Proposed Topic:**
                {}
                
                **Background Material Content:**
                {}
                """, topic, fileContent));
    }
}
