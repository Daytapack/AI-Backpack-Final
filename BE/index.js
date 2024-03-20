import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import usersRoutes from './Routes/Users.js'
import searchRoutes from './Routes/Search.js'
import communityRoutes from './Routes/CommunityDisplay.js'
import oppRoutes from './Routes/SavedOpportunity.js'

const app = express();
const PORT = 3000;
// const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/users', usersRoutes);
app.use('/search', searchRoutes);
app.use('/communitydisplay', communityRoutes);
app.use('/savedopportunity', oppRoutes);

app.get('/', (req, res)=>res.send('Hello from Homepage.'));

const link = 'https://conectado-aibackpack-stage-22c3a522bd05.herokuapp.com'
// app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))
app.listen(PORT, () => console.log(`Server running on port: ${link}`))

/*
Backup Code Prepared to Render Static Files --> From Rodrigo's Code

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the directory
app.use(express.static(path.join(__dirname,)));

// Route handler to serve the SignIn.html page
app.get('/SignIn.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'SignIn.html'));
});
*/