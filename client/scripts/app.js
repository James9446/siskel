///MODELS   vvv
var Movie = Backbone.Model.extend({  //Individual movie model

  defaults: {
    like: true //determining which image to attach to the individual View
  },

  toggleLike: function() {
    // your code here
    //change the like to opposite of its current state
    let changedLikeStatus = !this.get('like');
    this.set('like', changedLikeStatus); //to change the state
  },
  
  // this.on('change', function(){
  //   this.collection.sort()
  // });

});

var Movies = Backbone.Collection.extend({ ///WHOLE COLLECTION of models

  model: Movie,

  initialize: function() {
    // your code here
    // console.log(this);
    this.on('change', function() {
      this.sort();
      //now rerender!!
    });
  },

  comparator: 'title', //does this get reset when a rerender happens?
  //is that why we don't use default?  or would that LET us maintain an old selection?
  //basically, what does default do?

  sortByField: function(field) {
    // console.dir(this);
    this.comparator = field;
    this.sort();
  }

});

//---------VIEWS:-----------------------
//ONE MOVIE
var MovieView = Backbone.View.extend({
  //when this is called, its model prop is set to the individual Movie model
  template: _.template( //we altered the string with backtics and took out the backslashes
    `<div class="movie"> 
      <div class="like"> 
        <button><img src="images/<%- like ? 'up' : 'down' %>.jpg"></button> 
      </div> 
      <span class="title"><%- title %></span> 
      <span class="year">(<%- year %>)</span> 
      <div class="rating">Fan rating: <%- rating %> of 10</div> 
    </div>`
  ),

  initialize: function() {
    // your code here
    // console.log(this.model);
    let thisMovieView = this;  //THIS WORKED!! Maybe binding is an option too, or something else James was thinkng of
    this.model.on('change', function() {
      thisMovieView.render();
    });
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // your code here
    this.model.toggleLike();
  },

  render: function() { //called on one movie, 
    this.$el.html(this.template(this.model.attributes));//and inserts its attributes to the template
    return this.$el; //gives us back html/node for that one movie
  }

});

//ALL MOVIES AS AN AGGREGATE COLLECTION
var MoviesView = Backbone.View.extend({
  //when this is called, the el prop is SET to #movies
  //when this was called, the collection prop was SET to "this.collection"
  initialize: function() {
    // your code here
    //similar to the movie view, pointing at collection
    console.log(this.collection);

    let thisMoviesView = this;
    this.collection.on('sort', function() {
      thisMoviesView.render();
    }); //listening to the collection, on state change, cause a render
    //HOW are we going to connect this to the Collection of Movies?
  },

  render: function() {
    this.$el.empty(); //this el is the MovieSS element for the WHOLE collection
    this.collection.forEach(this.renderMovie, this); 
    //calling render for evey movie in our collection
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());  //appends html for each movie
  }

});

//APP
var AppView = Backbone.View.extend({
  //when this was called, the el prop was SET to #main
  //when this was called, the collection prop was SET to the movies (MovieData)
  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val(); //what is the val? is that the single movie?

    this.collection.sortByField(field); 
    //maybe this is sorting ALL movies by some specification? I.e., title/rating/year
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

