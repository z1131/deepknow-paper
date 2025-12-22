package com.deepwrite.core.infrastructure.ai.agent;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.deepwrite.core.infrastructure.ai.LLMClient;
import lombok.RequiredArgsConstructor;

public abstract class AIAgent {

    protected final LLMClient llmClient;

    public AIAgent(LLMClient llmClient) {
        this.llmClient = llmClient;
    }

    protected abstract String getSystemPrompt();

    protected double getTemperature() {
        return 0.7;
    }

    /**
     * Call the agent with a user message
     */
    public String call(String userMessage) {
        JSONArray messages = new JSONArray();
        
        // System Prompt
        messages.add(new JSONObject().set("role", "system").set("content", getSystemPrompt()));
        
        // User Message
        messages.add(new JSONObject().set("role", "user").set("content", userMessage));

        return llmClient.chat(messages, getTemperature());
    }
}
