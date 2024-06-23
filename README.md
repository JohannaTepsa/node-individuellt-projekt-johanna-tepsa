# AIRBEAN APPLICATION

## PROJECT DESCRIPTION
Backend code for the Airbean Application - a drone coffee deliver service.
<br>Technology: Node Express NeDB and various dependencies (see package.json for more informaiton)

## INSTALLATION INSTRUCTIONS
npm install to install all relevant dependencies.
npm run dev to start the server.
<br>Base URL: http://localhost:8000

## USAGE
Validation through Middlewares (validate.js) for all necessary events.
Validation through Joi Schemas for some functions.

## User
REGISTER
URL and endpoints: http://localhost:8000/users/register
Method: POST
JSON Body: 
{
	"username": "User",
	"password": "userpw",
	"email": "user@user.com"
}
All fields are required.

LOG IN
URL and endpoints: http://localhost:8000/users/login
Method: POST
JSON Body: 
{
	"username": "User",
	"password": "userpw"
}
All field are required.

LOG OUT
URL and endpoints: http://localhost:8000/users/logout
Method: POST

## Read About company and coffee
URL and endpoints: http://localhost:8000/about
Method: GET

## Menu
INITIALIZE MENU
URL and endpoints: http://localhost:8000/menu/initialize
Method: POST
JSON Body: 
{
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
URL and endpoints: http://localhost:8000/menu/view
Method: GET

ADD TO CART
URL and endpoints: http://localhost:8000/cart/add
Method: POST
JSON Body:
{
	"items": [
		{ "id": 2, "quantity": 2 },
		{ "id": 3, "quantity": 2 }
	]
}
Id (this is the menu item id) and quantity is required.

REMOVE FROM CART
URL and endpoints: http://localhost:8000/cart/item/:id
Method: DELETE
Note: "id" is the menu item id

VIEW CART
URL and endpoints: http://localhost:8000/cart
Method: GET

CLEAR CART:
URL and endpoints: http://localhost:8000/cart/clear
Method: POST

CREATE ORDER
URL and endpoints: http://localhost:8000/orders/create
Method: POST
JSON Body:
{
	"address": "123 User St",
	"email": "user@user.com"
}
All fields are required.

ORDER CONFIRMATION
URL and endpoints: http://localhost:8000/orders/:orderid/confirmation
Method: GET
Note: Order Confirmation respond includes a delivery time, counting down from when the order was placed.

ORDER HISTORY
For logged in users only.
URL and endpoints: http://localhost:8000/orders/history
Method: GET

## Admin
REGISTER
URL and endpoints: http://localhost:8000/admin/register
Method: POST
JSON Body:
{
  "username": "adminuser",
  "password": "adminuserpw",
	"email": "adminuser@adminuser.com"
}
All fields are required.

LOG IN
URL and endpoints: http://localhost:8000/admin/login
Method: POST
JSON Body:
{
  "username": "adminuser",
  "password": "adminuserpw"
}
All fields are required.

LOG OUT
URL and endpoints: http://localhost:8000/admin/logout
Method: POST

## Menu Handling
For logged in Admins only.
ADDING MENU ITEM TO MENU
URL and endpoints: http://localhost:8000/menu/add
Method: POST
JSON Body:
{
  "id": 7,
  "title": "Gustav Adolfsbakels",
  "desc": "Bakelse",
	"price": 49
}
All fields are required.
Note: createdAt sent in response as well as added to the menu.db

MODIFYING MENU ITEM IN MENU
URL and endpoints: http://localhost:8000/menu/:menuItemId
Method: PATCH
JSON Body:
{
	"id": 3,
	"title": "Cappuccino",
	"desc": "Bryggd på månadens bönor",
	"price": "37"
}
All fields are required.
Note: modifiedAt sent in response as well as added to the menu.db

DELETING MENU ITEM TO MENU
URL and endpoints: http://localhost:8000/menu/delete/:menuItemId
Method: POST

## Creating a Campaign
For logged in Admins only.
URL and endpoints: http://localhost:8000/campaign/add
Method: POST
JSON Body:
{
    "name": "Kampanj Fika",
     "items": [
    {"id": 1, "title": "Bryggkaffet"},
    {"id": 7, "title": "Gustav Adolfsbakelse"}
  ],
	 "promotionalPrice": 59
}
All fields are required.
