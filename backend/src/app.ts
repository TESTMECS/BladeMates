import { app, server } from "./server";
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const SOCKET_PORT = 4000;
server.listen(SOCKET_PORT, () => {
  console.log(`Socket is running on http://localhost:${SOCKET_PORT}`);
});
