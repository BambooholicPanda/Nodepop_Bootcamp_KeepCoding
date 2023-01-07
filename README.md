# Nodepop API

This API, named Nodepop, is the final project for the backend with Node.js course at my program in bootcamp by KeepCoding and Glovo. We have been requested to create an API using Express and mongodb that allows the creation, edition, deletion and filtering of pieces of advertisements that follow a specific information schema (item name, photo, price, tags, and whether the item is available for purchase or for selling). It also allows to store the information in a mongodb database.
If you like it, feel free to fork it and give it a try.

## Install mongodb

Having mongodb installed in your server is necessary for the API to work. Just download it, install it and make sure it's running in your system.
https://www.mongodb.com/try/download/community

The database will run at `mongodb://127.0.0.1/nodepop` by default. You can change this in `lib/connectMongoose.js` at line 14.

## Deploy

    npm install

## Load initial data to database

The database will be overwritten with the data in `adverts.json`.

    npm run init-db

## Start the application in production

    npm start

## Start the application for development

    npm run dev

The API will run at `http://localhost:3000` by default. You can change the port in `/bin/www.js` at line 15.

### Make sure to be at the **src folder** directory when executing these commands.

# Usage (All available requests)

## Get advert list

### Request

`GET /api/adverts`

### Response

    HTTP/1.1 200 OK

    "results": [
      {
         "_id": "63b6e68fcbe10e8932a573d6",
         "item": "bike1",
         "selling": true,
         "price": 230.13,
         "photo": "bike.jpg",
         "tags": [
            "lifestyle",
            "motor"
         ]
      },
      {
         "_id": "63b6e68fcbe10e8932a573d7",
         "item": "phone2",
         "selling": false,
         "price": 220.13,
         "photo": "phone2.jpg",
         "tags": [
            "work",
            "motor"
         ]
      }
      ...
     ]

### Available parameters

<details>
<summary>Click to open</summary>

- tag
  - description: Searches by tag. You can get a list of all available tags by using `GET api/tags`.
  - value type: string
  - example: `GET api/adverts?tag=work`
- selling:
  - description: Searches by status (whether the item is being sold (true) or requested (false)).
  - value type: boolean
  - example: `GET api/adverts?selling=true`
- price:
  - description: Searches by exact price or price range. Possible options: between value and value (e.g 10-20), greater than value (e.g 10-), lower than value (e.g -20) or exact value (e.g 30).
  - value type: string
  - example: `GET api/adverts?price=23-100`
- item:
  - description: Searches by object name. It will match strings that start with the query text.
  - value type: string
  - example: `GET api/adverts?item=bike`
- start:
  - description: Number of items that will be skipped. Useful for pagination.
  - value type: number
  - example: `GET api/adverts?start=5`
- limit:
  - description: Number of items that will be returned. Useful for pagination.
  - value type: number
  - example: `GET api/adverts?limit=10`
- sort:
  - description: Defines sorting order (by price, alphabetical item name order or status).
  - value type: string
  - example: `GET api/adverts?sort=price`

You are also able to use multiple parameters at once by concatenating them with "&".
Example:`/api/adverts?tag=work&price=30-&short=price`

</details>

### Expected errors

- Parameter has an invalid type. Example: `price=low`
- Parameter does not exist.

## Update an existing advert

### Request

`PUT /api/:id`
Properties must be set in the body of the request.

### Response

    HTTP/1.1 200 OK

    "result": {
        "_id": "63b73c0be7c119f173b11bb5",
        "item": "phone2",
        "selling": false,
        "price": 220.13,
        "photo": "bike.jpg",
        "tags": [
            "work",
            "motor"
        ]
    }

### Example input

    {
        "price": 34.5,
        "tags": [
          "lifestyle",
          "fun"
        ]
    }

### Expected errors

- The photo filename must be unique across all items.

## Create a new advert

### Request

`POST /api/advert`
Properties must be set within the body of the request. You can check a list of all the properties in the GET request above.

### Response

    HTTP/1.1 201 Created

    "result": {
        "_id": "63b73c0be7c119f173b11bb5",
        "item": "phone2",
        "selling": false,
        "price": 220.13,
        "photo": "bike.jpg",
        "tags": [
            "work",
            "motor"
        ]
    }

### Example input

    {
        "item": "phone2",
        "selling": false,
        "price": 220.13,
        "photo": "bike.jpg",
        "tags": [
            "work",
            "motor"
        ]
    }

### Expected errors

- All properties are required, so the request will output an error if any property is missing.
- The photo filename must be unique across all items.

## Delete an advert

### Request

`DELETE /api/:id`

### Response

    HTTP/1.1 200 OK

    {status: "Advert deleted successfully"}

### Expected errors

- Advert with provided id does not exist.

## Get a specific image

### Request

`GET /images/`

### Response

    HTTP/1.1 200 OK

    <image file>

## Upload an image

### Request

`POST /images/upload`
Properties must be set within the body of the request.

### Response

    HTTP/1.1 201 Created

    { "status": "Image successfully uploaded"}

### Body format

- url: required
- fileName: not required. If no filename is given, the API will get the filename from the url.

### Expected errors

- Custom filename must have the file extension.

# Built with

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - web framework for Node.js
- [Mongoose](https://mongoosejs.com/) - elegant mongodb object modeling for node.js
- [Nodemon](https://nodemon.io/) - restart server application on file changes
- [Axios](https://axios-http.com/) - promise based HTTP client for the browser and node.js

# Author

- Andrea Expósito Santana (BambooholicPanda)
