require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const options = {
    url: "https://us7.api.mailchimp.com/3.0/lists/997eab9f3e",
    method: "POST",
    headers: {
      Authorization: `apikey ${process.env.API_KEY}`,
    },
    body: jsonData,
  };

  request(options, (err, response, body) => {
    if (err) {
      res.sendFile(__dirname + "/failure.html");
    }
    if (response.statusCode === 200) {
      console.log("Succesfully submiting subscription");
      res.sendFile(__dirname + "/success.html");
    } else {
      console.log("Error submiting subscription");
      console.log(response.statusCode);
      console.log(response);

      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(data);
    });
  });
});

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Server is running on port 3000.");
});
