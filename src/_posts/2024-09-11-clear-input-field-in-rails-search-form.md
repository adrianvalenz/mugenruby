---
layout: post
title: "Clear input field in Rails search form"
date: 2024-09-04 01:01:01 -0700
categories: rails, stimulus
published: true
template_engine: liquid
---

We are building a simple feature to clear the input field from a search form. 
Often I have seen implemented a "Clear" button that does a simple request to clear
the parameters and reset the search results. However, I like the results from my
previous search to remain while I make a new search. So we are going to use a bit
of Stimulus to implement this feature in our Rails search form with a bit of TailwindCSS
for styling.

## The code

```sh
bin/rails g stimulus clear_form
```

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="clear-form"
export default class extends Controller {
  static targets = [ "input", "clearButton" ]

  connect() {
    this.toggleClearButton();
    console.log("ClearForm controller connected")
  }

  toggleClearButton() {
    if (this.inputTarget.value) {
      this.clearButtonTarget.style.display = "inline";
    } else {
      this.clearButtonTarget.style.display = "none";
    }
  }

  clearInput() {
    this.inputTarget.value = "";
    this.inputTarget.dispatchEvent(new Event('input'));
    this.toggleClearButton();
  }

  inputChanged() {
    this.toggleClearButton();
  }
}

```

```ruby
  <%= form_with url: listings_path, method: :get, local: true do %>
    <div class="relative" data-controller="clear-form">
      <%= text_field_tag :query, params[:query], data: { clear_form_target: "input", action: "input->clear-form#inputChanged" }, id: "searchInput", placeholder: "Search listings...", class: "border p-1 rounded-sm pr-6 w-full" %>
      <span data-clear-form-target="clearButton" data-action="click->clear-form#clearInput" class="cursor-pointer absolute top-1/2 right-2 -translate-y-1/2 hidden">&times;</span>
    </div>
    <%= submit_tag "Search", class: "bg-stone-400 text-stone-100 p-1 rounded-sm" %>
  <% end %>
```

```ruby
  def index
    return @listings = Listing.all unless params[:query].present?

    @listings = Listing.search(params[:query])
  end
```

```erb
<% if @listings.present? %>
  <div class="grid grid-cols-12 gap-4">
    <% @listings.each do |listing| %>
      <div class="col-span-6 md:col-span-3">
        <%= render ListingCardComponent.new(listing:) %>
      </div>
    <% end %>
  </div>
<% else %>
  <div>There are no listings yet</div>
<% end %>
```

## The explanation

We start off by generating the Stimulus controller to handle all the JavaScript logic. 
Using Stimulus will allow us to reuse this code on different forms by allowing us
to add the `data` attributes to the HTML instead of our JavaScript looking for a specific
`id` value on the HTML elements.

In our Stimulus controller we set up the targets on the HTML elements we want to focus on.
In this case it is just the input search field and the `span` tag that will be the button.

As soon as our controller connects to the page it runs `toggleClearButton()` which checks to see
if there is a value in the input field. If there is then display the button inline, hide
if not.

The `inputChanged()` function runs when a user types in the field as indicated by the `data-action`
attribute on the form's HTML. Now when there is a value that exists in the input field, the button
appears and when you click it will clear the form by setting the value to `""`.

The `ListingsController` returns the searched query in the `index` action or all listings if
there isn't a term in the parameters. The listings are rendered by the following HTML/ERB code.
