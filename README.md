# Shopper Challenge

## Initialize repo

Cloned from: https://github.com/meanjs/mean

git clone git@github.com:meanjs/mean.git shopper --depth 1 --single-branch

### Cloning The GitHub Repository
The recommended way to get MEAN.js is to use git to directly clone the MEAN.JS repository:

```bash
$ git clone https://github.com/meanjs/mean.git meanjs
```

## Initialize with Docker


```bash
$ docker-compose build && docker-compose up
```

Access the application:
```
http://localhost:3000
```

## Use the application

The land page contains the Application Form:

Register and log in to the app in order to see:

- Applications List
- Funnel service example:
  http://localhost:3000/funnels.json?start_date=2017-03-09&end_date=2017-03-12


## Create modules with yoeman

```bash
$ yo meanjs:crud-module mymodule
```

