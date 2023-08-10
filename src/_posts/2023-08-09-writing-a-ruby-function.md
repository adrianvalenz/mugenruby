---
layout: post
title: "Creating a Ruby Method"
date: 2023-08-09
categories: ruby
template_engine: liquid
published: false
---

We are going to create a method that reverses a string...ready? Let's go!

Let's wrap a string in a variable and call the method to reverse it.

```ruby
greeting = "Hello world"

greeting.reverse
```

There, we did it! ...just kidding. 

Reversing the string, like other operations are pretty easy to do. Anyone can write code,
but writing code that communicates well is really important.

Let's create a method that reverses a string and let's be clear about how we
name it to indicate it's function.

```ruby
# First refactor
def reverse_text(string)
  puts string.reverse
end
```

So at this point, technically speaking, we created our function with it's sole purpose of reversing a string.
But what if something other than a string gets passed? 

```
./reverse.rb:30:in `reverse_text': undefined method `reverse' for 4:Integer (NoMethodError)

    puts string.reverse
               ^^^^^^^^
        from ./reverse.rb:37:in `<main>'
```

Ruby will let you know that there is no method available to reverse an integer. Because our function is 
really simple of course we know we would have to pass in a string, but if our logic was more complex, how
can we build out this method to communicate to the developer as clear as possible? Let's create some logic
that checks it is a string!

```ruby
# Second refactor
def reverse_text(string)
  if string.is_a? String
    puts string.reverse
  else
    "Please enter a string"
  end
end
```

Hey that's a bit better. The function now checks to see if the `text` passed is actually a string object, and if it 
is not, it let's you know to pass in a string. It's hard to imagine we need more than this, being just a function
that reverses a string, but again, let's say we are building out something with really complex logic, how can we
make this more clear?

```ruby
# Third refactor
def reverse_text(string)
  if string.is_a? String
    puts string.reverse
  else
    raise StandardError, "Please enter a string"
  end
end
```

Raising in error in a program has advantages in a program over just printing out that we needed to enter a 
string or whatever message we want to communicate to the user. Some advantages to raising errors are:

- **Halts the program:** Printing out a statement won't interrupt the flow of the app, so if something goes
wrong, we want to know about it.

- **Greater clarity:** Ruby's built-in exception classes can carry more information other than what we wrote in
our print statement, such as details about where the error occurred, how to possibly fix it, and more information
about what caused it.

- **Keep an eye on it:** Ideally you have error tracking implemented with your app, so when the program fails these
unhandled exceptions get logged. This allows you to track and monitor them to ensure they aren't happening again
once you address them, very important in production systems.

We can get even more clear about the error. Here is another refactor:

```ruby
# Fourth refactor
def reverse_text(string)
  if string.is_a? String
    puts string.reverse
  else
    raise ArgumentError, "Expected a string, but recieved #{string.class.name}."
  end
end
```

Here we specify that it is an argument error, which is a lot more specific than a general
standard error. We also let the user know what was actually passed in if not a String object.

So this is looking pretty good...let's make it better. We are Rubyists <3 and we love the
expressiveness and conciseness that can be achieved with our language. Let's make this
method more Rubyish!

```ruby
# Fifth refactor
def reverse_text(string)
  raise ArgumentError, "Expected a string, but recieved #{string.class.name}." unless string.is_a?(String)

  string.reverse
end

```

Oh yeaaaah. That's nice. Very succinct!

I also want to note in case we need to do anything with the output (save it, process further, etc.) and
because Ruby automatically returns the last line of code in a method, we can omit `return` and allow the 
developer to do what they wish with the result. An example of how this might be used along with all
the code follows below:

```ruby
# Final code

def reverse_text(string)
  raise ArgumentError, "Expected a string, but recieved #{string.class.name}." unless string.is_a?(String)

  string.reverse
end

greeting = "Hello Earth"

puts reverse_text(greeting)
```

This is looking pretty good. The method not only follows the first SOLID principle of Single Responsibility, 
but looks for exceptions and returns the value instead of limiting it to printing out the value with `puts`. Don't
forget to back your methods up with tests!

Thank you for reading!
