const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { url, title, techs } = request.body;
    const repository = {
      id: uuid(),
      url,
      title,
      techs,
      likes: 0
    }

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { url, title, techs, likes} = request.body;
    const { id } = request.params;

    const repoIndex = repositories.findIndex(repository => repository.id === id);
    if(repoIndex < 0){
      return response.status(400).json({error: 'Repository not found.'})
    }

    const arrayLikes ={
      likes: 0
    }

    if(likes){
      return response.json(arrayLikes);
    }

    const repository = {
      id: repositories[repoIndex].id,
      url,
      title,
      techs,
      likes: repositories[repoIndex].likes
    };

    const returnRepo ={
      id,
      url,
      title,
      techs
    }

    repositories[repoIndex] = repository;
    
    return response.json(returnRepo);

});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repoIndex = repositories.findIndex(repository => repository.id === id);
    if(repoIndex < 0){
      return response.status(400).json({error: 'Repository not found.'})
    };

    repositories.splice(repoIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const repoIndex = repositories.findIndex(repository => repository.id === id);
    if(repoIndex < 0){
      return response.status(400).json({error: 'Repository not found.'})
    };

    let qntLikes = repositories[repoIndex].likes + 1;
    repositories[repoIndex].likes = qntLikes;

    const repoLikesReturn ={
      likes: qntLikes
    }

    return response.json(repoLikesReturn);

});

module.exports = app;
