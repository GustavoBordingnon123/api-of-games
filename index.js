const express = require('express');
const app = express();
const body_parser = require ('body-parser');
const cors = require('cors');
//const { getEventListeners } = require('events');
//const { title } = require('process');
const jwt = require('jsonwebtoken');

const jwtSecret = "secret";

app.use(cors());
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

function auth(req,res,next){
    
    const auth_token = req.headers['authorization'];

    if(auth_token != undefined){

        const bearer = auth_token.split(' ');
        let token = bearer[1];

        jwt.verify(token,jwtSecret,(error,data) => {
            if(error){
                res.status(401);
                res.json("invalid token");  
            }else{
                
                req.token = token;
                req.logged_user = {id: data.id, email: data.email};
                next();
            }
        });

    }else{
        res.status(401);
        res.json("invalid token")
    };

};




let fake_db = {
    games: [
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
    ],
    users: [
        {
            id: 1,
            name: "gustav",
            email: 'gutav@email.com',
            password: 123
        },
        {
            id: 2,
            name: "carlitos",
            email: 'carlitosn@email.com',
            password: 123
        }
    ]
}

app.get('/games',auth,(req,res) => {
    res.statusCode = 200;
    res.json(fake_db.games);
});

app.get('/game/:id',auth, (req,res) => {
    
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        let id = parseInt(req.params.id);

        let hateoas = [
            {
                href: "http://localhost:8080/game"+id,
                method: "DELETE",
                rel: 'delete_game'
            },
            {
                href: "http://localhost:8080/game"+id,
                method: "PUT",
                rel: 'edit_game'
            },
            {
                href: "http://localhost:8080/game"+id,
                method: "GET",
                rel: 'get_game'
            },
            {
                href: "http://localhost:8080/auth",
                method: "POST",
                rel: 'login'
            }
        ]
        
        let game = fake_db.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json({game, hateoas});
        }else{
            res.sendStatus(404);
        }
    }


}) 

app.post('/game',(req,res) => {
    
    let {title, price, year} = req.body;

    fake_db.games.push({
        id: 2323,
        title,
        price,
        year
    })

    res.sendStatus(200);

});

app.delete('/game/:id',(req,res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        let id = parseInt(req.params.id);

        let index = fake_db.games.findIndex(g => g.id == id);

        if(index == -1){
            res.sendStatus(404);
        }else{
            fake_db.games.splice(index,1)
            res.sendStatus(200);
        }

     
    }});

app.put('/game/:id',(req,res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        let id = parseInt(req.params.id);

        let game = fake_db.games.find(g => g.id == id);

        if(game != undefined){

            let {title,price,year} = req.body;

            if(title != undefined){
                game.title = title;
            }

            if(price != undefined){
                game.price = price;
            }

            if(year != undefined){
                game.year = year;
            }

            res.sendStatus(200);

        }else{
            res.sendStatus(404);
        }
    }

})

app.post('/auth', (req,res) => {

    let {email,password} = req.body;

    if(email != undefined){

        let user = fake_db.users.find(u => u.email == email);

        if(user != undefined){
            if(user.password == password){
                
                jwt.sign({id: user.id,email: user.email},jwtSecret,{expiresIn:'28h'},(erro,token) => {
                    if(erro){
                        res.status(400);
                        res.json({erro: "erro in system"});
                    }else{
                        res.status(200);
                        res.json({token: token});
                    }
                })
            }else{
                res.status(401);
                res.json({err: "wrong password"});
            }
        }else{
            res.status(404);
            res.json({err : "uncaught email"});
        }
    }else{
        res.status(400);
        res.json({err: "invalid email"});
    }

});


app.listen(8080,() => {
    console.log("api are on")
})
