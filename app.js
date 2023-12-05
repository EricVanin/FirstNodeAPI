const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");

const app = express()

app.use(express.json());

let alunos = [];
let disciplinas = [];
let notas = [];

// Leitura dos dados do arquivo, se existirem
fs.readFile("alunos.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        alunos = JSON.parse(data);
    }
});

fs.readFile("disciplinas.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        disciplinas = JSON.parse(data);
    }
});

fs.readFile("notas.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        notas = JSON.parse(data);
    }
});

// Rotas para Alunos
app.post("/alunos", (req, res) => {
    const { nome, matricula } = req.body;
    const aluno = {
        nome,
        matricula,
        id: randomUUID(),
    };
    alunos.push(aluno);
    writeFile("alunos.json", alunos);
    return res.json(aluno);
});

app.get("/alunos", (req, res) => {
    return res.json(alunos);
});

// Rotas para Disciplinas
app.post("/disciplinas", (req, res) => {
    const { nome } = req.body;
    const disciplina = {
        nome,
        id: randomUUID(),
    };
    disciplinas.push(disciplina);
    writeFile("disciplinas.json", disciplinas);
    return res.json(disciplina);
});

app.get("/disciplinas", (req, res) => {
    return res.json(disciplinas);
});

// Rotas para Notas
app.post("/notas", (req, res) => {
    const { alunoId, disciplinaId, nota } = req.body;
    const notaRegistro = {
        alunoId,
        disciplinaId,
        nota,
    };
    notas.push(notaRegistro);
    writeFile("notas.json", notas);
    return res.json(notaRegistro);
});

app.get("/notas/:alunoId/:disciplinaId", (req, res) => {
    const { alunoId, disciplinaId } = req.params;
    const nota = notas.find((n) => n.alunoId === alunoId && n.disciplinaId === disciplinaId);
    return res.json(nota || {});
});

// Geração de Histórico Escolar
app.get("/historico/:alunoId", (req, res) => {
    const { alunoId } = req.params;
    const historico = notas
        .filter((n) => n.alunoId === alunoId)
        .map((nota) => {
            const disciplina = disciplinas.find((d) => d.id === nota.disciplinaId);
            return {
                disciplina: disciplina.nome,
                nota: nota.nota,
            };
        });
    return res.json(historico);
});

function writeFile(filename, data) {
    fs.writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Dados em ${filename} atualizados`);
        }
    });
}

app.listen(8001, () => console.log("Servidor está rodando na porta 8001"));
