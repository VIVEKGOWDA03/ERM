# ERM
# Engineering Resource Management System

### Overview
A full-stack application designed to streamline the management of engineering team assignments across various projects. This system enables tracking of individual capacity, current workload, and future availability, offering comprehensive insights for managers and clear overviews for engineers.

### Core Features
* **Authentication & User Roles:** Secure login system with distinct roles for Managers and Engineers.
* **Engineer Management:** Detailed profiles including name, skills (e.g., React, Node.js, Python), seniority level, employment type (Full-time/Part-time), and real-time available capacity.
* **Project Management:** Comprehensive project information covering name, description, start/end dates, required team size, necessary skills, and project status (Active, Planning, Completed).
* **Assignment System:** Intuitive interface for assigning engineers to projects with specified allocation percentages, alongside a view of all current assignments.
* **Dashboard Views:** Dedicated dashboards for Managers (team overview, utilization insights) and Engineers (personal project assignments and upcoming workload).
* **Search & Analytics:** Robust filtering capabilities for engineers by skills and projects by status, complemented by charts visualizing team utilization and project completion.

### Technical Stack
* **Frontend:** React, Material-UI, Tailwind CSS, React Hook Form, Zod, React-Redux (Redux Toolkit), Recharts (for data visualization).
* **Backend:** Node.js (Express.js), MongoDB (Mongoose), JWT for Authentication.

---

### AI-Powered Development Approach
This project heavily leveraged AI development tools to accelerate implementation, debugging, and architectural decision-making while maintaining a strong focus on code quality and comprehension.

* **AI Tools Used:**
    * **AI IDEs:** [Mention specific IDEs like Cursor, Windsurf if used, and how they assisted, e.g., for intelligent code completion and boilerplate generation.]
    * **AI Assistants:** Claude, ChatGPT, GitHub Copilot.
* **Acceleration Examples:**
    * **Redux Store Modularization:** AI guided the refactoring of the Redux state, assisting in the separation of `ProjectSlice`, `AssignmentSlice`, and streamlining the `data` slice, which significantly sped up the state management overhaul.
    * **Form Development:** AI assisted in rapidly scaffolding complex forms (e.g., project creation, assignment) by generating initial Material-UI component structures integrated seamlessly with `react-hook-form` and `Zod` validation schemas.
    * **Charting Integration:** AI provided initial `recharts` configurations and data transformations for the `ManagerAnalytics` component, allowing for quick visualization of project statuses and engineer utilization.
* **Challenges and Resolutions:**
    * **Inconsistent UI Libraries:** Occasionally, AI suggestions would mix Material-UI and other UI framework components. This was resolved by explicitly defining the preferred library (Material-UI) in prompts and performing manual adjustments for consistency.
    * **Backend Data Population Discrepancies:** Frontend components sometimes expected fully populated nested objects (e.g., `engineerId.name` within an assignment) before the backend's Mongoose `populate` calls were correctly configured. This was addressed by debugging backend queries and instructing the AI to ensure proper population.
    * **Redux Selector Misalignments:** After modularizing the Redux store, some AI-generated frontend code occasionally referenced outdated state paths (e.g., `state.data.projects` instead of `state.projects.projects`). Careful code review and explicit correction of `useSelector` hooks were necessary.
* **Validation Approach:** Every piece of AI-generated code was thoroughly reviewed for correctness, adherence to project coding standards, and potential edge cases. Manual testing and cross-referencing with official documentation were critical steps to validate functionality and ensure deep understanding of the implemented solutions.

---

### Setup and Installation

Follow these steps to get the project running on your local machine.

1.  **Prerequisites:**
    * Node.js (LTS version recommended)
    * MongoDB instance (local or cloud-hosted, e.g., MongoDB Atlas). Ensure your MongoDB URI is correctly configured.

2.  **Clone the Repository:**
    ```bash
    git clone [YOUR_GITHUB_REPO_URL_HERE]
    cd engineering-resource-management # Or your project's root folder name
    ```

3.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create a .env file in the 'backend' directory with your database connection string and JWT secret:
    # MONGO_URI='your_mongodb_connection_string'
    # JWT_SECRET_KEY='a_strong_secret_key_for_jwt_signing'
    npm start # Starts the backend server
    ```

4.  **Frontend Setup:**
    ```bash
    cd ../frontend # Navigate back to root and then into frontend
    npm install
    # Create a .env file in the 'frontend' directory for the API base URL:
    # VITE_API_BASE_URL='http://localhost:5000/api' # Adjust port if your backend runs on a different one
    npm run dev # Starts the frontend development server
    ```

5.  **Database Seeding (Optional, but Recommended for Sample Data):**
    After ensuring both frontend and backend `node_modules` are installed and your MongoDB URI is configured in `backend/.env`, you can populate your database with sample data.
    ```bash
    cd backend # Ensure you are in the backend directory
    node seed.js # This script will clear existing data and add sample users, projects, and assignments.
    ```
    *Note: The seeding script will drop existing `users`, `projects`, and `assignments` collections. Use with caution on a populated database.*

---

### API Endpoints (Key Examples)
* `POST /api/auth/login` - User login
* `POST /api/auth/register` - User registration
* `GET /api/auth/user` - Get authenticated user's profile
* `GET /api/engineers` - Get all engineers (Manager)
* `GET /api/engineers/:id` - Get single engineer profile (Manager/Engineer's own)
* `GET /api/projects` - Get all projects (Manager)
* `POST /api/projects` - Create a new project (Manager)
* `PUT /api/projects/:id` - Update a project (Manager)
* `DELETE /api/projects/:id` - Delete a project (Manager)
* `GET /api/assignments` - Get all assignments (Manager)
* `POST /api/assignments` - Create a new assignment (Manager)
* `GET /api/assignments/my/:engineerId` - Get assignments for a specific engineer

---

### Sample Data
Here are some sample credentials to test the application after seeding:

* **Manager Account:**
    * **Email:** `alice.j@example.com`
    * **Password:** `password123`
* **Engineer Accounts:**
    * **Email:** `bob.s@example.com`
    * **Password:** `password123`
    * **Email:** `carol.w@example.com`
    * **Password:** `password123`
    

---

### Future Enhancements
* Implementing full CRUD operations for assignments (Edit, Delete).
* Developing a visual timeline view for engineer assignments.
* Adding a "Skill Gap Analysis" feature to identify missing skills in the team.
* Advanced reporting and analytics dashboards.

---

### Success Metrics
The system is designed to:
* ✅ Accurately calculate and display engineer capacity.
* ✅ Allow managers to easily assign people to projects.
* ✅ Show a clear overview of team workload.
* ✅ Handle basic CRUD operations smoothly.
* ✅ Provide an intuitive UI that non-technical managers can use.

---

This `README` should cover all the necessary information for your project, including the specific details about your AI development approach and the steps to fix the `node_modules` issue.

Do you have any other questions or need further adjustments to the `README` or other parts of the project?


<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
</svg>
