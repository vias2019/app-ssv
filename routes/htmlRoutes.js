var axios = require("axios");
axios.defaults.headers.common.Authorization = process.env.SABRE_TOKEN;

module.exports = function(app) {

  // Get all activities from Sabre API
  app.get("/activities", function(req, res) {
    axios
      .get("https://api-crt.cert.havail.sabre.com" + "/v1/shop/themes")
      .then(function(result) {
        if (result) {
          res.send(result.data);
        } else {
          res.send("error");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });
};
