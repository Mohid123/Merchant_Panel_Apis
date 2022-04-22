import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INVOICEAMOUNTENUM } from 'src/enum/sorting/sortinvoiceamount.enum';
import { INVOICEDATEENUM } from 'src/enum/sorting/sortinvoicedate.enum';
import { InvoiceInterface } from 'src/interface/invoices/invoices.interface';

@Injectable()
export class InvoicesService {
    constructor(@InjectModel('Invoices') private readonly _invoicesModel:Model<InvoiceInterface>) {}

    async createInvoice (invoiceDto) {

        invoiceDto.invoiceDate = new Date().getTime();

        return await new this._invoicesModel(invoiceDto).save()
    }

    async getInvoice (invoiceURL) {
        return await this._invoicesModel.findOne({invoiceURL: invoiceURL})
    }

    async getAllInvoices (offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            let totalCount = await this._invoicesModel.countDocuments();

            let invoices = await this._invoicesModel.aggregate([
                {
                    $sort: {
                        invoiceDate: -1
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
            .skip(parseInt(offset))
            .limit(parseInt(limit))

            return {
                totalCount: totalCount,
                data: invoices
            }

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllInvoicesByMerchant (merchantID, dateFrom, dateTo, invoiceDate, invoiceAmount, offset, limit) {
        try {

            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            dateFrom = parseInt(dateFrom)
            dateTo = parseInt(dateTo)

            let dateToFilters = {};
            let dateFromFilters = {};
            let matchFilter: {}

            if(dateFrom) {
                dateFromFilters = {
                    ...dateFromFilters,
                    '$gte': dateFrom
                }
            }

            if(dateTo){
                dateToFilters = {
                    ...dateToFilters,
                    "$lte": dateTo
                }
            }

            if (dateFrom || dateTo) {
                matchFilter = {
                    ...matchFilter,
                    transactionDate: {
                        ...dateFromFilters,
                        ...dateToFilters
                    },
                        
                }
            }

            let sortFilters = {};

            let sortInvoiceDate;

            if (invoiceDate) {
                if (invoiceDate == INVOICEDATEENUM.ASC) {
                    sortInvoiceDate = 1;
                } else {
                    sortInvoiceDate = -1;
                }
                sortFilters = {
                  ...sortFilters,
                  transactionDate: sortInvoiceDate,
                };
            }

            let sortInvoiceAmount;

            if (invoiceAmount) {
                if (invoiceAmount == INVOICEAMOUNTENUM.ASC) {
                    sortInvoiceAmount = 1;
                } else {
                    sortInvoiceAmount = -1;
                }
                sortFilters = {
                  ...sortFilters,
                  amount: sortInvoiceAmount,
                };
            }

            const totalCount = await this._invoicesModel.countDocuments({
                merchantID: merchantID,
                ...matchFilter
            });

            let invoices = await this._invoicesModel.aggregate([
                {
                    $match: {
                        merchantID: merchantID,
                        ...matchFilter
                    }
                },
                {
                    $sort: {
                        ...sortFilters,
                        createdAt: -1
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        nameInLowerCase: 0
                    }
                }
            ])
            .skip(parseInt(offset))
            .limit(parseInt(limit));

            return {
                totalCount: totalCount,
                data: invoices
            }

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }
}
