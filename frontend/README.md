# React + TypeScript + Vite

Frontend for our application.

- src/components/Articles : Webpages related to article data
- src/components/Landing : Webpages related to the landing page.
- src/App.tsx : Main app
- src/ main.tsx : entry point for react app

- Dockerfile : containerizing the frontend
- Docker runs the built files. Make sure to run npm run build before building the docker image.
- .dockerignore : uncomment node_modules for a faster docker build time if no changes to it. (docker will use the cached node_modules)

- User lands on /login which has the login and the welcome content.
- User logs in or registers and lands on /home
- /home show the FeedSelector, used to change Feed, and the navbar.
- The user opens the trendslist and can add feeds to their feed selector.
- Can use the navbar to go the the profile.
