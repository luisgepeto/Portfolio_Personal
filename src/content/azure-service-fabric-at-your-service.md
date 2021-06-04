---
title: "Azure Service Fabric at your service"
date: "2021-05-11"
draft: false
path: "/blog/azure-service-fabric-at-your-service"
tags: [".NET", "Azure Service Fabric", "Microservices", "Docker"]
---

![Azure Service Fabric Logo](/../images/azure-service-fabric-at-your-service.jpg)
For the past year the team that I am working with has been using Service Fabric as a vital piece of their product architecture. I would like to share with you some background information on what is Azure Service Fabric, as well as my experience throughout this year working with it.

# What is Azure Service Fabric?
Azure Service Fabric is a platform used to manage and develop microservices. It is open source and a proven technology, since it powers Microsoft Azure services.

## Some of Azure Service Fabric features 

Some of the features that we have been using on our project are the following. I add some helpful links directly to MSDN if you wish to know more.

* [Stateful services](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-reliable-services-introduction#stateful-reliable-services)
* [Stateless services](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-reliable-services-introduction#stateless-reliable-services)
* [Actors](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-reliable-actors-introduction)
* [Service remoting](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-reliable-services-communication-remoting)
* [Docker container orchestration](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started-containers-linux)

##  Advantages and cool stuff
Azure Service Fabric has given us a lot of cool and fun stuff to learn in the project, as well as the opportunity to experiment (which has resulted in both success and failures). These are some of the advantages that using Service Fabric in our project has given us:

### Cloud native approach 
Azure Service Fabric has given us the opportunity to work closer to the cloud and using some other Azure cloud services (mainly Service Bus Queues and Topics, but also Azure Container Registry).

### Microservices
Since the microservices paradigm is  the core of Azure Service Fabric, we have had the chance to learn more about how to accomodate our business logic to respond to a microservice infrastructure. We have tried to embrace eventual consistency and make sure that any operations on our services due to the updates in other pieces of the system result are idempotent

### Containers
We have the opportunity to experiment with Service Fabric container orchestration (although this approach was later updated). Right now we do interact with docker containers running in each of the Service Fabric nodes, but through a custom approach  and not the native Service Fabric functionality

### Transparent integration among services
Thanks to Service Fabric remoting hooking up services with one another is very easy. As developers this is a huge time saver and simplifies a lot of tasks such as setting up a communication protocol and logic. This is all handled by Service Fabric which automatically sends data to the instance through a reverse proxy. Getting an instance of a running service is as easy as writing the next line:

```csharp
IMyService _myService = ServiceProxy.Create(new Uri("fabric:/MyApplication/MyService")); 
```

## Some of Azure Service Fabric drawbacks
Along our way in the project we have identified some drawbacks of an architecture that is highly dependent on Service Fabric such as:

### Core functionality is massive
Since Service Fabric aims to manage scalable solutions, it has a massive offer of core functionality.  This results in a steep learning curve (see next point). It also can result in a 'development paralysis' since a problem can be solved in many multiple ways. Deciding which is the best for the project is not straightforward and Service Fabric does not make this task easier. In our project we have had to rewrite code many times because the initial solution was not the appropriate one. 

### Steep learning curve
Even if working on the project daily has given us a basic understanding of core functionality, there are a lot of tangential technical concepts that we needed to understand in order to get the most out of a Service Fabric architecture. Some of them are:
* Microservices architecture
* Serialization concepts (WCF serialization)
* Actor model pattern
* Multithreading and stateful programming

### Longer time to market
The complexity of Service Fabric results in longer development time to make sure that everything works as expected. This results in a longer time to market versus a regular monolithic approach.

## Where can you start to use Azure Service Fabric in your project
If you are interested in learning more regarding Azure Service Fabric here is a quick start up guide that can be helpful

* [Service Fabric & Microservices Intro](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-overview-microservices)
* [Setup your development environment to start using Service Fabric](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started)
* [A small test application to test Service Fabric capabilities](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-quickstart-dotnet)