library(dataRetrieval)





# Get data
user_bday <- as.Date("1992-06-08")
user_state <- "PA"
# <- c("PA","OH","RI","WY")
user_params <- c("00060", "00010") # discharge and temperature
# user_params_more <- c("00060", "00010","00045","00400") # discharge [ft3/s], temperature [C], precipitation [in], pH


#############
# Get one daily snapshot for all gages in the state
#############

# Assign all gages in that state to a dataframe
userDF <- data.frame(whatNWISsites(stateCD = user_state, parameterCd = user_params, 
                                   startDate = user_bday, endDate = user_bday))

# Retrieve Daily Values for all sites in that user's state
user_dailyValues <- readNWISdv(siteNumbers = userDF$site_no, parameterCd = user_params, startDate = user_bday, endDate = user_bday)

# Keep the few critical columns
keeps <- c("X_00060_00003","X_00010_00003")
user_dailyValues_clean <- subset(user_dailyValues, select = keeps)

#rename
user_dailyValues_clean <- rename(user_dailyValues_clean, c("X_00060_00003"="x","X_00010_00003"="y"))

#remove NA
user_dailyValues_clean[is.na(user_dailyValues_clean)] <- 0

#assign
df1 <- user_dailyValues_clean

df <- df1 %>% mutate(id = 1)



## convergence
set.seed(1)

terminals <- data.frame(x = runif(10, 0, 10000), y = runif(10, 0, 10000))

#df <- 1:10000 %>%
  #map_df(~weiszfeld(terminals, c(points$x[.], points$y[.])), .id = "id")

p <- ggplot() +
  geom_point(aes(x, y), points, size = 1, alpha = 0.25) +
  geom_point(aes(x, y), terminals, size = 10, alpha = .4) +
  geom_line(aes(x, y, group = id), df, colour = "yellow", size = 0.5, alpha = 0.03) +
  coord_equal() +
  xlim(0, 10000) +
  ylim(0, 10000) +
  theme_blankcanvas(margin_cm = 0)

ggsave("weiszfeld.png", p, width = 20, height = 20, units = "in")