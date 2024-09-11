---
layout: post
title: "Full-text search with AWS Opensearch in Rails"
date: 2024-09-04 01:01:01 -0700
categories: rails
published: false
template_engine: liquid
---

Implementing Opensearch in a Rails 7 app
- Install OpenSearch on your Mac
- 
- Setup OpenSearch for production with Bonsai

## Install OpenSearch on your Mac

We are going to start by installing OpenSearch locally on your dev machine. We are assuming
that we have a model to work with. I have a model called `Listing` with attributes `title:string`
and `description:text`.

Run `brew install opensearch` and then `brew services start opensearch`.

To your Gemfile add:

```ruby
gem "searchkick"
gem "opensearch-ruby"
```

In your model (mine is called "Listing")

```ruby
class Listing < ApplicationRecord
    searchkick
end
```

and in your Rails console run `Listing.reindex` to add data to your index. It should return `true`


Let's start by installing Opensearch in our dev environment. Open up the terminal on your
mac and type: `brew install opensearch` then `brew services start opensearch`

- Add these to your gemfile, run bundle install:

```ruby
gem "searchkick"
gem "opensearch-ruby"
```

- If you have a model called `Listing` and the `searchkick` method to it like this:

```ruby
class Listing < ApplicationRecord
    searchkick
end
```

- Don't forget to restart your server

- Got into your rails console (`bin/rails console`) run `Listing.reindex` and you should see an output like this:
```
irb(main):001> Listing.reindex
  Listing Load (0.5ms)  SELECT "listings".* FROM "listings" ORDER BY "listings"."id" ASC LIMIT $1  [["LIMIT", 1000]]
=> true
```

- Create a bonsai account and spin up a cluster
- Grab the Full Access URL from the Credential link on the sidebar
- In your Rails encrypted credentials:

```yaml
opensearch:
    url: "https://your@full-access-url.bonsaisearch.net:443"
```

- In your `config/initializers/` directory make a file called `opensearch.rb` and paste in:

```ruby
# https://github.com/ankane/searchkick?tab=readme-ov-file#self-hosted-and-other
ENV["OPENSEARCH_URL"] = Rails.application.credentials.opensearch[:url]
```
- If you are on Heroku, run a console and from bash run `bin/rake searchkick:reindex:all`

At this point, OpenSearch should be configured to run locally and on your production server
