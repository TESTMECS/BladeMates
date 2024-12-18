# Tech Trends

Project for CS554
This is the best site there is for tech trends. Users will be able to view recent and past news articles related to technology. Users will be able to favorite news articles and be able to view the kind of trends/topics others are interested in and news that other users have favored. Users will also be able to comment under each news article. Users will also have the ability to follow other users to receive notifications on any new articles the other users add to their favorites. Users will also be able to participate in live chat with other users globally to discuss current events or start a flame war. The most recent and newest news will be delivered by the News API.
Additionally, the users will be given a new feed that updates daily with the most important news of the day. Users will be able to chat in real time with other users about the most important news of the day. A separate feed will contain the user's friends' favorite articles as well as articles that keep the user updated on specific trends the user is interested in.

**Core Course Technologies:**

- **React** - For our single-page application, we will use React to build dynamic UI components.
- **TypeScript** - We will use typescript to have a better developer experience. With a complex project, type checking becomes very crucial for the maintainability of code.
- **Redis** - Redis will be used for caching data to decrease the amount of repeated API calls (and also to stay within the bounds of the free tier of the API) and decrease the response time for a better user experience.
- **SocketIO** - We will use SocketIO to enable two way communication on Live Chats under specific feeds.

External Technology:

- **RabbitMQ** - We will use RabbitMQ to allow multiple users to subscribe to both the main news feed as well as their friends favorite feed and receive notifications.
- **ElasticSearch** - We will use ElasticSearch to store the content and titles of articles to allow for faster and more specific

# Instructions for running with docker
- Rename .env.example to .env in the backend directory and insert your news API key which you can get from registering an account at newsapi.org
- Ensure docker desktop is running
- build the images : docker-compose up --build
- visit `http://localhost:3000` on the browser

# Instructions for locally running. 
- Rename .env.example to .env
- All of the following services run on the default port with installation on the latest versions. 
	- Ensure **Mongodb** is installed and running on port 27017
	- Ensure **ElasticSearch** is installed and running on port 9200
	- Ensure **Redis** is installed and running on port 6379
	- Ensure **RabbitMQ** is installed and running on the port 5672 and 15672. (listen and receive)
- To start the backend
	- `npm install` (dependencies)
	- `npm run build` to build dependencies, a pre built file should already be available in `dist` so this command is not necessary. 
	- `npm run seed` to seed **elasticSearch**
	- `npm run start` to start the backend. 
	- *For Ease of use:*
		1. `npm install && npm run build` then run
		2. `npm run seed && npm run start`  to start the server.
- To start the Frontend open a separate terminal:
	-  `npm install` (dependencies)
	- `npm run build` to build dependencies, a pre built file should already be available in `dist` so this command is not necessary.
	- *For Ease of use*
	- `npm install && npm run build`
	- `npm run serve` to start the production application. 
- To access the frontend go to `http://localhost:3000` on the browser
