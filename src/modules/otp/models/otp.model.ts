import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'; // Rename mongoose Schema
import { OTP_TTL } from 'src/config/env.config';
import { Process } from 'src/modules/processes/models/process.model';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Process' })
    processId: Process;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true, default: Date.now, expires: `${OTP_TTL}m` })
    createdAt: Date;

    @Prop({ required: true, default: true })
    isValid: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
