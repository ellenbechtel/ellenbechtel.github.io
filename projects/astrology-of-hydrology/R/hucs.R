library(dataRetrieval)
library(nhdplusTools)
library(sf)

lon <- -122.3321
lat <- 47.6062

start_point <- sf::st_sfc(sf::st_point(c(lon, lat)),
                          crs = 4269)

start_point <- st_sfc(st_point(c(-89.362239, 43.090266)), crs = 4269)
start_comid <- discover_nhdplus_id(start_point)

flowline <- navigate_nldi(list(featureSource = "comid",
                               featureID = start_comid),
                          mode = "upstreamTributaries",
                          distance_km = 1000)

subset_file <- tempfile(fileext = ".gpkg")
subset <- subset_nhdplus(comids = flowline$nhdplus_comid,
                         output_file = subset_file,
                         nhdplus_data = "download",
                         flowline_only = FALSE,
                         return_data = TRUE)
#> All intersections performed in latitude/longitude.
#> Reading NHDFlowline_Network
#> Writing NHDFlowline_Network
#> Reading CatchmentSP
#> Writing CatchmentSP

flowline <- subset$NHDFlowline_Network
catchment <- subset$CatchmentSP
waterbody <- subset$NHDWaterbody