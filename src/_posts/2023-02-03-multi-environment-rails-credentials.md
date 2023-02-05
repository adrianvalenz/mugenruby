---
layout: post
title: "What's the secret about Rails credentials? Let's .dig in"
date: 2023-02-02 23:00:23 -0800
categories: rails
template_engine: liquid
---

Gone are the not so ENVious days of storing your secrets in `.env` files, sharing those files with teammates via cumbersome password managers, and dealing with keeping everyone's environment variables up to date across multiple dev machines.

Rails Credentials is an efficient way of safeguarding sensitive information such as API keys, database passwords, and other confidential data like tokens and more by storing it in an encrypted file that can be safely kept in source control. My favorite feature about Rails Credentials is that you can have encrypted files scope to multiple environments.

Fun facts:

- Rails 5.2 adds a feature called `credentials` to replace their prior solution call `secrets`
- Rails 6 added support for multi environment credentials
- To encrypt/decrypt credential files, Rails look for a `config/master.key` file or an environment variable named `RAILS_MASTER_KEY` with the value of the key found in the `config/master.key` file
- `.dig` allows to to chain keys in a Hash to extract the value last nested key. If any of the keys in the sequence are not found, it returns `nil` instaead of a `NoMethodError` like you would if you chained calls to the `[]` operator or `.fetch` method
- Rails looks first for `RAILS_MASTER_KEY` env variable, then an environment specific credentials file (`config/credentials/development.key`), then finally the global master key (`config/master.key`) 
- `bin/rails credentials:help` has more cool info.


## Using Rails Credentials

The `config/credentials.yml.enc` holds all your sensitive data; The `config/master.key` can encrypt/decrypt the credentials file so you can edit it. They are generated together when you run `EDITOR="code --wait" bin/rails credentials:edit` where "code" refers to VSCode (you can pass in any command to start up your editor. i.e. mate, mvim, etc). 

If you ever try to edit the credentials and the master key is not present it will look for `ENV[RAILS_MASTER_KEY]` variable. Why wouldn't the `config/master.key` be present you ask? It is not supposed to be committed into source control. The value of the master key needs to be shared with team members using a secured password manager or the like. Since it is not in the source, you need to configure the key in your environment (`heroku config:set RAILS_MASTER_KEY=1234asdf5678hjkl` for example).

Let's use the common configuration of an AWS S3 bucket to get an idea of how credentials work.

`config/storage.yml`:

```ruby
# Use bin/rails credentials:edit to set the AWS secrets (as aws:access_key_id|secret_access_key)
amazon:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: us-west-2
  bucket: images-bucket-<%= Rails.env %>
```

