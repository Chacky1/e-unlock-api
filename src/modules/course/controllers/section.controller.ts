import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SectionService } from '../providers/services/section.service';
import { CreateSectionDto } from '../dto/create-section.dto';
import { ErrorsInterceptor } from '../../../shared/interceptors/errors.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @UseInterceptors(ErrorsInterceptor)
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:sections')
  @ApiCreatedResponse({
    type: CreateSectionDto,
  })
  public async create(@Body() createSectionDto: CreateSectionDto) {
    return await this.sectionService.create(createSectionDto);
  }
}
