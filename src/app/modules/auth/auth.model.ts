import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { AuthModel, IAuth } from './auth.interface';

const authSchema = new Schema<IAuth>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

authSchema.statics.isUserExist = async function (
  email: string,
): Promise<Pick<IAuth, 'id' | 'email' | 'password'> | null> {
  return await Auth.findOne({ email }, { password: 1, role: 1 });
};

authSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savePassword);
};

authSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.jwt.bcrypt_salt_rounds),
  );
  next();
});

const Auth = model<IAuth, AuthModel>('Auth', authSchema);

export default Auth;
