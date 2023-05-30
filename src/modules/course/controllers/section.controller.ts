import { Body, Controller, Post } from '@nestjs/common';
import { SectionService } from '../providers/services/section.service';
import { CreateSectionDto } from '../dto/create-section.dto';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  public async create(@Body() createSectionDto: CreateSectionDto) {
    return await this.sectionService.create(createSectionDto);
  }
}
