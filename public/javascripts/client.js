$(document).ready(function() {  // for HTML elements ready to precess

    // Model
    var Todo = Backbone.Model.extend({
      idAttribute: "_id",

      defaults: {
        content: "empty todo...",
        done: false
      },

      initialize: function() {
        _.bindAll(this, 'toggle', 'clear'); // specify method running context

        if (!this.get("content")) {
          return this.set({
            content: this.defaults.content
          });
        }
      },

      toggle: function() {
        return this.save({
          done: !this.get("done")
        });
      },

      clear: function() {
        this.destroy();
        return this.view.remove();
      }
    });

    // Collection
    var TodoList = Backbone.Collection.extend({
      model: Todo,

      url: '/todos',

      initialize: function() {
        _.bindAll(this, 'done', 'remaining', 'nextOrder', 'comparator'); // specify method running context
      },

      done: function() {
        return this.filter(function(todo) {
          return todo.get('done');
        });
      },

      remaining: function() {
        return this.without.apply(this, this.done());
      },

      nextOrder: function() {
        if (!this.length) {
          return 1;
        }
        return this.last().get('order') + 1;
      },

      comparator: function(todo) {
        return todo.get('order');
      }
    });
    var Todos = new TodoList();

    // Model View
    var TodoView = Backbone.View.extend({
      tagName: "li",

      template: _.template($("#item-template").html()),

      events: {
        "click .check": "toggleDone",
        "dblclick div.todo-content": "edit",
        "click span.todo-destroy": "clear",
        "keypress .todo-input": "updateOnEnter"
      },

      initialize: function() {
        _.bindAll(this, 'render', 'setContent', 'toggleDone', 'edit', 'close', 'updateOnEnter', 'remove', 'clear'); // specify method running context

        this.model.bind('change', this.render);
        return this.model.view = this;
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        this.setContent();
        return this;
      },

      setContent: function() {
        var content;
        content = this.model.get('content');
        this.$('.todo-content').text(content);
        this.input = this.$('.todo-input');
        this.input.bind('blur', this.close);
        return this.input.val(content);
      },

      toggleDone: function() {
        return this.model.toggle();
      },

      edit: function() {
        $(this.el).addClass("editing");
        return this.input.focus();
      },

      close: function() {
        this.model.save({
          content: this.input.val()
        });
        return $(this.el).removeClass("editing");
      },

      updateOnEnter: function(e) {
        if (e.keyCode === 13) {
          return this.close();
        }
      },

      remove: function() {
        return $(this.el).remove();
      },

      clear: function() {
        return this.model.clear();
      }
    });

    // Application View (for collection)
    var AppView = Backbone.View.extend({
      el: $("#todoapp"),

      statsTemplate: _.template($('#stats-template').html()),

      events: {
        "keypress #new-todo": "createOnEnter",
        "keyup #new-todo": "showTooltip",
        "click .todo-clear a": "clearCompleted"
      },

      initialize: function() {
        _.bindAll(this, 'render', 'addOne', 'addAll', 'newAttributes', 'createOnEnter', 'clearCompleted', 'showTooltip'); // specify method running context

        this.input = this.$("#new-todo");
        Todos.bind('add', this.addOne);
        Todos.bind('reset', this.addAll);
        Todos.bind('all', this.render);
        return Todos.fetch();
      },

      render: function() {
        return this.$('#todo-stats').html(this.statsTemplate({
          total: Todos.length,
          done: Todos.done().length,
          remaining: Todos.remaining().length
        }));
      },

      addOne: function(todo) {
        var view;
        view = new TodoView({
          model: todo
        });
        return this.$('#todo-list').append(view.render().el);
      },

      addAll: function() {
        return Todos.each(this.addOne);
      },

      newAttributes: function() {
        return {
          content: this.input.val(),
          order: Todos.nextOrder(),
          done: false
        };
      },

      createOnEnter: function(e) {
        if (e.keyCode !== 13) {
          return null;
        }
        Todos.create(this.newAttributes());
        return this.input.val('');
      },

      clearCompleted: function() {
        var todo, _fn, _i, _len, _ref;
        _ref = Todos.done();
        _fn = function(todo) {
          return todo.clear();
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          todo = _ref[_i];
          _fn(todo);
        }
        return false;
      },

      showTooltip: function(e) {}
    });

    window.App = new AppView();

});