---
title: "Docker: supercharge your CI pipeline"
date: "2021-06-02"
draft: false
path: "/blog/docker-supercharge-continous-integration"
tags: ["Docker", "CI"]
---
![Docker and GitLab logos](/../images/docker-supercharge-continous-integration.png)
Whenever we hear that a project uses Docker, automatically the microservices architecture comes into mind. However Docker is not only useful among the microservices paradigm. Many of the leading Git platforms rely on Docker images for their CI (Continous Integration) pipelines. Over this post we will focus on GitLab (although other providers such as GitHub or Bitbucket follow similar concepts) to explain how Docker can help us to supercharge our CI, including the creation of custom images to include even the most complex project requirement.

# The basics
## GitLab pipelines 101
The easiest way to understand pipelines in GitLab is to imagine a series of orderly applied transformations that are performed against a clean copy of your repository. Each of these steps is called a *stage*. Each stage can contain multiple operations which usually occur in parallel. These operations are called *jobs*. The *stages* are then defined inside a custom `gitlab-ci.yml` file which lives at the root of your repository. Here is a sample file with basic configuration:

```yml
default:
  image: mcr.microsoft.com/dotnet/core/sdk:latest

stages:
  - build-stage
  - test-stage

build-job:
  stage: build-stage
  script:
    - dotnet build
    
test-job:
  stage: test-stage
  script:
    - dotnet test
```

Of course there are a lot of ways that we can customize *jobs* and *stages* such as conditional execution or artifact creation, however this will be the topic for another post. 

## Docker + GitLab
Now, you may wonder, where does Docker come into play? Well, every time that a new *job* is started and a fresh copy of the repository is created, it is started inside a running container of a base Docker image defined in your `gitlab-ci.yml`. Did you see the first `image:` declaration in the `.yml` file? Well that will be our default Docker image that will be used to start each of our jobs. That is the reason why inside our `script` component we can use the `dotnet` CLI. 

# Start supercharging your CI

## Use different Docker images between jobs
Let's say that your project consists in a backend written in .NET, while you have a SPA written in React, and that both projects are inside the same repository. You will need to compile both as part of your CI pipeline, however one depends in the `dotnet` CLI, while for the other you need `npm`. This might not be very easy if the same `mcr.microsoft.com/dotnet/core/sdk:latest` image is used for both scenarios. Therefore you can define separate *jobs* based on different images:

```yml
stages:
  - build-stage 

build-backend:
  stage: build-stage
  image: mcr.microsoft.com/dotnet/core/sdk:latest  # we can define an image per job
  script:
    - dotnet build
    
build-frontend:
  stage: build-frontend
  image: node:12.6.0-alpine # we can define an image per job
  script:
    - npm run build
```

## Create your own Docker image with custom tools
Now, lets say that you want to extend your CI pipeline functionality to [notify a Slack channel](https://slack.com/intl/en-mx/help/articles/202009646-Notify-a-channel-or-workspace) whenever the backend build is finished. For this, you could create a sample `slack-notification.js` file that uses the Slack webhook API and that will be run with node. We won't go over the details for this here, but suppose your file calls:

```js
var slack = require('slack-notify')(SLACK_WEBHOOK_URL); 
slack.send({ channel: '#my-channel', text: 'Notifying from CI!'}); 
```

However, we cannot call this after the `dotnet build` script, since the `mcr.microsoft.com/dotnet/core/sdk:latest` image does not include the node dependencies. Therefore, we would need to create a custom image, upload it to some container registry (such as [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/), or even GitLab) and use it as our base image. 

```Dockerfile
FROM mcr.microsoft.com/dotnet/core/sdk:latest
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash && \ # we install the node dependencies
    apt-get install -y nodejs
```

Then inside our `build-backend` job we could add the following to the scripts array:
```yml
build-backend:
  stage: build-stage
  image: my-custom-image-with-net-and-node  # we can define an image per job
  script:
    - dotnet build
    - node slack-notify.js
```

## Create a Docker image inside a pipeline! 🤯

Last but not least, it is also possible to use create a Docker image from the latest compiled code in the repository. This is useful in case another team is working in a project that depends on ours. This way, whenever they want to run our project without the need to set up their local environments and download any other dependencies, they can just pull the Docker image generated from the latest code in our repo. For that we can use [Docker-in-Docker](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html) 

```yml
deploy_app:docker:
  stage: deploy
  image: docker:dind    
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:latest
```

# Final thoughts
Docker is a very powerful tool, both as a vital enabler for microservices, but also to supercharge our CI pipelines. The possibilities of Docker are almost endless since we can use it in very creative ways to build tools that accomodate to our specific project and organizational needs. If you wish to start learning [Docker](https://www.docker.com/) I recommend you take a look at their webpage. Also if you wish to know more regarding pipelines, I suggest you refer to the [GitLab CI pipeline documentation](https://docs.gitlab.com/ee/ci/pipelines/index.html)