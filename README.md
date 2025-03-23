```markdown
# Zoom Clone

Zoom Clone is a real-time video conferencing application built using PeerJS and Socket.IO. It allows users to join video chats similar to Zoom, featuring dynamic peer-to-peer connections and real-time communication.

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

- Node.js (version 16 or later recommended)
- Yarn (globally installed)
- Ngrok (for public tunneling)

## Installation

1. Clone the repository and navigate to the project folder:

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

2. Start the development server with Nodemon, which watches for changes:

   ```bash
   yarn devStart
   ```

## Production

For running the built application in production mode, execute:

```bash
yarn start
```

## Ngrok Setup

To expose your local server over the internet for testing or demo purposes:

1. Install Ngrok by following the instructions on the [official website](https://ngrok.com/).
2. Launch Ngrok to create a tunnel to your local server (default port 8080):

   ```bash
   ngrok http 8080
   ```

3. Use the public Ngrok URL provided in place of your local host address.

## Configuration

After starting Ngrok, update your PeerJS configuration with the new public URL. Edit `src/modules/connection/peer.js` and modify the host value as follows:

```javascript
const peerOptions: PeerJSOption = {
    host: '<Your Ngrok Public URL>',
    port: 443,
    path: '/peerjs',
    secure: true,
    // ... other configuration options
};
```

Ensure all necessary ports are open and adjust configurations for TypeScript, Webpack, and other tooling as needed.

## Additional Information

- Verify that the network ports used by the application are accessible.
- When using Ngrok, ensure secure data transmission by utilizing encryption protocols.
- Customize the project settings if required to better fit your development or production environment.

## Contacts

For further information or support, reach out on Telegram: [@kupilulitku](https://t.me/kupilulitku)
```
