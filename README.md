##Steps to create a new User.

1. Create an Account in firebase and copy the user-id. 
2. Go to dyalist and create a folder with the same user id.
3. Create 2 document name "Project_Management" And "General_Tasks".
3. Copy the dynalist document ids for "Project_Management" And "General_Tasks" from url.
4. Go to salesforce and create a new record of User Configuration Metadata with following details
  - Project Management File Id - document id for "Project_Management"
  - General Task File Id - dyalist file id - document id for "General_Tasks"
  - User Id	- Firebase User Id
5. Reset the password.
  - 
