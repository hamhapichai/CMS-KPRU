# Proactive Complaint Management System with Agentic AI
## 📚 About the Project
This project aims to develop an Agentic AI-powered decision support system to enhance the efficiency and transparency of proactive complaint management at the Faculty of Science and Technology, Kamphaeng Phet Rajabhat University.

The system will automate the process of analyzing complaints, suggesting responsible departments, and managing real-time status tracking. This will lead to a faster and more transparent resolution process, improving governance within the faculty.
### ✨ Key Features
- Public Complaint Submission: A simple web form for users to submit complaints.
- Automated AI Analysis: An Agentic AI analyzes the complaint text and suggests the most suitable department.
- Role-Based Access Control: Separate dashboards for the Dean and responsible officers/committees.
- Real-time Tracking: Complainants receive a unique Ticket ID to track the status of their issue.
- Automated Notifications: Notifications via email and Line Notify to relevant parties.
### 🛠️ Technology Stack
| Component           | Technology | Description                                                                                |
|---------------------|------------|--------------------------------------------------------------------------------------------|
| Frontend            | NextJS     | The public-facing complaint submission form and the internal admin dashboard.              |
| Backend             | .NET Core  | The RESTful API that handles business logic, authentication and data management.           |
| Database            | PostgreSQL | A robust and scalable relational database for storing all system data.                     |
| Workflow Automation | n8n        | Manages automated workflows, such as sending email notifications and Line Notify messages. |
| AL/ML               | LLM        | The core Agentic AI model for analyzing and routing complaints.                            |
## 🚀 Getting Started
### Prerequisites
- [.NET SDK](https://dotnet.microsoft.com/en-us/download) (Version 8.XX)
- [Node.js](https://nodejs.org/en) (Version 18 or later)
- [Docker](https://www.docker.com/get-started/) (Recommended for running PostgreSQL and n8n)
### Installation
1. Clone the Repository:
```
git clone https://github.com/hamhapichai/CMS-KPRU.git
cd CMS-KPRU
```
2. Database Setup (using Docker):
    - Create a ```.env``` file for your database connection string and credentials.
    - Start the PostgreSQL contrainer:
    ```
    docker-compose up -d db
    ```
    - Run Entity Framework Core migration to create the database schema:
    ```
    cd backend
    dotnet ef database update
    ```
3. Backend Setup:
```
cd backend
dotnet restore
dotnet build
dotnet run
```
4. Frontend Setup:
```
cd frontend
npm install
npm run dev
```
The frontend will be running at ```http://localhost:3000``` and the backend at ```http://localhost:5000``` (or as configured)
## ✍️ Authors
- Project Lead: [Apichai Butdee](https://github.com/hamhapichai)
- Advisor: Assoc. Prof. Dr.Bhoomin Tanut
