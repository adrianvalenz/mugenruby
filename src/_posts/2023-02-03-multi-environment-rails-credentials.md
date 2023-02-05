---
layout: post
title: "What's the secret about Rails credentials? Let's .dig in"
date: 2023-02-02 23:00:23 -0800
categories: rails
---

Gone are the not so ENVious days of storing your secrets in `.env` files, sharing those files with teammates via cumbersome password managers, and dealing with keeping everyone's environment variables up to date across multiple dev machines.

Rails Credentials is an efficient way of safeguarding sensitive information such as API keys, database passwords, and other confidential data like tokens and more by storing it in an encrypted file that can be safely kept in source control. My favorite feature about Rails Credentials is that you can have encrypted files scope to multiple environments.

Fun facts:

- Rails 5.2 adds a feature called `credentials` to replace their prior solution call `secrets`
- Rails 6 added support for multi environment credentials
- To encrypt/decrypt credential files, Rails look for a `config/master.key` file or an environment variable named `RAILS_MASTER_KEY` with the value of the key found in the `config/master.key` file
- `.dig` allows to to chain keys in a Hash to extract the value last nested key. If any of the keys in the sequence are not found, it returns `nil` instaead of a `NoMethodError` like you would if you chained calls to the `[]` operator or `.fetch` method
- Rails looks first for `RAILS_MASTER_KEY` env variable, then an environment specific credentials file (`config/credentials/development.key`), then finally the global master key (`config/master.key`) 
