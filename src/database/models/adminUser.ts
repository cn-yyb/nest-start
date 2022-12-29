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

export interface adminUserAttributes {
  userId?: number;
  uid?: string;
  accountName?: string;
  realName?: string;
  password?: string;
  passwordSalt?: string;
  mobile?: string;
  role?: number;
  status?: number;
  bio?: string;
  gender?: number;
  birthday?: Date;
  address?: string;
  avatar?: string;
  createBy?: number;
  updateBy?: number;
  createAt?: Date;
  updateAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({ tableName: 'admin_user', timestamps: true, comment: '后台用户表' })
export class adminUser
  extends Model<adminUserAttributes, adminUserAttributes>
  implements adminUserAttributes
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
    type: UUID,
    comment: '用户uuid',
    defaultValue: UUIDV4,
  })
  uid?: string;

  @Column({
    field: 'account_name',
    allowNull: true,
    type: DataType.STRING(24),
    comment: '用户账号',
  })
  accountName?: string;

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

  @Column({
    allowNull: true,
    type: DataType.STRING(15),
    comment: '手机号码',
    defaultValue: '0',
  })
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

  @Column({ allowNull: true, type: DataType.DATE })
  birthday?: Date;

  @Column({ allowNull: true, type: DataType.STRING(40) })
  address?: string;

  @Column({ allowNull: true, type: DataType.STRING(40), comment: '用户头像' })
  avatar?: string;

  @Column({
    field: 'create_by',
    allowNull: true,
    type: DataType.SMALLINT,
    comment: '创建人ID',
  })
  createBy?: number;

  @Column({
    field: 'update_by',
    allowNull: true,
    type: DataType.SMALLINT,
    comment: '修改人ID',
    defaultValue: '0',
  })
  updateBy?: number;

  @Column({
    field: 'create_at',
    allowNull: true,
    type: DataType.DATE,
    comment: '创建时间',
  })
  createAt?: Date;

  @Column({
    field: 'update_at',
    allowNull: true,
    type: DataType.DATE,
    comment: '修改时间',
  })
  updateAt?: Date;

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
