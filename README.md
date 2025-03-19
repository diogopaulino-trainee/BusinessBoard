# Business Board

## About the Project

The **Business Board** is a web application for business management, allowing the creation, movement, and tracking of opportunities in different states. The application uses a **Drag & Drop** system to organize businesses into columns, making visualization and management more intuitive.

---

## Technologies Used

The project was developed using the following technologies:

### **Frontend**
- **React** - Library for building dynamic interfaces.
- **Tailwind CSS** - Framework for fast and responsive styling.
- **ShadCN UI** - Modern and accessible UI components.
- **dnd-kit** - Library for drag-and-drop functionality.

### **Backend**
- **Laravel 12** - PHP framework for a robust and scalable API.
- **Sanctum** - Simple and secure API authentication.
- **MySQL** - Relational database for information storage.

### **Testing**
- **PHPUnit** - Testing framework to ensure stability and reliability.

---

## Project Structure

The project follows a modular organization to facilitate maintenance and scalability.

```
BUSINESSBOARD
│── app
│   ├── Http
│   │   ├── Controllers
│   │   │   ├── Auth
│   │   │   ├── BusinessController.php
│   │   │   ├── BusinessTypeController.php
│   │   │   ├── StateController.php
│   │   │   ├── UserController.php
│   │   ├── Middleware
│   │   ├── Requests
│   ├── Mail
│   │   ├── WelcomeMail.php
│   ├── Models
│   │   ├── Business.php
│   │   ├── BusinessType.php
│   │   ├── State.php
│   │   ├── User.php
│   ├── Providers
│── bootstrap
│── config
│── database
│   ├── factories
│   │   ├── BusinessFactory.php
│   │   ├── BusinessTypeFactory.php
│   │   ├── StateFactory.php
│   │   ├── UserFactory.php
│   ├── migrations
│   ├── seeders
│   │   ├── BusinessSeeder.php
│   │   ├── BusinessTypeSeeder.php
│   │   ├── DatabaseSeeder.php
│   │   ├── StateSeeder.php
│   │   ├── UserSeeder.php
│── node_modules
│── public
│── resources
│   ├── css
│   │   ├── app.css
│   ├── js
│   │   ├── Components
│   │   │   ├── ui
│   │   │   │   ├── ApplicationLogo.jsx
│   │   │   │   ├── BusinessCard.jsx
│   │   │   │   ├── CreateStateForm.jsx
│   │   │   │   ├── CreateUserForm.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── FilterByBusinessType.jsx
│   │   │   │   ├── Modal.jsx
│   │   ├── Layouts
│   │   ├── Pages
│   │   │   ├── BusinessBoard.jsx
│   │   ├── services
│   │   ├── app.jsx
│── routes
│── storage
│── tests
│── vendor
│── .env
│── .gitignore
│── README.md
│── tailwind.config.js
│── vite.config.js

---

## API Endpoints

The application provides a REST API for data manipulation, allowing integration with other platforms.

### **Businesses**
- `GET /api/businesses` - List all businesses.
- `POST /api/businesses` - Create a new business.
- `PUT /api/businesses/{business}` - Update an existing business.
- `DELETE /api/businesses/{business}` - Remove a business.

### **States**
- `GET /api/states` - List all states (columns).
- `POST /api/states` - Create a new state.
- `PUT /api/states/{state}` - Update a state.
- `DELETE /api/states/{state}` - Remove a state (if no businesses are assigned).

### **Business Types**
- `GET /api/business-types` - List available business types.

### **Users**
- `GET /api/users` - List all users.
- `POST /api/users` - Create a new user.

---

## Installation & Setup

### **Prerequisites**
Before starting, make sure you have installed:
- **PHP 8.2+**
- **Composer**
- **Node.js + npm**
- **MySQL**

### **Step-by-Step Guide**
1. Clone the repository:
   ```bash
   git clone https://github.com/diogopaulino-trainee/BusinessBoard.git
   cd BusinessBoard
   ```
2. Install backend dependencies:
   ```bash
   composer install
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Configure the environment:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with database credentials.

5. Generate the application key:
   ```bash
   php artisan key:generate
   ```
6. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
7. Start the Laravel server:
   ```bash
   php artisan serve
   ```
8. Start the frontend server:
   ```bash
   npm run dev
   ```

Now, the application will be available at `http://businessboard.test`.

---

## Testing

To ensure code quality, automated tests have been implemented with **PHPUnit**.

To run the tests:
```bash
php artisan test
```

---

### Contact
If you have any questions or suggestions, feel free to contact via [LinkedIn](https://www.linkedin.com/in/diogo-paulino/), [Personal GitHub](https://github.com/diogopaulin0) or [InovCorp GitHub](https://github.com/diogopaulino-trainee).

---