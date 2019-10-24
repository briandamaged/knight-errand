# Knight Errand #

A town-builder and multi-user dungeon.

## Quick Start ##

It's easiest to get things up and running via [docker-compose](https://docs.docker.com/compose/install/):

```shell
> cd path/to/knight-errand

> docker-compose -f docker-compose.dev.yml up
```

This will launch both the frontend and backend components.  You can then interact w/ the game by navigating to:

http://localhost:3000/


## Why? ##

I've always been fascinated with "text adventure games" ever since I played `ADVENT.BAS` on the [ATARI 1200XL](http://www.atarimuseum.com/computers/8bits/1200xl/1200xl.html). So, I thought it would be fun to try building one of my own!

Plus, I figured this would be a great opportunity to gain a deeper understanding of several different technologies, including:

* [Typescript](https://www.typescriptlang.org/)
* [Babel](https://babeljs.io/)
* [React](https://reactjs.org/)
* [Web Sockets](https://github.com/websockets/ws)
* [Docker](https://www.docker.com/)
* [docker-compose](https://docs.docker.com/compose/install/)
