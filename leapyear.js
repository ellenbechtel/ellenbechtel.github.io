for (i = 1582; i < 2021; i++) {

    if (i % 4 == 0 && i % 100 > 0) { console.log(i); } 
    else if (i % 4 == 0 && i % 100 == 0) { console.log("Not a leap year!"); }
    else if (i % 400 == 0) { console.log(i); };

} 