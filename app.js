const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello from Node.js on Kubernetes! BALUMOHAN1988  ✅');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
