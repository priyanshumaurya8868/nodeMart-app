exports.getLogin = (req, res, next) => {
  const cookieStrimg = req.get("Cookie");

  console.log("cookie str : " +cookieStrimg)
  let isLoggedIn;

  //this wont work because of scope of req object dies after res.render
  // req even from same ip_adress treated still independently
  if (cookieStrimg) {
    isLoggedIn = cookieStrimg.split("=")[1];
    console.log(isLoggedIn)
  } else {
    isLoggedIn = false;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn, 
  });
};

exports.postLogin = (req, res, next) => {
  //sending cookies
  //TODO: there is a need to specify 'Expire' else it would expire just afer when the user closes browser
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
