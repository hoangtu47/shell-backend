# A WebSocket server 🔌

Which is later on built into an Alpine **container**. 

Those **running in the background**:

- A **shell**, whose stdin and stdout is piped back and forth.
- **ExpressJS** server listenning on port 8080 for **WebSocket** connection.
- Two **executables** to render TUI.

Serves as backend for [my porfolio](haquocbao.id.vn) !

# Tech stack

- **Bash** language for `welcome`
- **Golang** for `hello`
- **Node.js** and plain **JavaScript**
- **Docker**

# CD/CI

**Azure** is the cloud provider of my choice, love it! <3 

The **workflow** triggered on push event to branch `main` is as following:

- GitHub action **authenticate** with Azure.
- Image is **pushed** to Azure Container Registry.
- Azure Container App **deployed** image with pre-configured custom domain.
