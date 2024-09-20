import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProcessDocument = HydratedDocument<Process>;

@Schema({ timestamps: true })
export class Process {
    @Prop({ required: true, })
    phoneId: string;

    @Prop({ required: false, type: MongooseSchema.Types.Map })
    metadata: object;

    @Prop({ required: true })
    type: ProcessType;

    @Prop({ required: true, default: false })
    completed: boolean;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
