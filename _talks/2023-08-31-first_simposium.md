---
title: "Impacto de la aplicación de la primera dosis de refuerzo contra el COVID-19 en Chile"
collection: talks
type: "Talk"
permalink: /talks/2023-08-31-first_simposium
venue: "I Simposio de Postgrado 2023: Ingeniería, ciencia e innovación, University of Chile, Faculty of Sciences Physics and Mathematics"
date: 2023-08-31
location: "Santiago, Chile"
---

Summaries book: https://libros.uchile.cl/1372

The aim was to estimate how many infections, deaths, ICU and non-ICU hospitalizations due to COVID-19 were prevented by the administration of the first booster dose in Chile. 

Two models were implemented, one compartmental, following Giordano et al. (2020), which estimates infections and deaths, with and without booster. 

The second is a statistical model that receives daily cases and uses them to estimate deaths, ICU and non-ICU hospitalizations by age group. The infections estimated by the compartmental model allow us to simulate the scenario without a booster.  

The models were calibrated with daily data on deaths, ICU and non-ICU hospitalizations, and infections between December 1, 2020, and December 31, 2021, provided by the MINSAL. These are the most reliable data, but they may contain testing errors and underreporting. 

Spatial variables were not considered, but some label-type variables can be included in the same way as age ranges.

The scenario without booster shots was simulated between October 1 and December 31, 2021. The metrics used were the least realistic estimates and the avoidance rate

$$ Avoidance rate = 1 - \frac{Real outcomes}{Estimated outcomes} $$

Approximately 500,000 infections and 7,000 deaths were prevented during the months mentioned, confirming the significant positive impact of the first booster dose. This methodology can be replicated for subsequent booster doses, adding data close to the dates of administration.

