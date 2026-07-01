import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

export async function verifyToken(req, res, next){
  const auth = req.headers.authorization || req.headers.Authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Support both regular users and distributors
    if (payload.role === "distributor") {
      const distributor = await prisma.distributor.findUnique({ where: { id: payload.userId } });
      if(!distributor) return res.status(401).json({ error: 'Invalid token' });
      req.user = { 
        userId: distributor.id, 
        id: distributor.id,
        email: distributor.email, 
        role: "distributor", 
        name: distributor.name,
        company: distributor.company,
        status: distributor.status
      };
    } else {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if(!user) return res.status(401).json({ error: 'Invalid token' });
      req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    }
    next();
  }catch(err){
    console.error('verifyToken', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(roles = []){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if(roles.length && !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
