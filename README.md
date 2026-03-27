# 📚 Study Management Dashboard

A modern React-based productivity application designed to help students **organize subjects, manage tasks, track revision, and explore AI-powered study tools** — all in one place.

---

## 🌐 Live Demo

https://studycompanion12.netlify.app/dashboard
---

## 🚀 Features

* 📊 **Dashboard Overview** – Quick insights into study progress
* 📘 **Subjects Management** – Organize and track subjects
* ✅ **Task Manager** – Add, update, and manage study tasks
* 🔁 **Revision Tracker** – Keep track of revision schedules
* 🤖 **AI Tools Section** – Explore AI-powered study assistance
* 🌙 **Dark/Light Mode** – Theme switching using context API
* 🔔 **Toast Notifications** – Real-time feedback using alerts
* 🎬 **Smooth Animations** – Page transitions with Framer Motion
* 🔄 **Routing System** – Seamless navigation using React Router

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Routing:** React Router DOM
* **State Management:** Context API (`StudyContext`, `ThemeContext`)
* **Animations:** Framer Motion
* **Notifications:** React Toastify
* **Styling:** CSS
* **Deployment:** Vercel

---

## 📂 Project Structure

```id="9b2g6t"
src/
│── components/
│   ├── Navbar.js
│
│── context/
│   ├── StudyContext.js
│   ├── ThemeContext.js
│
│── pages/
│   ├── Dashboard.js
│   ├── Subjects.js
│   ├── Tasks.js
│   ├── Revision.js
│   ├── AITools.js
│
│── App.js
│── index.js
```

---

## ⚙️ Application Flow

* The app is wrapped with:

  * `ThemeProvider` → Manages dark/light mode
  * `StudyProvider` → Manages study-related state

* Navigation is handled using **React Router**, with routes:

  * `/dashboard`
  * `/subjects`
  * `/tasks`
  * `/revision`
  * `/ai-tools`

* Unknown routes automatically redirect to the dashboard.

* **Framer Motion** enables smooth page transitions.

* **React Toastify** provides real-time notifications for user actions.

---

## 🎨 Key Components

* **Navbar** → Navigation across pages
* **Dashboard** → Overview of study data
* **Subjects** → Subject management
* **Tasks** → Task tracking system
* **Revision** → Revision planning
* **AITools** → AI-powered features

---

## 🌙 Theme Support

* Toggle between **Dark Mode** and **Light Mode**
* Theme is globally managed using `ThemeContext`
* Toast notifications also adapt to theme automatically

---

## 🔔 Notifications

* Toast messages appear at the **bottom-right**
* Auto-close after 2.5 seconds
* Styled dynamically based on theme

---

## 🚀 Getting Started

### 1. Clone the repository

```bash id="k91v8k"
git clone https://github.com/udayasri25bcs10741/React_2_Project.git
cd React_2_Project
```

### 2. Install dependencies

```bash id="x9c2m1"
npm install
```

### 3. Run the application

```bash id="4l7b3s"
npm start
```

App runs on:

```id="7n5k2z"
http://localhost:3000
```

---

## 📸 Screenshots

*Add screenshots here (Dashboard, Tasks, AI Tools, Dark Mode, etc.)*

---

## 🎯 Learning Outcomes

* Advanced React concepts using **Context API**
* Implementing **client-side routing**
* Managing global state efficiently
* Adding **animations and transitions**
* Building a scalable multi-page application
* Integrating third-party libraries

---

## 💡 Future Enhancements

* 🔐 User authentication (Login/Signup)
* ☁️ Backend integration (Firebase / Node.js)
* 📊 Analytics for study performance
* 📱 Mobile-first responsive improvements
* 🤖 Advanced AI study assistant features

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Open a Pull Request

---

## 📜 License

This project is open-source and available under the MIT License.

---

## ❤️ Acknowledgement

> “Stay consistent. Small progress every day leads to big results.”

---

## 📬 Contact

Feel free to reach out for collaboration or feedback!
