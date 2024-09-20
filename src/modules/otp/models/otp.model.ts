import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'; // Rename mongoose Schema
import { Process } from 'src/common/models/process.model';
import { OTP_TTL } from 'src/config/env.config';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Process' })
    processId: Process;

    @Prop({ required: true })
    otp: string;

    @Prop({ required: true, default: Date.now, expires: `${OTP_TTL}m` })
    createdAt: Date;

    @Prop({ default: false })
    isValid: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
