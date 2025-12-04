import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"login"})
export class Login
{
   @PrimaryGeneratedColumn()
   id:number;

   @Column()
   phonenumber:string;

   @Column()
   applicantId:string;

   
   @Column()
   first_name:string;


   @Column({type:'timestamp'})
   login_date:Date;

   //data 
   



}