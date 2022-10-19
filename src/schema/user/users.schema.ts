/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { UsersInterface } from '../../interface/user/users.interface';
import { generateStringId } from '../../components/file-management/utils/utils';
import * as bcrypt from 'bcrypt';

export const UsersSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    // userID: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    affiliateID: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    role: { type: String, default: '' },
    businessType: { type: Array, default: [] },
    legalName: { type: String, default: '' },
    tradeName: { type: String, default: '' },
    streetAddress: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    city: { type: String, default: '' },
    vatNumber: { type: String, default: '' },
    iban: { type: String, default: '' },
    bic_swiftCode: { type: String, default: '' },
    accountHolder: { type: String, default: '' },
    bankName: { type: String, default: '' },
    kycStatus: { type: Boolean, default: false },
    province: { type: String, default: '' },
    website_socialAppLink: { type: String, default: '' },
    googleMapPin: { type: String, default: '' },
    businessHours: { type: Array },
    finePrint: { type: String, default: '' },
    aboutUs: { type: String, default: '' },
    profilePicURL: { type: String, default: '' },
    profilePicBlurHash: { type: String, default: '' },
    gallery: { type: Array },
    voucherPinCode: { type: String },
    deletedCheck: { type: Boolean, default: false },
    status: { type: String, default: '' },
    newUser: { type: Boolean, default: true },
    totalVoucherSales: { type: Number, default: 0 },
    redeemedVouchers: { type: Number, default: 0 },
    purchasedVouchers: { type: Number, default: 0 },
    expiredVouchers: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    paidEarnings: { type: Number, default: 0 },
    pendingEarnings: { type: Number, default: 0 },
    totalDeals: { type: Number, default: 0 },
    scheduledDeals: { type: Number, default: 0 },
    pendingDeals: { type: Number, default: 0 },
    soldDeals: { type: Number, default: 0 },
    countryCode: { type: String, default: 'BE' },
    leadSource: { type: String, default: 'web' },
    stripeCustomerID: { type: String, default: '' },
    ratingsAverage: {
      type: Number,
      default: 0,
      // min: [1, 'Rating must be above 1.0'],
      // max: [5, 'Rating must be below 5.0'],
      // set: (val) => Math.round(val * 10) / 10,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    maxRating: {
      type: Number,
      default: 0,
    },
    minRating: {
      type: Number,
      default: 0,
    },
    isSubscribed: { type: Boolean, default: false },
    popularCount: { type: Number, default: 0 },
    platformPercentage: { type: Number },
  },
  {
    collection: 'users',
  },
);

mongoose.model('User', UsersSchema);

UsersSchema.set('timestamps', true);

UsersSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// UsersSchema.pre<UsersInterface>('save', async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);

//   this.email = this.email.toLowerCase();

//   next();
// });

UsersSchema.index({ userID: 1, deletedCheck: 1 });
UsersSchema.index({ _id: 1, deletedCheck: 1 });
UsersSchema.index({ _id: 1, deletedCheck: 1, role: 1 });
UsersSchema.index({ email: 1 });
UsersSchema.index({ email: 1, deletedCheck: 1 });
UsersSchema.index({ email: 1, deletedCheck: 1, role: 1 });
