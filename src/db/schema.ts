import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// 1. Users Table (Linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('student'), // 'student' | 'owner'
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Students Table
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  studentNumber: text('student_number').notNull().unique(),
  idNumber: text('id_number'),
  fullName: text('full_name').notNull(),
  shortName: text('short_name'),
  email: text('email').notNull(),
  phone: text('phone'),
  institution: text('institution'),
  course: text('course'),
  assignedRoomId: text('assigned_room_id'),
  agreementStatus: text('agreement_status').default('Active'),
  avatarColor: text('avatar_color'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Rooms Table
export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  roomNumber: text('room_number').notNull().unique(),
  block: text('block').notNull(),
  floor: text('floor'),
  roomType: text('room_type'),
  capacity: integer('capacity').default(1),
  monthlyRent: integer('monthly_rent').notNull(),
  status: text('status').default('Occupied'),
  amenities: text('amenities'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Agreements Table
export const agreements = pgTable('agreements', {
  id: serial('id').primaryKey(),
  agreementCode: text('agreement_code').notNull().unique(),
  studentId: text('student_id').notNull(),
  roomId: text('room_id').notNull(),
  leaseTerm: text('lease_term').notNull(),
  startDate: text('start_date'),
  endDate: text('end_date'),
  monthlyRental: integer('monthly_rental').notNull(),
  securityDeposit: integer('security_deposit'),
  status: text('status').default('Active'),
  signedByStudent: boolean('signed_by_student').default(true),
  signedDate: text('signed_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Payments Table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  paymentCode: text('payment_code').notNull().unique(),
  studentId: text('student_id').notNull(),
  roomId: text('room_id').notNull(),
  transactionPeriod: text('transaction_period').notNull(),
  amount: integer('amount').notNull(),
  paymentDate: text('payment_date'),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull().default('Pending'), // 'Paid' | 'Pending'
  reference: text('reference').notNull(),
  paymentMethod: text('payment_method'),
  isSystemGenerated: boolean('is_system_generated').default(false),
  paidTimestamp: text('paid_timestamp'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Maintenance Requests Table
export const maintenanceRequests = pgTable('maintenance_requests', {
  id: serial('id').primaryKey(),
  ticketCode: text('ticket_code').notNull().unique(), // e.g. "MR-101"
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  studentNumber: text('student_number'),
  studentPhone: text('student_phone'),
  studentEmail: text('student_email'),
  roomId: text('room_id').notNull(),
  roomNumber: text('room_number').notNull(),
  block: text('block').notNull(),
  areaLocation: text('area_location'),
  title: text('title').notNull(),
  category: text('category').notNull(),
  priority: text('priority').notNull(), // 'Low' | 'Medium' | 'High' | 'Emergency'
  description: text('description').notNull(),
  status: text('status').notNull().default('Reported'), // 'Reported' | 'Scheduled' | 'In Progress' | 'Resolved' | 'Cancelled'
  preferredAccessTime: text('preferred_access_time'),
  assignedTechnician: text('assigned_technician'),
  scheduledDate: text('scheduled_date'),
  ownerNotes: text('owner_notes'),
  costEstimate: integer('cost_estimate'),
  photoAttachment: text('photo_attachment'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 7. Activity Logs Table
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  timeAgo: text('time_ago'),
  type: text('type').notNull(), // 'payment' | 'maintenance' | 'registration' | 'agreement' | 'alert'
  status: text('status'),
  previousStatus: text('previous_status'),
  entityId: text('entity_id'),
  entityType: text('entity_type'),
  actor: text('actor'),
  amount: integer('amount'),
  roomNumber: text('room_number'),
  studentName: text('student_name'),
  priority: text('priority'),
  createdAt: timestamp('created_at').defaultNow(),
});
