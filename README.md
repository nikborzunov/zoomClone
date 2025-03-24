# Zoom Clone

Zoom Clone is a real-time video conferencing application built using PeerJS and Socket.IO. It enables users to join video chats similar to Zoom with dynamic peer-to-peer connections and real-time communication.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Development](#development)
- [Production](#production)
- [Ngrok Setup](#ngrok-setup)
- [Configuration](#configuration)
- [Additional Information](#additional-information)
- [Contacts](#contacts)

## Requirements

- Node.js (v16 or later recommended)
- Yarn (installed globally)
- Ngrok (for public tunneling)

## Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone <repository-url>
   cd <project_folder>
2. Install the project dependencies:

Development
To run the application in development mode with live reloading:

Build the project (TypeScript compilation and Webpack bundling):

yarn build
Start the development server with Nodemon (watches for changes):

yarn devStart
Production
To run the built application in production mode, execute:

yarn start
Ngrok Setup
Use Ngrok to expose your local server over the internet for testing or demos:

Install Ngrok by following the instructions on the official website.

Launch Ngrok to tunnel your local server (default port 8080):

ngrok http 8080
Replace your localhost address with the provided Ngrok public URL.

Configuration
After starting Ngrok, update your PeerJS configuration with the new public URL. Edit src/modules/connection/peer.js and change the host value:

const peerOptions: PeerJSOption = {
    host: '<Your Ngrok Public URL>',
    port: 443,
    path: '/peerjs',
    secure: true,
    // ... other configuration options
};
Ensure necessary ports are open and adjust configurations for TypeScript, Webpack, and other tooling as needed.

Additional Information
Verify that the application’s network ports are accessible.
When using Ngrok, ensure secure data transmission by utilizing appropriate encryption protocols.
Customize project settings to fit your development or production environment if required.
Contacts
For further information or support, reach out on Telegram: @kupilulitku

