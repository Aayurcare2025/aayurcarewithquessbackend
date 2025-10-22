// import { IsEnum } from "class-validator";
// import { UserRole } from "src/enum/ole.enum";


// import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
// @Entity({ name: 'user' })
// export class User extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ name: 'full_name' })
//   fullName: string;

//   @Column({unique:true})
//   email: string;

//   @Column({unique:true})
//   username: string;

//   @Column()
//   password: string;

// //    @Column({ nullable: true })
// //  resetPasswordToken: string | null;

// @Column({ type: 'varchar', length: 255, nullable: true })
// resetPasswordToken: string | null;  

//    @Column({ type: 'bigint', nullable: true })
//    resetPasswordExpires: number | null;
//   // @Column() // don't really need confirmPassword in DB
//   // confirmPassword: string;

//   @Column()
//   role: UserRole;
// }

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

// @Column({ nullable: true })
// otpCode: string | null;

// @Column({ type: 'timestamp', nullable: true })
// otpExpiresAt: Date | null;
 @Column({ type: 'varchar', length: 6, nullable: true })
  otpCode: string | null;

  // OTP expiry — use datetime
  @Column({ type: 'datetime', nullable: true })
  otpExpiresAt: Date | null;
}
