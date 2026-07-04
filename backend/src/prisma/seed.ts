import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding PeopleFlow database...');

  // ========================
  // Roles
  // ========================
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'System administrator with full access' },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'Employee' },
    update: {},
    create: { name: 'Employee', description: 'Regular employee with limited access' },
  });

  console.log('✅ Roles created');

  // ========================
  // Departments
  // ========================
  const departments = await Promise.all([
    prisma.department.upsert({ where: { name: 'Information Technology' }, update: {}, create: { name: 'Information Technology', description: 'Software development and IT operations' } }),
    prisma.department.upsert({ where: { name: 'Human Resources' }, update: {}, create: { name: 'Human Resources', description: 'People operations and talent management' } }),
    prisma.department.upsert({ where: { name: 'Finance' }, update: {}, create: { name: 'Finance', description: 'Financial planning and accounting' } }),
    prisma.department.upsert({ where: { name: 'Marketing' }, update: {}, create: { name: 'Marketing', description: 'Brand and growth marketing' } }),
    prisma.department.upsert({ where: { name: 'Operations' }, update: {}, create: { name: 'Operations', description: 'Business operations and logistics' } }),
  ]);

  console.log('✅ Departments created');

  // ========================
  // Leave Types
  // ========================
  const leaveTypes = await Promise.all([
    prisma.leaveType.upsert({ where: { name: 'Sick Leave' }, update: {}, create: { name: 'Sick Leave', description: 'Medical and health-related leave', maxDaysPerYear: 12, isPaid: true } }),
    prisma.leaveType.upsert({ where: { name: 'Paid Leave' }, update: {}, create: { name: 'Paid Leave', description: 'General paid time off', maxDaysPerYear: 21, isPaid: true } }),
    prisma.leaveType.upsert({ where: { name: 'Unpaid Leave' }, update: {}, create: { name: 'Unpaid Leave', description: 'Leave without pay', maxDaysPerYear: 30, isPaid: false } }),
  ]);

  console.log('✅ Leave types created');

  const passwordHash = await bcrypt.hash('Admin@1234', 12);
  const employeeHash = await bcrypt.hash('Employee@1234', 12);
  const currentYear = new Date().getFullYear();

  // ========================
  // Admin Account
  // ========================
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@peopleflow.com' },
    update: {},
    create: {
      email: 'admin@peopleflow.com',
      passwordHash,
      roleId: adminRole.id,
    },
  });

  const adminEmployee = await prisma.employee.upsert({
    where: { employeeCode: 'EMP001' },
    update: {},
    create: {
      employeeCode: 'EMP001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'admin@peopleflow.com',
      phone: '+91 9876543210',
      address: '42 MG Road, Kolkata, West Bengal',
      departmentId: departments[1].id, // HR
      designation: 'HR Manager',
      joiningDate: new Date('2022-01-15'),
      userId: adminUser.id,
    },
  });

  // Initialize leave balances for admin
  for (const lt of leaveTypes) {
    await prisma.leaveBalance.upsert({
      where: { employeeId_leaveTypeId_year: { employeeId: adminEmployee.id, leaveTypeId: lt.id, year: currentYear } },
      update: {},
      create: { employeeId: adminEmployee.id, leaveTypeId: lt.id, year: currentYear, totalDays: lt.maxDaysPerYear, usedDays: 0, remainingDays: lt.maxDaysPerYear },
    });
  }

  // ========================
  // Employee Accounts
  // ========================
  const employeeData = [
    { code: 'EMP002', firstName: 'Priyanshu', lastName: 'Mishra', email: 'priyanshu@peopleflow.com', phone: '+91 8765432109', address: '15 Park Street, Kolkata', deptIdx: 0, designation: 'Software Engineer', joinDate: '2023-03-01' },
    { code: 'EMP003', firstName: 'Aanya', lastName: 'Sharma', email: 'aanya@peopleflow.com', phone: '+91 7654321098', address: '7 Lake Gardens, Kolkata', deptIdx: 3, designation: 'Marketing Executive', joinDate: '2023-06-15' },
    { code: 'EMP004', firstName: 'Rahul', lastName: 'Verma', email: 'rahul@peopleflow.com', phone: '+91 6543210987', address: '22 Salt Lake, Kolkata', deptIdx: 2, designation: 'Finance Analyst', joinDate: '2022-09-01' },
    { code: 'EMP005', firstName: 'Divya', lastName: 'Patel', email: 'divya@peopleflow.com', phone: '+91 5432109876', address: '9 Ballygunge, Kolkata', deptIdx: 0, designation: 'Backend Developer', joinDate: '2024-01-10' },
    { code: 'EMP006', firstName: 'Arjun', lastName: 'Singh', email: 'arjun@peopleflow.com', phone: '+91 4321098765', address: '3 New Town, Kolkata', deptIdx: 4, designation: 'Operations Manager', joinDate: '2022-05-20' },
  ];

  const employees = [];
  for (const emp of employeeData) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: { email: emp.email, passwordHash: employeeHash, roleId: employeeRole.id },
    });

    const employee = await prisma.employee.upsert({
      where: { employeeCode: emp.code },
      update: {},
      create: {
        employeeCode: emp.code,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        address: emp.address,
        departmentId: departments[emp.deptIdx].id,
        designation: emp.designation,
        joiningDate: new Date(emp.joinDate),
        userId: user.id,
      },
    });

    employees.push(employee);

    // Leave balances
    for (const lt of leaveTypes) {
      const usedDays = Math.floor(Math.random() * 5);
      await prisma.leaveBalance.upsert({
        where: { employeeId_leaveTypeId_year: { employeeId: employee.id, leaveTypeId: lt.id, year: currentYear } },
        update: {},
        create: { employeeId: employee.id, leaveTypeId: lt.id, year: currentYear, totalDays: lt.maxDaysPerYear, usedDays, remainingDays: lt.maxDaysPerYear - usedDays },
      });
    }
  }

  console.log('✅ Employees created');

  // ========================
  // Payroll Records
  // ========================
  const salaries = [
    { empIdx: 0, basic: 85000, allowances: 15000, deductions: 5000, tax: 8500 },
    { empIdx: 1, basic: 55000, allowances: 10000, deductions: 3000, tax: 5500 },
    { empIdx: 2, basic: 65000, allowances: 12000, deductions: 4000, tax: 6500 },
    { empIdx: 3, basic: 70000, allowances: 12000, deductions: 3500, tax: 7000 },
    { empIdx: 4, basic: 75000, allowances: 13000, deductions: 4000, tax: 7500 },
  ];

  for (let i = 0; i < 3; i++) {
    const payPeriod = new Date(currentYear, new Date().getMonth() - i, 1);
    for (const sal of salaries) {
      const netSalary = sal.basic + sal.allowances - sal.deductions - sal.tax;
      await prisma.payroll.upsert({
        where: { employeeId_payPeriod: { employeeId: employees[sal.empIdx].id, payPeriod } },
        update: {},
        create: {
          employeeId: employees[sal.empIdx].id,
          basicSalary: sal.basic,
          allowances: sal.allowances,
          deductions: sal.deductions,
          tax: sal.tax,
          netSalary,
          payPeriod,
          paymentStatus: i > 0 ? 'Paid' : 'Pending',
          updatedById: adminEmployee.id,
        },
      });
    }
  }

  // Admin payroll
  const adminSalary = { basicSalary: 120000, allowances: 25000, deductions: 8000, tax: 12000 };
  for (let i = 0; i < 3; i++) {
    const payPeriod = new Date(currentYear, new Date().getMonth() - i, 1);
    const netSalary = adminSalary.basicSalary + adminSalary.allowances - adminSalary.deductions - adminSalary.tax;
    await prisma.payroll.upsert({
      where: { employeeId_payPeriod: { employeeId: adminEmployee.id, payPeriod } },
      update: {},
      create: { employeeId: adminEmployee.id, ...adminSalary, netSalary, payPeriod, paymentStatus: i > 0 ? 'Paid' : 'Pending', updatedById: adminEmployee.id },
    });
  }

  console.log('✅ Payroll records created');

  // ========================
  // Attendance Records (last 7 days)
  // ========================
  const allEmployees = [adminEmployee, ...employees];
  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (const emp of allEmployees) {
      const rand = Math.random();
      let status = 'Present';
      let checkIn: Date | null = null;
      let checkOut: Date | null = null;
      let totalHours: number | null = null;

      if (rand > 0.85) {
        status = 'Absent';
      } else {
        const checkinHour = rand > 0.7 ? 10 : 9;
        const checkinMinute = Math.floor(Math.random() * 30);
        checkIn = new Date(date);
        checkIn.setHours(checkinHour, checkinMinute, 0, 0);
        checkOut = new Date(date);
        const hoursWorked = rand > 0.8 ? 4 + Math.random() * 2 : 8 + Math.random() * 2;
        checkOut.setHours(checkIn.getHours() + Math.floor(hoursWorked), 0, 0, 0);
        totalHours = Math.round(hoursWorked * 100) / 100;
        status = checkinHour >= 10 ? 'Late' : totalHours >= 8 ? 'Present' : 'Half Day';
      }

      await prisma.attendanceRecord.upsert({
        where: { employeeId_attendanceDate: { employeeId: emp.id, attendanceDate: date } },
        update: {},
        create: { employeeId: emp.id, attendanceDate: date, checkIn, checkOut, totalHours, status },
      });
    }
  }

  console.log('✅ Attendance records created');

  // ========================
  // Sample Leave Requests
  // ========================
  const sickLeaveType = leaveTypes[0];
  const paidLeaveType = leaveTypes[1];

  await prisma.leaveRequest.create({
    data: {
      employeeId: employees[0].id,
      leaveTypeId: sickLeaveType.id,
      startDate: new Date(currentYear, new Date().getMonth(), new Date().getDate() + 2),
      endDate: new Date(currentYear, new Date().getMonth(), new Date().getDate() + 4),
      totalDays: 3,
      reason: 'I have a viral fever and need three days of rest to recover.',
      aiSummary: 'Employee requests sick leave due to viral fever requiring 3 days of rest.',
      aiSuggestedType: 'Sick Leave',
      aiPriority: 'High',
      aiRecommendation: 'Medical documentation may be required. Consider approving promptly.',
      status: 'Pending',
    },
  });

  await prisma.leaveRequest.create({
    data: {
      employeeId: employees[1].id,
      leaveTypeId: paidLeaveType.id,
      startDate: new Date(currentYear, new Date().getMonth(), new Date().getDate() + 5),
      endDate: new Date(currentYear, new Date().getMonth(), new Date().getDate() + 7),
      totalDays: 3,
      reason: 'Family vacation planned to Goa.',
      aiSummary: 'Employee requests paid leave for a planned family vacation.',
      aiSuggestedType: 'Paid Leave',
      aiPriority: 'Low',
      aiRecommendation: 'Planned leave. Ensure work handover before departure.',
      status: 'Pending',
    },
  });

  await prisma.leaveRequest.create({
    data: {
      employeeId: employees[2].id,
      leaveTypeId: paidLeaveType.id,
      startDate: new Date(currentYear, new Date().getMonth() - 1, 10),
      endDate: new Date(currentYear, new Date().getMonth() - 1, 12),
      totalDays: 3,
      reason: 'Personal family matter.',
      status: 'Approved',
      adminComment: 'Approved. Have a good time.',
      approvedById: adminEmployee.id,
    },
  });

  console.log('✅ Leave requests created');

  // ========================
  // Welcome Notifications
  // ========================
  const notifData = [
    { employeeId: employees[0].id, title: 'Welcome to PeopleFlow!', message: 'Your account has been set up. Explore your dashboard to get started.', type: 'success' },
    { employeeId: employees[1].id, title: 'Welcome to PeopleFlow!', message: 'Your account has been set up. Explore your dashboard to get started.', type: 'success' },
    { employeeId: employees[0].id, title: 'Leave Request Submitted', message: 'Your Sick Leave request for 3 days is pending approval.', type: 'info' },
    { employeeId: employees[2].id, title: 'Leave Request Approved', message: 'Your Paid Leave for 3 days has been approved.', type: 'success' },
  ];
  for (const notif of notifData) {
    await prisma.notification.create({ data: notif });
  }

  console.log('✅ Notifications created');
  console.log('\n🎉 Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Admin:    admin@peopleflow.com  | Admin@1234');
  console.log('📧 Employee: priyanshu@peopleflow.com | Employee@1234');
  console.log('📧 Employee: aanya@peopleflow.com  | Employee@1234');
  console.log('📧 Employee: rahul@peopleflow.com  | Employee@1234');
  console.log('📧 Employee: divya@peopleflow.com  | Employee@1234');
  console.log('📧 Employee: arjun@peopleflow.com  | Employee@1234');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

seed()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
