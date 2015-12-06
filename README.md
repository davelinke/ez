# ez
A jQuery based single page router that foucses on proper UI transitioning

ez tries to fill the gaps when you'd like to create a single page application by relying on jQuery.
If your app wants to rely on a more solid MV* structure you might want to check other libraries such as AngularJS, Backbone or Ember.

The routing is declared with a javascript object that governs the funcitoning of the application (see js/scripts.js for example).

You can use simple html decalred directly within the object to render the required route. You can also declare the url of html templates to link them to a specific route and you can also declare a more complex function to render a route. There is a ajax/handlebars example available for you to check out.

Also you can declare hooks to execute before and after each route has been called, theese are appended to the regular jquery hooking methods ("on" event).

The script relies on transition ending to jump from one place to the other. To create your transitions follow the structure declared on the CSS file. There is also a Sass SCSS file with mixins that will ease your CSS scripting.

Check the example at http://davelinke.com/ez

Enjoy.
