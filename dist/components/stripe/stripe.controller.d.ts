import { StripePaymentDTO } from 'src/dto/stripe/stripe.dto';
import { StripeService } from './stripe.service';
export declare class StripeController {
    private readonly _stripeService;
    constructor(_stripeService: StripeService);
    checkout(stripePaymentDto: StripePaymentDTO, req: any): Promise<{
        customer: any;
        charge: any;
    }>;
}
