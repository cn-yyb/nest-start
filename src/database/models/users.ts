import { UUID, UUIDV4 } from 'sequelize';
import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface usersAttributes {
  userId?: number;
  uid: string;
  accountName?: string;
  nickName?: string;
  realName?: string;
  password?: string;
  passwordSalt?: string;
  email?: string;
  mobile?: string;
  role?: number;
  status?: number;
  bio?: string;
  gender?: number;
  birthday?: string;
  city?: string;
  province?: string;
  address?: string;
  sign?: string;
  avatar?: string;
  createBy?: number;
  updateBy?: number;
  createAt?: Date;
  updateAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({ tableName: 'users', timestamps: true, comment: '后台用户表' })
export class users
  extends Model<usersAttributes, usersAttributes>
  implements usersAttributes
{
  @Column({
    field: 'user_id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.SMALLINT,
    comment: '用户ID',
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  userId?: number;

  @Column({
    primaryKey: true,
    type: UUID,
    comment: '用户uuid',
    defaultValue: UUIDV4,
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  uid!: string;

  @Column({
    field: 'account_name',
    allowNull: true,
    type: DataType.STRING(24),
    comment: '用户账号',
  })
  accountName?: string;

  @Column({
    field: 'nick_name',
    allowNull: true,
    type: DataType.STRING(45),
    comment: '昵称',
  })
  nickName?: string;

  @Column({
    field: 'real_name',
    allowNull: true,
    type: DataType.STRING(20),
    comment: '真实姓名',
  })
  realName?: string;

  @Column({ allowNull: true, type: DataType.CHAR(32), comment: '密码' })
  password?: string;

  @Column({
    field: 'password_salt',
    allowNull: true,
    type: DataType.CHAR(6),
    comment: '密码盐',
  })
  passwordSalt?: string;

  @Column({ allowNull: true, type: DataType.STRING(45), comment: '邮箱' })
  email?: string;

  @Column({ allowNull: true, type: DataType.STRING(15), comment: '手机号码' })
  @Index({ name: 'idx_m', using: 'BTREE', order: 'ASC', unique: false })
  mobile?: string;

  @Column({
    allowNull: true,
    type: DataType.TINYINT,
    comment:
      '用户角色：0-超级管理员|1-管理员|2-开发&测试&运营|3-普通用户（只能查看）',
    defaultValue: '3',
  })
  role?: number;

  @Column({
    allowNull: true,
    type: DataType.TINYINT,
    comment: '状态：0- 禁用|1-正常|2-注销',
    defaultValue: '0',
  })
  status?: number;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  bio?: string;

  @Column({
    allowNull: true,
    type: DataType.TINYINT,
    comment: '性别 0-女 | 1-男 | -1 未知',
    defaultValue: '-1',
  })
  gender?: number;

  @Column({ allowNull: true, type: DataType.STRING(10) })
  birthday?: string;

  @Column({ allowNull: true, type: DataType.STRING(40), comment: '城市' })
  city?: string;

  @Column({ allowNull: true, type: DataType.STRING(30), comment: '省份' })
  province?: string;

  @Column({ allowNull: true, type: DataType.STRING(40), comment: '详细地址' })
  address?: string;

  @Column({ allowNull: true, type: DataType.STRING(120), comment: '签名' })
  sign?: string;

  @Column({ allowNull: true, type: DataType.STRING(120), comment: '用户头像' })
  avatar?: string;

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
