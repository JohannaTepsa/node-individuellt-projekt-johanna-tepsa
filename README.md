# AIRBEAN APPLICATION

## PROJECT DESCRIPTION
Backend code for the Airbean Application - a drone coffee deliver service.
<br>Technology: Node Express NeDB and various dependencies (see package.json for more informaiton)

## INSTALLATION INSTRUCTIONS
npm install to install all relevant dependencies.
<br>npm run dev to start the server.
<br>Base URL: http://localhost:8000

## USAGE
Validation through Middlewares (validate.js) for all necessary events.
<br>Validation through Joi Schemas for some functions.

## User
REGISTER
<br>URL and endpoints: http://localhost:8000/users/register
<br>Method: POST
<br>JSON Body: 
<br>{
	"username": "User",
	"password": "userpw",
	"email": "user@user.com"
}
<br>All fields are required.

LOG IN
<br>URL and endpoints: http://localhost:8000/users/login
<br>Method: POST
<br>JSON Body: 
<br>{
	"username": "User",
	"password": "userpw"
}
<br>All field are required.

LOG OUT
<br>URL and endpoints: http://localhost:8000/users/logout
<br>Method: POST

## Read About company and coffee
<br>URL and endpoints: http://localhost:8000/about
<br>Method: GET

## Menu
INITIALIZE MENU
<br>URL and endpoints: http://localhost:8000/menu/initialize
<br>Method: POST
<br>JSON Body: 
<br>{
    "menu":[
      {
        "id":1,
        "title":"Bryggkaffe",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      },
      {
        "id":2,
        "title":"Caffè Doppio",
        "desc":"Bryggd på månadens bönor.",
        "price":49
      },
      {
        "id":3,
        "title":"Cappuccino",
        "desc":"Bryggd på månadens bönor.",
        "price":49
      },
      {
        "id":4,
        "title":"Latte Macchiato",
        "desc":"Bryggd på månadens bönor.",
        "price":49
      },
      {
        "id":5,
        "title":"Kaffe Latte",
        "desc":"Bryggd på månadens bönor.",
        "price":54
      },
      {
        "id":6,
        "title":"Cortado",
        "desc":"Bryggd på månadens bönor.",
        "price":39
      }
    ]
  }

## Cart and Order Handling
If adding items to a cart as a quest you get a temporary sessionID (you have no userID as you are not a logged in User), this tracks the complete session from handling the cart to handling the order including the order confirmation
<br>If adding items to a cart as a logged in user your userId is connected to your order handling and order confirmation, a session id (linked to your user) is connected to the cart.

VIEW MENU
<br>URL and endpoints: http://localhost:8000/menu/view
<br>Method: GET

ADD TO CART
<br>URL and endpoints: http://localhost:8000/cart/add
<br>Method: POST
<br>JSON Body:
{
	"items": [
		{ "id": 2, "quantity": 2 },
		{ "id": 3, "quantity": 2 }
	]
}
<br>Id (this is the menu item id) and quantity is required.

REMOVE FROM CART
<br>URL and endpoints: http://localhost:8000/cart/item/:id
<br>Method: DELETE
<br>Note: "id" is the menu item id

VIEW CART
<br>URL and endpoints: http://localhost:8000/cart
<br>Method: GET

CLEAR CART:
<br>URL and endpoints: http://localhost:8000/cart/clear
<br>Method: POST

CREATE ORDER
<br>URL and endpoints: http://localhost:8000/orders/create
<br>Method: POST
<br>JSON Body:
<br>{
	"address": "123 User St",
	"email": "user@user.com"
}
<br>All fields are required.

ORDER CONFIRMATION
<br>URL and endpoints: http://localhost:8000/orders/:orderid/confirmation
<br>Method: GET
<br>Note: Order Confirmation respond includes a delivery time, counting down from when the order was placed.

ORDER HISTORY
<br>For logged in users only.
<br>URL and endpoints: http://localhost:8000/orders/history
<br>Method: GET

## Admin
REGISTER
<br>URL and endpoints: http://localhost:8000/admin/register
<br>Method: POST
<br>JSON Body:
<br>{
  "username": "adminuser",
  "password": "adminuserpw",
	"email": "adminuser@adminuser.com"
}
<br>All fields are required.

LOG IN
<br>URL and endpoints: http://localhost:8000/admin/login
<br>Method: POST
<br>JSON Body:
<br>{
  "username": "adminuser",
  "password": "adminuserpw"
}
<br>All fields are required.

LOG OUT
<br>URL and endpoints: http://localhost:8000/admin/logout
<br>Method: POST

## Menu Handling
<br>For logged in Admins only.
ADDING MENU ITEM TO MENU
<br>URL and endpoints: http://localhost:8000/menu/add
<br>Method: POST
<br>JSON Body:
<br>{
  "id": 7,
  "title": "Gustav Adolfsbakels",
  "desc": "Bakelse",
	"price": 49
}
<br>All fields are required.
<br>Note: createdAt sent in response as well as added to the menu.db

MODIFYING MENU ITEM IN MENU
<br>URL and endpoints: http://localhost:8000/menu/:menuItemId
<br>Method: PATCH
<br>JSON Body:
<br>{
	"id": 3,
	"title": "Cappuccino",
	"desc": "Bryggd på månadens bönor",
	"price": "37"
}
<br>All fields are required.
<br>Note: modifiedAt sent in response as well as added to the menu.db

DELETING MENU ITEM TO MENU
<br>URL and endpoints: http://localhost:8000/menu/delete/:menuItemId
<br>Method: POST

## Creating a Campaign
<br>For logged in Admins only.
<br>URL and endpoints: http://localhost:8000/campaign/add
<br>Method: POST
<br>JSON Body:
<br>{
    "name": "Kampanj Fika",
     "items": [
    {"id": 1, "title": "Bryggkaffet"},
    {"id": 7, "title": "Gustav Adolfsbakelse"}
  ],
	 "promotionalPrice": 59
}
<br>All fields are required.
