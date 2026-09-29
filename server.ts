import express from 'express';
import { createServer as createViteServer } from 'vite';
import * as dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import {
  dbGetStudents,
  dbGetRooms,
  dbGetAgreements,
  dbGetPayments,
  dbInsertPayment,
  dbUpdatePaymentStatus,
  dbGetMaintenanceRequests,
  dbInsertMaintenanceRequest,
  dbUpdateMaintenanceStatus,
  dbGetActivityLogs,
  dbInsertActivityLog,
} from './src/db/queries.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API Routes
  // 1. Sync / Register user with Firebase UID
  app.post('/api/auth/sync-user', async (req, res) => {
    try {
      const { uid, email, name, role } = req.body;
      if (!uid || !email) {
        return res.status(400).json({ error: 'Missing uid or email' });
      }
      const user = await getOrCreateUser(uid, email, name, role);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('sync-user error:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // 2. Students
  app.get('/api/students', async (_req, res) => {
    try {
      const data = await dbGetStudents();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch students' });
    }
  });

  // 3. Rooms
  app.get('/api/rooms', async (_req, res) => {
    try {
      const data = await dbGetRooms();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch rooms' });
    }
  });

  // 4. Agreements
  app.get('/api/agreements', async (_req, res) => {
    try {
      const data = await dbGetAgreements();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch agreements' });
    }
  });

  // 5. Payments
  app.get('/api/payments', async (_req, res) => {
    try {
      const data = await dbGetPayments();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch payments' });
    }
  });

  app.post('/api/payments', async (req, res) => {
    try {
      const payment = await dbInsertPayment(req.body);
      res.json({ success: true, payment });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to record payment' });
    }
  });

  app.patch('/api/payments/:paymentCode/status', async (req, res) => {
    try {
      const { paymentCode } = req.params;
      const { status, paymentDate, paidTimestamp } = req.body;
      const updated = await dbUpdatePaymentStatus(paymentCode, status, paymentDate, paidTimestamp);
      res.json({ success: true, payment: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update payment status' });
    }
  });

  // 6. Maintenance Requests
  app.get('/api/maintenance', async (_req, res) => {
    try {
      const data = await dbGetMaintenanceRequests();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch maintenance requests' });
    }
  });

  app.post('/api/maintenance', async (req, res) => {
    try {
      const ticket = await dbInsertMaintenanceRequest(req.body);
      res.json({ success: true, ticket });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create maintenance ticket' });
    }
  });

  app.patch('/api/maintenance/:ticketCode/status', async (req, res) => {
    try {
      const { ticketCode } = req.params;
      const { status, updatedAt, ownerNotes, assignedTechnician, costEstimate, scheduledDate } = req.body;
      const updated = await dbUpdateMaintenanceStatus(
        ticketCode,
        status,
        updatedAt,
        ownerNotes,
        assignedTechnician,
        costEstimate,
        scheduledDate
      );
      res.json({ success: true, ticket: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update maintenance status' });
    }
  });

  // 7. Activity Logs
  app.get('/api/activities', async (_req, res) => {
    try {
      const data = await dbGetActivityLogs();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch activity logs' });
    }
  });

  app.post('/api/activities', async (req, res) => {
    try {
      const log = await dbInsertActivityLog(req.body);
      res.json({ success: true, log });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to log activity' });
    }
  });

  // In production, serve static files; in development, mount Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
