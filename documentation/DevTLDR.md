# Local Development Quick Setup
- Install Python, Node, Git, Heroku

## Front End
- Clone the repo using\
`git clone https://github.com/tinkertanker/LMS_Frontend.git` 

- Install `yarn` (NOT the cmdtest version). If you see the below message, you have the wrong `yarn`\
`00h00m00s 0/0: : ERROR: There are no scenarios; must have at least one.`

- Include the following lines in `.env.local`.
```
NEXT_PUBLIC_BACKEND_HTTP_BASE=http://127.0.0.1:8000/
NEXT_PUBLIC_BACKEND_WS_BASE=ws://127.0.0.1:8000/
NEXT_PUBLIC_ALLOWED_HTS=<heroku-app-url>,localhost,127.0.0.1
```

- Run `yarn` and then `yarn dev`. The app should be running at `localhost:3000`. 

## Back End
- Clone the repo using\
`git clone https://github.com/tinkertanker/LMS_Backend.git`

- In the backend repository, run `pip3 install requirements` to install the required dependencies. 

- Edit the config file (can reference values from `env.docker`)

- Then, run `python3 manage.py runserver`. You can view the Django admin panel at `localhost:8000/admin`, with a superuser account (can be created using `python3 manage.py createsuperuser`)

## Back End (with Docker)
- Install Docker
- Next, set up an `env.docker` file - you can use the `env.docker.sample` and insert the corresponding values there (or just clone it).
- Navigate to the folder in a terminal, then execute the following commands:
```
docker compose up

# after it comes up, and in a separate window
docker ps

# look for the CONTAINER ID that corresponds to lms_backend-django

# suppose the CONTAINER ID is e1e3075d13f7
docker exec -it e1e3075d13f7 sh

# and when you're in, run the django migrations
python manage.py migrate

# also create a user so you can login to django
python manage.py createsuperuser
```
- In all subsequent runs, just run the command `docker compose up`


