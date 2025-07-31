# API Documentation

## Base URL
```
http://127.0.0.1:8000/api/
```

## Authentication

All API endpoints require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### 1. Authentication

#### POST /api/token/
**Description**: Login and get access token

**Request Body**:
```json
{
    "username": "string",
    "password": "string"
}
```

**Response** (200):
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Error Response** (401):
```json
{
    "detail": "No active account found with the given credentials"
}
```

#### POST /api/token/refresh/
**Description**: Refresh access token

**Request Body**:
```json
{
    "refresh": "string"
}
```

**Response** (200):
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 2. Users

#### GET /api/users/
**Description**: Get all users (admin only)

**Response** (200):
```json
[
    {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "user",
        "first_name": "John",
        "last_name": "Doe"
    }
]
```

#### GET /api/users/{id}/
**Description**: Get specific user

**Response** (200):
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "first_name": "John",
    "last_name": "Doe"
}
```

#### POST /api/users/
**Description**: Create new user

**Request Body**:
```json
{
    "username": "new_user",
    "email": "new@example.com",
    "password": "secure_password",
    "role": "user",
    "first_name": "New",
    "last_name": "User"
}
```

### 3. Equipment

#### GET /api/equipment/
**Description**: Get all equipment

**Response** (200):
```json
[
    {
        "id": 1,
        "type": "pc",
        "serial_number": "PC001",
        "location": "ST Mary's High School",
        "status": "working"
    }
]
```

#### POST /api/equipment/
**Description**: Create new equipment

**Request Body**:
```json
{
    "type": "pc",
    "serial_number": "PC002",
    "location": "ST John's Primary School",
    "status": "working"
}
```

**Equipment Types**:
- `pc` - Personal Computer
- `printer` - Printer
- `projector` - Projector
- `router` - Router
- `ups` - UPS

#### PATCH /api/equipment/{id}/
**Description**: Update equipment

**Request Body**:
```json
{
    "status": "maintenance"
}
```

**Status Options**:
- `working` - Working properly
- `maintenance` - Under maintenance
- `broken` - Broken/Out of service

### 4. Tickets

#### GET /api/tickets/
**Description**: Get all tickets

**Response** (200):
```json
[
    {
        "id": 1,
        "equipment": 1,
        "issue_category": "Hardware Issue",
        "description": "Computer not turning on",
        "status": "open",
        "created_by": "john_doe",
        "assigned_to": null,
        "created_at": "2025-07-29T10:00:00Z",
        "updated_at": "2025-07-29T10:00:00Z",
        "comments": []
    }
]
```

#### POST /api/tickets/
**Description**: Create new ticket (Regular users only)

**Request Body**:
```json
{
    "equipment": 1,
    "issue_category": "Software Issue",
    "description": "Windows not loading properly",
    "status": "open"
}
```

#### PATCH /api/tickets/{id}/
**Description**: Update ticket (Technicians only)

**Request Body**:
```json
{
    "status": "in_progress",
    "assigned_to": 2
}
```

**Status Options**:
- `open` - New ticket
- `in_progress` - Being worked on
- `resolved` - Issue fixed

### 5. Comments

#### GET /api/comments/
**Description**: Get all comments

**Query Parameters**:
- `ticket` (optional): Filter by ticket ID

**Response** (200):
```json
[
    {
        "id": 1,
        "user": "john_doe",
        "ticket": 1,
        "text": "Working on this issue now",
        "timestamp": "2025-07-29T10:30:00Z"
    }
]
```

#### POST /api/comments/
**Description**: Add comment

**Request Body**:
```json
{
    "ticket": 1,
    "text": "Issue has been resolved"
}
```

### 6. Analytics

#### GET /api/analytics/equipment-failure-patterns/
**Description**: Get equipment failure patterns

**Response** (200):
```json
[
    {
        "equipment__type": "pc",
        "failure_count": 8
    },
    {
        "equipment__type": "printer",
        "failure_count": 2
    }
]
```

#### GET /api/analytics/school-issues/
**Description**: Get school-wise issue analysis

**Response** (200):
```json
[
    {
        "equipment__location": "ST Mary's High School",
        "issue_count": 7
    },
    {
        "equipment__location": "ST John's Primary School",
        "issue_count": 4
    }
]
```

#### GET /api/analytics/preventive-maintenance/
**Description**: Get AI-powered maintenance predictions

**Response** (200):
```json
[
    {
        "equipment_id": 3,
        "equipment_type": "pc",
        "location": "ST Mary's High School",
        "health_score": 45.2,
        "urgency": "medium",
        "reason": "5 issues in last 90 days",
        "recent_tickets": 5,
        "predicted_maintenance_date": "2025-09-28T10:00:00Z"
    }
]
```

### 7. Reports

#### GET /api/reports/frequent-issues/
**Description**: Get most frequent issues report

**Response** (200):
```json
[
    {
        "issue_category": "Hardware Issue",
        "count": 5,
        "percentage": 41.67
    },
    {
        "issue_category": "Software Issue",
        "count": 4,
        "percentage": 33.33
    }
]
```

#### GET /api/reports/turnaround-time/
**Description**: Get average turnaround time report

**Response** (200):
```json
{
    "average_turnaround_days": 3.5,
    "total_resolved_tickets": 8,
    "fastest_resolution": 1,
    "slowest_resolution": 7
}
```

#### GET /api/reports/equipment-status/
**Description**: Get equipment status report

**Response** (200):
```json
{
    "total_equipment": 14,
    "working": 12,
    "maintenance": 1,
    "broken": 1,
    "status_breakdown": [
        {
            "status": "working",
            "count": 12,
            "percentage": 85.71
        }
    ]
}
```

## Error Responses

### 400 Bad Request
```json
{
    "field_name": [
        "This field is required."
    ]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
    "detail": "Internal server error."
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Other endpoints**: 100 requests per minute

## Pagination

For list endpoints, pagination is supported:

**Response with pagination**:
```json
{
    "count": 100,
    "next": "http://127.0.0.1:8000/api/tickets/?page=2",
    "previous": null,
    "results": [...]
}
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10, max: 100)

## Filtering

### Tickets
- `status`: Filter by status (`open`, `in_progress`, `resolved`)
- `equipment`: Filter by equipment ID
- `created_by`: Filter by creator username
- `assigned_to`: Filter by assigned technician

### Equipment
- `type`: Filter by equipment type
- `location`: Filter by location
- `status`: Filter by status

### Comments
- `ticket`: Filter by ticket ID
- `user`: Filter by user username

**Example**:
```
GET /api/tickets/?status=open&equipment=1
```

## Sorting

Most endpoints support sorting:

**Query Parameters**:
- `ordering`: Field to sort by (prefix with `-` for descending)

**Examples**:
```
GET /api/tickets/?ordering=created_at          # Oldest first
GET /api/tickets/?ordering=-created_at         # Newest first
GET /api/equipment/?ordering=location          # By location A-Z
```

## Search

### Tickets
- `search`: Search in issue_category and description

**Example**:
```
GET /api/tickets/?search=hardware
```

## WebSocket Support

For real-time updates, WebSocket connections are available at:
```
ws://127.0.0.1:8000/ws/tickets/
```

**Events**:
- `ticket.created`: New ticket created
- `ticket.updated`: Ticket status updated
- `comment.added`: New comment added

## Testing

### Using curl

**Login**:
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

**Get tickets**:
```bash
curl -X GET http://127.0.0.1:8000/api/tickets/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Create ticket**:
```bash
curl -X POST http://127.0.0.1:8000/api/tickets/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"equipment": 1, "issue_category": "Hardware Issue", "description": "Test issue"}'
```

### Using Postman

1. Import the collection
2. Set the base URL: `http://127.0.0.1:8000/api/`
3. Get an access token using the login endpoint
4. Set the Authorization header: `Bearer YOUR_ACCESS_TOKEN`
5. Test the endpoints

## SDKs and Libraries

### Python
```python
import requests

# Login
response = requests.post('http://127.0.0.1:8000/api/token/', {
    'username': 'your_username',
    'password': 'your_password'
})
token = response.json()['access']

# Get tickets
headers = {'Authorization': f'Bearer {token}'}
tickets = requests.get('http://127.0.0.1:8000/api/tickets/', headers=headers)
```

### JavaScript
```javascript
// Login
const response = await fetch('http://127.0.0.1:8000/api/token/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'your_username',
        password: 'your_password'
    })
});
const { access } = await response.json();

// Get tickets
const tickets = await fetch('http://127.0.0.1:8000/api/tickets/', {
    headers: {
        'Authorization': `Bearer ${access}`
    }
});
```

## Changelog

### v1.2.0
- Added comments system
- Enhanced user permissions
- Fixed analytics endpoints

### v1.1.0
- Added AI analytics
- Added reports system
- Enhanced equipment management

### v1.0.0
- Initial API release
- Basic CRUD operations
- JWT authentication 