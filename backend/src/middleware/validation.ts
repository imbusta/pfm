import { Request, Response, NextFunction } from 'express';

/**
 * Validates transaction creation request
 */
export function validateTransactionCreate(req: Request, res: Response, next: NextFunction) {
  const { description, amount, type, date } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!description || typeof description !== 'string') {
    errors.push('Description is required and must be a string');
  }

  if (amount === undefined || amount === null) {
    errors.push('Amount is required');
  } else if (typeof amount !== 'number' || isNaN(amount)) {
    errors.push('Amount must be a valid number');
  }

  if (!type || !['income', 'expense'].includes(type)) {
    errors.push('Type is required and must be either "income" or "expense"');
  }

  if (!date) {
    errors.push('Date is required');
  } else if (isNaN(Date.parse(date))) {
    errors.push('Date must be a valid date');
  }

  // Optional fields validation
  if (req.body.currency_id !== undefined && (typeof req.body.currency_id !== 'number' || isNaN(req.body.currency_id))) {
    errors.push('Currency ID must be a valid number');
  }

  if (req.body.category_id !== undefined && req.body.category_id !== null && (typeof req.body.category_id !== 'number' || isNaN(req.body.category_id))) {
    errors.push('Category ID must be a valid number or null');
  }

  if (req.body.subcategory_id !== undefined && req.body.subcategory_id !== null && (typeof req.body.subcategory_id !== 'number' || isNaN(req.body.subcategory_id))) {
    errors.push('Subcategory ID must be a valid number or null');
  }

  if (req.body.is_variable !== undefined && typeof req.body.is_variable !== 'boolean') {
    errors.push('is_variable must be a boolean');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  next();
}

/**
 * Validates transaction update request
 */
export function validateTransactionUpdate(req: Request, res: Response, next: NextFunction) {
  const { description, amount, type, date, currency_id, category_id, subcategory_id, is_variable } = req.body;

  const errors: string[] = [];

  // At least one field must be provided
  if (
    description === undefined &&
    amount === undefined &&
    type === undefined &&
    date === undefined &&
    currency_id === undefined &&
    category_id === undefined &&
    subcategory_id === undefined &&
    is_variable === undefined &&
    req.body.category === undefined &&
    req.body.subcategory === undefined &&
    req.body.currency === undefined
  ) {
    errors.push('At least one field must be provided for update');
  }

  // Validate provided fields
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (amount !== undefined && (typeof amount !== 'number' || isNaN(amount))) {
    errors.push('Amount must be a valid number');
  }

  if (type !== undefined && !['income', 'expense'].includes(type)) {
    errors.push('Type must be either "income" or "expense"');
  }

  if (date !== undefined && isNaN(Date.parse(date))) {
    errors.push('Date must be a valid date');
  }

  if (currency_id !== undefined && (typeof currency_id !== 'number' || isNaN(currency_id))) {
    errors.push('Currency ID must be a valid number');
  }

  if (category_id !== undefined && category_id !== null && (typeof category_id !== 'number' || isNaN(category_id))) {
    errors.push('Category ID must be a valid number or null');
  }

  if (subcategory_id !== undefined && subcategory_id !== null && (typeof subcategory_id !== 'number' || isNaN(subcategory_id))) {
    errors.push('Subcategory ID must be a valid number or null');
  }

  if (is_variable !== undefined && typeof is_variable !== 'boolean') {
    errors.push('is_variable must be a boolean');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  next();
}
