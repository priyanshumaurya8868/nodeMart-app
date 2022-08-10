exports.getLogin = (req, res, next) => {
   
  const isLoggedIn  = req.session.isLoggedIn;
   
  console.log("is Loggedin : "+isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn, 
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/login");
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(()=>{
    res.redirect("/")
  })
};
