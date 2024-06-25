import { ModelClass } from 'objection';
import { BaseModel } from './models/base.model';


export class BaseRepository<T extends BaseModel> {
  constructor(private model: ModelClass<T>) {}

  create(data: Partial<T>) {
    return this.model.query().insert(data);
  }

  createBulk(data: Partial<T>[]) {
    return this.model.query().insert(data);
  }

  find(data: Partial<T>, relations = '') {
    return this.model.query().where(data).withGraphFetched(relations);
  }

  findAll() {
    return this.model.query().orderBy('createdAt', 'DESC');
  }

  findPaginated(page: number, pageSize: number) {
    return this.model.query().page(page - 1, pageSize);
  }

  findOne(data: Partial<T>, relations = '') {
    return this.model.query().findOne(data).withGraphFetched(relations);
  }

  findById(id: string, relations = '') {
    return this.model.query().findById(id).withGraphFetched(relations);
  }

  updateById(id: string, data: Partial<T>) {
    return this.model.query().patchAndFetchById(id, data);
  }

  updateOne(condition: Partial<T>, data: Partial<T>) {
    return this.model.query().findOne(condition).update(data);
  }

  deleteById(id: string) {
    return this.model.query().deleteById(id);
  }

  delete(condition: Partial<T>) {
    return this.model.query().where(condition).delete();
  }
}
