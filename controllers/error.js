exports.get404 = (req, res, next) => {
    res.status(404).render('404page',{pageTitle : "Page Not found!", path : "",
    isAuthenticated: req.isLoggedIn})
  }

  exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
      pageTitle: 'Error!',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn
    });
  };
  