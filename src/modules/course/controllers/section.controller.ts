import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SectionService } from '../providers/services/section.service';
import { CreateSectionDto } from '../dto/create-section.dto';
import { ErrorsInterceptor } from '../providers/interceptors/errors.interceptor';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @UseInterceptors(ErrorsInterceptor)
  public async create(@Body() createSectionDto: CreateSectionDto) {
    return await this.sectionService.create(createSectionDto);
  }
}
