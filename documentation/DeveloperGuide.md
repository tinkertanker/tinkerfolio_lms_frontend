# Tinkerfolio Developer's Guide

# Introduction

Tinkerfolio is a Learning Management System (LMS) develoepd by Tinkertanker, aiming to streamline the submission of coursework, and provide students a personalised and portfolio-based approach to their learning. 

In this developer guide, we present the design criteria and implementation details of Tinkerfolio. By following this guide, you'll gain a comprehensive understanding of the underlying technologies, the architecture, and the best practices employed in the development of Tinkerfolio.

Tinkerfolio utilises the following tech stack. 

- Next.js and React (Frontend): Tinkerfolio's frontend is powered by Next.js, a versatile and performant framework built on top of React. This combination ensures a seamless and interactive user experience.

- Django (Backend): Django enables the efficient handling of user accounts, portfolio tracking, and data management. 

- PostgreSQL (Database): Tinkerfolio relies on the power and reliability of PostgreSQL, a mature and open-source relational database management system. This comes in the form of an addon as Heroku PostgreSQL. 

- Heroku (Hosting):
The deployment of Tinkerfolio is made effortless with Heroku, a cloud platform that allows seamless application hosting and scaling. 

- Dockerization: Tinkerfolio is dockerized, providing an easy and consistent deployment process. 

<kbd><img src="https://hackmd.io/_uploads/B11kOwP92.jpg"></kbd>

# Setting Up
Ensure that you have the required software and tools (e.g., Python, Node.js, Git, Heroku CLI).

Clone the following repositories. 

- `git clone https://github.com/tinkertanker/tinkerfolio_lms_backend.git`
- `git clone https://github.com/tinkertanker/tinkerfolio_lms_frontend.git`

To run the application locally: 
- In the frontend repository, run `yarn` and then `yarn dev`. The app should be running at `localhost:3000`. 
- Include the following lines in `.env.local`. 

```
NEXT_PUBLIC_BACKEND_HTTP_BASE=http://127.0.0.1:8000/
NEXT_PUBLIC_BACKEND_WS_BASE=ws://127.0.0.1:8000/
NEXT_PUBLIC_ALLOWED_HTS=<heroku-app-url>,localhost,127.0.0.1

```
- In the backend repository, run `pip install -r requirements.txt` to install the required dependencies. 
- Then, run `python3 manage.py runserver`. You can view the backend databases at `localhost:8000/admin`, with a superuser account (can be created using `python3 manage.py createsuperuser`)

- After making changes, push to Heroku remote branch using `git push heroku main:main` to see the changes take effect on the deployed app. (If you would like to push a certain branch-a to Heroku, you can do so with `git push heroku branch-a:main`)

## Development Workflow

### Database Migration
In the event, there is a need to update and migrate the database, perform the following steps. 


### Using Docker
There is also the choice to deploy it with Docker. 

