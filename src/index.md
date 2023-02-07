---
# Feel free to add content and custom Front Matter to this file.

layout: home
---

<ul>
  <% collections.posts.resources.reverse.each do |post| %>
    <li class="flex items-center space-x-4 border-b py-2">
      <span class="uppercase font-bold text-xs text-slate-400"><%= post.data.date.strftime("%d %b %Y") %></span>
      <a href="<%= post.relative_url %>" class="font-serif font-normal tracking-wide text-lg hover:text-slate-500"><%= post.data.title %></a>
    </li>
  <% end %>
</ul>

<!-- If you have a lot of posts, you may want to consider adding [pagination](https://www.bridgetownrb.com/docs/content/pagination)! -->
