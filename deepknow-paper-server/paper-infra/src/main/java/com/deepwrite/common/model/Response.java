package com.deepwrite.common.model;

import java.io.Serializable;

public class Response<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final int SUCCESS_CODE = 200;
    public static final int ERROR_CODE = 500;

    private Integer code;
    private String message;
    private T data;

    public Response() {
    }

    public Response(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> Response<T> success(T data) {
        return new Response<>(SUCCESS_CODE, "success", data);
    }

    public static <T> Response<T> success() {
        return new Response<>(SUCCESS_CODE, "success", null);
    }

    public static <T> Response<T> error(String message) {
        return new Response<>(ERROR_CODE, message, null);
    }

    public static <T> Response<T> error(int code, String message) {
        return new Response<>(code, message, null);
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
