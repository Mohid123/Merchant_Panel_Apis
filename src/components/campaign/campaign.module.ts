import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CamapginSchema } from 'src/schema/campaign/campaign.schema';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Campaign', schema: CamapginSchema }
        ])
    ],
    controllers: [CampaignController],
    providers: [CampaignService]
})
export class CampaignModule {}
