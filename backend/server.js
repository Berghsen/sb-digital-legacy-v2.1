const express = require('express');
const app = express();
const port = 5000; // You can choose any port

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});