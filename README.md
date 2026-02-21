# Singapore Internet History Timeline Website

This project is an interactive timeline of Singapore's internet history, built with HTML, CSS, and vanilla JavaScript. The timeline data is served from a custom REST API built with Node.js and Express.

An immersive, interactive web application documenting the milestones of Singapore's digital transformation—from the launch of Singapore ONE in 1997 to the current Smart Nation evolution.

- Key Features

Interactive 3D Hero: A high-performance landing experience powered by Three.js, featuring animated particle systems and spring-physics interactions.

Dynamic Content Rendering: Uses Handlebars.js to inject data from JSON-based "Digital Foundations" and "Connectivity" datasets into the UI.

Full-Stack Architecture: Features a dedicated Node.js/Express backend serving timeline data via a RESTful API.

Data Visualization: Integrated Chart.js modules to visualize internet adoption rates and digital inclusion statistics across different eras.

Knowledge Assessment: A custom-built, JSON-driven interactive quiz to test users on Singapore’s tech history.

Responsive Multimedia: Support for embedded video documentaries and high-quality image galleries with smooth CSS transitions.

- Tech Stack

Frontend

Three.js: 3D graphics and particle animations.

Handlebars.js: Client-side templating for modular UI components.

Tailwind CSS: Modern, utility-first styling for layout and responsiveness.

Chart.js: Data visualization for digital inclusion metrics.

Backend

Node.js & Express.js: Server-side logic and API routing.

REST API: Serves timeline data, quiz questions, and historical facts in JSON format.

CORS: Configured for secure cross-origin resource sharing between frontend and backend.

- Technical Highlights

-RESTful Data Fetching: The frontend dynamically fetches timeline data (e.g., Laying the Digital Foundations.json) from the Express server, allowing for easy content updates without modifying HTML.

-Intersection Observer API: Used to trigger 3D animations and CSS fade-ins only when elements are visible in the viewport, optimizing performance.

-State Management: Tracks user progress through the quiz and current timeline "open" states using vanilla JavaScript.

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
