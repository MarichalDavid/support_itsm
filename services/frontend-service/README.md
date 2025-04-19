
# Keycloak Authentication Demo

A premium, minimalist React application with Keycloak authentication, inspired by Apple's design philosophy.

![Keycloak Authentication Demo](https://placeholder.com/header-image)

## Features

- Sleek, Apple-inspired UI with minimalist design
- Secure authentication with Keycloak
- Responsive layout for all devices
- Beautiful transitions and animations
- Chat-like UI after authentication

## Prerequisites

Before running this project, you'll need:

- Node.js (v14+)
- npm or yarn
- A running Keycloak server (local or remote)

## Getting Started

### 1. Clone the repository

```sh
git clone <repository-url>
cd keycloak-auth-demo
```

### 2. Install dependencies

```sh
npm install
# or using yarn
yarn
```

### 3. Configure Keycloak

1. Set up a Keycloak server and create a new realm
2. Create a new client in your realm with the following settings:
   - Client ID: your-client-id
   - Client Protocol: openid-connect
   - Access Type: public
   - Valid Redirect URIs: http://localhost:8080/*
   - Web Origins: http://localhost:8080 (or '+' for all)

3. Create a `.env` file in the root directory using the `.env.example` template:

```sh
cp .env.example .env
```

4. Update the `.env` file with your Keycloak configuration:

```
VITE_KEYCLOAK_URL=http://localhost:8080/auth
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id
```

### 4. Run the application

```sh
npm run dev
# or using yarn
yarn dev
```

The application will start on http://localhost:8080

## Usage

1. Visit the homepage
2. Click the "S'authentifier" button to log in
3. You'll be redirected to the Keycloak login page
4. After successful authentication, you'll be redirected to the chat-like home page
5. To log out, click the "Logout" button in the top-right corner

## Project Structure

```
└── src/
    ├── components/       # Reusable UI components
    ├── contexts/         # React contexts including Auth
    ├── pages/            # Application pages
    ├── services/         # Keycloak integration
    └── lib/              # Utility functions
```

## Additional Information

- The application uses React Router for navigation
- Authentication state is managed using React Context
- Styling is done with Tailwind CSS and custom animations
- The UI is responsive and works on mobile devices

## License

[MIT](LICENSE)
