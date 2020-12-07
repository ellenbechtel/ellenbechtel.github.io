library(sf)
library(ggplot2)
library(rmapshaper);library(sf);library(maps)
library(scico)
library(tidyverse)
library(viridis)
library(rgdal)
library(svglite)
library(lwgeom)

# make base map -----------------------------------------------------------

## need a base map to be able to spatially filter observations to the usa
## could also be useful in final plot
library(rmapshaper)

## read in usa state map, convert to sf
exclude_states <- c('AK')
states_sf <-readRDS('data/state-map.rds')%>%
  st_as_sf()
## this map file is special because USGS ppl have repositioned AK, HI, and PR to be in same view


## simplify map shapes to make easier to work with
states_sf <- states_sf %>% 
  # filter((State %in% exclude_states)) %>%
  ms_simplify(.5) %>% 
  st_buffer(0)
# st_buffer(0) is a magic trick that resolves geometry conflicts and makes sure everything is a polygon



#reproject
states_transformed <- states_sf %>% st_transform(st_crs(102008))

## spatially summarize state polygons to make map outline of usa
usa_sf <- states_transformed %>% group_by() %>% summarize()

alaska <- sf::read_sf('data/alaska-shapefile/tl_2016_02_cousub.shp') %>%
  st_transform(st_crs(102008)) %>% 
  group_by() %>% 
  summarize() %>% 
  st_buffer(0) %>%
  ms_simplify(.5) 

# Load in Rivers -----------------------------------------------------------


# #rivers <- sf::read_sf('USGS_smallscale_hydrography/stream.shp')
# rivers <- sf::read_sf('USA_Rivers_and_Streams-shp/9ae73184-d43c-4ab8-940a-c8687f61952f2020328-1-r9gw71.0odx9.shp')
# 
# # separate into separate lines to run each script individually and chop where needed
# rivers_transformed <- st_zm(rivers, drop=TRUE, what="ZM") 
# rivers_transformed <- ms_simplify(rivers_transformed, keep = .1)
# rivers_transformed <- st_transform(rivers_transformed, st_crs(102008)) 
# rivers_transformed <- st_buffer(rivers_transformed, 0)
#   



# Load in all HUCS
path1 <- "data/HUC2-shapefiles/WBD-01/WBDHU2.shp"
path2 <- "data/HUC2-shapefiles/WBD-02/WBDHU2.shp"
path3 <- "data/HUC2-shapefiles/WBD-03/WBDHU2.shp"
path4 <- "data/HUC2-shapefiles/WBD-04/WBDHU2.shp"
path5 <- "data/HUC2-shapefiles/WBD-05/WBDHU2.shp"
path6 <- "data/HUC2-shapefiles/WBD-06/WBDHU2.shp"
path7 <- "data/HUC2-shapefiles/WBD-07/WBDHU2.shp"
path8 <- "data/HUC2-shapefiles/WBD-08/WBDHU2.shp"
path9 <- "data/HUC2-shapefiles/WBD-09/WBDHU2.shp"
path10 <- "data/HUC2-shapefiles/WBD-10/WBDHU2.shp"
path11 <- "data/HUC2-shapefiles/WBD-11/WBDHU2.shp"
path12 <- "data/HUC2-shapefiles/WBD-12/WBDHU2.shp"
path13 <- "data/HUC2-shapefiles/WBD-13/WBDHU2.shp"
path14 <- "data/HUC2-shapefiles/WBD-14/WBDHU2.shp"
path15 <- "data/HUC2-shapefiles/WBD-15/WBDHU2.shp"
path16 <- "data/HUC2-shapefiles/WBD-16/WBDHU2.shp"
path17 <- "data/HUC2-shapefiles/WBD-17/WBDHU2.shp"
path18 <- "data/HUC2-shapefiles/WBD-18/WBDHU2.shp"
path19 <- "data/HUC2-shapefiles/WBD-19/WBDHU2.shp"
path20 <- "data/HUC2-shapefiles/WBD-20/WBDHU2.shp"
path21 <- "data/HUC2-shapefiles/WBD-21/WBDHU2.shp"

huc1 <- sf::read_sf(path1)
huc1 <- huc1 %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc2 <- sf::read_sf(path2) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc3 <- sf::read_sf(path3) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc4 <- sf::read_sf(path4) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc5 <- sf::read_sf(path5) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc6 <- sf::read_sf(path6) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc7 <- sf::read_sf(path7) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc8 <- sf::read_sf(path8) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc9 <- sf::read_sf(path9) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc10 <- sf::read_sf(path10) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)


huc11 <- sf::read_sf(path11) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)


huc12 <- sf::read_sf(path12) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)


huc13 <- sf::read_sf(path13) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)


huc14 <- sf::read_sf(path14) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc15 <- sf::read_sf(path15) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc16 <- sf::read_sf(path16) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc17 <- sf::read_sf(path17) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc18 <- sf::read_sf(path18) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc19 <- sf::read_sf(path19) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc20 <- sf::read_sf(path20) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

huc21 <- sf::read_sf(path21) %>% 
  st_transform(st_crs(102008)) %>%
  ms_simplify(.2) %>%
  st_buffer(0)

# plot the map ----------------------------------------------

ggplot() +
  geom_sf(data = states_transformed, color = "green", size = .1)
  # geom_sf(data = usa_sf, fill="white",color="white", size=1) +
  # geom_sf(data = huc1, color="black", size = 1) +
  # geom_sf(data = huc2, color="green", size = 1) +
  # geom_sf(data = huc3, color="orchid", size = 1) 
  # geom_sf(data = huc4, fill="black", color="black", size = .1)
  # geom_sf(data = huc5, color="green", size = 1) +
  # geom_sf(data = huc6, color="orchid", size = 1)
  # geom_sf(data = huc7, color="orchid", size = 1) +
  # geom_sf(data = huc8, color="green", size = 1) +
  # geom_sf(data = huc9, fill="black", color="white", size=0)
  # geom_sf(data = huc10, fill="black", color="white", size=0) 
  # geom_sf(data = huc11, fill="black", color="white", size = 0) +
  # geom_sf(data = huc12, color="orchid", size = 1)
  # geom_sf(data = huc13, fill="black", size = 0)
  # geom_sf(data = huc14, color="green", size = 1) +
  # geom_sf(data = huc15, color="orchid", size = 1) 
  # geom_sf(data = huc16, fill="black", size = 0) +
  # geom_sf(data = huc17, fill="black", size = 0)
  # geom_sf(data = huc18, color="orchid", size = 1)
  # geom_sf(data = alaska, fill="lightgray", size=0) 
  # geom_sf(data = huc19, fill="black", size = 0) 
  # geom_sf(data = huc20, color="green", size = 1) +
  # geom_sf(data = huc21, color="orchid", size = 1)
# stunnninggg
ggsave("states.svg")

#ggsave(file="nl.svg")
  
  #ggsave.svg