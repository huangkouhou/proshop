# ProShop - Production Ready eCommerce Platform

![CI/CD Status](https://github.com/huangkouhou/proshop/actions/workflows/deploy.yml/badge.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)
![AWS](https://img.shields.io/badge/Deployed%20on-AWS%20EC2-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> A full-stack eCommerce application built with the **MERN stack**, fully containerized with **Docker**, and deployed on **AWS EC2** with a robust **CI/CD pipeline**.

🔗 **Live Demo:** [https://penghuang.dev](https://penghuang.dev)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features](#-key-features)
- [DevOps & CI/CD](#-devops--cicd)
- [Payment Integration (PayPay)](#-payment-integration)
- [Getting Started](#-getting-started)

---

## 🚀 Project Overview

ProShop is not just a shopping cart; it is a **production-grade** web application designed to demonstrate full-stack capabilities, from database design to automated cloud deployment. 

It features a custom-built payment system integrating **PayPal** (Global) and **PayPay** (Japan), ensuring secure and reliable transactions through server-side verification.

---

## 🛠 Architecture & Tech Stack

### Frontend
- **React.js**: Functional components with Hooks.
- **Redux Toolkit**: Global state management (Cart, User Auth, Product Lists).
- **Bootstrap / React-Bootstrap**: Responsive UI design.

### Backend
- **Node.js & Express**: RESTful API architecture.
- **MongoDB & Mongoose**: NoSQL database with strict schema modeling.
- **Jest**: Unit and Integration testing for critical business logic.

### Infrastructure & DevOps
- **AWS EC2**: Linux (Ubuntu) server hosting.
- **Docker & Docker Compose**: Multi-container orchestration (Frontend, Backend, Proxy).
- **Caddy**: Modern web server used as a **Reverse Proxy** with **Automatic SSL/HTTPS**.
- **GitHub Actions**: Automated CI/CD pipeline for testing, building, and deploying.

---

## ✨ Key Features

- **Full-Featured Shopping Experience**: Product search, pagination, carousel, and rating system.
- **User Authentication**: JWT (JSON Web Tokens) based auth with secure HTTP-only cookies.
- **Admin Dashboard**: Comprehensive management for Users, Products, and Orders.
- **Order Management**: Tracking delivery status and payment history.
- **Secure Payments**: Integrated PayPal and PayPay with robust error handling.

---

## 🔄 DevOps & CI/CD

This project implements a "Shift-Left" testing strategy and automated deployment:

1.  **Code Push**: Developer pushes code to the `main` branch.
2.  **Continuous Integration (CI)**: GitHub Actions triggers **Jest** unit tests to verify backend logic.
3.  **Build**: If tests pass, Docker images are built for Frontend and Backend.
4.  **Push**: Images are pushed to **Docker Hub**.
5.  **Continuous Deployment (CD)**: The pipeline SSHs into the **AWS EC2** instance, pulls the latest images, and restarts containers with zero downtime.

---

## 💳 Payment Integration (Highlight)

### PayPay Integration (Japanese Market)
Unlike standard SDK integrations, the PayPay implementation in this project handles complex **Redirect-based payment flows**:

1.  **QR Code Generation**: Backend communicates with PayPay API to generate a payment link.
2.  **Secure Redirect**: User is redirected to the PayPay App/Web to authorize payment.
3.  **Server-Side Verification**: Upon return, the frontend triggers a secure verification endpoint. The Backend strictly validates the payment status directly with PayPay servers before updating the database.
    * *Why?* This prevents client-side spoofing and ensures data consistency even if network issues occur during the redirect.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB URI
- PayPal & PayPay Developer Credentials

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_secret>
PAYPAL_CLIENT_ID=<your_paypal_id>
PAYPAY_API_KEY=<your_key>
PAYPAY_API_SECRET=<your_secret>
PAYPAY_MERCHANT_ID=<your_id>
FRONTEND_URL=http://localhost:3000