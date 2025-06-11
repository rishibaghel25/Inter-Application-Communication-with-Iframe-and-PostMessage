# Inter-Application Communication with Iframe and PostMessage API
Project Structure Overview

```
Inter-Application Communication with Iframe and PostMessage/
├── Child1/                     # Child app 1 (e.g., port 3003)
│   ├── assets/
│   └── index.html
├── Child2/                     # Child app 2 (e.g., port 3002)
│   ├── assets/
│   └── index.html
├── dist/                       # Built master app
├── src/                        # Master app source
└── package.json               # Root package.json with concurrently (if applicable)
```

Implementation Summary

We successfully implemented cross-iframe communication between a master application and child applications using the PostMessage API. Here's how we achieved this:
1. Master App Configuration

The master app serves as the parent container that:

    * Embeds child applications using `<iframe>` elements
    * Provides a UI to send messages to child apps
    * Uses `postMessage()` to communicate with iframes

2. Child App Configuration (e.g., Child1)

The child app receives and processes messages by:

    * Adding event listeners for message events
    * Validating message origins for security
    * Updating the UI based on received data

3. Build Process Workflow

    * **Development:** Edit source files in respective app directories
    * **Build:** Generate production builds (`npm run build`)
    * **Deploy:** Copy built files to appropriate directories
    * **Serve:** Master app serves all applications simultaneously

Technical Implementation Details
Master App (Sender)

```javascript
// Reference to iframe
const child1IframeRef = useRef(null);

// Send message function
const sendMessageToChild1 = () => {
  if (child1IframeRef.current && child1IframeRef.current.contentWindow) {
    child1IframeRef.current.contentWindow.postMessage(
      messageToSend, 
      'http://localhost:3003' // Target origin for Child1
    );
  }
};

// Iframe element for Child1
<iframe
  src="http://localhost:3003"
  title="Child1 App"
  className="app-iframe"
  ref={child1IframeRef}
/>

// Similar setup for Child2
```

Child App (Receiver) - Example for Child1

```javascript
// Message listener setup
useEffect(() => {
  const handleMessage = (event) => {
    // Validate origin for security
    if (event.origin === 'http://localhost:3000') { // Assuming master app runs on port 3000
      console.log('Received message:', event.data);
      setReceivedMessage(event.data);
    }
  };

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}, []);
```

Key Features Implemented

    * Real-time Communication
        * Messages sent from master app appear instantly in child app
        * No page refresh required
        * Bidirectional communication capability
    * Security Measures
        * Origin validation prevents unauthorized messages
        * Only trusted sources can send messages
        * CORS-safe implementation
    * Visual Feedback
        * Master app shows input field and send button
        * Child app displays received messages in header
        * Status indicators for successful communication
    * Modular Architecture
        * Each app maintains its own codebase
        * Independent build processes
        * Scalable to multiple child applications

Build and Deployment Process
Step 1: Modify Source Files

```bash
# Edit source files in respective directories
cd Child1/
# Make changes to your Child1 app files
cd ../Child2/
# Make changes to your Child2 app files
```

Step 2: Build Applications

```bash
# Build all applications (if you have a root build script)
npm run build:all

# Or build individually
cd Child1 && npm run build
cd ../Child2 && npm run build
# If you have a master app build, add it here
```

Step 3: Deploy Built Files

```bash
# Copy dist/build files to appropriate locations
# Built files are served from their respective directories (e.g., Child1/dist, Child2/dist)
```

Step 4: Run Master Application

```bash
# Start all applications concurrently (assuming a root package.json script)
npm start

# This runs:
# - master app (e.g., on port 3000)
# - Child1 on its designated port (e.g., 3003)
# - Child2 on its designated port (e.g., 3002)
```

Data Flow Architecture

```
┌─────────────────┐    postMessage()    ┌──────────────────────┐
│   Master App    │ ──────────────────> │       Child1         │
│  (e.g., port    │                     │   (e.g., port 3003)  │
│      3000)      │                     │                      │
│ ┌─────────────┐ │                     │ ┌──────────────────┐ │
│ │ Input Field │ │                     │ │ Message Listener │ │
│ │ Send Button │ │                     │ │ Header Component │ │
│ │ Iframe Ref  │ │                     │ │ State Update     │ │
└─────────────┘                     └──────────────────────┘

          (Similar for Child2)
```

Benefits of This Approach

    * Microservices Architecture
        * Each app can be developed independently
        * Different teams can work on different apps
        * Technology stack flexibility per app
    * Production-Ready
        * Uses built/optimized files
        * Better performance than development servers
        * Proper separation of concerns
    * Scalability
        * Easy to add more child applications
        * Master app can manage multiple iframes
        * Communication patterns can be extended
    * Security
        * Origin validation prevents XSS attacks
        * Sandboxed iframe environments
        * Controlled message passing

Communication Protocol
Message Structure

```javascript
// Simple text message
postMessage("Hello from Master App", "http://localhost:3003");

// Complex data (if needed)
postMessage({
  type: 'TEXT_UPDATE',
  payload: {
    text: 'Hello from Master App',
    timestamp: Date.now()
  }
}, "http://localhost:3003");
```

Event Handling

```javascript
const handleMessage = (event) => {
  // 1. Validate origin
  if (event.origin !== 'http://localhost:3000') return;
  
  // 2. Process message
  const message = event.data;
  
  // 3. Update UI
  setReceivedMessage(message);
};
```

Conclusion

This implementation demonstrates a robust pattern for inter-application communication in a microservices frontend architecture. By using the PostMessage API with iframe containers, we achieved:

✅ Secure cross-origin communication ✅ Real-time data transfer ✅ Modular application architecture ✅ Production-ready build system ✅ Scalable communication patterns

The solution works with built applications rather than development servers, making it suitable for production environments while maintaining the flexibility of independent application development.
