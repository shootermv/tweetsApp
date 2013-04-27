define([
  "namespace",
  "use!backbone",
//template
  'text!templates/tweets/CommentsItem.html'
],

function (namespace, Backbone, ListItemtTemplate) {

    var Comment = namespace.module();

    Comment.Comment = Backbone.Model.extend({

        defaults: {
            "username": "",
            "comment": ""
        }
    });

    //Collections  

    Comment.CommentCollection = Backbone.Collection.extend({
        model: Comment.Comment,
        url: function () {

            return 'http://hndroidapi.appspot.com/nestedcomments/format/json/id/' + this._meta['tweet_id'] + '?appid=&callback=?'
        },
        //overriding 'parse' because we to get data.items inside data param of success
        parse: function (data) {
            return data.items;
        },
        initialize: function () {

            this._meta = {};
        },
        //for been able to set prop of the collection
        meta: function (prop, value) {
            if (value === undefined) {
                return this._meta[prop]
            } else {
                this._meta[prop] = value;
            }
        }
    });


    //Views	::
    Comment.CommentsListView = Backbone.View.extend({

        tagName: 'ul',
        className: 'comment-list',
        initialize: function () {
            this.model.bind("reset", this.render, this);
        },

        render: function (eventName) {
            var counter = 0;
            //displaying comments:
            _.each(this.model.models, function (comment) {
                if (counter++ < 10) {
                    var comment_li = new Comment.CommentsListItem({ model: comment }).render().el;
                    $(this.el).append(comment_li);

                    //if there are sub comments
                    var children = comment.get('children');
                    if (children.length > 0)
                        $(comment_li).append(new Comment.CommentsListView({ model: new Comment.CommentCollection(children), className: 'children' }).render().el);

                }

            }, this);
            return this;
        }

    });

    //list item
    Comment.CommentsListItem = Backbone.View.extend({

        tagName: 'li',
        className: 'comment',
        template: "app/templates/tweets/CommentslistItem.html",
        render: function (eventName) {


            var view = this;

            view.el.innerHTML = _.template(ListItemtTemplate, view.model.toJSON());

            return view;
        }
    });


    return Comment;
});