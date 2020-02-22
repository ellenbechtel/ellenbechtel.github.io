/////////////////////////////////
  // MANIPULATE THE DATA TO GET SOME THINGS WE WANT
  //////////////////////////////////

  // Get the keywords for the circles and put them in order

  var keywords = [];

  eggsplainer.forEach(function(d) {
    var this_keyword = d.quality;
    if(keywords.indexOf(this_keyword)<0) {
      keywords.push(this_keyword);
    }

  });

  console.log(keywords);  // THEY DONT EXACTLY MATCH THE KEYS IN PRODUCTS.CSV YET
