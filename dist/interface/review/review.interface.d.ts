import { Document } from 'mongoose';
export interface ReviewInterface extends Document {
    id: string;
    dealId: string;
    customerID: string;
    merchantID: string;
    text: string;
    rating: number;
    customerEmail: string;
    customerName: string;
    profilePicURL: string;
}
