import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AMOUNTENUM } from '../../enum/sorting/sortamount.enum';
import { NAMEENUM } from '../../enum/sorting/sortcustomername.enum';
import { TRANSACTIONDATEENUM } from '../../enum/sorting/sorttransactiondate.enum';
import { OrderInterface } from '../../interface/orders/orders.interface';

@Injectable()
export class OrdersService {
    constructor(@InjectModel('Order') private readonly _orderModel: Model<OrderInterface>) {}

    async addOrder(orderDto) {
        try {
            let timeStamp = new Date().getTime();
            orderDto.transactionDate = timeStamp;

            return await new this._orderModel(orderDto).save();
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getOrder(id) {
        try {
            const order = this._orderModel.aggregate([
                {
                    $match: {
                        _id: id
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
            ]);
    
            return order;
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllOrders(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            const totalCount = await this._orderModel.countDocuments();

            let order = await this._orderModel.aggregate(
                [
                    {
                        $sort: {
                            transactionDate: -1
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
                ]
            )
            .skip(parseInt(offset))
            .limit(parseInt(limit));

            return {
                totalCount: totalCount,
                data: order
            };
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getOrdersByMerchant(merchantID, dateFrom, dateTo, Name, Date, Amount, Fee, Net, filterStatus, offset, limit) {
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

            Name = Name?.toUpperCase();

            let sortCustomerName;

            if (Name) {
                if (Name == NAMEENUM.ASC) {
                    sortCustomerName = 1;
                } else {
                    sortCustomerName = -1;
                }
                sortFilters = {
                  ...sortFilters,
                  nameInLowerCase: sortCustomerName,
                };
              }

            let sortDate;

            if (Date) {
                if (Date == TRANSACTIONDATEENUM.ASC) {
                    sortDate = 1;
                } else {
                    sortDate = -1;
                }
                sortFilters = {
                  ...sortFilters,
                  transactionDate: sortDate,
                };
              }

            let sortAmount;

            if (Amount) {
                if (Amount == AMOUNTENUM.ASC) {
                    sortAmount = 1;
                } else {
                    sortAmount = -1;
                }
                sortFilters = {
                  ...sortFilters,
                  amount: sortAmount,
                };
              }

            let sortFee;

            if (Fee) {
                if (Fee == AMOUNTENUM.ASC) {
                    sortFee = 1;
              } else {
                    sortFee = -1;
              }
                sortFilters = {
                  ...sortFilters,
                  fee: sortFee,
              };
            }

            let sortNet;

            if (Net) {
                if (Net == AMOUNTENUM.ASC) {
                    sortNet = 1;
              } else {
                    sortNet = -1;
              }
                sortFilters = {
                  ...sortFilters,
                  netAmount: sortNet,
              };
            }

            if (filterStatus) {
                matchFilter = {
                    ...matchFilter,
                    status: filterStatus
                }
            }

            const totalCount = await this._orderModel.countDocuments({
                merchantID: merchantID,
                ...matchFilter
            });
            
            let orders = await this._orderModel.aggregate(
                [
                    {
                        $match: {
                            merchantID: merchantID,
                            ...matchFilter
                        }
                    },
                    {
                        $addFields: {
                          nameInLowerCase: {
                            $toLower: "$customerName",
                          },
                        },
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
                ]
            )
            .skip(parseInt(offset))
            .limit(parseInt(limit));

            return {
                totalCount: totalCount,
                data: orders
            };

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }
}
