
# Backend HR System

HR Web System is a comprehensive and user-friendly web-based application designed to streamline and enhance various Human Resources (HR) functions within an organization. This system serves as a centralized platform for managing and automating HR processes, promoting efficiency, accuracy, and transparency across the workforce.

## 🚀 Getting Started

Follow these simple steps to run the HR System locally on your machine.

### ✅ Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com)

### 🔧 Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/taniaprastyaa/backend-hr-system.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd nestjs-hr-system-api
   ```

3. **Install dependencies**
   ```bash
   yarn install
   ```

4. **Run the development server**
   ```bash
   yarn start:dev
   ```

5. **Run database seeder**
   ```bash
   yarn seed
   # or
   npm run seed
   ```

---

## 📘 API Documentation

Access the Swagger API documentation:

```bash
URL: http://BASE_URL/api/v1/docs
```

### 🔐 Authentication via Swagger

1. Go to the `Sign In` endpoint.
2. Enter your email and password.
3. Copy the returned **access token**.
4. Click on **Authorize** in Swagger UI and paste the token.

---

## 🔐 Role-Based Endpoint Access

### Role: `Employee` and `HOD`

The following endpoints require an authenticated user with the role `Employee` or `HOD`:

- `GET /announcement/announcement-per-department`
- `GET /department_document/department-document-per-department`
- `POST /department_document`
- `PUT /department_document`
- `GET /employee/statistics`
- `GET /employee/employee-per-department`
- `POST /employee_attendances`
- `POST /employee_overtimes`
- `GET /employee_tasks/statistics`
- `GET /employee_tasks/employee-task-per-department`
- `GET /employee_tasks/employee-task-per-employee`
- `POST /employee_tasks`
- `PUT /employee_tasks`
- `GET /employee_work_shifts/employee-work-shift-per-department`
- `GET /employee_work_shifts/employee-work-by-id`
- `GET /leave_allowance/leave-allowance-per-employee`
- `GET /leave_request_employee`
- `GET /leave_request_employee/:id`
- `POST /leave_request_employee`
- `PUT /leave_request_employee`
- `DELETE /leave_request_employee`
- `GET /overtimes`

### Role: `HOD` (Head of Department)

These endpoints are specifically for the `HOD` role to manage and track employees in their department:

- `POST /hod_attendances`
- `GET /hod_overtimes`
- `GET /leave_allowance/leave-allowance-per-department`
- `GET /leave_request_hod`

---

## 🛠 Technologies Used

- **Framework**: [NestJS](https://nestjs.com)
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT
- **API Docs**: Swagger