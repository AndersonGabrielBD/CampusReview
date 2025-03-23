const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota para testar o servidor
app.get("/", (req, res) => {
  res.send("API de Avaliação de Faculdades rodando! 🚀");
});

// **Rotas de Faculdades**

/**
 * Listar todas as faculdades
 */
app.get("/faculdades", async (req, res) => {
  try {
    const faculdades = await prisma.college.findMany();
    res.json(faculdades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar faculdades" });
  }
});

/**
 * Criar uma nova faculdade
 */
app.post("/faculdades", async (req, res) => {
  const { nome, localizacao, descricao } = req.body;
  try {
    const faculdade = await prisma.college.create({
      data: {
        nome,
        localizacao,
        descricao,
      },
    });
    res.status(201).json(faculdade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar faculdade" });
  }
});

// **Rotas de Avaliações**

/**
 * Criar uma avaliação de faculdade
 */
app.post("/avaliacoes", async (req, res) => {
  const { usuarioId, faculdadeId, nota, comentario } = req.body;

  // Log para depurar os dados recebidos
  console.log("Dados recebidos:", { usuarioId, faculdadeId, nota, comentario });

  try {
    const avaliacao = await prisma.review.create({
      data: {
        usuarioId,
        faculdadeId,
        nota,
        comentario,
      },
    });
    res.status(201).json(avaliacao);
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    res.status(500).json({ error: "Erro ao criar avaliação" });
  }
});

/**
 * Listar todas as avaliações de uma faculdade
 */
app.get("/faculdades/:id/avaliacoes", async (req, res) => {
  const { id } = req.params;
  try {
    const avaliacoes = await prisma.review.findMany({
      where: {
        faculdadeId: id,
      },
    });
    res.json(avaliacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// **Rotas de Autenticação**

/**
 * Registrar novo usuário
 */
app.post("/auth/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
    });

    res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

/**
 * Login de usuário
 */
app.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // Criar token de sessão (com JWT)
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // O token expira em 1 hora
    });

    // Calcular a data de expiração do token
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora à frente

    // Criar ou atualizar a sessão no banco de dados
    await prisma.session.upsert({
      where: { userId: user.id },
      update: {
        token,
        expiresAt,
      },
      create: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// **Middleware de Autenticação (verificar token JWT)**

/**
 * Middleware para verificar o token de autenticação
 */
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Acesso negado. Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    req.user = user; // Adiciona os dados do usuário ao request
    next(); // Passa para a próxima função ou rota
  });
};

// Exemplo de rota protegida: Apenas usuários autenticados podem acessar
app.get("/perfil", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar perfil de usuário" });
  }
});

// Configuração da porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
