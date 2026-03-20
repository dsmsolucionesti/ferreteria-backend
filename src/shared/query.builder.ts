export const buildSelect = (table: string) => {
  return {
    text: `SELECT * FROM ${table}`,
  };
};

export const buildSelectWithFilters = (
  table: string,
  condition: string,
  value: number | string,
) => {
  const isString = typeof value === "string";

  return {
    text: `SELECT * FROM ${table} WHERE ${condition} = ${isString ? `'${value}'` : value}`,
  };
};

export const buildInsert = (table: string, data: any) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const columns = keys.join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

  return {
    text: `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values,
  };
};

export const buildUpdate = (table: string, data: any, id: number) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

  return {
    text: `UPDATE ${table} SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *`,
    values: [...values, id],
  };
};

export const buildDelete = (
  table: string,
  condition: string,
  value: number | string,
) => {
  const isString = typeof value === "string";

  return {
    text: `DELETE FROM ${table} WHERE ${condition} = ${isString ? `'${value}'` : value} RETURNING id`,
  };
};
