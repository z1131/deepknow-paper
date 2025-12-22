package com.deepwrite.core.infrastructure.oss;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Component
public class OssClient {

    @Value("${aliyun.oss.endpoint}")
    private String endpoint;

    @Value("${aliyun.oss.access-key-id}")
    private String accessKeyId;

    @Value("${aliyun.oss.access-key-secret}")
    private String accessKeySecret;

    @Value("${aliyun.oss.bucket-name}")
    private String bucketName;

    public String uploadFile(MultipartFile file) throws IOException {
        // Create OSS instance
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String fileName = "topics/" + UUID.randomUUID().toString() + extension;

            // Upload
            ossClient.putObject(bucketName, fileName, file.getInputStream());

            // Return URL (assuming public read or handling via signed URL later, for now simple URL)
            // Format: https://bucket-name.endpoint/object-name
            return "https://" + bucketName + "." + endpoint + "/" + fileName;
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
}
