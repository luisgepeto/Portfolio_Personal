---
title: "Build Your Own Idea! - Ready, Stop, Think! 🛑 + 🧠 (S1E2)"
date: "2021-08-02"
draft: false
path: "/blog/build-your-own-idea-ready-stop-think-s1-e2"
tags: ["Repository","Git", "BYOI", "S1E2", "SuperSuper"]
---

Let's say that you already have an idea about an application that you would like to build. As engineers we are eager to get our hands dirty and start writing some code, however I would actually advise you not to! It is very important to stop and consider for a moment some of the factors that will determine the future of your application. These may include technical aspects such as the programming language to be used or the overall system architecture, however there are also legal and marketing aspects that we tend to overlook. 

# The repository license
Choosing a license for your repository is very important, since it will determine how your code may be used in the future. Also, in case 
* Not choosing a license
* You might be limited to a specific license based on the libraries that you choose to use
* Can protect you against unauthorized use

When creating a public repository on most Git platforms you are promp

### Disclaimer
This article is based solely on my opinion and (limited) experience on the following topics, and do not intend to provide legal advice. I strongly recommend searching for legal counseling as to the possible implications of the repository license of your choice.

# The domain name
The domain name might be strongly tied to your project name. We need to keep in mind that 
  


If you already have an idea of an application that you would like to build and are eager to start writing some code.
https://choosealicense.com/licenses/
https://opensource.org/licenses
https://github.com/new
https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/licensing-a-repository
https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud

First of all, if you are reading this I want to thank you for joining me on this journey. My goal is to create what I dream will become a self-hostable open source tool that will focus in empowering everyone while grocery shopping. It is a very simple idea that has been on my mind for a while now, so I decided that today I would start building it and use the process to learn about new technologies and tools. I will also try to focus in giving a technical overview of the choices I made while creating this product so that you can replicate the process with any of your own ideas and share it with the world! 🌎 

Please feel free to contact me in case you have any suggestion that you think can contribute to both this idea or the series of articles!

## The Journey
I will update this section whenever I have updates on a new part of the journey, so that you can skip ahead in case you need to.

# The idea
The idea behind this application is to create a tool that empowers users while grocery shopping. It aims to solve the following questions that I think all of us have asked ourselves before:

> * *Might this item be cheaper on a different store?*
> * *Has this item always been so expensive? Or are they trying to scam me?*
> * *Is this discount real, so that I can save by buying in bulk?*
> * *Which presentation of this item would give me a better price/quantity relationship?*
> * *I forgot my grocery list at home...*🤔 *Should I buy milk in case I don't have any?*

These are the basic problems that I would like to solve, however, as the application grows I might add some more such as:

> * *Which recipes can I make with what I currently have at home?*

## The solution
We will solve this issue by creating a web based application with the following components:

![BYOI Overview](/../images/byoi_s1e1_overview.png)


### A progressive web app
A [Progressive Web App](https://web.dev/what-are-pwas/) will be our front end to the application. It will allow users to log into their browser and interact with their information. The tech stack used will be [React](https://reactjs.org/) with [Typescript](https://www.typescriptlang.org/)  

The idea behind using a PWA is so that whenever you are at the supermarket you can use native smartphone functionality such as camera or GPS to interact with the products that you are going to buy. Because I will be working on this project on my free time, the codebase needs to be as slim as possible so that we don't have to rewrite all the functionality just to be able to use it in a smartphone. Creating a PWA will allow me to create functionality faster, maintain less code and also skip the cumbersome app store approvals.

### A serverless backend
To handle all the logic and save user data the backend of this application will be hosted on the cloud. I will use AWS, since I already have experience using Azure and I want to learn something new. Also due to the nature of this small app, I will use a serverless approach, so that I can cut costs down. I will be using Node.js [AWS Lambda](https://aws.amazon.com/lambda/) functions so that I can keep all the source code in the repo in the same language. I also think I will be using the [Serverless framework](https://www.serverless.com/) to be able to version the AWS infrastructure.


## Inspiration
The inspiration to work on this project comes from [SimpleLogin](https://github.com/simple-login) which is a self hostable solution that allows to have multiple email alias so that you can keep your real email address private. I encourage you to go over and take a look at it! Also, the diagrams where created using [Terrastruct](https://terrastruct.com) which is a very flexible diagraming tool for developers.
