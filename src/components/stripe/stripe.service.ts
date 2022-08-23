import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripePaymentDTO } from 'src/dto/stripe/stripe.dto';
import { StripeInterface } from 'src/interface/stripe/stripe.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
const Stripe = require('stripe');

@Injectable()
export class StripeService {
  constructor(
    @InjectModel('Stripe') private _stripeModel: Model<StripeInterface>,
    @InjectModel('User') private _userModel: Model<UsersInterface>,
  ) {}

  async checkout(stripePaymentDto: StripePaymentDTO, req) {
    try {
      const payment = parseFloat(stripePaymentDto.payment) * 100;

      const key = process.env.stripeSecretKey;

      const stripe = Stripe(key);
      const token = await stripe.tokens.create(
        {
          card: {
            number: stripePaymentDto.card.number,
            exp_month: stripePaymentDto.card.expMonth,
            exp_year: stripePaymentDto.card.expYear,
            cvc: stripePaymentDto.card.cvc,
          },
        },
        {
          apiKey: key,
        },
      );

      const customer = await stripe.customers.create(
        {
          source: token.id,
          metadata: {
            userId: req.user.id,
          },
        },
        {
          apiKey: key,
        },
      );

      const user = await this._userModel.updateOne(
        {
          _id: req.user.id,
        },
        {
          stripeCustomerID: customer.id,
        },
      );

      const charge = await stripe.charges.create(
        {
          amount: payment,
          currency: 'EUR',
          description: stripePaymentDto.description,
          customer: customer.id,
        },
        {
          apiKey: key,
        },
      );

      const obj = {
        _id: charge.id,
        payment: stripePaymentDto.payment,
        description: stripePaymentDto.description,
        userId: req.user.id,
        stripe: { customer, charge },
      };

      delete obj.stripe.charge.payment_method_details.card.checks;
      delete obj.stripe.charge.payment_method_details.card.exp_month;
      delete obj.stripe.charge.payment_method_details.card.exp_year;

      delete obj.stripe.charge.source.cvc_check;
      delete obj.stripe.charge.source.exp_month;
      delete obj.stripe.charge.source.exp_year;
      delete obj.stripe.charge.source.fingerprint;

      await new this._stripeModel(obj).save();
      // return {token,customer,charge}
      return { customer, charge };
    } catch (err) {
      console.log(err);
      throw new HttpException('Invalid Card Details', HttpStatus.BAD_REQUEST);
    }
  }
}
