## Frontend Integration with Spring Boot

This project serves the React frontend directly from the Spring Boot backend.

### Build Frontend

Navigate to the frontend directory and create a production build:

```bash
cd Frontend/nucleus-frontend
npm run build
```

This generates the production assets inside:

```text
Frontend/nucleus-frontend/dist/
```

### Copy Build to Spring Boot

Copy the generated React build into the Spring Boot static resources directory:

```cmd
xcopy "G:\NUCLEUS\Frontend\nucleus-frontend\dist\*" "G:\NUCLEUS\Backend\nucleus_backend\src\main\resources\static" /E /H /C /I
```

### Run Backend

Start the Spring Boot application:

```bash
mvn spring-boot:run
```

or run the generated JAR:

```bash
java -jar target/nucleus_backend.jar
```

### Access Application

Open:

```text
http://localhost:8080
```

The Spring Boot application serves:

* React Frontend
* REST APIs
* Static Assets

through a single application instance.

### Deployment Flow

```text
React Application
       │
       ▼
npm run build
       │
       ▼
dist/
       │
       ▼
Copy to Spring Boot static/
       │
       ▼
Spring Boot Application
       │
       ▼
http://localhost:8080
```

This approach allows the frontend and backend to be deployed together as a single Spring Boot application.