1. To Dockerize, first ensure that you have [Docker installed in your host machine](https://www.docker.com/products/docker-desktop/), and that it is running. 
2. Next, set up an `env.docker` file - you can use the `env.docker.sample` and insert the corresponding values there.
3. Navigate to the folder in a terminal, then execute the following commands:
    ```
    docker compose up

    # after it comes up, and in a separate window
    docker ps

    # look for the CONTAINER ID that corresponds to lms_backend-django

    # suppose the CONTAINER ID is e1e3075d13f7
    docker exec -it e1e3075d13f7 sh

    # and when you're in, run the django migrations
    python manage.py migrate

    # also create a user so you can login to echoclass
    python manage.py createsuperuser
    ```
    If changes are made to the `models.py` files, remember do run the command `python manage.py makemigrations`. 

4. In all subsequent runs, just run the command `docker compose up`



# Design

## Architecture Design

## Overview of Components - Frontend
### 1. Next.js Pages

The frontend consists of various Next.js pages that represent different views and routes of the application. These pages include the dashboard, course details, submission tracker, user profile, and more. It is divided into student and teacher directories which represent the pages they see. 


### 2. React Components


Next.js leverages React components extensively to build reusable UI elements. These components may include navigation bars, course cards, modals, forms, and other interactive elements that compose the user interface.

### 3. State Management

The frontend uses React's state management to handle dynamic data and UI interactions. Components utilise `useState` and `useEffect` to manage application state. 

### 4. Routing

 `<Link>` components and `router.push` are used to provide client-side routing. 
 
 ### 5. Styling 
 
 Styling is achieved through Tailwind CSS.It helps in maintaining a consistent and appealing visual design is crucial for a smooth user experience.
 
 ### 6. API Integration

The frontend communicates with the backend through RESTful APIs. The externali library Axios is used to make API requests and handle responses. The backend URL is added in `.env.local`.

## Structure - Backend
The backend repository is divided in the following structure: The main component of Tinkerfolio can be broken down into **four** parts: `accounts`, `core`, `student_core` and `backend`.

1. `accounts`: Relates to the storage of created accounts, and contains the schema for how users are stored and retrieved in the database. 
2. `core`: Relates to how teachers are able to access and use classrooms. Contains the schema for classrooms and classroom-related items, such as Tasks, Submissions, Announcements and Resources
3. `student_core`: Relates to how students can use classrooms and view their portfolio, containing their submissions. Contains the schema for tracking which students are enrolled in which classes, and whether they are enrolled in groups.


5. `backend`: Deals with the logic of ensuring the application works, such as by setting up the URL patterns and environment variables.



## Overview of Components - Backend
### 1. Django Models

The backend employs Django's ORM (Object-Relational Mapping) to define and manage database models. These models represent entities like users, courses, submissions, and more, and their relationships.

The key tables are further elaborated under Implementation: Models. 


### 2. Views and Serializers

Django views handle incoming API requests and interact with the database using serializers to convert data between Python objects and JSON format. APIs are defined using Django's REST framework and follow best practices for CRUD (Create, Read, Update, Delete) operations. These CRUD methods can be found in `views.py`

The key methods are further elaborated under Implementation: Views. 


### 3. Authentication and Authorization
Tinkerfolio employs Django's built-in authentication system to manage user logins, registrations, and user sessions which uses JWT token authentication. This Django app consists of 3 auth-related endpoints:

1. `token/` - Takes in username and password. If valid, an access and refresh token is sent to client.
2. `token/refresh/` - Takes in refresh token. If valid, a new access token is created and sent to client.
3. `token/verify/` - Takes in access token. If valid, a 200 status code will be sent to client.

### 4. Storage

Tinkerfolio stores data in a PostgreSQL database, ensuring data integrity and reliability. Django's ORM simplifies database interactions and migrations.

Static files are stored using AWS S3. Refer to the project's secrets to view the private keys. 

Information is stored in tables. 

1. `.\accounts\models.py` stores the `User` table
2. `.\cores\models.py` stores `Classroom`, `Task`, `SubmissionStatus`, `Submission`, `Announcement`, `ResourceSection`, and `Resource` tables
3. `.\sudent_core\models.py` stores `Enroll` and `StudentGroup` tables

The Entity Relationship Diagram (ERD) can be seen in the [LMS_Backend repo](https://github.com/tinkertanker/LMS_Backend), under `.\docs\ERD\erd.png`, or viewed [here](https://www.comp.nus.edu.sg/~cs2102/Tools/ERD/) by pasting the contents of `.\docs\ERD\ERD.txt` into ERD viewer.

The token authentication logic is integrated in the frontend in the following files, `_app.js`, `PrivateRoute.js` and `Auth.Context.js`.

### 5. Heroku Integration 
The backend is integrated with Heroku for hosting and deployment. Heroku's platform allows for seamless scaling and management of the application in the cloud. Redis and PostgreSQL addson are being added. 

# Implementation
This section  provides a comprehensive explanation of our implementation, regarding the authentication, models and views (methods) in Tinkerfolio.

## 1. Authentication
### `Accounts`

This section relates to user account management, particularly when users attempt to create an account or login to their account.

#### `TeacherSignUp#create` and `StudentSignUp#create`

These functions deal with the registration for Both functions work the same way, apart from the `user_type`, as students are set to `1` and teachers are set to `2`.

> :warning: A passcode is required to register as a teacher. This is to prevent misuse where non-instructors register an instructor account. This passcode can be resetted in the secret field in the Heroku backend. 

First, the input is checked to determine whether the data contains a duplicated username or email. 

If it does, a 400 Bad Request is returned and the function does not proceed.

Next, a new `User` object is created, storing the username, user type, email and name of the user. The password is also set using the `set_password` function, ensuring that the password is salted and hashed. 

The data is then saved to the `User` table, and a response is returned.

#### `CustomTokenObtainPairView#post`

This class is an extension of the TokenObtainPairView, which is used to obtain a pair of tokens (access token and refresh token) when a user provides valid credentials (username and password). 

The custom implementation modifies the behavior to include an additional check for the userType provided in the request data. If the user type provided in the request doesn't match the user type associated with the retrieved user from the serializer, an AuthenticationFailed exception is raised, indicating that the user type is invalid. 

Otherwise, the view returns a response containing the access token, refresh token, and the user's type.

#### `CustomTokenRefreshView#post`

This class is an extension of the TokenRefreshView, which is used to refresh an access token using a valid refresh token. 

#### `CustomTokenVerifyView`

This class is an extension of the TokenVerifyView, which is used to verify the validity of an access token. 


## 2. Models
Models are split based on their purpose, into three categories: `accounts`, which stores information about teacher and student accounts; `core`, which stores information about classrooms, including tasks, announcements and resources; and `student_core`, which stores information about which students are enrolled in which classrooms.

To view more details, look at the `models.py` of the respective folder. 

Unless otherwise stated, the models inherit from Django's [Model class](https://docs.djangoproject.com/en/4.2/topics/db/models/).

### `accounts`

This comprises of only one table: `User`.

The `User` table inherits from [Django's `user` model](https://docs.djangoproject.com/en/4.2/ref/contrib/auth/#django.contrib.auth.models.User). 

There is one additional attribute other than the default attributes provided by the model: `user_type`. It takes one of two values, `1` for student, `2` for teacher.

### `core`

This comprises of many tables: `Classroom`, `Task`, `SubmissionStatus`, `GroupSubmission`, `Submission`, `Announcement`, `ResourceSection`, `Resource`.

#### `Classroom`

This table stores information about classrooms created, and contains the following attributes:
1. `teacher`, which references the `User` model.
2. `name`, the name of the classroom.
3. `code`, a 6 digit code, made of hexadecimal digits.
4. `student_indexes`, a JSON-encoded list that stores the IDs of students who have joined the classroom.
5. `status`, takes one of two values: `1` for Active, and `2` for Archived. 
6. `created_at`, the date and time that the classroom was created

#### `Task`

This table stores information about tasks set by teachers, and has the following attributes:
1. `classroom`, which references the `Classroom` model.
2. `name`, the name of the task.
3. `description`, the description of the task.
4. `status`, which takes the value of `1` for in progress, or `2` for completed.
5. `display`, which takes the value of `1` for published, or `2` for draft.
6. `max_stars`, the maximum number of stars the task will have.
7. `created_at`, the date and time the task was created.
8. `updated_at`, the date and time the task was updated.
9. `published_at`, the date and time the task was published.
10. `is_group`, a boolean that determines whether a task is a group or individual submission.

#### `SubmissionStatus`

This table stores information about students' submissions. It stores:
1. `task`, which references the `Task` model.
2. `student`, which references the `User` model.
3. `status`, which allows students to show their progress, which takes one of the following values: `1` for not started, `2` for working on it, `3` for stuck.

#### `GroupSubmission`

This table stores information about group submissions. It stores:
1. `id`, the ID of the submission.
2. `group_name`, the name of the group.
3. `submitting_student`, which references the `User` model.
4. `associated_students`, which references the `User` model.
5. `task`, which references the `Task` model.

#### `Submission`

This table stores information about student submissions. It stores:

1. `task`, which references the `Task` model.
2. `student`, which references the `User` model.
3. `image`, the image submitted, which must be one of the following formats: `.png`, `.jpg`, `.jpeg`.
4. `text`, the text submitted.
5. `stars`, given by the teacher after grading the assignment.
6. `comments`, given by the teacher after grading the assignment.
7. `created_at`, the date and time the task was submitted.
8. `resubmitted_at`, the date and time the task was resubmitted.

#### `Announcement`

This table stores data about announcements made by teachers. It contains the following attributes:
1. `classroom`, which references the `Classroom` model.
2. `created_at`, which stores when the announcement was made.
3. `updated_at`, which stores when the announcement was updated.
4. `name`, the name of the announcement.
5. `description`, the description of the announcement.

#### `ResourceSection`

This table stores data about resource posts made to the classroom, and contains the following attributes:
1. `classroom`, which references the `Classroom` model.
2. `created_at`, the date and time the resource post was created.
3. `updated_at`, the date and time the resource was updated.
4. `name`, the name of the resource

#### `Resource`

This table stores data about specific resources, and contains the following attributes:
1. `section`, which references the `ResourceSection`
2. `created_at`, the date and time the resource post was created.
3. `updated_at`, the date and time the resource was updated.
4. `name`, the name of the file.
5. `file`, the uploaded file, which can take any format. 

### `student_core`

This comprises of only one table: `Enroll`.

As mentioned, `Enroll` stores data about student accounts and what classrooms they are involved in. It stores:
1. `student_user_id`, which references the `User` model.
2. `classroom`, which references the `Classroom` model.
3. `studentIndex`, the index number of the student in the specific classroom.
4. `score`, which stores the number of stores the specific student has obtained in the specific classroom.

## 3. Views

### A. `Core`

This section explains methods relating to teacher accounts when managing their classroom.

#### `ClassroomViewSet`

##### `list`

This allows all classrooms belonging to the teacher account to be listed on the `/teacher` page.

First, a queryset is created, filtering the `Classroom` objects based on the teacher. All objects in the queryset are then returned.

##### `retrieve`

This function allows teacher account to access a specific classroom they own, based on the unique code assigned.

First, the user is verified as the owner of the classroom. If successfully verified, the classroom object is then retrieved and returned. 

##### `create`

This allows teacher accounts to create a new classroom.

First, a new 6-digit, unique ID is created. Next, a new instance of the `Classroom` object is created, storing the name, code and number of students (represented as student indexes).  

##### `update`
This allows teachers to modify a classroom's name, status, and the number of students in the class. Teachers can add new students to the class by providing their indexes, and they can also remove students by excluding their indexes from the request data. 

Any new students added are automatically registered as user accounts and assigned to the corresponding classroom with optional names.

##### `delete`
This method handles the deletion of a classroom. 


#### `StudentViewSet`
##### `list` 
This method is responsible for listing all the students associated with a specific classroom. 

The method retrieves the StudentProfile instances related to the given classroom code. It then serializes each StudentProfile object using `StudentProfileSerializer`, appending the corresponding student ID to each profile, and creates a list of these serialized profiles. The method returns a response containing the list of student profiles.

##### `update` 
This method handles updating the name of a specific student in a particular classroom based on the provided student ID and classroom code. 

The method retrieves the StudentProfile instance corresponding to the given classroom code and student index (specified in the request data). 

It then updates the name of the student with the new name provided in the request data and saves the changes to the database. The method returns a simple response, indicating that the update was successful.


### B. `Student_Core`
This section explains methods relating to student accounts when managing their courses.

#### `StudentSubmissionViewSet`
##### `retrieve`
This function retrieves a specific student submission based on the provided submission ID (pk). It checks if the submission belongs to the authenticated student. If not, it returns a 403 Forbidden response. Otherwise, it returns the serialized data of the submission.

##### `create`
This function allows students (user_type 3) to create a new submission for a given task. 

It handles both text and image submissions, associating the submission with the task and the currently authenticated student. 

If a previous submission status exists for the task and student, it removes it and creates a new submission status. It then returns the serialized data of the created submission.

##### `update`
This function enables students (user_type 3) to update their submissions. 

It checks if the submission has already been graded (has stars or comments). If yes, it returns a 403 Forbidden response. 

Otherwise, it allows students to update the submission's text or image and saves the changes, setting the resubmitted_at field to the current time. 

The function returns the serialized data of the updated submission.

#### `SubmissionStatusViewSet`
The update and create methods handle updating the status of a task, suppose the student has selected one of the status reaction (Working on it, Progress and Stuck). 

#### `GroupSubmissionViewSet`
##### `create`
This function enables students (user_type 3) to create group submissions. It expects a list of team students' names in the request data and filters the corresponding User objects based on these names. 

It then creates individual submissions for each student, associating them with the same task. 

Text submissions are supported, and the function returns a success message upon successful creation.

#### `StudentPortfolioViewSet`
##### `list`
This function retrieves a list of submissions associated with the currently authenticated student. 

It filters the submissions based on the student and returns the serialized data of these submissions.

This is required for the portfolio page of the student. 

##### `Leaderboard` (API View)

This function provides a leaderboard of students within a classroom based on their scores for the given class code (code). 

It fetches classroom information based on the code, orders the student profiles (Enroll objects) by score in descending order, and returns the serialized data of these profiles as the leaderboard.

This is used for the leaderboard dashboard in each student course.

# Requirements

## User Profile

Our target profile is Tinkertanker's trainers and students.

## Value Propostition

Unlike other LMS, Tinkerfolio can be adapted and modified to specific requirements of Tinkertanker. It is an easy-to-use GUI, allowing users to create tasks or submit work.

## Non-functional Requirements

1. The website should run on any browser, on any system, without issue.
2. The application should be responsive.
3. The application should be simple enough for users of any age to use.

# Best Practices
## Continuous Integration 
For our project, we utilize Continuous Integration (CI) with GitHub Actions to ensure a seamless deployment of the React build. The CI process involves automated testing, building, and compatibility checks to ensure that the application works flawlessly with both Node.js versions 16 and 18. 

Additionally, the CI workflow includes checks for successful deployment on Heroku, our chosen deployment platform.

## User Acceptance Testing 
UAT was conducted to assess the application's functionality and identify any bugs related to authentication and the creation of classrooms and courses.

## Unit Tests
Unit tests were written to test the functionality of the backend. This was done using the Django testing framework (Refer to `.\accounts\tests`, `.\cores\tests` and `.\student_core\tests`). 

For testing, go to the backend repository. Go to `settings.py` and use the first DATABASE default configuration. This is to use Django default lightweight SQLite database for testing.

To run the tests, run `python3 manage.py test`.

Unit tests aid in the development process by ensuring that the application works as intended.
# Design Considerations
## Handling Group Submission 
Currently, each time a student selects other team members for their group submission, upon reloading the page, this would result in their selection being resetted. While implementing a local storage to preserve the state could mitigate this, it could cause potential clashes between groups. 


# Future Plans
## Tagging system
A tagging system to categorise the courses could be useful in organising the students' portfolio. 
