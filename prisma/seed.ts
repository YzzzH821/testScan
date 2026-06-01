import prisma from '../lib/prisma.ts';

async function main() {
  await prisma.attendanceRecord.deleteMany({});
  await prisma.attendanceRecord.createMany({
    data: [
      {
        staffId: 'A',
        name: '张三',
        nationalId: '1234567890',
        sex: '男',
        dateOfBirth: new Date('1990-01-01'),
        phone: '13800000000',
        attended: false,
      },
      {
        staffId: 'B',
        name: '李四',
        nationalId: '0987654321',
        sex: '女',
        dateOfBirth: new Date('1992-02-02'),
        phone: '13900000000',
        attended: true,
        lastCheckInAt: new Date(),
      },
    ],
  });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
