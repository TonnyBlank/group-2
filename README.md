# School ICT Lab Support Platform

A comprehensive full-stack web application for managing ICT equipment, support tickets, and analytics in educational institutions.

## 🚀 Features

### Core Functionality
- **User Management**: Role-based access (Users & Technicians)
- **Equipment Management**: Track ICT equipment across schools
- **Ticket System**: Create and manage support tickets
- **Comments System**: Real-time communication on tickets
- **Analytics Dashboard**: AI-powered insights and predictions
- **Reports**: Comprehensive reporting system

### User Roles
- **Regular Users**: Can create tickets and add comments
- **Technicians**: Can manage tickets, update status, and add comments

## 🛠️ Technology Stack

### Backend
- **Django 5.2.4**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database
- **Django CORS Headers**: Cross-origin resource sharing
- **JWT Authentication**: Secure token-based authentication

### Frontend
- **React.js**: User interface
- **Bootstrap**: Styling and responsive design
- **Axios**: HTTP client for API calls

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "group 2"
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install djangorestframework-simplejwt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000/`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000/`

## 📚 API Documentation

### Authentication

#### Login
```
POST /api/token/
Content-Type: application/json

{
    "username": "your_username",
    "password": "your_password"
}
```

Response:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Refresh Token
```
POST /api/token/refresh/
Content-Type: application/json

{
    "refresh": "your_refresh_token"
}
```

### Equipment Management

#### Get All Equipment
```
GET /api/equipment/
Authorization: Bearer <access_token>
```

#### Create Equipment
```
POST /api/equipment/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "type": "pc",
    "serial_number": "PC001",
    "location": "ST Mary's High School",
    "status": "working"
}
```

#### Update Equipment
```
PATCH /api/equipment/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "status": "maintenance"
}
```

### Ticket Management

#### Get All Tickets
```
GET /api/tickets/
Authorization: Bearer <access_token>
```

#### Create Ticket (Regular Users Only)
```
POST /api/tickets/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "equipment": 1,
    "issue_category": "Hardware Issue",
    "description": "Computer not turning on",
    "status": "open"
}
```

#### Update Ticket Status (Technicians Only)
```
PATCH /api/tickets/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "status": "in_progress"
}
```

### Comments

#### Get Comments for Ticket
```
GET /api/comments/?ticket={ticket_id}
Authorization: Bearer <access_token>
```

#### Add Comment
```
POST /api/comments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "ticket": 1,
    "text": "Working on this issue now"
}
```

### Analytics

#### Equipment Failure Patterns
```
GET /api/analytics/equipment-failure-patterns/
Authorization: Bearer <access_token>
```

#### School Issues Analytics
```
GET /api/analytics/school-issues/
Authorization: Bearer <access_token>
```

#### Preventive Maintenance Predictions
```
GET /api/analytics/preventive-maintenance/
Authorization: Bearer <access_token>
```

### Reports

#### Most Frequent Issues
```
GET /api/reports/frequent-issues/
Authorization: Bearer <access_token>
```

#### Average Turnaround Time
```
GET /api/reports/turnaround-time/
Authorization: Bearer <access_token>
```

#### Equipment Status Report
```
GET /api/reports/equipment-status/
Authorization: Bearer <access_token>
```

## 🏗️ Project Structure

```
group 2/
├── backend/
│   ├── analytics/           # AI-powered analytics
│   ├── equipment/          # Equipment management
│   ├── tickets/            # Ticket system
│   ├── users/              # User management
│   ├── silsp/              # Django project settings
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Analytics.js    # Analytics dashboard
│   │   ├── App.js          # Main application
│   │   ├── EquipmentList.js # Equipment management
│   │   ├── Login.js        # Authentication
│   │   ├── Register.js     # User registration
│   │   ├── Reports.js      # Reports dashboard
│   │   ├── TicketForm.js   # Ticket creation
│   │   ├── TicketList.js   # Ticket management
│   │   └── api.js          # API configuration
│   └── package.json
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for users and technicians
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs

## 📊 Business Logic

### User Permissions
- **Regular Users**:
  - Create tickets
  - View all tickets
  - Add comments to any ticket
  - View analytics and reports

- **Technicians**:
  - View all tickets
  - Update ticket status
  - Add comments to any ticket
  - View analytics and reports
  - Cannot create new tickets

### Ticket Workflow
1. **Open**: Ticket created by user
2. **In Progress**: Technician starts working
3. **Resolved**: Issue fixed and ticket closed

## 🤖 AI Analytics Features

### Equipment Health Scoring
- Calculates health scores (0-100) based on:
  - Number of recent issues
  - Resolution rate
  - Time since last issue

### Preventive Maintenance Predictions
- Identifies equipment needing maintenance based on:
  - Health scores below 30 (high urgency)
  - 3+ issues in 90 days (medium urgency)
  - Health scores below 60 (low urgency)

### Issue Pattern Analysis
- Equipment type failure patterns
- Location-based issue analysis
- Monthly trend analysis

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
```bash
DEBUG=False
SECRET_KEY=your_production_secret_key
ALLOWED_HOSTS=your_domain.com
```

2. **Database**
```bash
# Use PostgreSQL for production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. **Static Files**
```bash
python manage.py collectstatic
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `django-cors-headers` is installed
   - Check CORS settings in `settings.py`

2. **Authentication Errors**
   - Verify JWT tokens are valid
   - Check user permissions

3. **Database Issues**
   - Run migrations: `python manage.py migrate`
   - Check database connection

4. **Frontend Build Issues**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for missing dependencies

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added AI analytics and reports
- **v1.2.0**: Enhanced user permissions and comments system

---

**Developed by Group 2** 🚀 