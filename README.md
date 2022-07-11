# api-of-games
this is project to study how to make an api restful, whit a fake data base

## ENDPOINTS

### GET /games 
this route, is responsible to return all the games in the fake data base

#### Params
none

#### results
##### OK! 200
the code worked successful
example: 
``` 
[
        {
            id: 1,
            title: "minecraft",
            year: 2011,
            price: 80
        },
        {
            id: 3,
            title: "fall-guys",
            year: 2020,
            price: 0
        },
        {
            id: 4,
            title: "lol",
            year: 2008,
            price: 100
        }
    ]
```    
##### Error in the authentication! 401
exists any mistake in the code,can be a invalid token or a expired token

```
{
    "err": "Invalid token!"
}
```
### POST /auth
this route, is responsible to return and do the login
#### Parametros
email: E-mail of the user registered in the system.

password: Password of the user registered in the system, with that given user e-mail.

Example:
```
{
	"email": "gutav@email.com",
	"password": "123"
}
```
#### results
##### OK! 200
If this response happens, you will receive the JWT token to be able to access protected endpoints in the API.

Example:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ2aWN0b3JkZXZ0YkBndWlhZG9wcm9ncmFtYWRvci5jb20iLCJpYXQiOjE1OTE3ODI0NzUsImV4cCI6MTU5MTk1NTI3NX0.y8kp3BxKgC86KFiq6-tAABukR6vi1guTPeRQhO8IdwU"
}
```
##### Falha na autenticação! 401
exists any mistake in the code,can be a wrong email or a wrong password.

Example:
```
{error: "invalid password"}
```


    
