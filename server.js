const express = require("express");
const cors = require('cors');
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const config = require("./config/config");
const newArgs = require("./minimist/arg");
const connection = require('./src/connections/connectionmongodb');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cluster = require("cluster");
const os = require("os");
const numCors = os.cpus().length;
const logger=require("./logger");

const port = newArgs.port;

//Acceso a rutas
const productsInMongo = require("./src/routes/productsRoutes/productsMongo");
const cartsInMongo = require("./src/routes/cartsRoutes/cartsMongo");
const chatInMongo = require("./src/routes/messagesRoutes/messagesMongo")
const sessionsMongo = require("./src/routes/sessionRoutes/authsSession");
const processRoutes = require("./src/routes/processRoutes/processRoutes");

if (newArgs.mode === "CLUSTER" && cluster.isPrimary) {
  for(let i =0; i<numCors; i++){
    cluster.fork();
  }
  cluster.on("exit", (worker)=>{
    console.log(`proceso ${worker.process.pid} ha dejado de funcionar`);
    cluster.fork();
  })
}
else {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Configuracion CORS para visualizar html correctamente
  const whiteList = ['http://localhost:8080', 'http://localhost:8080/api/login', 'http://127.0.0.1:5500']

  app.use(
    cors({
      origin: whiteList,
      methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
      header: ["Authorization", "X-API-KEY", "Origin", "X-Requested-With", "Content-Type", "Accept, Access-Control-Allow-Request-Method"],
      credentials: true,
    })
  );

  //Creacion de sesiones en mongoStore
  app.use(session({
    store: MongoStore.create({
      // mongoUrl: config.MONGO_URL,
      mongoUrl:'mongodb+srv://ivanzarate:Estela12@cluster0.jrymifn.mongodb.net/ecommerce?retryWrites=true&w=majority',
      ttl: 600
    }),
    secret: config.CLAVE_SECRETA,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true
    }
  }))

  //configurar passport
  app.use(passport.initialize());
  app.use(passport.session());

  //Uso de app en las distintas rutas
  app.use('/api', productsInMongo);
  app.use('/api', cartsInMongo);
  app.use('/api', chatInMongo);
  app.use('/api', sessionsMongo)
  app.use('/api', processRoutes)

  app.use(express.static("public"));

  //Configuracion para crear mensajes
  const mensajes = [];

  io.on('connection', socket => {
    logger.info('Nuevo cliente conectado!')
    console.log('Nuevo cliente conectado!');
    socket.emit('mensajes', mensajes);
    socket.on('mensaje', data => {
      mensajes.push({ socketid: socket.id, mensaje: data })
      io.sockets.emit('mensajes', mensajes);
    });
  });



  connection().then(() => {console.log('Connected to Mongo'); logger.info('Connected to Mongo')}).catch(() => {console.log('An error occurred trying to connect to mongo'),logger.warn('An error occurred trying to connect to mongo')});

  const srv = server.listen(port, () => {
    logger.info("Conexion exitosa al servidor")
    console.log(`Escuchando app en el puerto ${srv.address().port} sobre el proceso ${process.pid} en modo ${newArgs.mode}`);
  });

  srv.on('error', error => {console.log(`Error en servidor ${error}`), logger.warn('Error en el servidor')})

  app.get("*", async (req, res) => {
    logger.warn("No existe la pagina solicitada")
    return res.status(400).send({error: `An error occurred `});
  });
} 
