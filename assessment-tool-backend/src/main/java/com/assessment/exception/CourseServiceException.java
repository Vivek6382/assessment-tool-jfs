package com.assessment.exception;

public class CourseServiceException extends RuntimeException {

    public CourseServiceException(String message) {
        super(message);
    }

    public CourseServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
