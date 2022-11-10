import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignSchema } from 'src/schema/campaign/campaign.schema';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Campaign', schema: CampaignSchema }
        ])
    ],
    controllers: [CampaignController],
    providers: [CampaignService]
})
export class CampaignModule {}
