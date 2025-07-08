
```markdown
# ✈️ Flight Booking System – Full Documentation

## 📚 Table of Contents
1. [Project Structure and Design](#project-structure-and-design)
2. [Architecture Diagram](#architecture-diagram)
3. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
4. [Docker and Environment Configuration](#docker-and-environment-configuration)
5. [Deployment Steps and Scaling](#deployment-steps-and-scaling)
6. [Extra Credit: Automation Scripts (Ansible & Terraform)](#extra-credit-automation-scripts-ansible--terraform)
7. [Additional Recommendations](#additional-recommendations)

---

## 🏗 Project Structure and Design

The project is organized as a monorepo with separate frontend and backend applications, orchestrated via Docker Compose.

```

```
Flight/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

````

**Backend:**
- Express.js REST API for managing flights and bookings.
- Sequelize ORM (PostgreSQL in dev/prod, SQLite for tests).
- Jest for unit tests.

**Frontend:**
- React SPA using Vite and Tailwind CSS.
- Axios for API calls.
- Vitest and Testing Library for tests.

---

## 🖼 Architecture Diagram

```mermaid
flowchart LR
  User([User Browser])
  Frontend([React Frontend])
  Backend([Express.js API])
  Database[(PostgreSQL Database)]

  User --> Frontend
  Frontend --> Backend
  Backend --> Database
````

---

## ⚙️ CI/CD Pipeline Setup

**Tool:** GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: flight_app_test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install backend dependencies
        run: |
          cd backend
          npm install

      - name: Run backend tests
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/flight_app_test
        run: |
          cd backend
          npm test

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm install

      - name: Run frontend tests
        run: |
          cd frontend
          npm test
```

---

## 🐳 Docker and Environment Configuration

**docker-compose.yml** defines:

* **frontend** – served on port 5173.
* **backend** – served on port 5000.
* **postgres** – data persistence.

**Environment Variables:**

`backend/.env`

```
DATABASE_URL=postgresql://postgres:password@postgres:5432/flight_app_dev
PORT=5000
```

`frontend/.env`

```
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🚀 Deployment Steps and Scaling

### 1. Local Development

```sh
docker-compose up --build
```

### 2. Production Deployment

```sh
docker-compose up -d --build
```

### 3. Scaling

* **Backend:** Horizontal scaling via multiple containers behind a load balancer.
* **Frontend:** Static build can be hosted via CDN.
* **Database:** Use managed PostgreSQL with replication.

---

## ⭐ Extra Credit: Automation Scripts (Ansible & Terraform)

### Ansible Playbook Example

`ansible/deploy.yml`:

```yaml
- name: Deploy Flight Booking App
  hosts: webservers
  become: yes

  tasks:
    - name: Install Docker
      apt:
        name: docker.io
        state: present
        update_cache: yes

    - name: Install Docker Compose
      get_url:
        url: https://github.com/docker/compose/releases/download/1.29.2/docker-compose-Linux-x86_64
        dest: /usr/local/bin/docker-compose
        mode: '0755'

    - name: Copy project files
      copy:
        src: ../
        dest: /opt/flight-app

    - name: Run Docker Compose
      shell: docker-compose up -d --build
      args:
        chdir: /opt/flight-app
```

Run:

```
ansible-playbook -i inventory.ini ansible/deploy.yml
```

---

### Terraform Example

`terraform/main.tf`:

```hcl
provider "aws" {
  region = "eu-central-1"
}

resource "aws_instance" "flight_app_server" {
  ami           = "ami-xxxxxxxxx" # Ubuntu AMI ID
  instance_type = "t3.micro"
  tags = {
    Name = "FlightBookingApp"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y docker.io",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",
      "curl -L \"https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose",
      "chmod +x /usr/local/bin/docker-compose",
      "git clone https://github.com/rahmo96/Flight.git",
      "cd Flight && docker-compose up -d --build"
    ]
  }
}
```

