import { pgTable, text, uuid, varchar, timestamp, json, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  purpose: varchar("purpose", { length: 50 }).notNull(),
  organization: varchar("organization", { length: 100 }).notNull(),
  prefersSingleProject: boolean("prefers_single_project").default(false),
  theme: json("theme").default({
    mode: "light",
    primary: "blue",
    radius: "0.5rem"
  }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectName: varchar("project_name", { length: 100 }).notNull(),
  description: text("description"),
  userId: uuid("user_id").notNull(),
  dbName: varchar("db_name", { length: 100 }).notNull(),
  driver: varchar("driver", { length: 50 }).notNull(),
  userName: varchar("user_name", { length: 100 }).notNull(),
  password: text("password").notNull(),
  port: integer("port").notNull().default(5432),
  host: varchar("host", { length: 255 }).notNull(),
  schema: varchar("schema", { length: 100 }).default("public"),
  sslMode: varchar("ssl_mode", { length: 50 }).default("disable"),
  schemaGenStatus: varchar("schema_gen_status", { length: 50 }).default("pending"),
  // UI Configuration
  themeConfig: json("theme_config").default({
    mode: "light",
    primary: "blue",
    radius: "0.5rem",
    layout: "default"
  }).notNull(),
  // Feature flags and settings
  features: json("features").default({
    restApi: true,
    formBuilder: true,
    fileUpload: true,
    notifications: true,
    audit: true,
    analytics: true
  }).notNull(),
  // Layout and navigation
  layoutConfig: json("layout_config").default({
    sidebar: true,
    menuItems: [],
    dashboardLayout: []
  }).notNull(),
  // Access control
  permissions: json("permissions").default({
    roles: [],
    policies: {}
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const projectMembers = pgTable("project_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: varchar("role", { length: 50 }).notNull(), // admin, editor, viewer
  permissions: json("permissions").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const tableSchemas = pgTable("table_schemas", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull(),
  tableName: varchar("table_name", { length: 100 }).notNull(),
  schema: json("schema").notNull(), // Stores the analyzed database schema
  uiConfig: json("ui_config").default({
    viewType: "table", // table, card, custom
    columns: [],
    filters: [],
    sorting: [],
    actions: []
  }).notNull(),
  relationships: json("relationships").default([]).notNull(),
  displayFields: json("display_fields").default([]).notNull(),
  searchableFields: json("searchable_fields").default([]).notNull(),
  filterableFields: json("filterable_fields").default([]).notNull(),
  sortableFields: json("sortable_fields").default([]).notNull(),
  formConfig: json("form_config").default({
    layout: "default",
    sections: [],
    validations: []
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ 
    id: true, 
    createdAt: true,
    prefersSingleProject: true,
    theme: true
  })
  .extend({
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const forgotPasswordSchema = z.object({
  mail_id: z.string().email("Invalid email address"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  userId: true,
  createdAt: true,
  schemaGenStatus: true,
  themeConfig: true,
  features: true,
  layoutConfig: true,
  permissions: true
});

export const insertTableSchemaSchema = createInsertSchema(tableSchemas).omit({
  id: true,
  createdAt: true,
  uiConfig: true,
  relationships: true,
  displayFields: true,
  searchableFields: true,
  filterableFields: true,
  sortableFields: true,
  formConfig: true
});

export const insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
  id: true,
  createdAt: true,
  permissions: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type TableSchema = typeof tableSchemas.$inferSelect;
export type InsertTableSchema = z.infer<typeof insertTableSchemaSchema>;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = z.infer<typeof insertProjectMemberSchema>;