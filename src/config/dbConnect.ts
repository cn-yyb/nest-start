import { SequelizeModuleOptions } from '@nestjs/sequelize';

// config/db.ts
const prodConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'start_db',
  logging: false, // 开启全局日志打印（建议单个查询开启）
  // models: allModels,
  autoLoadModels: true, // 自动加载模型
  synchronize: true,
  define: {
    timestamps: true, // 是否自动创建时间字段， 默认会自动创建createdAt、updatedAt
    paranoid: true, // 是否自动创建deletedAt字段
    // createdAt: 'createTime', // 重命名字段
    // updatedAt: 'updateTime',
    // deletedAt: 'deleteTime',
    underscored: true, // 开启下划线命名方式，默认是驼峰命名
    freezeTableName: true, // 禁止修改表名
    charset: 'utf8mb4',
  },
  retryAttempts: 10,
  retryDelay: 3000,
  // 模型同步
  // sync: {
  //   alter: true,
  // },
  pool: {
    max: 10, // 连接池中最大连接数量
    min: 0, // 连接池中最小连接数量
    acquire: 30000,
    idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  },
  timezone: '+08:00',
};

const devConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'start_db',
  logging: false, // 开启全局日志打印（建议单个查询开启）
  // models: allModels,
  autoLoadModels: true, // 自动加载模型
  synchronize: true,
  define: {
    timestamps: true, // 是否自动创建时间字段， 默认会自动创建createdAt、updatedAt
    paranoid: true, // 是否自动创建deletedAt字段
    // createdAt: 'createTime', // 重命名字段
    // updatedAt: 'updateTime',
    // deletedAt: 'deleteTime',
    underscored: true, // 开启下划线命名方式，默认是驼峰命名
    freezeTableName: true, // 禁止修改表名
    charset: 'utf8mb4',
  },
  retryAttempts: 10,
  retryDelay: 3000,
  // 根据模型同步数据库表（慎用）
  sync: {
    force: true,
    // alter: true,
  },
  pool: {
    max: 10, // 连接池中最大连接数量
    min: 0, // 连接池中最小连接数量
    acquire: 30000,
    idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  },
  timezone: '+08:00',
};

// 本地运行是没有 process.env.NODE_ENV 的，借此来区分[开发环境]和[生产环境]
const dbConfig = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default dbConfig;
