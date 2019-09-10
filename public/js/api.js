const sabre = 
{
    sabreDomain: "https://api-crt.cert.havail.sabre.com",
    sabreToken: "T1RLAQINSW9mn4sHgCP8HJ5M0xU5tvj3PBBcnMGGS0zdyuaR/iFxOPbUAADAILRTyJ5v8PE77vTKbWPuqf1HMk4cX+HqR+aedmyNcldDPWpBVbqEWCqadpyzyaMVhO/BEFefjwN859SgPoS4VVTrhCm1HPtd5aPSYLY212BUHfji4xi17H03xEUletKJD3bJ0lwzO2ZXdqUcWfStexdwgJ5s+k+U8CwebZ9WggnAaMg3tr7BRjvPOSvKDtLDo3j6esZ7h2L3aTCjw675XDyVnqN+fQHzor2VEAw5eObjJzkUR9wcPdZiyWwZI6Zs"
}

var clientData = 
{
    getThemes: function(cb)
    {
        const sabreThemesURI = "/v1/shop/themes";
        $.ajax(
        {
            type: "GET",
            url: sabre.sabreDomain + sabreThemesURI,
            headers: { Authorization: "Bearer " + sabre.sabreToken }
        })
        .then(function(result)
        {
            cb(result);
        });
    }
}
