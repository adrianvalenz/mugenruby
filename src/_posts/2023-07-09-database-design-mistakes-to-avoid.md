---
layout: post
title: "Database Design Mistakes To Avoid"
date: 2023-07-09 13:00:23
categories: database
template_engine: liquid
published: false
---

**Designing databases in web applications is one of the most serious aspects of web development.** 

Just like you don’t hire a contractor to build your house and expect them to start pouring out the 
foundation the next day, so should web developers not be expected to start coding and build an app 
without proper planning and blueprints.

Before diving into code, planning out the relationships of the models in the schema is a critical 
foundation for how the rest of the process will go. If you do not spend that time upfront planning
the database structure, you may make some common database design mistakes due to oversight.

Designing the database requires thoughtful consideration about the business so how the database 
is structured will allow the business to manage that data through the app you build for them in 
a way that adds value to them.

1. Using a business related field as the Primary Key

Let's say we have an `offices` table and each office had a unique business license


| col | col2 |
|:----|:-----|
|this |thatld|

