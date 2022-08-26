import { Model } from 'mongoose';
import { StripePaymentDTO } from 'src/dto/stripe/stripe.dto';
import { StripeInterface } from 'src/interface/stripe/stripe.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
export declare class StripeService {
    private _stripeModel;
    private _userModel;
    constructor(_stripeModel: Model<StripeInterface>, _userModel: Model<UsersInterface>);
    checkout(stripePaymentDto: StripePaymentDTO, req: any): Promise<{
        customer: any;
        charge: any;
    }>;
}
