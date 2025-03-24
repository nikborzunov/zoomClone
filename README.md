# Zoom Clone

Zoom Clone is a real-time video conferencing application built with PeerJS and Socket.IO. It enables video chats with dynamic peer-to-peer connections and real-time communication—similar to Zoom.

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

- Node.js (v16 or later is recommended)
- Yarn (must be installed globally)
- Ngrok (for public tunneling)

## Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone <repository-url>
   cd <project_folder>
   ```

2. Install the project dependencies:

   ```bash
   yarn install
   ```

## Development

To run the project in development mode with live-reloading:

1. Build the project (TypeScript compilation and Webpack bundling):

   ```bash
   yarn build
   ```

2. Start the development server with Nodemon to watch for changes:

   ```bash
   yarn devStart
   ```

## Production

To run the built application in production mode, use:

```bash
yarn start
```

## Ngrok Setup

Follow these steps to expose your local server over the internet for testing or demos:

1. Download and install Ngrok from the [official website](https://ngrok.com/).
2. Launch Ngrok to create a tunnel to your local server (default port is 8080):

   ```bash
   ngrok http 8080
   ```

3. Use the provided Ngrok public URL in place of your localhost address.

## Configuration

After setting up Ngrok, update your PeerJS configuration with the new public URL. Modify the host value in `src/modules/connection/peer.js` as shown:

```javascript
const peerOptions: PeerJSOption = {
    host: '<Your Ngrok Public URL>',
    port: 443,
    path: '/peerjs',
    secure: true,
    // ... other configuration options
};
```

Ensure that all necessary ports are open and adjust configurations for TypeScript, Webpack, and other tools as needed.

## Additional Information

- Verify that the network ports used by the application are accessible.
- When using Ngrok, ensure secure data transmission by enabling encryption protocols.
- Customize project settings as required to best fit your development or production environment.

## Contacts

For further information or support, reach out on Telegram: [@kupilulitku](https://t.me/kupilulitku)
