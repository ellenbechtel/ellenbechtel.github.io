# Math Art scrap

library(mathart)
library(ggart)
library(ggforce)
library(ggplot2)
library(Rcpp)
library(tidyverse)
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
keeps <- c("X_00060_00003","X_00010_00003","site_no")
user_dailyValues_clean <- subset(user_dailyValues, select = keeps)

#rename
user_dailyValues_clean <- rename(user_dailyValues_clean, c("X_00060_00003"="x","X_00010_00003"="y", "site_no"="z"))

#remove NA
user_dailyValues_clean[is.na(user_dailyValues_clean)] <- 0

# Mollusc

df <- mollusc()
df1 <- user_dailyValues_clean %>% mutate(id = 1)
#df2 <- df %>% mutate(id = 2)
#df3 <- df %>% mutate(id = 3)

p <- ggplot() +
  geom_point(aes(x, y), df1, size = 0.03, alpha = 0.03) +
  geom_path( aes(x, y), df1, size = 0.03, alpha = 0.03) +
#  geom_point(aes(x, z), df2, size = 0.03, alpha = 0.03) +
#  geom_path( aes(x, z), df2, size = 0.03, alpha = 0.03) +
#  geom_point(aes(y, z), df3, size = 0.03, alpha = 0.03) +
#  geom_path( aes(y, z), df3, size = 0.03, alpha = 0.03) +
  facet_wrap(~id, nrow = 2, scales = "free") +
  theme_blankcanvas(margin_cm = 0.5)

ggsave("mollusc01.png", width = 80, height = 80, units = "cm")