import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersInterface } from '../../interface/user/users.interface';
import { EmailDTO } from '../../dto/email/email.dto';
import * as nodemailer from 'nodemailer';
import { OTP } from 'src/interface/otp/otp.interface';
import { cpuUsage } from 'process';
import { USERSTATUS } from 'src/enum/user/userstatus.enum';
import { VoucherCounterInterface } from 'src/interface/vouchers/vouchersCounter.interface';
import { LeadInterface } from 'src/interface/lead/lead.interface';
import { USERROLE } from 'src/enum/user/userrole.enum';
import axios from 'axios';

var htmlencode = require('htmlencode');
var generator = require('generate-password');
var otpGenerator = require('otp-generator');

let transporter;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly _usersService: Model<UsersInterface>,
    @InjectModel('OTP') private readonly _otpService: Model<OTP>,
    @InjectModel('Counter')
    private readonly voucherCounterModel: Model<VoucherCounterInterface>,
    @InjectModel('Lead') private readonly _leadModel: Model<LeadInterface>,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'noreplydivideals@gmail.com',
        pass: 'eyccuiqvdskyaknn',
      },
    });
  }

  async generateCustomerId(sequenceName) {
    const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(
      sequenceName,
      {
        $inc: {
          sequenceValue: 1,
        },
      },
      { new: true },
    );

    const year = new Date().getFullYear() % 2000;

    return `CBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${
      sequenceDocument.sequenceValue < 10000 ? '0' : ''
    }${sequenceDocument.sequenceValue}`;
  }

  async loginToken() {
    const userData = {
      id: '6130c471434e4e306484e31c',
      email: 'haider@gmail.com',
      admin: true,
    };
    return this.generateToken(userData);
  }

  private generateToken(payload) {
    return {
      access_token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }

  async loginForCRM(loginDto) {
    const user = {
      id: '62e24ed393beea2cdbf8ccd2',
      email: 'admin@divideals.com',
      password: 'DiviDeals@123',
      role: 'Manager',
      isFromCRM: true,
    };

    if (!(loginDto.email == user.email)) {
      throw new UnauthorizedException('Incorrect email!');
    }

    if (!(loginDto.password == user.password)) {
      throw new UnauthorizedException('Incorrect password!');
    }

    delete user.password;

    const token = await this.generateToken(user);

    return { token: token.access_token };
  }

  async login(loginDto) {
    let user = await this._usersService.findOne({
      email: loginDto.email.toLowerCase(),
      deletedCheck: false,
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect email!');
    }

    if (!(user.status == USERSTATUS.approved && (user.role == USERROLE.merchant))) {
      throw new NotFoundException('Merchant Not Found!');
    }

    const isValidCredentials = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidCredentials) {
      throw new UnauthorizedException('Incorrect password!');
    }
    user = JSON.parse(JSON.stringify(user));

    delete user.password;
    delete user.aboutUs;
    delete user.finePrint;
    delete user.businessHours;
    delete user.gallery;

    const token = this.generateToken(user);

    return { user, token: token.access_token };
  }

  async loginCustomer(loginDto) {
    let user = await this._usersService.findOne({
      email: loginDto.email.toLowerCase(),
      deletedCheck: false,
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect email!');
    }

    if (!(user.role == 'Customer')) {
      throw new NotFoundException('Customer Not Found!');
    }

    const isValidCredentials = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidCredentials) {
      throw new UnauthorizedException('Incorrect password!');
    }
    user = JSON.parse(JSON.stringify(user));

    delete user.password;
    delete user.aboutUs;
    delete user.finePrint;
    delete user.businessHours;

    const token = this.generateToken(user);

    return { user, token: token.access_token };
  }

  async loginAdmin (loginDto) {
    try {
      let user = await this._usersService.findOne({
        email: loginDto.email.toLowerCase(),
        deletedCheck: false,
      });
  
      if (!user) {
        throw new UnauthorizedException('Incorrect email!');
      }
  
      if (!(user.role == USERROLE.admin)) {
        throw new NotFoundException('This user is not an admin.');
      }
  
      const isValidCredentials = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
  
      if (!isValidCredentials) {
        throw new UnauthorizedException('Incorrect password!');
      }
      user = JSON.parse(JSON.stringify(user));
  
      delete user.password;
      delete user.aboutUs;
      delete user.finePrint;
      delete user.businessHours;
  
      const token = this.generateToken(user);
  
      return { user, token: token.access_token };
    } catch (err) {
      throw new HttpException(err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async generatePassword() {
    let password = generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      // strict: true
    });
    console.log(password);

    return password;
  }

  async signup(loginDto) {
    loginDto.email = loginDto?.email?.toLowerCase();
    let user = await this._usersService.findOne({
      email: loginDto.email,
      deletedCheck: false,
    });
    if (user) {
      throw new ForbiddenException('Email already exists');
    }
    loginDto._id = new Types.ObjectId().toString();

    loginDto.status = USERSTATUS.pending;
    loginDto.role = USERROLE.merchant;
    loginDto.tradeName = loginDto.companyName;
    loginDto.countryCode = 'BE';
    loginDto.leadSource = 'web';

    if (loginDto.role == USERROLE.merchant) {
      loginDto.platformPercentage = 25;
    }

    return await new this._usersService(loginDto).save();
  }

  async signupCustomer(signupUserDto) {
    signupUserDto.email = signupUserDto?.email?.toLowerCase();
    let user = await this._usersService.findOne({
      email: signupUserDto.email,
      deletedCheck: false,
    });
    if (user) {
      throw new ForbiddenException('Email already exists');
    }
    signupUserDto._id = new Types.ObjectId().toString();

    signupUserDto.status = USERSTATUS.approved;
    signupUserDto.role = USERROLE.customer;
    signupUserDto.userID = await this.generateCustomerId('customerID');

    const salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(signupUserDto.password, salt);

    signupUserDto.password = hashedPassword;

    let newUser = await new this._usersService(signupUserDto).save();
    newUser = JSON.parse(JSON.stringify(newUser));

    const res = await axios.get(
      `https://www.zohoapis.eu/crm/v2/functions/createcustomer/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&customerid=${newUser.userID}`,
    );

    const token = this.generateToken(newUser);

    return { newUser, token: token.access_token };
  }

  async sendMail(emailDto: EmailDTO) {
    // create reusable transporter object using the default SMTP transport

    // send mail with defined transport object
    var mailOptions = {
      from: emailDto.from,
      to: emailDto.to,
      subject: emailDto.subject,
      text: emailDto.text,
      html: emailDto.html,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        // res.redirect('/');
      }
    });
  }

  async isEmailExists(email) {
    const user = await this._usersService.findOne({
      email: email?.toLowerCase(),
      deletedCheck: false,
      role: USERROLE.merchant,
    });
    const lead = await this._leadModel.findOne({
      email: email?.toLowerCase(),
      deletedCheck: false,
      role: USERROLE.merchant,
    });

    return user || lead ? true : false;
  }

  async isEmailExistsForCustomerPanel(email) {
    const user = await this._usersService.findOne({
      email: email?.toLowerCase(),
      deletedCheck: false,
      role: USERROLE.customer,
    });

    return user ? true : false;
  }

  async sendOtp(otpEmailDto) {
    let userEmail = otpEmailDto.email?.toLowerCase();

    const user = await this._usersService.findOne({ email: userEmail });

    if (!user) {
      throw new HttpException('email not found', HttpStatus.NOT_FOUND);
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let expiryTime = new Date(Date.now()).getTime() + 1 * 60 * 1000;

    console.log(expiryTime);

    const otpObject = {
      otp,
      expiryTime,
      userEmail,
      userID: user.id,
    };

    const expiredOtp = await this._otpService.find({
      userEmail: userEmail,
      expiryTime: { $lt: new Date(Date.now()).getTime() },
    });

    let currentTime = new Date(Date.now()).getTime();

    if (expiredOtp[0]) {
      if (currentTime > expiredOtp[0].expiryTime) {
        await this._otpService.findByIdAndUpdate(expiredOtp[0]._id, {
          isUsed: true,
        });
      }
    }

    const otpAlreadyPresent = await this._otpService.find({
      userEmail: userEmail,
      isUsed: false,
    });

    if (otpAlreadyPresent.length > 0) {
      await this._otpService.findByIdAndUpdate(otpAlreadyPresent[0]._id, {
        isUsed: true,
      });
    }

    await this._otpService.create(otpObject);

    const emailDto: EmailDTO = {
      from: `"Divideals" <${process.env.EMAIL}>`,
      to: user.email,
      subject: 'OTP',
      text: '',
      html: `
        <html>
          <head>
          <title></title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <style type="text/css">
            /* FONTS */
              @media screen {
              @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
              }
              
              @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
              }
              
              @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
              }
              
              @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
              }
              }
              /* CLIENT-SPECIFIC STYLES */
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; }
              /* RESET STYLES */
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              table { border-collapse: collapse !important; }
              body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
              /* iOS BLUE LINKS */
              a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: none !important;
                  font-size: inherit !important;
                  font-family: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
              }
              /* ANDROID CENTER FIX */
              div[style*="margin: 16px 0;"] { margin: 0 !important; }
          </style>
          </head>
          <body style="background-color: #0081E9; margin: 0 !important; padding: 0 !important;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <!-- LOGO -->
              <tr>
                  <td bgcolor="#0081E9" align="center">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          <tr>
                              <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                <div style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #FFFFFF; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                  <h6 style="margin:0px"> DIVIDEALS</h6>
                                </div>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <!-- HERO -->
              <tr>
                  <td bgcolor="#0081E9" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          <tr>
                              <td bgcolor="#FFFFFF" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                <h6 style="margin:0px"> Dear</h6>
                                <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${
                                  user.firstName
                                } ${user.lastName}</h1>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <!-- COPY BLOCK -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                        <!-- COPY -->
                        <tr>
                          <td bgcolor="#FFFFFF" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                            <p style="margin: 0;">Your OTP for password reset on <b>Divideals ${
                              user.role
                            } Panel</b> is generated. Please use this OTP to create new password. </p>
                          </td>
                        </tr>
                        <!-- BULLETPROOF BUTTON -->
                        <tr>
                          <td bgcolor="#FFFFFF" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td bgcolor="#FFFFFF" align="center" style="padding: 20px 30px 60px 30px;">
                                  <table border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(
                                          otp,
                                        )}</b></a></td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                  </td>
              </tr>
              <!-- COPY CALLOUT -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                      </table>
                  </td>
              </tr>
              <!-- SUPPORT CALLOUT -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 30px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          <!-- HEADLINE -->
                          <tr>
                            <td bgcolor="#0081E9" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                              <h2 style="font-size: 20px; font-weight: 400; color: #FFFFFF; margin: 0;">Need more help?</h2>
                              <p style="margin: 0;"><a style="color: #FFFFFF;">We&rsquo;re here, ready to talk</a></p>
                            </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <!-- FOOTER -->
              <tr>
                  <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="480" >
                        <!-- PERMISSION REMINDER -->
                        <tr>
                          <td bgcolor="#F4F4F4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                            <p style="margin: 0;">You received this email because you requested for a password. If you did not, <a  style="color: #111111; font-weight: 700;">please contact us.</a>.</p>
                          </td>
                        </tr>
                      </table>
                  </td>
              </tr>
          </table>
          </body>
          </html>
        `,
    };

    this.sendMail(emailDto);

    return { message: 'OTP sent to mail.' };
  }

  async verifyOtp(userOtp) {
    try {
      const otp = await this._otpService.findOne({
        otp: userOtp,
        isUsed: false,
      });

      if (!otp) {
        throw 'Wrong OTP typed';
      }

      let currentTime = new Date(Date.now()).getTime();
      let expiryTime = otp.expiryTime;

      if (currentTime > expiryTime) {
        await this._otpService.findByIdAndUpdate(otp._id, { isUsed: true });
        throw 'Otp expired';
      }

      await this._otpService.findByIdAndUpdate(otp._id, { isUsed: true });

      let user = await this._usersService.findById(otp.userID);

      user = JSON.parse(JSON.stringify(user));
      delete user.password;
      delete user.finePrint;
      delete user.newUser;
      delete user.expiredVouchers;
      delete user.firstName;
      delete user.lastName;
      delete user.phoneNumber;
      delete user.role;
      delete user.businessType;
      delete user.legalName;
      delete user.streetAddress;
      delete user.zipCode;
      delete user.city;
      delete user.vatNumber;
      delete user.iban;
      delete user.bankName;
      delete user.kycStatus;
      delete user.province;
      delete user.website_socialAppLink;
      delete user.googleMapPin;
      delete user.businessHours;
      delete user.aboutUs;
      delete user.profilePicURL;
      delete user.profilePicBlurHash;
      delete user.deletedCheck;
      delete user.status;
      delete user.totalVoucherSales;
      delete user.redeemedVouchers;
      delete user.purchasedVouchers;
      delete user.totalEarnings;
      delete user.paidEarnings;
      delete user.pendingEarnings;
      delete user.totalDeals;
      delete user.scheduledDeals;
      delete user.pendingDeals;
      delete user.soldDeals;
      delete user.totalReviews;
      delete user.maxRating;
      delete user.minRating;
      delete user.ratingsAverage;

      user['isResetPassword'] = true;

      const token = this.generateToken(user);

      return { message: 'Otp verified!', token: token.access_token };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
