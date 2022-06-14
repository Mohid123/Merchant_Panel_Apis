import { Document } from 'mongoose';

export interface CategoryInterface extends Document {
  _id: string;
  categoryName: string;
}
