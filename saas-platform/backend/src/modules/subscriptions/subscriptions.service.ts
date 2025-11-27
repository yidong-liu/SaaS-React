import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private subscriptions = [];

  create(createSubscriptionDto: CreateSubscriptionDto) {
    const newSubscription = {
      id: this.subscriptions.length + 1,
      ...createSubscriptionDto,
    };
    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  findAll() {
    return this.subscriptions;
  }

  findOne(id: number) {
    return this.subscriptions.find(subscription => subscription.id === id);
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscriptionIndex = this.subscriptions.findIndex(subscription => subscription.id === id);
    if (subscriptionIndex > -1) {
      this.subscriptions[subscriptionIndex] = {
        ...this.subscriptions[subscriptionIndex],
        ...updateSubscriptionDto,
      };
      return this.subscriptions[subscriptionIndex];
    }
    return null;
  }

  remove(id: number) {
    const subscriptionIndex = this.subscriptions.findIndex(subscription => subscription.id === id);
    if (subscriptionIndex > -1) {
      return this.subscriptions.splice(subscriptionIndex, 1);
    }
    return null;
  }
}