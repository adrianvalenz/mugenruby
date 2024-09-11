---
layout: post
title: "Building a Commitment Calculator with Test-Driven Development"
date: 2023-01-30
published: false
categories: rails
---

Here is a fun little test where we create a service object that calculates the highest commitment from an array of prices. The service needed to take in an array of prices, sort them from highest to lowest, multiply each number by its rank, and then return the highest commitment. We are going code two different implementations of this and we will be using RSpec to ensure our code works as expected. I have created two tests: `commitment_calculator_one_spec.rb` and `commitment_calculator_two_spec.rb`.

## A look at method one

This is the first test:

```ruby
require 'rails_helper'

RSpec.describe CommitmentCalculatorOne, type: :model do
  describe "#call" do
    context "No bid prices" do
      it "returns 0 commitment" do
        bid_prices = []
        commitment = CommitmentCalculator.call(bid_prices)
        expect(commitment).to eq(0)
      end
    end

    context "first array of prices" do
      it "returns highest commitment" do
        bid_prices = [120, 130, 110, 180]
        commitment = CommitmentCalculator.call(bid_prices)
        expect(commitment).to eq(440)
      end
    end

    context "second array of prices" do
      it "returns highest commitment" do
        bid_prices = [150, 450, 110, 500]
        commitment = CommitmentCalculator.call(bid_prices)
        expect(commitment).to eq(900)
      end
    end

    context "third array of prices" do
      it "returns highest commitment" do
        bid_prices = [150, 150, 500, 110]
        commitment = CommitmentCalculator.call(bid_prices)
        expect(commitment).to eq(500)
      end
    end
  end
end
```

This spec is going to ensure that if no prices are passed, it will return zero, but if an array of prices is passed, it will return the highest commitment. We have an expected output for each array. Let's start to look at the first implementation. 

It's natural to think about the process and try to break it down step by step. Based on what we need the algorithm to do, we need to:

1. Return 0 if there are no prices
2. Sort the prices from highest to lowest
3. Multiply each price by its rank
4. Return the highest commitment

I see the possibility for 4 methods there, but considering a service object should have one public method, we'll need to create a few private methods as well. A service object should do one thing and do it well, which is why we are going to implement a public `#call` method, and a few private methods to perform some of the other operations.

```ruby
class CommitmentCalculatorOne < ApplicationService
  def initialize(bid_prices)
    @bid_prices = bid_prices
    @results = []
  end

  def call
    if bid_prices.empty?
      0
    else
      sort_prices
      rank_prices
      highest_commitment
    end
  end

  private

  attr_reader :bid_prices

  def sort_prices
    @bid_prices = bid_prices.sort.reverse
  end

  def rank_prices
    bid_prices.each_with_index do |number, id|
      result = (id + 1) * number
      @results.push(result)
    end
  end

  def highest_commitment
    @results.max
  end
end
```

Alright! So this code is defining our Ruby class `CommitmentCalculatorOne` which is our first implementation of our calculator. It has an `initialize` method that takes in a argument for the prices and stores them in an instance variable. It also initializes and empty array to store our results.

The `call` method is the entry point for our service, returning `0` if the array is empty, otherwise calling the private methods.

The `sort_prices` methods sorts the prices in descending order. The `rank_prices` goes through each price, multiplies the price by its ranking, as found via the `each_with_index` method, and then pushes the result back to the `@results` array. 

Finally, the `highest_commitment` method just returns the highest number in the array.

Now this is cool, it works. There is nothing wrong with it, but it can be different...more _Ruby-ish_...

I'll skip pasting the second spec since it is pretty much identical other than the name...so let's just get straight to the second implementation.

## A look a method numero dos

```ruby
class CommitmentCalculatorTwo
  def self.call(prices)
    return 0 if prices.empty?

    ranked_commitments(prices).max
  end

  private_class_method def self.ranked_commitments(prices)
    prices.sort.reverse.map.with_index(1) do |price, ranking|
      price * ranking
    end
  end
end
```

It's amazing how elegant and succinct our program can be! Here the `call` action simply returns `0` if the array is empty, and if it is not then it runs the private class method `ranked_commitments(prices)` with the prices being passed down as a parameter to be sorted, mapped through, and return with the highest commitment.

I created a repo with the following code so anyone can clone/fork it for those that want to play around with it and get familiar with what's going on. You can find it here: [Commitment Calculator](https://github.com/adrianvalenz/commitmentcalculator)

I'd like to give credit to Stuart P. for sharing this implementation with me a while back! Hope it helps other look at your Ruby code and think "How else can I write this?"
