import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ProcessType } from '../enums/type.lib';

export type ProcessDocument = HydratedDocument<Process>;

@Schema({ timestamps: true })
export class Process {
    @Prop({ required: true, })
    phoneId: string;

    @Prop({ required: false, type: MongooseSchema.Types.Map })
    metadata: object;

    @Prop({ required: true })
    type: ProcessType.Auth;

    @Prop({ required: true, default: false })
    completed: boolean;

    @Prop({ required: true, default: Date.now, expires: `15m` })
    createdAt: Date;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
