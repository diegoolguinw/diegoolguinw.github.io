---
title: "Algoritmo de filtraje no lineal y suavizado basado en operador de Koopman, aplicado a modelos en epidemiología"
collection: talks
type: "Talk"
permalink: /talks/2024-08-08-second_simposium
venue: "II Simposio de Postgrado 2024: Ingeniería, ciencia e innovación, University of Chile, Faculty of Sciences Physics and Mathematics"
date: 2024-08-08
location: "Santiago, Chile"
---

Summaries book: https://libros.uchile.cl/1435

In a filtering problem, the aim is to estimate the trajectory of a stochastic dynamic system $\{x_k\right\}_k$ over time based on noisy observations $\{y_k\right\}_k$. These systems are formulated as:
$$x_{k+1} = f(t_k, x_k, u_k, w_k)$$
$$y_{k} = g(t_k, x_k, u_k, v_k)$$
It is known that in the linear case with Gaussian, centered, and additive noise, the Kalman filter provides an optimal solution in the sense of minimum variance and maximum a posteriori. In the general nonlinear case, no optimal solutions are known. 
In this context, the question arises: is it possible to find a linear system that approximates (P) and apply the Kalman filter? To do this, we decided to work with the Koopman operator, which allows us to obtain a linear system that approximates (P), using Extended Dynamic Mode Decomposition with kernels.
Using the stochastic Koopman operator as in references, a generalization of the filtering algorithm presented in other paper is constructed for stochastic nonlinear systems, without assuming additive Gaussian noise and providing a quantification of the estimation uncertainty. The algorithm created is competitive with others in the literature, such as Extended Kalman Filter, Unscented Kalman Filter, and Particle Filters, both in complexity and accuracy.
The algorithm found can be applied to nonlinear systems in various contexts. For this work, nonlinear systems that appear in epidemiological models are of interest, which constitutes part of the future work of this thesis.
