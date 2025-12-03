import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"login"})
export class Login
{
   @PrimaryGeneratedColumn()
   id:number;

   @Column()
   contact_number:string;

   
   @Column()
   first_name:string;

   @Column()
   applicant_id:string;


   @Column({type:'timestamp'})
   login_date:Date;

   //data 
   



}