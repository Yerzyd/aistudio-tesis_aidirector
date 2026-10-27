import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const systemInstruction = `Eres un Director de Tesis IA experto. Tu objetivo es guiar a estudiantes de maestría y doctorado en su investigación.
      Ofreces asesoría metodológica, revisión científica y sugerencias académicas.
      Responde de manera formal, académica, pero accesible y motivadora.`;

      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction,
        }
      });

      // In a real app, we'd pass the history correctly to the SDK.
      // For this prototype, we'll just send the latest message with some context if needed,
      // or rely on the frontend to send a combined prompt.
      // To keep it simple, we'll just send the current message.
      
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  app.post("/api/generate-chapter", async (req, res) => {
    try {
      const { topic, chapter, context } = req.body;

      const prompt = `Actúa como escritor académico experto en tesis de maestría.
      Debes generar el contenido para el capítulo "${chapter}" de una tesis sobre el tema: "${topic}".
      
      Contexto adicional del proyecto:
      ${context}
      
      Instrucciones:
      - Redacción académica rigurosa.
      - Coherencia metodológica.
      - Sugiere citas bibliográficas relevantes (formato APA).
      - Estructura científica apropiada para este capítulo.
      - Extensión: Proporciona un borrador detallado y extenso (al menos 800 palabras) que sirva como base sólida para el estudiante.
      
      Genera el contenido en formato Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ error: "Failed to generate chapter" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
