exports.login = [
  function (req, res) {
    console.log(req.isAuthenticated())
    res.json('login')
  }
]
