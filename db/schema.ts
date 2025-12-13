import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  value: doublePrecision("value"),
  subject_fk: integer("subject_fk").references(() => subjects.id, {
    onDelete: "cascade",
  }),
  description: varchar("description"),
  weight: doublePrecision("weight").default(1),
  date: timestamp("date", { mode: "date", withTimezone: true }).defaultNow(),
  category_fk: integer("category_fk").references(() => categories.id, {
    onDelete: "cascade",
  }),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
});

export const subjects = pgTable(
  "subjects",
  {
    id: serial("id").primaryKey(),
    name: varchar("name"),
    weight: doublePrecision("weight").default(1),
    category_fk: integer("category_fk").references(() => categories.id, {
      onDelete: "cascade",
    }),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique().on(t.userId, t.name, t.category_fk),
  })
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name"),
    selected: boolean("selected").default(false),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique().on(t.userId, t.name),
  })
);

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  passingGrade: doublePrecision("passingGrade").default(4),
  minimumGrade: doublePrecision("minimumGrade").default(1),
  maximumGrade: doublePrecision("maximumGrade").default(6),
  gradeDecimals: integer("gradeDecimals").default(3),
  newEntitySheetShouldStayOpen: boolean("newEntitySheetShouldStayOpen").default(
    false
  ),
  passingInverse: boolean("passingInverse").default(false),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
});

export const archivedata = pgTable(
  "archivedata",
  {
    id: serial("id").primaryKey(),
    data: text("data").notNull(),
    category: text("category").notNull(),
    date: timestamp("date", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    unq: unique().on(t.userId, t.data),
  })
);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    refresh_token_expires_in: integer("refresh_token_expires_in"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export type Grade = typeof grades.$inferSelect;
export type GradeWithSubject = {
  grades: Grade;
  subjects: Subject;
};
export type NewGrade = typeof grades.$inferInsert;
export type NewGradeWithNewSubject = {
  grades: NewGrade;
  subjects: NewSubject;
};

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Preferences = typeof preferences.$inferSelect;
export type NewPreferences = typeof preferences.$inferInsert;

export type ArchiveData = typeof archivedata.$inferSelect;
export type NewArchiveData = typeof archivedata.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type UserAccount = {
  user: User;
  account: Account;
};

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
