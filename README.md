<div id="top"></div>

<h1 align="center">Surf API to get forecasts</h1>

[Português](./README_ptbr.md) | English

>This project was made for learning purpose, so have some limitations that will be explaining. But if you want to consume this API feel free! Only have it in your mind.

That's an API to get forecasts of your favorite beaches. You can register the beaches with your latitude and longitude, and ready, you'll receive the forecasts of your register beaches.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#features">Features</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#routes">Routes</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

- [x] Register and user login
- [x] Register beaches
- [x] Forecast rating algorithm
- [x] Forecasts for registered beaches by user

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

- Node.js
- TypeScript
- Mongoose
- Express
- jest/supertest

<p align="right">(<a href="#top">back to top</a>)</p>

## Routes

The base endpoint of API is https://forecast.up.railway.app/, for more informations and test the routes you can see the documentation [here](https://forecast.up.railway.app/docs/).

**/users**: This route is responsible of the user creation. You have to send the **name**,**email** and **password** in the request body. You receive an object with user id, name and email.

**/users/authenticate**: This route is responsible of the user authentication. You have to send the user **email** and **password** in the request body. You receive an object with the user token, this token contains an object with user id, name and email.

**/users/me**: This route is responsible to decode the user token and return the user informations inside the token. You need to send the token in the **x-access-token** field in the request header.

**/beaches**: This route is responsible for creating user beaches. The most important fields are **lat** (latitude) and **lng** (longitude), latitude and longitude are the way to locate the beach and make forecasts for that region. Finding the latitude and longitude of your beach is easy, a simple search will solve it.

**/forecast**: This is the main route of the API, is responsible to return the forecasts of the next 24 hours with your rating (0 to 5).

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Lucas Suares - suares_silva.01@hotmail.com

<p align="right">(<a href="#top">back to top</a>)</p>

---

<p align="center">Copyright © 2022 Lucas Suares</p>
