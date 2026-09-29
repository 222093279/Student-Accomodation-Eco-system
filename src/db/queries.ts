import { db } from './index.ts';
import {
  students,
  rooms,
  agreements,
  payments,
  maintenanceRequests,
  activityLogs,
} from './schema.ts';
import { eq, desc } from 'drizzle-orm';

// Students
export async function dbGetStudents() {
  try {
    return await db.select().from(students);
  } catch (error) {
    console.error('dbGetStudents error:', error);
    throw new Error('Database query failed for students', { cause: error });
  }
}

// Rooms
export async function dbGetRooms() {
  try {
    return await db.select().from(rooms);
  } catch (error) {
    console.error('dbGetRooms error:', error);
    throw new Error('Database query failed for rooms', { cause: error });
  }
}

// Agreements
export async function dbGetAgreements() {
  try {
    return await db.select().from(agreements);
  } catch (error) {
    console.error('dbGetAgreements error:', error);
    throw new Error('Database query failed for agreements', { cause: error });
  }
}

// Payments
export async function dbGetPayments() {
  try {
    return await db.select().from(payments).orderBy(desc(payments.id));
  } catch (error) {
    console.error('dbGetPayments error:', error);
    throw new Error('Database query failed for payments', { cause: error });
  }
}

export async function dbInsertPayment(data: typeof payments.$inferInsert) {
  try {
    const result = await db.insert(payments).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('dbInsertPayment error:', error);
    throw new Error('Database insert failed for payment', { cause: error });
  }
}

export async function dbUpdatePaymentStatus(paymentCode: string, status: string, paidDate?: string, paidTimestamp?: string) {
  try {
    const result = await db
      .update(payments)
      .set({
        status,
        ...(paidDate ? { paymentDate: paidDate } : {}),
        ...(paidTimestamp ? { paidTimestamp } : {}),
      })
      .where(eq(payments.paymentCode, paymentCode))
      .returning();
    return result[0];
  } catch (error) {
    console.error('dbUpdatePaymentStatus error:', error);
    throw new Error('Database update failed for payment status', { cause: error });
  }
}

// Maintenance Requests
export async function dbGetMaintenanceRequests() {
  try {
    return await db.select().from(maintenanceRequests).orderBy(desc(maintenanceRequests.id));
  } catch (error) {
    console.error('dbGetMaintenanceRequests error:', error);
    throw new Error('Database query failed for maintenance requests', { cause: error });
  }
}

export async function dbInsertMaintenanceRequest(data: typeof maintenanceRequests.$inferInsert) {
  try {
    const result = await db.insert(maintenanceRequests).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('dbInsertMaintenanceRequest error:', error);
    throw new Error('Database insert failed for maintenance request', { cause: error });
  }
}

export async function dbUpdateMaintenanceStatus(
  ticketCode: string,
  status: string,
  updatedAt: string,
  ownerNotes?: string,
  assignedTechnician?: string,
  costEstimate?: number,
  scheduledDate?: string
) {
  try {
    const result = await db
      .update(maintenanceRequests)
      .set({
        status,
        updatedAt,
        ...(ownerNotes !== undefined ? { ownerNotes } : {}),
        ...(assignedTechnician !== undefined ? { assignedTechnician } : {}),
        ...(costEstimate !== undefined ? { costEstimate } : {}),
        ...(scheduledDate !== undefined ? { scheduledDate } : {}),
      })
      .where(eq(maintenanceRequests.ticketCode, ticketCode))
      .returning();
    return result[0];
  } catch (error) {
    console.error('dbUpdateMaintenanceStatus error:', error);
    throw new Error('Database update failed for maintenance status', { cause: error });
  }
}

// Activity Logs
export async function dbGetActivityLogs() {
  try {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.id)).limit(50);
  } catch (error) {
    console.error('dbGetActivityLogs error:', error);
    throw new Error('Database query failed for activity logs', { cause: error });
  }
}

export async function dbInsertActivityLog(data: typeof activityLogs.$inferInsert) {
  try {
    const result = await db.insert(activityLogs).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('dbInsertActivityLog error:', error);
    throw new Error('Database insert failed for activity log', { cause: error });
  }
}
