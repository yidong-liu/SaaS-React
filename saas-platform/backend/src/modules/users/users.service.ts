import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users = [];

    create(user) {
        this.users.push(user);
        return user;
    }

    findAll() {
        return this.users;
    }

    findOne(id: number) {
        return this.users.find(user => user.id === id);
    }

    update(id: number, updatedUser) {
        const index = this.users.findIndex(user => user.id === id);
        if (index > -1) {
            this.users[index] = { ...this.users[index], ...updatedUser };
            return this.users[index];
        }
        return null;
    }

    remove(id: number) {
        const index = this.users.findIndex(user => user.id === id);
        if (index > -1) {
            return this.users.splice(index, 1);
        }
        return null;
    }
}