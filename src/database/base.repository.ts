type CreateData<T> = Omit<Partial<T>, 'id' | 'createdAt' | 'updatedAt'>;

export interface BaseDelegate<T extends { id: string }> {
  create(args: { data: CreateData<T> }): Promise<T>;
  createMany(args: { data: Array<CreateData<T>> }): Promise<{ count: number }>;
  findMany(args?: {
    where?: Partial<T>;
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<T[]>;
  findFirst(args?: { where?: Partial<T> }): Promise<T | null>;
  findUnique(args: { where: { id: string } }): Promise<T | null>;
  update(args: { where: { id: string }; data: Partial<T> }): Promise<T>;
  delete(args: { where: { id: string } }): Promise<T>;
  deleteMany(args?: { where?: Partial<T> }): Promise<{ count: number }>;
  count(args?: { where?: Partial<T> }): Promise<number>;
}

export class BaseRepository<T extends { id: string; createdAt: Date; updatedAt: Date; deletedAt?: Date | null }> {
  constructor(protected readonly delegate: BaseDelegate<T>) {}

  create(data: CreateData<T>): Promise<T> {
    return this.delegate.create({ data });
  }

  createMany(data: Array<CreateData<T>>): Promise<{ count: number }> {
    return this.delegate.createMany({ data });
  }

  find(where: Partial<T>): Promise<T[]> {
    return this.delegate.findMany({ where });
  }

  findAll(): Promise<T[]> {
    return this.delegate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findPaginated(
    page: number,
    pageSize: number,
    where: Partial<T> = {},
  ): Promise<{ results: T[]; total: number }> {
    const [results, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.delegate.count({ where }),
    ]);
    return { results, total };
  }

  findOne(where: Partial<T>): Promise<T | null> {
    return this.delegate.findFirst({ where });
  }

  findById(id: string): Promise<T | null> {
    return this.delegate.findUnique({ where: { id } });
  }

  updateById(id: string, data: Partial<T>): Promise<T> {
    return this.delegate.update({ where: { id }, data });
  }

  deleteById(id: string): Promise<T> {
    return this.delegate.delete({ where: { id } });
  }

  deleteMany(where: Partial<T>): Promise<{ count: number }> {
    return this.delegate.deleteMany({ where });
  }

  findActive(where: Partial<T> = {}): Promise<T[]> {
    return this.delegate.findMany({ where: { ...where, deletedAt: null } });
  }

  findActiveById(id: string): Promise<T | null> {
    return this.delegate.findFirst({ where: { id, deletedAt: null } as Partial<T> });
  }

  softDelete(id: string): Promise<T> {
    return this.delegate.update({ where: { id }, data: { deletedAt: new Date() } as Partial<T> });
  }
}
