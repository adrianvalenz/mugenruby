---
layout: post
title: "Backblaze B2 Cloud Storage with Rails"
date: 2024-01-13 01:01:01 -0700
categories: ruby
published: true
template_engine: liquid
---

Backblaze B2 is a great alternative to setting up cloud storage or AWS overwhelming console.
In this write up I go over some simple steps to get Backblaze working on your Rails 7 app within minutes.


## Overview of Steps:
1. Create Backblaze account and create bucket named after your app and enviroment
2. Create application keys for bucket by filling out form
3. Save the keys into Rails credentials
4. Install `aws-sdk-s3` gem
5. Update `config/storage.yml`
6. Create an initializer file for AWS
7. Update `config/environents/production.rb`


## The steps

After you have set up your Backblaze account, create a bucket and name
it "appname-production" after your app or something that makes sense for your project.

Then in the left column you'll see a link "Application Keys" and that is
where you will click to create a set of keys specifice to your bucket.

Find the "Add a New Application Key" button and fill out these fields:

- **Name of key (keyName)**: appname-production-key
- **Allow access to Bucket(s)**: Select the bucket you just created
- **Type of Access**: Read and Write
- **Allow List All Bucket Names**: I checked it because we'll be using the S3 API
- I left the rest blank if it was optional (File Name Prefix and Duration)

Click "Create New Key" and save the `keyID` and the `applicationKey`. Now we'll take
this time to add the keys to our Rails credentials. Since we are going to be
using the AWS S3 api I just left my credential file looking like this:

```yaml
aws:
  access_key_id: (keyID - replace with your own)
  secret_access_key: (applicationKey - replace with your own)
```

As the snippet states, match up `access_key_id` with `keyID` and `secret_access_key` to `applicationKey`.

Now we will install the `aws-sdk-s3` gem. Add this to your `Gemfile`:

```ruby
gem 'aws-sdk-s3', require: false
```

Open up your `config/storage.yml` file now and add this:

```yaml
amazon:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: us-east-005
  bucket: appname-<%= Rails.env %>
```

If you go back to the page with the list of your buckets, you can see the region of your
bucket in the url listed as the Endpoint. Looks something like: "s3.us-east-005.backblazeb2.com"

Open up your `config/initializers/aws.rb` and add this:


```ruby
require 'aws-sdk-core'

Aws.config.update({
  region: 'us-east-005', # Replace with your AWS region
  endpoint: 'https://s3.us-east-005.backblazeb2.com', # Replace with your S3 endpoint URL
  credentials: Aws::Credentials.new(Rails.application.credentials.dig(:aws, :access_key_id), Rails.application.credentials.dig(:aws, :secret_access_key))
})

```

And finally `config/environments/production.rb`:

```ruby
# Store uploaded files on the local file system (see config/storage.yml for options).
config.active_storage.service = :amazon
```

After these steps you should be able to upload images to your cloud storage with ActiveStorage. Don't forget to add your Rails master key
in your environment so your app can decrypt the credentials in production!

