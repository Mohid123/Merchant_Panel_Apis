import { Document } from 'mongoose';

export interface CategoryInterface extends Document {
  id: string;
  type: string;
}
