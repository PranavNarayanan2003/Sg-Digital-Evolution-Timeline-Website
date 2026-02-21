# Singapore Internet History Timeline Website

This project is an interactive timeline of Singapore's internet history, built with HTML, CSS, and vanilla JavaScript. The timeline data is served from a custom REST API built with Node.js and Express.

---
## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) installed on your computer. This will also install `npm` (Node Package Manager).

---
## Setup Instructions

1.  **Install Dependencies:** Open a terminal in the project's root directory and run the following command to install the required packages (Express and CORS):

    npm install
    
## Running the Application

This project requires **two** servers to be running at the same time: the backend API and the frontend website.

### 1. Start the Backend API Server

* In your terminal, from the project's root directory, run the following command:

    node server.js

* You should see the message: `API server is running at http://localhost:3000`.
* **Leave this terminal running.**

### 2. Start the Frontend Website

* In Visual Studio Code, right-click on the `index.html` file.
* Select "**Open with Live Server**".
* This will open the website in your browser at a URL like `http://127.0.0.1:5500`. The website will now be fully functional.