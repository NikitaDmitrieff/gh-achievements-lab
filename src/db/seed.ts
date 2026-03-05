import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // Create a demo user
  const [user] = await db
    .insert(schema.users)
    .values({
      name: "Demo User",
      email: "demo@example.com",
    })
    .returning();

  console.log("Created user:", user.email);

  // Create tags
  const [tagUrgent] = await db
    .insert(schema.tags)
    .values([
      { name: "urgent", color: "#ef4444", userId: user.id },
      { name: "feature", color: "#3b82f6", userId: user.id },
      { name: "bug", color: "#f97316", userId: user.id },
    ])
    .returning();

  console.log("Created tags");

  // Create tasks
  const [task1] = await db
    .insert(schema.tasks)
    .values([
      {
        title: "Set up CI/CD pipeline",
        description: "Configure GitHub Actions for automated testing and deployment",
        status: "today",
        priority: "p1",
        userId: user.id,
      },
      {
        title: "Design landing page",
        description: "Create wireframes and mockups for the main landing page",
        status: "this_week",
        priority: "p2",
        userId: user.id,
      },
      {
        title: "Fix login redirect bug",
        description: "Users are not redirected correctly after OAuth login",
        status: "inbox",
        priority: "p0",
        userId: user.id,
      },
      {
        title: "Write API documentation",
        status: "backlog",
        priority: "p3",
        userId: user.id,
      },
    ])
    .returning();

  console.log("Created tasks");

  // Link a tag to a task
  await db.insert(schema.taskTags).values({
    taskId: task1.id,
    tagId: tagUrgent.id,
  });

  console.log("Linked tags to tasks");

  // Create a weekly review
  await db.insert(schema.weeklyReviews).values({
    weekStartDate: "2026-03-02",
    summary: "Shipped auth module and started on task management features.",
    reflections: "Need to timebox design work better.",
    goals: "Complete database schema and seed data. Start on API routes.",
    userId: user.id,
  });

  console.log("Created weekly review");
  console.log("Seeding complete!");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
