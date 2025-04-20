import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const app = express();
const PORT = process.env.PORT || 5001;

let todos: Todo[] = [];

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/todos", (_req: Request, res: Response) => {
  res.json(todos);
});

app.post("/api/todos", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo: Todo = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put("/api/todos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title ?? todos[todoIndex].title,
    completed: completed ?? todos[todoIndex].completed,
  };

  res.json(todos[todoIndex]);
});

app.delete("/api/todos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos = todos.filter((todo) => todo.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
