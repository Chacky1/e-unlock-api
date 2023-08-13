import {
  Controller,
  InternalServerErrorException,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from 'svix';
import { UserService } from '../providers/services/user.service';
import { CreateClerkUserDto } from '../dto/create-clerk-user.dto';

const { CLERK_WEBHOOK_SECRET } = process.env;

/**
 * Specific controller for Clerk webhook
 * This controller is used to create a user in our database when a user is created in Clerk
 */
@Controller('users/webhook')
export class UserWebhookController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createClerkUser(@Req() request: RawBodyRequest<Request>) {
    const webhook = new Webhook(CLERK_WEBHOOK_SECRET);

    const payload = request.rawBody.toString('utf8');
    const headers = request.headers as WebhookHeaders;

    try {
      const clerkUserDetails = webhook.verify(
        payload,
        headers,
      ) as CreateClerkUserDto;

      // Clerk allows multiple email addresses,
      // but we only use the first one since at creation time new user only has one email address
      return await this.userService.create({
        code: clerkUserDetails.id,
        email: clerkUserDetails.email_addresses[0].email_address,
        firstName: clerkUserDetails.first_name,
        lastName: clerkUserDetails.last_name,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

type WebhookHeaders = {
  'webbook-id': string;
  'webhook-timestamp': string;
  'webhook-signature': string;
};
