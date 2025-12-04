import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  private subscriptions: Subscription[] = [];

  create(createSubscriptionDto: CreateSubscriptionDto): Subscription {
    const newSubscription: Subscription = {
      id: (this.subscriptions.length + 1).toString(),
      userId: createSubscriptionDto.userId,
      planId: createSubscriptionDto.planId,
      status: 'ACTIVE',
      quantity: createSubscriptionDto.quantity || 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: createSubscriptionDto.metadata,
    };
    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  findAll(): Subscription[] {
    return this.subscriptions;
  }

  findOne(id: string): Subscription | undefined {
    return this.subscriptions.find((subscription) => subscription.id === id);
  }

  update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Subscription | null {
    const subscriptionIndex = this.subscriptions.findIndex(
      (subscription) => subscription.id === id
    );
    if (subscriptionIndex > -1) {
      const updated = {
        ...this.subscriptions[subscriptionIndex],
        ...updateSubscriptionDto,
        updatedAt: new Date(),
      };
      this.subscriptions[subscriptionIndex] = updated;
      return updated;
    }
    return null;
  }

  remove(id: string): Subscription[] | null {
    const subscriptionIndex = this.subscriptions.findIndex(
      (subscription) => subscription.id === id
    );
    if (subscriptionIndex > -1) {
      return this.subscriptions.splice(subscriptionIndex, 1);
    }
    return null;
  }
}
