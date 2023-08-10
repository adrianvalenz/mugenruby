---
layout: post
title: "What's the secret about Rails credentials? Let's .dig in"
date: 2023-02-02 23:00:23
categories: rails
template_engine: liquid
---

Gone are the not so ENVious days of storing your secrets in `.env` files, sharing those files with teammates via cumbersome password managers, and dealing with keeping everyone's environment variables up to date across multiple dev machines.

Rails Credentials is an efficient way of safeguarding sensitive information such as API keys, database passwords, and other confidential data like tokens and more by storing it in an encrypted file that can be safely kept in source control. My favorite feature about Rails Credentials is that you can have encrypted files scope to multiple environments.

Fun facts:

- Rails 5.2 adds a feature called `credentials` to replace their prior solution call `secrets`
- Rails 6 added support for multi environment credentials
- To encrypt/decrypt credential files, Rails look for a `config/master.key` file or an environment variable named `RAILS_MASTER_KEY` with the value of the key found in the `config/master.key` file
- `.dig` allows to to chain keys in a Hash to extract the value of the last nested key. If any of the keys in the sequence are not found, it returns `nil` instead of a `NoMethodError` like you would find if you chained calls to the `[]` operator or `.fetch` method
- Rails looks first for `RAILS_MASTER_KEY` env variable, then an environment specific credentials file (`config/credentials/development.key`), then finally the global master key (`config/master.key`) 
- `bin/rails credentials:help` has more cool info.


## Using Rails Credentials

The `config/credentials.yml.enc` holds all your sensitive data; The `config/master.key` can encrypt/decrypt the credentials file so you can edit it. If they don't exist, they are generated together when you run `EDITOR="code --wait" bin/rails credentials:edit` where "code" refers to VSCode (you can pass in any command to start up your editor. i.e. mate, mvim, etc). 

If you ever try to edit the credentials and the master key is not present it will look for `ENV[RAILS_MASTER_KEY]` variable in your project or environment. Why wouldn't the `config/master.key` be present you ask? It is not supposed to be committed into source control. The value of the master key needs to be shared with team members using a secured password manager or the like. Since it is not in the source, you would need to configure the key in your environment (`heroku config:set RAILS_MASTER_KEY=1234asdf5678hjkl` for example).

When you open the credentials file you'll see this by default:

```
# aws:
#   access_key_id: 123
#   secret_access_key: 345

# Used as the base secret for all MessageVerifiers in Rails, including the one protecting cookies.
secret_key_base: 51fa50cfa57f668d4f...string that goes on forever
```

## Multi environment credentials

Let's use the common configuration of an AWS S3 bucket to get an idea of how credentials work within different environments. 

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

Here we have one file to assign our AWS credentials. The Ruby code is pointing to the credentials file and using the `.dig` method to extract the values of the `:access_key_id` and `:secret_access_key`. Depending on which environment you start your Rails server, it will look for the credentials scope to that environment. To get a better idea lets create a credentials file now for `development` environment by passing it in our credentials command. In your terminal run:

`EDITOR="code --wait" bin/rails credentials:edit --environment=development`

This will create two files: `config/credentials/development.yml.enc` and `config/credentials/development.key`. This structure is just like the default credentials and master key but scoped to the environments conveyed by their filename. So now when we run our Rails server in development mode, any AWS credentials you might have set up for development/testing purposes will be extracted from this development credentials file. When you pass the production flag, like when deploying, it will look for the global credentials file at the root of the config folder or a `config/credentials/production.yml.enc` file if you specified it.

As you can see, this is a great way to keep all your environment variables, passwords, and other sensitive data packaged up with the project, always up to date, and protected with encryption. Just make sure to keep the master key safe somewhere or else you won't be able to open up the credentials file and will have to regenerate a new one and start all over.

Hope this brought some insight into Rails Credentials for those who may not have been familiar with it before. Thank you for reading!
