import { Op } from "sequelize";

function buildUserFilter(query = {}) {
  const where = {};

  if(query.name) {
    where.name = { [Op.iLike]: `%${query.name}%` };
  }
    if(query.email) {
    where.email = { [Op.iLike]: `%${query.email}%` };
  }

  return where;
}

export default buildUserFilter;
