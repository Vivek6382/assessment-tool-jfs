# Assessment Tool – Online Assessment Management Platform

## Overview
**Assessment Tool** is a web-based solution designed to simplify and streamline the process of **creating, managing, and delivering online assessments** for educational institutions and professional training environments. The system supports secure role-based access for **administrators, educators, and students**, offering everything from question creation and scheduling to grading and analytics.

### Problem Statement
Traditional assessment systems often lack integration, automation, and user-specific functionality. Educators face challenges in creating varied question types, while students need a clean, secure environment to complete tests. The **Assessment Tool** solves this by delivering a **modular, secure, and scalable platform** for managing end-to-end assessment workflows.

### Key Objectives
- Digitize and automate online assessment workflows
- Enable secure login and role-based access (Admin, Educator, Student)
- Support multi-format questions and auto/manual grading
- Offer performance reports and analytics for stakeholders
- Ensure future readiness for adaptive tests and IDE integration

## Features

### Student Features:
- **User Authentication:** JWT-based login with encrypted credentials
- **Assessment Access:** View and take assigned assessments only
- **Timer & Navigation:** Countdown timer, answer review, and auto-save
- **Instant Feedback:** For auto-graded sections (MCQ, True/False)
- **Performance Reports:** View past scores and instructor feedback

### Educator Features:
- **Assessment Builder:** Create, edit, and publish assessments
- **Question Types:** Support for MCQ, T/F, Short Answer, and Essay
- **Assignment:** Assign to specific students or entire class
- **Manual Grading:** Grade essays, short answers, and provide feedback
- **Student Monitoring:** Track attempts and submission status

### Admin Features:
- **User Management:** Add/edit/delete users and assign roles
- **System Dashboard:** View usage, test stats, and platform logs
- **Security:** Manage JWT lifecycle, role access, and enforce policies
- **Analytics:** Export performance data, track activity logs

## Technology Stack

### Frontend:
- Spring MVC (Thymeleaf templating)
- HTML5, CSS3, JavaScript
- Bootstrap (Responsive UI)

### Backend:
- Spring Boot (REST API)
- Hibernate + JPA (ORM layer)
- Spring Security (JWT-based)

### Database:
- MySQL (Relational storage)

### Authentication:
- JWT (stateless access tokens)
- BCrypt (secure password encryption)

### Tools:
- Postman (API testing)

## Database Design

Assessment Tool uses a **relational schema** with normalized tables for efficient data handling.

**Core Tables:**

| Entity | Description |
|--------|-------------|
| **User** | Stores user credentials and personal details |
| **Role** | Defines user access levels: ADMIN, EDUCATOR, STUDENT |
| **Assessment** | Metadata for tests (title, duration, category) |
| **Question** | Linked to assessments with type, text, and points |
| **QuestionOption** | Possible answers for MCQs |
| **Answer** | Student-selected option for objective questions |
| **Response** | Text-based answers for subjective questions |
| **Result** | Total marks, percentage, grade, and score |
| **Feedback** | Instructor comments per student assessment |
| **Course** | Academic course information |
| **Module** | Linked to course for organizing tests |
| **CourseEnrollment** | Student enrollment record per course |

## Installation & Setup

### 🔹 Backend (Spring Boot)
1. Clone the repository:
   ```sh
   git clone https://github.com/Vivek6382/assessment-tool-jfs.git
```

2. Navigate to the backend directory:

   ```sh
   cd assessment-tool-backend
   ```
3. Configure `application.properties`:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/assessmentdb
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
4. Run the backend:

   ```sh
   mvn spring-boot:run
   ```

### 🔹 Frontend (Spring MVC + Thymeleaf)

1. Navigate to `assessment-tool-frontend`
2. Run on Apache Tomcat or deploy as a WAR file
3. Access the frontend via:

   ```
   http://localhost:8082/assessment-tool-frontend/
   ```

## Author

**Syed Anees J**
Email: aneesjha3@gmail.com
GitHub: [https://github.com/SyedAnees2003](https://github.com/SyedAnees2003)
