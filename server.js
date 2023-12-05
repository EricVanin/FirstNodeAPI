const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === "/produto"){
    res.end(
        JSON.stringify({
            message: "Rota de produto",
        })
    );
  }

  if (req.url === "/usuario") {
    res.end(
        JSON.stringify({
            message: "Rota de usuário",
        })
    );
  }

  res.end(JSON.stringify({
    message: "Qualquer outra rota",
  }));


})



server.listen(8000);

//teste