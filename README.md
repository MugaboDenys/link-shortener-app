# 🚀 URL Shortener

A simple URL shortener built with **Spring Boot (backend)** and **Next.js (frontend)**, similar to Bitly.

## 📂 Project Structure

```
shortener-app/
│── url-shortener-be/   # Backend (Spring Boot)
│── url-shortener-fe/   # Frontend (Next.js)
```

---

## 🛠️ **Tech Stack**
- **Backend:** Java, Spring Boot, PostgreSQL
- **Frontend:** Next.js, Tailwind CSS
- **Authentication:** JWT
- **Deployment:** Docker
- **Database:** PostgreSQL

---

## 🚀 **Getting Started**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/MugaboDenys/link-shortener-app.git
cd shortener-app
```

---

## 🖥 **Backend Setup (Spring Boot)**

### **1️⃣ Navigate to Backend**
```sh
cd url-shortener-be
```

### **2️⃣ Set up Environment Variables**

```sh
DATABASE_URL=jdbc:postgresql://localhost:5432/url_shortener
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

### **3️⃣ Build & Run**
```sh
mvn clean install
mvn spring-boot:run
```
By default, the backend runs on **`http://localhost:8080`**.

---

## 🌐 **Frontend Setup (Next.js)**

### **1️⃣ Navigate to Frontend**
```sh
cd ../url-shortener-fe
```

### **2️⃣ Set up Environment Variables**
Create a `.env.local` file:
```sh
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### **3️⃣ Install Dependencies**
```sh
npm install
```

### **4️⃣ Start the Frontend**
```sh
npm run dev
```
By default, the frontend runs on **`http://localhost:3000`**.

---

## 📦 **Docker Deployment**

Run both backend and frontend using **Docker Compose**:

```sh
docker-compose up --build
```

- Backend → `http://localhost:8080`
- Frontend → `http://localhost:3000`

---

## 🛡️ **Authentication**
- Users need to sign up and log in to create/manage shortened URLs.
- Access to **redirecting short URLs** does not require authentication.

---

## 🎯 **Features**
✅ Shorten long URLs  
✅ Redirect to original URL  
✅ User authentication & dashboard  
✅ Track click analytics  
✅ Deploy with Docker  

---

### 🚀 **Happy Coding!** 😃

