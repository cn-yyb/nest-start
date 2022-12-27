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
  accountName?: string;
  realName?: string;
  passwd?: string;
  passwdSalt?: string;
  mobile?: string;
  role?: number;
  userStatus?: number;
  createBy?: number;
  updateBy?: number;
  createAt?: Date;
  updateAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  passwd?: string;

  @Column({
    field: 'passwd_salt',
    allowNull: true,
    type: DataType.CHAR(6),
    comment: '密码盐',
  })
  passwdSalt?: string;

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
    field: 'user_status',
    allowNull: true,
    type: DataType.TINYINT,
    comment: '状态：0-失效|1-有效|2-删除',
    defaultValue: '0',
  })
  userStatus?: number;

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

  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;
}
