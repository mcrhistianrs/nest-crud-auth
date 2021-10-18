import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {hash} from 'bcrypt';


@Injectable()
export class UsersService {

 

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
   async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      user.password = await hash(createUserDto.password,10);
      return  this.usersRepository.save(user);  
    } catch (error) {
      return {
        name:"",
        email:"",
        password:""
      }
    }
  }

  findAll() {
    try {
      return this.usersRepository.find();
    } catch (error) {
      return {
        name:"",
        email:"",
        password:""
      }
    }
  }

  async findOne(id: number) {
    try {
      const user =  await this.usersRepository.findOne(id)
      if(user !== undefined){
        return user;
      }
      else{
        return {
          name:"",
          email:"",
          password:""
        }
      }
    } catch (error) {
      return {
        name:"",
        email:"",
        password:""
      }
    }
  }

  findByEmail(email:string){
    try {
      const user = this.usersRepository.findOne({email})
      return user;
    } catch (error) {
      return {
        name:"",
        email:"",
        password:""
      }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = this.findOne(id);
      if(user !== undefined){
         const updated_user =  await this.usersRepository.update(id,updateUserDto);
         if(updated_user.hasOwnProperty('affected')){
            if(updated_user.affected === 1){
              return  this.findOne(id);
            }
         }
      }
      else{
        return {
          name:"",
          email:"",
          password:""
        }
      }
    } catch (error) {
      return {
        name:"",
        email:"",
        password:""
      }
    }
  }

  async remove(id: number) {
   try {
     const user =  await this.usersRepository.delete(id);
     if(user.hasOwnProperty('affected')){
       if(user.affected===1){
         return true
       }
       else{
         return false
       }
     }
   } catch (error) {
    return false
   }
  }
}
