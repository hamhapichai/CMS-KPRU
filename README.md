# 🚀 Proactive Complaint Management System with Agentic AI

<div align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet" alt=".NET 8.0"/>
  <img src="https://img.shields.io/badge/Next.js-14.0-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-20.10-2496ED?style=for-the-badge&logo=docker" alt="Docker"/>
</div>

<div align="center">
  <p><strong>An AI-powered complaint management system for enhanced governance and transparency</strong></p>
</div>

## 📚 About the Project

This project is an innovative **Agentic AI-powered decision support system** designed to revolutionize complaint management at the **Faculty of Science and Technology, Kamphaeng Phet Rajabhat University (KPRU)**.

### 🎯 Project Objectives
- **Automate** complaint analysis and department routing using AI
- **Enhance** transparency in complaint resolution processes  
- **Improve** response times and governance efficiency
- **Provide** real-time tracking for all stakeholders
- **Streamline** communication through automated notifications
## ✨ Key Features

### 🌐 Public Interface
- **📝 Complaint Submission**: User-friendly web form for public complaint submission
- **🎫 Ticket Tracking**: Unique Ticket ID system for real-time status monitoring
- **🔍 Status Updates**: Live tracking of complaint resolution progress

### 🤖 AI-Powered Analysis  
- **📊 Smart Routing**: Automated AI analysis to suggest the most appropriate department
- **📈 Pattern Recognition**: Machine learning insights for complaint categorization
- **⚡ Instant Processing**: Real-time complaint analysis and routing

### 🛡️ Administrative Dashboard
- **👑 Dean Dashboard**: Executive overview with analytics and reporting
- **👥 Department Management**: Role-based access for officers and committees
- **📋 Task Management**: Assignment and tracking of complaint resolutions

### 🔔 Automated Communications
- **📧 Email Notifications**: Automated email updates to stakeholders
- **💬 Line Notify Integration**: Real-time notifications via Line messaging
- **📱 Multi-channel Alerts**: Comprehensive notification system
## 🛠️ Technology Stack

<div align="center">

| Layer | Technology | Version | Description |
|-------|------------|---------|-------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs) | 14.0+ | Modern React framework for public forms and admin dashboards |
| **Backend** | ![.NET Core](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet) | 8.0+ | High-performance RESTful API with authentication & business logic |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql) | 15.0+ | Robust relational database with advanced querying capabilities |
| **Automation** | ![n8n](https://img.shields.io/badge/n8n-Latest-FF6D5A?logo=n8n) | Latest | Visual workflow automation for notifications and integrations |
| **AI/ML** | ![OpenAI](https://img.shields.io/badge/LLM-GPT--4-412991?logo=openai) | GPT-4 | Large Language Model for intelligent complaint analysis |
| **Infrastructure** | ![Docker](https://img.shields.io/badge/Docker-20.10+-2496ED?logo=docker) | 20.10+ | Containerization for consistent deployment environments |

</div>

### 🏗️ Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (.NET Core)   │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   n8n Workflow │    │   AI/ML Layer   │    │   File Storage  │
│   (Automation)  │    │   (LLM Model)   │    │   (uploads/)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```
## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- **[.NET SDK](https://dotnet.microsoft.com/en-us/download)** (Version 8.0 or later)
- **[Node.js](https://nodejs.org/en)** (Version 18 LTS or later) + npm
- **[Docker Desktop](https://www.docker.com/get-started/)** (Recommended for PostgreSQL and n8n)
- **[Git](https://git-scm.com/)** (Version control)
- **[Visual Studio Code](https://code.visualstudio.com/)** (Recommended IDE)

### ⚡ Quick Start

1. **📥 Clone the Repository**
   ```bash
   git clone https://github.com/hamhapichai/CMS-KPRU.git
   cd CMS-KPRU
   ```

2. **🐳 Database Setup (Docker)**
   ```bash
   # Create environment file
   cp .env.example .env
   
   # Start PostgreSQL container
   docker-compose up -d db
   
   # Apply database migrations
   cd Backend
   dotnet ef database update
   cd ..
   ```

3. **🔧 Backend Setup**
   ```bash
   cd Backend
   dotnet restore
   dotnet build
   dotnet run --launch-profile https
   ```
   ✅ Backend will be available at: `https://localhost:5001`

4. **🎨 Frontend Setup**
   ```bash
   cd Frontend/cms-kpru
   npm install
   npm run dev
   ```
   ✅ Frontend will be available at: `http://localhost:3000`

5. **🔄 n8n Workflow (Optional)**
   ```bash
   docker-compose up -d n8n
   ```
   ✅ n8n will be available at: `http://localhost:5678`

### 🌟 Development Commands

| Command | Description | Location |
|---------|-------------|----------|
| `dotnet watch run` | Start backend with hot reload | `/Backend` |
| `npm run dev` | Start frontend development server | `/Frontend/cms-kpru` |
| `dotnet ef migrations add <name>` | Create new database migration | `/Backend` |
| `docker-compose up -d` | Start all services | Root |
| `docker-compose logs -f` | View service logs | Root |
## 📁 Project Structure

```
CMS-KPRU/
├── 📂 Backend/                 # .NET Core Web API
│   ├── Controllers/           # API controllers
│   ├── Models/               # Entity models
│   ├── Services/             # Business logic services  
│   ├── Repositories/         # Data access layer
│   ├── DTOs/                 # Data transfer objects
│   ├── Migrations/           # EF Core migrations
│   └── uploads/              # File storage
├── 📂 Frontend/               # Next.js Application
│   └── cms-kpru/             # Main frontend app
├── 📂 n8n/                   # Workflow automation
│   └── complaint-ai-workflow.json
├── 🐳 docker-compose.yml      # Container orchestration
├── 📄 README.md              # Project documentation
└── 🔧 CMS-KPRU.sln          # Visual Studio solution
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Complaints Management
- `GET /api/complaints` - List all complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints/{id}` - Get complaint details
- `PUT /api/complaints/{id}` - Update complaint status
- `DELETE /api/complaints/{id}` - Delete complaint

### AI Suggestions
- `POST /api/ai-suggestions` - Get AI department suggestions
- `GET /api/ai-suggestions/{id}` - Get suggestion details

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **💾 Commit your changes** (`git commit -m 'Add amazing feature'`)  
4. **📤 Push to the branch** (`git push origin feature/amazing-feature`)
5. **🔄 Open a Pull Request**

### 📝 Coding Standards
- Follow **C# coding conventions** for backend
- Use **ESLint** and **Prettier** for frontend
- Write **unit tests** for new features
- Update **documentation** as needed

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check if PostgreSQL is running
docker ps

# Reset database
docker-compose down
docker-compose up -d db
dotnet ef database update
```

**Frontend Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Backend API Not Starting**
```bash
# Check port availability
netstat -tulpn | grep :5001

# Restore packages
dotnet clean
dotnet restore
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **Faculty of Science and Technology, KPRU** for project support
- **Open source community** for amazing tools and libraries
- **Contributors** who help improve this project

---

<div align="center">
  <p>Made with ❤️ by the KPRU Development Team</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>

## ✍️ Authors

- **Project Lead**: [Apichai Butdee](https://github.com/hamhapichai) - *Full Stack Development*
- **Project Advisor**: Assoc. Prof. Dr. Bhoomin Tanut - *Academic Supervision*

---

<div align="center">
  <a href="#top">🔝 Back to Top</a>
</div>
