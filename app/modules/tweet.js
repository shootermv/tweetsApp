define([
  "namespace",
  "use!backbone",


//template
  'text!templates/tweets/ListItem.html',
  "modules/comments"
],

function (namespace, Backbone, ListItemtTemplate, comment) {

    var Tweet = namespace.module();



    // Tweet Model
    Tweet.TweetModel = Backbone.Model.extend({
        defaults: {
            "item_id": null,
            "title": "",
            "user": ""
        }
    });

    // Tweet Collection
    Tweet.Collection = Backbone.Collection.extend({
        model: Tweet.TweetModel,
        url: "http://hndroidapi.appspot.com/newest/format/json/page/?appid=&callback=?",
        //overriding 'parse'
        parse: function (data) {
            return data.items;
        }
    });


    // Tweet View
    Tweet.Views.List = Backbone.View.extend({

        tagName: "section",
        className: "track",
        id: 'design',
        render: function (done) {
            var view = this;

            $(view.el).append('<h2>News</h2>');
            var counter = 0;
            _.each(view.collection.models, function (tweet) {
                if (counter++ < 10) {//only 10
                    if (tweet.get('title') != 'NextId')//tweet.get('comments') != 'discuss' && 
                        $(view.el).append(new Tweet.Views.TweetListItemView({ model: tweet }).render().el);
                }
            }, this);



            if (_.isFunction(done)) {
                done(view.el);
            }

        }
    });


    // Tweet ListItem View
    Tweet.Views.TweetListItemView = Backbone.View.extend({
        template: "app/templates/tweets/listItem.html",
        tagName: "article",
        className: "vcard session-info",
        events: {
            'click': 'clickTweet'
        },
        clickTweet: function (event) {
            var self = this;



            if (this.commentsList == null) {
                $('.session> div', $(self.el)).html('<div class="loading"><img src="loading.gif"></div>');
                $(self.el).toggleClass('active');



                /*

                //for testing:
                this.commentsList = new comment.CommentCollection([{ "username": "simonsarris", "comment": "I but only enough to understand how to use an image instead of a wireframe.", "time": "4 days ago", "children": [{ "username": "simonsuu", "comment": "gogo", "time": "4 days ago", "children": [] }, { "username": "simonsuu", "comment": "fafafa dada", "time": "4 days ago", "children": []}] }, { "username": "ttonsuu", "comment": "fte sdgddff", "time": "4 days ago", "children": []}])
                this.commentsList.meta('tweet_id', this.model.get('item_id'));

                $('.session> div', $(self.el)).html(new comment.CommentsListView({ model: self.commentsList }).render().el);
                */


                this.commentsList = new comment.CommentCollection();
                this.commentsList.meta('tweet_id', this.model.get('item_id'));


                this.commentsList.fetch({
                    success: function (comments) {

                        if (comments.length == 0) {
                            $('.session> div', $(self.el)).html('<ul class="comment-list"><li>no comments yet...</li></ul>');
                        }
                        else {

                            $('.session> div', $(self.el)).html(new comment.CommentsListView({ model: self.commentsList }).render().el);
                        }

                    }

                });

            }
            else {
                $(self.el).toggleClass('active');
            }
        },
        render: function (done) {

            var view = this;

            view.el.innerHTML = _.template(ListItemtTemplate, { tweet: view.model.toJSON() });

            return view;
        }


    })
    // Required, return the module for AMD compliance
    return Tweet;

});