const mysql = require("mysql");
const Promise = require("bluebird");

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

module.exports = class DbCore {
  constructor({
    dbHost,
    dbUsername,
    dbPassword,
    dbName,
    debugSql = false,
    logger
  }) {
    const dbProperties = {
      host: dbHost,
      user: dbUsername,
      password: dbPassword,
      database: dbName,
      supportBigNumbers: true,
      waitForConnections: true, // waitForConnections: Determines the pool's action when no connections are available and the limit has been reached. If true, the pool will queue the connection request and call it when one becomes available. If false, the pool will immediately call back with an error. (Default: true)
      connectionLimit: 10 // The maximum number of connections to create at once.
    };

    this.pool = mysql.createPool(dbProperties);

    this.pool.on("connection", function(connection) {
      connection.on("enqueue", function(sequence) {
        // if (sequence instanceof mysql.Sequence.Query) {
        if ("Query" === sequence.constructor.name) {
          if (debugSql) {
            logger.debug(sequence.sql);
          }
        }
      });
    });

    logger.info("created db pool");

    this.logger = logger;
  }

  getSqlConnection() {
    return this.pool.getConnectionAsync().disposer(connection => {
      connection.release();
    });
  }

  shutDown() {
    return this.pool.endAsync();
  }

  insert(tableName, sanitizedEntity) {
    return Promise.using(this.getSqlConnection(), connection => {
      const sql = `INSERT INTO ${tableName} SET ?`;
      return connection.queryAsync(sql, sanitizedEntity);
    });
  }

  getByField(tableName, fieldName, fieldValue) {
    return Promise.using(this.getSqlConnection(), connection => {
      const sql = `SELECT * FROM ${tableName} WHERE ${fieldName} = ?`;
      // eslint-disable-next-line no-unused-vars
      return connection.queryAsync(sql, fieldValue).then((rows, cols) => {
        if (rows.length) {
          return rows[0];
        }
        return null;
      });
    });
  }
};
