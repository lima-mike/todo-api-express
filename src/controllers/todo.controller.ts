import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTodo = async (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  try {
    const newTodo = await prisma.todo.create({
      data: { title },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany();

    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const getTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findFirst({ where: { id: parseInt(id) } });
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, isCompleted } = req.body;
  try {
    const todo = await prisma.todo.findFirst({ where: { id: parseInt(id) } });
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { title, isCompleted },
    });

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findFirst({ where: { id: parseInt(id) } });
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    await prisma.todo.delete({ where: { id: parseInt(id) } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
