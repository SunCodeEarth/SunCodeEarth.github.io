require(sf)
require(tidyverse)
require(magrittr)

readr::read_csv('Universal_Pre-K__UPK__School_Locations.csv') -> dat

sf::st_as_sf(dat, coords = c('Longitude', 'Latitude'), crs = 4269) -> sf_dat

mapview::mapview(sf_dat)

sf_dat %>%
  dplyr::select(LocName, Website) %>%
  sf::st_write('nyc_prek.geojson')
