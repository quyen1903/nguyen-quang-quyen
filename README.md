Technical Stack
Nodejs, Typescript
Framework Express
MongoDB, ORM mongoose
design pattern: singleton connect database

-----------
ENVIROMENT VARIABLE
.env

DEV_APP_PORT=3052
DEV_DB_HOST=localhost
DEV_DB_PORT=27017
DEV_DB_NAME=dev-nguyenquangquyen

PRO_APP_PORT=3000
PRO_DB_HOST=localhost
PRO_DB_PORT=27017
PRO_DB_NAME=pro-nguyenquangquyen
-----------

How to Build:
Clone the source code using git clone, then run npm i to install the necessary packages.
Download MongoDB to store the database and install Mongo Compass to monitor the database.
Make sure to place the .env file in the root folder of the project.
There are two ways to run the code:
First: Compile the TypeScript code using tsc to convert it into JavaScript, then run npm run start as usual.
Second: Run directly using the ts-node server.ts command.
Features:
Register
Login
Logout
Use refresh token to return a new token
Change password
Update account
Full-text search to find user names
View personal information
Delete account
Additional Features:
Log database activities.
In the app.ts file, there is a line of code at line 40:
typescript
Copy code
/* check for database connection */
// CheckConnect.checkOverload()
Uncomment this line to check both the database connection and CPU/RAM usage.
Data Flow:
When a specific route is triggered, the corresponding controller handles the code.
Data coming from the route is validated via DTO (Data Transfer Object). I have also written two separate files to validate the username and password.
If valid, the data is passed to the service to handle business logic. If invalid, an error is thrown.
The service processes the business logic and sends the data to the repository, which interacts directly with the database.
Once the repository is done, it sends the data back to the service, which then returns it to the controller.
The controller will respond to the user. The folder handling request or response errors is Core.
Business Logic:
User registration: The password is salted and hashed before being stored in the database. The token pair (access/refresh tokens) is returned. Both the salted password and the hashed password are stored in the database, and the real password is not accessible.
Login: The salt is retrieved from the database, and the same hashing function is applied to compare the salted and hashed password with the one stored in the database. If they match, new tokens (access/refresh) are returned.
JWT (JSON Web Token): The public/private key pair is used. The private key is used to create access/refresh tokens, while the public key is used to verify the validity of the tokens. Only the public key is stored in the database. Neither the tokens nor the private key are stored in the database.
Logout: To log out, the public key is deleted from the database.
Refresh Token Handling: The refresh token is used to get a new token pair while saving the old refresh token. If someone tries to use an old refresh token with malicious intent, they will be forced to log in again.
Password Change: The access token and current password are validated. If valid, the password is updated, the salt is changed, and the password is rehashed before being saved in the database, just like during login.
Account Update: The token is checked for validity. If valid, the username is checked for duplication. If a duplicate username is found, an error is thrown, suggesting a different username. Then, findByIdAndUpdate is used to ensure that the updated fields are unique.
Account Search: A full-text search index is applied to the fullname field to search for users by name.
Read Account: Since the username is sensitive, token-based authentication is required to read the account data.
Delete Account: Deleting an account requires valid token authentication.
Token Authentication in Routes:
In routes, any route placed above the following line of code will not require token authentication:
typescript
Copy code
router.use(authentication)
Routes below this line will require token authentication.
Additional Notes:
Some functionalities, such as DTO validation and username/password validation within the DTO, are not mentioned yet.
