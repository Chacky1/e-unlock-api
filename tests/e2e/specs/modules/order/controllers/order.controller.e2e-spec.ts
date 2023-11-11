import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UserModule } from '../../../../../../src/modules/user/user.module';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { OrderModule } from '../../../../../../src/modules/order/order.module';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';
import { OrderStatus } from '../../../../../../src/modules/order/types/order.type';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { createFakeOrderDto } from '../../../../../factories/order/dto/create-order/create-order.dto.factory';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';
import { createFakeUserDto } from '../../../../../factories/user/dto/create-user.dto.factory';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingCourseId: number;
  let existingUserCode: string;

  beforeAll(async () => {
    accessToken = await fetchAccessToken();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        CourseModule,
        OrderModule,
      ],
      providers: [JwtStrategy, ScopeGuard],
    }).compile();

    app = module.createNestApplication();

    await initNestApp(app);

    const fakeCategory = createFakeCategoryDto();

    const categoryResponse = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeCategory);

    const fakeCourse = createFakeCourseDto({
      categoryId: categoryResponse.body.id,
    });

    const courseResponse = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeCourse);

    existingCourseId = courseResponse.body.id;

    const fakeUser = createFakeUserDto();

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeUser);

    existingUserCode = userResponse.body.code;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders', () => {
    it('should create an order when called.', async () => {
      const fakeOrder = createFakeOrderDto({
        courseId: existingCourseId,
        userCode: existingUserCode,
      });

      await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeOrder)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('PATCH /orders/:id', () => {
    it('should update an order when called.', async () => {
      const fakeOrder = createFakeOrderDto({
        courseId: existingCourseId,
        userCode: existingUserCode,
      });

      const orderResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeOrder);

      const orderId = orderResponse.body.id;

      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: OrderStatus.SUCCESS })
        .expect(HttpStatus.OK);
    });

    it('should return a 404 error when the order does not exist.', async () => {
      const orderId = 999;

      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: OrderStatus.SUCCESS })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return a 400 error when the order status is invalid.', async () => {
      const fakeOrder = createFakeOrderDto({
        courseId: existingCourseId,
        userCode: existingUserCode,
      });
      const invalidStatus = 'invalid_status';

      const orderResponse = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeOrder);

      const orderId = orderResponse.body.id;

      await request(app.getHttpServer())
        .patch(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: invalidStatus })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
