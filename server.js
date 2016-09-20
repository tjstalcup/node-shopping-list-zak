var express = require("express");

var Storage = {
    add: function(name) {
        var item = {
            name: name,
            id: this.setId
        };
        this.items.push(item);
        this.setId += 1;
        return item;
    },
    remove: function(id) {
        // solution 1 - 7 lines of code
        // var newItems = [];
        // this.items.forEach(function(i) {
        //     if ((i.id != id)) {
        //         newItems.push(i);
        //     }
        // });
        // this.items = newItems;

        // solution 2 - 5 lines of code
        // for (var i = 0; i < this.items.length; i++) {
        //     if(this.items[i].id == id){
        //         this.items.splice(i,1);
        //     }
        // }

        // solution 3 - 3 lines of code
        this.items = this.items.filter(function(item) {
          return item.id != id ;
        });
    },
    edit: function(name, id) {
        this.items.forEach(function(i) {
            if (i.id == id) i.name = name;
        });
    }
};

var createStorage = function() {
    var storage = Object.create(Storage);
    storage.items = [];
    storage.setId = 1;
    return storage;
};

var storage = createStorage();

storage.add("Broad beans");
storage.add("Tomatoes");
storage.add("Peppers");

var app = express();
app.use(express.static("public"));

//handlers
app.get("/items", function(request, response) {
    response.json(storage.items);
});

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.post("/items", jsonParser, function(request, response) {
    if (!("name" in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete("/items/:id", function(request, response) {
    if (!("id" in request.params)) {
        return response.sendStatus(400);
    }
    storage.remove(request.params.id);
    response.sendStatus(200);
});

app.put("/items/:id", jsonParser, function(request, response) {
    if (!("name" in request.body)) {
        return response.sendStatus(400);
    }
    if (!("id" in request.body)) {
        return response.sendStatus(400);
    }
    //If All is okay
    response.sendStatus(200);
    var id = request.body.id;
    storage.edit(request.body.name, id);
});

app.listen(process.env.PORT || 8080, process.env.IP, function(){
    console.log('Server running at http://localhost:8080');
});
