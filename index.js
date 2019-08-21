const express = require('express');
const server = express();

server.use(express.json());

const projects = [];
let requestNumber = 0;

//Check ID middleware
function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'ID does not exist' });
  }
  next();
}

//Request counting middleware
function reqCounter(req, res, next) {
  requestNumber++;
  console.log(`Requests: ${requestNumber}`);

  next();
}

server.use(reqCounter);

//Add new project
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] }

  projects.push(project);
  return res.json(projects);
})
//List all the projects
server.get('/projects', (req, res) => {
  return res.json(projects);
})
//Edit the title of a project
server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;
  return res.json(project);
})
//Delete project
server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);
  return res.send();
})
//Add tasks into an array inside a project
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);
  return res.json(project);
})

server.listen(3333);
