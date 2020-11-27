library(dataRetrieval)
library(generativeart)
?readNWISdv
?readNWISdata
?readNWISsite
?statCd


#############
# Set up User inputs
#############

user_bday <- as.Date("1992-06-08")
numeric <- as.numeric(user_bday)
earlier <- numeric-15
month <- c((numeric-15), (numeric-15))
user_mEnd <- 
user_m <- 
user_state <- "ME"
user_params <- c("00060", "00010") # discharge and temperature
user_params_more <- c("00060", "00010","00045","00400") # discharge [ft3/s], temperature [C], precipitation [in], pH

#### Dates


dates <- as.Date(c("2017-01-01","2018-01-01"))
numeric <- as.numeric(dates)
diff <- numeric[2]-numeric[1]

backto <- as.Date(origin)



#############
# Get one daily snapshot for all gages in the state
#############

# Use users location, figure out sites that have those measurements
whatNWISsites(stateCD = user_state, parameterCd = user_params, 
              startDate = user_bday, endDate = user_bday)

# Assign all gages in that state to a dataframe
userDF <- data.frame(whatNWISsites(stateCD = user_state, parameterCd = user_params, 
                                   startDate = user_bday, endDate = user_bday))

# Retrieve Daily Values for all sites in that user's state
user_dailyValues <- readNWISdv(siteNumbers = userDF$site_no, parameterCd = user_params_more, startDate = user_bday, endDate = user_bday)


#############
# Get all daily values for a few sites during the month around birth
#############



#############
# Other Scrap
#############
# Use lat longs from above + user lat long & identify closest site
# Now read data from closest site with date
x <- readNWISdv("03229000", startDate = user_bday, endDate = user_bday,
                parameterCd = user_params)
x <- 
  
  readNWISsite("03229000")
countyCdLookup(x$state_cd, x$county_cd, outputType = "fullName")



