import { Op } from "sequelize";

function buildEventFilter(query = {}) {
  const where = {};

  if (query.title) {
    where.title = { [Op.iLike]: `%${query.title}%` };
  }

  if (query.description) {
    where.description = { [Op.iLike]: `%${query.description}%` };
  }

  if (query.local) {
    where.local = { [Op.iLike]: `%${query.local}%` };
  }

  if (query.date) {
    where.date = query.date;
  }

  if (query.time) {
    where.time = query.time;
  }

  return where;
}

export default buildEventFilter;
