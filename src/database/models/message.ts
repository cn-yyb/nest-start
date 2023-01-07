import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface messageAttributes {
  msgId?: number;
  senderId: string;
  receiverId?: string;
  msgType?: number;
  content?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  chatId?: number;
}

@Table({ tableName: 'message', timestamps: true })
export class message
  extends Model<messageAttributes, messageAttributes>
  implements messageAttributes
{
  @Column({
    field: 'msg_id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.SMALLINT,
    comment: '消息编号',
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  msgId?: number;

  @Column({
    field: 'sender_id',
    primaryKey: true,
    type: DataType.CHAR(36),
    comment: '发送者uid',
  })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  senderId!: string;

  @Column({
    field: 'receiver_id',
    allowNull: true,
    type: DataType.CHAR(36),
    comment: '接收者uid(可为空)',
  })
  receiverId?: string;

  @Column({
    field: 'msg_type',
    allowNull: true,
    type: DataType.INTEGER,
    comment:
      '0-文字 | 1-图片 | 2-音频 | 3-视频 | 4-emoji | 5-文件 | 6-分享链接 | 7- 定位位置 ',
  })
  msgType?: number;

  @Column({ allowNull: true, type: DataType.STRING(255), comment: '消息内容' })
  content?: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    comment: '0-未读|1-已读|2-已撤回|3-已删除',
    defaultValue: '0',
  })
  status?: number;

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date;

  @Column({
    field: 'chat_id',
    allowNull: true,
    type: DataType.INTEGER,
    comment: '房间号',
  })
  chatId?: number;
}
