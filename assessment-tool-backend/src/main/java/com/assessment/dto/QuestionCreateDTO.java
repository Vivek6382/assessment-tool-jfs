// Create this file in: src/main/java/com/assessment/dto/QuestionCreateDTO.java
package com.assessment.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionCreateDTO {
    private String questionText;
    private Integer questionTypeId;
    private Integer questionMarks;
    private Boolean requiresManualGrading;
    private Integer maxWordCount;
    private Integer assessmentId;
    private List<QuestionOptionDTO> options;
    private Boolean saveAndAddNext;
    
    
    
    public String getQuestionText() {
		return questionText;
	}

	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}

	public Integer getQuestionTypeId() {
		return questionTypeId;
	}

	public void setQuestionTypeId(Integer questionTypeId) {
		this.questionTypeId = questionTypeId;
	}

	public Integer getQuestionMarks() {
		return questionMarks;
	}

	public void setQuestionMarks(Integer questionMarks) {
		this.questionMarks = questionMarks;
	}

	public Boolean getRequiresManualGrading() {
		return requiresManualGrading;
	}

	public void setRequiresManualGrading(Boolean requiresManualGrading) {
		this.requiresManualGrading = requiresManualGrading;
	}

	public Integer getMaxWordCount() {
		return maxWordCount;
	}

	public void setMaxWordCount(Integer maxWordCount) {
		this.maxWordCount = maxWordCount;
	}

	public Integer getAssessmentId() {
		return assessmentId;
	}

	public void setAssessmentId(Integer assessmentId) {
		this.assessmentId = assessmentId;
	}

	public List<QuestionOptionDTO> getOptions() {
		return options;
	}

	public void setOptions(List<QuestionOptionDTO> options) {
		this.options = options;
	}

	public Boolean getSaveAndAddNext() {
		return saveAndAddNext;
	}

	public void setSaveAndAddNext(Boolean saveAndAddNext) {
		this.saveAndAddNext = saveAndAddNext;
	}

	public QuestionCreateDTO(String questionText, Integer questionTypeId, Integer questionMarks,
			Boolean requiresManualGrading, Integer maxWordCount, Integer assessmentId, List<QuestionOptionDTO> options,
			Boolean saveAndAddNext) {
		super();
		this.questionText = questionText;
		this.questionTypeId = questionTypeId;
		this.questionMarks = questionMarks;
		this.requiresManualGrading = requiresManualGrading;
		this.maxWordCount = maxWordCount;
		this.assessmentId = assessmentId;
		this.options = options;
		this.saveAndAddNext = saveAndAddNext;
	}

	@Data
    public static class QuestionOptionDTO {
        private Integer optionId;
        private String optionText;
        private Boolean isCorrect;
        private List<AnswerDTO> answers;
		public Integer getOptionId() {
			return optionId;
		}
		public void setOptionId(Integer optionId) {
			this.optionId = optionId;
		}
		public String getOptionText() {
			return optionText;
		}
		public void setOptionText(String optionText) {
			this.optionText = optionText;
		}
		public Boolean getIsCorrect() {
			return isCorrect;
		}
		public void setIsCorrect(Boolean isCorrect) {
			this.isCorrect = isCorrect;
		}
		public List<AnswerDTO> getAnswers() {
			return answers;
		}
		public void setAnswers(List<AnswerDTO> answers) {
			this.answers = answers;
		}
		public QuestionOptionDTO(Integer optionId, String optionText, Boolean isCorrect, List<AnswerDTO> answers) {
			super();
			this.optionId = optionId;
			this.optionText = optionText;
			this.isCorrect = isCorrect;
			this.answers = answers;
		}
        
        
    }
    
    @Data
    public static class AnswerDTO {
        private Integer answerId;
        private String correctAnswerText;
        private Integer points;
		public Integer getAnswerId() {
			return answerId;
		}
		public void setAnswerId(Integer answerId) {
			this.answerId = answerId;
		}
		public String getCorrectAnswerText() {
			return correctAnswerText;
		}
		public void setCorrectAnswerText(String correctAnswerText) {
			this.correctAnswerText = correctAnswerText;
		}
		public Integer getPoints() {
			return points;
		}
		public void setPoints(Integer points) {
			this.points = points;
		}
		public AnswerDTO(Integer answerId, String correctAnswerText, Integer points) {
			super();
			this.answerId = answerId;
			this.correctAnswerText = correctAnswerText;
			this.points = points;
		}
		public AnswerDTO() {
			super();
			// TODO Auto-generated constructor stub
		}
        
        
    }
}