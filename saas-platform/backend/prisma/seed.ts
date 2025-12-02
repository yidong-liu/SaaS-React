import prisma from '../lib/prisma';

async function main() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      password: 'hashed_password_123',
      posts: {
        create: [
          { title: '第一篇文章', content: 'Alice 的第一篇文章', published: true },
          { title: '草稿文章', content: '这是一篇草稿', published: false },
        ],
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      password: 'hashed_password_456',
      posts: { create: [{ title: 'Bob 的文章', content: '内容', published: true }] },
    },
  });

  console.log('Seed done:', { alice, bob });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
