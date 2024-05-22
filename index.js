// const express = require('express');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const oEnvironment = require('./src/constants/Environment.js');

// // Habilitar CORS y definir las opciones
// app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'], allowedHeaders: ['Content-Type', 'authorization'] }));

// // Configurar body-parser sin límite de tamaño para JSON y URL codificado
// app.use(bodyParser.json({ limit: '1000mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

// // Si estás en modo de depuración, usar Morgan para registrar las solicitudes HTTP
// if (oEnvironment.DEBUG) {
//   const morgan = require('morgan');
//   app.use(morgan('dev'));
// }

// // Levantar el servidor
// app.listen(oEnvironment.PORT, () => console.log(`Server started, listening port: ${oEnvironment.PORT}`));

// // Inicializar las rutas
// const routes = require('./src/routes/Routes.js');
// routes(app);
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const oEnvironment = require('./src/constants/Environment.js');

const app = express();

// Habilitar CORS y definir las opciones
app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'authorization'] 
}));

// Configurar body-parser sin límite de tamaño para JSON y URL codificado
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

// Si estás en modo de depuración, usar Morgan para registrar las solicitudes HTTP
if (oEnvironment.DEBUG) {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Configurar el servidor HTTPS
const options = {
  key: fs.readFileSync('../uploads/server.key'),
  cert: fs.readFileSync('../uploads/server.crt')
};

// Inicializar las rutas
const routes = require('./src/routes/Routes.js');
routes(app);

// Middleware para manejar errores de JSON parse
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON');
    return res.status(400).send({ message: 'Invalid JSON' }); // Enviar un mensaje de error si hay un JSON inválido
  }
  next();
});

// Iniciar el servidor HTTPS
https.createServer(options, app).listen(oEnvironment.PORT, () => {
  console.log(`Server started, listening port: ${oEnvironment.PORT}`);
});

// Para manejar solicitudes HTTP y redirigirlas a HTTPS
const httpApp = express();
httpApp.get('*', (req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});

httpApp.listen(80, () => {
  console.log('HTTP server started, listening on port 80');
});
