const express = require("express"); // import express module (simplifies routing/requests, among other things)
const cors = require("cors"); // import the CORS library to allow Cross-origin resource sharing
const app = express(); // create an instance of the express module (app is the conventional variable name used)

const services = require("./services/api");

const PORT = process.env.PORT || 5000; // use either the host env var port (PORT) provided by Heroku or the local port (5000) on your machine

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(cors()); // Enable CORS
app.use(express.json()); // Recognize Request Objects as JSON objects
app.use(express.static("build")); //load the front-end from public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/listAllRecipeNames/:sortType", async (req, res) => {
  var sortType = req.params.sortType ? req.params.sortType : 0;
  services
    .listAllRecipeNames(sortType)
    .then((result) => {
      res.status(200).json({
        status: "success",
        results: result.length,
        data: {
            recipes: result
        },
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: "success",
        error: err
      });
    });
});

app.get("/api/listAllRecipes/:sortType", async (req, res) => {
  var sortType = req.params.sortType ? req.params.sortType : 0;
  services
    .listAllRecipes(sortType)
    .then((result) => {
      res.status(200).json({
        status: "success",
        results: result.length,
        data: {
            recipes: result
        },
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: "success",
        error: err
      });
    });
});

app.get("/api/getRecipeById/:id", async (req, res) => {
  var params = req.params;
  var id = params.id ? params.id : 0;
  if (id == 0) {
    res.status(200).json({
      status: success,
      data: {},
      message: "Id field is Mandatory",
    });
  } else {
    services
      .getRecipeById(id)
      .then((result) => {
        res.status(200).json({
          status: "success",
          data: {
              recipes: result
          },
        });
      })
      .catch((err) => {
        res.status(200).json({
          status: "success",
          error: err
        });
      });
  }
});

app.get("/api/searchRecipeByName/:name", async (req, res) => {
  var params = req.params;
  var name = params.name ? params.name : "";
  if (name == "") {
    res.status(200).json({
      status: success,
      data: {},
      message: "Name of recipe is Mandatory",
    });
  } else {
    services
      .searchRecipeByName(name)
      .then((result) => {
        res.status(200).json({
          status: "success",
          data: {
            recipes: result
          },
        });
      })
      .catch((err) => {
        res.status(200).json({
          status: "success",
          error: err
        });
      });
  }
});

app.post("/api/addRecipe", async (req, res) => {
  var data = req.body;
  services
    .addRecipe(data)
    .then((result) => {
      res.status(201).json({
        status: "success",
        data: {
          recipes: result
        }
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: "success",
        error: err
      });
    });
});

app.put("/api/updateRecipe/:id", async (req, res) => {
  var data = req.body
  var params = req.params;
  var id = params.id ? params.id : 0;
  if (id == 0) {
    res.status(200).json({
      status: success,
      data: {},
      message: "Id field is Mandatory",
    });
  } else {
    services
      .updateRecipe(id, data)
      .then((result) => {
        res.status(200).json({
          status: "success"
        });
      })
      .catch((err) => {
        res.status(200).json({
          status: "success",
          error: err
        });
      });
  }
});

app.delete("/api/deleteRecipe/:id", async (req, res) => {
    var params = req.params;
    var id = params.id ? params.id : 0;
    if (id == 0) {
      res.status(200).json({
        status: success,
        data: {},
        message: "Id field is Mandatory",
      });
    } else {
      services
        .deleteRecipe(id)
        .then((result) => {
          res.status(204).json({
            status: "success"
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: "success",
            error: err
          });
        });
    }
  });

  app.get("/api/checkRecipeExists/:name", async (req, res) => {
    var params = req.params;
    var name = params.name ? params.name : "";
    if (name == "") {
      res.status(200).json({
        status: success,
        data: {},
        message: "Name of recipe is Mandatory",
      });
    } else {
      services
        .checkRecipeExists(name)
        .then((result) => {
          res.status(200).json({
            status: "success",
            data: {
              recipes: result
            },
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: "success",
            error: err
          });
        });
    }
  }); 

app.listen(PORT, () => console.log(`Server running at port : ${PORT})`));
