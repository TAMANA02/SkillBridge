# SkillBridge

### Student–Client Skill & Project Collaboration Platform

**Connect Skills. Create Opportunities. Build Together.**

SkillBridge connects students, clients, and collaborators to work on real-world projects, showcase technical skills, and turn learning into practical opportunities.

## 📁 Repository Structure

```text
SkillBridge/
│
├── frontend/          # React + Vite application
│
├── backend/           # Django REST Framework API
│
├── README.md
└── .gitignore
```

## 🖥️ Frontend — React + Vite

The frontend was migrated from the original static HTML/CSS/JavaScript SkillBridge website to a modern React application.

### Features

- Voice navigation using Web Speech API and React Router
- Multi-step student registration (8 steps)
- Multi-step client registration (4 steps)
- Project showcase with search, filters, and detail panel
- Hall of Fame leaderboard
- Smart developer search and invite-to-project modal
- Student and client dashboards
- Jobs, projects, and project management
- Public student profiles with hire, chat, resume download, and sharing functionality

### Technology Stack

- React.js
- Vite
- JavaScript
- React Router
- Axios
- Framer Motion
- CSS

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` using `.env.example` and configure:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the development server:

```bash
npm run dev
```

**Note:** The frontend currently supports a simulated local authentication session. Real JWT authentication integration with the Django backend needs to be enabled and tested.

## ⚙️ Backend — Django REST Framework

The backend provides the API layer for the SkillBridge application.

**Technology Stack:**
- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the server:

```bash
python manage.py runserver
```

Configure the backend environment variables and database credentials according to the backend configuration.

## 🎯 Project Vision

To build an ecosystem where students can transform their skills into opportunities, collaborate with clients, gain practical experience, and develop solutions to real-world problems.

## 👩‍💻 Contributors

SkillBridge Development Team

## 📄 License

To be determined.
