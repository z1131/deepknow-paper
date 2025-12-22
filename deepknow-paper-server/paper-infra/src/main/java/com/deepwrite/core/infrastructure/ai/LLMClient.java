package com.deepwrite.core.infrastructure.ai;

import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LLMClient {

    private static final Logger log = LoggerFactory.getLogger(LLMClient.class);

    @Value("${deepseek.api-key}")
    private String apiKey;

    @Value("${deepseek.base-url:https://api.deepseek.com}")
    private String baseUrl;

    /**
     * Generic chat completion call
     * @param messages List of message objects (role, content)
     * @param temperature Creativity level
     * @return The content of the assistant's response
     */
    public String chat(JSONArray messages, double temperature) {
        String url = StrUtil.format("{}/chat/completions", baseUrl);

        JSONObject requestBody = new JSONObject()
                .set("model", "deepseek-chat")
                .set("messages", messages)
                .set("stream", false)
                .set("temperature", temperature);

        log.info("Calling LLM API...");
        try (HttpResponse response = HttpRequest.post(url)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(requestBody.toString())
                .timeout(60000) // 60s timeout
                .execute()) {

            if (!response.isOk()) {
                log.error("LLM API failed: {} - {}", response.getStatus(), response.body());
                throw new RuntimeException("AI Service Unavailable: " + response.getStatus());
            }

            String responseBody = response.body();
            return parseResponse(responseBody);

        } catch (Exception e) {
            log.error("Error calling LLM API", e);
            throw new RuntimeException("Failed to call AI service", e);
        }
    }

    private String parseResponse(String responseBody) {
        try {
            JSONObject json = JSONUtil.parseObj(responseBody);
            String text = json.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getStr("content");
            
            // Clean up potential markdown code blocks
            return StrUtil.cleanBlank(text.replace("```json", "").replace("```", ""));
        } catch (Exception e) {
            log.error("Failed to parse LLM response: {}", responseBody, e);
            throw new RuntimeException("Invalid AI Response Format");
        }
    }
}
