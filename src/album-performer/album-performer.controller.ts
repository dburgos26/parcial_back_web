import { Controller, UseInterceptors, Post, Param } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumPerformerService } from './album-performer.service';

@Controller('album')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumPerformerController {

    constructor(private readonly albumPerformerService: AlbumPerformerService) { }

    @Post(':albumId/performer/:performerId')
    async addPerformerToAlbum(@Param('albumId') albumId: string, @Param('performerId') performerId: string) {
        return await this.albumPerformerService.addPerformerToAlbum(albumId, performerId);
    }

}
