import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserInput {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(
    hashedPassword: string,
    candidatePassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this as unknown as UserDocument;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = await bcrypt.hashSync(user.password as string, salt);

  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async (
  hashedPassword: string,
  candidatePassword: string
) => {
  return await bcrypt
    .compare(candidatePassword, hashedPassword as string)
    .catch(() => false);
};
const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
