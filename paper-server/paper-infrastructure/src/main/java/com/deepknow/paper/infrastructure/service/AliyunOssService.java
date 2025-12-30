package com.deepknow.paper.infrastructure.service;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.deepknow.paper.infrastructure.config.AliyunOssProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class AliyunOssService {

    @Autowired
    private AliyunOssProperties ossProperties;

    /**
     * 上传文件流
     */
    public String upload(InputStream inputStream, String originalFilename) {
        String fileName = generateFileName(originalFilename);
        return uploadToOss(inputStream, fileName);
    }

    /**
     * 上传文本内容（保存为 .txt）
     */
    public String uploadText(String content, String originalFilename) {
        String fileName = "parsed/" + UUID.randomUUID() + ".txt"; // 存放在 parsed 目录下
        return uploadToOss(new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)), fileName);
    }

    private String uploadToOss(InputStream inputStream, String fileName) {
        OSS ossClient = new OSSClientBuilder().build(
                ossProperties.getEndpoint(),
                ossProperties.getAccessKeyId(),
                ossProperties.getAccessKeySecret());

        try {
            ossClient.putObject(ossProperties.getBucketName(), fileName, inputStream);
            // 拼接返回 URL (假设 bucket 是公共读，或者是通过 CDN 访问)
            // 格式: https://{bucket}.{endpoint}/{filename}
            // 或者使用配置的 urlPrefix
            if (ossProperties.getUrlPrefix() != null && !ossProperties.getUrlPrefix().isEmpty()) {
                return ossProperties.getUrlPrefix() + "/" + fileName;
            }
            return "https://" + ossProperties.getBucketName() + "." + ossProperties.getEndpoint() + "/" + fileName;
        } finally {
            ossClient.shutdown();
        }
    }

    private String generateFileName(String originalFilename) {
        String suffix = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        // 按照日期/UUID 归档，防止文件名冲突
        return "docs/" + UUID.randomUUID() + suffix;
    }
}
