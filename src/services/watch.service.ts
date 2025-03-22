import { stringify } from 'querystring';
import prisma from '../config/database';

const WatchService = {
  create: async (data: any) => {
    return await prisma.watch.create({ data });
  },
  getAll: async () => {
    return await prisma.watch.findMany();
  },
  update: async ( id: string, data: any) => {
    return await prisma.watch.update({
      where: { id: String(id) },
      data,
    });
  },
  delete: async (id: string) => {
    return await prisma.watch.delete({
      where: { id: String(id) },
    });
  },
};

export default WatchService;