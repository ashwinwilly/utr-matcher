const express = require('express');
const cors = require('cors');
const app = express();

// ✅ make sure this path is exactly right
const apiRoutes = require('./routes/api');

app.use(cors());

// ✅ THIS LINE IS MANDATORY
app.use('/api', apiRoutes);

const PORT = 5000;
app.get('/test-root', (req, res) => {
    res.send('Root test route is working!');
  });
app.get('/ping', (req, res) => {
    res.send('pong');
  });
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
