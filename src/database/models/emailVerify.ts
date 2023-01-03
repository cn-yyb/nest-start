import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface emailVerifyAttributes {
  id?: number;
  email: string;
  verifyCode: string;
  expirationTime: Date;
  indate?: number;
}

@Table({ tableName: 'email_verify', timestamps: true })
export class emailVerify
  extends Model<emailVerifyAttributes, emailVerifyAttributes>
  implements emailVerifyAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.SMALLINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.STRING(45), comment: '验证邮箱' })
  email!: string;

  @Column({ field: 'verify_code', type: DataType.STRING(6), comment: '验证码' })
  verifyCode!: string;

  @Column({
    field: 'expiration_time',
    type: DataType.DATE,
    comment: '过期时间',
  })
  expirationTime!: Date;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    comment: '有效期（标准时间戳）',
  })
  indate?: number;
}
