"use server";

import { Category } from "@/db/schema";
import { Problem, getProblem } from "@/lib/problem";
import {
  changeSelectedCategoryInDb,
  deleteCategoryFromDb,
  getAllCategoriesFromDb,
  getCategoryByIdFromDb,
  getCurrentCategoryFromDb,
  insertCategoryIntoDb,
  updateCategoryInDb,
} from "@/lib/repositories/category-repo";
import { getUserId } from "@/lib/services/service-util";
import pino from "pino";

export async function getAllCategories(): Promise<Category[] | Problem> {
  try {
    const userId = await getUserId();
    pino().debug("Getting all categories for user=" + userId);
    return await getAllCategoriesFromDb(userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getCategoryById(id: number): Promise<Category | Problem> {
  try {
    const userId = await getUserId();
    pino().debug("Getting category by id=" + id + " for user=" + userId);
    return await getCategoryByIdFromDb(id, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getCurrentCategory(): Promise<Category | Problem> {
  try {
    const userId = await getUserId();
    pino().debug("Getting currently selected category for user=" + userId);
    return await getCurrentCategoryFromDb(userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function getCurrentCategoryElseInsert(): Promise<
  Category | Problem
> {
  try {
    const userId = await getUserId();
    const current = await getCurrentCategoryFromDb(userId);
    if (current) {
      pino().debug(
        "Returning current category=" + current.id + " for user=" + userId
      );
      return current;
    }
    pino().info("Inserting default category for user: " + userId);
    return await insertCategoryIntoDb("Default", true, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function insertCategory(
  name: string,
  selected: boolean = false
): Promise<Category | Problem> {
  try {
    const userId = await getUserId();
    pino().info(
      "Inserting category=" +
        name +
        " with selected=" +
        selected +
        " for user=" +
        userId
    );
    return await insertCategoryIntoDb(name, selected, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function updateCategory(
  category: Category
): Promise<Category | Problem> {
  try {
    const userId = await getUserId();
    pino().info("Updating category=" + category.id + " for user=" + userId);
    return await updateCategoryInDb(category, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function deleteCategory(id: number): Promise<Category | Problem> {
  try {
    const userId = await getUserId();
    pino().info("Deleting category by id=" + id + " for user=" + userId);
    return await deleteCategoryFromDb(id, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}

export async function selectCategory(id: number): Promise<boolean | Problem> {
  try {
    const userId = await getUserId();
    pino().debug("Selecting category by id=" + id + " for user=" + userId);
    return await changeSelectedCategoryInDb(id, userId);
  } catch (e: any) {
    return getProblem({
      errorMessage: e.message,
      errorCode: e.code,
      detail: e.detail,
    }) satisfies Problem;
  }
}
