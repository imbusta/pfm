import { Router, Request, Response } from 'express';
import CategoryModel from '../models/Category';
import SubcategoryModel from '../models/Subcategory';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/categories - Get all categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
    const response: ApiResponse = {
      success: true,
      data: categories,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
    });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid category ID',
      });
      return;
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        error: 'Category not found',
      });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch category',
    });
  }
});

// GET /api/categories/:id/subcategories - Get subcategories for a category
router.get('/:id/subcategories', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid category ID',
      });
      return;
    }

    const subcategories = await SubcategoryModel.findByCategoryId(id);
    res.json({ success: true, data: subcategories });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch subcategories',
    });
  }
});

// POST /api/categories - Create new category
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Category name is required',
      });
      return;
    }

    const category = await CategoryModel.create(name);
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category',
    });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid category ID',
      });
      return;
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Category name is required',
      });
      return;
    }

    const category = await CategoryModel.update(id, name);
    if (!category) {
      res.status(404).json({
        success: false,
        error: 'Category not found',
      });
      return;
    }

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category',
    });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid category ID',
      });
      return;
    }

    const deleted = await CategoryModel.delete(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Category not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category',
    });
  }
});

export default router;
