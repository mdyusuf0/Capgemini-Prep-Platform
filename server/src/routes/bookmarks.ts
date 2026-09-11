import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  addBookmark,
  removeBookmark,
  getBookmarks
} from '../controllers/questionController.js';

const router = express.Router();

router.use(protect);

router.post('/', addBookmark);
router.delete('/:itemType/:itemId', removeBookmark);
router.get('/', getBookmarks);

export default router;
